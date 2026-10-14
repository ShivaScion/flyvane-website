import { processAdvisorySubmission } from '../app/api/advisory/route.ts';
import { applyOwaspHeaders } from '../app/api/auth/security.ts';

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
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  const method = (req.method || 'GET').toUpperCase();

  if (method === 'OPTIONS') {
    return sendResponse(res, 200, '');
  }

  if (method !== 'POST') {
    return sendResponse(res, 405, { error: 'Method not allowed. Use POST.' }, true);
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

    const name = rawBody.name || 'Partner';
    const contact = rawBody.contact || rawBody.contactInfo || '';
    const serviceScope = rawBody.serviceScope || rawBody.projectType || 'Autonomous Pipeline Architecture';
    const projectBrief = rawBody.projectBrief || rawBody.message || 'Direct contact form inquiry.';
    const activeMode = rawBody.activeMode || 'machine';

    if (!contact.trim()) {
      return sendResponse(res, 400, { error: 'Contact email or handle is required.' }, true);
    }

    const result = await processAdvisorySubmission({
      name,
      contact: contact.trim(),
      serviceScope,
      projectBrief: projectBrief.trim(),
      activeMode,
      trapField: rawBody.trapField || rawBody.trap || '',
    });

    return sendResponse(res, result.status, result.body, true);
  } catch (err: any) {
    return sendResponse(res, 500, { error: err.message || 'Internal server error' }, true);
  }
}
