use async_trait::async_trait;
use aws_sdk_s3::{
    Client as S3Client,
    config::{Credentials, Region},
    presigning::PresigningConfig,
};
use std::time::Duration;

pub struct StorageConfig {
    pub r2_account_id: String,
    pub r2_access_key_id: String,
    pub r2_secret_access_key: String,
    pub r2_bucket_name: String,
}

#[derive(Debug, thiserror::Error)]
pub enum StorageError {
    #[error("S3 operation failed: {0}")]
    S3Error(String),

    #[error("Invalid object key: {0}")]
    InvalidKey(String),

    #[error("Presigned URL generation failed: {0}")]
    PresignError(String),
}

#[async_trait]
pub trait StorageClient: Send + Sync {
    async fn generate_presigned_get_url(
        &self,
        object_key: &str,
        expires_in_secs: u64,
    ) -> Result<String, StorageError>;
}

pub struct R2Storage {
    client: S3Client,
    bucket_name: String,
}

impl R2Storage {
    pub fn new(config: &StorageConfig) -> Self {
        let client = create_r2_client(
            &config.r2_account_id,
            &config.r2_access_key_id,
            &config.r2_secret_access_key,
        );

        Self {
            client,
            bucket_name: config.r2_bucket_name.clone(),
        }
    }
}

#[async_trait]
impl StorageClient for R2Storage {
    async fn generate_presigned_get_url(
        &self,
        object_key: &str,
        expires_in_secs: u64,
    ) -> Result<String, StorageError> {
        if object_key.is_empty() {
            return Err(StorageError::InvalidKey(
                "Object key must not be empty".to_string(),
            ));
        }

        if object_key.starts_with('/') {
            return Err(StorageError::InvalidKey(
                "Object key must not start with /".to_string(),
            ));
        }

        let presigning_config = PresigningConfig::builder()
            .expires_in(Duration::from_secs(expires_in_secs))
            .build()
            .map_err(|e| StorageError::PresignError(e.to_string()))?;

        let presigned_request = self
            .client
            .get_object()
            .bucket(&self.bucket_name)
            .key(object_key)
            .presigned(presigning_config)
            .await
            .map_err(|e| StorageError::S3Error(e.to_string()))?;

        Ok(presigned_request.uri().to_string())
    }
}

pub fn create_r2_client(
    account_id: &str,
    access_key_id: &str,
    secret_access_key: &str,
) -> S3Client {
    let endpoint = format!("https://{}.r2.cloudflarestorage.com", account_id);

    let credentials = Credentials::new(access_key_id, secret_access_key, None, None, "r2_creds");

    let config = aws_sdk_s3::config::Config::builder()
        .credentials_provider(credentials)
        .endpoint_url(endpoint)
        .region(Region::new("auto"))
        .force_path_style(true)
        .behavior_version(aws_sdk_s3::config::BehaviorVersion::latest())
        .build();

    S3Client::from_conf(config)
}
