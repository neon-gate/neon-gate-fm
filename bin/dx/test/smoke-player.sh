#!/usr/bin/env bash
set -euo pipefail

PLAYER_API_BASE_URL="${PLAYER_API_BASE_URL:-http://localhost:7001}"
SESSION_ID="${PLAYER_TEST_SESSION_ID:-session-$(date +%s)}"
TRACK_ID="${PLAYER_TEST_TRACK_ID:-track-smoke}"
PAUSE_POSITION_MS="${PLAYER_TEST_PAUSE_POSITION_MS:-12000}"

RESPONSE_STATUS=""
RESPONSE_BODY=""

perform_request() {
  local method="$1"
  local url="$2"
  local data="${3:-}"
  local tmp

  tmp="$(mktemp)"
  if [[ -n "$data" ]]; then
    RESPONSE_STATUS="$(curl -sS -o "$tmp" -w "%{http_code}" -X "$method" "$url" -H "Content-Type: application/json" -d "$data")"
  else
    RESPONSE_STATUS="$(curl -sS -o "$tmp" -w "%{http_code}" -X "$method" "$url")"
  fi

  RESPONSE_BODY="$(<"$tmp")"
  rm -f "$tmp"
}

assert_status() {
  local step="$1"
  local expected="$2"

  if [[ "$RESPONSE_STATUS" != "$expected" ]]; then
    echo "$step failed: expected status $expected got $RESPONSE_STATUS"
    echo "Response: $RESPONSE_BODY"
    exit 1
  fi
}

echo "Using player session: $SESSION_ID"

perform_request "POST" "$PLAYER_API_BASE_URL/player/start" "{\"sessionId\":\"$SESSION_ID\",\"trackId\":\"$TRACK_ID\"}"
assert_status "start" 201
echo "OK start status=$RESPONSE_STATUS"

perform_request "PATCH" "$PLAYER_API_BASE_URL/player/pause" "{\"sessionId\":\"$SESSION_ID\",\"positionMs\":$PAUSE_POSITION_MS}"
assert_status "pause" 200
echo "OK pause status=$RESPONSE_STATUS"

