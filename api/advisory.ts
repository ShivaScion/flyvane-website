import { z } from 'zod';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';
import twilio from 'twilio';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';

function applyOwaspHeaders(res: any) {
  try {
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  } catch {
    // Ignore header errors if already sent
  }
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

function sanitizeServerText(raw: unknown, maxLength = 2500): string {
  if (typeof raw !== 'string') {
    if (raw === null || raw === undefined) return '';
    return String(raw).slice(0, maxLength);
  }

  let cleaned = raw;
  cleaned = cleaned.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  cleaned = cleaned.replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '');
  cleaned = cleaned.replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, '');
  cleaned = cleaned.replace(/<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi, '');
  cleaned = cleaned.replace(/\bon\w+\s*=\s*(?:'[^']*'|"[^"]*"|[^\s>]+)/gi, '');
  cleaned = cleaned.replace(/(javascript|vbscript|data):/gi, '');
  cleaned = cleaned.replace(/<\/?[^>]+(>|$)/g, '');
  cleaned = cleaned.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');
  return cleaned.trim().slice(0, maxLength);
}

function escapeHtmlServer(str: string): string {
  if (!str) return '';
  return str.replace(/[&<>"'`=\/]/g, (s) => {
    const map: Record<string, string> = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#x27;',
      '/': '&#x2F;',
      '`': '&#x60;',
      '=': '&#x3D;',
    };
    return map[s] || s;
  });
}

function detectContactType(contact: string): 'email' | 'linkedin' | 'unknown' {
  const trimmed = contact.trim().toLowerCase();
  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
    return 'email';
  }
  if (trimmed.includes('linkedin.com') || trimmed.startsWith('in/')) {
    return 'linkedin';
  }
  return 'unknown';
}

const AdvisoryPayloadSchema = z.object({
  name: z.string().min(2).max(100),
  contact: z.string().min(3).max(200),
  serviceScope: z.string().min(2).max(200),
  projectBrief: z.string().min(10).max(2000),
  activeMode: z.enum(['machine', 'mind', 'hybrid']).default('machine'),
  trapField: z.string().optional().default(''),
  website_url: z.string().optional().default(''),
  trap: z.string().optional().default(''),
});

function buildAdminEmailHtml(payload: any, leadId: string): string {
  const safeName = escapeHtmlServer(payload.name);
  const safeContact = escapeHtmlServer(payload.contact);
  const safeScope = escapeHtmlServer(payload.serviceScope);
  const safeBrief = escapeHtmlServer(payload.projectBrief);
  const safeMode = escapeHtmlServer((payload.activeMode || 'machine').toUpperCase());
  const safeLeadId = escapeHtmlServer(leadId);

  return `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #07080B; color: #E4E4E7; padding: 36px; border-radius: 16px; border: 1px solid rgba(255,255,255,0.08); max-width: 640px; margin: 0 auto;">
      <div style="font-size: 11px; letter-spacing: 0.2em; text-transform: uppercase; color: #10B981; font-weight: 600; margin-bottom: 8px;">
        FLYVANE ADVISORY INTAKE — ${safeMode} MODE
      </div>
      <h1 style="font-size: 22px; font-weight: 600; color: #FFFFFF; margin: 0 0 24px 0;">
        New Advisory Brief from ${safeName}
      </h1>
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px; font-size: 14px;">
        <tr>
          <td style="padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.08); color: #A1A1AA; width: 140px;">Lead ID</td>
          <td style="padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.08); color: #FFFFFF; font-family: monospace;">${safeLeadId}</td>
        </tr>
        <tr>
          <td style="padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.08); color: #A1A1AA;">Client</td>
          <td style="padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.08); color: #FFFFFF; font-weight: 600;">${safeName}</td>
        </tr>
        <tr>
          <td style="padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.08); color: #A1A1AA;">Contact Handle</td>
          <td style="padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.08); color: #38BDF8;">${safeContact}</td>
        </tr>
        <tr>
          <td style="padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.08); color: #A1A1AA;">Service Scope</td>
          <td style="padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.08); color: #10B981; font-weight: 600;">${safeScope}</td>
        </tr>
        <tr>
          <td style="padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.08); color: #A1A1AA;">Active Mode</td>
          <td style="padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.08); color: #E4E4E7; text-transform: uppercase;">${safeMode}</td>
        </tr>
      </table>
      <div style="background-color: #0B0D13; border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; padding: 20px;">
        <div style="font-size: 11px; letter-spacing: 0.15em; text-transform: uppercase; color: #A1A1AA; margin-bottom: 10px;">
          Full Project Brief
        </div>
        <div style="font-size: 14px; line-height: 1.6; color: #F4F4F5; white-space: pre-wrap;">${safeBrief}</div>
      </div>
    </div>
  `;
}

