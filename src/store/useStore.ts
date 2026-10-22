import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { buildOccupancy, buildSeed, buildTraffic } from '../data/seed';
import { RAJSKA } from '../data/machines';
import { advanceClock, DEMO_START, type SimClock, type Speed } from '../domain/clock';
import { boxesBusyDuring, boxesInUseAt } from '../domain/boxes';
import { buildSlotGrid } from '../domain/slots';
import { orderBooking, orderStatus } from '../domain/orders';
import { MINUTE } from '../domain/time';
import { makeId } from '../domain/random';
import { readyToNotify, type Notice } from '../domain/notices';
import { cancelOrder, extendOrder, pickUpOrder, placeOrder, type OrderRequest, type PlaceResult } from '../domain/ordering';
import type { AddonId, Booking, LangPref, Order, PersonaId, World } from '../domain/types';
import { activeOrders, selectBookings } from './selectors';

export const STORAGE_KEY = 'skipq-v1';
/** Bump whenever the persisted shape changes: older saves are then re-seeded instead of trusted. */
const STORAGE_VERSION = 3;

export interface AppState extends World {
  clock: SimClock;
  /** Orders already announced as ready, so each is announced once. */
  notified: string[];
  /** Ready notifications waiting to be shown as a push banner. */
  inbox: Notice[];
}

export interface AppActions {
  /** Called once per real second by the app shell; advances by `realMs × speed`. */
  tick: (realMs: number) => void;
  advance: (ms: number) => void;
  setTime: (t: number) => void;
  setSpeed: (speed: Speed) => void;
  setLanguage: (language: LangPref) => void;
  switchPersona: (persona: PersonaId) => void;
  resetAll: () => void;
  setOccupiedBoxes: (count: number) => void;
  fillNextSlot: () => void;
  resetMachine: () => void;
  /** Demo: the soonest scheduled/brewing order becomes ready now. */
  makeNextOrderReady: () => void;
  /** Demo: the soonest active order's hold ends now. */
  expireActiveOrder: () => void;
  resetTodayLimit: () => void;
  giveCredits: (count: number) => void;
  placeOrder: (req: OrderRequest) => PlaceResult;
  undoOrder: (id: string) => void;
  unlockOrder: (id: string) => void;
  extendOrder: (id: string) => void;
  dismissNotice: (id: string) => void;
  /** Add-ons switch instantly in the prototype (brief §4.1). */
  setAddon: (id: AddonId, on: boolean) => void;
}

export type Store = AppState & AppActions;

export function initialState(): AppState {
  return { ...buildSeed('frederika', DEMO_START), clock: { now: DEMO_START, speed: 1 }, notified: [], inbox: [] };
}

/** After any change of time or orders: queue a ready banner for each coffee that just became ready. */
function withNotices(s: AppState, patch: Partial<AppState>): Partial<AppState> {
  const next = { ...s, ...patch };
  const ids = readyToNotify(next.orders, next.notified, next.clock.now);
  if (ids.length === 0) return patch;
  return {
    ...patch,
    notified: [...next.notified, ...ids],
    inbox: [...next.inbox, ...ids.map((orderId) => ({ id: `n_${orderId}`, kind: 'ready' as const, orderId, at: next.clock.now }))],
  };
}

/** The World part of the state, for the pure ordering functions. */
export function worldOf(s: AppState): World {
  return {
    persona: s.persona,
    profile: s.profile,
    plan: s.plan,
    addons: s.addons,
    wallet: s.wallet,
    orders: s.orders,
    traffic: s.traffic,
    gifts: s.gifts,
    limitResetAt: s.limitResetAt,
  };
}

/** Boxes the user's own unfinished orders hold right now. Demo controls never take these. */
function ownBoxesInUse(s: AppState): Set<number> {
  return boxesInUseAt(s.orders.map(orderBooking), s.clock.now);
}

function fillSlotBookings(s: AppState): Booking[] {
  const now = s.clock.now;
  const next = buildSlotGrid(RAJSKA, now, selectBookings(s)).slots[0];
  if (!next) return [];
  const busy = boxesBusyDuring(selectBookings(s), next.from, next.to, now);
  const out: Booking[] = [];
  for (let boxId = 1; boxId <= RAJSKA.boxes; boxId += 1) {
    if (busy.has(boxId)) continue;
    // Booked for that slot's window only, so the demo fills one slot and leaves Now alone.
    out.push({ id: `fill_${now}_${boxId}`, boxId, bookedAt: next.from, needFrom: next.from, until: next.to, releasedAt: null });
  }
  return out;
}

