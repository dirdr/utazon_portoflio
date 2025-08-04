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
    pub allowed_origins: Vec<String>,
    pub jwt_secret: String,
    pub auth_username: String,
    pub auth_password: String,
}

impl AppConfig {
    pub fn from_env() -> Result<Self> {
        dotenv().ok();

        let port = env::var("PORT")
            .map_err(|_| anyhow::anyhow!("PORT must be set"))?
            .parse()?;

        let minio_endpoint = env::var("MINIO_INTERNAL_ENDPOINT")
            .map_err(|_| anyhow::anyhow!("MINIO_INTERNAL_ENDPOINT must be set"))?;

        let minio_port = env::var("MINIO_INTERNAL_PORT")
            .map_err(|_| anyhow::anyhow!("MINIO_INTERNAL_PORT must be set"))?
            .parse()?;

        let minio_access_key = env::var("MINIO_ROOT_USER")
            .map_err(|_| anyhow::anyhow!("MINIO_ROOT_USER must be set"))?;

        let minio_secret_key = env::var("MINIO_ROOT_PASSWORD")
            .map_err(|_| anyhow::anyhow!("MINIO_ROOT_PASSWORD must be set"))?;

        let minio_bucket_name = env::var("MINIO_BUCKET_NAME")
            .map_err(|_| anyhow::anyhow!("MINIO_BUCKET_NAME must be set"))?;

        let allowed_origins = env::var("ALLOWED_ORIGINS")
            .map_err(|_| anyhow::anyhow!("ALLOWED_ORIGINS must be set"))?
            .split(',')
            .map(|s| s.trim().to_string())
            .collect();

        let jwt_secret =
            env::var("JWT_SECRET").map_err(|_| anyhow::anyhow!("JWT_SECRET must be set"))?;

        let auth_username =
            env::var("AUTH_USERNAME").map_err(|_| anyhow::anyhow!("AUTH_USERNAME must be set"))?;

        let auth_password =
            env::var("AUTH_PASSWORD").map_err(|_| anyhow::anyhow!("AUTH_PASSWORD must be set"))?;

        tracing::debug!("Loaded auth credentials - username: '{}', password: '{}'", auth_username, auth_password);

        Ok(Self {
            port,
            minio_endpoint,
            minio_port,
            minio_access_key,
            minio_secret_key,
            minio_bucket_name,
            allowed_origins,
            jwt_secret,
            auth_username,
            auth_password,
        })
    }
}
