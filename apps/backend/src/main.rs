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
mod middleware;
mod routes;
mod services;
mod state;

use crate::{
    config::AppConfig, 
    handlers::{auth::login_handler, health::health_handler}, 
    routes::videos::video_routes,
    services::minio::MinioService,
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

    let config = AppConfig::from_env().map_err(|e| {
        tracing::error!("Failed to load configuration: {}", e);
        e
    })?;
    let port = config.port;

    tracing::info!("Initializing MinIO service...");
    let minio_service = MinioService::new(&config).await.map_err(|e| {
        tracing::error!("Failed to initialize MinIO service: {}", e);
        e
    })?;
    tracing::info!("✅ MinIO service initialized successfully");

    let cors = CorsLayer::new()
        .allow_origin(
            config
                .allowed_origins
                .iter()
                .map(|origin| origin.parse::<HeaderValue>())
                .collect::<Result<Vec<_>, _>>()
                .map_err(|e| {
                    tracing::error!("Failed to parse CORS allowed origins: {}", e);
                    e
                })?,
        )
        .allow_methods([Method::GET, Method::POST, Method::OPTIONS])
        .allow_headers([
            header::CONTENT_TYPE,
            header::AUTHORIZATION,
            header::ACCEPT,
            header::ORIGIN,
        ])
        .allow_credentials(true);

    // Build the application router
    let app = Router::new()
        .route("/", get(root_handler))
        .route("/api/health", get(health_handler))
        .route("/api/auth/login", axum::routing::post(login_handler))
        .nest("/api/videos", video_routes())
        .layer(
            ServiceBuilder::new()
                .layer(TraceLayer::new_for_http())
                .layer(cors)
                .layer(DefaultBodyLimit::max(10 * 1024 * 1024)) // 10MB limit
                .into_inner(),
        )
        .with_state(AppState::new(minio_service, config));

    let addr = SocketAddr::from(([0, 0, 0, 0], port));
    tracing::info!("Starting Utazon Backend Server...");
    tracing::info!("Binding to address: {}", addr);

    let listener = tokio::net::TcpListener::bind(addr).await.map_err(|e| {
        tracing::error!("Failed to bind to address {}: {}", addr, e);
        e
    })?;
    
    tracing::info!("✅ Utazon Backend Server successfully started and listening on port {}", port);
    tracing::info!("Health check endpoint: http://{}:{}/api/health", "localhost", port);
    tracing::info!("Ready to accept connections!");
    
    axum::serve(listener, app).await.map_err(|e| {
        tracing::error!("Server failed to start: {}", e);
        e
    })?;

    Ok(())
}

async fn root_handler() -> Json<Value> {
    Json(json!({
        "message": "Utazon Portfolio Backend API",
        "version": "1.0.0",
        "endpoints": {
            "health": "GET /api/health",
            "listVideos": "GET /api/videos",
            "videoStream": "GET /api/videos/:videoId - supports paths like 'showreel.mp4' or 'aurum-nova/details.mp4'"
        },
        "timestamp": chrono::Utc::now().to_rfc3339()
    }))
}
