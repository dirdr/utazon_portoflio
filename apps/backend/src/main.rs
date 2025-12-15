use axum::{
    Json, Router,
    extract::DefaultBodyLimit,
    http::{HeaderValue, Method, header},
    routing::get,
};
use serde_json::{Value, json};
use std::net::SocketAddr;
use tower::ServiceBuilder;
use tower_http::{cors::CorsLayer, trace::TraceLayer};
use tracing_subscriber::{layer::SubscriberExt, util::SubscriberInitExt};

mod config;
mod errors;
mod handlers;
mod middleware;
mod routes;
mod services;
mod state;
mod validation;

use crate::{
    config::AppConfig, handlers::health::health_handler, routes::contact::contact_routes,
    state::AppState,
};

const API_VERSION: &str = "v1";

#[tokio::main]
async fn main() -> anyhow::Result<()> {
    tracing_subscriber::registry()
        .with(
            tracing_subscriber::EnvFilter::try_from_default_env()
                .unwrap_or_else(|_| "utazon_backend=debug,tower_http=debug,tower=info".into()),
        )
        .with(
            tracing_subscriber::fmt::layer()
                .with_target(true)
                .with_thread_ids(true)
                .with_file(true)
                .with_line_number(true),
        )
        .init();

    tracing::info!(
        version = env!("CARGO_PKG_VERSION"),
        "Starting Utazon Backend"
    );

    let config = AppConfig::from_env()?;
    let port = config.port;

    let cors = CorsLayer::new()
        .allow_origin(
            config
                .allowed_origins
                .iter()
                .map(|origin| origin.parse::<HeaderValue>())
                .collect::<Result<Vec<_>, _>>()?,
        )
        .allow_methods([Method::GET, Method::POST, Method::OPTIONS])
        .allow_headers([
            header::CONTENT_TYPE,
            header::ACCEPT,
            header::ORIGIN,
            header::RANGE,
        ])
        .allow_credentials(true);

    let app_state = AppState::new(config);

    let api_v1 = Router::new()
        .route("/health", get(health_handler))
        .merge(contact_routes());

    let app = Router::new()
        .route("/", get(root_handler))
        .nest(&format!("/api/{}", API_VERSION), api_v1)
        .route("/api/health", get(health_handler))
        .nest("/api", contact_routes())
        .layer(
            ServiceBuilder::new()
                .layer(axum::middleware::from_fn(
                    crate::middleware::request_id::request_id_middleware,
                ))
                .layer(TraceLayer::new_for_http())
                .layer(cors)
                .layer(DefaultBodyLimit::max(10 * 1024 * 1024))
                .into_inner(),
        )
        .with_state(app_state);

    let addr = SocketAddr::from(([0, 0, 0, 0], port));
    tracing::info!("Starting server on port {}", port);
    tracing::info!("API version: {}", API_VERSION);

    let listener = tokio::net::TcpListener::bind(addr).await?;
    axum::serve(listener, app).await?;

    Ok(())
}

async fn root_handler() -> Json<Value> {
    Json(json!({
        "message": "Utazon Portfolio Backend API",
        "version": env!("CARGO_PKG_VERSION"),
        "api_version": API_VERSION,
        "endpoints": {
            "health": format!("GET /api/{}/health", API_VERSION),
            "contact": format!("POST /api/{}/contact - submit contact form", API_VERSION),
            "legacy_health": "GET /api/health (deprecated, use versioned endpoint)",
            "legacy_contact": "POST /api/contact (deprecated, use versioned endpoint)"
        },
        "timestamp": chrono::Utc::now().to_rfc3339()
    }))
}
