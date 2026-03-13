#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
COMPOSE_FILE="$ROOT_DIR/docker-compose.yml"
AUTHORITY_ENV="$ROOT_DIR/domain/identity/authority/.env"
TARGET="${1:-all}"

INFRA_SERVICES=(mongo)
APP_SERVICES=(authority soundgarden pulse)

case "$TARGET" in
  infra)
    docker compose -f "$COMPOSE_FILE" up -d --build "${INFRA_SERVICES[@]}"
    ;;
  apps)
    if [[ ! -f "$AUTHORITY_ENV" ]]; then
      echo "Missing domain/identity/authority/.env (copy from .env.template)"
      exit 1
    fi
    docker compose -f "$COMPOSE_FILE" up -d --build "${APP_SERVICES[@]}"
    ;;
  all)
    if [[ ! -f "$AUTHORITY_ENV" ]]; then
      echo "Missing domain/identity/authority/.env (copy from .env.template)"
      exit 1
    fi
    docker compose -f "$COMPOSE_FILE" up -d --build
    ;;
  *)
    echo "Usage: bash bin/docker/docker-up.sh [infra|apps|all]"
    exit 1
    ;;
esac
