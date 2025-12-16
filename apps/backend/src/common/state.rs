use std::sync::Arc;
use std::time::SystemTime;

use crate::common::config::AppConfig;
use crate::common::infrastructure::storage::{R2Storage, StorageClient};
use crate::domains::contact::service::{DiscordNotifier, Notification};

#[derive(Clone)]
pub struct AppState {
    pub config: Arc<PublicConfig>,
    pub secrets: Arc<Secrets>,
    pub http_client: reqwest::Client,
    pub start_time: SystemTime,
    pub storage: Arc<dyn StorageClient>,
    pub notifier: Arc<dyn Notification>,
}

pub struct PublicConfig {
    pub discord_user_ids: Vec<String>,
    pub r2_account_id: String,
}

pub struct Secrets {
    pub discord_bot_token: String,
    pub r2_access_key_id: String,
    pub r2_secret_access_key: String,
}

impl AppState {
    pub fn new(config: AppConfig) -> Self {
        let http_client = reqwest::Client::builder()
            .timeout(std::time::Duration::from_secs(10))
            .build()
            .expect("Failed to create HTTP client");

        // Initialize storage service
        let storage = Arc::new(R2Storage::new(&config.storage_config));

        // Initialize notifier service
        let notifier = Arc::new(DiscordNotifier::new(
            http_client.clone(),
            config.discord_bot_token.clone(),
            config.discord_user_ids.clone(),
        ));

        Self {
            config: Arc::new(PublicConfig {
                discord_user_ids: config.discord_user_ids,
                r2_account_id: config.storage_config.r2_account_id.clone(),
            }),
            secrets: Arc::new(Secrets {
                discord_bot_token: config.discord_bot_token,
                r2_access_key_id: config.storage_config.r2_access_key_id.clone(),
                r2_secret_access_key: config.storage_config.r2_secret_access_key.clone(),
            }),
            http_client,
            start_time: SystemTime::now(),
            storage,
            notifier,
        }
    }
}
