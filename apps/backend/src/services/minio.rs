use anyhow::Result;
use aws_sdk_s3::{
    Client as S3Client, Config,
    config::{Credentials, Region, SharedCredentialsProvider},
    primitives::ByteStream,
};
use serde::{Deserialize, Serialize};

use crate::config::AppConfig;

#[derive(Debug, Clone)]
pub struct MinioService {
    client: S3Client,
    bucket_name: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct VideoObject {
    pub name: String,
    pub size: i64,
    pub last_modified: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct HealthStatus {
    pub status: String,
    pub bucket_exists: bool,
    pub bucket_name: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub error: Option<String>,
}

impl MinioService {
    pub async fn new(config: &AppConfig) -> Result<Self> {
        let credentials = Credentials::new(
            &config.minio_access_key,
            &config.minio_secret_key,
            None,
            None,
            "minio",
        );

        let protocol = "http";

        let endpoint_url = format!(
            "{protocol}://{}:{}",
            config.minio_endpoint, config.minio_port
        );

        tracing::info!(
            "Configuring MinIO client - endpoint: {}, bucket: {}, user: {}",
            endpoint_url,
            config.minio_bucket_name,
            config.minio_access_key
        );

        let s3_config = Config::builder()
            .credentials_provider(SharedCredentialsProvider::new(credentials))
            .endpoint_url(&endpoint_url)
            .region(Some(Region::new("us-east-1")))
            .force_path_style(true)
            .build();

        let client = S3Client::from_conf(s3_config);

        Ok(Self {
            client,
            bucket_name: config.minio_bucket_name.clone(),
        })
    }

    pub async fn health_check(&self) -> HealthStatus {
        tracing::debug!(
            "Performing MinIO health check for bucket: {}",
            self.bucket_name
        );

        match self
            .client
            .head_bucket()
            .bucket(&self.bucket_name)
            .send()
            .await
        {
            Ok(_) => {
                tracing::debug!(
                    "MinIO health check successful - bucket '{}' exists and is accessible",
                    self.bucket_name
                );
                HealthStatus {
                    status: "healthy".to_string(),
                    bucket_exists: true,
                    bucket_name: self.bucket_name.clone(),
                    error: None,
                }
            }
            Err(e) => {
                let error_string = e.to_string();
                tracing::error!(
                    "MinIO health check failed for bucket '{}': (Error details: {:?})",
                    self.bucket_name,
                    e.into_source()
                );
                HealthStatus {
                    status: "unhealthy".to_string(),
                    bucket_exists: false,
                    bucket_name: self.bucket_name.clone(),
                    error: Some(error_string),
                }
            }
        }
    }

    pub async fn list_videos(&self) -> Result<Vec<VideoObject>> {
        let mut objects = Vec::new();
        let mut continuation_token = None;

        loop {
            let mut request = self
                .client
                .list_objects_v2()
                .bucket(&self.bucket_name)
                .prefix("videos/");

            if let Some(token) = continuation_token {
                request = request.continuation_token(token);
            }

            let response = request.send().await?;

            let contents = response.contents();
            for object in contents {
                if let (Some(key), Some(size), Some(last_modified)) =
                    (object.key(), object.size(), object.last_modified())
                {
                    objects.push(VideoObject {
                        name: key.to_string(),
                        size,
                        last_modified: last_modified.to_string(),
                    });
                }
            }

            if response.is_truncated().unwrap_or(false) {
                continuation_token = response.next_continuation_token().map(|s| s.to_string());
            } else {
                break;
            }
        }

        Ok(objects)
    }

    pub async fn get_object_metadata(&self, object_name: &str) -> Result<(i64, String)> {
        let response = self
            .client
            .head_object()
            .bucket(&self.bucket_name)
            .key(object_name)
            .send()
            .await?;

        let size = response.content_length().unwrap_or(0);
        let content_type = response
            .content_type()
            .unwrap_or("application/octet-stream")
            .to_string();

        Ok((size, content_type))
    }

    pub async fn get_object_stream_with_range(
        &self,
        object_name: &str,
        start: u64,
        end: u64,
    ) -> Result<ByteStream> {
        let range = format!("bytes={start}-{end}");

        let response = self
            .client
            .get_object()
            .bucket(&self.bucket_name)
            .key(object_name)
            .range(range)
            .send()
            .await?;

        Ok(response.body)
    }
}
