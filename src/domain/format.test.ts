import { describe, expect, it } from 'vitest';
import { formatDayLabel, formatMg, formatPrice, formatPriceExact, formatTime } from './format';

/** Thin space (brief §9) glued with word joiners so it never breaks; DM Sans draws U+202F almost invisibly. */
const NNBSP = '\u2060\u2009\u2060';
const NBSP = ' ';

describe('formatting', () => {
  it('formats prices as Kč with a thin space for thousands', () => {
    expect(formatPrice(29)).toBe(`29${NBSP}Kč`);
    expect(formatPrice(1199)).toBe(`1${NNBSP}199${NBSP}Kč`);
  });

  it('formats per-coffee prices with two decimals in the UI language', () => {
    expect(formatPriceExact(269 / 10, 'en')).toBe(`26.90${NBSP}Kč`);
    expect(formatPriceExact(749 / 30, 'cs')).toBe(`24,97${NBSP}Kč`);
  });

  it('formats milligrams the same way', () => {
    expect(formatMg(2000)).toBe(`2${NNBSP}000${NBSP}mg`);
    expect(formatMg(65)).toBe(`65${NBSP}mg`);
  });

  it('uses a 24-hour clock in both languages', () => {
    const t = new Date(2026, 9, 22, 9, 58).getTime();
    const t2 = new Date(2026, 9, 22, 18, 5).getTime();
    expect(formatTime(t, 'en')).toBe('09:58');
    expect(formatTime(t2, 'en')).toBe('18:05');
    expect(formatTime(t2, 'cs')).toBe('18:05');
  });

  it('names weekdays in the UI language', () => {
    const mon = new Date(2026, 9, 26, 7, 30).getTime();
    expect(formatDayLabel(mon, 'en')).toBe('Mon');
    expect(formatDayLabel(mon, 'cs')).toBe('po');
  });
});
