use crate::common::AppResult;

pub struct GetPresignedVideoUrl {
    pub video_path: String,
    pub bucket: String,
}

#[allow(dead_code)]
trait PresignVideoUrl {
    async fn presign_video_url(&self, request: GetPresignedVideoUrl) -> AppResult<String>;
}
