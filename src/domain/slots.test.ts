import { describe, expect, it } from 'vitest';
import { buildSlotGrid, isOpenAt, isValidSlotStart, nextFreeSlot, slotStartsFor } from './slots';
import { RAJSKA } from '../data/machines';
import type { Booking } from './types';
import { MINUTE, addDays } from './time';

const at = (h: number, m: number, day = 22) => new Date(2026, 9, day, h, m).getTime();

function fill(start: number, count: number, from = 1): Booking[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `f${from + i}`,
    boxId: from + i,
    bookedAt: at(9, 50),
    needFrom: start,
    until: start + 15 * MINUTE,
    releasedAt: null,
  }));
}

describe('opening hours', () => {
  it('is open on a weekday between 07:30 and 19:00', () => {
    expect(isOpenAt(RAJSKA, at(7, 29))).toBe(false);
    expect(isOpenAt(RAJSKA, at(7, 30))).toBe(true);
    expect(isOpenAt(RAJSKA, at(18, 59))).toBe(true);
    expect(isOpenAt(RAJSKA, at(19, 0))).toBe(false);
  });

  it('is closed at the weekend', () => {
    expect(isOpenAt(RAJSKA, at(10, 0, 24))).toBe(false);
  });
});

describe('slot starts', () => {
  it('lists the next eight 15-minute slots that can still be brewed in time', () => {
    const starts = slotStartsFor(RAJSKA, at(9, 58));
    expect(starts).toHaveLength(8);
    expect(starts[0]).toBe(at(10, 15));
    expect(starts[7]).toBe(at(12, 0));
  });

  it('includes a slot when brewing can still start after now', () => {
    expect(slotStartsFor(RAJSKA, at(9, 57))[0]).toBe(at(10, 0));
  });

  it('stops at closing time', () => {
    const starts = slotStartsFor(RAJSKA, at(18, 20));
    expect(starts.map((s) => new Date(s).getHours() * 60 + new Date(s).getMinutes())).toEqual([
      18 * 60 + 30,
      18 * 60 + 45,
    ]);
  });

  it('rolls over to the next opening day after closing', () => {
    const starts = slotStartsFor(RAJSKA, at(19, 30, 23)); // Friday evening
    expect(starts[0]).toBe(new Date(2026, 9, 26, 7, 30).getTime()); // Monday
    expect(starts).toHaveLength(8);
  });
});

describe('slot validity', () => {
  it('accepts any future slot on the opening-hours grid, beyond the first eight too', () => {
    expect(isValidSlotStart(RAJSKA, at(9, 58), at(10, 15))).toBe(true);
    expect(isValidSlotStart(RAJSKA, at(9, 58), at(14, 30))).toBe(true);
  });

  it('rejects past, off-grid and after-hours starts', () => {
    expect(isValidSlotStart(RAJSKA, at(9, 58), at(10, 0))).toBe(false);
    expect(isValidSlotStart(RAJSKA, at(9, 58), at(10, 20))).toBe(false);
    expect(isValidSlotStart(RAJSKA, at(9, 58), at(18, 45))).toBe(true);
    expect(isValidSlotStart(RAJSKA, at(9, 58), at(19, 0))).toBe(false);
    expect(isValidSlotStart(RAJSKA, at(9, 58), at(10, 0, 24))).toBe(false);
  });
});

describe('slot grid', () => {
  it('offers Now plus slots with full capacity on an empty machine', () => {
    const grid = buildSlotGrid(RAJSKA, at(9, 58), []);
    expect(grid.now.available).toBe(true);
    expect(grid.now.free).toBe(30);
    expect(grid.slots.every((s) => s.state === 'open' && s.free === 30)).toBe(true);
  });

  it('marks a slot with three or fewer boxes as few, and none as full', () => {
    const few = buildSlotGrid(RAJSKA, at(9, 58), fill(at(10, 30), 27));
    expect(few.slots.find((s) => s.start === at(10, 30))?.state).toBe('few');
    expect(few.slots.find((s) => s.start === at(10, 45))?.state).toBe('open');
    const full = buildSlotGrid(RAJSKA, at(9, 58), fill(at(10, 45), 30));
    expect(full.slots.find((s) => s.start === at(10, 45))?.state).toBe('full');
    const grid2 = buildSlotGrid(RAJSKA, at(9, 58), fill(at(11, 0), 27));
    expect(grid2.slots.find((s) => s.start === at(11, 0))?.state).toBe('few');
    expect(grid2.slots.find((s) => s.start === at(11, 0))?.free).toBe(3);
  });

  it('makes Now unavailable when the machine is closed', () => {
    const grid = buildSlotGrid(RAJSKA, at(6, 0), []);
    expect(grid.now.available).toBe(false);
    expect(grid.slots[0]?.start).toBe(at(7, 30));
  });

  it('never lets a hold spill into the next slot', () => {
    const grid = buildSlotGrid(RAJSKA, at(9, 58), fill(at(10, 30), 30));
    expect(grid.slots.find((s) => s.start === at(10, 45))?.free).toBe(30);
    // Boxes are taken from payment (09:50), so the earlier windows lose them too.
    expect(grid.slots.find((s) => s.start === at(10, 15))?.free).toBe(0);
  });

  it('agrees with the meter: 30 boxes taken now means Now is full', () => {
    const now = at(9, 58);
    const taken: Booking[] = Array.from({ length: 30 }, (_, i) => ({
      id: `t${i}`,
      boxId: i + 1,
      bookedAt: now - 10 * MINUTE,
      needFrom: i === 0 ? at(10, 30) : now,
      until: i === 0 ? at(10, 45) : at(10, 10),
      releasedAt: null,
    }));
    expect(buildSlotGrid(RAJSKA, now, taken).now.state).toBe('full');
  });

  it('finds the next free slot after a full stretch', () => {
    const now = at(10, 0);
    const blocked: Booking[] = Array.from({ length: 30 }, (_, i) => ({
      id: `x${i}`,
      boxId: i + 1,
      bookedAt: now - MINUTE,
      needFrom: now,
      until: at(11, 13),
      releasedAt: null,
    }));
    expect(nextFreeSlot(RAJSKA, now, blocked)).toBe(at(11, 15));
  });

  it('looks past the weekend for the next free slot', () => {
    const fri = at(19, 30, 23);
    expect(nextFreeSlot(RAJSKA, fri, [])).toBe(addDays(at(7, 30, 23), 3));
  });
});
