import { promises as fs } from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { loadProcessStatuses } from './lib/process-metrics.mjs';
import { writeReleaseManifest } from './lib/release-manifest.mjs';
import {CATEGORIES,LISTING_FIELDS,REMOVAL_REASONS} from '../lib/directory/model.mjs';
import { filterProjects, projectPage, catalogPagePath, pageSummary, escapeHtml, tableRows, catalogueItemList } from '../web/catalog.mjs';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const contentDir = path.join(root, 'content', 'projects');
const siteDir = process.env.DIRECTORY_BUILD_OUTPUT?path.resolve(process.env.DIRECTORY_BUILD_OUTPUT):path.join(root,'site');
const categoryDir = path.join(siteDir, 'categories');
const pageDir = path.join(siteDir, 'pages');
const dataDir = path.join(siteDir, 'data');
const SITE_URL = (process.env.SITE_URL || 'https://cd.bittrees.org').replace(/\/+$/, '');
const FAVICON_URL = 'assets/directory-icon.jpg';

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

function seoHead({ title, description, canonicalPath = '', jsonLd = null, schemaId = '', robots = 'index,follow' }) {
  const canonical = absoluteUrl(canonicalPath);
  const descriptionEscaped = escapeHtml(description);
  const titleEscaped = escapeHtml(title);
  const jsonLdScript = jsonLd
    ? `<script${schemaId ? ` id="${escapeHtml(schemaId)}"` : ''} type=\"application/ld+json\">${JSON.stringify(jsonLd).replaceAll('<','\\u003c')}</script>`
    : '';
  return `<meta name=\"description\" content=\"${descriptionEscaped}\">
  <meta name=\"robots\" content=\"${escapeHtml(robots)}\">
  <link rel=\"canonical\" href=\"${escapeHtml(canonical)}\">
  <meta property=\"og:type\" content=\"website\">
  <meta property=\"og:site_name\" content=\"CryptoDirectory\">
  <meta property=\"og:title\" content=\"${titleEscaped}\">
  <meta property=\"og:description\" content=\"${descriptionEscaped}\">
  <meta property=\"og:url\" content=\"${escapeHtml(canonical)}\">
  <meta property="og:locale" content="en_US">
  <meta property="og:image" content="${escapeHtml(absoluteUrl('assets/social-card.png'))}">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:image:alt" content="CryptoDirectory — Crypto and Web3 project directory">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:image" content="${escapeHtml(absoluteUrl('assets/social-card.png'))}">
  <meta name="twitter:image:alt" content="CryptoDirectory — Crypto and Web3 project directory">
  <meta name=\"twitter:title\" content=\"${titleEscaped}\">
  <meta name=\"twitter:description\" content=\"${descriptionEscaped}\">
  ${jsonLdScript}`;
}

