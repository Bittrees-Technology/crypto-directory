# Surf — Surf the new web

A wave-themed landing page and a StumbleUpon-style browser for CryptoDirectory websites and products.

## Run and validate

Node 22 or later. The app has no runtime package dependencies.

```sh
npm run build
npm test
npm run dev
```

From the repository root, after its existing `npm ci` and Playwright Chromium setup, run `npm --prefix surf run test:browser`. The required root `build-and-check` job runs Surf's build, unit/security checks and synthetic Chromium regressions using that same setup on the standard public runner.

## Discovery

Pressing Surf keeps the toolbar visible and opens the real destination in a sandboxed iframe. The account/session cookie remains host-only and HttpOnly. Remote pages cannot navigate the top-level Surf window. Frame preflight honors CSP frame-ancestors and X-Frame-Options; it never proxies sites or strips their protections. Blocked sites get an explicit external-link fallback. Unknown compatibility still offers an external link if the frame does not load.

The preflight accepts only current verified directory IDs and website/product types. HTTPS destinations and every redirect resolve through a public-address guard, with DNS results pinned to the outbound request. No arbitrary caller-supplied URLs are fetched.

CryptoDirectory's public feed remains the catalog source of truth. The server fetches it with a five-minute CDN cache; a dated snapshot is clearly labeled during outages. Visible pages refresh every five minutes and on returning to the tab.

## Identity and refresh repairs

Project IDs now use CryptoDirectory's stable entry filenames, never destination URLs. `public/legacy-ids.js` retains the original URL identifiers so existing bookmarks and shared links keep resolving when URLs change. Guest saves migrate once from `bittrees.surf.v1` to `bittrees.surf.v2`; removed migrated saves are not resurrected on reload.

Every refresh rechecks whether the current entry is still verified, in the selected category, and has the selected link type. It replaces invalid selections or removes the iframe, visible content and all outbound hrefs when no replacement exists. All modal selections re-resolve the stable ID and current URL at click time. Normal clicks and middle-button auxclicks each record one outbound visit; right clicks do not.

## Shared Bittrees account and private saves

The Surf side uses the existing Bittrees SSO client protocol copied from CryptoDirectory, including exact callbacks, PKCE, sealed browser transactions and short-lived one-use handoffs. It requests authentication only, with no administration or wallet-transaction authority. Sessions are random opaque tokens stored by hash in private Redis storage. Sign-out revokes the server-side session.

Account bookmarks are isolated by a keyed identity digest. Website and product saves remain distinct. Writes require the exact Surf origin and session-bound CSRF, and destination URLs are re-read from the current verified catalog. Personal bookmarks are never written to the public GitHub repository or directory feed. Guest saves and history stay local; importing guest bookmarks into a signed-in collection requires an explicit visitor action.

**Activation is pending and is a release prerequisite.** The live Roles service must register a native `surf` SSO client with origin `https://surf.bittrees.org` and exact callback `https://surf.bittrees.org/api/sso/callback`, and route its shared sign-in screen's `app=surf` return flow to Surf. Surf needs these private Vercel variables, provisioned through approved account/storage setup:

- `SURF_SSO_CLIENT_SECRET`: independent random server secret; only its SHA-256 hash is registered with Roles.
- `SURF_REDIS_REST_URL` and `SURF_REDIS_REST_TOKEN`: dedicated private Redis REST storage for Surf sessions and collections.

Do not reuse another app's SSO client identity, overwrite existing protected client registrations, expose secrets in public-prefixed variables, or claim live sign-in based only on synthetic tests. Missing configuration produces an honest unavailable state; device-local saves still work.

## Deployment and release

Vercel project `bittrees-surf`, Root Directory `surf`, preset Other, build `npm run build`, output `public`, custom domain `surf.bittrees.org`. Its production environment currently tracks `surf-production`. Source revisions under review belong on a feature branch and receive preview deployments only. Do not update that production branch or promote a preview before the final source, required checks, shared-sign-in activation and fresh review are confirmed.

The earlier PR #21 was merged externally at its unchanged head. This follow-up carries the identity/refresh/middle-click repairs, their regression coverage, required CI wiring, and the embedded viewer and preserved landing-page requests. Discussion resolution and approval of the old head are not evidence that this new source passed review.

Browser acceptance is synthetic and does not claim live identities, email delivery, shared-login activation or production database operations.

## Production SEO

See [the production SEO audit and validation checklist](docs/seo-production.md) for canonical URLs, social metadata, structured data, crawler boundaries, and the remaining live HTTP/Search Console/performance verification. The required CI includes SEO unit contracts and browser acceptance; these do not establish live indexing or Core Web Vitals.

Surf production pushes also run the dedicated SEO audit workflow: it verifies the exact deployed assets and public HTTP behavior, then retains mobile/desktop Lighthouse lab reports. These reports are distinct from real-user CrUX/Core Web Vitals and Search Console indexing.
