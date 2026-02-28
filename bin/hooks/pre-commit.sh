#!/usr/bin/env bash
set -euo pipefail

pnpm format
pnpm build
pnpm -r --if-present test
pnpm lint-staged
