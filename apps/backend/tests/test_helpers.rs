use axum::{
    Router,
    body::Body,
    http::{Method, Request, header},
};
use std::sync::Arc;
use tower::ServiceExt;

use utazon_backend::common::{AppState, PublicConfig, Secrets};

pub fn create_test_app() -> Router {
    let http_client = reqwest::Client::builder()
        .timeout(std::time::Duration::from_secs(10))
        .build()
        .expect("Failed to create HTTP client");

    let app_state = AppState {
        config: PublicConfig {
            discord_user_ids: vec!["test_user_id".to_string()],
        },
        secrets: Arc::new(Secrets {
            discord_bot_token: "test_token".to_string(),
        }),
        http_client,
        start_time: std::time::SystemTime::now(),
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
            },
            "timestamp": chrono::Utc::now().to_rfc3339()
        }))
    }

    let api_routes = Router::new()
        .merge(utazon_backend::domains::health::routes())
        .merge(utazon_backend::domains::contact::routes());

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
