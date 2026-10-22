import { describe, expect, it } from 'vitest';
import { addDays, atClock, dayKey, isoWeekday, startOfDay, startOfMonth, MINUTE } from './time';

const thu = new Date(2026, 9, 22, 9, 58).getTime();

describe('time helpers', () => {
  it('finds the start of the local day', () => {
    expect(startOfDay(thu)).toBe(new Date(2026, 9, 22).getTime());
  });

  it('sets a wall-clock time on the same day', () => {
    expect(atClock(thu, '07:30')).toBe(new Date(2026, 9, 22, 7, 30).getTime());
  });

  it('adds calendar days across the DST change', () => {
    // Europe/Prague leaves summer time on 25 Oct 2026.
    const next = addDays(thu, 5);
    expect(new Date(next).getHours()).toBe(9);
    expect(new Date(next).getMinutes()).toBe(58);
    expect(dayKey(next)).toBe('2026-10-27');
  });

  it('numbers weekdays Mon=1 … Sun=7', () => {
    expect(isoWeekday(thu)).toBe(4);
    expect(isoWeekday(addDays(thu, 3))).toBe(7);
  });

  it('finds the first of the month', () => {
    expect(startOfMonth(thu)).toBe(new Date(2026, 9, 1).getTime());
  });

  it('exposes minute arithmetic', () => {
    expect(thu + 2 * MINUTE).toBe(new Date(2026, 9, 22, 10, 0).getTime());
  });
});
