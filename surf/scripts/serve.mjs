import http from 'node:http';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { getCatalog } from '../lib/catalog.js';
const publicRoot = fileURLToPath(new URL('../public', import.meta.url));
const mime = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.svg': 'image/svg+xml', '.xml': 'application/xml', '.txt': 'text/plain' };
http.createServer(async (req, res) => {
  const pathname = new URL(req.url, 'http://localhost').pathname;
  try {
    if (pathname === '/api/catalog') {
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(await getCatalog())); return;
    }
    const file = path.resolve(publicRoot, '.' + (pathname === '/' ? '/index.html' : pathname));
    if (!file.startsWith(publicRoot + path.sep)) { res.writeHead(403).end(); return; }
    res.setHeader('Content-Type', mime[path.extname(file)] || 'application/octet-stream');
    res.end(await readFile(file));
  } catch { res.writeHead(404).end('Not found'); }
}).listen(4173, '127.0.0.1', () => console.log('Surf: http://127.0.0.1:4173'));
