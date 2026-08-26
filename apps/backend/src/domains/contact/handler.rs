use axum::{Json, extract::State};
use serde::{Deserialize, Serialize};
use serde_json::{Value, json};

use crate::common::{AppError, AppResult, AppState};

struct Name(String);

impl TryFrom<String> for Name {
    type Error = String;
    fn try_from(s: String) -> Result<Self, Self::Error> {
        if s.is_empty() || s.len() > 50 {
            Err("must be between 1 and 50 characters".to_string())
        } else {
            Ok(Name(s))
        }
    }
}

impl std::fmt::Display for Name {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        self.0.fmt(f)
    }
}

struct PhoneNumber(String);

impl TryFrom<String> for PhoneNumber {
    type Error = String;
    fn try_from(s: String) -> Result<Self, Self::Error> {
        if s.is_empty() || s.len() > 20 {
            Err("must be between 1 and 20 characters".to_string())
        } else {
            Ok(PhoneNumber(s))
        }
    }
}

impl std::fmt::Display for PhoneNumber {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        self.0.fmt(f)
    }
}

struct Email(String);

impl TryFrom<String> for Email {
    type Error = String;
    fn try_from(s: String) -> Result<Self, Self::Error> {
        if is_valid_email(&s) {
            Ok(Email(s))
        } else {
            Err("invalid email address".to_string())
        }
    }
}

impl std::fmt::Display for Email {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        self.0.fmt(f)
    }
}

fn is_valid_email(s: &str) -> bool {
    let mut parts = s.splitn(2, '@');
    let local = parts.next().unwrap_or("");
    let domain = parts.next().unwrap_or("");
    !local.is_empty() && domain.contains('.') && !domain.starts_with('.') && !domain.ends_with('.')
}

struct Message(String);

impl TryFrom<String> for Message {
    type Error = String;
    fn try_from(s: String) -> Result<Self, Self::Error> {
        if s.is_empty() || s.len() > 1000 {
            Err("must be between 1 and 1000 characters".to_string())
        } else {
            Ok(Message(s))
        }
    }
}

impl std::fmt::Display for Message {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        self.0.fmt(f)
    }
}

#[derive(Debug, Clone, Deserialize, Serialize)]
pub(crate) struct ContactFormInput {
    first_name: String,
    last_name: String,
    number: String,
    email: String,
    message: String,
}

struct ContactForm {
    first_name: Name,
    last_name: Name,
    number: PhoneNumber,
    email: Email,
    message: Message,
}

impl TryFrom<ContactFormInput> for ContactForm {
    type Error = AppError;
    fn try_from(input: ContactFormInput) -> Result<Self, Self::Error> {
        Ok(ContactForm {
            first_name: Name::try_from(input.first_name)
                .map_err(|e| AppError::Validation(format!("first_name: {e}")))?,
            last_name: Name::try_from(input.last_name)
                .map_err(|e| AppError::Validation(format!("last_name: {e}")))?,
            number: PhoneNumber::try_from(input.number)
                .map_err(|e| AppError::Validation(format!("number: {e}")))?,
            email: Email::try_from(input.email)
                .map_err(|e| AppError::Validation(format!("email: {e}")))?,
            message: Message::try_from(input.message)
                .map_err(|e| AppError::Validation(format!("message: {e}")))?,
        })
    }
}

#[tracing::instrument(skip(state, input), fields(email = %input.email))]
pub(super) async fn contact_handler(
    State(state): State<AppState>,
    Json(input): Json<ContactFormInput>,
) -> AppResult<Json<Value>> {
    tracing::info!("Received contact form submission");

    let form = ContactForm::try_from(input)?;

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

    fn valid_input() -> ContactFormInput {
        ContactFormInput {
            first_name: "John".to_string(),
            last_name: "Doe".to_string(),
            number: "+1234567890".to_string(),
            email: "john@example.com".to_string(),
            message: "Test message".to_string(),
        }
    }

    #[test]
    fn test_format_contact_message() {
        let form = ContactForm::try_from(valid_input()).unwrap();
        let message = format_contact_message(&form);
        assert!(message.contains("John"));
        assert!(message.contains("Doe"));
        assert!(message.contains("john@example.com"));
    }

    #[test]
    fn test_valid_form() {
        assert!(ContactForm::try_from(valid_input()).is_ok());
    }

    #[test]
    fn test_invalid_email() {
        let input = ContactFormInput {
            email: "invalid-email".to_string(),
            ..valid_input()
        };
        assert!(ContactForm::try_from(input).is_err());
    }

    #[test]
    fn test_message_too_long() {
        let input = ContactFormInput {
            message: "a".repeat(1001),
            ..valid_input()
        };
        assert!(ContactForm::try_from(input).is_err());
    }

    #[test]
    fn test_empty_first_name() {
        let input = ContactFormInput {
            first_name: "".to_string(),
            ..valid_input()
        };
        assert!(ContactForm::try_from(input).is_err());
    }
}
