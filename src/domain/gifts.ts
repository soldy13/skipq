import type { GiftCode, GiftStatus } from './types';

/** No I, L, O, 0 or 1 — nothing anyone can misread off a phone screen. */
export const CODE_ALPHABET = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
export const CODE_PREFIX = 'SKQ-';
const CODE_LENGTH = 4;
const COMPLETE = new RegExp(`^SKQ-[${CODE_ALPHABET}]{${CODE_LENGTH}}$`);

export function generateGiftCode(rand: () => number, taken: ReadonlySet<string>): string {
  for (;;) {
    let body = '';
    for (let i = 0; i < CODE_LENGTH; i += 1) {
      body += CODE_ALPHABET[Math.floor(rand() * CODE_ALPHABET.length)];
    }
    const code = CODE_PREFIX + body;
    if (!taken.has(code)) return code;
  }
}

function cleanBody(s: string): string {
  return [...s].filter((ch) => CODE_ALPHABET.includes(ch)).slice(0, CODE_LENGTH).join('');
}

/**
 * Controlled-input normaliser: uppercases, inserts the dash, drops characters a code can't contain.
 * The prefix can be typed (or deleted) one letter at a time, and a pasted message ("Coffee on me! SKQ-7M4T")
 * yields just the code.
 */
export function normalizeCodeInput(raw: string): string {
  const upper = raw.toUpperCase();
  const prefixed = /SKQ[\s-]*([A-Z0-9]*)/.exec(upper);
  if (prefixed) {
    const body = cleanBody(prefixed[1] ?? '');
    if (body) return CODE_PREFIX + body;
    return /SKQ[\s-]/.test(upper) ? CODE_PREFIX : 'SKQ';
  }
  const compact = upper.replace(/[^A-Z0-9]/g, '');
  if (compact && 'SKQ'.startsWith(compact)) return compact;
  const body = cleanBody(compact);
  return body ? CODE_PREFIX + body : '';
}

export function isCompleteCode(s: string): boolean {
  return COMPLETE.test(s);
}

export function giftStatus(g: GiftCode, now: number): GiftStatus {
  if (g.redeemedBy !== null) return 'redeemed';
  if (g.returnedAt !== null || now >= g.expiresAt) return 'returned';
  return 'pending';
}
