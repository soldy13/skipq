import { RAJSKA } from './machines';
import { PERSONAS } from './personas';
import { GIFT_VALID_DAYS } from './pricing';
import { mulberry32, randomInt, shuffled } from '../domain/random';
import { addDays, MINUTE, startOfDay } from '../domain/time';
import type { Booking, DrinkConfig, GiftCode, LangPref, Order, PersonaId, World } from '../domain/types';

const SEED = 2026;
const SLOT = RAJSKA.slotMinutes * MINUTE;

/** Base slot per cup of the day (minutes after midnight): morning, lunch, afternoon. */
const CUP_SLOTS = [8 * 60 + 15, 11 * 60 + 45, 14 * 60 + 30] as const;

function slotOrder(id: string, config: DrinkConfig, slotStart: number, rand: () => number, over: Partial<Order>): Order {
  return {
    id,
    config,
    machineId: RAJSKA.id,
    boxId: randomInt(rand, 1, RAJSKA.boxes),
    paidAt: slotStart - randomInt(rand, 8, 40) * MINUTE,
    slotStart,
    readyAt: slotStart,
    holdUntil: slotStart + SLOT,
    extended: false,
    payment: 'single',
    pricePaid: 0,
    pickedUpAt: slotStart + randomInt(rand, 1, 12) * MINUTE,
    cancelledAt: null,
    ...over,
  };
}

/** Lifetime history as picked-up orders, so usuals, streak, month count and charts all derive from one source. */
function buildHistory(persona: PersonaId, rand: () => number): Order[] {
  const spec = PERSONAS[persona];
  const drinks = shuffled(
    spec.history.flatMap(({ config, count }) => Array.from({ length: count }, () => config)),
    rand,
  );
  const slots = spec.calendar
    .flatMap(({ month, day, cups }) =>
      CUP_SLOTS.slice(0, cups).map((minutes) => {
        const jitter = randomInt(rand, -1, 1) * 15;
        const d = new Date(2026, month, day);
        d.setMinutes(minutes + jitter);
        return d.getTime();
      }),
    )
    .sort((a, b) => a - b);
  if (slots.length !== drinks.length) {
    throw new Error(`Seed for ${persona}: ${slots.length} calendar cups vs ${drinks.length} drinks`);
  }
  return slots.map((slotStart, i) =>
    slotOrder(`h_${persona}_${i}`, drinks[i] as DrinkConfig, slotStart, rand, {
      payment: spec.payment,
      pricePaid: spec.payment === 'single' ? 29 : 0,
    }),
  );
}

/** Frederika's flat white for 10:15 — box 14, paid with the plan at 09:41. */
function activeOrder(now: number): Order {
  const slotStart = now + 17 * MINUTE;
  return {
    id: 'o_frederika_active',
    config: { drinkId: 'flatwhite', milk: 'oat', bean: 'standard' },
    machineId: RAJSKA.id,
    boxId: 14,
    paidAt: now - 17 * MINUTE,
    slotStart,
    readyAt: slotStart,
    holdUntil: slotStart + SLOT,
    extended: false,
    payment: 'plan',
    pricePaid: 0,
    pickedUpAt: null,
    cancelledAt: null,
  };
}

/** How many anonymous orders sit in the current slot and each of the next four. 17 in total (brief §6.2). */
const TRAFFIC_SHAPE = [3, 4, 3, 4, 3] as const;

/**
 * Other students' orders spread across the next hour, all already paid.
 * Each one is collected at some point in its hold; boxes in `exclude` stay untouched.
 */
