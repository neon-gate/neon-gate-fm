#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../../../.." && pwd)"
COMPOSE_FILE="$ROOT_DIR/docker-compose.yml"
SOUNDGARDEN_API_BASE_URL="${SOUNDGARDEN_API_BASE_URL:-http://localhost:7100}"

cd "$ROOT_DIR"

echo "Starting soundgarden..."
docker compose -f "$COMPOSE_FILE" up -d --build soundgarden

echo "Waiting for soundgarden at $SOUNDGARDEN_API_BASE_URL..."
for i in {1..30}; do
  if curl -sS -o /dev/null -w "%{http_code}" -X POST "$SOUNDGARDEN_API_BASE_URL/tracks/upload" 2>/dev/null | grep -qE '^(200|400)$'; then
    break
  fi
  if [[ $i -eq 30 ]]; then
    echo "Soundgarden did not become ready in time"
    docker compose -f "$COMPOSE_FILE" logs soundgarden
    exit 1
  fi
  sleep 1
done

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
echo "Running soundgarden smoke tests..."
bash "$SCRIPT_DIR/upload.smoke.sh"

echo "Soundgarden smoke tests passed."
