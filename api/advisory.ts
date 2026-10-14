import { processAdvisorySubmission } from '../app/api/advisory/route.ts';
import { applyOwaspHeaders } from '../app/api/auth/security.ts';
import { validateAdminSession } from '../app/api/auth/otpStore.ts';
import fs from 'fs';
import path from 'path';

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
  applyOwaspHeaders(res);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  const method = (req.method || 'GET').toUpperCase();

  if (method === 'OPTIONS') {
    return sendResponse(res, 200, '');
  }

  // OWASP A01: Broken Access Control & BOLA Prevention
  if (method === 'GET') {
    const authHeader = req.headers?.authorization || '';
    const token = authHeader.replace(/^Bearer\s+/i, '').trim();
    if (!validateAdminSession(token)) {
      return sendResponse(res, 401, { success: false, error: 'Unauthorized: Admin authentication required.' }, true);
    }

    try {
      const storePath = path.resolve(process.cwd(), 'supabase', 'advisory_leads_store.json');
      const records = fs.existsSync(storePath)
        ? JSON.parse(fs.readFileSync(storePath, 'utf8') || '[]')
        : [];
      return sendResponse(res, 200, { table: 'advisory_leads', records }, true);
    } catch {
      return sendResponse(res, 200, { table: 'advisory_leads', records: [] }, true);
    }
  }

  if (method !== 'POST') {
    return sendResponse(res, 405, { error: 'Method not allowed' }, true);
  }

  try {
    let rawBody = req.body;
    if (typeof rawBody === 'string') {
      try {
        rawBody = JSON.parse(rawBody);
      } catch {
        rawBody = {};
      }
    } else if (!rawBody && typeof req[Symbol.asyncIterator] === 'function') {
      const chunks: any[] = [];
      for await (const chunk of req) {
        chunks.push(chunk);
      }
      const str = Buffer.concat(chunks).toString('utf8');
      try {
        rawBody = JSON.parse(str || '{}');
      } catch {
        rawBody = {};
      }
    }

    const rawBodyStr = JSON.stringify(rawBody || {});
    if (rawBodyStr.length > 50 * 1024) {
      return sendResponse(res, 413, { success: false, error: 'Payload exceeds maximum limit (50KB).' }, true);
    }

    const result = await processAdvisorySubmission(rawBody);
    return sendResponse(res, result.status, result.body, true);
  } catch (err: any) {
    return sendResponse(res, 500, { success: false, error: err.message || 'Server error' }, true);
  }
}
