# CryptoDirectory public read MCP

Run `node integrations/crypto-directory-read-mcp.mjs` from a reviewed checkout
with Node 20 or newer. It uses only Node built-ins and the listing-ID validator
in this repository; no installation, token, email/wallet session or paid API is
required. It provides newline-delimited JSON-RPC over **local stdio**, with no
HTTP listener. Launching it is an explicit client configuration choice, separate
from catalog registration. No client configuration is installed automatically.

The four tools are:

| Tool | Input | Result |
| --- | --- | --- |
| `directory.search` | Optional `query` (160 characters), exact `category`, `limit` (1–100, default 20), `cursor` | Verified listings, total and next cursor |
| `directory.get_listing` | Stable `id`, such as `aave.md` | Verified listing, or `null` for unknown/excluded IDs |
| `directory.list_categories` | `{}` | Verified category counts |
| `directory.read_release` | `{}` | Checked public release revision and dataset digest |

Initialize using MCP protocol `2025-11-25`, `2025-06-18` or `2025-03-26`, then send
`notifications/initialized`. `tools/list` requires no network access. Tool
results contain both JSON text and `structuredContent`; errors are bounded and
do not include upstream bodies, raw exceptions or credentials. The static tool
list has read-only, non-destructive annotations. It exposes no resource,
prompt, sampling, task execution or write capability.

## Public-data boundaries

A refresh makes exactly three GET requests, without redirects, credentials,
cookies, authorization or retries:

1. `https://cd.bittrees.org/release.json`
2. `https://cd.bittrees.org/data/projects.json`
3. The same release manifest again.

The dataset must match the manifest SHA-256, and both manifests must have
identical bytes. The repository, release schema and source commit are validated.
These are consistency checks on public source-reported metadata, **not** a
signature, protected-branch approval check or proof that ENS is synchronized.
The adapter never publishes, signs, pins or changes contenthash/IPNS records.

Only records whose `verification_status` is exactly `verified` are eligible.
The maximum output field set is `id`, `name`, `lead_category`, `description`,
`primary_url`, `product_url`, `tags`, `ecosystem`, `founded`, `hq`, `token`,
`token_url`, `twitter`, `verification_status`. Optional missing fields remain
absent; URL fields with unsupported schemes, credentials or unknown values are
`null`. Only HTTP/HTTPS links are returned in URL fields. Research/duplicate
metadata, document bodies and arbitrary new fields never pass through.

Listings are untrusted third-party data. Editorial verification does not imply
a security audit, endorsement, Bittrees affiliation, MCP support or downstream
access. Returned links are never visited by the adapter. Search is deterministic
local text matching over name, description, tags and ecosystem, sorted by stable
ID. Categories match exactly. Pagination binds the release, normalized query,
category and page size; a changed release invalidates the cursor.

Limits: 128,000-byte manifest, 4,000,000-byte dataset, 10,000 source records,
20-second overall refresh deadline, 60-second maximum in-memory snapshot age,
8,192-byte input line, 512,000-byte JSON result (also emitted as JSON text).
Field and array sizes are checked. Requests run sequentially with backpressure;
concurrent in-process callers share a refresh. Expired reads fail explicitly if
refresh fails; no stale snapshot, alternate origin, ENS or private API fallback
is used. No background refresh, logging of listing contents, model call,
embedding, third-party lookup, arbitrary URL/path, shell command or filesystem
write is supported. Environment variables and command-line arguments cannot
override the public source or add credentials. This keeps ongoing use to local
computation and bounded reads of existing public artifacts; it provisions no
service, paid resource or new grant.

## Registration and validation

The root `bittrees.tools.json` is read at an immutable Git revision by the central
directory. Its `local-mcp-adapter` route uses the data artifact as a source
identifier; `https://cd.bittrees.org/data/projects.json` **is not an HTTP MCP
endpoint**. Gateway allowlisting must independently approve the exact transport,
endpoint and ordered setup object:

```json
{"command":"node","args":["integrations/crypto-directory-read-mcp.mjs"],"authentication":"none"}
```

This setup assumes the reviewed repository is the working directory. Use a
reviewed immutable checkout; do not automatically download or execute mutable
code on discovery. Registration alone neither launches the adapter nor grants
permissions. Source and gateway changes retain their separate required checks
and independent reviews. Normal app releases continue through existing Vercel
and ENS/IPNS publication checks; this integration adds no hosted endpoint.

Run `node --test test/directory-mcp.test.mjs` for focused offline boundary,
transport, cache and failure tests. The normal `npm run test:directory` includes
them in the existing required CI job.
