import { beforeEach, describe, expect, it } from 'vitest';
import { initialState, useStore } from './useStore';
import { selectBookings } from './selectors';
import { DEMO_START } from '../domain/clock';
import { boxesInUseAt } from '../domain/boxes';
import { buildSlotGrid } from '../domain/slots';
import { dailyLimit } from '../domain/limits';
import { RAJSKA } from '../data/machines';
import { MINUTE } from '../domain/time';
import { orderStatus } from '../domain/orders';

const state = () => useStore.getState();
const inUse = () => boxesInUseAt(selectBookings(state()), state().clock.now).size;

beforeEach(() => {
  localStorage.clear();
  useStore.setState(initialState());
});

describe('store: clock', () => {
  it('starts Frederika’s world on Thursday 09:58', () => {
    expect(state().clock).toEqual({ now: DEMO_START, speed: 1 });
    expect(state().persona).toBe('frederika');
    expect(inUse()).toBe(18);
  });

  it('ticks at the chosen speed', () => {
    state().tick(1000);
    expect(state().clock.now).toBe(DEMO_START + 1000);
    state().setSpeed(30);
    state().tick(1000);
    expect(state().clock.now).toBe(DEMO_START + 31_000);
  });

  it('jumps forward and to a set time', () => {
    state().advance(15 * MINUTE);
    expect(state().clock.now).toBe(DEMO_START + 15 * MINUTE);
    const t = new Date(2026, 9, 22, 12, 30).getTime();
    state().setTime(t);
    expect(state().clock.now).toBe(t);
  });

  it('frees anonymous boxes as their owners pick up', () => {
    state().advance(60 * MINUTE);
    expect(inUse()).toBeLessThan(18);
  });
});

describe('store: personas and language', () => {
  it('switches persona, restarting the demo but keeping the language', () => {
    state().setLanguage('cs');
    state().advance(90 * MINUTE);
    state().switchPersona('tomas');
    expect(state().persona).toBe('tomas');
    expect(state().clock.now).toBe(DEMO_START);
    expect(state().profile.language).toBe('cs');
    expect(state().wallet.packCredits).toBe(7);
  });

  it('resets everything back to the default seed', () => {
    state().switchPersona('new');
    state().setLanguage('en');
    state().resetAll();
    expect(state()).toMatchObject({ persona: 'frederika', profile: { language: 'auto' } });
  });
});

describe('store: demo machine controls', () => {
  it('sets the number of occupied boxes, counting the user’s own box', () => {
    state().setOccupiedBoxes(30);
    expect(inUse()).toBe(30);
    state().setOccupiedBoxes(5);
    expect(inUse()).toBe(5);
    state().setOccupiedBoxes(0);
    expect(inUse()).toBe(1); // box 14 is Frederika's and stays
  });

  it('makes Now unavailable when every box is occupied', () => {
    state().setOccupiedBoxes(30);
    const grid = buildSlotGrid(RAJSKA, state().clock.now, selectBookings(state()));
    expect(grid.now.state).toBe('full');
  });

  it('fills the next slot completely', () => {
    state().fillNextSlot();
    const grid = buildSlotGrid(RAJSKA, state().clock.now, selectBookings(state()));
    expect(grid.slots[0]?.state).toBe('full');
    expect(grid.slots[1]?.state).not.toBe('full');
    expect(grid.now.state).not.toBe('full');
  });

  it('resets the machine to the seeded traffic', () => {
    state().setOccupiedBoxes(30);
    state().resetMachine();
    expect(inUse()).toBe(18);
  });
});

describe('store: demo order controls', () => {
  const status = () => {
    const s = state();
    const o = s.orders.find((x) => x.id === 'o_frederika_active');
    return o ? orderStatus(o, s.clock.now, RAJSKA.brewMinutes) : null;
  };

  it('makes the next order ready now', () => {
    expect(status()).toBe('scheduled');
    state().makeNextOrderReady();
    expect(status()).toBe('ready');
  });

  it('expires the active order', () => {
    state().expireActiveOrder();
    expect(status()).toBe('expired');
    expect(inUse()).toBe(17);
  });

  it('does nothing when there is no active order', () => {
    state().switchPersona('tomas');
    const before = state().orders;
    state().makeNextOrderReady();
    state().expireActiveOrder();
    expect(state().orders).toBe(before);
  });
});

describe('store: user demo controls', () => {
  it('resets today’s limit', () => {
    state().resetTodayLimit();
    const s = state();
    const limit = dailyLimit({ plan: s.plan, orders: s.orders, gifts: s.gifts, nickname: s.profile.nickname, now: s.clock.now, resetAt: s.limitResetAt });
    expect(limit.used).toBe(0);
  });

  it('gives pack credits', () => {
    state().giveCredits(10);
    expect(state().wallet.packCredits).toBe(10);
  });
});

describe('store: persistence', () => {
  it('saves to localStorage under skipq-v1', () => {
    state().advance(MINUTE);
    const saved = JSON.parse(localStorage.getItem('skipq-v1') ?? '{}') as { state?: { clock?: { now: number } } };
    expect(saved.state?.clock?.now).toBe(DEMO_START + MINUTE);
  });
});

