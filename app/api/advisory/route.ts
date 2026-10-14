import { z } from 'zod';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';
import twilio from 'twilio';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { sanitizeServerText } from '../auth/security.ts';

export const AdvisoryPayloadSchema = z.object({
  name: z.string().min(2).max(100),
  contact: z.string().min(3).max(200),
  serviceScope: z.string().min(2).max(200),
  projectBrief: z.string().min(10).max(2000),
  activeMode: z.enum(['machine', 'mind', 'hybrid']),
  trapField: z.string().optional().default(''),
  website_url: z.string().optional().default(''),
  trap: z.string().optional().default(''),
});

export type AdvisoryPayload = z.infer<typeof AdvisoryPayloadSchema>;

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

function buildAdminEmailHtml(payload: AdvisoryPayload, leadId: string): string {
  const safeName = escapeHtmlServer(payload.name);
  const safeContact = escapeHtmlServer(payload.contact);
  const safeScope = escapeHtmlServer(payload.serviceScope);
  const safeBrief = escapeHtmlServer(payload.projectBrief);
  const safeMode = escapeHtmlServer(payload.activeMode.toUpperCase());
  const safeLeadId = escapeHtmlServer(leadId);

  return `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #07080B; color: #E4E4E7; padding: 36px; border-radius: 16px; border: 1px solid rgba(255,255,255,0.08); max-width: 640px; margin: 0 auto;">
      <div style="font-size: 11px; letter-spacing: 0.2em; text-transform: uppercase; color: #10B981; font-weight: 600; margin-bottom: 8px;">
        CRYSTALSTEED ADVISORY INTAKE — ${safeMode} MODE
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

function buildProspectAckHtml(payload: AdvisoryPayload, leadId: string): string {
  const safeName = escapeHtmlServer(payload.name);
  const safeScope = escapeHtmlServer(payload.serviceScope);
  const safeLeadId = escapeHtmlServer(leadId);

  return `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #07080B; color: #E4E4E7; padding: 36px; border-radius: 16px; border: 1px solid rgba(255,255,255,0.08); max-width: 600px; margin: 0 auto;">
      <div style="font-size: 11px; letter-spacing: 0.2em; text-transform: uppercase; color: #10B981; font-weight: 600; margin-bottom: 8px;">
        CRYSTALSTEED ADVISORY DESK
      </div>
      <h1 style="font-size: 22px; font-weight: 600; color: #FFFFFF; margin: 0 0 16px 0;">
        Brief Received — ${safeScope}
      </h1>
      <p style="font-size: 14px; line-height: 1.6; color: #D4D4D8; margin-bottom: 20px;">
        Dear ${safeName},<br/><br/>
        Your project brief (Reference: <span style="font-family: monospace; color: #FFFFFF;">${safeLeadId}</span>) has been securely logged with CrystalSteed. Our partners will review your architectural and commercial scope and initiate direct contact within our <strong>24-hour SLA response window</strong>.
      </p>
      <div style="background-color: #0B0D13; border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; padding: 16px; font-size: 13px; color: #A1A1AA;">
        <strong>Submitted Scope:</strong> ${safeScope}<br/>
        <strong>SLA Response Window:</strong> Within 24 business hours
      </div>
    </div>
  `;
}

export async function processAdvisorySubmission(rawBody: unknown): Promise<{ status: number; body: Record<string, unknown> }> {
  try {
    // 1. Check honeypot before or during parsing
    if (rawBody && typeof rawBody === 'object') {
      const obj = rawBody as Record<string, unknown>;
      const hp = [obj.trapField, obj.website_url, obj.trap].find(
        (v) => typeof v === 'string' && v.trim().length > 0
      );
      if (hp) {
        return { status: 200, body: { success: true } };
      }
    }

    // 2. Zod Input Validation
    const parsed = AdvisoryPayloadSchema.safeParse(rawBody);
    if (!parsed.success) {
      return {
        status: 400,
        body: {
          success: false,
          error: 'Validation failed',
          details: parsed.error.flatten(),
        },
      };
    }

    const { name, contact, serviceScope, projectBrief, activeMode, trapField, website_url, trap } = parsed.data;

    if (
      (trapField && trapField.trim().length > 0) ||
      (website_url && website_url.trim().length > 0) ||
      (trap && trap.trim().length > 0)
    ) {
      return { status: 200, body: { success: true } };
    }

    // OWASP Threat Mitigation: Deep Input Sanitization
    const sanitizedName = sanitizeServerText(name, 100);
    const sanitizedContact = sanitizeServerText(contact, 200);
    const sanitizedServiceScope = sanitizeServerText(serviceScope, 200);
    const sanitizedProjectBrief = sanitizeServerText(projectBrief, 2000);

    const safePayload: AdvisoryPayload = {
      name: sanitizedName,
      contact: sanitizedContact,
      serviceScope: sanitizedServiceScope,
      projectBrief: sanitizedProjectBrief,
      activeMode,
      trapField: '',
      website_url: '',
      trap: '',
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

    // 3. Database Ingestion (Supabase + Local Persistence Mirror for Sandbox Resilience)
    const supabaseUrl =
      process.env.SUPABASE_URL ||
      process.env.NEXT_PUBLIC_SUPABASE_URL ||
      process.env.VITE_SUPABASE_URL;
    const supabaseKey =
      process.env.SUPABASE_SECRET_KEY ||
      process.env.SUPABASE_SERVICE_ROLE_KEY ||
      process.env.VITE_SUPABASE_ANON_KEY ||
      process.env.SUPABASE_PUBLISHABLE_KEY;

    if (supabaseUrl && supabaseKey) {
      try {
        const supabase = createClient(supabaseUrl, supabaseKey, {
          auth: { persistSession: false },
        });
        const { data, error } = await supabase
          .from('advisory_leads')
          .insert([recordToInsert])
          .select('id')
          .single();

        if (!error && data?.id) {
          leadId = data.id;
        } else if (error) {
          console.error('[CRYSTALSTEED SUPABASE ERROR]', error.message);
        }
      } catch (dbErr) {
        console.error('[CRYSTALSTEED SUPABASE EXCEPTION]', dbErr);
      }
    }

    // Persist to local advisory_leads store for local dev / sandbox query verification
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

    // 4. Parallel Multi-Channel Dispatch via Promise.allSettled
    const dispatchTasks: Promise<unknown>[] = [];

    // Channel A: Resend Transactional Email
    const resendApiKey = process.env.RESEND_API_KEY;
    const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL;
    const fromEmail = process.env.RESEND_FROM_EMAIL || 'CrystalSteed Advisory <advisory@crystalsteed.com>';

    if (resendApiKey) {
      const resend = new Resend(resendApiKey);

      if (adminEmail) {
        dispatchTasks.push(
          (async () => {
            // Attempt primary fromEmail, fallback to onboarding@resend.dev if custom domain unverified
            const res = await resend.emails.send({
              from: fromEmail,
              to: adminEmail,
              subject: `[CrystalSteed Advisory - ${activeMode.toUpperCase()}] New Brief from ${sanitizedName}`,
              html: buildAdminEmailHtml(safePayload, leadId),
            });
            if (res.error && res.error.message?.includes('domain')) {
              return resend.emails.send({
                from: 'onboarding@resend.dev',
                to: adminEmail,
                subject: `[CrystalSteed Advisory - ${activeMode.toUpperCase()}] New Brief from ${sanitizedName}`,
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
            subject: `CrystalSteed Advisory — Brief Received (${sanitizedServiceScope})`,
            html: buildProspectAckHtml(safePayload, leadId),
          })
        );
      }
    }

    // Channel B: Twilio WhatsApp Notification
    const twilioSid = process.env.TWILIO_ACCOUNT_SID;
    const twilioToken = process.env.TWILIO_AUTH_TOKEN;
    const rawTwilioFrom = process.env.TWILIO_WHATSAPP_NUMBER || '';
    const personalWhatsapp = process.env.MY_PERSONAL_WHATSAPP;

    if (twilioSid && twilioToken && rawTwilioFrom && personalWhatsapp) {
      const cleanTwilioFrom = rawTwilioFrom.replace('whatsapp:++', 'whatsapp:+');
      const cleanPersonalWhatsapp = personalWhatsapp.replace('whatsapp:++', 'whatsapp:+');

      const whatsappBody =
        `*CrystalSteed Advisory Alert*\n\n` +
        `*Client:* ${name}\n` +
        `*Mode:* ${activeMode.toUpperCase()}\n` +
        `*Contact:* ${contact}\n` +
        `*Scope:* ${serviceScope}\n\n` +
        `*Brief:* ${projectBrief.slice(0, 300)}...`;

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
    }

    if (dispatchTasks.length > 0) {
      const results = await Promise.allSettled(dispatchTasks);
      results.forEach((res, idx) => {
        if (res.status === 'rejected') {
          console.error(`[CRYSTALSTEED DISPATCH CHANNEL ${idx} ERROR]`, res.reason);
        }
      });
    }

    return {
      status: 200,
      body: {
        success: true,
        leadId,
      },
    };
  } catch (err) {
    console.error('[CRYSTALSTEED ADVISORY HANDLER ERROR]', err);
    return {
      status: 500,
      body: {
        success: false,
        error: 'Unable to process advisory brief at this time.',
      },
    };
  }
}

// Next.js App Router POST Route Handler
export async function POST(request: Request): Promise<Response> {
  try {
    const rawBody = await request.json();
    const result = await processAdvisorySubmission(rawBody);
    return new Response(JSON.stringify(result.body), {
      status: result.status,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch {
    return new Response(JSON.stringify({ success: false, error: 'Invalid JSON payload' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
