# Monthly Ops Checklist

## 1) Intake
- Review any submitted candidates.
- Pre-filter obvious scams/dead projects.
- Confirm each candidate has live `primary_url` and product/app link.

## 2) Categorize
- Assign one `lead_category`.
- Add useful `tags` for secondary classification.
- Add chain/ecosystem labels.

## 3) Normalize
- Keep descriptions in English (1 to 2 sentences).
- Normalize location to country, or `Metaverse` when unknown.
- Use `n/a` for unavailable token/Twitter instead of blank fields.

## 4) Verify
- Set `verification_status` to:
  - `verified` for reviewed entries
  - `needs_update` when uncertain
  - keep `pending_audit` for new unreviewed listings

## 5) Build
- Run: `node scripts/build.mjs`
- Confirm generated files:
  - `site/index.html`
  - `site/categories/*.html`
  - `site/data/projects.json`

## 6) Release Log
- Record monthly release details in `releases.md`:
  - date
  - entry count
  - notes
  - IPFS CID (when publishing starts)

## 7) ENS/IPFS (when enabled)
- Pin `site/` to IPFS.
- Update `cryptodirectory.eth` contenthash to latest CID.
- Keep older CIDs in `releases.md` for rollback.

## 8) Strict release ritual
- Run the full monthly release flow in order:
  - `audit -> build -> publish -> ENS update -> append releases.md`
- Command: `npm run release:monthly -- "Monthly notes here"`
- Operator runbook: `monthly-release-checklist.md`
- This runs:
  - `node scripts/audit-report.mjs`
  - `node scripts/process-status-report.mjs`
  - `node scripts/build.mjs`
  - `./scripts/publish-ipfs.sh --skip-build`
  - manual ENS reminder
  - release append in `releases.md`
  - timestamped audit and process-status evidence logs under `reports/`
