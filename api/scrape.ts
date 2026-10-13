import { applyOwaspHeaders } from '../app/api/auth/security';

function isPrivateIpOrHost(hostname: string): boolean {
  const lower = hostname.toLowerCase();
  if (
    lower === 'localhost' ||
    lower === '127.0.0.1' ||
    lower === '0.0.0.0' ||
    lower === '::1' ||
    lower.endsWith('.local') ||
    lower.endsWith('.internal')
  ) {
    return true;
  }

  // Cloud metadata endpoint (AWS, GCP, Azure, DigitalOcean)
  if (lower === '169.254.169.254') {
    return true;
  }

  // Private RFC 1918 ranges
  if (lower.startsWith('10.') || lower.startsWith('192.168.')) {
    return true;
  }
  const match172 = lower.match(/^172\.(\d+)\./);
  if (match172) {
    const octet = parseInt(match172[1], 10);
    if (octet >= 16 && octet <= 31) return true;
  }

  return false;
}

export default async function handler(req: any, res: any) {
  applyOwaspHeaders(res);
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

    // SSRF protection: block private networks and cloud metadata service
    if (isPrivateIpOrHost(parsed.hostname)) {
      return res.status(403).json({ error: 'Access to private and internal infrastructure is prohibited.' });
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
