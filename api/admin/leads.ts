import { validateAdminSession } from '../../app/api/auth/otpStore';
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const storePath = path.resolve(process.cwd(), 'supabase', 'advisory_leads_store.json');

function getSupabase() {
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (url && key) {
    return createClient(url, key, { auth: { persistSession: false } });
  }
  return null;
}

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, PATCH, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const authHeader = req.headers.authorization || '';
  const token = authHeader.replace(/^Bearer\s+/i, '').trim();

  if (!validateAdminSession(token)) {
    return res.status(401).json({ success: false, error: 'Unauthorized: valid admin session required.' });
  }

  // GET: Fetch leads
  if (req.method === 'GET') {
    try {
      const supabase = getSupabase();
      if (supabase) {
        const { data, error } = await supabase
          .from('advisory_leads')
          .select('*')
          .order('created_at', { ascending: false });

        if (!error && data) {
          return res.status(200).json({ success: true, leads: data, source: 'supabase' });
        }
      }

      // Local fallback
      const records = fs.existsSync(storePath)
        ? JSON.parse(fs.readFileSync(storePath, 'utf8') || '[]')
        : [];
      return res.status(200).json({ success: true, leads: records, source: 'local' });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  // PATCH: Update lead status
  if (req.method === 'PATCH') {
    try {
      const rawBody = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body || {};
      const { id, status } = rawBody;

      if (!id || !status) {
        return res.status(400).json({ success: false, error: 'Missing lead id or status.' });
      }

      const supabase = getSupabase();
      if (supabase) {
        await supabase.from('advisory_leads').update({ status }).eq('id', id);
      }

      // Update local store
      if (fs.existsSync(storePath)) {
        const records = JSON.parse(fs.readFileSync(storePath, 'utf8') || '[]');
        const updated = records.map((r: any) => (r.id === id ? { ...r, status } : r));
        fs.writeFileSync(storePath, JSON.stringify(updated, null, 2), 'utf8');
      }

      return res.status(200).json({ success: true, message: `Lead ${id} updated to status "${status}".` });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
