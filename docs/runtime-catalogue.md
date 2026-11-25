# Entry data and software releases

Ordinary entry changes must not create GitHub commits, branches, pull requests,
builds or IPNS updates. GitHub remains the reviewed source of application code.
The approved Markdown release is an explicit bootstrap/rollback snapshot, not an
ongoing writer after runtime activation.

## Source-owned data

The runtime store holds the catalogue, encrypted native intake/consent journal,
operation receipts and publication revisions. It runs on existing local storage;
no hosted database, account, paid feature or automatic fallback is provisioned.
The fixed source application is its authenticated client. Browser input cannot
select a database, host, identity, authority, repository or backend.

The private origin accepts bounded, signed server requests, with a pinned store
identity and replay protection. It never accepts browser cookies, arbitrary SQL,
URLs to fetch, executable content or direct caller assertions of a role. Its
service key is separate from storage encryption, Roles, wallet and IPNS keys.
Public responses contain only listing fields and catalogue provenance.

Every publication is a compare-and-set transaction: validate the current queue
revision, listing SHA, unchanged approved content, original operation and actor;
apply the listing or tombstone; record the native decision and durable receipt;
advance the catalogue revision together. A conflicting writer or a decision
expired at the precommit guard must leave the transaction unchanged. Reusing an operation with different content
or identity fails. A lost response is reconciled by the original operation, not
by inventing a new one or replaying an uncertain write.

Roles decisions retain their original checkedAt/expiresAt and shorter upstream
deadlines. Permission must remain current at the guarded database mutation after
lock acquisition. Database time does not start another five-second window. A
commit returning after expiry has an uncertain caller outcome and requires a
fresh authorized receipt read. This is not globally atomic Roles revocation.

## Existing permissions

- Any authenticated account may submit a new project or request an edit/removal.
- Editors propose changes to existing records; they cannot approve, restore or
  publish their own changes merely by editing them.
- Reviewers accept/reject the exact unchanged request. Corrections preserve an
  existing hold unless the reviewer explicitly verifies the listing.
- Current wallet-backed Admin/Superadmin accounts retain their audited native
  self-review exception. This does not grant roles or waive GitHub code review.
- Automatic approval still requires an explicitly assigned Reviewer, exact
  enrolled source connection, current delegation, consent and original proofs.
  Existing GitHub-step MCP consent is not reinterpreted as runtime publication.

## Public readers

`https://cd.bittrees.org/api/catalogue` returns the public listing array.
`https://cd.bittrees.org/api/catalogue/manifest` binds its store, monotonic
revision, dataset SHA-256 and publication time. Both are credential-free, bounded
and cacheable; private queues and authority checks are never publicly cached.

Directory and category pages on Vercel and ENS load this same canonical dataset.
Pagination uses existing page paths with query parameters, so a growing catalogue
does not require newly built HTML files. An unavailable runtime is labelled as a
saved snapshot, not silently presented as current. The public MCP reader binds
its cursors and results to the runtime dataset digest. Surf must discover the
same runtime source before treating its catalogue as live.

`release.json` remains the manifest of immutable application files, including the
static bootstrap dataset. Its optional `catalogue` descriptor identifies only
the two fixed runtime URLs above. Runtime JSON is outside the IPFS software-file
manifest; the existing publisher still verifies every immutable software file.
An entry update therefore changes a data revision rather than the software CID.

## Migration and activation

1. Review and test application/source changes through normal code protections.
2. Prepare isolated local storage, a dedicated service identity/ingress and
   bounded operational controls; verify existing account costs before activation.
3. Freeze/drain the legacy intake writer. Export its exact signed journal and
   original IDs/ownership/receipts, retaining encrypted consent and uncertain
   operations. Do not republish an old GitHub proposal as a new data approval.
4. Bootstrap the exact approved release with a pinned source commit and data
   digest, preserving all IDs, metadata, bodies and statuses. Verify restoration.
5. Enable one runtime writer, configure its pinned identity and separate keys,
   and disable the legacy writer. Missing runtime configuration fails closed;
   runtime failure must never fall back to a GitHub mutation.
6. Verify native permission boundaries, same-operation recovery, public revision
   convergence on both domains and the separately reviewed MCP connection.

Software prepared locally, a successful fixture, configured secrets, an HTTP 200
or a database receipt alone does not establish live publication on both hosts.

## Trust and operating limits

This is a trusted source-publisher design. Roles signatures are verified by the
existing source application. The data origin verifies a separate HMAC from that
application and checks the forwarded permission interval; it does not itself
verify a Roles signature or chain state. Custody of the service key is therefore
security-critical. Keep it separate from the journal encryption key, sign-in,
Roles, wallet and IPNS keys. The private audit path is source-owned and cannot be
selected through browser or MCP input. Compromise of this trusted publisher is
not cured by a role label or a pinned store UUID.

