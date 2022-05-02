FROM messense/rust-musl-cross:aarch64-musl AS builder

WORKDIR /app

RUN rustup target add aarch64-unknown-linux-musl

COPY slack-api/Cargo.toml ./slack-api/Cargo.toml
COPY slack-api/.cargo ./slack-api/.cargo
COPY slack-api/src ./slack-api/src
COPY graphql ./graphql

RUN --mount=type=cache,target=/usr/local/cargo/registry \
    --mount=type=cache,target=/app/target \
    cd slack-api && \
    cargo build --release --target aarch64-unknown-linux-musl && \
    cp /app/slack-api/target/aarch64-unknown-linux-musl/release/tsukedaicho-slack-api /tmp

FROM debian:bullseye-slim as runner

RUN apt-get update && apt-get -y install ca-certificates

COPY --from=builder /tmp/tsukedaicho-slack-api .

EXPOSE 3000

ENTRYPOINT ["./tsukedaicho-slack-api"]
