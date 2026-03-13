#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
COMPOSE_FILE="$ROOT_DIR/docker-compose.yml"

TARGET="${1:-all}"

INFRA_SERVICES=(mongo)
APP_SERVICES=(authority soundgarden pulse)

case "$TARGET" in
  infra)
    docker compose -f "$COMPOSE_FILE" ps "${INFRA_SERVICES[@]}"
    ;;
  apps)
    docker compose -f "$COMPOSE_FILE" ps "${APP_SERVICES[@]}"
    ;;
  all)
    docker compose -f "$COMPOSE_FILE" ps
    ;;
  *)
    echo "Usage: bash bin/docker/docker-ps.sh [infra|apps|all]"
    exit 1
    ;;
esac
