# Catalogue pagination

The public catalogue and category documents show at most 50 verified entries per
page. Existing first-page URLs are retained: `/` and `categories/<slug>.html`.
Later documents use `pages/<number>.html` and
`categories/<slug>/<number>.html`. Every page has normal first/previous/next/last
links, a distinct canonical, and a sitemap entry. Links and assets remain
relative so the same build works on the established ENS/IPFS mirror.

The configured `SITE_URL` continues to determine canonical and sitemap origins.
Production keeps its established primary-domain setting. Sitemaps omit `lastmod`
because a build timestamp does not establish when each page's content changed.

Search on the catalogue pages loads the existing `data/projects.json` only when
needed. It searches all verified projects by name, description, tag and ecosystem,
and intersects the selected lead category. Result pages use local buttons rather
than new filter URLs. Clearing the controls restores the original document's page.
If the request fails, static browsing remains available and search can be retried.
The optional search does not depend on authentication or a writable API.

The full data feed, filename-derived IDs, verification statuses and Surf contract
are unchanged. This change creates no project profiles. Generated category and
catalogue page directories are recreated during each build so obsolete pages
cannot retain withdrawn records. Staff pages keep their existing noindex policy.
The release manifest and IPNS publisher retain their existing artifact limits.

`npm run test:directory` builds isolated fixtures to validate complete page/ID
coverage, relative links, metadata, source-data preservation, obsolete-page
removal and client search states, including races and failures. The existing
`npm run test:directory-browser` also traverses native pagination with JavaScript
disabled and checks search and authorized editing. The normal build generates
all release files and the existing release manifest includes every new document.
