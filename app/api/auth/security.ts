/**
 * Server-Side OWASP Threat Mitigation & Input Sanitization
 * Enforces strict input validation, length limits, XSS prevention,
 * and rate-limiting across all Vercel/Vite serverless endpoints.
 */

export function sanitizeServerText(raw: unknown, maxLength = 2500): string {
  if (typeof raw !== 'string') {
    if (raw === null || raw === undefined) return '';
    return String(raw).slice(0, maxLength);
  }

  let cleaned = raw;

  // 1. Strip script, iframe, and active object injection
  cleaned = cleaned.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  cleaned = cleaned.replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '');
  cleaned = cleaned.replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, '');
  cleaned = cleaned.replace(/<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi, '');

  // 2. Strip event handlers and protocol handlers
  cleaned = cleaned.replace(/\bon\w+\s*=\s*(?:'[^']*'|"[^"]*"|[^\s>]+)/gi, '');
  cleaned = cleaned.replace(/(javascript|vbscript|data):/gi, '');

  // 3. Strip HTML markup
  cleaned = cleaned.replace(/<\/?[^>]+(>|$)/g, '');

  // 4. Strip control characters
  cleaned = cleaned.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');

  return cleaned.trim().slice(0, maxLength);
}

/**
 * Deep recursive object sanitizer that strips dangerous script tags and prevents prototype pollution
 */
export function sanitizeData(data: any): any {
  if (typeof data === 'string') {
    return sanitizeServerText(data, 15000);
  }
  if (Array.isArray(data)) {
    return data.map((item) => sanitizeData(item));
  }
  if (data !== null && typeof data === 'object') {
    const cleanObj: Record<string, any> = {};
    for (const [k, v] of Object.entries(data)) {
      // Prototype pollution defense (OWASP A03/A08)
      if (k === '__proto__' || k === 'constructor' || k === 'prototype') continue;
      cleanObj[k] = sanitizeData(v);
    }
    return cleanObj;
  }
  return data;
}

/**
 * Apply Standard OWASP Security Headers to HTTP Response
 */
export function applyOwaspHeaders(res: any) {
  // Clickjacking defense (OWASP A05)
  res.setHeader('X-Frame-Options', 'DENY');

  // Prevent MIME sniffing (OWASP A05)
  res.setHeader('X-Content-Type-Options', 'nosniff');

  // Strict Transport Security (HSTS)
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');

  // Referrer Policy
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');

  // Hardware & Feature isolation
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');

  // Content Security Policy
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https:; style-src 'self' 'unsafe-inline' https:; img-src 'self' data: https: blob:; font-src 'self' data: https:; connect-src 'self' https: wss:; frame-ancestors 'none';"
  );
}

/**
 * In-memory sliding window rate limiter
 * Protects against brute-force attacks (OWASP A07)
 */
interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const rateLimitMap = new Map<string, RateLimitEntry>();

export function checkRateLimit(
  identifier: string,
  maxRequests = 5,
  windowMs = 10 * 60 * 1000 // 10 minutes default
): { allowed: boolean; remaining: number; retryAfterSec?: number } {
  const now = Date.now();
  const entry = rateLimitMap.get(identifier);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(identifier, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: maxRequests - 1 };
  }

  if (entry.count >= maxRequests) {
    const retryAfterSec = Math.ceil((entry.resetAt - now) / 1000);
    return { allowed: false, remaining: 0, retryAfterSec };
  }

  entry.count += 1;
  return { allowed: true, remaining: maxRequests - entry.count };
}
