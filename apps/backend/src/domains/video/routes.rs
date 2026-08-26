use axum::{Router, routing::get};

use crate::{common::AppState, domains::video::handler::video_handler};

pub fn video_routes() -> Router<AppState> {
    Router::new().route("/video", get(video_handler))
}
