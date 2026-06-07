# Monthly Release Checklist

Use this checklist when running the monthly Crypto Directory release.

## Preconditions
- Work from `projects/crypto-directory`.
- Confirm IPFS is available in the current shell: `ipfs --version`.
- Confirm the build inputs are up to date:
  - curated source content under `content/`
  - release notes target in `releases.md`
  - current process-status definitions under `content/processes/`

## Source-Of-Truth Boundary
- Editable source of truth:
  - `content/`
  - `scripts/`
  - `releases.md`
  - `reports/` release evidence
- Generated output:
  - `site/`
  - generated JSON under `site/data/`
  - generated HTML such as `site/process-status.html`

Do not treat `site/` as an editable source.

## Release Flow
1. Audit.
   - Run: `npm run audit`
   - Expected artifact: a timestamped audit log when using `npm run release:monthly`.
2. Process status.
   - Run: `npm run process-status`
   - Expected artifact: a timestamped process-status log when using `npm run release:monthly`.
3. Build.
   - Run: `npm run build`
   - Expected outputs:
     - `site/index.html`
     - `site/categories/*.html`
     - `site/data/projects.json`
     - `site/process-status.html`
4. Publish to IPFS.
   - Standalone path: `npm run publish:ipfs`
   - Monthly path: `npm run release:monthly -- "release notes"`
   - Expected output: `CID: ...`
5. Update ENS manually.
   - Set `cryptodirectory.eth` contenthash to `ipfs://<cid>`.
   - Record the proof of the update outside the shell session.
6. Append the release log.
   - Confirm `releases.md` contains the new line with date, CID, entry count, and notes.

## Expected Evidence Per Release
- Audit log in `reports/audit-<timestamp>.log`
- Process-status log in `reports/process-status-<timestamp>.log`
- Published CID from the release output
- Updated line in `releases.md`
- ENS update proof
  - Minimum expected proof: transaction hash or equivalent wallet confirmation tied to the published CID

## Canonical Command
```bash
npm run release:monthly -- "Monthly notes here"
```

## Post-Release Check
- Confirm the new CID appears in `releases.md`.
- Confirm the audit and process-status logs exist in `reports/`.
- Confirm the ENS contenthash update points to the same CID.
- If any step failed, do not treat the release as complete.
