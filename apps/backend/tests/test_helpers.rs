use async_trait::async_trait;
use axum::{
    Router,
    body::Body,
    http::{Method, Request, header},
};
use std::sync::Arc;
use tower::ServiceExt;

use utazon_backend::common::infrastructure::storage::{StorageClient, StorageError};
use utazon_backend::common::{AppError, AppResult, AppState, PublicConfig, Secrets};
use utazon_backend::domains::contact::service::Notification;

#[derive(Clone)]
pub struct MockStorage {
    pub should_fail: bool,
}

impl MockStorage {
    pub fn new() -> Self {
        Self { should_fail: false }
    }

    #[allow(dead_code)]
    pub fn with_failure() -> Self {
        Self { should_fail: true }
    }
}

impl Default for MockStorage {
    fn default() -> Self {
        Self::new()
    }
}

#[async_trait]
impl StorageClient for MockStorage {
    async fn generate_presigned_get_url(
        &self,
        object_key: &str,
        expires_in_secs: u64,
    ) -> Result<String, StorageError> {
        if self.should_fail {
            return Err(StorageError::S3Error("Mock storage error".to_string()));
        }

        Ok(format!(
            "https://mock-r2.com/{}?expires={}",
            object_key, expires_in_secs
        ))
    }
}

#[derive(Clone)]
pub struct MockNotifier {
    pub should_fail: bool,
}

impl MockNotifier {
    pub fn new() -> Self {
        Self { should_fail: false }
    }

    #[allow(dead_code)]
    pub fn with_failure() -> Self {
        Self { should_fail: true }
    }
}

impl Default for MockNotifier {
    fn default() -> Self {
        Self::new()
    }
}

#[async_trait]
impl Notification for MockNotifier {
    async fn notify(&self, _message: String) -> AppResult<()> {
        if self.should_fail {
            return Err(AppError::DiscordApi("Mock notifier error".to_string()));
        }
        Ok(())
    }
}

pub fn create_test_app() -> Router {
    let http_client = reqwest::Client::builder()
        .timeout(std::time::Duration::from_secs(10))
        .build()
        .expect("Failed to create HTTP client");

    let storage = Arc::new(MockStorage::new());
    let notifier = Arc::new(MockNotifier::new());

    let app_state = AppState {
        config: Arc::new(PublicConfig {
            discord_user_ids: vec!["test_user_id".to_string()],
            r2_account_id: "test_account_id".to_string(),
        }),
        secrets: Arc::new(Secrets {
            discord_bot_token: "test_token".to_string(),
            r2_access_key_id: "test_access_key_id".to_string(),
            r2_secret_access_key: "test_secret_access_key".to_string(),
        }),
        http_client,
        start_time: std::time::SystemTime::now(),
        storage,
        notifier,
    };

    create_app_with_state(app_state)
}

fn create_app_with_state(app_state: AppState) -> Router {
    use axum::{
        Json,
        extract::DefaultBodyLimit,
        http::{HeaderValue, header},
        routing::get,
    };
    use serde_json::{Value, json};
    use tower::ServiceBuilder;
    use tower_http::{cors::CorsLayer, trace::TraceLayer};

    const API_VERSION: &str = "v1";

    async fn root_handler() -> Json<Value> {
        Json(json!({
            "message": "Utazon Portfolio Backend API",
            "version": env!("CARGO_PKG_VERSION"),
            "api_version": API_VERSION,
            "endpoints": {
                "health": format!("GET /api/{}/health", API_VERSION),
                "contact": format!("POST /api/{}/contact - submit contact form", API_VERSION),
                "video": format!("GET /api/{}/video?object_key=<key>&expires_in=<seconds> - generate presigned URL", API_VERSION),
            },
            "timestamp": chrono::Utc::now().to_rfc3339()
        }))
    }

    let api_routes = Router::new()
        .merge(utazon_backend::domains::health::routes())
        .merge(utazon_backend::domains::contact::routes())
        .merge(utazon_backend::domains::video::routes());

    let cors = CorsLayer::new()
        .allow_origin("http://localhost:3000".parse::<HeaderValue>().unwrap())
        .allow_methods([Method::GET, Method::POST, Method::OPTIONS])
        .allow_headers([
            header::CONTENT_TYPE,
            header::ACCEPT,
            header::ORIGIN,
            header::RANGE,
        ])
        .allow_credentials(true);

    Router::new()
        .route("/", get(root_handler))
        .nest(&format!("/api/{}", API_VERSION), api_routes)
        .layer(
            ServiceBuilder::new()
                .layer(axum::middleware::from_fn(
                    utazon_backend::common::middleware::request_id_middleware,
                ))
                .layer(TraceLayer::new_for_http())
                .layer(cors)
                .layer(DefaultBodyLimit::max(10 * 1024 * 1024))
                .into_inner(),
        )
        .with_state(app_state)
}

pub async fn request(method: Method, uri: &str) -> axum::response::Response {
    let app = create_test_app();

    let request = Request::builder()
        .method(method)
        .uri(uri)
        .body(Body::empty())
        .unwrap();

    app.oneshot(request).await.unwrap()
}

#[allow(dead_code)]
pub async fn request_with_json(
    method: Method,
    uri: &str,
    json_body: serde_json::Value,
) -> axum::response::Response {
    let app = create_test_app();

    let body_string = serde_json::to_string(&json_body).unwrap();

    let request = Request::builder()
        .method(method)
        .uri(uri)
        .header(header::CONTENT_TYPE, "application/json")
        .body(Body::from(body_string))
        .unwrap();

    app.oneshot(request).await.unwrap()
}
