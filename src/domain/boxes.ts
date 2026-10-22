import type { Booking } from './types';

/**
 * When the booking stops holding its box, as far as anyone can know at `now`.
 * A pickup time in the future is simulation data, not knowledge — until it happens, assume the full hold.
 */
export function bookingEnd(b: Booking, now: number): number {
  return b.releasedAt !== null && b.releasedAt <= now ? b.releasedAt : b.until;
}

/** Box counts as taken (meter, locker map) from payment until pickup or hold end. */
export function isBookedAt(b: Booking, t: number): boolean {
  return b.bookedAt <= t && t < bookingEnd(b, t);
}

export function boxesInUseAt(bookings: readonly Booking[], t: number): Set<number> {
  const out = new Set<number>();
  for (const b of bookings) if (isBookedAt(b, t)) out.add(b.boxId);
  return out;
}

/**
 * Boxes unavailable at any point in [from, to). A box is taken from payment until pickup or hold end
 * (brief §4.4), so capacity, the meter and the locker map always agree.
 */
export function boxesBusyDuring(bookings: readonly Booking[], from: number, to: number, now: number): Set<number> {
  const out = new Set<number>();
  for (const b of bookings) {
    if (Math.min(b.bookedAt, b.needFrom) < to && from < bookingEnd(b, now)) out.add(b.boxId);
  }
  return out;
}

/**
 * Choose a box for a new order needing [from, to).
 * Prefer a box nobody has booked from now on, so the locker map stays readable; otherwise any box that is
 * physically free for the window. Lowest number wins for determinism.
 */
export function pickBox(total: number, bookings: readonly Booking[], from: number, to: number, now: number): number | null {
  const busy = boxesBusyDuring(bookings, from, to, now);
  const touched = boxesBusyDuring(
    bookings.filter((b) => b.bookedAt <= now),
    now,
    Number.POSITIVE_INFINITY,
    now,
  );
  let fallback: number | null = null;
  for (let box = 1; box <= total; box += 1) {
    if (busy.has(box)) continue;
    if (!touched.has(box)) return box;
    fallback ??= box;
  }
  return fallback;
}
