use axum::{Json, Router, extract::State, http::StatusCode, routing::post};
use serde::{Deserialize, Serialize};

use crate::state::AppState;

pub fn mail_routes(_app_state: AppState) -> Router<AppState> {
    Router::new().route("/contact", post(contact_handler))
}

pub trait Notification: Send + Sync {
    async fn notify(&self, message: String) -> anyhow::Result<()>;
}

pub struct DiscordNotifier {
    webhook: String,
}

impl DiscordNotifier {
    pub fn new(webhook: impl Into<String>) -> Self {
        Self {
            webhook: webhook.into(),
        }
    }
}

impl Notification for DiscordNotifier {
    async fn notify(&self, message: String) -> anyhow::Result<()> {
        let payload = serde_json::json!({ "content": message });

        let client = reqwest::Client::new();
        client
            .post(&self.webhook)
            .json(&payload)
            .send()
            .await?
            .error_for_status()?;
        Ok(())
    }
}

async fn contact_handler(
    State(state): State<AppState>,
    Json(form): Json<ContactForm>,
) -> Result<Json<serde_json::Value>, (StatusCode, Json<serde_json::Value>)> {
    if let Err(validation_error) = validate_contact_form(&form) {
        return Err((
            StatusCode::BAD_REQUEST,
            Json(serde_json::json!({
                "error": "Validation failed",
                "message": validation_error
            })),
        ));
    }

    let notifier = DiscordNotifier::new(state.config.discord_webhook.clone());
    let message = format_contact_message(&form);
    
    match notifier.notify(message).await {
        Ok(()) => Ok(Json(serde_json::json!({
            "success": true,
            "message": "Contact form submitted successfully"
        }))),
        Err(e) => {
            eprintln!("Failed to send Discord notification: {}", e);
            Err((
                StatusCode::INTERNAL_SERVER_ERROR,
                Json(serde_json::json!({
                    "error": "Failed to process contact form",
                    "message": "An error occurred while processing your request"
                })),
            ))
        }
    }
}

#[derive(Debug, Clone, Deserialize, Serialize)]
pub struct ContactForm {
    pub first_name: String,
    pub last_name: String,
    pub number: String,
    pub email: String,
    pub message: String,
}

pub fn format_contact_message(form: &ContactForm) -> String {
    format!(
        "**Yo brozer, nouvelle demande de contact!**\n\
        👤 Nom: {}\n\
        👤 Prénom: {}\n\
        📞 Téléphone: {}\n\
        📧 **Email:** {}\n\
        📝 **Message:**\n{}",
        form.last_name, form.first_name, form.number, form.email, form.message
    )
}

fn validate_contact_form(form: &ContactForm) -> Result<(), String> {
    if form.first_name.trim().is_empty() {
        return Err("First name is required".to_string());
    }
    
    if form.last_name.trim().is_empty() {
        return Err("Last name is required".to_string());
    }
    
    if form.email.trim().is_empty() {
        return Err("Email is required".to_string());
    }
    
    if !form.email.contains('@') {
        return Err("Invalid email format".to_string());
    }
    
    if form.message.trim().is_empty() {
        return Err("Message is required".to_string());
    }
    
    if form.first_name.len() > 50 || form.last_name.len() > 50 {
        return Err("Name fields cannot exceed 50 characters".to_string());
    }
    
    if form.message.len() > 1000 {
        return Err("Message cannot exceed 1000 characters".to_string());
    }
    
    Ok(())
}
