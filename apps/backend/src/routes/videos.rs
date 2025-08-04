use axum::{
    Json, Router,
    body::Body,
    extract::{Path, State},
    http::{HeaderMap, HeaderValue, StatusCode, header},
    response::Response,
    routing::get,
};
use mime_guess::from_path;
use serde_json::json;
use tokio_util::io::ReaderStream;

use crate::{middleware::jwt::jwt_middleware, state::AppState};

#[derive(Debug)]
struct StreamError {
    status: StatusCode,
    message: &'static str,
    code: &'static str,
}

impl StreamError {
    fn not_found() -> Self {
        Self {
            status: StatusCode::NOT_FOUND,
            message: "Video not found",
            code: "VIDEO_NOT_FOUND",
        }
    }

    fn bad_request() -> Self {
        Self {
            status: StatusCode::BAD_REQUEST,
            message: "Invalid video path",
            code: "INVALID_VIDEO_PATH",
        }
    }

    fn internal_error() -> Self {
        Self {
            status: StatusCode::INTERNAL_SERVER_ERROR,
            message: "Failed to stream video",
            code: "VIDEO_STREAM_FAILED",
        }
    }

    fn into_response(self) -> (StatusCode, Json<serde_json::Value>) {
        (
            self.status,
            Json(json!({
                "error": match self.status {
                    StatusCode::NOT_FOUND => "Not Found",
                    StatusCode::BAD_REQUEST => "Bad Request",
                    _ => "Internal Server Error",
                },
                "message": self.message,
                "code": self.code
            })),
        )
    }
}

pub fn video_routes() -> Router<AppState> {
    Router::new()
        .route("/", get(list_videos_handler))
        .route("/{*video_path}", get(stream_video_handler))
        .route_layer(axum::middleware::from_fn(jwt_middleware))
}

pub async fn list_videos_handler(
    State(app_state): State<AppState>,
) -> Result<Json<serde_json::Value>, (StatusCode, Json<serde_json::Value>)> {
    match app_state.minio_service.list_videos().await {
        Ok(videos) => Ok(Json(json!({
            "videos": videos,
            "count": videos.len()
        }))),
        Err(e) => {
            tracing::error!("Failed to list videos: {}", e);
            Err((
                StatusCode::INTERNAL_SERVER_ERROR,
                Json(json!({
                    "error": "Internal Server Error",
                    "message": "Failed to list videos",
                    "code": "VIDEO_LIST_FAILED"
                })),
            ))
        }
    }
}

pub async fn stream_video_handler(
    State(app_state): State<AppState>,
    Path(video_path): Path<String>,
    headers: HeaderMap,
) -> Result<Response, (StatusCode, Json<serde_json::Value>)> {
    if video_path.is_empty() || video_path.contains("..") {
        return Err(StreamError::bad_request().into_response());
    }

    let object_name = format!("videos/{video_path}");

    let (file_size, _content_type) = match app_state.minio_service.get_object_metadata(&object_name).await {
        Ok(metadata) => metadata,
        Err(e) => {
            tracing::error!("Failed to get object metadata: {}", e);
            return Err(StreamError::not_found().into_response());
        }
    };

    let content_type = from_path(&video_path).first_or_octet_stream();

    let range_header = headers.get(header::RANGE);
    let (start, end, partial_content) = if let Some(range) = range_header {
        match parse_range_header(range, file_size as u64) {
            Ok((start, end)) => (start, end, true),
            Err(_) => {
                tracing::warn!("Invalid range header for {}: {:?}", video_path, range);
                (0, file_size as u64 - 1, false)
            },
        }
    } else {
        (0, file_size as u64 - 1, false)
    };

    let content_length = end - start + 1;

    let byte_stream = match app_state.minio_service
        .get_object_stream_with_range(&object_name, start, end)
        .await
    {
        Ok(stream) => stream,
        Err(e) => {
            tracing::error!("Failed to get object stream: {}", e);
            return Err(StreamError::internal_error().into_response());
        }
    };

    let reader_stream = ReaderStream::new(byte_stream.into_async_read());
    let body = Body::from_stream(reader_stream);

    let mut response = Response::builder()
        .header(header::CONTENT_TYPE, content_type.to_string())
        .header(header::ACCEPT_RANGES, "bytes")
        .header(header::CONTENT_LENGTH, content_length.to_string())
        .header(header::CACHE_CONTROL, "public, max-age=3600");

    if partial_content {
        response = response.status(StatusCode::PARTIAL_CONTENT).header(
            header::CONTENT_RANGE,
            format!("bytes {start}-{end}/{file_size}"),
        );
    } else {
        response = response.status(StatusCode::OK);
    }

    Ok(response.body(body).unwrap())
}

fn parse_range_header(range_header: &HeaderValue, file_size: u64) -> Result<(u64, u64), ()> {
    let range_str = range_header.to_str().map_err(|_| ())?;

    let range_part = range_str.strip_prefix("bytes=").ok_or(())?;
    let (start_str, end_str) = range_part.split_once('-').ok_or(())?;

    let start = if start_str.is_empty() {
        0
    } else {
        start_str.parse().map_err(|_| ())?
    };
    let end = if end_str.is_empty() {
        file_size - 1
    } else {
        end_str.parse().map_err(|_| ())?
    };

    if start > end || end >= file_size {
        return Err(());
    }

    Ok((start, end))
}
