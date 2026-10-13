import { processAdvisorySubmission } from '../app/api/advisory/route';
import { applyOwaspHeaders } from '../app/api/auth/security';
import { validateAdminSession } from '../app/api/auth/otpStore';
import fs from 'fs';
import path from 'path';

export default async function handler(req: any, res: any) {
  applyOwaspHeaders(res);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // OWASP A01: Broken Access Control & BOLA Prevention
  if (req.method === 'GET') {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.replace(/^Bearer\s+/i, '').trim();
    if (!validateAdminSession(token)) {
      return res.status(401).json({ success: false, error: 'Unauthorized: Admin authentication required.' });
    }

    try {
      const storePath = path.resolve(process.cwd(), 'supabase', 'advisory_leads_store.json');
      const records = fs.existsSync(storePath)
        ? JSON.parse(fs.readFileSync(storePath, 'utf8') || '[]')
        : [];
      return res.status(200).json({ table: 'advisory_leads', records });
    } catch {
      return res.status(200).json({ table: 'advisory_leads', records: [] });
    }
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // OWASP Resource Exhaustion & DoS Defense: Strict 50KB Payload Cap
  const rawBodyStr = typeof req.body === 'string' ? req.body : JSON.stringify(req.body || {});
  if (rawBodyStr.length > 50 * 1024) {
    return res.status(413).json({ success: false, error: 'Payload exceeds maximum limit (50KB).' });
  }

  const rawBody = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body;
  const result = await processAdvisorySubmission(rawBody);
  return res.status(result.status).json(result.body);
}
