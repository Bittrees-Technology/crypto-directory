#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SKIP_BUILD=0

if [ "${1:-}" = "--skip-build" ]; then
  SKIP_BUILD=1
fi

if [ "$SKIP_BUILD" -eq 0 ]; then
  echo "Building site..."
  node "$ROOT_DIR/scripts/build.mjs" >/dev/null
fi

node "$ROOT_DIR/scripts/publish-ipfs.mjs"
