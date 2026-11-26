# Mobile directory and search metadata

At widths up to 800px, each existing table row reflows into a complete listing.
Descriptions use the available width; ecosystem, token and other metadata remain
visible. Desktop keeps the comparison table. The same HTML, content and native
row/column semantics serve both layouts, with CSS rather than a second mobile
catalogue. Staff controls retain their existing permission checks.

Search inputs use 16px text. Category choices, account actions, project links and
pagination have at least 44px touch targets. Category page links wrap on desktop
and form a horizontally scrollable strip on phones. A skip link supports
keyboard navigation. The canonical existing brand icon is served locally.

Public pages have descriptive titles, category-specific descriptions and a
1200x630 social sharing image. The default canonical site is cd.bittrees.org;
the ENS mirror uses the same primary canonical. Explicit SITE_URL overrides
continue to work. Every static pagination page remains self-canonical and in
the sitemap. No fabricated modification dates or search ranking claims are added.

A WebSite/CollectionPage graph describes public directory pages. Bounded ItemList
entries match the displayed verified rows; category and later pages also have
breadcrumbs. Client search and runtime catalogue updates refresh the visible
ItemList without changing the document's canonical URL. Clearing static search
restores the original structured data. JSON-LD safely escapes HTML delimiters.

Sign-in, submission and edit-request workflows carry noindex metadata. Existing
staff-page exclusions remain in place. Entry approvals still use the runtime
catalogue without requiring software releases or GitHub updates.

Validation includes generated-page and metadata checks, both-host synthetic
runtime checks, and existing role/form scenarios. Mobile browser scenarios cover
320, 375, 390 and 768px, touch targets, complete metadata, no horizontal page
overflow, signed-in forms, and browsing with JavaScript disabled. The browser
harness accepts DIRECTORY_TEST_BROWSER=webkit to exercise the existing local
WebKit installation as well as default Chromium. These are browser emulations,
not a physical-device or search-ranking result.
