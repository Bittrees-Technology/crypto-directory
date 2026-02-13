# Submissions Intake

Use this folder to collect candidate listings before they become official project entries.

## Flow
1. Collect candidate data as JSON in `content/submissions/inbox/`.
2. Review and move accepted files to `content/submissions/approved/`.
3. Run `npm run import-submissions` to convert approved files to `content/projects/*.md`.
4. Audit each imported entry and keep `verification_status: pending_audit` until reviewed.

## Required Submission Fields
- `name`
- `lead_category`
- `tags` (array)
- `ecosystem` (array)
- `description` (1-2 sentences in English)
- `primary_url`
- `product_url` (`n/a` allowed if no distinct app URL)
- `founded`
- `hq` (country or `Metaverse`)
- `token` (`n/a` allowed)
- `twitter` (`n/a` allowed)

## Notes
- Import script defaults `verification_status` to `pending_audit`.
- Existing project files are not overwritten.

