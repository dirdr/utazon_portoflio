use anyhow::Result;
use dotenvy::dotenv;
use std::{env, sync::Arc};

use crate::common::infrastructure::storage::StorageConfig;

#[derive(Clone)]
pub struct AppConfig {
    pub port: u16,
    pub allowed_origins: Vec<String>,
    pub discord_bot_token: String,
    pub discord_user_ids: Vec<String>,
    pub storage_config: Arc<StorageConfig>,
}

impl AppConfig {
    pub fn from_env() -> Result<Self> {
        dotenv().ok();

        let port = env::var("PORT")
            .map_err(|_| anyhow::anyhow!("PORT must be set"))?
            .parse()?;

        let allowed_origins = env::var("ALLOWED_ORIGINS")
            .map_err(|_| anyhow::anyhow!("ALLOWED_ORIGINS must be set"))?
            .split(',')
            .map(|s| s.trim().to_string())
            .collect();

        let discord_bot_token = env::var("DISCORD_BOT_TOKEN")
            .map_err(|_| anyhow::anyhow!("DISCORD_BOT_TOKEN must be set"))?;

        let discord_user_ids = env::var("DISCORD_USER_IDS")
            .map_err(|_| anyhow::anyhow!("DISCORD_USER_IDS must be set"))?
            .split(',')
            .map(|s| s.trim().to_string())
            .filter(|s| !s.is_empty())
            .collect();

        let r2_account_id =
            env::var("R2_ACCOUNT_ID").map_err(|_| anyhow::anyhow!("R2_ACCOUNT_ID must be set"))?;

        let r2_access_key_id = env::var("R2_ACCESS_KEY_ID")
            .map_err(|_| anyhow::anyhow!("R2_ACCESS_KEY_ID must be set"))?;

        let r2_secret_access_key = env::var("R2_SECRET_ACCESS_KEY")
            .map_err(|_| anyhow::anyhow!("R2_SECRET_ACCESS_KEY must be set"))?;

        let r2_bucket_name = env::var("R2_BUCKET_NAME")
            .map_err(|_| anyhow::anyhow!("R2_BUCKET_NAME must be set"))?;

        Ok(Self {
            port,
            allowed_origins,
            discord_bot_token,
            discord_user_ids,
            storage_config: Arc::new(StorageConfig {
                r2_account_id,
                r2_access_key_id,
                r2_secret_access_key,
                r2_bucket_name,
            }),
        })
    }
}
