# CryptoDirectory Design Spec

## Goal
Ship a static, low-maintenance directory for active onchain companies and projects.

## Required design outcomes
- A public index page exists for browsing the directory.
- Shared visual styling is centralized in a reusable stylesheet.
- Category landing pages are generated from project metadata.
- Operational queue pages exist for `pending_audit` and `needs_update` entries.

## Evidence mapping
- `site/index.html`
- `site/assets/styles.css`
- `site/categories/*.html`
- `site/review.html`
- `site/needs-update.html`
