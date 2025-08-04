use axum::{
    Json, Router,
    body::Body,
    extract::{Path, State},
    http::{HeaderMap, HeaderValue, StatusCode, header},
    response::Response,
    routing::get,
};
use serde_json::json;
use tokio_util::io::ReaderStream;

use crate::services::minio::MinioService;

pub fn video_routes() -> Router<MinioService> {
    Router::new()
        .route("/", get(list_videos_handler))
        .route("/{*video_path}", get(stream_video_handler))
}

pub async fn list_videos_handler(
    State(minio_service): State<MinioService>,
) -> Result<Json<serde_json::Value>, (StatusCode, Json<serde_json::Value>)> {
    match minio_service.list_videos().await {
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
    State(minio_service): State<MinioService>,
    Path(video_path): Path<String>,
    headers: HeaderMap,
) -> Result<Response, (StatusCode, Json<serde_json::Value>)> {
    // Validate video path
    if video_path.is_empty() || video_path.contains("..") {
        return Err((
            StatusCode::BAD_REQUEST,
            Json(json!({
                "error": "Bad Request",
                "message": "Invalid video path",
                "code": "INVALID_VIDEO_PATH"
            })),
        ));
    }

    let object_name = format!("videos/{}", video_path);

    let (file_size, _content_type) = match minio_service.get_object_metadata(&object_name).await {
        Ok(metadata) => metadata,
        Err(e) => {
            tracing::error!("Failed to get object metadata: {}", e);
            return Err((
                StatusCode::NOT_FOUND,
                Json(json!({
                    "error": "Not Found",
                    "message": "Video not found",
                    "code": "VIDEO_NOT_FOUND"
                })),
            ));
        }
    };

    // Determine content type based on file extension
    let content_type = get_content_type(&video_path);

    // Parse range header
    let range_header = headers.get(header::RANGE);
    let (start, end, partial_content) = if let Some(range) = range_header {
        match parse_range_header(range, file_size as u64) {
            Ok((start, end)) => (start, end, true),
            Err(_) => (0, file_size as u64 - 1, false),
        }
    } else {
        (0, file_size as u64 - 1, false)
    };

    let content_length = end - start + 1;

    // Get the stream
    let byte_stream = match minio_service
        .get_object_stream_with_range(&object_name, start, end)
        .await
    {
        Ok(stream) => stream,
        Err(e) => {
            tracing::error!("Failed to get object stream: {}", e);
            return Err((
                StatusCode::INTERNAL_SERVER_ERROR,
                Json(json!({
                    "error": "Internal Server Error",
                    "message": "Failed to stream video",
                    "code": "VIDEO_STREAM_FAILED"
                })),
            ));
        }
    };

    // Convert ByteStream to Body using the stream adapter
    let reader_stream = ReaderStream::new(byte_stream.into_async_read());
    let body = Body::from_stream(reader_stream);

    // Build response
    let mut response = Response::builder()
        .header(header::CONTENT_TYPE, content_type)
        .header(header::ACCEPT_RANGES, "bytes")
        .header(header::CONTENT_LENGTH, content_length.to_string())
        .header(header::CACHE_CONTROL, "public, max-age=3600")
        .header(header::ACCESS_CONTROL_ALLOW_ORIGIN, "*")
        .header(header::ACCESS_CONTROL_ALLOW_METHODS, "GET, HEAD, OPTIONS")
        .header(
            header::ACCESS_CONTROL_ALLOW_HEADERS,
            "Range, Content-Range, Content-Type",
        )
        .header(
            header::ACCESS_CONTROL_EXPOSE_HEADERS,
            "Content-Range, Content-Length, Accept-Ranges",
        );

    if partial_content {
        response = response.status(StatusCode::PARTIAL_CONTENT).header(
            header::CONTENT_RANGE,
            format!("bytes {}-{}/{}", start, end, file_size),
        );
    } else {
        response = response.status(StatusCode::OK);
    }

    // Add Firefox-specific headers for WebM streaming
    if video_path.to_lowercase().ends_with(".webm") {
        response = response
            .header("X-Content-Type-Options", "nosniff")
            .header(header::CONNECTION, "keep-alive");
    }

    Ok(response.body(body).unwrap())
}

fn get_content_type(filename: &str) -> &'static str {
    let ext = filename.to_lowercase();
    if ext.ends_with(".mp4") {
        "video/mp4"
    } else if ext.ends_with(".webm") {
        "video/webm"
    } else if ext.ends_with(".avi") {
        "video/x-msvideo"
    } else if ext.ends_with(".mov") {
        "video/quicktime"
    } else if ext.ends_with(".mkv") {
        "video/x-matroska"
    } else {
        "video/mp4" // Default fallback
    }
}

fn parse_range_header(range_header: &HeaderValue, file_size: u64) -> Result<(u64, u64), ()> {
    let range_str = range_header.to_str().map_err(|_| ())?;

    if !range_str.starts_with("bytes=") {
        return Err(());
    }

    let range_part = &range_str[6..]; // Remove "bytes="
    let parts: Vec<&str> = range_part.split('-').collect();

    if parts.len() != 2 {
        return Err(());
    }

    let start = if parts[0].is_empty() {
        0
    } else {
        parts[0].parse::<u64>().map_err(|_| ())?
    };

    let end = if parts[1].is_empty() {
        file_size - 1
    } else {
        parts[1].parse::<u64>().map_err(|_| ())?
    };

    if start > end || end >= file_size {
        return Err(());
    }

    Ok((start, end))
}

