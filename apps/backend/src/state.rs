use crate::{config::AppConfig, services::minio::MinioService};

#[derive(Clone)]
pub struct AppState {
    pub minio_service: MinioService,
    pub config: AppConfig,
}

impl AppState {
    pub fn new(minio_service: MinioService, config: AppConfig) -> Self {
        Self {
            minio_service,
            config,
        }
    }
}
