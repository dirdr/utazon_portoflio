use axum::http::{Method, StatusCode};

mod test_helpers;

use test_helpers::request;

#[tokio::test]
async fn test_root_endpoint() {
    let response = request(Method::GET, "/").await;

    let (parts, body) = response.into_parts();

    assert_eq!(parts.status, StatusCode::OK);

    let body_bytes = axum::body::to_bytes(body, usize::MAX).await.unwrap();
    let body_str = String::from_utf8(body_bytes.to_vec()).unwrap();
    let json: serde_json::Value = serde_json::from_str(&body_str).unwrap();

    assert_eq!(json["message"], "Utazon Portfolio Backend API");
    assert!(json.get("version").is_some());
    assert_eq!(json["api_version"], "v1");
    assert!(json.get("endpoints").is_some());
    assert!(json.get("timestamp").is_some());
}

#[tokio::test]
async fn test_root_endpoint_contains_api_info() {
    let response = request(Method::GET, "/").await;

    let (_, body) = response.into_parts();

    let body_bytes = axum::body::to_bytes(body, usize::MAX).await.unwrap();
    let body_str = String::from_utf8(body_bytes.to_vec()).unwrap();
    let json: serde_json::Value = serde_json::from_str(&body_str).unwrap();

    let endpoints = json["endpoints"].as_object().unwrap();
    assert!(endpoints.contains_key("health"));
    assert!(endpoints.contains_key("contact"));
}