function buildProspectAckHtml(payload: any, leadId: string): string {
  const safeName = escapeHtmlServer(payload.name);
  const safeScope = escapeHtmlServer(payload.serviceScope);
  const safeLeadId = escapeHtmlServer(leadId);

  return `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #07080B; color: #E4E4E7; padding: 36px; border-radius: 16px; border: 1px solid rgba(255,255,255,0.08); max-width: 600px; margin: 0 auto;">
      <div style="font-size: 11px; letter-spacing: 0.2em; text-transform: uppercase; color: #10B981; font-weight: 600; margin-bottom: 8px;">
        FLYVANE ADVISORY DESK
      </div>
      <h1 style="font-size: 22px; font-weight: 600; color: #FFFFFF; margin: 0 0 16px 0;">
        Brief Received — ${safeScope}
      </h1>
      <p style="font-size: 14px; line-height: 1.6; color: #D4D4D8; margin-bottom: 20px;">
        Dear ${safeName},<br/><br/>
        Your project brief (Reference: <span style="font-family: monospace; color: #FFFFFF;">${safeLeadId}</span>) has been securely logged with Flyvane. Our partners will review your architectural and commercial scope and initiate direct contact within our <strong>24-hour SLA response window</strong>.
      </p>
      <div style="background-color: #0B0D13; border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; padding: 16px; font-size: 13px; color: #A1A1AA;">
        <strong>Submitted Scope:</strong> ${safeScope}<br/>
        <strong>SLA Response Window:</strong> Within 24 business hours
      </div>
    </div>
  `;
}

