use axum::http::{Method, StatusCode};

mod test_helpers;

use test_helpers::request;

#[tokio::test]
async fn test_health_endpoint() {
    let response = request(Method::GET, "/api/v1/health").await;

    let (parts, body) = response.into_parts();

    assert_eq!(parts.status, StatusCode::OK);

    let body_bytes = axum::body::to_bytes(body, usize::MAX).await.unwrap();
    let body_str = String::from_utf8(body_bytes.to_vec()).unwrap();
    let json: serde_json::Value = serde_json::from_str(&body_str).unwrap();

    assert_eq!(json["status"], "healthy");
    assert!(json.get("version").is_some());
    assert!(json.get("uptime_seconds").is_some());
    assert!(json.get("timestamp").is_some());
}

#[tokio::test]
async fn test_health_endpoint_returns_json() {
    let response = request(Method::GET, "/api/v1/health").await;

    let (parts, _) = response.into_parts();

    let content_type = parts
        .headers
        .get("content-type")
        .and_then(|v| v.to_str().ok())
        .unwrap_or("");

    assert!(content_type.contains("application/json"));
}
