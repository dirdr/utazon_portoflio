use axum::{extract::State, http::StatusCode, Json};
use serde_json::{json, Value};

use crate::state::AppState;

pub async fn health_handler(State(app_state): State<AppState>) -> (StatusCode, Json<Value>) {
    tracing::info!("Health check endpoint called");
    
    let health = app_state.minio_service.health_check().await;
    
    let status_code = if health.status == "healthy" {
        tracing::info!("Health check passed - bucket '{}' is accessible", health.bucket_name);
        StatusCode::OK
    } else {
        tracing::error!("Health check failed for bucket '{}': {:?}", health.bucket_name, health.error);
        StatusCode::SERVICE_UNAVAILABLE
    };

    let response = json!({
        "status": health.status,
        "bucket_exists": health.bucket_exists,
        "bucket_name": health.bucket_name,
        "error": health.error,
        "timestamp": chrono::Utc::now().to_rfc3339()
    });

    tracing::info!("Health check response: status={}, code={}", health.status, status_code.as_u16());

    (status_code, Json(response))
}