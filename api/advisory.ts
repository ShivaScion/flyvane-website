import { processAdvisorySubmission } from '../app/api/advisory/route';
import { applyOwaspHeaders } from '../app/api/auth/security';
import fs from 'fs';
import path from 'path';

export default async function handler(req: any, res: any) {
  applyOwaspHeaders(res);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
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

  const rawBody = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body;
  const result = await processAdvisorySubmission(rawBody);
  return res.status(result.status).json(result.body);
}
