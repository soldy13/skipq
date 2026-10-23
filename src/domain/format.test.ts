import { describe, expect, it } from 'vitest';
import { formatDayLabel, formatMg, formatMonth, formatOrdinal, formatPrice, formatPriceExact, formatShortDay, formatTime } from './format';

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

  it('names the month and short days for the board and chart', () => {
    const t = new Date(2026, 9, 22, 9, 58).getTime();
    expect(formatMonth(t, 'en')).toBe('October 2026');
    expect(formatMonth(t, 'cs')).toBe('říjen 2026');
    expect(formatShortDay(t, 'en')).toBe('22 Oct');
    expect(formatShortDay(t, 'cs')).toBe('22. 10.');
  });

  it('names weekdays in the UI language', () => {
    const mon = new Date(2026, 9, 26, 7, 30).getTime();
    expect(formatDayLabel(mon, 'en')).toBe('Mon');
    expect(formatDayLabel(mon, 'cs')).toBe('po');
  });

  it('writes ranks as ordinals: 12th in English, 12. in Czech', () => {
    expect([1, 2, 3, 4, 11, 12, 13, 21, 22, 23, 101, 111].map((n) => formatOrdinal(n, 'en'))).toEqual([
      '1st', '2nd', '3rd', '4th', '11th', '12th', '13th', '21st', '22nd', '23rd', '101st', '111th',
    ]);
    expect(formatOrdinal(12, 'cs')).toBe('12.');
  });
});
