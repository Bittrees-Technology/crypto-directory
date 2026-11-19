import { filterProjects, projectPage, pageSummary, tableRows } from './catalog.mjs';

function validCatalog(value) {
  return Array.isArray(value) && value.every(project => project &&
    ['id', 'name', 'description', 'lead_category', 'verification_status', 'primary_url'].every(key => typeof project[key] === 'string') &&
    ['tags', 'ecosystem'].every(key => Array.isArray(project[key]) && project[key].every(item => typeof item === 'string')));
}

// Search is progressive enhancement: static pages and links work without the
// catalogue request, JavaScript, sign-in, or the primary site's API.
export function mountDirectorySearch({ document = globalThis.document, fetch = globalThis.fetch } = {}) {
  const controls = document.querySelector('[data-catalog-search]');
  if (!controls) return;
  const byId = id => document.getElementById(id);
  const search = byId('search'), category = byId('category'), rows = byId('rows');
  const count = byId('catalog-count'), nativePages = byId('catalog-pagination');
  const resultPages = byId('search-pagination'), previous = byId('search-previous'), next = byId('search-next');
  const status = byId('catalog-search-status'), retry = byId('catalog-retry');
  const original = { rows: rows.innerHTML, count: count.textContent };
  let catalogue, pending, serial = 0, resultPage = 1;
  const changed = () => document.dispatchEvent(new Event('directory-rows-rendered'));
  function restore() {
    rows.innerHTML = original.rows;
    count.textContent = original.count;
    nativePages.hidden = false;
    resultPages.hidden = true;
    rows.removeAttribute('aria-busy');
    changed();
  }
  async function load() {
    if (catalogue) return catalogue;
    if (!pending) pending = (async () => {
      const response = await fetch(controls.dataset.source, { credentials: 'omit', cache: 'no-cache', signal: AbortSignal.timeout(10000) });
      if (!response.ok) throw new Error('Catalogue request failed');
      const value = await response.json();
      if (!validCatalog(value)) throw new Error('Invalid catalogue');
      catalogue = value;
      return value;
    })().finally(() => { pending = null; });
    return pending;
  }
  async function render(resetPage = true) {
    const request = ++serial;
    if (resetPage) resultPage = 1;
    retry.hidden = true;
    status.textContent = '';
    const filters = { query: search.value, category: category.value };
    if (!filters.query.trim() && !filters.category) { restore(); return; }
    rows.setAttribute('aria-busy', 'true');
    if (!catalogue) status.textContent = 'Loading the full directory for search…';
    try {
      const projects = await load();
      if (request !== serial) return;
      const state = projectPage(filterProjects(projects, filters), resultPage);
      resultPage = state.page;
      rows.innerHTML = tableRows(state.items, controls.dataset.prefix);
      count.textContent = pageSummary(state, true);
      nativePages.hidden = true;
      resultPages.hidden = state.pageCount === 1;
      previous.disabled = state.page === 1;
      next.disabled = state.page === state.pageCount;
      byId('search-page').textContent = `Results page ${state.page} of ${state.pageCount}`;
      status.textContent = '';
      changed();
    } catch {
      if (request !== serial) return;
      restore();
      status.textContent = 'Search is unavailable. Showing this directory page; use the page and category links or retry search.';
      retry.hidden = false;
    } finally {
      if (request === serial) rows.removeAttribute('aria-busy');
    }
  }
  search.addEventListener('input', () => render());
  category.addEventListener('change', () => render());
  previous.addEventListener('click', () => { if (!previous.disabled) { resultPage -= 1; render(false); } });
  next.addEventListener('click', () => { if (!next.disabled) { resultPage += 1; render(false); } });
  retry.addEventListener('click', () => render());
  // Browsers may restore a previous input value when returning to this page.
  if (search.value.trim() || category.value) render();
}

if (typeof document !== 'undefined') mountDirectorySearch();
