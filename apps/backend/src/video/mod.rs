mod handler;
mod routes;
mod service;

// Re-export the routes function (public API of this feature module)
pub use routes::video_routes as routes;

// Optionally re-export types if needed
pub use handler::GetPresignedVideoUrlQuery;
pub use service::GetPresignedVideoUrl;
