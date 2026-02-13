import { promises as fs } from 'node:fs';
import path from 'node:path';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const siteDir = path.join(root, 'site');

const htmlFiles = [
  path.join(siteDir, 'index.html'),
  path.join(siteDir, 'review.html'),
  path.join(siteDir, 'needs-update.html'),
  path.join(siteDir, 'submit.html')
];

async function listCategoryPages() {
  const dir = path.join(siteDir, 'categories');
  const files = await fs.readdir(dir);
  return files.filter((f) => f.endsWith('.html')).map((f) => path.join(dir, f));
}

function extractHrefs(html) {
  const matches = html.matchAll(/href="([^"]+)"/g);
  return [...matches].map((m) => m[1]);
}

function normalizeInternalHref(href) {
  if (!href.startsWith('/')) return null;
  const clean = href.split('#')[0].split('?')[0];
  if (clean === '/') return '/index.html';
  return clean;
}

async function checkInternalLinks(pages) {
  const broken = [];
  for (const page of pages) {
    const html = await fs.readFile(page, 'utf8');
    const hrefs = extractHrefs(html).filter((h) => h.startsWith('/'));
    for (const href of hrefs) {
      const normalized = normalizeInternalHref(href);
      if (!normalized) continue;
      const target = path.join(siteDir, normalized.slice(1));
      try {
        await fs.access(target);
      } catch {
        broken.push({
          source: path.relative(root, page),
          href
        });
      }
    }
  }
  return broken;
}

function collectExternalUrls(hrefs) {
  const set = new Set();
  for (const href of hrefs) {
    if (href.startsWith('http://') || href.startsWith('https://')) {
      set.add(href);
    }
  }
  return [...set];
}

function isValidHttpUrl(value) {
  try {
    const u = new URL(value);
    return u.protocol === 'http:' || u.protocol === 'https:';
  } catch {
    return false;
  }
}

async function fetchStatus(url, timeoutMs = 8000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    let res = await fetch(url, {
      method: 'HEAD',
      redirect: 'manual',
      signal: controller.signal
    });
    if (res.status === 405 || res.status === 403) {
      res = await fetch(url, {
        method: 'GET',
        redirect: 'manual',
        signal: controller.signal
      });
    }
    const location = res.headers.get('location');
    return {
      ok: res.status >= 200 && res.status < 400,
      status: res.status,
      location: location || null
    };
  } catch (err) {
    return {
      ok: false,
      status: null,
      error: err?.name === 'AbortError' ? 'timeout' : (err?.message || 'network error'),
      location: null
    };
  } finally {
    clearTimeout(timer);
  }
}

async function checkExternalUrls(urls, concurrency = 25) {
  const results = [];
  let idx = 0;

  async function worker() {
    while (idx < urls.length) {
      const i = idx;
      idx += 1;
      const url = urls[i];
      const result = await fetchStatus(url);
      results.push({ url, ...result });
    }
  }

  const workers = Array.from({ length: Math.min(concurrency, urls.length) }, () => worker());
  await Promise.all(workers);
  return results;
}

function summarizeExternal(results) {
  const summary = {
    ok: 0,
    redirects: 0,
    bad_status: 0,
    errors: 0
  };
  for (const r of results) {
    if (r.status && r.status >= 300 && r.status < 400) {
      summary.redirects += 1;
    } else if (r.ok) {
      summary.ok += 1;
    } else if (r.status) {
      summary.bad_status += 1;
    } else {
      summary.errors += 1;
    }
  }
  return summary;
}

async function main() {
  const categoryPages = await listCategoryPages();
  const pages = [...htmlFiles, ...categoryPages];

  const allHrefs = [];
  for (const page of pages) {
    const html = await fs.readFile(page, 'utf8');
    allHrefs.push(...extractHrefs(html));
  }

  const brokenInternal = await checkInternalLinks(pages);
  const externalUrls = collectExternalUrls(allHrefs);
  const invalidExternal = externalUrls.filter((u) => !isValidHttpUrl(u));
  const validExternal = externalUrls.filter((u) => isValidHttpUrl(u));
  const externalResults = await checkExternalUrls(validExternal);
  const externalSummary = summarizeExternal(externalResults);

  const brokenExternal = externalResults.filter(
    (r) => !r.ok || (r.status && r.status >= 400)
  );

  const redirecting = externalResults.filter(
    (r) => r.status && r.status >= 300 && r.status < 400
  );

  const report = {
    generated_at: new Date().toISOString(),
    checked_pages: pages.map((p) => path.relative(root, p)),
    internal: {
      checked_links: allHrefs.filter((h) => h.startsWith('/')).length,
      broken_count: brokenInternal.length,
      broken: brokenInternal
    },
    external: {
      unique_links: externalUrls.length,
      invalid_format_count: invalidExternal.length,
      invalid_format: invalidExternal,
      summary: externalSummary,
      broken_count: brokenExternal.length,
      broken: brokenExternal,
      redirects_count: redirecting.length,
      redirects: redirecting
    }
  };

  const outPath = path.join(root, 'reports', 'link-check.json');
  await fs.mkdir(path.dirname(outPath), { recursive: true });
  await fs.writeFile(outPath, JSON.stringify(report, null, 2) + '\n');

  console.log(`Internal broken: ${brokenInternal.length}`);
  console.log(`External unique: ${externalUrls.length}`);
  console.log(`External invalid format: ${invalidExternal.length}`);
  console.log(`External ok: ${externalSummary.ok}`);
  console.log(`External redirects: ${externalSummary.redirects}`);
  console.log(`External bad status: ${externalSummary.bad_status}`);
  console.log(`External errors: ${externalSummary.errors}`);
  console.log(`Report: ${path.relative(root, outPath)}`);
}

main().catch((err) => {
  console.error(err?.message || err);
  process.exit(1);
});
