use axum::{
    Json,
    http::StatusCode,
    response::{IntoResponse, Response},
};
use serde_json::json;
use thiserror::Error;

use crate::common::infrastructure::storage::StorageError;

#[derive(Error, Debug)]
pub enum AppError {
    #[error("Validation error: {0}")]
    Validation(String),

    #[error("Discord API error: {0}")]
    DiscordApi(String),

    #[error("HTTP client error: {0}")]
    HttpClient(#[from] reqwest::Error),

    #[error("Storage error: {0}")]
    Storage(#[from] StorageError),
}

impl IntoResponse for AppError {
    fn into_response(self) -> Response {
        let (status, error_message) = match self {
            AppError::Validation(msg) => (StatusCode::BAD_REQUEST, msg),
            AppError::DiscordApi(msg) => {
                tracing::error!("Discord API error: {}", msg);
                (
                    StatusCode::INTERNAL_SERVER_ERROR,
                    "Failed to process request".to_string(),
                )
            }
            AppError::HttpClient(err) => {
                tracing::error!("HTTP client error: {}", err);
                (
                    StatusCode::INTERNAL_SERVER_ERROR,
                    "Failed to process request".to_string(),
                )
            }
            AppError::Storage(err) => {
                tracing::error!("Storage error: {}", err);
                (
                    StatusCode::INTERNAL_SERVER_ERROR,
                    "Failed to generate presigned URL".to_string(),
                )
            }
        };

        let body = Json(json!({
            "error": error_message,
        }));

        (status, body).into_response()
    }
}

pub type AppResult<T> = Result<T, AppError>;
