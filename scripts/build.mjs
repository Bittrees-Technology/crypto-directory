import { promises as fs } from 'node:fs';
import path from 'node:path';
import { loadProcessStatuses } from './lib/process-metrics.mjs';
import { writeReleaseManifest } from './lib/release-manifest.mjs';
import {CATEGORIES} from '../lib/directory/model.mjs';

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
  if(trimmed.startsWith('"')||trimmed.startsWith('[')){try{return JSON.parse(trimmed);}catch{/* Existing unquoted front matter retains its legacy format. */}}
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

function tableRows(projects,navPrefix='') {
  return projects
    .map((p) => {
      return `<tr>
<td><strong>${escapeHtml(p.name)}</strong><br><small>${escapeHtml(p.lead_category)}</small><br><a data-edit-entry data-can-edit hidden href="${escapeHtml(navPrefix+'edit.html?id='+encodeURIComponent(p.id||''))}">Edit listing</a></td>
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
    ? `<script type=\"application/ld+json\">${JSON.stringify(jsonLd).replaceAll('<','\\u003c')}</script>`
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

function siteNav(navPrefix = '') {
  return `<nav class="site-nav" data-staff hidden aria-label="Staff tools">
    <a href="${escapeHtml(navPrefix)}index.html">Directory</a>
    <a href="${escapeHtml(navPrefix)}review.html">Review Queue</a>
    <a href="${escapeHtml(navPrefix)}needs-update.html">Needs Update</a>
    <a href="${escapeHtml(navPrefix)}process-status.html">Process Status</a>
  </nav>`;
}

function pageShell({ title, heading = title, subtitle, body, home = false, showSubmissionLink = true, extraHead = '', extraScript = '', stylesheetHref = 'assets/styles.css', navPrefix = '' }) {
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
    <header class="directory-header">
      <a class="directory-brand" href="${escapeHtml(navPrefix)}index.html" aria-label="CryptoDirectory home"><img class="directory-icon" src="${escapeHtml(FAVICON_URL)}" width="28" height="28" alt=""><span>CryptoDirectory</span></a>
      <nav class="header-forms" aria-label="Contribute to the directory"><a href="${escapeHtml(navPrefix)}submit.html">Submit a project</a><a href="${escapeHtml(navPrefix)}request-edit.html">Request an edit</a></nav>
      <div class="directory-account">
        <a data-login-link data-signed-out class="account-button" href="https://cd.bittrees.org/sign-in" title="Sign in with email or Ethereum">Sign in</a>
        <div data-signed-in hidden class="account-session"><span class="account-details"><span id="directory-identity"></span><small id="directory-role"></small></span><button type="button" id="directory-logout">Sign out</button></div>
      </div>
    </header>
    <div class="directory-navigation">
    ${siteNav(navPrefix)}
    </div>
    ${home?'':`<a class="directory-back" href="${escapeHtml(navPrefix)}index.html"><span aria-hidden="true">←</span>Back to directory</a>`}
    <section class="page-heading"><h1>${escapeHtml(heading)}</h1><p>${escapeHtml(subtitle)}</p></section>
    <p id="directory-message" role="status" aria-live="polite"></p><a id="directory-result" hidden rel="noopener" target="_blank"></a>
    ${body}
    <p class=\"footer\">Disclosure: This directory is informational only and is not an endorsement or financial advice.</p>
  </main>
  ${extraScript}
  <script type="module" src="${escapeHtml(navPrefix)}assets/directory-client.js"></script>
</body>
</html>`.replace(/[ \t]+(?=\n)/g,'');
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
const projects = ${JSON.stringify(projects).replaceAll('<','\\u003c')};
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
    '<td><strong>' + esc(p.name) + '</strong><br><small>' + esc(p.lead_category) + '</small><br><a data-edit-entry data-can-edit hidden href="edit.html?id=' + encodeURIComponent(p.id||'') + '">Edit listing</a></td>' +
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
  document.dispatchEvent(new Event('directory-rows-rendered'));
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
    heading: 'Explore the directory',
    home: true,
    subtitle: 'Active global onchain companies and projects',
    body,
    extraHead: head,
    extraScript: script
  });
}

function categoryPage(category, projects) {
  const visible = projects.filter((p) => p.verification_status !== 'rejected');
  const slug = slugify(category);
  const scope = category === 'AI Agents' ? '<p>Crypto and Web3 agents, frameworks and agent marketplaces with an onchain use case.</p>' : '';
  const empty = visible.length ? '' : '<p>No listings have been added to this category yet. New suggestions go through review before appearing here.</p>';
  const body = `<section class=\"card\" style=\"margin:18px 0\">${visible.length} entries in <strong>${escapeHtml(category)}</strong>.${scope}${empty} <a href=\"../index.html\">Back to index</a></section>
<table>
  <thead>
    <tr>
      <th>Name</th><th>Description</th><th>Links</th><th>Tags</th><th>Ecosystem</th><th>Founded</th><th>HQ</th><th>Token</th><th>X</th>
    </tr>
  </thead>
  <tbody>${tableRows(visible,'../')}</tbody>
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
    stylesheetHref: '../assets/styles.css',
    navPrefix: '../'
  });
}

function reviewPage(projects) {
  return pageShell({title:'Review Queue',subtitle:'Review new project, company and organization submissions',body:'<section data-can-review hidden id="directory-review" class="card">Loading submissions…</section><p data-review-unavailable hidden>A Reviewer, Admin or Superadmin role is required to review new submissions.</p><p data-signed-out>Sign in with a Reviewer, Admin or Superadmin role to review new submissions.</p>'});
}

function listingFormPage(edit) {
  const fields=[['name','Name','text',true],['description','Description','textarea',true],['primary_url','Official website','url',true],['product_url','Product or app URL (or n/a)','text',true],['tags','Tags, separated by commas','text',true],['ecosystem','Networks / ecosystem, separated by commas','text',true],['founded','Founding year (or n/a)','text',false],['hq','Country (Metaverse if unknown)','text',false],['token','Token (or n/a)','text',false],['twitter','X / social URL (or n/a)','text',false]];
  const categoryControl=`<label>Lead category<select name="lead_category" required><option value="">Select a category</option>${CATEGORIES.map(c=>`<option>${escapeHtml(c)}</option>`).join('')}</select></label>`;
  const controls=fields.map(([name,label,type,required])=>`<label${type==='textarea'?' class="form-field-wide"':''}>${label}${type==='textarea'?`<textarea name="${name}" maxlength="500" minlength="20" required></textarea>`:`<input name="${name}" type="${type}" maxlength="700" ${required?'required':''}>`}</label>${name==='name'?categoryControl:''}`).join('');
  const body=`<section class="card listing-form-card" ${edit?'data-can-edit':'data-can-submit'} hidden>
  <h2>Listing details</h2>
  <form id="listing-form" method="post" data-mode="${edit?'edit':'submit'}">${controls}
  ${edit?'<label class="form-field-wide">Why is this update needed?<textarea name="reason" required minlength="10" maxlength="1000"></textarea></label>':''}
  <p class="submission-disclosure form-field-wide">Listing details, review notes and release proposals are public on GitHub. Do not include private information. Your sign-in email stays private.</p>
  <button type="submit">${edit?'Propose update':'Submit for review'}</button></form></section>
  ${edit?'':'<section class="card my-submissions" data-can-submit hidden><h2>Your submissions</h2><div id="my-submissions"></div></section>'}
  <section class="signed-out-notice" data-signed-out><p>${edit?'Sign in with an Editor, Admin or Superadmin role to update this listing.':'Sign in with your Bittrees email or Ethereum wallet to continue.'}</p><p class="status">You can browse the directory without signing in.</p></section>`;
  return pageShell({title:edit?'Update a listing':'Submit a listing',subtitle:edit?'Propose changes to an existing listing. Verification and approval stay unchanged.':'Suggest a project, company or organization for review.',showSubmissionLink:edit,body});
}

function editRequestPage(projects){
  const options=projects.filter(p=>p.verification_status!=='rejected').map(p=>`<option value="${escapeHtml(p.id)}">${escapeHtml(p.name)}</option>`).join('');
  return pageShell({title:'Request an edit',subtitle:'Suggest a correction to an existing project, company or organization.',body:`
  <section class="card listing-form-card" data-can-request-edit hidden><h2>What needs updating?</h2>
  <form id="edit-request-form" method="post">
  <label class="form-field-wide">Existing listing<select name="id" required><option value="">Choose a listing</option>${options}</select></label>
  <label class="form-field-wide">Requested changes<textarea name="changes" minlength="20" maxlength="2000" required></textarea></label>
  <label class="form-field-wide">Official sources or supporting links<textarea name="sources" maxlength="1500"></textarea></label>
  <p class="submission-disclosure form-field-wide">Requests and review notes are public on GitHub. Do not include private information. Your sign-in email stays private. An Editor or Admin reviews requests; this form does not change the listing.</p>
  <button type="submit">Send edit request</button></form></section>
  <section class="card my-submissions" data-signed-in hidden><h2 id="edit-requests-heading">Your edit requests</h2><div id="edit-requests"></div></section>
  <section class="signed-out-notice" data-signed-out><p>Sign in with your Bittrees email or Ethereum wallet to request an edit.</p><p class="status">You can browse the directory without signing in.</p></section>
  <p data-request-unavailable hidden>Your Reviewer role covers new submissions. An Editor or Admin handles changes to existing listings.</p>`});
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

function processStatusPage(statuses) {
  const cards = statuses.map((status) => {
    const sectionHtml = status.sections.map((section) => {
      const requirementHtml = section.requirements.map((requirement) => {
        const checks = requirement.checks.map((check) => {
          const observed = check.target !== undefined
            ? `${check.observed}/${check.target}`
            : String(check.observed);
          return `<li><strong>${escapeHtml(check.type)}</strong>: ${escapeHtml(check.path || '')} <span class="status">${escapeHtml(observed)}</span></li>`;
        }).join('');

        return `<div class="card" style="margin-top:10px">
  <div style="display:flex;justify-content:space-between;gap:12px;align-items:flex-start;flex-wrap:wrap">
    <div>
      <strong>${escapeHtml(requirement.title)}</strong>
      <div class="status">${escapeHtml(requirement.description)}</div>
    </div>
    <div><strong>${escapeHtml(String(requirement.progressPercent))}%</strong></div>
  </div>
  ${checks ? `<ul>${checks}</ul>` : ''}
</div>`;
      }).join('');

      return `<section class="card" style="margin-top:14px">
  <div style="display:flex;justify-content:space-between;gap:12px;align-items:flex-start;flex-wrap:wrap">
    <div>
      <h2 style="margin:0">${escapeHtml(section.title)}</h2>
      <div class="status">Spec path: <code>${escapeHtml(section.specPath)}</code></div>
    </div>
    <div><strong>${escapeHtml(String(section.progressPercent))}%</strong></div>
  </div>
  ${requirementHtml}
</section>`;
    }).join('');

    const timeline = status.completed
      ? `Completed. Latest milestone date: ${escapeHtml(status.timeline.projectedCompletionDate || 'n/a')}.`
      : `Projected completion: ${escapeHtml(status.timeline.projectedCompletionDate || 'unknown')}. ${status.timeline.daysRemaining === null ? 'Waiting for more progress data.' : `${escapeHtml(String(status.timeline.daysRemaining))} days remaining at the current velocity.`}`;

    return `<section class="card" style="margin:18px 0">
  <div style="display:flex;justify-content:space-between;gap:12px;align-items:flex-start;flex-wrap:wrap">
    <div>
      <h2 style="margin:0">${escapeHtml(status.name)}</h2>
      <div class="status">${escapeHtml(status.summary)}</div>
      <div class="status">Owner: ${escapeHtml(status.owner || 'n/a')}</div>
    </div>
    <div style="text-align:right">
      <div><strong>${escapeHtml(String(status.progressPercent))}% complete</strong></div>
      <div class="status">${status.completed ? 'Completed' : 'In progress'}</div>
    </div>
  </div>
  <div class="card" style="margin-top:14px;background:#f7f6f2">
    <div><strong>Timeline</strong></div>
    <div class="status">Started: ${escapeHtml(status.timeline.startedOn || 'n/a')}</div>
    <div class="status">Target: ${escapeHtml(status.timeline.targetDate || 'n/a')}</div>
    <div class="status">Observed velocity: ${escapeHtml(String(status.timeline.observedVelocityPercentPerDay || 0))}% / day</div>
    <div style="margin-top:6px">${escapeHtml(timeline)}</div>
  </div>
  ${sectionHtml}
</section>`;
  }).join('');

  const head = seoHead({
    title: 'CryptoDirectory | Process Status',
    description: 'Progress tracking against design and plan specs for CryptoDirectory projects.',
    canonicalPath: 'process-status.html',
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: 'CryptoDirectory Process Status',
      url: absoluteUrl('process-status.html'),
      isPartOf: absoluteUrl(''),
      inLanguage: 'en'
    }
  });

  const body = `<section class="card" style="margin:18px 0">
  Process status compares each tracked project against explicit design and plan specs, then estimates completion using weighted requirements and recorded history.
</section>
${cards || '<section class="card" style="margin:18px 0">No tracked processes found.</section>'}`;

  return pageShell({
    title: 'Process Status',
    subtitle: 'Completion tracking against design and plan specs',
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
    projects.push({...parsed,id:file});
  }

  projects.sort((a, b) => a.name.localeCompare(b.name));
  const categories = [...new Set([...CATEGORIES, ...projects.map((p) => p.lead_category)])].sort();
  const processStatuses = await loadProcessStatuses(root);

  await fs.writeFile(path.join(dataDir, 'projects.json'), JSON.stringify(projects, null, 2) + '\n');
  await fs.writeFile(path.join(dataDir, 'process-status.json'), JSON.stringify(processStatuses, null, 2) + '\n');
  await fs.writeFile(path.join(siteDir, 'index.html'), indexPage(projects, categories));
  await fs.writeFile(path.join(siteDir, 'review.html'), reviewPage(projects));
  await fs.writeFile(path.join(siteDir, 'needs-update.html'), needsUpdatePage(projects));
  await fs.writeFile(path.join(siteDir, 'process-status.html'), processStatusPage(processStatuses));
  await fs.writeFile(path.join(siteDir,'submit.html'),listingFormPage(false));
  await fs.writeFile(path.join(siteDir,'edit.html'),listingFormPage(true));
  await fs.writeFile(path.join(siteDir,'request-edit.html'),editRequestPage(projects));
  await fs.writeFile(path.join(siteDir,'sign-in.html'),pageShell({title:'CryptoDirectory',subtitle:'Sign in with email or Ethereum',body:'<section class="card"><p>Opening the shared Bittrees sign-in…</p><a href="https://roles.bittrees.org/sign-in?app=crypto-directory">Continue to sign-in</a></section>'}));
  await fs.copyFile(path.join(root,'web/directory-client.js'),path.join(siteDir,'assets/directory-client.js'));

  for (const category of categories) {
    const catProjects = projects.filter((p) => p.lead_category === category);
    const output = categoryPage(category, catProjects);
    await fs.writeFile(path.join(categoryDir, `${slugify(category)}.html`), output);
  }

  const sitemapPaths = [
    '',
    'index.html',
    'review.html',
    'needs-update.html',
    'process-status.html',
    ...categories.map((c) => `categories/${slugify(c)}.html`)
  ];
  await fs.writeFile(path.join(siteDir, 'sitemap.xml'), sitemapXml(sitemapPaths));
  await fs.writeFile(path.join(siteDir, 'robots.txt'), robotsTxt());
  await writeReleaseManifest(root, siteDir);

  const processSummary = processStatuses.length === 0
    ? 'No tracked processes.'
    : processStatuses.map((item) => `${item.name}: ${item.progressPercent}%`).join(' | ');
  console.log(`Built ${projects.length} projects across ${categories.length} categories. Process status: ${processSummary}`);
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
