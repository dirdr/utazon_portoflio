FROM rust:1.86-slim as builder

WORKDIR /app

RUN apt-get update && apt-get install -y \
  pkg-config \
  libssl-dev \
  && rm -rf /var/lib/apt/lists/*

COPY Cargo.toml Cargo.lock ./

# Create a dummy src/lib.rs to build dependencies
RUN mkdir src && echo "fn main() {}" > src/main.rs

# Build dependencies - this will be cached until Cargo.toml changes
RUN cargo build --release && rm src/main.rs

# Now copy actual source code
COPY src ./src

# Build only your code (dependencies are already compiled)
RUN cargo build --release

FROM debian:bookworm-slim

RUN apt-get update && apt-get install -y \
  ca-certificates \
  libssl3 \
  curl \
  && rm -rf /var/lib/apt/lists/*

RUN useradd -r -s /bin/false -m -d /app utazon

WORKDIR /app

COPY --from=builder /app/target/release/utazon_backend /app/

RUN chown -R utazon:utazon /app

USER utazon

EXPOSE 3001

HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
  CMD curl -f http://localhost:3001/api/health -v || exit 1

CMD ["./utazon_backend"]
