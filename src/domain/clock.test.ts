import { describe, expect, it } from 'vitest';
import { advanceClock, DEMO_START } from './clock';
import { isoWeekday } from './time';

describe('simulated clock', () => {
  it('starts on a Thursday at 09:58', () => {
    const d = new Date(DEMO_START);
    expect(isoWeekday(DEMO_START)).toBe(4);
    expect([d.getHours(), d.getMinutes()]).toEqual([9, 58]);
  });

  it('advances at 1× real time', () => {
    const next = advanceClock({ now: DEMO_START, speed: 1 }, 1000);
    expect(next.now).toBe(DEMO_START + 1000);
  });

  it('advances 30× faster in fast mode', () => {
    const next = advanceClock({ now: DEMO_START, speed: 30 }, 1000);
    expect(next.now).toBe(DEMO_START + 30_000);
  });

  it('returns a new object and leaves the input untouched', () => {
    const clock = { now: DEMO_START, speed: 1 as const };
    const next = advanceClock(clock, 500);
    expect(next).not.toBe(clock);
    expect(clock.now).toBe(DEMO_START);
  });

  it('keeps whole milliseconds', () => {
    expect(advanceClock({ now: DEMO_START, speed: 1 }, 1000.4).now).toBe(DEMO_START + 1000);
  });

  it('ignores negative or non-finite deltas', () => {
    const clock = { now: DEMO_START, speed: 1 as const };
    expect(advanceClock(clock, -5).now).toBe(DEMO_START);
    expect(advanceClock(clock, Number.NaN).now).toBe(DEMO_START);
  });
});
