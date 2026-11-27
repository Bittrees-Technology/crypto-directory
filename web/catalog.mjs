// Shared by static directory pages and the optional client-side search.
// The public data feed retains all records; only verified records enter discovery.
export const DIRECTORY_PAGE_SIZE = 50;
const alphabet = new Intl.Collator('en', { sensitivity: 'base', numeric: true });

export function sortProjects(projects) {
  return [...projects].sort((a, b) => alphabet.compare(a.name, b.name) || alphabet.compare(a.id || '', b.id || ''));
}

export function filterProjects(projects, { query = '', category = '' } = {}) {
  const q = String(query).trim().toLowerCase();
  return sortProjects(projects.filter(project => {
    if (project.verification_status !== 'verified' || (category && project.lead_category !== category)) return false;
    const haystack = [project.name, project.description, project.tags.join(' '), project.ecosystem.join(' ')].join(' ').toLowerCase();
    return !q || haystack.includes(q);
  }));
}

export function projectPage(projects, requestedPage = 1, pageSize = DIRECTORY_PAGE_SIZE) {
  if (!Number.isInteger(pageSize) || pageSize < 1) throw new Error('Invalid directory page size');
  const total = projects.length;
  const pageCount = Math.max(1, Math.ceil(total / pageSize));
  const page = Math.min(pageCount, Math.max(1, Number.isInteger(requestedPage) ? requestedPage : 1));
  const offset = (page - 1) * pageSize;
  return { items: projects.slice(offset, offset + pageSize), page, pageCount, total,
    first: total ? offset + 1 : 0, last: Math.min(offset + pageSize, total) };
}

export function projectWindow(projects, requestedPage = 1, batches = 1) {
  const state = projectPage(projects, requestedPage);
  const offset = (state.page - 1) * DIRECTORY_PAGE_SIZE;
  const size = DIRECTORY_PAGE_SIZE * Math.max(1, Number.isSafeInteger(batches) ? batches : 1);
  return { ...state, items: projects.slice(offset, offset + size), last: Math.min(offset + size, state.total) };
}

// One catalogue request, then bounded DOM additions. The same button provides
// keyboard access and a fallback when automatic intersection detection is absent.
export function createCatalogueScroller(document, pagination, onMore) {
  if (!pagination) return null;
  const button = document.createElement('button');
  button.id = 'catalog-load-more'; button.type = 'button';
  button.setAttribute('aria-controls', 'rows');
  let more = false, busy = false, watching = false;
  const load = () => {
    if (!more || busy) return;
    busy = true; button.disabled = true;
    try { onMore(); } finally { busy = false; button.disabled = !more; }
  };
  button.addEventListener('click', load);
  const Observer = document.defaultView?.IntersectionObserver;
  const observer = Observer ? new Observer(entries => {
    if (entries.some(entry => entry.isIntersecting)) load();
  }, { rootMargin: '600px 0px' }) : null;
  return {
    update(state) {
      more = state.last < state.total;
      if (button.parentNode !== pagination) pagination.replaceChildren(button);
      pagination.hidden = false; pagination.setAttribute('aria-label', 'More projects');
      button.textContent = more ? 'Load more projects' : 'End of results';
      button.hidden = !state.total; button.disabled = !more;
      if (more && !watching && observer) { observer.observe(button); watching = true; }
      if (!more && watching) { observer.unobserve(button); watching = false; }
    }
  };
}

export function catalogPagePath(page, categorySlug = '') {
  if (!Number.isInteger(page) || page < 1) throw new Error('Invalid directory page');
  if (categorySlug && !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(categorySlug)) throw new Error('Invalid category slug');
  if (categorySlug) return page === 1 ? `categories/${categorySlug}.html` : `categories/${categorySlug}/${page}.html`;
  return page === 1 ? '' : `pages/${page}.html`;
}