The transaction checks current permission after acquiring its write lock and
again before commit. A decision expiring before that last guard rolls back all
business effects. A slow disk commit may finish after expiry: its durable data
and receipt remain, but the caller receives a held outcome and must perform a
fresh authorized read of the original operation. This does not guarantee a
strict commit-before-expiry deadline or globally instantaneous revocation.
Live five-second gateway acceptance remains a separate measured requirement.

The public API has a 30-second process cache and a 15-second CDN cache. A committed
revision is distinct from visibility at either website. Both pages read the same
store and validate its digest/identity; an approval link requesting a newer
revision displays a retry state until that revision is visible. Existing open
pages load current data when opened/reloaded; no background polling is added.

Current intake and MCP audit capacity bounds are preserved: 256 records per
native collection and 64 durable MCP operations. Reaching a bound holds new work;
records are never cleared to make space. Large audit batches need a separately
reviewed retention/export design before use through MCP. The database has a
128 MiB page cap, bounded request concurrency and bounded WAL checkpoints.

## Operator preparation

`runtime/serve.py` uses Python's standard library and SQLite 3.42+ (the clock
primitive requires `unixepoch('subsec')`). It binds loopback only. The reviewed
service template runs as a dedicated, unprivileged account, with separate app,
private configuration and writable data directories. No existing Wallet
identity, tunnel, credentials or database is shared.

The private JSON configuration contains exactly `database`, `storeId`,
`serviceKeyFile`, and a loopback `port`. Configuration and service key files must
be private regular files. Nothing in the repository supplies real keys.
`DIRECTORY_RUNTIME_SERVICE_KEY` and `DIRECTORY_RUNTIME_ENCRYPTION_KEY` are distinct
random 32-byte keys, encoded as lowercase hex. Preserve the existing
`DIRECTORY_JOURNAL_SECRET` so historical ownership HMACs remain unchanged.

While the legacy writer is frozen and drained, export its exact signed journal
privately. `scripts/prepare-runtime-migration.mjs` accepts explicit `--commit`,
`--journal`, `--journal-sha256` and absent `--output` paths. Verify the commit is
the current approved main release first; the tool does not replace that approval.
It preserves raw Markdown, Git blob SHAs, all statuses and the full private
journal, then encrypts that journal for the isolated origin. Never put this
package or decrypted journal in GitHub, the public catalogue or the IPFS tree.

`runtime/manage.py --config PRIVATE_CONFIG` supplies explicit `bootstrap`,
`verify`, `backup`, `pause` and `enable` operations. Bootstrap requires the exact
package SHA-256 and approved source commit and refuses an existing database.
Publication starts paused. A SQLite backup is opened and integrity-checked as an
independent restoration, including committed WAL data; its writer remains
paused. `enable` requires the exact revision, journal SHA and public digest plus
an explicit legacy-writer fence assertion. This flag is an operator assertion,
not independent proof that old deployments have drained. Check unchanged legacy
journal tips after the old function lifetime and disable the old GitHub writer
credential before cutover. Do not reset an uncertain operation or create a new
approval from a legacy accepted/accepting record.

The fixed `https://cd-data.bittrees.world` transport is a proposed dedicated origin,
not provisioned by this code. Stable routing, TLS, account/zone coverage and
actual cost controls must be verified before activation. Existing hardware and
a working unrelated tunnel do not establish that route or $0 hosting. A random
temporary tunnel is not an approved substitute.

Activation requires source review, a verified dedicated origin/restore, the
single-writer migration, matching application/ENS software, store-pinned public
readers, and native permission checks. Keep `DIRECTORY_DATA_BACKEND` unset until
those gates pass. Runtime activation sets it to `runtime-v1`, pins
`DIRECTORY_RUNTIME_STORE_ID`, configures the separate keys and sets
`DIRECTORY_LEGACY_WRITES_DISABLED=true`. A software rollback after that fence
must pause writes and retain the runtime catalogue; never resume an older GitHub
writer or silently overwrite live data from the Markdown bootstrap.

MCP additionally needs a new explicit `runtime-v1`/store-bound native owner
consent, a reviewed provider and gateway adapter. The outer Roles signature
format remains v1; only the signed source context/connection binding becomes v2.
Old connections and GitHub `execute_step` actions are rejected. A duplicate
runtime mutation is held with instructions to use fresh `read_operation`; only
an actual matching durable receipt can report publication. The source's default
identity provider is still absent and editorial MCP stays off. No role, device,
connection or permission is created by this release.
