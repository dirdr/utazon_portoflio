use async_trait::async_trait;

use crate::common::errors::{AppError, AppResult};

#[async_trait]
pub trait Notification: Send + Sync {
    async fn notify(&self, message: String) -> AppResult<()>;
}

pub struct DiscordNotifier {
    client: reqwest::Client,
    bot_token: String,
    user_ids: Vec<String>,
}

impl DiscordNotifier {
    pub fn new(client: reqwest::Client, bot_token: String, user_ids: Vec<String>) -> Self {
        Self {
            client,
            bot_token,
            user_ids,
        }
    }

    #[tracing::instrument(skip(self, client, message), fields(user_id = %user_id))]
    async fn send_dm_to_user(
        &self,
        client: &reqwest::Client,
        user_id: &str,
        message: &str,
    ) -> AppResult<()> {
        let url = "https://discord.com/api/v10/users/@me/channels";
        let payload = serde_json::json!({ "recipient_id": user_id });

        tracing::debug!("Creating DM channel for user {}", user_id);

        let dm_response = client
            .post(url)
            .header("Authorization", format!("Bot {}", self.bot_token))
            .header("Content-Type", "application/json")
            .json(&payload)
            .send()
            .await
            .map_err(|e| AppError::DiscordApi(format!("Failed to create DM channel: {}", e)))?
            .error_for_status()
            .map_err(|e| AppError::DiscordApi(format!("Discord API error: {}", e)))?;

        let dm_channel: serde_json::Value = dm_response.json().await.map_err(|e| {
            AppError::DiscordApi(format!("Failed to parse DM channel response: {}", e))
        })?;

        let channel_id = dm_channel["id"]
            .as_str()
            .ok_or_else(|| AppError::DiscordApi("Failed to get DM channel ID".to_string()))?;

        tracing::debug!("Sending message to channel {}", channel_id);

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
            .await
            .map_err(|e| AppError::DiscordApi(format!("Failed to send message: {}", e)))?
            .error_for_status()
            .map_err(|e| AppError::DiscordApi(format!("Discord API error: {}", e)))?;

        tracing::info!("Successfully sent Discord notification to user {}", user_id);
        Ok(())
    }
}

#[async_trait]
impl Notification for DiscordNotifier {
    #[tracing::instrument(skip(self, message))]
    async fn notify(&self, message: String) -> AppResult<()> {
        let mut errors = Vec::new();
        let mut success_count = 0;

        for user_id in &self.user_ids {
            match self.send_dm_to_user(&self.client, user_id, &message).await {
                Ok(()) => {
                    success_count += 1;
                    tracing::info!("Notified user {}", user_id);
                }
                Err(e) => {
                    tracing::error!("Failed to notify user {}: {}", user_id, e);
                    errors.push(format!("User {}: {}", user_id, e));
                }
            }
        }

        if success_count == 0 {
            Err(AppError::DiscordApi(format!(
                "All notifications failed: {}",
                errors.join("; ")
            )))
        } else if !errors.is_empty() {
            tracing::warn!(
                "Partial notification failure: {}/{} succeeded",
                success_count,
                self.user_ids.len()
            );
            Ok(())
        } else {
            Ok(())
        }
    }
}
