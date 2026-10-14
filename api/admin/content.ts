import { validateAdminSession } from '../../app/api/auth/otpStore.ts';
import { applyOwaspHeaders, sanitizeData, sanitizeServerText } from '../../app/api/auth/security.ts';
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const storePath = path.resolve(process.cwd(), 'supabase', 'site_content_store.json');

function getSupabase() {
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (url && key) {
    return createClient(url, key, { auth: { persistSession: false } });
  }
  return null;
}

export default async function handler(req: any, res: any) {
  applyOwaspHeaders(res);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // GET: Public or admin can read content
  if (req.method === 'GET') {
    try {
      const supabase = getSupabase();
      if (supabase) {
        const { data, error } = await supabase.from('site_content').select('*');
        if (!error && data && data.length > 0) {
          const contentMap: Record<string, any> = {};
          data.forEach((row: any) => {
            contentMap[row.key] = row.value;
          });
          return res.status(200).json({ success: true, source: 'supabase', content: contentMap });
        }
      }

      // Local fallback
      if (fs.existsSync(storePath)) {
        const localData = JSON.parse(fs.readFileSync(storePath, 'utf8') || '{}');
        return res.status(200).json({ success: true, source: 'local', content: localData });
      }

      return res.status(200).json({ success: true, source: 'default', content: {} });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  // POST/PUT: Requires valid admin token
  if (req.method === 'POST' || req.method === 'PUT') {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.replace(/^Bearer\s+/i, '').trim();

    if (!validateAdminSession(token)) {
      return res.status(401).json({ success: false, error: 'Unauthorized: invalid or expired session token.' });
    }

    try {
      const rawBody = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body || {};
      const { key, value } = rawBody;

      if (!key) {
        return res.status(400).json({ success: false, error: 'Missing content key.' });
      }

      const safeKey = sanitizeServerText(key, 50);
      const safeValue = sanitizeData(value);

      const supabase = getSupabase();
      if (supabase) {
        await supabase
          .from('site_content')
          .upsert([{ key: safeKey, value: safeValue, updated_at: new Date().toISOString() }], { onConflict: 'key' });
      }

      // Persist to local store mirror
      try {
        const dir = path.dirname(storePath);
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
        const existing = fs.existsSync(storePath) ? JSON.parse(fs.readFileSync(storePath, 'utf8') || '{}') : {};
        existing[safeKey] = safeValue;
        fs.writeFileSync(storePath, JSON.stringify(existing, null, 2), 'utf8');
      } catch {}

      return res.status(200).json({ success: true, message: `Content key "${safeKey}" successfully updated.` });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message || 'Failed to update content.' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