export default async function handler(req: any, res: any) {
  applyOwaspHeaders(res);

  const method = (req.method || 'GET').toUpperCase();

  if (method === 'OPTIONS') {
    return sendResponse(res, 200, '');
  }

  // GET: For Admin Dashboard
  if (method === 'GET') {
    const authHeader = req.headers?.authorization || '';
    const token = authHeader.replace(/^Bearer\s+/i, '').trim();
    if (!token) {
      return sendResponse(res, 401, { success: false, error: 'Unauthorized: Admin authentication required.' }, true);
    }

    const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.VITE_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

    if (supabaseUrl && supabaseKey) {
      try {
        const supabase = createClient(supabaseUrl, supabaseKey, { auth: { persistSession: false } });
        const { data, error } = await supabase.from('advisory_leads').select('*').order('created_at', { ascending: false });
        if (!error && data) {
          return sendResponse(res, 200, { table: 'advisory_leads', records: data }, true);
        }
      } catch {
        // Fallback
      }
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
    }
    rawBody = rawBody || {};

    // 1. Honeypot check
    if (rawBody && typeof rawBody === 'object') {
      const hp = [rawBody.trapField, rawBody.website_url, rawBody.trap].find(
        (v) => typeof v === 'string' && v.trim().length > 0
      );
      if (hp) {
        return sendResponse(res, 200, { success: true }, true);
      }
    }

    // 2. Validate payload
    const parsed = AdvisoryPayloadSchema.safeParse(rawBody);
    if (!parsed.success) {
      return sendResponse(res, 400, {
        success: false,
        error: 'Validation failed. Please verify all required fields.',
        details: parsed.error.flatten(),
      }, true);
    }

    const { name, contact, serviceScope, projectBrief, activeMode } = parsed.data;

    // 3. Sanitize inputs
    const sanitizedName = sanitizeServerText(name, 100);
    const sanitizedContact = sanitizeServerText(contact, 200);
    const sanitizedServiceScope = sanitizeServerText(serviceScope, 200);
    const sanitizedProjectBrief = sanitizeServerText(projectBrief, 2000);

    const safePayload = {
      name: sanitizedName,
      contact: sanitizedContact,
      serviceScope: sanitizedServiceScope,
      projectBrief: sanitizedProjectBrief,
      activeMode,
    };

    const contactType = detectContactType(sanitizedContact);
    let leadId: string = crypto.randomUUID();

    const recordToInsert = {
      name: sanitizedName,
      contact_handle: sanitizedContact,
      contact_type: contactType,
      service_scope: sanitizedServiceScope,
      project_brief: sanitizedProjectBrief,
      active_mode: activeMode,
      status: 'new' as const,
    };

    // 4. Ingest into Supabase
    const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.VITE_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

    if (supabaseUrl && supabaseKey) {
      try {
        const supabase = createClient(supabaseUrl, supabaseKey, { auth: { persistSession: false } });
        const { data, error } = await supabase
          .from('advisory_leads')
          .insert([recordToInsert])
          .select('id')
          .single();

        if (!error && data?.id) {
          leadId = data.id;
        } else if (error) {
          console.error('[FLYVANE SUPABASE ERROR]', error.message);
        }
      } catch (dbErr) {
        console.error('[FLYVANE SUPABASE EXCEPTION]', dbErr);
      }
    }

    // 5. Ingest into Local store mirror (when running in persistent node / dev)
    try {
      const storePath = path.resolve(process.cwd(), 'supabase', 'advisory_leads_store.json');
      const dir = path.dirname(storePath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      const existing: Array<Record<string, unknown>> = fs.existsSync(storePath)
        ? JSON.parse(fs.readFileSync(storePath, 'utf8') || '[]')
        : [];
      existing.unshift({
        id: leadId,
        created_at: new Date().toISOString(),
        ...recordToInsert,
      });
      fs.writeFileSync(storePath, JSON.stringify(existing, null, 2), 'utf8');
    } catch {
      // Ignore read-only filesystem errors in serverless edge environments
    }

    // 6. Notifications: Email (Resend) & WhatsApp (Twilio)
    const dispatchTasks: Promise<unknown>[] = [];

    const resendApiKey = process.env.RESEND_API_KEY;
    const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL;
    const fromEmail = process.env.RESEND_FROM_EMAIL || 'Flyvane Advisory <advisory@flyvane.com>';

    if (resendApiKey) {
      try {
        const resend = new Resend(resendApiKey);

        if (adminEmail) {
          dispatchTasks.push(
            (async () => {
              const res = await resend.emails.send({
                from: fromEmail,
                to: adminEmail,
                subject: `[Flyvane Advisory - ${activeMode.toUpperCase()}] New Brief from ${sanitizedName}`,
                html: buildAdminEmailHtml(safePayload, leadId),
              });
              if (res.error && res.error.message?.includes('domain')) {
                return resend.emails.send({
                  from: 'onboarding@resend.dev',
                  to: adminEmail,
                  subject: `[Flyvane Advisory - ${activeMode.toUpperCase()}] New Brief from ${sanitizedName}`,
                  html: buildAdminEmailHtml(safePayload, leadId),
                });
              }
              return res;
            })()
          );
        }

        if (contactType === 'email') {
          dispatchTasks.push(
            resend.emails.send({
              from: fromEmail,
              to: sanitizedContact.trim(),
              subject: `Flyvane Advisory — Brief Received (${sanitizedServiceScope})`,
              html: buildProspectAckHtml(safePayload, leadId),
            })
          );
        }
      } catch (e) {
        console.error('[RESEND DISPATCH ERROR]', e);
      }
    }

    const twilioSid = process.env.TWILIO_ACCOUNT_SID;
    const twilioToken = process.env.TWILIO_AUTH_TOKEN;
    const rawTwilioFrom = process.env.TWILIO_WHATSAPP_NUMBER || '';
    const personalWhatsapp = process.env.MY_PERSONAL_WHATSAPP;

    if (twilioSid && twilioToken && rawTwilioFrom && personalWhatsapp) {
      try {
        const cleanTwilioFrom = rawTwilioFrom.replace('whatsapp:++', 'whatsapp:+');
        const cleanPersonalWhatsapp = personalWhatsapp.replace('whatsapp:++', 'whatsapp:+');

        const whatsappBody =
          `*Flyvane Advisory Alert*\n\n` +
          `*Client:* ${sanitizedName}\n` +
          `*Mode:* ${activeMode.toUpperCase()}\n` +
          `*Contact:* ${sanitizedContact}\n` +
          `*Scope:* ${sanitizedServiceScope}\n\n` +
          `*Brief:* ${sanitizedProjectBrief.slice(0, 300)}...`;

        dispatchTasks.push(
          (async () => {
            const client = twilio(twilioSid, twilioToken);
            return client.messages.create({
              from: cleanTwilioFrom.startsWith('whatsapp:') ? cleanTwilioFrom : `whatsapp:${cleanTwilioFrom}`,
              to: cleanPersonalWhatsapp.startsWith('whatsapp:') ? cleanPersonalWhatsapp : `whatsapp:${cleanPersonalWhatsapp}`,
              body: whatsappBody,
            });
          })()
        );
      } catch (e) {
        console.error('[TWILIO DISPATCH ERROR]', e);
      }
    }

    if (dispatchTasks.length > 0) {
      await Promise.allSettled(dispatchTasks);
    }

    return sendResponse(res, 200, {
      success: true,
      leadId,
    }, true);
  } catch (err: any) {
    console.error('[FLYVANE ADVISORY HANDLER ERROR]', err);
    return sendResponse(res, 500, {
      success: false,
      error: err?.message || 'Unable to process advisory brief at this time.',
    }, true);
  }
}
