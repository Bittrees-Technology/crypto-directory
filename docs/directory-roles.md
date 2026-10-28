# Directory sign-in, editing and submissions

CryptoDirectory uses the existing shared Bittrees email/Ethereum sign-in. The
top-right control opens the canonical shared LoginPanel, branded CryptoDirectory,
at the Roles issuer and returns through the registered `crypto-directory-admin`
client with PKCE and a host-only session. A sign-in proves identity, not a role.
The Roles companion release must precede the directory release.

| Current project authority | Navigation | Existing listings | New submissions |
| --- | --- | --- | --- |
| Superadmin / Admin | All four staff links | Propose metadata updates | Submit; review another person's submission |
| Editor | All four staff links | Propose metadata updates only | Cannot submit or decide |
| Reviewer | All four staff links | No edits | Review and accept/reject only |
| Signed in, no staff role | Staff links hidden | Public reading | Submit and inspect own submissions |
| Signed out | Staff links hidden | Public reading | Sign in first |

Roles combine only when separately assigned. Partner tiers and browser-provided
role labels confer no staff access. Administration remains verified-wallet-only;
Editor/Reviewer may use a properly assigned wallet or verified email identity.
The existing central authority must be current, enrolled and source-bound.
The server rechecks authorization immediately before each repository mutation.

The public directory and previously published static data remain public.
Hiding navigation is presentation, not a confidentiality boundary. The new
submission queue and mutation API enforce server authorization. On eth.limo,
sign-in and staff operations open the canonical `cd.bittrees.org` origin; the
IPFS mirror never receives session cookies, private app keys or signing authority.

## Review and release

Submissions are separate from `content/projects` on the `directory-intake` branch.
The form explicitly discloses public storage of submitted business details and
review rationales. Sign-in emails and wallets are replaced with keyed opaque
identifiers before storage. An individual may have at most three pending items.
Each queue and edit journal holds at most 256 records / 1 MiB total and stops when
full; no automatic deletion or archival is performed.

An independent Reviewer/Admin accepts or rejects the unchanged submission with a
rationale. Self-review is denied. Acceptance creates a pull request adding exactly
one listing; rejection never creates a listing. Editors can propose changes only
to an existing non-rejected listing at its current content SHA and cannot change
verification state. Submitted entries stay pending until a review; accepted source
proposals are marked verified but remain unpublished until the protected release.

The app never merges, bypasses checks or deploys. The existing repository review,
CI, production deployment and verified IPNS synchronizer publish approved source
to both public addresses. Acceptance means accepted for release review, not live.

Storage uses signed records and GitHub's expected-content-SHA update. Operations
are reserved durably before source writes. A retry reconciles an exact existing
PR, sole changed file and content hash; an absent/changed/closed-unmerged result
is held for an administrator, not replayed. Preserve journals and source branches
while outcomes remain uncertain.

## Repository connection

Use a GitHub App installed only on `Bittrees-Technology/crypto-directory` with
**Contents: read/write**, **Pull requests: read/write**, and the mandatory Metadata
read permission. No organization, administration, workflow, issue, billing or
secret permissions are needed. The app exchanges its key for an installation
token explicitly restricted to this repository and those two write permissions.
Do not substitute a broad personal-access token or store a user's GitHub token.

Set these encrypted variables on the existing Vercel project after review:

- `DIRECTORY_GITHUB_APP_ID`
- `DIRECTORY_GITHUB_INSTALLATION_ID`
- `DIRECTORY_GITHUB_APP_PRIVATE_KEY`
- `DIRECTORY_JOURNAL_SECRET`: a separately generated random secret of at least 32 characters

Keep keys in the existing approved local key storage and enter them directly into
the service's secret configuration, never Git, chat, PRs or logs. Journal-key
rotation requires an explicit verified migration preserving records and subject
ownership; changing it without migration intentionally makes old data unavailable.
The app does not accept a general GitHub token fallback. With missing settings,
sign-in remains usable and writes fail closed with a setup notice.

No new database, pinning provider, paid service or subscription is provisioned.
Maintain the organization-wide $0 additional-spending controls. Routine existing
Vercel releases follow the standing release authorization; any new paid resource
or budget change needs separate explicit approval.

## Role activation and acceptance

The Roles companion stages Editor/Reviewer definitions without changing the active
registry manifest or appointing a person. Finish any existing controller/registry
transition first. Prepare the new policy from the then-current verified head,
approve its exact policy/manifest/definitions in the existing controller/Safe/TLD
flow, wait for finality, and only then enable
`CRYPTO_DIRECTORY_STAFF_ROLES_ENABLED=1` in Roles. Assign people separately through
the existing scoped role-management flow. No sign-in or app release replaces these
approvals. Do not sign or send transactions as part of the build/deployment.

After setup, perform live email and wallet sign-in, revocation and account-switch
checks with authorized test identities. Exercise a real submission, independent
accept/reject, Editor-only update, protected PR and synchronized public release.
Local browser fixtures and passing CI do not establish those live acceptances.

Local checks: `npm run test:directory`, `npm run test:ens`, publishing unit tests,
`npm run build`, and `npm run test:directory-browser`. Browser checks use explicit
synthetic identities and repository responses, without creating live records.
