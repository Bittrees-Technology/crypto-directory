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

## Live checks still required

The live HTTP audit was declined during this task. After it is authorized, verify:

1. Homepage returns 200 on the canonical HTTPS host, without an indexing block; HTTP redirects to HTTPS.
2. Primary Vercel alias and `/index` variants redirect without loops, preserving shared query parameters.
3. Unknown paths return HTTP 404 with the branded recovery page, rather than a 200 soft 404.
4. robots.txt, sitemap.xml, share image, icons, CSS and JavaScript return their correct content types; data/API responses carry noindex.
5. The actual homepage metadata and JSON-LD match the reviewed source. Preview protection and preview noindex remain active.
6. Measure mobile/desktop PageSpeed and available CrUX/Core Web Vitals; inspect any real LCP, CLS or INP issues before changing caching or rendering behavior.
7. In the verified bittrees.org Search Console property, submit `https://surf.bittrees.org/sitemap.xml`, inspect the homepage and request indexing if appropriate. A sitemap declaration is not evidence that Search Console accepted it or that Google indexed the site.

Shared Bittrees sign-in and private collection storage still require their separate activation work. This SEO release does not configure credentials, widen trust, or modify CryptoDirectory listings.

## Primary references

- [Google JavaScript SEO](https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics)
- [Google canonical URLs](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls)
- [Google site-name structured data](https://developers.google.com/search/docs/appearance/site-names)
- [Google sitemap guidance](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap)
- [Vercel response headers](https://vercel.com/docs/headers/response-headers)
- [Vercel custom 404 guidance](https://vercel.com/kb/guide/custom-404-page)
