use anyhow::Result;
use dotenvy::dotenv;
use std::env;

#[derive(Debug, Clone)]
pub struct AppConfig {
    pub port: u16,
    pub minio_endpoint: String,
    pub minio_port: u16,
    pub minio_access_key: String,
    pub minio_secret_key: String,
    pub minio_bucket_name: String,
    pub minio_use_ssl: bool,
    pub allowed_origins: Vec<String>,
}

impl AppConfig {
    pub fn from_env() -> Result<Self> {
        dotenv().ok();

        let port = env::var("PORT")
            .unwrap_or_else(|_| "3001".to_string())
            .parse()?;

        let minio_endpoint = env::var("MINIO_ENDPOINT")
            .or_else(|_| env::var("MINIO_INTERNAL_ENDPOINT"))
            .map_err(|_| {
                anyhow::anyhow!("MINIO_ENDPOINT or MINIO_INTERNAL_ENDPOINT must be set")
            })?;

        let minio_port = env::var("MINIO_PORT")
            .or_else(|_| env::var("MINIO_INTERNAL_PORT"))
            .unwrap_or_else(|_| "9000".to_string())
            .parse()?;

        let minio_access_key = env::var("MINIO_ROOT_USER")
            .map_err(|_| anyhow::anyhow!("MINIO_ROOT_USER must be set"))?;

        let minio_secret_key = env::var("MINIO_ROOT_PASSWORD")
            .map_err(|_| anyhow::anyhow!("MINIO_ROOT_PASSWORD must be set"))?;

        let minio_bucket_name = env::var("MINIO_BUCKET_NAME")
            .map_err(|_| anyhow::anyhow!("MINIO_BUCKET_NAME must be set"))?;

        // Use SSL for external endpoints, not for internal ones
        let minio_use_ssl = env::var("MINIO_INTERNAL_ENDPOINT").is_err();

        let allowed_origins = env::var("ALLOWED_ORIGINS")
            .unwrap_or_else(|_| "http://localhost:5173,http://localhost:3000".to_string())
            .split(',')
            .map(|s| s.trim().to_string())
            .collect();

        Ok(Self {
            port,
            minio_endpoint,
            minio_port,
            minio_access_key,
            minio_secret_key,
            minio_bucket_name,
            minio_use_ssl,
            allowed_origins,
        })
    }
}

