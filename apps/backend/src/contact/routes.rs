use axum::{Router, routing::post};

use crate::common::AppState;
use crate::contact::handler::contact_handler;

pub fn contact_routes() -> Router<AppState> {
    Router::new().route("/contact", post(contact_handler))
}
