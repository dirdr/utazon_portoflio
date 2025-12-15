mod handler;
mod routes;
mod service;

// Re-export the routes function (public API of this feature module)
pub use routes::contact_routes as routes;

// Optionally re-export types if needed by other modules
pub use handler::ContactForm;
