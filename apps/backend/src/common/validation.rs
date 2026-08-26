use garde::Validate;

use crate::common::errors::AppError;

pub fn validate<T: Validate>(data: &T) -> Result<(), AppError>
where
    T::Context: Default,
{
    data.validate()
        .map_err(|e| AppError::Validation(format_validation_errors(&e)))
}

fn format_validation_errors(errors: &garde::Report) -> String {
    errors
        .iter()
        .map(|(path, error)| {
            let field = path.to_string();
            let message = error.to_string();
            format!("{}: {}", field, message)
        })
        .collect::<Vec<_>>()
        .join("; ")
}

#[cfg(test)]
mod tests {
    use super::*;
    use garde::Validate;

    #[derive(Debug, Validate)]
    struct TestStruct {
        #[garde(length(min = 1, max = 10))]
        name: String,
        #[garde(email)]
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
