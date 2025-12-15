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
    bot_token: String,
    user_ids: Vec<String>,
}

impl DiscordNotifier {
    pub fn new(bot_token: impl Into<String>, user_ids: Vec<String>) -> Self {
        Self {
            bot_token: bot_token.into(),
            user_ids,
        }
    }
}

impl Notification for DiscordNotifier {
    async fn notify(&self, message: String) -> anyhow::Result<()> {
        let client = reqwest::Client::new();
        let mut errors = Vec::new();

        for user_id in &self.user_ids {
            if let Err(e) = self.send_dm_to_user(&client, user_id, &message).await {
                errors.push(format!("Failed to notify user {}: {}", user_id, e));
            }
        }

        if errors.is_empty() {
            Ok(())
        } else {
            Err(anyhow::anyhow!(
                "Some notifications failed: {}",
                errors.join("; ")
            ))
        }
    }
}

impl DiscordNotifier {
    async fn send_dm_to_user(
        &self,
        client: &reqwest::Client,
        user_id: &str,
        message: &str,
    ) -> anyhow::Result<()> {
        let url = "https://discord.com/api/v10/users/@me/channels";
        let payload = serde_json::json!({ "recipient_id": user_id });

        // Create DM channel with the user
        let dm_response = client
            .post(url)
            .header("Authorization", format!("Bot {}", self.bot_token))
            .header("Content-Type", "application/json")
            .json(&payload)
            .send()
            .await?
            .error_for_status()?;

        let dm_channel: serde_json::Value = dm_response.json().await?;
        let channel_id = dm_channel["id"]
            .as_str()
            .ok_or_else(|| anyhow::anyhow!("Failed to get DM channel ID"))?;

        // Send message to the DM channel
        let message_url = format!(
            "https://discord.com/api/v10/channels/{}/messages",
            channel_id
        );
        let message_payload = serde_json::json!({ "content": message });

        client
            .post(&message_url)
            .header("Authorization", format!("Bot {}", self.bot_token))
            .header("Content-Type", "application/json")
            .json(&message_payload)
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

    let notifier = DiscordNotifier::new(
        state.config.discord_bot_token.clone(),
        state.config.discord_user_ids.clone(),
    );
    let message = format_contact_message(&form);

    match notifier.notify(message).await {
        Ok(()) => Ok(Json(serde_json::json!({
            "success": true,
            "message": "Contact form submitted successfully"
        }))),
        Err(_) => Err((
            StatusCode::INTERNAL_SERVER_ERROR,
            Json(serde_json::json!({
                "error": "Failed to process contact form",
                "message": "An error occurred while processing your request"
            })),
        )),
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