export function buildTraffic(now: number, exclude: ReadonlySet<number>, seed = SEED): Booking[] {
  const rand = mulberry32(seed);
  const day = startOfDay(now);
  const current = day + Math.floor((now - day) / SLOT) * SLOT;
  const boxes = shuffled(
    Array.from({ length: RAJSKA.boxes }, (_, i) => i + 1).filter((b) => !exclude.has(b)),
    rand,
  );
  const out: Booking[] = [];
  TRAFFIC_SHAPE.forEach((count, slotIndex) => {
    const start = current + slotIndex * SLOT;
    for (let i = 0; i < count; i += 1) {
      const boxId = boxes[out.length];
      if (boxId === undefined) return;
      const until = start + SLOT;
      const pickup = Math.max(start + randomInt(rand, 1, 13) * MINUTE, now + randomInt(rand, 1, 3) * MINUTE);
      out.push({
        id: `t_${out.length}`,
        boxId,
        bookedAt: Math.min(start - randomInt(rand, 12, 45) * MINUTE, now - MINUTE),
        needFrom: start,
        until,
        releasedAt: pickup < until ? pickup : null,
      });
    }
  });
  return out;
}

/**
 * Demo "set occupied boxes": `count` anonymous orders that are physically in their boxes right now,
 * each held for the rest of the current slot plus two to five more.
 */
export function buildOccupancy(now: number, count: number, exclude: ReadonlySet<number>, seed = SEED): Booking[] {
  const rand = mulberry32(seed + count);
  const day = startOfDay(now);
  const slotEnd = day + (Math.floor((now - day) / SLOT) + 1) * SLOT;
  const boxes = shuffled(
    Array.from({ length: RAJSKA.boxes }, (_, i) => i + 1).filter((b) => !exclude.has(b)),
    rand,
  ).slice(0, count);
  return boxes.map((boxId, i) => ({
    id: `occ_${i}`,
    boxId,
    bookedAt: now - randomInt(rand, 5, 40) * MINUTE,
    needFrom: now - randomInt(rand, 0, 10) * MINUTE,
    // Two to five slots past the current one: at 30/30 Now and the next slot are full and boxes free up
    // gradually after that, so "next free slot" lands a little later as in brief F7.
    until: slotEnd + randomInt(rand, 2, 5) * SLOT,
    releasedAt: null,
  }));
}

function gift(code: string, config: DrinkConfig, fromNickname: string, createdAt: number, over: Partial<GiftCode> = {}): GiftCode {
  return {
    code,
    config,
    fromNickname,
    createdAt,
    expiresAt: addDays(createdAt, GIFT_VALID_DAYS),
    payment: 'single',
    redeemedBy: null,
    redeemedAt: null,
    returnedAt: null,
    ...over,
  };
}

/** Brief §6.4. Frederika's own SKQ-4H7P expires a day after the demo starts (for flow F13). */
function buildGifts(now: number): GiftCode[] {
  const cappuccino: DrinkConfig = { drinkId: 'cappuccino', milk: 'cow', bean: 'standard' };
  const latte: DrinkConfig = { drinkId: 'latte', milk: 'cow', bean: 'standard' };
  return [
    gift('SKQ-7M4T', cappuccino, 'rajska_raccoon', addDays(now, -2)),
    gift('SKQ-2KQX', latte, 'deadline_dana', addDays(now, -3), { redeemedBy: 'oat_of_office', redeemedAt: addDays(now, -1) }),
    gift('SKQ-4H7P', cappuccino, 'frederika_k', addDays(now, -4), { payment: 'plan' }),
  ];
}

export function buildSeed(persona: PersonaId, now: number, language: LangPref = 'auto'): World {
  const spec = PERSONAS[persona];
  const rand = mulberry32(SEED + persona.length);
  const history = buildHistory(persona, rand);
  const orders = persona === 'frederika' ? [...history, activeOrder(now)] : history;
  const ownBoxes = new Set(orders.filter((o) => o.pickedUpAt === null).map((o) => o.boxId));
  return {
    persona,
    profile: { nickname: spec.nickname, displayName: spec.displayName, language, onboarded: spec.onboarded },
    plan: spec.plan,
    addons: { ...spec.addons },
    wallet: { packCredits: spec.packCredits, giftCredits: 0 },
    orders,
    traffic: buildTraffic(now, ownBoxes),
    gifts: buildGifts(now),
    limitResetAt: null,
  };
}
