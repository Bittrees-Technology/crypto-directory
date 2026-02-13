#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SITE_DIR="$ROOT_DIR/site"

if ! command -v ipfs >/dev/null 2>&1; then
  echo "ERROR: ipfs CLI not found. Install Kubo first: https://docs.ipfs.tech/install/command-line/"
  exit 1
fi

if [ ! -d "$SITE_DIR" ]; then
  echo "ERROR: site directory not found at $SITE_DIR"
  exit 1
fi

echo "Building site..."
node "$ROOT_DIR/scripts/build.mjs" >/dev/null

echo "Adding site/ to IPFS..."
CID="$(ipfs add -Qr "$SITE_DIR")"

echo "CID: $CID"
echo
echo "Gateway URL:"
echo "https://ipfs.io/ipfs/$CID/"
