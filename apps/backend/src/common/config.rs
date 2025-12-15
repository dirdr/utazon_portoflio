use anyhow::Result;
use dotenvy::dotenv;
use std::env;

#[derive(Debug, Clone)]
pub struct AppConfig {
    pub port: u16,
    pub allowed_origins: Vec<String>,
    pub discord_bot_token: String,
    pub discord_user_ids: Vec<String>,
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

        Ok(Self {
            port,
            allowed_origins,
            discord_bot_token,
            discord_user_ids,
        })
    }
}