function categoryDescription(category) {
  const summaries={
    'AI Agents':'Discover crypto and Web3 AI agents, agent frameworks and onchain agent marketplaces.',
    'Custody':'Explore crypto custody providers and tools for safeguarding digital assets.',
    'DAOs & Governance':'Find DAO platforms, onchain voting systems and governance tools.',
    'Data & Analytics':'Explore blockchain data platforms, onchain analytics and crypto research tools.',
    'DeFi':'Find decentralized exchanges, lending protocols and other decentralized finance projects.',
    'Developer Tools':'Discover Web3 development frameworks, smart contract tools and blockchain APIs.',
    'Gaming':'Explore blockchain games, onchain gaming platforms and Web3 gaming tools.',
    'Identity':'Find decentralized identity, naming, credentials and onchain reputation projects.',
    'Infrastructure':'Discover blockchain infrastructure, node services, interoperability and Web3 networks.',
    'Layer 1 / Layer 2':'Explore layer 1 blockchains, Ethereum scaling networks and layer 2 ecosystems.',
    'NFTs & Creator Economy':'Find NFT platforms, creator tools, digital collectibles and onchain publishing projects.',
    'Payments':'Discover crypto payment services, stablecoin tools and onchain payment infrastructure.',
    'Real World Assets (RWA)':'Explore tokenization platforms and projects connecting real world assets with blockchains.',
    'Security':'Find smart contract auditing, blockchain security, monitoring and risk assessment tools.',
    'Wallets':'Explore Ethereum and multichain wallets, smart accounts and digital asset wallet tools.'
  };
  return (summaries[category]||`Explore crypto and Web3 projects in ${category}.`)+' Browse official websites and product links.';
}
function catalogueGraph({title,description,canonicalPath,state,page,category=''}) {
  const url=absoluteUrl(canonicalPath),home=absoluteUrl('');
  const crumbs=[{name:'CryptoDirectory',url:home}];
  if(category)crumbs.push({name:category,url:absoluteUrl(catalogPagePath(1,slugify(category)))});
  if(page>1)crumbs.push({name:`Page ${page}`,url});
  return {'@context':'https://schema.org','@graph':[
    {'@type':'WebSite','@id':home+'#website',name:'CryptoDirectory',url:home,inLanguage:'en'},
    {'@type':'CollectionPage','@id':url+'#webpage',name:title,description,url,inLanguage:'en',isPartOf:{'@id':home+'#website'},mainEntity:{'@id':url+'#projects'},...(crumbs.length>1?{breadcrumb:{'@id':url+'#breadcrumbs'}}:{})},
    {'@id':url+'#projects',...catalogueItemList(state)},
    ...(crumbs.length>1?[{'@type':'BreadcrumbList','@id':url+'#breadcrumbs',itemListElement:crumbs.map((crumb,index)=>({'@type':'ListItem',position:index+1,name:crumb.name,item:crumb.url}))}]:[])
  ]};
}

