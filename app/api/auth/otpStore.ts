import crypto from 'crypto';

interface OtpEntry {
  code: string;
  expiresAt: number;
}

interface SessionEntry {
  token: string;
  expiresAt: number;
  user: string;
}

// Global in-memory cache preserved across serverless hot reloads / local dev
const globalStore = global as unknown as {
  __crystalsteed_otps?: Map<string, OtpEntry>;
  __crystalsteed_sessions?: Map<string, SessionEntry>;
};

if (!globalStore.__crystalsteed_otps) {
  globalStore.__crystalsteed_otps = new Map<string, OtpEntry>();
}
if (!globalStore.__crystalsteed_sessions) {
  globalStore.__crystalsteed_sessions = new Map<string, SessionEntry>();
}

export function generateAndStoreOtp(userId = 'owner'): string {
  // Cryptographically secure 6-digit integer generation (OWASP A02)
  const code = crypto.randomInt(100000, 1000000).toString();
  const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes
  globalStore.__crystalsteed_otps!.set(userId, { code, expiresAt });
  return code;
}

export function verifyOtp(code: string, userId = 'owner'): boolean {
  const entry = globalStore.__crystalsteed_otps!.get(userId);
  if (!entry) return false;
  if (Date.now() > entry.expiresAt) {
    globalStore.__crystalsteed_otps!.delete(userId);
    return false;
  }
  if (entry.code.trim() === code.trim()) {
    globalStore.__crystalsteed_otps!.delete(userId);
    return true;
  }
  return false;
}

export function createAdminSession(user = 'ransh4859@gmail.com'): string {
  const token = crypto.randomBytes(32).toString('hex');
  const expiresAt = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
  globalStore.__crystalsteed_sessions!.set(token, { token, expiresAt, user });
  return token;
}

export function validateAdminSession(token: string | null | undefined): boolean {
  if (!token) return false;
  const session = globalStore.__crystalsteed_sessions!.get(token);
  if (!session) return false;
  if (Date.now() > session.expiresAt) {
    globalStore.__crystalsteed_sessions!.delete(token);
    return false;
  }
  return true;
}
