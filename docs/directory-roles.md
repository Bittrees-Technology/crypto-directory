# Directory sign-in, editing and submissions

CryptoDirectory uses the existing shared Bittrees email/Ethereum sign-in. The
top-right control opens the canonical shared LoginPanel, branded CryptoDirectory,
at the Roles issuer and returns through the registered `crypto-directory-admin`
client with PKCE and a host-only session. A sign-in proves identity, not a role.
The Roles companion release must precede the directory release.

The header places “Submit a project” and “Request an edit” immediately before
the account control on every page, including while signed out. The forms still
require sign-in and enforce their permissions on the server.
Edit-request sign-in returns through the issuer's existing allowed `submit.html`
route with a fixed `form=request-edit` marker. Once the server confirms a session,
the app resumes `request-edit.html`, preserving only a validated listing filename.
Caller-provided destinations and off-site redirects are never accepted.

Wallet accounts display their ENS primary name when ENS's Universal Resolver
successfully verifies its forward address. The full authenticated wallet remains
available as the identity label's tooltip. Names never replace wallet identity,
roles or signing authority. Lookups use a bounded, cached, read-only request to
PublicNode's public Ethereum endpoint and do not delay the sign-in session.
Missing records, RPC failures, invalid normalization and CCIP-only records retain
the shortened wallet address. Resolver-selected offchain URLs are not fetched.

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

Signed-in nonstaff, Editors and Admins can request corrections to an existing,
non-rejected listing. Reviewers retain their new-submission-only role. Requests
are stored as `editRequests` in the existing signed intake journal; old journals
without that field remain compatible. Requests are idempotent and limited to
three pending per person and 256 total. Only Editors/Admins see other people's
requests, open them in the existing editor, or close them with an outcome note.
Closing a request records its review outcome only; it neither edits a listing nor
claims a change was released. The existing editor creates a separate protected
release proposal using the current listing SHA and preserving verification state.

Submission, direct editing and edit requests use the same twelve listing controls:
name, lead category, description, website, product URL, tags, networks, founding
year, HQ/country, token, optional token information URL and X/social URL. Token
links are editable metadata; an omitted optional field remains compatible with
older clients, and an explicit empty or `n/a` value removes that optional link.
Verification and approval fields are never offered as editable controls.

Selecting a listing in the request form reads its current metadata and SHA.
Structured requests retain the original field values and only the proposed field
changes. Unchanged requests and stale SHAs are rejected. Editors see the field
comparison and receive those changes in their draft only while the original SHA
still matches; otherwise current listing values stay intact for manual review.
The older free-text request format and existing journal records remain supported.

“Request removal” switches the form from metadata fields to explicit reason
checkboxes: shutdown, unavailable website/product, duplicate, merger/rebrand,
out-of-scope, inaccurate/misleading listing, security/impersonation concern, or
other. At least one reason and an explanation are required. The server rejects
unknown reasons and mixed removal/edit payloads. Removal requests only record
review evidence: they do not delete files, change verification, hide listings or
create a release proposal. Editors/Admins can inspect the source and close the
request with an outcome; an administrator must separately prepare the protected
removal proposal. No new deletion capability or role grant is introduced.

Submissions are separate from `content/projects` on the `directory-intake` branch.
The form explicitly discloses public storage of submitted business details and
review rationales. Sign-in emails and wallets are replaced with keyed opaque
identifiers before storage. An individual may have at most three pending items.
Each queue and edit journal holds at most 256 records / 1 MiB total and stops when
full; no automatic deletion or archival is performed.
The data-only `directory-intake` branch is excluded from Vercel Git deployments,
and the existing CI push trigger remains main-only. Intake journal updates must
not create preview builds or model-review jobs. Actual listing proposals retain
the ordinary required PR checks and release process.

An independent Reviewer/Admin accepts or rejects the unchanged submission with a
rationale. Self-review is denied. Acceptance creates a pull request adding exactly
one listing; rejection never creates a listing. Editors can propose changes only
to an existing non-rejected listing at its current content SHA and cannot change
verification state. Submitted entries stay pending until a review; accepted source
proposals are marked verified but remain unpublished until the protected release.

The app never merges, bypasses checks or deploys. The existing repository review,
CI, production deployment and verified IPNS synchronizer publish approved source
to both public addresses. Acceptance means accepted for release review, not live.
Duplicate checks use the production listing index only when its release source
matches current main and its bytes match the release manifest. A stale or changing
release is held; generated repository files are not assumed current after later
listing-only PRs. No GitHub token or session cookie is sent with these public reads.

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
