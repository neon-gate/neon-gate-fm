#!/usr/bin/env bash
set -euo pipefail

SOUNDGARDEN_API_BASE_URL="${SOUNDGARDEN_API_BASE_URL:-http://localhost:7100}"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
TEST_FILE="${TEST_FILE:-$SCRIPT_DIR/data/remember-the-name.mp3}"

if [[ ! -f "$TEST_FILE" ]]; then
  echo "Test file not found: $TEST_FILE"
  exit 1
fi

response="$(curl -sS -w "\n%{http_code}" -X POST "$SOUNDGARDEN_API_BASE_URL/tracks/upload" \
  -F "file=@$TEST_FILE")"

http_code="$(echo "$response" | tail -n1)"
body="$(echo "$response" | sed '$d')"

if [[ "$http_code" != "200" ]]; then
  echo "upload failed: expected status 200, got $http_code"
  echo "Response: $body"
  exit 1
fi

track_id="$(node -e "
  const d = JSON.parse(require('fs').readFileSync(0, 'utf8'));
  if (!d.trackId) { console.error('Missing trackId'); process.exit(2); }
  if (d.status !== 'uploaded') { console.error('Expected status uploaded, got', d.status); process.exit(2); }
  process.stdout.write(d.trackId);
" <<<"$body")"

echo "OK upload status=$http_code trackId=$track_id"
