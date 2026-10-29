import { getCatalog } from '../lib/catalog.js';
export default async function handler(req, res) {
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.setHeader('Allow', 'GET, HEAD');
    return res.status(405).json({ error: 'Method not allowed' });
  }
  try {
    const catalog = await getCatalog();
    res.setHeader('Cache-Control', catalog.status === 'live' ? 'public, max-age=0, s-maxage=300, stale-while-revalidate=600' : 'public, max-age=0, s-maxage=30');
    return res.status(200).json(catalog);
  } catch {
    return res.status(503).json({ error: 'The tide is out. Please try again shortly.' });
  }
}