/** Only the parts an order action can change; unchanged references keep subscribers quiet. */
function pick(world: World): Partial<AppState> {
  return { orders: world.orders, wallet: world.wallet };
}

/** Replace one order by id, leaving the array untouched when nothing matches. */
function withOrder(orders: Order[], id: string | undefined, update: (o: Order) => Order): Order[] {
  if (!id) return orders;
  return orders.map((o) => (o.id === id ? update(o) : o));
}

export const useStore = create<Store>()(
  persist(
    (set, get) => ({
      ...initialState(),

      tick: (realMs) => set((s) => withNotices(s, { clock: advanceClock(s.clock, realMs) })),
      advance: (ms) => set((s) => withNotices(s, { clock: { ...s.clock, now: s.clock.now + Math.max(0, ms) } })),
      setTime: (t) => set((s) => withNotices(s, { clock: { ...s.clock, now: t } })),
      setSpeed: (speed) => set((s) => ({ clock: { ...s.clock, speed } })),

      setLanguage: (language) => set((s) => ({ profile: { ...s.profile, language } })),

      switchPersona: (persona) =>
        set((s) => ({
          ...buildSeed(persona, DEMO_START, s.profile.language),
          clock: { now: DEMO_START, speed: s.clock.speed },
          notified: [],
          inbox: [],
        })),

      resetAll: () => set(initialState()),

      setOccupiedBoxes: (count) =>
        set((s) => {
          const own = ownBoxesInUse(s);
          const others = Math.min(Math.max(0, Math.round(count) - own.size), RAJSKA.boxes - own.size);
          return { traffic: buildOccupancy(s.clock.now, others, own) };
        }),

      fillNextSlot: () => set((s) => ({ traffic: [...s.traffic, ...fillSlotBookings(s)] })),

      resetMachine: () => set((s) => ({ traffic: buildTraffic(s.clock.now, ownBoxesInUse(s)) })),

      makeNextOrderReady: () =>
        set((s) => {
          const now = s.clock.now;
          const next = activeOrders(s.orders, now).find((o) => orderStatus(o, now, RAJSKA.brewMinutes) !== 'ready');
          return withNotices(s, {
            orders: withOrder(s.orders, next?.id, (o) => ({
              ...o,
              readyAt: now,
              holdUntil: Math.max(o.holdUntil, now + RAJSKA.slotMinutes * MINUTE),
            })),
          });
        }),

      expireActiveOrder: () =>
        set((s) => {
          const now = s.clock.now;
          const target = activeOrders(s.orders, now)[0];
          return {
            orders: withOrder(s.orders, target?.id, (o) => ({ ...o, readyAt: Math.min(o.readyAt, now), holdUntil: now })),
          };
        }),

      resetTodayLimit: () => set((s) => ({ limitResetAt: s.clock.now })),

      giveCredits: (count) => set((s) => ({ wallet: { ...s.wallet, packCredits: s.wallet.packCredits + count } })),

      placeOrder: (req) => {
        const s = get();
        const result = placeOrder(worldOf(s), req, s.clock.now, makeId('o'));
        if (result.ok) set(withNotices(s, { orders: result.world.orders, wallet: result.world.wallet }));
        return result;
      },

      undoOrder: (id) => set((s) => pick(cancelOrder(worldOf(s), id, s.clock.now))),
      unlockOrder: (id) => set((s) => pick(pickUpOrder(worldOf(s), id, s.clock.now))),
      extendOrder: (id) => set((s) => pick(extendOrder(worldOf(s), id, s.clock.now))),

      dismissNotice: (id) => set((s) => ({ inbox: s.inbox.filter((n) => n.id !== id) })),

      setAddon: (id, on) => set((s) => ({ addons: { ...s.addons, [id]: on } })),
    }),
    {
      name: STORAGE_KEY,
      version: STORAGE_VERSION,
      storage: createJSONStorage(() => localStorage),
      partialize: (s): AppState => ({
        persona: s.persona,
        profile: s.profile,
        plan: s.plan,
        addons: s.addons,
        wallet: s.wallet,
        orders: s.orders,
        traffic: s.traffic,
        gifts: s.gifts,
        limitResetAt: s.limitResetAt,
        clock: s.clock,
        notified: s.notified,
        inbox: s.inbox,
      }),
      // Any older or unknown shape: start the demo fresh rather than guess.
      migrate: () => initialState(),
    },
  ),
);
