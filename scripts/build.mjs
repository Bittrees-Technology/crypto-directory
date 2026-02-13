import { promises as fs } from 'node:fs';
import path from 'node:path';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const contentDir = path.join(root, 'content', 'projects');
const siteDir = path.join(root, 'site');
const categoryDir = path.join(siteDir, 'categories');
const dataDir = path.join(siteDir, 'data');
const SITE_URL = (process.env.SITE_URL || 'https://cryptodirectory.eth.limo').replace(/\/+$/, '');
const FAVICON_URL = 'https://euc.li/cryptodirectory.eth';

const required = [
  'name',
  'lead_category',
  'tags',
  'ecosystem',
  'description',
  'primary_url',
  'product_url',
  'founded',
  'hq',
  'token',
  'twitter',
  'verification_status'
];

function escapeHtml(input = '') {
  return String(input)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function slugify(input = '') {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function absoluteUrl(relativePath = '') {
  if (/^https?:\/\//i.test(relativePath)) return relativePath;
  const clean = String(relativePath).replace(/^\/+/, '');
  if (!clean) return `${SITE_URL}/`;
  return `${SITE_URL}/${clean}`;
}

function parseValue(raw) {
  const trimmed = raw.trim();
  const listMatch = trimmed.match(/^\[(.*)\]$/);
  if (listMatch) {
    const inner = listMatch[1].trim();
    if (!inner) return [];
    return inner.split(',').map((v) => v.trim()).filter(Boolean);
  }
  return trimmed;
}

function parseFrontMatter(filePath, text) {
  const lines = text.split(/\r?\n/);
  if (lines[0]?.trim() !== '---') {
    throw new Error(`${filePath}: missing front matter opening delimiter`);
  }

  let i = 1;
  const meta = {};
  for (; i < lines.length; i += 1) {
    const line = lines[i];
    if (line.trim() === '---') {
      break;
    }
    if (!line.trim()) continue;
    const idx = line.indexOf(':');
    if (idx === -1) {
      throw new Error(`${filePath}: invalid front matter line \"${line}\"`);
    }
    const key = line.slice(0, idx).trim();
    const value = line.slice(idx + 1).trim();
    meta[key] = parseValue(value);
  }

  if (i >= lines.length) {
    throw new Error(`${filePath}: missing front matter closing delimiter`);
  }

  for (const key of required) {
    if (meta[key] === undefined || meta[key] === '') {
      throw new Error(`${filePath}: missing required field \"${key}\"`);
    }
  }

  if (!Array.isArray(meta.tags)) meta.tags = [meta.tags];
  if (!Array.isArray(meta.ecosystem)) meta.ecosystem = [meta.ecosystem];

  return meta;
}

function badges(values) {
  return values.map((v) => `<span class=\"badge\">${escapeHtml(v)}</span>`).join('');
}

function tokenLinksHtml(tokenValue, tokenUrl = '') {
  const raw = String(tokenValue || '').trim();
  if (!raw || raw.toLowerCase() === 'n/a') return 'n/a';
  const symbols = raw.split(',').map((s) => s.trim()).filter(Boolean);
  if (symbols.length === 0) return 'n/a';
  const explicitTokenUrl = String(tokenUrl || '').trim();
  return symbols
    .map((symbol) => {
      const href = explicitTokenUrl || `https://www.coingecko.com/en/search?query=${encodeURIComponent(symbol)}`;
      return `<a class=\"token-link\" href=\"${escapeHtml(href)}\" target=\"_blank\" rel=\"noopener\">${escapeHtml(symbol)}</a>`;
    })
    .join(', ');
}

function linksCellHtml(project) {
  const links = [
    `<a class=\"link-pill\" href=\"${escapeHtml(project.primary_url)}\" target=\"_blank\" rel=\"noopener\">Website</a>`
  ];
  if (project.product_url && project.product_url !== 'n/a' && project.product_url !== project.primary_url) {
    links.push(`<a class=\"link-pill\" href=\"${escapeHtml(project.product_url)}\" target=\"_blank\" rel=\"noopener\">Product</a>`);
  }
  return `<div class=\"links-cell\">${links.join('')}</div>`;
}

function twitterCellHtml(twitter) {
  const xLink = twitter && twitter !== 'n/a'
    ? `<a href=\"${escapeHtml(twitter)}\" target=\"_blank\" rel=\"noopener\">X</a>`
    : 'n/a';
  return xLink;
}

function tableRows(projects) {
  return projects
    .map((p) => {
      return `<tr>
<td><strong>${escapeHtml(p.name)}</strong><br><small>${escapeHtml(p.lead_category)}</small></td>
<td>${escapeHtml(p.description)}</td>
<td>${linksCellHtml(p)}</td>
<td>${badges(p.tags)}</td>
<td>${badges(p.ecosystem)}</td>
<td>${escapeHtml(String(p.founded))}</td>
<td>${escapeHtml(p.hq)}</td>
<td>${tokenLinksHtml(p.token, p.token_url)}</td>
<td>${twitterCellHtml(p.twitter)}</td>
</tr>`;
    })
    .join('\n');
}

function seoHead({ title, description, canonicalPath = '', jsonLd = null }) {
  const canonical = absoluteUrl(canonicalPath);
  const descriptionEscaped = escapeHtml(description);
  const titleEscaped = escapeHtml(title);
  const jsonLdScript = jsonLd
    ? `<script type=\"application/ld+json\">${JSON.stringify(jsonLd)}</script>`
    : '';
  return `<meta name=\"description\" content=\"${descriptionEscaped}\">
  <meta name=\"robots\" content=\"index,follow\">
  <link rel=\"canonical\" href=\"${escapeHtml(canonical)}\">
  <meta property=\"og:type\" content=\"website\">
  <meta property=\"og:site_name\" content=\"CryptoDirectory\">
  <meta property=\"og:title\" content=\"${titleEscaped}\">
  <meta property=\"og:description\" content=\"${descriptionEscaped}\">
  <meta property=\"og:url\" content=\"${escapeHtml(canonical)}\">
  <meta name=\"twitter:card\" content=\"summary\">
  <meta name=\"twitter:title\" content=\"${titleEscaped}\">
  <meta name=\"twitter:description\" content=\"${descriptionEscaped}\">
  ${jsonLdScript}`;
}

function sitemapXml(paths) {
  const now = new Date().toISOString();
  const urls = paths
    .map((p) => {
      const loc = absoluteUrl(p);
      return `<url><loc>${escapeHtml(loc)}</loc><lastmod>${now}</lastmod><changefreq>weekly</changefreq></url>`;
    })
    .join('');
  return `<?xml version=\"1.0\" encoding=\"UTF-8\"?>
<urlset xmlns=\"http://www.sitemaps.org/schemas/sitemap/0.9\">${urls}</urlset>
`;
}

function robotsTxt() {
  return `User-agent: *
Allow: /

Sitemap: ${absoluteUrl('sitemap.xml')}
`;
}

function pageShell({ title, subtitle, body, extraHead = '', extraScript = '', stylesheetHref = 'assets/styles.css' }) {
  return `<!doctype html>
<html lang=\"en\">
<head>
  <meta charset=\"utf-8\">
  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">
  <title>${escapeHtml(title)}</title>
  <link rel=\"icon\" href=\"${escapeHtml(FAVICON_URL)}\">
  <link rel=\"shortcut icon\" href=\"${escapeHtml(FAVICON_URL)}\">
  <link rel=\"apple-touch-icon\" href=\"${escapeHtml(FAVICON_URL)}\">
  <link rel=\"stylesheet\" href=\"${escapeHtml(stylesheetHref)}\">
  ${extraHead}
</head>
<body>
  <main>
    <header>
      <h1>${escapeHtml(title)}</h1>
      <p>${escapeHtml(subtitle)}</p>
    </header>
    ${body}
    <p class=\"footer\">Disclosure: This directory is informational only and is not an endorsement or financial advice.</p>
  </main>
  ${extraScript}
</body>
</html>`;
}

function indexPage(projects, categories) {
  const options = ['<option value="">All categories</option>']
    .concat(categories.map((c) => `<option value=\"${escapeHtml(c)}\">${escapeHtml(c)}</option>`))
    .join('');

  const visibleProjects = projects.filter((p) => p.verification_status !== 'rejected');
  const rows = tableRows(visibleProjects);
  const body = `<section class=\"controls\">
  <input id=\"search\" type=\"search\" placeholder=\"Search name, tag, ecosystem\">
  <select id=\"category\">${options}</select>
</section>
<section class=\"card\" style=\"margin-bottom:12px\">
  <div style=\"margin-top:8px\">Category pages: ${categories.map((c) => `<a href=\"categories/${slugify(c)}.html\">${escapeHtml(c)}</a>`).join(' | ')}</div>
  <div style=\"margin-top:8px\">Contact <a href=\"https://raging.eth.limo\" target=\"_blank\" rel=\"noopener\">Jonathan</a> for any additions or updates.</div>
  <div style=\"margin-top:8px\">Disclosure: This directory is informational only and is not an endorsement or financial advice.</div>
</section>
<table>
  <thead>
    <tr>
      <th>Name</th><th>Description</th><th>Links</th><th>Tags</th><th>Ecosystem</th><th>Founded</th><th>HQ</th><th>Token</th><th>X</th>
    </tr>
  </thead>
  <tbody id=\"rows\">${rows}</tbody>
</table>`;

  const script = `<script>
const projects = ${JSON.stringify(projects)};
const rowsEl = document.getElementById('rows');
const searchEl = document.getElementById('search');
const categoryEl = document.getElementById('category');

function esc(s) {
  return String(s)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function badge(v) {
  return '<span class="badge">' + esc(v) + '</span>';
}

function tokenCell(v, tokenUrl) {
  const raw = String(v || '').trim();
  if (!raw || raw.toLowerCase() === 'n/a') return 'n/a';
  const symbols = raw.split(',').map((s) => s.trim()).filter(Boolean);
  if (symbols.length === 0) return 'n/a';
  const explicitTokenUrl = String(tokenUrl || '').trim();
  return symbols.map((s) => {
    const href = explicitTokenUrl || ('https://www.coingecko.com/en/search?query=' + encodeURIComponent(s));
    return '<a class="token-link" href="' + esc(href) + '" target="_blank" rel="noopener">' + esc(s) + '</a>';
  }).join(', ');
}

function row(p) {
  const hasDistinctProduct = p.product_url && p.product_url !== 'n/a' && p.product_url !== p.primary_url;
  const product = hasDistinctProduct
    ? '<a class="link-pill" href="' + esc(p.product_url) + '" target="_blank" rel="noopener">Product</a>'
    : 'n/a';
  const links = '<div class="links-cell"><a class="link-pill" href="' + esc(p.primary_url) + '" target="_blank" rel="noopener">Website</a>' + (product === 'n/a' ? '' : product) + '</div>';
  const xCell = (p.twitter && p.twitter !== 'n/a')
    ? '<a href="' + esc(p.twitter) + '" target="_blank" rel="noopener">X</a>'
    : 'n/a';
  return '<tr>' +
    '<td><strong>' + esc(p.name) + '</strong><br><small>' + esc(p.lead_category) + '</small></td>' +
    '<td>' + esc(p.description) + '</td>' +
    '<td>' + links + '</td>' +
    '<td>' + p.tags.map(badge).join('') + '</td>' +
    '<td>' + p.ecosystem.map(badge).join('') + '</td>' +
    '<td>' + esc(p.founded) + '</td>' +
    '<td>' + esc(p.hq) + '</td>' +
    '<td>' + tokenCell(p.token, p.token_url) + '</td>' +
    '<td>' + xCell + '</td>' +
  '</tr>';
}

function render() {
  const q = searchEl.value.trim().toLowerCase();
  const category = categoryEl.value;
  const filtered = projects.filter((p) => {
    const inCategory = !category || p.lead_category === category;
    const inStatus = p.verification_status !== 'rejected';
    const haystack = [p.name, p.description, p.tags.join(' '), p.ecosystem.join(' ')].join(' ').toLowerCase();
    const inQuery = !q || haystack.includes(q);
    return inCategory && inStatus && inQuery;
  });
  rowsEl.innerHTML = filtered.map(row).join('');
}

searchEl.addEventListener('input', render);
categoryEl.addEventListener('change', render);
</script>`;

  const head = seoHead({
    title: 'CryptoDirectory',
    description: `CryptoDirectory is a curated global index of active onchain companies and projects across ${categories.length} categories.`,
    canonicalPath: '',
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'CryptoDirectory',
      url: absoluteUrl(''),
      description: `Curated index of ${visibleProjects.length} active onchain companies and projects.`,
      inLanguage: 'en'
    }
  });

  return pageShell({
    title: 'CryptoDirectory',
    subtitle: 'Active global onchain companies and projects',
    body,
    extraHead: head,
    extraScript: script
  });
}

function categoryPage(category, projects) {
  const visible = projects.filter((p) => p.verification_status !== 'rejected');
  const slug = slugify(category);
  const body = `<section class=\"card\" style=\"margin:18px 0\">${visible.length} entries in <strong>${escapeHtml(category)}</strong>. <a href=\"../index.html\">Back to index</a></section>
<table>
  <thead>
    <tr>
      <th>Name</th><th>Description</th><th>Links</th><th>Tags</th><th>Ecosystem</th><th>Founded</th><th>HQ</th><th>Token</th><th>X</th>
    </tr>
  </thead>
  <tbody>${tableRows(visible)}</tbody>
</table>`;

  const head = seoHead({
    title: `CryptoDirectory | ${category}`,
    description: `Browse ${visible.length} active onchain projects in the ${category} category.`,
    canonicalPath: `categories/${slug}.html`,
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: `CryptoDirectory - ${category}`,
      url: absoluteUrl(`categories/${slug}.html`),
      isPartOf: absoluteUrl(''),
      inLanguage: 'en'
    }
  });

  return pageShell({
    title: `Category: ${category}`,
    subtitle: 'Sorted by lead category',
    body,
    extraHead: head,
    stylesheetHref: '../assets/styles.css'
  });
}

function reviewPage(projects) {
  const pending = projects.filter((p) => p.verification_status === 'pending_audit');
  const body = `<section class=\"card\" style=\"margin:18px 0\">
<strong>${pending.length}</strong> entries currently require audit.
<div style=\"margin-top:8px\"><a href=\"index.html\">Back to index</a></div>
</section>
<table>
  <thead>
    <tr>
      <th>Name</th><th>Description</th><th>Links</th><th>Tags</th><th>Ecosystem</th><th>Founded</th><th>HQ</th><th>Token</th><th>X</th>
    </tr>
  </thead>
  <tbody>${tableRows(pending)}</tbody>
</table>`;

  const head = seoHead({
    title: 'CryptoDirectory | Review Queue',
    description: 'Entries pending audit in CryptoDirectory.',
    canonicalPath: 'review.html',
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: 'CryptoDirectory Review Queue',
      url: absoluteUrl('review.html'),
      isPartOf: absoluteUrl(''),
      inLanguage: 'en'
    }
  });

  return pageShell({
    title: 'Review Queue',
    subtitle: 'Entries with verification_status: pending_audit',
    body,
    extraHead: head
  });
}

function needsUpdatePage(projects) {
  const flagged = projects.filter((p) => p.verification_status === 'needs_update');
  const body = `<section class=\"card\" style=\"margin:18px 0\">
<strong>${flagged.length}</strong> entries currently flagged as needs_update.
<div style=\"margin-top:8px\"><a href=\"index.html\">Back to index</a></div>
</section>
<table>
  <thead>
    <tr>
      <th>Name</th><th>Description</th><th>Links</th><th>Tags</th><th>Ecosystem</th><th>Founded</th><th>HQ</th><th>Token</th><th>X</th>
    </tr>
  </thead>
  <tbody>${tableRows(flagged)}</tbody>
</table>`;

  const head = seoHead({
    title: 'CryptoDirectory | Needs Update Queue',
    description: 'Entries flagged for refresh in CryptoDirectory.',
    canonicalPath: 'needs-update.html',
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: 'CryptoDirectory Needs Update Queue',
      url: absoluteUrl('needs-update.html'),
      isPartOf: absoluteUrl(''),
      inLanguage: 'en'
    }
  });

  return pageShell({
    title: 'Needs Update Queue',
    subtitle: 'Entries with verification_status: needs_update',
    body,
    extraHead: head
  });
}

async function main() {
  await fs.mkdir(categoryDir, { recursive: true });
  await fs.mkdir(dataDir, { recursive: true });

  const files = (await fs.readdir(contentDir))
    .filter((f) => f.endsWith('.md'))
    .sort();

  const projects = [];
  for (const file of files) {
    const fullPath = path.join(contentDir, file);
    const raw = await fs.readFile(fullPath, 'utf8');
    const parsed = parseFrontMatter(file, raw);
    projects.push(parsed);
  }

  projects.sort((a, b) => a.name.localeCompare(b.name));
  const categories = [...new Set(projects.map((p) => p.lead_category))].sort();

  await fs.writeFile(path.join(dataDir, 'projects.json'), JSON.stringify(projects, null, 2) + '\n');
  await fs.writeFile(path.join(siteDir, 'index.html'), indexPage(projects, categories));
  await fs.writeFile(path.join(siteDir, 'review.html'), reviewPage(projects));
  await fs.writeFile(path.join(siteDir, 'needs-update.html'), needsUpdatePage(projects));

  for (const category of categories) {
    const catProjects = projects.filter((p) => p.lead_category === category);
    const output = categoryPage(category, catProjects);
    await fs.writeFile(path.join(categoryDir, `${slugify(category)}.html`), output);
  }

  const sitemapPaths = [
    '',
    'index.html',
    ...categories.map((c) => `categories/${slugify(c)}.html`)
  ];
  await fs.writeFile(path.join(siteDir, 'sitemap.xml'), sitemapXml(sitemapPaths));
  await fs.writeFile(path.join(siteDir, 'robots.txt'), robotsTxt());

  console.log(`Built ${projects.length} projects across ${categories.length} categories.`);
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
