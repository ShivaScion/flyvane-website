import { processAdvisorySubmission } from '../app/api/advisory/route';
import { applyOwaspHeaders } from '../app/api/auth/security';

export default async function handler(req: any, res: any) {
  applyOwaspHeaders(res);
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use POST.' });
  }

  // OWASP Resource Exhaustion & DoS Defense: Strict 50KB Payload Cap
  const rawBodyStr = typeof req.body === 'string' ? req.body : JSON.stringify(req.body || {});
  if (rawBodyStr.length > 50 * 1024) {
    return res.status(413).json({ success: false, error: 'Payload exceeds maximum limit (50KB).' });
  }

  try {
    const rawBody = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {};
    const name = rawBody.name || 'Partner';
    const contact = rawBody.contact || rawBody.contactInfo || '';
    const serviceScope = rawBody.serviceScope || rawBody.projectType || 'Autonomous Pipeline Architecture';
    const projectBrief = rawBody.projectBrief || rawBody.message || 'Direct contact form inquiry.';
    const activeMode = rawBody.activeMode || 'machine';

    if (!contact.trim()) {
      return res.status(400).json({ error: 'Contact email or handle is required.' });
    }

    const result = await processAdvisorySubmission({
      name,
      contact: contact.trim(),
      serviceScope,
      projectBrief: projectBrief.trim(),
      activeMode,
      trapField: rawBody.trapField || rawBody.trap || '',
    });

    return res.status(result.status).json(result.body);
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Internal server error' });
  }
}
