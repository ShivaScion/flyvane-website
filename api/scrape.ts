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

function sendResponse(res: any, status: number, body: any, isJson = false) {
  if (typeof res.status === 'function') {
    if (isJson) {
      return res.status(status).json(body);
    }
    return res.status(status).send(body);
  }
  res.statusCode = status;
  if (isJson) {
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    return res.end(JSON.stringify(body));
  }
  return res.end(body);
}

export default async function handler(req: any, res: any) {
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  const method = (req.method || 'GET').toUpperCase();

  if (method === 'OPTIONS') {
    return sendResponse(res, 200, '');
  }

  if (method !== 'GET') {
    return sendResponse(res, 405, { error: 'Method not allowed. Use GET.' }, true);
  }

  try {
    let target = req.query?.url;
    if (!target && req.url) {
      try {
        const u = new URL(req.url, 'http://localhost');
        target = u.searchParams.get('url');
      } catch {
        // fallback
      }
    }

    if (!target || typeof target !== 'string') {
      return sendResponse(res, 400, { error: 'Missing target url parameter' }, true);
    }

    let parsed: URL;
    try {
      parsed = new URL(target.startsWith('http') ? target : `https://${target}`);
    } catch {
      return sendResponse(res, 400, { error: 'Invalid URL syntax' }, true);
    }

    // SSRF protection: only allow HTTP/HTTPS URLs
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      return sendResponse(res, 400, { error: 'Invalid URL protocol. Only HTTP and HTTPS are permitted.' }, true);
    }

    // SSRF protection: block private networks and cloud metadata service
    if (isPrivateIpOrHost(parsed.hostname)) {
      return sendResponse(res, 403, { error: 'Access to private and internal infrastructure is prohibited.' }, true);
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 9000);

    const resp = await fetch(parsed.toString(), {
      signal: controller.signal,
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
      },
    });
    clearTimeout(timeout);

    const html = await resp.text();
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    return sendResponse(res, resp.status || 200, html);
  } catch (err: any) {
    return sendResponse(res, 500, { error: err.message || 'Failed to fetch target' }, true);
  }
}
