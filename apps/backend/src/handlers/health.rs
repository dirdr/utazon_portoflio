use axum::{Json, http::StatusCode};
use serde_json::{Value, json};

pub async fn health_handler() -> (StatusCode, Json<Value>) {
    tracing::info!("Health check endpoint called");

    let response = json!({
        "status": "healthy",
        "timestamp": chrono::Utc::now().to_rfc3339()
    });

    tracing::info!("Health check passed");

    (StatusCode::OK, Json(response))
}
