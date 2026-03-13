#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../../../.." && pwd)"
COMPOSE_FILE="$ROOT_DIR/docker-compose.yml"
AUTHORITY_ENV="$ROOT_DIR/domain/identity/authority/.env"
cd "$ROOT_DIR"

# Ensure authority .env exists for Docker build and runtime
if [[ ! -f "$AUTHORITY_ENV" ]]; then
  echo "Creating domain/identity/authority/.env for smoke tests..."
  cat > "$AUTHORITY_ENV" << 'EOF'
PORT=7000
MONGO_URI=mongodb://mongo:27017
MONGO_DB_NAME=pulse-auth
JWT_SECRET=pulse-auth-secret
JWT_EXPIRES_IN=15m
JWT_REFRESH_SECRET=pulse-auth-refresh-secret
JWT_REFRESH_EXPIRES_IN=7d
GOOGLE_CLIENT_ID=local.google.client
EOF
fi

echo "Starting mongo + authority..."
docker compose -f "$COMPOSE_FILE" up -d --build mongo authority

echo "Waiting for authority service at http://localhost:7000..."
for i in {1..30}; do
  if curl -sS -o /dev/null -w "%{http_code}" -X GET "http://localhost:7000/auth/me" 2>/dev/null | grep -qE '^(200|401)$'; then
    break
  fi
  if [[ $i -eq 30 ]]; then
    echo "Authority service did not become ready in time"
    docker compose -f "$COMPOSE_FILE" logs authority
    exit 1
  fi
  sleep 1
done

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
echo "Running authority smoke tests..."
bash "$SCRIPT_DIR/login.smoke.sh"

echo "Authority smoke tests passed."