describe('store: ordering', () => {
  const fwCow = { drinkId: 'flatwhite', milk: 'cow', bean: 'standard' } as const;

  it('places an order and returns it', () => {
    const result = state().placeOrder({ config: fwCow, slotStart: null, payment: 'plan' });
    expect(result.ok).toBe(true);
    expect(state().orders.at(-1)?.config.drinkId).toBe('flatwhite');
  });

  it('announces a coffee once it is ready, and only once', () => {
    state().advance(17 * MINUTE); // 10:15 — the seeded flat white is ready
    expect(state().inbox.map((n) => (n.kind === 'ready' ? n.orderId : n.code))).toEqual(['o_frederika_active']);
    state().tick(1000);
    expect(state().inbox).toHaveLength(1);
    state().dismissNotice(state().inbox[0]!.id);
    expect(state().inbox).toEqual([]);
    state().tick(1000);
    expect(state().inbox).toEqual([]);
  });

  it('announces a Now order two minutes later', () => {
    const r = state().placeOrder({ config: fwCow, slotStart: null, payment: 'plan' });
    if (!r.ok) throw new Error(r.reason);
    state().advance(2 * MINUTE);
    expect(state().inbox.map((n) => (n.kind === 'ready' ? n.orderId : n.code))).toContain(r.order.id);
  });

  it('announces when the demo makes an order ready', () => {
    state().makeNextOrderReady();
    expect(state().inbox.map((n) => (n.kind === 'ready' ? n.orderId : n.code))).toEqual(['o_frederika_active']);
  });

  it('undoes, unlocks and extends', () => {
    const r = state().placeOrder({ config: fwCow, slotStart: null, payment: 'plan' });
    if (!r.ok) throw new Error(r.reason);
    state().undoOrder(r.order.id);
    expect(state().orders.find((o) => o.id === r.order.id)?.cancelledAt).not.toBeNull();

    state().advance(18 * MINUTE); // 10:16
    state().extendOrder('o_frederika_active');
    expect(state().orders.find((o) => o.id === 'o_frederika_active')?.extended).toBe(true);
    state().unlockOrder('o_frederika_active');
    expect(state().orders.find((o) => o.id === 'o_frederika_active')?.pickedUpAt).toBe(state().clock.now);
  });

  it('clears notifications when switching persona', () => {
    state().makeNextOrderReady();
    state().switchPersona('tomas');
    expect(state().inbox).toEqual([]);
    expect(state().notified).toEqual([]);
  });
});

describe('store: plans, add-ons and packs', () => {
  const limitNow = () => {
    const s = state();
    return dailyLimit({ plan: s.plan, orders: s.orders, gifts: s.gifts, nickname: s.profile.nickname, now: s.clock.now, resetAt: s.limitResetAt });
  };

  it('switches plan instantly and the daily counter follows', () => {
    state().subscribePlan({ type: 'black', perDay: 1 });
    expect(state().plan).toEqual({ type: 'black', perDay: 1 });
    expect(limitNow()).toMatchObject({ max: 1, reached: true }); // 2 plan coffees already today
  });

  it('subscribes someone who paid per coffee', () => {
    state().switchPersona('tomas');
    state().subscribePlan({ type: 'milk', perDay: 3 });
    expect(limitNow()).toMatchObject({ used: 0, max: 3 });
  });

  it('cancels a plan back to pay per coffee', () => {
    state().cancelPlan();
    expect(state().plan).toBeNull();
    expect(limitNow()).toMatchObject({ max: 0, reached: false });
  });

  it('adds pack credits on purchase', () => {
    state().buyPack(30);
    expect(state().wallet.packCredits).toBe(30);
  });
});

describe('store: gifts', () => {
  const cap = { drinkId: 'cappuccino', milk: 'cow', bean: 'standard' } as const;

  it('sends a gift with a fresh unambiguous code', () => {
    const r = state().sendGift({ config: cap, payment: 'single', toName: 'Ondra' });
    if (!r.ok) throw new Error(r.reason);
    expect(r.gift.code).toMatch(/^SKQ-[ABCDEFGHJKMNPQRSTUVWXYZ23456789]{4}$/);
    expect(state().gifts.map((g) => g.code)).toContain(r.gift.code);
  });

  it('redeems a code into an order', () => {
    const r = state().redeemGift('SKQ-7M4T', { milk: 'oat', slotStart: null });
    if (!r.ok) throw new Error(String(r.reason));
    expect(state().orders.at(-1)?.payment).toBe('gift');
  });

  it('gives an unredeemed gift back when the clock passes its expiry, with a banner', () => {
    state().setTime(state().clock.now + 2 * 86_400_000);
    expect(state().wallet.giftCredits).toBe(1);
    expect(state().inbox.map((n) => n.kind)).toContain('giftReturned');
  });

  it('expires every pending gift from the demo panel', () => {
    state().expireAllGifts();
    expect(state().wallet.giftCredits).toBe(1); // only Frederika's own gift comes back to her
    expect(state().gifts.find((g) => g.code === 'SKQ-7M4T')?.expiresAt).toBe(state().clock.now);
  });
});

describe('store: onboarding (brief F16)', () => {
  beforeEach(() => state().switchPersona('new'));

  it('starts the new user without a nickname, not onboarded', () => {
    expect(state().profile).toMatchObject({ nickname: null, onboarded: false });
  });

  it('finishes onboarding with a valid nickname', () => {
    expect(state().completeOnboarding('Crema_New')).toBe(true);
    expect(state().profile).toMatchObject({ nickname: 'crema_new', onboarded: true });
  });

  it('refuses an invalid or taken nickname and stays on onboarding', () => {
    expect(state().completeOnboarding('šárka')).toBe(false);
    expect(state().completeOnboarding('espresso_eva')).toBe(false);
    expect(state().profile).toMatchObject({ nickname: null, onboarded: false });
  });
});
