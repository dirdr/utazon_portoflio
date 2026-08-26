use axum::{
    Json,
    extract::{Query, State},
    http::StatusCode,
};
use serde::{Deserialize, Serialize};

use crate::common::{AppError, AppResult, AppState};

const DEFAULT_EXPIRATION_SECS: u64 = 600;

fn default_expiration() -> u64 {
    DEFAULT_EXPIRATION_SECS
}

struct ObjectKey(String);

impl TryFrom<String> for ObjectKey {
    type Error = String;
    fn try_from(s: String) -> Result<Self, Self::Error> {
        if s.is_empty() || s.len() > 1024 {
            Err("must be between 1 and 1024 characters".to_string())
        } else {
            Ok(ObjectKey(s))
        }
    }
}

impl AsRef<str> for ObjectKey {
    fn as_ref(&self) -> &str {
        &self.0
    }
}

struct ExpiresIn(u64);

impl TryFrom<u64> for ExpiresIn {
    type Error = String;
    fn try_from(n: u64) -> Result<Self, Self::Error> {
        if !(60..=3600).contains(&n) {
            Err("must be between 60 and 3600 seconds".to_string())
        } else {
            Ok(ExpiresIn(n))
        }
    }
}

#[derive(Debug, Deserialize)]
pub(crate) struct GetPresignedVideoUrlInput {
    object_key: String,
    #[serde(default = "default_expiration")]
    expires_in: u64,
}

struct GetPresignedVideoUrlQuery {
    object_key: ObjectKey,
    expires_in: ExpiresIn,
}

impl TryFrom<GetPresignedVideoUrlInput> for GetPresignedVideoUrlQuery {
    type Error = AppError;
    fn try_from(input: GetPresignedVideoUrlInput) -> Result<Self, Self::Error> {
        Ok(GetPresignedVideoUrlQuery {
            object_key: ObjectKey::try_from(input.object_key)
                .map_err(|e| AppError::Validation(format!("object_key: {e}")))?,
            expires_in: ExpiresIn::try_from(input.expires_in)
                .map_err(|e| AppError::Validation(format!("expires_in: {e}")))?,
        })
    }
}

#[derive(Debug, Serialize)]
pub struct PresignedUrlResponse {
    pub url: String,
    pub expires_in: u64,
}

#[tracing::instrument(skip(state), fields(object_key = %input.object_key))]
pub async fn video_handler(
    Query(input): Query<GetPresignedVideoUrlInput>,
    State(state): State<AppState>,
) -> AppResult<(StatusCode, Json<PresignedUrlResponse>)> {
    tracing::info!("Generating presigned URL");

    let params = GetPresignedVideoUrlQuery::try_from(input)?;

    let url = state
        .storage
        .generate_presigned_get_url(params.object_key.as_ref(), params.expires_in.0)
        .await?;

    tracing::info!("Presigned URL generated successfully");

    Ok((
        StatusCode::OK,
        Json(PresignedUrlResponse {
            url,
            expires_in: params.expires_in.0,
        }),
    ))
}

#[cfg(test)]
mod tests {
    use super::*;

    fn valid_input() -> GetPresignedVideoUrlInput {
        GetPresignedVideoUrlInput {
            object_key: "videos/sample.mp4".to_string(),
            expires_in: 600,
        }
    }

    #[test]
    fn test_valid_query() {
        assert!(GetPresignedVideoUrlQuery::try_from(valid_input()).is_ok());
    }

    #[test]
    fn test_empty_object_key() {
        let input = GetPresignedVideoUrlInput {
            object_key: "".to_string(),
            ..valid_input()
        };
        assert!(GetPresignedVideoUrlQuery::try_from(input).is_err());
    }

    #[test]
    fn test_object_key_too_long() {
        let input = GetPresignedVideoUrlInput {
            object_key: "a".repeat(1025),
            ..valid_input()
        };
        assert!(GetPresignedVideoUrlQuery::try_from(input).is_err());
    }

    #[test]
    fn test_expiration_too_short() {
        let input = GetPresignedVideoUrlInput {
            expires_in: 30,
            ..valid_input()
        };
        assert!(GetPresignedVideoUrlQuery::try_from(input).is_err());
    }

    #[test]
    fn test_expiration_too_long() {
        let input = GetPresignedVideoUrlInput {
            expires_in: 7200,
            ..valid_input()
        };
        assert!(GetPresignedVideoUrlQuery::try_from(input).is_err());
    }

    #[test]
    fn test_default_expiration() {
        assert_eq!(default_expiration(), 600);
    }
}
