use axum::{extract::Request, http::HeaderValue, middleware::Next, response::Response};
use uuid::Uuid;

pub const REQUEST_ID_HEADER: &str = "x-request-id";

#[tracing::instrument(skip(req, next))]
pub async fn request_id_middleware(mut req: Request, next: Next) -> Response {
    let request_id = Uuid::new_v4().to_string();

    tracing::info!(
        request_id = %request_id,
        method = %req.method(),
        uri = %req.uri(),
        "Incoming request"
    );

    req.extensions_mut().insert(request_id.clone());

    let response = next.run(req).await;

    tracing::info!(
        request_id = %request_id,
        status = %response.status(),
        "Request completed"
    );

    let mut response = response;
    if let Ok(header_value) = HeaderValue::from_str(&request_id) {
        response
            .headers_mut()
            .insert(REQUEST_ID_HEADER, header_value);
    }

    response
}
