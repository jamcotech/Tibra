import crypto from 'crypto';

/**
 * Normalizes phone numbers to standard Pakistani format (e.g., "923001234567")
 * Cleans spaces, dashes, parentheses and leading zeroes.
 */
export function normalizePakistaniPhone(phone: string): string {
  if (!phone) return '';
  let cleaned = phone.replace(/[^0-9]/g, '');
  if (cleaned.startsWith('0092')) {
    cleaned = cleaned.substring(2);
  } else if (cleaned.startsWith('03')) {
    cleaned = '92' + cleaned.substring(1);
  } else if (cleaned.startsWith('3') && cleaned.length === 10) {
    cleaned = '92' + cleaned;
  }
  return cleaned;
}

/**
 * Checks if two phone numbers match under normalization or suffix match (last 7 digits)
 */
export function phonesMatch(phone1: string, phone2: string): boolean {
  const norm1 = normalizePakistaniPhone(phone1);
  const norm2 = normalizePakistaniPhone(phone2);
  if (!norm1 || !norm2) return false;
  if (norm1 === norm2) return true;
  // Match on last 7 or 8 digits to account for prefix variations
  const suffix1 = norm1.slice(-7);
  const suffix2 = norm2.slice(-7);
  return suffix1.length >= 7 && suffix1 === suffix2;
}

/**
 * Masks phone number for public display (e.g. "+92 300 *****67")
 */
export function maskPhoneNumber(phone: string): string {
  if (!phone) return '—';
  const clean = phone.trim();
  if (clean.length < 6) return '****';
  // If standard format
  const norm = normalizePakistaniPhone(clean);
  if (norm.length >= 10) {
    const prefix = '+92 ' + norm.substring(2, 5);
    const suffix = norm.slice(-2);
    return `${prefix} *****${suffix}`;
  }
  // Generic fallback mask
  const visibleStart = clean.substring(0, Math.min(4, Math.floor(clean.length / 3)));
  const visibleEnd = clean.slice(-2);
  return `${visibleStart} ****${visibleEnd}`;
}

/**
 * Masks street address for privacy (e.g., hides house/street number, preserves area/city)
 */
export function maskStreetAddress(address: string, city: string): string {
  if (!address) return city || '—';
  const parts = address.split(',').map(p => p.trim()).filter(Boolean);
  if (parts.length <= 1) {
    return `Area: ***, ${city}`;
  }
  // Keep the last 1 or 2 parts (usually locality/town/sector) and mask the specific house/street
  const locality = parts.slice(1).join(', ');
  return `***, ${locality}`;
}

/**
 * Generates a secure cryptographically random tracking access token
 */
export function generateTrackingToken(): string {
  return 'tn_' + crypto.randomBytes(16).toString('hex');
}

/**
 * Formats a Date or ISO string into Pakistan Standard Time (PKT, UTC+5)
 */
export function formatPKTDateTime(dateInput?: string | Date): string {
  const d = dateInput ? (typeof dateInput === 'string' ? new Date(dateInput) : dateInput) : new Date();
  if (isNaN(d.getTime())) return new Date().toLocaleString('en-US', { timeZone: 'Asia/Karachi' }) + ' PKT';

  try {
    const options: Intl.DateTimeFormatOptions = {
      timeZone: 'Asia/Karachi',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    };
    return new Intl.DateTimeFormat('en-PK', options).format(d) + ' PKT';
  } catch {
    // Fallback if Intl timeZone is unsupported
    const utc = d.getTime() + (d.getTimezoneOffset() * 60000);
    const pktDate = new Date(utc + (3600000 * 5));
    return pktDate.toISOString().replace('T', ' ').substring(0, 19) + ' PKT';
  }
}
