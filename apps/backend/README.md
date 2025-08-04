# Utazon Backend

Rust backend API for Utazon Portfolio - MinIO video streaming service.

## What it does

This is a REST API service that streams videos from MinIO object storage. It provides endpoints for listing and streaming video files for a portfolio website.

## Environment Variables

All environment variables are required (no fallback values):

- `PORT` - Server port
- `MINIO_ROOT_USER` - MinIO access key
- `MINIO_ROOT_PASSWORD` - MinIO secret key  
- `MINIO_BUCKET_NAME` - MinIO bucket name
- `MINIO_INTERNAL_ENDPOINT` - MinIO endpoint
- `MINIO_INTERNAL_PORT` - MinIO port
- `ALLOWED_ORIGINS` - Comma-separated list of CORS allowed origins
- `RUST_LOG` - Logging configuration (optional)

## API Endpoints

- `GET /` - API information
- `GET /api/health` - Health check
- `GET /api/videos` - List available videos
- `GET /api/videos/:videoId` - Stream video content