# Curation Policy (v1)

## Inclusion
- Must be active and onchain-focused (company or project).
- AI Agents is initially limited to crypto/Web3 agents, agent frameworks, and
  marketplaces with an explicit onchain use case. General AI tools are excluded
  from this category until a separate scope change is approved.
- Must have a live website and at least one live product/app page.
- Global coverage is allowed from any country/language.
- Directory text is written in English.
- Country/location label is required:
  - Use official country when known.
  - Use `Metaverse` if no official country is listed.

## Exclusion
- Obvious scams.
- Dead or inactive projects.
- Most memecoins (except rare cultural/community significance).

## Allowed
- Anonymous founders/contributors.
- Forks.

## Data Standard Per Entry
- `name`
- `lead_category` (single primary sorting category)
- `tags` (multi-tag allowed)
- `ecosystem` (chain/network tags)
- `description` (1 to 2 sentences)
- `primary_url`
- `product_url` (if different)
- `founded`
- `hq`
- `token` (or `n/a`)
- `twitter` (or `n/a`)
- `verification_status`

## Verification States
- `pending_audit`: awaiting authorized review.
- `verified`: reviewed and accepted through the authorized editorial process.
- `needs_update`: listing exists but data is stale or uncertain.
- Public index, search, categories and Surf show only `verified` listings. Other statuses remain in source and the full data feed for review and history; moving a listing to `needs_update` temporarily removes it from public discovery.
- `rejected`: did not meet criteria (do not publish in main listing).

## Research intake

Research batches under `content/submissions/research/` are candidate suggestions,
not approved listings. A reachable homepage and a third-party registry record
are discovery evidence, not a security audit or proof that a product works.
Reviewers must confirm official ownership, the live product, category fit,
duplicates, activity and exclusion criteria before accepting an entry through
the existing approval process. Unknown founding year, country, token and social
accounts must not be inferred. Research intake is never imported automatically.

## Roles and automatic review

Any signed-in email/wallet account can submit a listing or request a correction
or removal. Editors propose changes to existing listings; Reviewers/Admins decide
new submissions and immutable requested changes. A Reviewer cannot rewrite a
submission while approving it or approve their own submission/request.

Automatic approval requires an explicitly assigned, currently authorized Reviewer
and an approved enrolled source connection with the exact MCP permission. Admin
status, agent key ownership, shared sign-in or valid form formatting alone are
insufficient. The automated reviewer must independently assess the inclusion and
exclusion criteria and record evidence/rationale for the exact unchanged item.
The app does not treat submitted claims as independent verification and does not
invoke a model or fetch caller-supplied project URLs to invent that evidence.

Approval creates a release proposal. Required checks, independent GitHub approval
and synchronized publication remain separate. Removal approval preserves the
source record and audit history and proposes exclusion from public discovery.

