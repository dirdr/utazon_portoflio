use axum::{Router, routing::get};

use crate::common::AppState;
use super::handler::health_handler;

pub fn routes() -> Router<AppState> {
    Router::new().route("/health", get(health_handler))
}
