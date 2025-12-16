mod handler;
mod routes;
pub mod service;

pub use handler::ContactForm;
pub use routes::contact_routes as routes;
pub use service::{DiscordNotifier, Notification};
