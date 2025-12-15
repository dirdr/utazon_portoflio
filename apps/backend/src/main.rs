use axum::{
    Json,
    extract::DefaultBodyLimit,
    http::{HeaderValue, Method, header},
    routing::{Router, get},
};
use serde_json::{Value, json};
use std::net::SocketAddr;
use tower::ServiceBuilder;
use tower_http::{cors::CorsLayer, trace::TraceLayer};
use tracing_subscriber::{layer::SubscriberExt, util::SubscriberInitExt};

mod config;
mod handlers;
mod routes;
mod services;
mod state;

use crate::{
    config::AppConfig,
    handlers::health::health_handler,
    routes::contact::mail_routes,
    state::AppState,
};

#[tokio::main]
async fn main() -> anyhow::Result<()> {
    tracing_subscriber::registry()
        .with(
            tracing_subscriber::EnvFilter::try_from_default_env()
                .unwrap_or_else(|_| "utazon_backend=debug,tower_http=debug".into()),
        )
        .with(tracing_subscriber::fmt::layer())
        .init();

    let config = AppConfig::from_env()?;
    let port = config.port;

    let cors = CorsLayer::new()
        .allow_origin(
            config
                .allowed_origins
                .iter()
                .map(|origin| origin.parse::<HeaderValue>())
                .collect::<Result<Vec<_>, _>>()
                .map_err(|e| e)?,
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
    let app = Router::<AppState>::new()
        .route("/", get(root_handler))
        .route("/api/health", get(health_handler))
        .nest("/api", mail_routes(app_state.clone()))
        .layer(
            ServiceBuilder::new()
                .layer(TraceLayer::new_for_http())
                .layer(cors)
                .layer(DefaultBodyLimit::max(10 * 1024 * 1024)) // 10MB limit
                .into_inner(),
        )
        .with_state(app_state);

    let addr = SocketAddr::from(([0, 0, 0, 0], port));
    tracing::info!("Starting server on port {}", port);

    let listener = tokio::net::TcpListener::bind(addr).await?;
    axum::serve(listener, app).await?;

    Ok(())
}

async fn root_handler() -> Json<Value> {
    Json(json!({
        "message": "Utazon Portfolio Backend API",
        "version": "1.0.0",
        "endpoints": {
            "health": "GET /api/health",
            "contact": "POST /api/contact - submit contact form"
        },
        "timestamp": chrono::Utc::now().to_rfc3339()
    }))
}
