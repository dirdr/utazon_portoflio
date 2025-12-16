use axum::{Router, routing::get};

use super::handler::health_handler;
use crate::common::AppState;

pub fn routes() -> Router<AppState> {
    Router::new().route("/health", get(health_handler))
}