export function pageSummary(state, filtered = false) {
  const number = value => value.toLocaleString('en-US');
  if (!state.total) return filtered ? 'No verified projects match these filters.' : 'No verified projects in this category yet.';
  return `Showing ${number(state.first)}–${number(state.last)} of ${number(state.total)} ${filtered ? 'matching ' : ''}verified projects.`;
}

export function escapeHtml(input = '') {
  return String(input).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;').replaceAll("'", '&#39;');
}

function badges(values) {
  return values.map(value => `<span class="badge">${escapeHtml(value)}</span>`).join('');
}

function tokenLinksHtml(tokenValue, tokenUrl = '') {
  const raw = String(tokenValue || '').trim();
  if (!raw || raw.toLowerCase() === 'n/a') return 'n/a';
  const symbols = raw.split(',').map(symbol => symbol.trim()).filter(Boolean);
  if (!symbols.length) return 'n/a';
  const explicitTokenUrl = String(tokenUrl || '').trim();
  return symbols.map(symbol => {
    const href = explicitTokenUrl || `https://www.coingecko.com/en/search?query=${encodeURIComponent(symbol)}`;
    return `<a class="token-link" href="${escapeHtml(href)}" target="_blank" rel="noopener">${escapeHtml(symbol)}</a>`;
  }).join(', ');
}

function linksCellHtml(project) {
  const links = [`<a class="link-pill" href="${escapeHtml(project.primary_url)}" target="_blank" rel="noopener">Website</a>`];
  if (project.product_url && project.product_url !== 'n/a' && project.product_url !== project.primary_url) {
    links.push(`<a class="link-pill" href="${escapeHtml(project.product_url)}" target="_blank" rel="noopener">Product</a>`);
  }
  return `<div class="links-cell">${links.join('')}</div>`;
}

export function tableRows(projects, navPrefix = '') {
  return projects.map(project => `<tr data-project-id="${escapeHtml(project.id || '')}">
<th scope="row" class="project-name"><strong>${escapeHtml(project.name)}</strong><br><small>${escapeHtml(project.lead_category)}</small><br><a data-edit-entry data-can-edit hidden href="${escapeHtml(navPrefix + 'edit.html?id=' + encodeURIComponent(project.id || ''))}">Edit listing</a></th>
<td class="project-description" data-label="Description">${escapeHtml(project.description)}</td>
<td class="project-links" data-label="Links">${linksCellHtml(project)}</td>
<td class="project-tags" data-label="Tags">${badges(project.tags)}</td>
<td class="project-ecosystem" data-label="Ecosystem">${badges(project.ecosystem)}</td>
<td data-label="Founded">${escapeHtml(String(project.founded))}</td>
<td data-label="HQ">${escapeHtml(project.hq)}</td>
<td data-label="Token">${tokenLinksHtml(project.token, project.token_url)}</td>
<td data-label="X">${project.twitter && project.twitter !== 'n/a' ? `<a href="${escapeHtml(project.twitter)}" target="_blank" rel="noopener" aria-label="${escapeHtml(project.name)} on X">X</a>` : 'n/a'}</td>
</tr>`).join('\n');
}

export function catalogueItemList(state) {
  return {'@type':'ItemList',numberOfItems:state.items.length,
    itemListElement:state.items.map((project,index)=>({'@type':'ListItem',position:state.first+index,
      item:{'@type':'WebSite',name:project.name,url:project.primary_url,description:project.description}}))};
}

// Keep structured data consistent with the actual visible page after live
// catalogue refreshes, filters and pagination; never mark held rows as public.
export function updateCatalogueSchema(document,state) {
  const node=document.getElementById('catalog-schema');
  if(!node)return;
  try{const data=JSON.parse(node.textContent),list=data['@graph']?.find(item=>item['@type']==='ItemList');
    if(list){Object.assign(list,catalogueItemList(state));node.textContent=JSON.stringify(data).replaceAll('<','\\u003c');}
  }catch{/* A missing optional search hint cannot prevent directory browsing. */}
}
