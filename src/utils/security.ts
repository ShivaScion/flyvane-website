/**
 * OWASP-Compliant Frontend Input Sanitization & Threat Mitigation Library
 * Defends against XSS (Cross-Site Scripting), HTML injection, parameter pollution,
 * and malicious payload delivery across all form fields and parameters.
 */

// HTML entity escaping mapping
const ENTITY_MAP: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#x27;',
  '/': '&#x2F;',
  '`': '&#x60;',
  '=': '&#x3D;',
};

/**
 * Strips script tags, malicious event handlers, and dangerous protocols
 */
export function sanitizeText(raw: unknown, maxLength = 2000): string {
  if (typeof raw !== 'string') {
    if (raw === null || raw === undefined) return '';
    return String(raw).slice(0, maxLength);
  }

  let cleaned = raw;

  // 1. Remove dangerous script and iframe elements
  cleaned = cleaned.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  cleaned = cleaned.replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '');
  cleaned = cleaned.replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, '');
  cleaned = cleaned.replace(/<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi, '');

  // 2. Remove inline event handlers (onload, onerror, onclick, etc.)
  cleaned = cleaned.replace(/\bon\w+\s*=\s*(?:'[^']*'|"[^"]*"|[^\s>]+)/gi, '');

  // 3. Remove javascript:, data:text/html, vbscript: protocol handlers
  cleaned = cleaned.replace(/(javascript|vbscript|data):/gi, '');

  // 4. Strip stray HTML tags for plaintext input fields
  cleaned = cleaned.replace(/<\/?[^>]+(>|$)/g, '');

  // 5. Normalize null bytes and invisible control characters
  cleaned = cleaned.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');

  // 6. Enforce safe length boundary
  return cleaned.trim().slice(0, maxLength);
}

/**
 * Escapes characters for safe reflection into HTML context
 */
export function escapeHtml(str: string): string {
  return str.replace(/[&<>"'`=\/]/g, (s) => ENTITY_MAP[s] || s);
}

/**
 * Validates and sanitizes 6-digit one-time passcode
 */
export function sanitizeOtp(raw: unknown): string {
  if (typeof raw !== 'string') return '';
  return raw.replace(/\D/g, '').slice(0, 6);
}

/**
 * Sanitizes numeric input with strict min/max boundaries
 */
export function sanitizeNumeric(
  raw: unknown,
  min: number,
  max: number,
  fallback: number
): number {
  const parsed = typeof raw === 'number' ? raw : parseFloat(String(raw));
  if (isNaN(parsed) || !isFinite(parsed)) return fallback;
  return Math.min(Math.max(parsed, min), max);
}

/**
 * Validates email formatting against RFC-compliant pattern without regex catastrophic backtracking
 */
export function isValidEmail(email: string): boolean {
  if (!email || email.length > 254) return false;
  const regex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
  return regex.test(email);
}

/**
 * Validates phone / WhatsApp handle
 */
export function isValidPhone(phone: string): boolean {
  if (!phone || phone.length > 30) return false;
  const digits = phone.replace(/\D/g, '');
  return digits.length >= 7 && digits.length <= 15;
}
