# Submissions Intake

Use this folder to collect candidate listings before they become official project entries.

## Research batches

[500 additional sites, including crypto/Web3 AI agents (29 October 2026)](research/2026-10-29-500-sites.md)
contains proposed listing fields, sources and bounded homepage checks. The batch
is awaiting review and is not an accepted submission. Merging category or
research changes does not approve its candidates. Research files are not
imported automatically or included in the public project data.

## Publication review

The [first publication review](reviews/2026-10-29-first-publication.md) selects
100 candidates for actual `content/projects/` entries, including 13 crypto/Web3
AI Agents. It records official project/product evidence and retains
`pending_audit` status. The remaining 400 suggestions stay in research; known
duplicates, rebrands and product-access problems are recorded separately.
The historical research batch remains unchanged. Publication still requires an
independent protected-branch approval, passing checks and the normal dual-host
release; merging research by itself never publishes a listing.

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

