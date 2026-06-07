#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
REPORTS_DIR="$ROOT_DIR/reports"
RELEASES_FILE="$ROOT_DIR/releases.md"

DATE_UTC="$(date -u +%Y-%m-%d)"
STAMP_UTC="$(date -u +%Y%m%dT%H%M%SZ)"
AUDIT_LOG="$REPORTS_DIR/audit-$STAMP_UTC.log"
PROCESS_STATUS_LOG="$REPORTS_DIR/process-status-$STAMP_UTC.log"
NOTES="${1:-Monthly release}"

mkdir -p "$REPORTS_DIR"

if ! command -v ipfs >/dev/null 2>&1; then
  echo "ERROR: ipfs CLI not found. Install Kubo first: https://docs.ipfs.tech/install/command-line/"
  exit 1
fi

echo "Step 1/6: audit"
node "$ROOT_DIR/scripts/audit-report.mjs" | tee "$AUDIT_LOG"

echo "Step 2/6: process status"
node "$ROOT_DIR/scripts/process-status-report.mjs" | tee "$PROCESS_STATUS_LOG"

echo "Step 3/6: build"
node "$ROOT_DIR/scripts/build.mjs"

echo "Step 4/6: publish"
PUBLISH_OUTPUT="$("$ROOT_DIR/scripts/publish-ipfs.sh" --skip-build)"
echo "$PUBLISH_OUTPUT"
CID="$(printf "%s\n" "$PUBLISH_OUTPUT" | sed -n "s/^CID: //p" | tail -n 1)"

if [ -z "$CID" ]; then
  echo "ERROR: failed to extract CID from publish output"
  exit 1
fi

echo "Step 5/6: ENS update (manual)"
echo "Set cryptodirectory.eth contenthash to: ipfs://$CID"

ENTRY_COUNT="$(node -e "const fs=require(\"fs\"); const p=\"$ROOT_DIR/site/data/projects.json\"; const data=JSON.parse(fs.readFileSync(p,\"utf8\")); console.log(Array.isArray(data)?data.length:0);")"
RELEASE_LINE="- $DATE_UTC: CID=$CID | entries=$ENTRY_COUNT | notes=$NOTES"

echo "Step 6/6: append releases.md"
if ! grep -q "$CID" "$RELEASES_FILE"; then
  echo "$RELEASE_LINE" >> "$RELEASES_FILE"
  echo "Appended release record: $RELEASE_LINE"
else
  echo "CID already present in releases.md; skipped append."
fi

echo
printf "Release evidence:\n- audit log: %s\n- process status log: %s\n" "$AUDIT_LOG" "$PROCESS_STATUS_LOG"
echo "Release completed."
