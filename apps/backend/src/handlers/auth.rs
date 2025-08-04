use axum::{extract::State, http::StatusCode, Json, response::IntoResponse};
use chrono::{Duration, Utc};
use jsonwebtoken::{encode, EncodingKey, Header};
use serde::{Deserialize, Serialize};

use crate::{middleware::jwt::Claims, state::AppState};

#[derive(Deserialize)]
pub struct LoginRequest {
    pub username: String,
    pub password: String,
}

#[derive(Serialize)]
pub struct LoginResponse {
    pub token: String,
    pub expires_at: String,
}

#[derive(Serialize)]
pub struct ErrorResponse {
    pub error: String,
    pub message: String,
}

pub async fn login_handler(
    State(app_state): State<AppState>,
    Json(payload): Json<LoginRequest>,
) -> Result<Json<LoginResponse>, impl IntoResponse> {
    let username = payload.username.trim();
    let password = payload.password.trim();
    let expected_username = app_state.config.auth_username.trim();
    let expected_password = app_state.config.auth_password.trim();
    
    tracing::debug!(
        "Login attempt - received username: '{}', received password: '{}', expected username: '{}', expected password: '{}'",
        username,
        password,
        expected_username,
        expected_password
    );
    
    if username != expected_username || password != expected_password {
        tracing::warn!(
            "Authentication failed - username match: {}, password match: {}",
            username == expected_username,
            password == expected_password
        );
        return Err((
            StatusCode::UNAUTHORIZED,
            Json(ErrorResponse {
                error: "Authentication failed".to_string(),
                message: "Invalid credentials".to_string(),
            }),
        ));
    }

    let exp = Utc::now()
        .checked_add_signed(Duration::hours(24))
        .expect("valid timestamp")
        .timestamp() as usize;

    let claims = Claims {
        sub: username.to_string(),
        exp,
    };

    let token = encode(
        &Header::default(),
        &claims,
        &EncodingKey::from_secret(app_state.config.jwt_secret.as_ref()),
    )
    .map_err(|_| (
        StatusCode::INTERNAL_SERVER_ERROR,
        Json(ErrorResponse {
            error: "Token generation failed".to_string(),
            message: "Failed to generate authentication token".to_string(),
        }),
    ))?;

    Ok(Json(LoginResponse {
        token,
        expires_at: chrono::DateTime::from_timestamp(exp as i64, 0)
            .unwrap()
            .to_rfc3339(),
    }))
}