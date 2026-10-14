import '../../app/api/auth/loadEnv.ts';
import { generateAndStoreOtp } from '../../app/api/auth/otpStore.ts';
import { applyOwaspHeaders, checkRateLimit } from '../../app/api/auth/security.ts';
import { Resend } from 'resend';
import twilio from 'twilio';

export default async function handler(req: any, res: any) {
  applyOwaspHeaders(res);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // OWASP A07: Brute-Force Rate Limiting (5 requests per 10 minutes)
  const clientIp = req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'client';
  const rateLimit = checkRateLimit(`send-otp:${clientIp}`, 5, 10 * 60 * 1000);
  if (!rateLimit.allowed) {
    return res.status(429).json({
      success: false,
      error: `Too many 2FA code requests. Please wait ${rateLimit.retryAfterSec} seconds.`,
    });
  }

  try {
    const code = generateAndStoreOtp('owner');
    const email = process.env.ADMIN_NOTIFICATION_EMAIL || 'ransh4859@gmail.com';
    const whatsapp = process.env.MY_PERSONAL_WHATSAPP || 'whatsapp:+919800488177';
    const cleanWhatsapp = whatsapp.replace('whatsapp:++', 'whatsapp:+');

    const dispatchResults: Record<string, string> = {};

    // 1. Dispatch via Resend Email
    const resendKey = process.env.RESEND_API_KEY;
    if (resendKey) {
      try {
        const resend = new Resend(resendKey);
        const fromEmail = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';
        const emailRes = await resend.emails.send({
          from: fromEmail.includes('crystalsteed.com') ? fromEmail : 'onboarding@resend.dev',
          to: email,
          subject: `[CrystalSteed Security] Your Admin 2FA Code: ${code}`,
          html: `
            <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #07080B; color: #E4E4E7; padding: 36px; border-radius: 16px; border: 1px solid rgba(255,255,255,0.08); max-width: 500px; margin: 0 auto;">
              <div style="font-size: 11px; letter-spacing: 0.2em; text-transform: uppercase; color: #10B981; font-weight: 600; margin-bottom: 8px;">
                CRYSTALSTEED SECURITY VAULT
              </div>
              <h2 style="font-size: 20px; font-weight: 600; color: #FFFFFF; margin: 0 0 16px 0;">
                Two-Factor Admin Verification
              </h2>
              <p style="font-size: 14px; color: #A1A1AA; line-height: 1.5; margin-bottom: 24px;">
                Use the one-time verification passcode below to authorize your session on the CrystalSteed Command Terminal.
              </p>
              <div style="background-color: #0F1117; border: 1px solid rgba(255,255,255,0.12); border-radius: 12px; padding: 20px; text-align: center; margin-bottom: 20px;">
                <span style="font-size: 32px; font-weight: 700; letter-spacing: 0.35em; color: #38BDF8; font-family: monospace;">${code}</span>
              </div>
              <p style="font-size: 12px; color: #71717A; margin: 0;">
                This code expires in 5 minutes. If you did not initiate this request, lock your credentials immediately.
              </p>
            </div>
          `,
        });
        if (emailRes.error && emailRes.error.message?.includes('domain')) {
          // Retry with onboarding@resend.dev
          await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: email,
            subject: `[CrystalSteed Security] Your Admin 2FA Code: ${code}`,
            html: `<p>Your 2FA code is: <strong>${code}</strong> (valid 5 min)</p>`,
          });
        }
        dispatchResults.email = 'sent';
      } catch (e: any) {
        dispatchResults.email = `failed: ${e.message}`;
      }
    } else {
      dispatchResults.email = 'failed: RESEND_API_KEY not configured';
    }

    // 2. Dispatch via Twilio WhatsApp
    const twilioSid = process.env.TWILIO_ACCOUNT_SID;
    const twilioToken = process.env.TWILIO_AUTH_TOKEN;
    const rawTwilioFrom = process.env.TWILIO_WHATSAPP_NUMBER || 'whatsapp:+14155238886';
    const cleanTwilioFrom = rawTwilioFrom.replace('whatsapp:++', 'whatsapp:+');

    if (twilioSid && twilioToken) {
      try {
        const client = twilio(twilioSid, twilioToken);
        await client.messages.create({
          from: cleanTwilioFrom.startsWith('whatsapp:') ? cleanTwilioFrom : `whatsapp:${cleanTwilioFrom}`,
          to: cleanWhatsapp.startsWith('whatsapp:') ? cleanWhatsapp : `whatsapp:${cleanWhatsapp}`,
          body: `*CrystalSteed Security 2FA*\n\nYour Admin verification passcode is: *${code}*\n\nValid for 5 minutes. Do not share this code.`,
        });
        dispatchResults.whatsapp = 'sent';
      } catch (e: any) {
        dispatchResults.whatsapp = `failed: ${e.message}`;
      }
    } else {
      dispatchResults.whatsapp = 'failed: TWILIO credentials not configured';
    }

    return res.status(200).json({
      success: true,
      message: '2FA authentication codes dispatched to your registered email and WhatsApp.',
      channels: dispatchResults,
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Failed to dispatch 2FA code' });
  }
}
