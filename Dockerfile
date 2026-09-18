# Build stage
FROM golang:1.23-alpine AS builder

WORKDIR /app

# Install build dependencies for CGO (SQLite support)
RUN apk add --no-cache git build-base

# Copy mailer and backend modules
COPY mailer /app/mailer
COPY backend /app/backend

# Download dependencies and compile binary
WORKDIR /app/backend
RUN go mod download
RUN CGO_ENABLED=1 GOOS=linux go build -ldflags="-w -s" -o /app/server ./cmd/web

# Final stage
FROM alpine:3.20

RUN apk add --no-cache ca-certificates tzdata

WORKDIR /app

# Copy compiled binary and required assets
COPY --from=builder /app/server /app/server
COPY --from=builder /app/backend/c-value.csv /app/c-value.csv

# Create data directory for SQLite fallback storage
RUN mkdir -p /app/.data

# Render dynamically passes PORT (e.g. 10000)
ENV PORT=8080
EXPOSE 8080

CMD ["/app/server"]
