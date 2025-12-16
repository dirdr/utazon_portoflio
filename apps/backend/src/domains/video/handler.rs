use axum::{
    Json,
    extract::{Query, State},
};
use reqwest::StatusCode;
use serde::{Deserialize, Serialize};
use serde_json::Value;

use crate::{common::AppState, domains::video::GetPresignedVideoUrl};

#[derive(Debug, Deserialize, Serialize)]
pub struct GetPresignedVideoUrlQuery {
    pub video_path: String,
    pub bucket: String,
}

pub async fn video_handler(
    Query(_params): Query<GetPresignedVideoUrlQuery>,
    State(_state): State<AppState>,
) -> (StatusCode, Json<Value>) {
    todo!()
}

impl From<GetPresignedVideoUrlQuery> for GetPresignedVideoUrl {
    fn from(value: GetPresignedVideoUrlQuery) -> Self {
        GetPresignedVideoUrl {
            video_path: value.video_path,
            bucket: value.bucket,
        }
    }
}
