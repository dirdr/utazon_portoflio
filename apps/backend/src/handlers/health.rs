use axum::{Json, http::StatusCode};
use serde_json::{Value, json};

pub async fn health_handler() -> (StatusCode, Json<Value>) {
    let response = json!({
        "status": "healthy",
        "timestamp": chrono::Utc::now().to_rfc3339()
    });
    (StatusCode::OK, Json(response))
}
