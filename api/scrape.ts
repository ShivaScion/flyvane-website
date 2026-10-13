export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed. Use GET.' });
  }

  try {
    const target = req.query?.url;
    if (!target || typeof target !== 'string') {
      return res.status(400).json({ error: 'Missing target url parameter' });
    }

    // SSRF protection: only allow HTTP/HTTPS URLs
    const parsed = new URL(target);
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      return res.status(400).json({ error: 'Invalid URL protocol. Only HTTP and HTTPS are permitted.' });
    }

    const resp = await fetch(target, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      },
    });

    const html = await resp.text();
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    return res.status(resp.status).send(html);
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Failed to fetch target' });
  }
}
