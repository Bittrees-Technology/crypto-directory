import { filterProjects, projectWindow, createCatalogueScroller, pageSummary, tableRows, updateCatalogueSchema } from './catalog.mjs';

function validCatalog(value) {
  return Array.isArray(value) && value.length <= 10000 && value.every(project => project &&
    ['id', 'name', 'description', 'lead_category', 'verification_status', 'primary_url'].every(key => typeof project[key] === 'string') &&
    ['tags', 'ecosystem'].every(key => Array.isArray(project[key]) && project[key].every(item => typeof item === 'string')));
}

// Crawlable static pages remain available when JavaScript or the full feed fails.
export function mountDirectorySearch({ document = globalThis.document, fetch = globalThis.fetch } = {}) {
  const controls = document.querySelector('[data-catalog-search]');
  if (!controls) return;
  const byId = id => document.getElementById(id);
  const search = byId('search'), category = byId('category'), rows = byId('rows');
  const count = byId('catalog-count'), nativePages = byId('catalog-pagination');
  const resultPages = byId('search-pagination'), status = byId('catalog-search-status'), retry = byId('catalog-retry');
  const schema = byId('catalog-schema');
  const original = { rows: rows.innerHTML, count: count.textContent, schema: schema?.textContent, pages: nativePages.innerHTML };
  let catalogue, pending, batches = 1;
  const changed = () => document.dispatchEvent(new Event('directory-rows-rendered'));
  const scroller = createCatalogueScroller(document, nativePages, () => { batches++; render(false, true); });
  function render(reset = true, append = false) {
    if (reset) batches = 1;
    if (!catalogue) return loadAndRender();
    const filtering = !!(search?.value.trim() || category?.value);
    const projects = filterProjects(catalogue, { query: search?.value || '', category: category?.value || controls.dataset.category || '' });
    const state = projectWindow(projects, filtering ? 1 : Number(controls.dataset.page || 1), batches);
    if (append) rows.insertAdjacentHTML('beforeend', tableRows(state.items.slice(rows.children.length), controls.dataset.prefix));
    else rows.innerHTML = tableRows(state.items, controls.dataset.prefix);
    updateCatalogueSchema(document, state);
    count.textContent = pageSummary(state, filtering);
    if (resultPages) resultPages.hidden = true;
    scroller.update(state);
    status.textContent = ''; retry.hidden = true;
    rows.removeAttribute('aria-busy'); changed();
  }
  async function loadAndRender() {
    if (pending) return pending;
    retry.hidden = true; rows.setAttribute('aria-busy', 'true');
    status.textContent = 'Loading the full directory…';
    pending = (async () => {
      try {
        const response = await fetch(controls.dataset.source, { credentials: 'omit', cache: 'no-cache', signal: AbortSignal.timeout(10000) });
        if (!response.ok) throw new Error('Catalogue request failed');
        const value = await response.json();
        if (!validCatalog(value)) throw new Error('Invalid catalogue');
        catalogue = value; render();
      } catch {
        rows.innerHTML = original.rows; count.textContent = original.count;
        if (schema) schema.textContent = original.schema;
        nativePages.innerHTML = original.pages; nativePages.hidden = false;
        if (resultPages) resultPages.hidden = true;
        status.textContent = 'The full directory could not be loaded. Use the page and category links, or retry.';
        retry.hidden = false; changed();
      } finally { rows.removeAttribute('aria-busy'); }
    })().finally(() => { pending = null; });
    return pending;
  }
  for (const control of [search, category].filter(Boolean)) control.addEventListener(control === search ? 'input' : 'change', () => render());
  retry.addEventListener('click', () => loadAndRender());
  return loadAndRender();
}

if (typeof document !== 'undefined') mountDirectorySearch();
