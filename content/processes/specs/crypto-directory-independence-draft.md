# CryptoDirectory Independence Draft

Supersedes: Crypto Directory #59a58504
Task: draft-crypto-directory-independence-product
Status: Planning draft retained in the repository for product review; not approved for release, deployment, DNS changes, visibility changes, auth changes, or legal publication.

## Gate Statements

### gate-1-user-value
CryptoDirectory helps researchers, builders, and operators find active crypto companies and projects by category, ecosystem, product link, and verification status. The first user value is a searchable static directory that reduces repeated manual discovery work.

### gate-2-scope-out-of-scope
In scope for this draft: product positioning, standalone runtime expectations, curation boundaries, onboarding path, support placeholders, release readiness, and optional integration boundaries for CryptoDirectory.

Out of scope for this draft: implementing product changes, deploying the site, changing DNS or ENS contenthash records, changing visibility, disabling or bypassing auth, writing legal terms, writing privacy policy text, creating a sibling product dependency, or making Bittrees required for runtime.

### gate-3-onboarding-first-value
The onboarding path starts with the public directory home page and category pages. A new visitor should get first value by searching or scanning entries without signing in, connecting a wallet, installing another product, or understanding any internal Bittrees workflow.

### gate-4-release-status
Release status is product-owned draft. The repository currently has static build and audit commands, but this draft does not authorize production release. A release owner must separately approve launch readiness, publish targets, and rollback evidence before any deployment.

### gate-5-trust-support-placeholders
Trust and support are product-owned placeholders, not legal content. Current concrete trust evidence is the in-repo `SECURITY.md`, curation policy, monthly operations documentation, build output, audit output, and generated process-status data. Blockers before public launch are product-owned support contact, product-owned trust/support page copy, and product owner approval for any legal or compliance references.

### gate-6-standalone-entry-runtime
CryptoDirectory must remain a standalone entry and runtime. The first screen, generated static site, project data, submission page, review pages, build script, audit script, and process-status output live in this repository and must run from this repository without requiring a sibling checkout.

### gate-7-no-sibling-bittrees-dependency
CryptoDirectory must not require Bittrees, SkillMesh, or any sibling repository to build, run locally, serve static output, onboard a reader, or deliver the directory's first user value. Bittrees may appear as a listed project entry, but it is not a runtime dependency or prerequisite user journey.

### gate-8-optional-integration-boundaries
Any integrations are optional boundaries. IPFS, ENS contenthash updates, submission imports, status-update CSVs, and monthly release automation may support operations, but the directory must still provide standalone static value when those integrations are absent or deferred.

## Evidence Plan

- Runtime entry: `site/index.html` generated from repository-local content.
- Local build: `npm run build`.
- Local audit: `npm run audit`.
- Independence validation: `npm test`.
- Product review blocker: support/trust copy owner and launch approval are not identified in this draft.
