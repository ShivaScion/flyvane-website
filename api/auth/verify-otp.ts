import { verifyOtp, createAdminSession } from '../../app/api/auth/otpStore';
import { applyOwaspHeaders, checkRateLimit, sanitizeServerText } from '../../app/api/auth/security';

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

  const clientIp = req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'client';
  const rateLimit = checkRateLimit(`verify-otp:${clientIp}`, 5, 10 * 60 * 1000);
  if (!rateLimit.allowed) {
    return res.status(429).json({
      success: false,
      error: `Too many failed attempts. Rate limit exceeded. Try again in ${rateLimit.retryAfterSec} seconds.`,
    });
  }

  try {
    const rawBody = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body || {};
    const sanitizedCode = sanitizeServerText(rawBody.code, 6).replace(/\D/g, '');

    if (!sanitizedCode || !/^\d{6}$/.test(sanitizedCode)) {
      return res.status(400).json({ success: false, error: 'A valid 6-digit numeric passcode is required.' });
    }

    const isValid = verifyOtp(sanitizedCode, 'owner');
    if (!isValid) {
      return res.status(401).json({
        success: false,
        error: 'Invalid or expired 2FA passcode.',
        remainingAttempts: rateLimit.remaining,
      });
    }

    const token = createAdminSession('ransh4859@gmail.com');
    return res.status(200).json({
      success: true,
      token,
      user: {
        email: 'ransh4859@gmail.com',
        phone: '+91 9800488177',
        role: 'Principal Executive / Owner',
      },
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message || 'Verification failure' });
  }
}
