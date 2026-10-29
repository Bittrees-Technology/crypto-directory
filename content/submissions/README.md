# Submissions Intake

Use this folder to collect candidate listings before they become official project entries.

## Research batches

[500 additional sites, including crypto/Web3 AI agents (29 October 2026)](research/2026-10-29-500-sites.md)
contains proposed listing fields, sources and bounded homepage checks. The batch
is awaiting review and is not an accepted submission. Merging category or
research changes does not approve its candidates. Research files are not
imported automatically or included in the public project data.

## Publication review

The [first publication review](reviews/2026-10-29-first-publication.md) selected
100 actual project entries, including 13 crypto/Web3 AI Agents.
The [completion review](reviews/2026-10-29-complete-500-additions.md) proposes
400 further entries: 195 more from the historical research batch and 205
supplementary projects. Together these reach 500 additions and 1,531 total
entries after approval. Every new entry stays `pending_audit`.

The historical research batch remains unchanged. The completion record gives
each of its remaining candidates and each supplementary candidate a disposition;
shutdowns, unresolved identities, duplicate aliases and unavailable interfaces
are not automatically published. Public code libraries may use their canonical
GitHub repository as their website. Independent repositories are distinct;
branches, README routes and `.git` links do not create another project.

Publication requires independent protected-branch approval, passing required
checks and the normal dual-host release. An eligibility review is not a security
audit, investment recommendation, executed product test or role grant.

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

