import { verifyOtp, createAdminSession } from '../../app/api/auth/otpStore';

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const rawBody = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body || {};
    const code = (rawBody.code || '').trim();

    if (!code || code.length !== 6) {
      return res.status(400).json({ success: false, error: 'A valid 6-digit passcode is required.' });
    }

    const isValid = verifyOtp(code, 'owner');
    if (!isValid) {
      return res.status(401).json({ success: false, error: 'Invalid or expired 2FA passcode.' });
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
