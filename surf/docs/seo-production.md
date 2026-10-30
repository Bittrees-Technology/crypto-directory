# Surf production SEO

Surf's canonical public URL is **https://surf.bittrees.org/**. This release preserves the wave landing page, happy discovery section, footer, embedded viewer and CryptoDirectory's verified-only feed.

## Source audit and changes

| Area | Result |
| --- | --- |
| Search identity | Descriptive title and summary identify Surf, Bittrees and Web3 discovery. No project totals are frozen in metadata. |
| Canonical | One server-delivered canonical points to the homepage, including shared project query URLs. |
| Duplicate entry points | Permanent redirects consolidate `/index`, `/index.html` and the exact primary Vercel alias. Preview hosts are excluded from the host redirect. |
| Social previews | Matching Open Graph and Twitter metadata reference a local 1200 × 630 PNG, with dimensions and alternative text. |
| Site identity | One JSON-LD graph describes WebSite, WebPage and the actual Bittrees publisher. No invented reviews, ratings or search endpoint. |
| Icons | SVG favicon retained; raster favicon and Apple touch icon added. |
| Crawl files | Existing robots.txt allows the landing/assets and advertises the sitemap. The sitemap contains only the canonical homepage. |
| Non-page responses | API and catalog/data responses receive `X-Robots-Tag: noindex, nofollow`. Authentication remains a separate security boundary. |
| Missing pages | Static 404.html provides recovery navigation and noindex metadata. No catch-all rewrite turns unknown URLs into a successful homepage response. |
| JavaScript unavailable | The main content, metadata and a direct CryptoDirectory link are readable without executing JavaScript. The dynamic count has a meaningful fallback. |
| Security and preview indexing | Existing CSP and deployment protection are retained. Vercel's automatic preview noindex is not overridden with an indexing response header. |
| Static delivery | No new runtime dependencies, external fonts, analytics or blocking third-party resources. The share image is not loaded as a landing-page image. |

## Validation

The required root CI runs Surf's build, unit/security checks and Chromium acceptance. SEO checks cover consistent canonical/search/social identities, raster assets and dimensions, valid structured data references, canonical-only sitemap, crawl directives, JavaScript-disabled content and genuine unknown-page 404 responses in the fixture server. The browser fixture applies the production CSP to its static responses.

Fixture responses do not prove the live Vercel routing, Google indexing, or field performance. Do not report a Lighthouse score or a Core Web Vitals pass without an actual measurement.

## Live verification and remaining Google work

The authorized public HTTP audit on 2026-10-30 confirmed the deployed homepage matches reviewed HTML blob `9e7e914309fb5f46f701d736ffef466a66373278`. The canonical homepage returns 200, has no noindex response header, and serves the expected metadata/JSON-LD. HTTP and index-path variants redirect permanently. Unknown paths return the branded page with HTTP 404 and noindex metadata. Crawl files, raster images/dimensions and API/data indexing controls passed. HTML and JSON are Brotli-compressed. At that check, static and live Surf catalogs each contained the same 1,488 verified IDs as CD, with no missing or extra IDs; the live catalog remains the source of truth as CD curation continues.

The live audit found that Vercel's wildcard alias redirect matched non-root paths but left the empty root path unredirected. The configuration now includes an explicit, host-scoped root redirect. Its final production response is checked by the release workflow, including shared-query preservation and canonical-host loop protection.

Small landing text was below 4.5:1 contrast in the footer, eyebrow and description. A consistent darker muted green brings those pairs above 4.5:1 without changing layout or artwork. A numerical contrast regression check guards the actual source colors.

### Repeatable production checks

`.github/workflows/surf-seo-audit.yml` runs on Surf production source pushes. It waits for the public HTML, JavaScript and both stylesheets to match the checked-out release bytes before checking redirects, status codes, crawl files, image dimensions and API noindex/private-cache headers. It then uses pinned Lighthouse 13.6.0 with the standard public runner's preinstalled Chrome to collect mobile and desktop reports and upload the HTTP receipt and lab results. No production credentials or personal browser session are used.

Google's anonymous PageSpeed API returned HTTP 429 quota errors for both profiles during this audit. The independent Lighthouse results are lab measurements, not PageSpeed/CrUX field data or a field Core Web Vitals pass. Inspect those results for LCP, CLS and blocking work; actual-user INP/CrUX data still needs separate verification.

Browser/Search Console control is not available in this session. The remaining account steps are:

1. Reuse the verified `sc-domain:bittrees.org` property and established account; do not create a duplicate property.
2. Inspect `https://surf.bittrees.org/`, run Google's live test and confirm the canonical and useful landing content.
3. Check whether `https://surf.bittrees.org/sitemap.xml` is already submitted. Submit only if needed and record Google's actual status and discovered-page count.
4. Request homepage indexing once if eligible and not already requested. Record the acknowledgement; it is not proof of indexing or ranking.
5. Track the Surf homepage with a page filter in Search Console, and review field performance when data is available.

This SEO release does not configure or verify live shared Bittrees sign-in/storage activation, widen trust, or modify CryptoDirectory listings.

## Primary references

- [Google JavaScript SEO](https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics)
- [Google canonical URLs](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls)
- [Google site-name structured data](https://developers.google.com/search/docs/appearance/site-names)
- [Google sitemap guidance](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap)
- [Vercel response headers](https://vercel.com/docs/headers/response-headers)
- [Vercel custom 404 guidance](https://vercel.com/kb/guide/custom-404-page)
