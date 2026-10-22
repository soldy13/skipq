import { describe, expect, it } from 'vitest';
import { boxesBusyDuring, boxesInUseAt, isBookedAt, pickBox } from './boxes';
import type { Booking } from './types';
import { MINUTE } from './time';

const T = new Date(2026, 9, 22, 10, 0).getTime();

function booking(over: Partial<Booking> & Pick<Booking, 'boxId'>): Booking {
  return {
    id: `b${over.boxId}`,
    bookedAt: T - 10 * MINUTE,
    needFrom: T + 13 * MINUTE,
    until: T + 30 * MINUTE,
    releasedAt: null,
    ...over,
  };
}

describe('box bookings', () => {
  it('counts a box as taken from payment until hold end', () => {
    const b = booking({ boxId: 3 });
    expect(isBookedAt(b, T - 11 * MINUTE)).toBe(false);
    expect(isBookedAt(b, T)).toBe(true);
    expect(isBookedAt(b, T + 30 * MINUTE)).toBe(false);
  });

  it('frees the box once it is picked up', () => {
    const b = booking({ boxId: 3, releasedAt: T + 20 * MINUTE });
    expect(isBookedAt(b, T + 19 * MINUTE)).toBe(true);
    expect(isBookedAt(b, T + 20 * MINUTE)).toBe(false);
  });

  it('lists boxes in use at a moment', () => {
    const list = [booking({ boxId: 1 }), booking({ boxId: 2, bookedAt: T + MINUTE })];
    expect([...boxesInUseAt(list, T)]).toEqual([1]);
  });

  it('blocks capacity from payment until hold end, like the meter (brief §4.4)', () => {
    const b = booking({ boxId: 5 }); // paid 09:50, coffee 10:13, held until 10:30
    expect(boxesBusyDuring([b], T, T + 10 * MINUTE, T).has(5)).toBe(true);
    expect(boxesBusyDuring([b], T + 28 * MINUTE, T + 45 * MINUTE, T).has(5)).toBe(true);
    expect(boxesBusyDuring([b], T + 30 * MINUTE, T + 45 * MINUTE, T).has(5)).toBe(false);
  });

  it('does not trust a future pickup time it could not know yet', () => {
    const b = booking({ boxId: 5, releasedAt: T + 20 * MINUTE });
    // At 10:00 nobody knows the coffee will be collected at 10:20 — assume the full hold.
    expect(boxesBusyDuring([b], T + 25 * MINUTE, T + 40 * MINUTE, T).has(5)).toBe(true);
    // At 10:21 it has been collected.
    expect(boxesBusyDuring([b], T + 25 * MINUTE, T + 40 * MINUTE, T + 21 * MINUTE).has(5)).toBe(false);
  });

  it('picks the lowest box that is completely untouched first', () => {
    const list = [booking({ boxId: 1 }), booking({ boxId: 2 })];
    // Window 10:40–10:55: boxes 1 and 2 are physically free but booked now; 3 is untouched.
    expect(pickBox(30, list, T + 40 * MINUTE, T + 55 * MINUTE, T)).toBe(3);
  });

  it('falls back to a physically free box when every box is booked', () => {
    const list = Array.from({ length: 30 }, (_, i) => booking({ boxId: i + 1 }));
    expect(pickBox(30, list, T + 40 * MINUTE, T + 55 * MINUTE, T)).toBe(1);
  });

  it('returns null when nothing is free for the window', () => {
    const list = Array.from({ length: 30 }, (_, i) => booking({ boxId: i + 1, needFrom: T }));
    expect(pickBox(30, list, T, T + 15 * MINUTE, T)).toBeNull();
  });
});
