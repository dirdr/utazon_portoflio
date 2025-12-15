use axum::{Router, routing::post};

use crate::{handlers::contact::contact_handler, state::AppState};

pub fn contact_routes() -> Router<AppState> {
    Router::new().route("/contact", post(contact_handler))
}
