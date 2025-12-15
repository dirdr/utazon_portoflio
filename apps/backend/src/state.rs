use std::sync::Arc;
use std::time::SystemTime;

use crate::config::AppConfig;

#[derive(Clone)]
pub struct AppState {
    pub config: PublicConfig,
    pub secrets: Arc<Secrets>,
    pub http_client: reqwest::Client,
    pub start_time: SystemTime,
}

#[derive(Clone, Debug)]
pub struct PublicConfig {
    pub discord_user_ids: Vec<String>,
}

#[derive(Debug)]
pub struct Secrets {
    pub discord_bot_token: String,
}

impl AppState {
    pub fn new(config: AppConfig) -> Self {
        let http_client = reqwest::Client::builder()
            .timeout(std::time::Duration::from_secs(10))
            .build()
            .expect("Failed to create HTTP client");

        Self {
            config: PublicConfig {
                discord_user_ids: config.discord_user_ids,
            },
            secrets: Arc::new(Secrets {
                discord_bot_token: config.discord_bot_token,
            }),
            http_client,
            start_time: SystemTime::now(),
        }
    }
}
