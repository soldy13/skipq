import type { Lang } from './types';

/**
 * Thousands separator: a thin space (brief §9) glued with word joiners so it never breaks. U+202F would be the
 * textbook choice, but DM Sans draws it ~2 px wide and "1 199" reads as "1199".
 */
const NNBSP = '\u2060\u2009\u2060';
const NBSP = ' '; // keeps the unit with its number

const LOCALE: Record<Lang, string> = { en: 'en-GB', cs: 'cs-CZ' };

export function groupThousands(n: number): string {
  const [int = '0', frac] = Math.round(n).toString().split('.');
  const grouped = int.replace(/\B(?=(\d{3})+(?!\d))/g, NNBSP);
  return frac ? `${grouped}.${frac}` : grouped;
}

/** "29 Kč", "1 199 Kč" — same in both languages (brief §9). */
export function formatPrice(kc: number): string {
  return `${groupThousands(kc)}${NBSP}Kč`;
}

/** "26.90 Kč" / "26,90 Kč" — for per-coffee comparisons where the haléře matter. */
export function formatPriceExact(kc: number, lang: Lang): string {
  const n = new Intl.NumberFormat(LOCALE[lang], { minimumFractionDigits: 2, maximumFractionDigits: 2, useGrouping: false }).format(kc);
  return `${n}${NBSP}Kč`;
}

export function formatMg(mg: number): string {
  return `${groupThousands(mg)}${NBSP}mg`;
}

const timeFormatters = new Map<Lang, Intl.DateTimeFormat>();

/** 24-hour "HH:MM" in both languages. */
export function formatTime(t: number, lang: Lang): string {
  let f = timeFormatters.get(lang);
  if (!f) {
    f = new Intl.DateTimeFormat(LOCALE[lang], { hour: '2-digit', minute: '2-digit', hourCycle: 'h23' });
    timeFormatters.set(lang, f);
  }
  return f.format(t);
}

/** Short weekday, e.g. "Mon" / "po". */
export function formatDayLabel(t: number, lang: Lang): string {
  return new Intl.DateTimeFormat(LOCALE[lang], { weekday: 'short' }).format(t).replace('.', '');
}

export function formatDate(t: number, lang: Lang): string {
  // Czech short months render as numerals ("22. 10."); the genitive month name reads better ("22. října").
  return new Intl.DateTimeFormat(LOCALE[lang], { weekday: 'short', day: 'numeric', month: lang === 'cs' ? 'long' : 'short' }).format(t);
}
