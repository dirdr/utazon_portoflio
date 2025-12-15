use axum::{
    Json,
    Router,
    extract::State,
    http::StatusCode,
    routing::get,
};
use serde_json::{Value, json};

use crate::common::AppState;

/// Health check handler
pub async fn health_handler(State(state): State<AppState>) -> (StatusCode, Json<Value>) {
    let uptime_secs = state.start_time.elapsed().map(|d| d.as_secs()).unwrap_or(0);

    let response = json!({
        "status": "healthy",
        "version": env!("CARGO_PKG_VERSION"),
        "uptime_seconds": uptime_secs,
        "timestamp": chrono::Utc::now().to_rfc3339()
    });
    (StatusCode::OK, Json(response))
}

/// Health feature routes
pub fn routes() -> Router<AppState> {
    Router::new().route("/health", get(health_handler))
}
