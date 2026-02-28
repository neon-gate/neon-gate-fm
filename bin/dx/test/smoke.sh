#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../../.." && pwd)"

"$ROOT_DIR/bin/dx/test/smoke-auth.sh"
"$ROOT_DIR/bin/dx/test/smoke-player.sh"

echo "DX smoke complete."
