import { legacyIds } from './legacy-ids.js';
export function safeUrl(value) {
  try {
    const u = new URL(value);
    const host = u.hostname.toLowerCase();
    if (!['https:', 'http:'].includes(u.protocol) || u.username || u.password) return null;
    if (!host.includes('.') || host === 'localhost' || host.endsWith('.local') || host.endsWith('.localhost') || /^[\d.]+$/.test(host) || host.includes(':') || host.endsWith('.internal')) return null;
    return u.href;
  } catch { return null; }
}

export function normalizeCatalog(raw) {
  if (!Array.isArray(raw)) throw new Error('Directory feed must be an array');
  const unique = new Map();
  for (const p of raw) {
    if (p?.verification_status !== 'verified' || !p.name || !p.lead_category) continue;
    const website = safeUrl(p.primary_url);
    const product = safeUrl(p.product_url);
    if (!website && !product) continue;
    // Entry filenames are assigned by CryptoDirectory and survive URL/name edits.
    const id = typeof p.id === 'string' && /^[a-z0-9][a-z0-9._-]{0,160}\.md$/i.test(p.id) ? p.id : null;
    if (!id) continue;
    if (unique.has(id)) continue;
    unique.set(id, {
      id, legacyIds: [...new Set([...(legacyIds[id] || []), (website || product).replace(/\/$/, '').toLowerCase()])], name: String(p.name).slice(0, 120), category: String(p.lead_category).slice(0, 100),
      description: String(p.description || '').slice(0, 600), website, product,
      tags: Array.isArray(p.tags) ? p.tags.map(String).slice(0, 12) : [],
      ecosystems: Array.isArray(p.ecosystem) ? p.ecosystem.map(String).slice(0, 12) : []
    });
  }
  return [...unique.values()];
}

export function resolveProject(value, projects) {
  return projects.find(p => p.id === value || p.legacyIds?.includes(value)) || null;
}

export function currentSelection(current, projects, category='All waves', mode='either') {
  if (!current) return null;
  if (mode !== 'either' && current.type !== mode) return null;
  const p = resolveProject(current.id, candidates(projects, category, mode));
  if (!p || !p[current.type]) return null;
  return { ...current, id: p.id, project: p, url: p[current.type] };
}

export function candidates(projects, category = 'All waves', mode = 'either', query = '') {
  const q = query.toLowerCase().trim();
  return projects.filter(p => (category === 'All waves' || p.category === category)
    && (mode !== 'product' || p.product) && (mode !== 'website' || p.website)
    && (!q || [p.name, p.description, p.category, ...p.tags, ...p.ecosystems].join(' ').toLowerCase().includes(q)));
}

export function chooseProject(pool, seen = [], currentId = null, random = Math.random) {
  if (!pool.length) return null;
  const unseen = pool.filter(p => !seen.includes(p.id) && p.id !== currentId);
  const eligible = unseen.length ? unseen : pool.filter(p => p.id !== currentId);
  const choices = eligible.length ? eligible : pool;
  return choices[Math.min(choices.length - 1, Math.floor(random() * choices.length))];
}

export function targetFor(project, mode = 'either', random = Math.random) {
  if (mode === 'product' && project.product) return { type: 'product', url: project.product };
  if (mode === 'website' && project.website) return { type: 'website', url: project.website };
  if (project.product && project.product !== project.website && (!project.website || random() > .5)) return { type: 'product', url: project.product };
  return { type: 'website', url: project.website || project.product };
}
