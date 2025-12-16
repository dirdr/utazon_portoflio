use axum::{
    Json,
    extract::{Query, State},
    http::StatusCode,
};
use garde::Validate;
use serde::{Deserialize, Serialize};

use crate::common::{AppResult, AppState, validate};

const DEFAULT_EXPIRATION_SECS: u64 = 600;

fn default_expiration() -> u64 {
    DEFAULT_EXPIRATION_SECS
}

#[derive(Debug, Deserialize, Validate)]
pub struct GetPresignedVideoUrlQuery {
    #[garde(length(min = 1, max = 1024))]
    pub object_key: String,

    #[garde(range(min = 60, max = 3600))]
    #[serde(default = "default_expiration")]
    pub expires_in: u64,
}

#[derive(Debug, Serialize)]
pub struct PresignedUrlResponse {
    pub url: String,
    pub expires_in: u64,
}

#[tracing::instrument(skip(state), fields(object_key = %params.object_key))]
pub async fn video_handler(
    Query(params): Query<GetPresignedVideoUrlQuery>,
    State(state): State<AppState>,
) -> AppResult<(StatusCode, Json<PresignedUrlResponse>)> {
    tracing::info!("Generating presigned URL");

    validate(&params)?;

    let url = state
        .storage
        .generate_presigned_get_url(&params.object_key, params.expires_in)
        .await?;

    tracing::info!("Presigned URL generated successfully");

    Ok((
        StatusCode::OK,
        Json(PresignedUrlResponse {
            url,
            expires_in: params.expires_in,
        }),
    ))
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_validate_valid_query() {
        let query = GetPresignedVideoUrlQuery {
            object_key: "videos/sample.mp4".to_string(),
            expires_in: 600,
        };
        assert!(validate(&query).is_ok());
    }

    #[test]
    fn test_validate_invalid_object_key_empty() {
        let query = GetPresignedVideoUrlQuery {
            object_key: "".to_string(),
            expires_in: 600,
        };
        assert!(validate(&query).is_err());
    }

    #[test]
    fn test_validate_object_key_too_long() {
        let query = GetPresignedVideoUrlQuery {
            object_key: "a".repeat(1025),
            expires_in: 600,
        };
        assert!(validate(&query).is_err());
    }

    #[test]
    fn test_validate_expiration_too_short() {
        let query = GetPresignedVideoUrlQuery {
            object_key: "video.mp4".to_string(),
            expires_in: 30,
        };
        assert!(validate(&query).is_err());
    }

    #[test]
    fn test_validate_expiration_too_long() {
        let query = GetPresignedVideoUrlQuery {
            object_key: "video.mp4".to_string(),
            expires_in: 7200,
        };
        assert!(validate(&query).is_err());
    }

    #[test]
    fn test_default_expiration() {
        assert_eq!(default_expiration(), 600);
    }
}
