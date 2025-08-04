use axum::{extract::State, http::StatusCode, Json};
use serde_json::{json, Value};

use crate::services::minio::MinioService;

pub async fn health_handler(State(minio_service): State<MinioService>) -> (StatusCode, Json<Value>) {
    let health = minio_service.health_check().await;
    
    let status_code = if health.status == "healthy" {
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

    (status_code, Json(response))
}