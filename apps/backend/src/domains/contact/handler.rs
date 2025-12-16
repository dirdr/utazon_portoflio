use axum::{Json, extract::State};
use garde::Validate;
use serde::{Deserialize, Serialize};
use serde_json::{Value, json};

use crate::common::{AppResult, AppState, validate};

#[derive(Debug, Clone, Deserialize, Serialize, Validate)]
pub struct ContactForm {
    #[garde(length(min = 1, max = 50))]
    pub first_name: String,

    #[garde(length(min = 1, max = 50))]
    pub last_name: String,

    #[garde(length(min = 1, max = 20))]
    pub number: String,

    #[garde(email)]
    pub email: String,

    #[garde(length(min = 1, max = 1000))]
    pub message: String,
}

#[tracing::instrument(skip(state, form), fields(email = %form.email))]
pub(super) async fn contact_handler(
    State(state): State<AppState>,
    Json(form): Json<ContactForm>,
) -> AppResult<Json<Value>> {
    tracing::info!("Received contact form submission");

    validate(&form)?;

    let message = format_contact_message(&form);
    state.notifier.notify(message).await?;

    tracing::info!("Contact form processed successfully");
    Ok(Json(json!({
        "success": true,
        "message": "Contact form submitted successfully"
    })))
}

fn format_contact_message(form: &ContactForm) -> String {
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

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_format_contact_message() {
        let form = ContactForm {
            first_name: "John".to_string(),
            last_name: "Doe".to_string(),
            number: "+1234567890".to_string(),
            email: "john@example.com".to_string(),
            message: "Test message".to_string(),
        };

        let message = format_contact_message(&form);
        assert!(message.contains("John"));
        assert!(message.contains("Doe"));
        assert!(message.contains("john@example.com"));
    }

    #[test]
    fn test_validate_valid_form() {
        let form = ContactForm {
            first_name: "John".to_string(),
            last_name: "Doe".to_string(),
            number: "+1234567890".to_string(),
            email: "john@example.com".to_string(),
            message: "Test message".to_string(),
        };

        assert!(validate(&form).is_ok());
    }

    #[test]
    fn test_validate_invalid_email() {
        let form = ContactForm {
            first_name: "John".to_string(),
            last_name: "Doe".to_string(),
            number: "+1234567890".to_string(),
            email: "invalid-email".to_string(),
            message: "Test message".to_string(),
        };

        assert!(validate(&form).is_err());
    }

    #[test]
    fn test_validate_message_too_long() {
        let form = ContactForm {
            first_name: "John".to_string(),
            last_name: "Doe".to_string(),
            number: "+1234567890".to_string(),
            email: "john@example.com".to_string(),
            message: "a".repeat(1001),
        };

        assert!(validate(&form).is_err());
    }

    #[test]
    fn test_validate_empty_fields() {
        let form = ContactForm {
            first_name: "".to_string(),
            last_name: "Doe".to_string(),
            number: "+1234567890".to_string(),
            email: "john@example.com".to_string(),
            message: "Test".to_string(),
        };

        assert!(validate(&form).is_err());
    }
}
