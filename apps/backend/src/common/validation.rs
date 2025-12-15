use validator::Validate;

use crate::common::errors::AppError;

pub fn validate<T: Validate>(data: &T) -> Result<(), AppError> {
    data.validate()
        .map_err(|e| AppError::Validation(format_validation_errors(&e)))
}

fn format_validation_errors(errors: &validator::ValidationErrors) -> String {
    errors
        .field_errors()
        .iter()
        .map(|(field, errors)| {
            let messages: Vec<String> = errors
                .iter()
                .filter_map(|error| error.message.as_ref().map(|m| m.to_string()))
                .collect();
            format!("{}: {}", field, messages.join(", "))
        })
        .collect::<Vec<_>>()
        .join("; ")
}

#[cfg(test)]
mod tests {
    use super::*;
    use validator::Validate;

    #[derive(Debug, Validate)]
    struct TestStruct {
        #[validate(length(min = 1, max = 10, message = "Must be 1-10 chars"))]
        name: String,
        #[validate(email(message = "Invalid email"))]
        email: String,
    }

    #[test]
    fn test_validate_success() {
        let data = TestStruct {
            name: "Valid".to_string(),
            email: "test@example.com".to_string(),
        };
        assert!(validate(&data).is_ok());
    }

    #[test]
    fn test_validate_failure() {
        let data = TestStruct {
            name: "".to_string(),
            email: "invalid".to_string(),
        };
        let result = validate(&data);
        assert!(result.is_err());
    }

    #[test]
    fn test_validate_email_error() {
        let data = TestStruct {
            name: "Valid".to_string(),
            email: "not-email".to_string(),
        };
        let result = validate(&data);
        assert!(result.is_err());
        if let Err(AppError::Validation(msg)) = result {
            assert!(msg.contains("email"));
        }
    }
}