function sitemapXml(paths) {
  // No reliable per-page modification date is recorded; omit lastmod instead
  // of reporting every routine rebuild as a content change.
  const urls = paths
    .map((p) => {
      const loc = absoluteUrl(p);
      return `<url><loc>${escapeHtml(loc)}</loc></url>`;
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
    <a href="${escapeHtml(navPrefix || './')}">Directory</a>
    <a href="${escapeHtml(navPrefix)}review.html">Review Queue</a>
    <a href="${escapeHtml(navPrefix)}needs-update.html">Needs Update</a>
    <a href="${escapeHtml(navPrefix)}process-status.html">Process Status</a>
  </nav>`;
}

const RUNTIME_CATALOGUE=process.env.DIRECTORY_DATA_BACKEND==='runtime-v1';

async function versionBrowserModules(htmlPaths) {
  const names = new Map();
  for (const name of ['catalog.mjs', 'runtime-catalogue.mjs', 'directory-search.js', 'directory-client.js']) {
    let code = await fs.readFile(path.join(siteDir, 'assets', name), 'utf8');
    if (name !== 'catalog.mjs') code = code.replaceAll('./catalog.mjs', './' + names.get('catalog.mjs'));
    const extension = path.extname(name), digest = createHash('sha256').update(code).digest('hex').slice(0, 16);
    const versioned = `cd-${path.basename(name, extension)}.${digest}${extension}`;
    names.set(name, versioned);
    await fs.writeFile(path.join(siteDir, 'assets', name), code);
    await fs.writeFile(path.join(siteDir, 'assets', versioned), code);
  }
  for (const relative of htmlPaths) {
    const file = path.join(siteDir, relative || 'index.html');
    let html = await fs.readFile(file, 'utf8');
    html = html.replace(/(<script type="module" src="(?:\.\.\/)*assets\/)([^"]+)("><\/script>)/g,
      (original, prefix, name, suffix) => names.has(name) ? prefix + names.get(name) + suffix : original);
    await fs.writeFile(file, html);
  }
}

function pageShell({ title, heading = title, subtitle, body, home = false, showSubmissionLink = true, extraHead = '', extraScript = '', stylesheetHref = 'assets/styles.css', navPrefix = '', catalogueView = '', catalogueCategory = '', cataloguePage = 1 }) {
  return `<!doctype html>
<html lang=\"en\">
<head>
  <meta charset=\"utf-8\">
  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">
  <title>${escapeHtml(title)}</title>
  <link rel=\"icon\" href=\"${escapeHtml(navPrefix + FAVICON_URL)}\">
  <link rel=\"shortcut icon\" href=\"${escapeHtml(navPrefix + FAVICON_URL)}\">
  <link rel=\"apple-touch-icon\" href=\"${escapeHtml(navPrefix + FAVICON_URL)}\">
  <link rel=\"stylesheet\" href=\"${escapeHtml(stylesheetHref)}\">
  ${extraHead}
</head>
<body${RUNTIME_CATALOGUE?` data-live-catalogue data-catalogue-store="${escapeHtml(process.env.DIRECTORY_RUNTIME_STORE_ID||'')}" data-catalogue-view="${escapeHtml(catalogueView)}" data-catalogue-category="${escapeHtml(catalogueCategory)}" data-catalogue-page="${cataloguePage}" data-catalogue-prefix="${escapeHtml(navPrefix)}"`:''}>
  <a class="skip-link" href="#directory-content">Skip to content</a>
  <main>
    <header class="directory-header">
      <a class="directory-brand" href="${escapeHtml(navPrefix || './')}" aria-label="CryptoDirectory home"><img class="directory-icon" src="${escapeHtml(navPrefix + FAVICON_URL)}" width="28" height="28" alt=""><span>CryptoDirectory</span></a>
      <nav class="header-forms" aria-label="Contribute to the directory"><a href="${escapeHtml(navPrefix)}submit.html">Submit a project</a><a href="${escapeHtml(navPrefix)}request-edit.html">Request an edit</a></nav>
      <div class="directory-account">
        <a data-login-link data-signed-out class="account-button" href="https://cd.bittrees.org/sign-in" title="Sign in with email or Ethereum">Sign in</a>
        <div data-signed-in hidden class="account-session"><span class="account-details"><span id="directory-identity"></span><small id="directory-role"></small></span><button type="button" id="directory-logout">Sign out</button></div>
      </div>
    </header>
    <div class="directory-navigation">
    ${siteNav(navPrefix)}
    </div>
    ${home?'':`<a class="directory-back" href="${escapeHtml(navPrefix || './')}"><span aria-hidden="true">←</span>Back to directory</a>`}
    <section class="page-heading" id="directory-content" tabindex="-1"><h1>${escapeHtml(heading)}</h1><p>${escapeHtml(subtitle)}</p></section>
    <p id="directory-message" role="status" aria-live="polite"></p><a id="directory-result" hidden rel="noopener" target="_blank"></a>
    ${body}
    <p class=\"footer\">Disclosure: This directory is informational only and is not an endorsement or financial advice.</p>
  </main>
  ${extraScript}
  ${RUNTIME_CATALOGUE?`<script type="module" src="${escapeHtml(navPrefix)}assets/runtime-catalogue.mjs"></script>`:''}
  <script type="module" src="${escapeHtml(navPrefix)}assets/directory-client.js"></script>
</body>
</html>`.replace(/[ \t]+(?=\n)/g,'');
}

function navigationPrefix(canonicalPath) {
  return '../'.repeat(canonicalPath.split('/').length - 1);
}

function paginationHtml(state, canonicalPath, categorySlug = '') {
  const prefix = navigationPrefix(canonicalPath);
  const link = (page, label, rel = '') => `<a ${rel ? `rel="${rel}" ` : ''}href="${escapeHtml(prefix + catalogPagePath(page, categorySlug) || './')}">${label}</a>`;
  return `<nav class="catalog-pagination" id="catalog-pagination" aria-label="${categorySlug ? 'Category' : 'Directory'} pages">
    ${state.page > 1 ? link(1, 'First page') + link(state.page - 1, 'Previous page', 'prev') : ''}
    <span aria-current="page">Page ${state.page} of ${state.pageCount}</span>
    ${state.page < state.pageCount ? link(state.page + 1, 'Next page', 'next') + link(state.pageCount, 'Last page') : ''}
  </nav>`;
}

function catalogTable(rows) {
  return `<div class="catalog-table" tabindex="0" role="region" aria-label="Project listings">
<table class="project-table">
  <thead>
    <tr>
      <th scope="col">Name</th><th scope="col">Description</th><th scope="col">Links</th><th scope="col">Tags</th><th scope="col">Ecosystem</th><th scope="col">Founded</th><th scope="col">HQ</th><th scope="col">Token</th><th scope="col">X</th>
    </tr>
  </thead>
  <tbody id="rows">${rows}</tbody>
</table></div>`;
}

function indexPage(projects, categories, page = 1) {
  const visibleProjects = filterProjects(projects);
  const state = projectPage(visibleProjects, page);
  const canonicalPath = catalogPagePath(page);
  const prefix = navigationPrefix(canonicalPath);
  const options = ['<option value="">All categories</option>']
    .concat(categories.map(category => `<option value="${escapeHtml(category)}">${escapeHtml(category)}</option>`)).join('');
  const title = page === 1 ? 'CryptoDirectory | Crypto & Web3 Project Directory' : `Crypto & Web3 Projects, Page ${page} | CryptoDirectory`;
  const description = `Browse active crypto and Web3 projects across DeFi, wallets, infrastructure, AI agents and more. Find official websites and product links.${page > 1 ? ` Page ${page}.` : ''}`;
  const body = `<section class="controls" data-catalog-search data-source="${prefix}data/projects.json" data-prefix="${prefix}" data-page="${page}">
  <label>Search all projects<input id="search" type="search" placeholder="Search name, tag, ecosystem" enterkeyhint="search" autocomplete="off"></label>
  <label>Category<select id="category">${options}</select></label>
</section>
<p id="catalog-search-status" role="status" aria-live="polite"></p>
<button id="catalog-retry" type="button" hidden>Retry search</button>
<noscript><p>Search needs JavaScript. Browse every project using the category and page links.</p></noscript>
<nav class="category-browse" aria-label="Browse project categories">
  <p class="category-label">Browse by category</p>
  <div class="category-links">${categories.map(category => `<a href="${prefix}categories/${slugify(category)}.html">${escapeHtml(category)}</a>`).join('')}</div>
</nav>
<p class="muted">Projects are listed A–Z. More load as you scroll.</p>
<p id="catalog-count" class="status" role="status" aria-live="polite">${pageSummary(state)}</p>
${catalogTable(tableRows(state.items, prefix))}
${paginationHtml(state, canonicalPath)}
<nav class="catalog-pagination" id="search-pagination" aria-label="Search result pages" hidden>
  <button id="search-previous" type="button">Previous results</button>
  <span id="search-page" aria-current="page"></span>
  <button id="search-next" type="button">Next results</button>
</nav>`;
  const head = seoHead({ title, description, canonicalPath, schemaId:'catalog-schema',
    jsonLd: catalogueGraph({title,description,canonicalPath,state,page}) });
  return pageShell({ title, heading: 'Explore the directory', home: true,
    subtitle: 'Active global onchain companies and projects', body, extraHead: head,
    catalogueView: 'verified', cataloguePage: page,
    extraScript: RUNTIME_CATALOGUE?'':`<script type="module" src="${prefix}assets/directory-search.js"></script>`,
    stylesheetHref: `${prefix}assets/styles.css`, navPrefix: prefix });
}

function categoryPage(category, projects, page = 1) {
  const visible = filterProjects(projects, { category });
  const state = projectPage(visible, page);
  const slug = slugify(category);
  const canonicalPath = catalogPagePath(page, slug);
  const prefix = navigationPrefix(canonicalPath);
  const scope = category === 'AI Agents' ? '<p>Crypto and Web3 agents, frameworks and agent marketplaces with an onchain use case.</p>' : '';
  const empty = visible.length ? '' : '<p>No listings have been added to this category yet. New suggestions go through review before appearing here.</p>';
  const body = `<section class="card" style="margin:18px 0" data-catalog-search data-source="${prefix}data/projects.json" data-prefix="${prefix}" data-page="${page}" data-category="${escapeHtml(category)}"><span id="category-total">${visible.length}</span> entries in <strong>${escapeHtml(category)}</strong>.${scope}${empty} <a href="${prefix}">Back to index</a></section>
<p id="catalog-search-status" role="status" aria-live="polite"></p>
<button id="catalog-retry" type="button" hidden>Reload directory</button>
<p class="muted">Projects are listed A–Z. More load as you scroll.</p>
<p id="catalog-count" class="status" role="status" aria-live="polite">${pageSummary(state)}</p>
${catalogTable(tableRows(state.items, prefix))}
${paginationHtml(state, canonicalPath, slug)}`;
  const title = `${category} Projects & Tools${page > 1 ? `, Page ${page}` : ''} | CryptoDirectory`;
  const description=categoryDescription(category)+(page>1?` Page ${page}.`:'');
  const head = seoHead({title,description,canonicalPath,schemaId:'catalog-schema',
    jsonLd:catalogueGraph({title,description,canonicalPath,state,page,category})});
  return pageShell({ title, heading: `Category: ${category}`,
    subtitle: categoryDescription(category), body, extraHead: head, catalogueView:'verified', catalogueCategory:category,cataloguePage:page,
    extraScript: RUNTIME_CATALOGUE?'':`<script type="module" src="${prefix}assets/directory-search.js"></script>`,
    stylesheetHref: `${prefix}assets/styles.css`, navPrefix: prefix });
}

function reviewPage(projects) {
  return pageShell({title:'Review Queue',subtitle:'Review new listings and requested updates',extraHead:'<meta name="robots" content="noindex,follow">',body:'<section data-can-review hidden id="directory-review" class="card">Loading submissions…</section><section data-can-review hidden class="card"><h2 id="edit-requests-heading">Edit and removal requests</h2><div id="edit-requests"></div></section><p data-review-unavailable hidden>A Reviewer, Admin or Superadmin role is required to review submissions and requested changes.</p><p data-signed-out>Sign in with a Reviewer, Admin or Superadmin role to review submissions and requested changes.</p>'});
}

function listingControls(){
  return LISTING_FIELDS.map(([name,label,type,required])=>{
    const attrs=`name="${name}" data-field-label="${escapeHtml(label)}" ${required?'required':''}`;
    const control=type==='category'?`<select ${attrs}><option value="">Select a category</option>${CATEGORIES.map(c=>`<option>${escapeHtml(c)}</option>`).join('')}</select>`:type==='textarea'?`<textarea ${attrs} maxlength="500" minlength="20"></textarea>`:`<input ${attrs} type="${type}" maxlength="${['name','hq','token'].includes(name)?100:['tags','ecosystem'].includes(name)?900:name==='founded'?4:700}">`;
    return `<label${type==='textarea'?' class="form-field-wide"':''}>${label}${control}</label>`;
  }).join('');
}
function listingFormPage(edit) {
  const controls=listingControls();
  const body=`<section class="card listing-form-card" ${edit?'data-can-edit':'data-can-submit'} hidden>
  <h2>Listing details</h2>
  <form id="listing-form" method="post" data-mode="${edit?'edit':'submit'}">${controls}
  ${edit?'<label class="form-field-wide">Why is this update needed?<textarea name="reason" required minlength="10" maxlength="1000"></textarea></label>':''}
  <p class="submission-disclosure form-field-wide">${RUNTIME_CATALOGUE?'Approved listing details are public. Requests and review notes are visible to you and authorized staff. Do not include private information. Your sign-in email stays private.':'Listing details, review notes and release proposals are public on GitHub. Do not include private information. Your sign-in email stays private.'}</p>
  <button type="submit">${edit?'Propose update':'Submit for review'}</button></form></section>
  ${edit?'':'<section class="card my-submissions" data-can-submit hidden><h2>Your submissions</h2><div id="my-submissions"></div></section>'}
  <section class="signed-out-notice" data-signed-out><p>${edit?'Sign in with an Editor, Admin or Superadmin role to update this listing.':'Sign in with your Bittrees email or Ethereum wallet to continue.'}</p><p class="status">You can browse the directory without signing in.</p></section>`;
  return pageShell({title:edit?'Update a listing':'Submit a listing',subtitle:edit?'Propose changes to an existing listing. Verification and approval stay unchanged.':'Suggest a project, company or organization for review.',showSubmissionLink:edit,extraHead:seoHead({title:(edit?'Update a Listing':'Submit a Project')+' | CryptoDirectory',description:edit?'Propose a correction to an existing CryptoDirectory listing.':'Submit a crypto or Web3 project for directory review.',canonicalPath:edit?'edit.html':'submit.html',robots:'noindex,follow'}),body});
}

function editRequestPage(projects){
  const options=projects.filter(p=>p.verification_status!=='rejected').map(p=>`<option value="${escapeHtml(p.id)}">${escapeHtml(p.name)}</option>`).join('');
  return pageShell({title:'Request an edit',extraHead:seoHead({title:'Request an Edit | CryptoDirectory',description:'Suggest a correction or request removal of an existing listing.',canonicalPath:'request-edit.html',robots:'noindex,follow'}),subtitle:'Suggest corrections or request removal of an existing project, company or organization.',body:`
  <section class="card listing-form-card" data-can-request-edit hidden><h2>Listing details</h2>
  <form id="listing-request-form" method="post">
  <label class="form-field-wide">Existing listing<select name="id" required><option value="">Choose a listing</option>${options}</select></label>
  <p id="request-loading" class="form-field-wide status" role="status">Choose a listing to load its current details.</p>
  <label class="checkbox-label form-field-wide"><input id="request-removal" name="requestRemoval" type="checkbox" disabled>Request removal of this listing</label>
  <fieldset id="request-listing-fields" class="listing-fields form-field-wide" disabled><legend>Proposed listing details</legend>${listingControls()}</fieldset>
  <fieldset id="removal-reasons" class="removal-reasons form-field-wide" hidden disabled><legend>Why should this listing be removed?</legend>${REMOVAL_REASONS.map(([key,label])=>`<label class="checkbox-label"><input type="checkbox" name="removalReasons" value="${key}" data-reason-label="${label}">${label}</label>`).join('')}<p class="status">Choose all reasons that apply. The listing stays visible until a removal is reviewed and approved for release.</p></fieldset>
  <label class="form-field-wide">Reason for this request<textarea name="changes" minlength="20" maxlength="2000" required></textarea></label>
  <label class="form-field-wide">Official sources or supporting links<textarea name="sources" maxlength="1500"></textarea></label>
  <p class="submission-disclosure form-field-wide">${RUNTIME_CATALOGUE?'Requests and review notes are visible to you and authorized staff. A Reviewer or Admin approves changes before publication. Do not include private information. Your sign-in email stays private.':'Requests and review notes are public on GitHub. Do not include private information. Your sign-in email stays private. An Editor or Admin reviews requests; this form does not change the listing.'}</p>
  <button type="submit" disabled>Send edit request</button></form></section>
  <section class="card my-submissions" data-signed-in hidden><h2 id="edit-requests-heading">Your edit requests</h2><div id="edit-requests"></div></section>
  <section class="signed-out-notice" data-signed-out><p>Sign in with your Bittrees email or Ethereum wallet to request an edit.</p><p class="status">You can browse the directory without signing in.</p></section>
  <p data-request-unavailable hidden>Your Reviewer role covers new submissions. An Editor or Admin handles changes to existing listings.</p>`});
}

function needsUpdatePage(projects) {
  const flagged = projects.filter((p) => p.verification_status === 'needs_update');
  const body = `<section class=\"card\" style=\"margin:18px 0\">
<strong id="needs-update-total">${flagged.length}</strong> entries currently flagged as needs_update.
<div style=\"margin-top:8px\"><a href=\"./\">Back to index</a></div>
</section>
<table class="project-table">
  <thead>
    <tr>
      <th>Name</th><th>Description</th><th>Links</th><th>Tags</th><th>Ecosystem</th><th>Founded</th><th>HQ</th><th>Token</th><th>X</th>
    </tr>
  </thead>
  <tbody id="rows">${tableRows(flagged)}</tbody>
</table>`;

  const head = seoHead({
    title: 'CryptoDirectory | Needs Update Queue',
    description: 'Entries flagged for refresh in CryptoDirectory.',
    canonicalPath: 'needs-update.html',
    robots: 'noindex,follow',
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
    subtitle: 'Listings needing review', catalogueView:'needs-update',
    body:body+'<p id="catalog-count" role="status"></p><nav id="catalog-pagination" class="catalog-pagination" aria-label="Queue pages"></nav>',
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
    robots: 'noindex,follow',
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
  await fs.mkdir(dataDir, { recursive: true });
  await fs.mkdir(path.join(siteDir, 'assets'), { recursive: true });
  if(siteDir!==path.join(root,'site'))for(const asset of ['styles.css','social-card.png','directory-icon.jpg'])await fs.copyFile(path.join(root,'site/assets',asset),path.join(siteDir,'assets',asset));

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
  // These directories contain generated discovery pages only. Rebuild them so
  // withdrawn entries cannot survive in old pagination files after counts shrink.
  await fs.rm(categoryDir, { recursive: true, force: true });
  await fs.rm(pageDir, { recursive: true, force: true });
  await fs.mkdir(categoryDir, { recursive: true });
  await fs.mkdir(pageDir, { recursive: true });
  const sitemapPaths = [];
  const globalPages = projectPage(filterProjects(projects)).pageCount;
  for (let page = 1; page <= globalPages; page += 1) {
    const outputPath = catalogPagePath(page);
    await fs.writeFile(path.join(siteDir, outputPath || 'index.html'), indexPage(projects, categories, page));
    sitemapPaths.push(outputPath);
  }
  await fs.writeFile(path.join(siteDir, 'review.html'), reviewPage(projects));
  await fs.writeFile(path.join(siteDir, 'needs-update.html'), needsUpdatePage(projects));
  await fs.writeFile(path.join(siteDir, 'process-status.html'), processStatusPage(processStatuses));
  await fs.writeFile(path.join(siteDir,'submit.html'),listingFormPage(false));
  await fs.writeFile(path.join(siteDir,'edit.html'),listingFormPage(true));
  await fs.writeFile(path.join(siteDir,'request-edit.html'),editRequestPage(projects));
  await fs.writeFile(path.join(siteDir,'sign-in.html'),pageShell({title:'Sign in | CryptoDirectory',subtitle:'Sign in with email or Ethereum',extraHead:seoHead({title:'Sign in | CryptoDirectory',description:'Sign in to submit a project or manage authorized directory work.',canonicalPath:'sign-in.html',robots:'noindex,follow'}),body:'<section class="card"><p>Opening the shared Bittrees sign-in…</p><a href="https://roles.bittrees.org/sign-in?app=crypto-directory">Continue to sign-in</a></section>'}));
  await fs.copyFile(path.join(root,'web/directory-client.js'),path.join(siteDir,'assets/directory-client.js'));
  await fs.copyFile(path.join(root,'web/runtime-catalogue.mjs'),path.join(siteDir,'assets/runtime-catalogue.mjs'));
  await fs.copyFile(path.join(root,'web/catalog.mjs'),path.join(siteDir,'assets/catalog.mjs'));
  await fs.copyFile(path.join(root,'web/directory-search.mjs'),path.join(siteDir,'assets/directory-search.js'));

  for (const category of categories) {
    const slug = slugify(category);
    const categoryPages = projectPage(filterProjects(projects, { category })).pageCount;
    for (let page = 1; page <= categoryPages; page += 1) {
      const outputPath = catalogPagePath(page, slug);
      await fs.mkdir(path.dirname(path.join(siteDir, outputPath)), { recursive: true });
      await fs.writeFile(path.join(siteDir, outputPath), categoryPage(category, projects, page));
      sitemapPaths.push(outputPath);
    }
  }

  // Every public page in each bounded series is crawlable and self-canonical.
  // Staff tools remain crawlable for noindex, outside the public sitemap.
  await fs.writeFile(path.join(siteDir, 'sitemap.xml'), sitemapXml(sitemapPaths));
  await fs.writeFile(path.join(siteDir, 'robots.txt'), robotsTxt());
  await versionBrowserModules([...sitemapPaths,'review.html','needs-update.html','process-status.html','submit.html','edit.html','request-edit.html','sign-in.html']);
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
