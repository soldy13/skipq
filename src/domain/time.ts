export const MINUTE = 60_000;
export const HOUR = 60 * MINUTE;
export const DAY = 24 * HOUR;

/** Local midnight of the day containing `t`. */
export function startOfDay(t: number): number {
  const d = new Date(t);
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}

/** Same local day as `t`, at wall-clock "HH:MM". */
export function atClock(t: number, hhmm: string): number {
  const [h = 0, m = 0] = hhmm.split(':').map(Number);
  const d = new Date(t);
  d.setHours(h, m, 0, 0);
  return d.getTime();
}

/** Calendar-day arithmetic that keeps the wall-clock time across DST changes. */
export function addDays(t: number, days: number): number {
  const d = new Date(t);
  d.setDate(d.getDate() + days);
  return d.getTime();
}

/** 1 = Monday … 7 = Sunday. */
export function isoWeekday(t: number): number {
  const w = new Date(t).getDay();
  return w === 0 ? 7 : w;
}

export function isWeekday(t: number): boolean {
  return isoWeekday(t) <= 5;
}

export function startOfMonth(t: number): number {
  const d = new Date(t);
  return new Date(d.getFullYear(), d.getMonth(), 1).getTime();
}

export function dayKey(t: number): string {
  const d = new Date(t);
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${mm}-${dd}`;
}

export function isSameDay(a: number, b: number): boolean {
  return startOfDay(a) === startOfDay(b);
}
