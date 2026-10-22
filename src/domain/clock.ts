export type Speed = 1 | 30;

export interface SimClock {
  now: number;
  speed: Speed;
}

/** Thursday 22 Oct 2026, 09:58 local: Now and the morning slots look realistic. */
export const DEMO_START = new Date(2026, 9, 22, 9, 58, 0, 0).getTime();

export function advanceClock(clock: SimClock, realDeltaMs: number): SimClock {
  if (!Number.isFinite(realDeltaMs) || realDeltaMs <= 0) return { ...clock };
  return { ...clock, now: Math.round(clock.now + realDeltaMs * clock.speed) };
}
