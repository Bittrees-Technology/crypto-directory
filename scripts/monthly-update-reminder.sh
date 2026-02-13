#!/usr/bin/env bash
set -euo pipefail

ROOT="/home/robert/crypto-directory"
REPORTS_DIR="$ROOT/reports"
REMINDERS_DIR="$ROOT/reminders"
STAMP="$(date '+%Y-%m-%d %H:%M:%S %Z')"
MONTH_FILE="$REMINDERS_DIR/monthly-reminder-$(date '+%Y-%m').txt"
LOG_FILE="$REPORTS_DIR/monthly-reminder.log"

mkdir -p "$REPORTS_DIR" "$REMINDERS_DIR"

MESSAGE="[$STAMP] CryptoDirectory monthly update reminder: review submissions, run audit, rebuild, publish to IPFS, and update ENS contenthash."

echo "$MESSAGE" >> "$LOG_FILE"
cat > "$MONTH_FILE" <<EOF
CryptoDirectory Monthly Reminder
Generated: $STAMP

Suggested monthly checklist:
1. Review and update project entries in content/projects/.
2. Run: node scripts/check-links.mjs
3. Run full release ritual: npm run release:monthly -- "monthly release notes"
4. Update ENS contenthash for cryptodirectory.eth (if not already done)
EOF

# Optional desktop notification if a graphical session is available.
if command -v notify-send >/dev/null 2>&1; then
  if [ -n "${DISPLAY:-}" ] || [ -n "${WAYLAND_DISPLAY:-}" ]; then
    notify-send "CryptoDirectory Reminder" "Monthly update tasks are due. See $MONTH_FILE"
  fi
fi

logger -t crypto-directory "$MESSAGE"
