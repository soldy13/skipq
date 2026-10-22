import { RAJSKA, type MachineConfig } from '../data/machines';
import { drinkById } from '../data/drinks';
import { SINGLE_PRICE } from '../data/pricing';
import { boxesBusyDuring, pickBox } from './boxes';
import { dailyLimit } from './limits';
import { orderBooking, orderStatus } from './orders';
import { buildSlotGrid, isValidSlotStart } from './slots';
import { MINUTE } from './time';
import type { Addons, Bean, Booking, DrinkConfig, Milk, Order, World } from './types';

/** What the order screen's segmented control offers (brief §4.2). Gift credits ride inside "pack". */
export type PaymentChoice = 'plan' | 'pack' | 'single';
export type PlanBlock = 'limit' | 'notCovered';

export interface PaymentOption {
  method: PaymentChoice;
  available: boolean;
  reason?: PlanBlock;
  /** Plan: allowance used today and the daily maximum. */
  used?: number;
  max?: number;
  /** Pack: pack + returned gift credits. */
  credits?: number;
  /** Single: Kč. */
  price?: number;
}

export interface PaymentOptions {
  options: PaymentOption[];
  default: PaymentChoice;
}

export type PlaceFailure = 'locked' | 'noPlan' | 'notCovered' | 'limit' | 'noCredits' | 'closed' | 'slot' | 'full';

export interface OrderRequest {
  config: DrinkConfig;
  /** null = Now. */
  slotStart: number | null;
  payment: PaymentChoice;
}

export type PlaceResult = { ok: true; world: World; order: Order } | { ok: false; reason: PlaceFailure };

export type OptionRef = { kind: 'milk'; value: Milk } | { kind: 'bean'; value: Bean };

/** Everything competing for boxes: anonymous traffic plus the user's own orders. */
export function worldBookings(world: { traffic: readonly Booking[]; orders: readonly Order[] }): Booking[] {
  return [...world.traffic, ...world.orders.map(orderBooking)];
}

function limitFor(world: World, now: number) {
  return dailyLimit({ plan: world.plan, orders: world.orders, gifts: world.gifts, nickname: world.profile.nickname, now, resetAt: world.limitResetAt });
}

function planCovers(world: World, config: DrinkConfig): boolean {
  return world.plan?.type === 'milk' || drinkById(config.drinkId).type === 'black';
}

/**
 * Alternative milk is free on singles and packs but needs the add-on on plan orders (brief §12.4);
 * premium and adaptogenic beans need their add-on whatever the payment.
 */
export function isOptionLocked(option: OptionRef, payment: PaymentChoice, addons: Addons): boolean {
  if (option.kind === 'milk') return option.value !== 'cow' && payment === 'plan' && !addons.altMilk;
  if (option.value === 'premium') return !addons.premium;
  if (option.value === 'adaptogenic') return !addons.adaptogenic;
  return false;
}

function configLocked(config: DrinkConfig, payment: PaymentChoice, addons: Addons): boolean {
  return (config.milk !== null && isOptionLocked({ kind: 'milk', value: config.milk }, payment, addons)) || isOptionLocked({ kind: 'bean', value: config.bean }, payment, addons);
}

/** Only what the user has, in the brief's order; default = plan if eligible → pack → single. */
export function paymentOptions(world: World, config: DrinkConfig, now: number): PaymentOptions {
  const options: PaymentOption[] = [];
  if (world.plan) {
    const limit = limitFor(world, now);
    const covered = planCovers(world, config);
    const reason: PlanBlock | undefined = !covered ? 'notCovered' : limit.reached ? 'limit' : undefined;
    options.push({ method: 'plan', available: reason === undefined, reason, used: limit.used, max: limit.max });
  }
  const credits = world.wallet.packCredits + world.wallet.giftCredits;
  if (credits > 0) options.push({ method: 'pack', available: true, credits });
  options.push({ method: 'single', available: true, price: SINGLE_PRICE });
  const first = options.find((o) => o.available);
  return { options, default: first?.method ?? 'single' };
}

function paymentFailure(world: World, req: OrderRequest, now: number): PlaceFailure | null {
  if (configLocked(req.config, req.payment, world.addons)) return 'locked';
  if (req.payment === 'plan') {
    if (!world.plan) return 'noPlan';
    if (!planCovers(world, req.config)) return 'notCovered';
    if (limitFor(world, now).reached) return 'limit';
  }
  if (req.payment === 'pack' && world.wallet.packCredits + world.wallet.giftCredits <= 0) return 'noCredits';
  return null;
}

/** Ready time for Now or a slot, or why it can't be had. */
function readyTime(machine: MachineConfig, world: World, slotStart: number | null, now: number): number | PlaceFailure {
  if (slotStart === null) {
    return buildSlotGrid(machine, now, worldBookings(world)).now.available ? now + machine.brewMinutes * MINUTE : 'closed';
  }
  return isValidSlotStart(machine, now, slotStart) ? slotStart : 'slot';
}

/**
 * Pay and reserve (brief §4.4–4.5): the box is reserved at payment, the coffee is ready at slot start
 * (or in ≈ 2 min for Now) and held until the slot ends. Pure: returns the next world.
 */
export function placeOrder(world: World, req: OrderRequest, now: number, id: string, machine: MachineConfig = RAJSKA): PlaceResult {
  const payFail = paymentFailure(world, req, now);
  if (payFail) return { ok: false, reason: payFail };
  const readyAt = readyTime(machine, world, req.slotStart, now);
  if (typeof readyAt !== 'number') return { ok: false, reason: readyAt };
  const holdUntil = readyAt + machine.slotMinutes * MINUTE;
  const boxId = pickBox(machine.boxes, worldBookings(world), readyAt, holdUntil, now);
  if (boxId === null) return { ok: false, reason: 'full' };

  const useGift = req.payment === 'pack' && world.wallet.giftCredits > 0;
  const wallet =
    req.payment !== 'pack'
      ? world.wallet
      : useGift
        ? { ...world.wallet, giftCredits: world.wallet.giftCredits - 1 }
        : { ...world.wallet, packCredits: world.wallet.packCredits - 1 };
  const order: Order = {
    id,
    config: req.config,
    machineId: machine.id,
    boxId,
    paidAt: now,
    slotStart: req.slotStart,
    readyAt,
    holdUntil,
    extended: false,
    payment: req.payment === 'pack' ? (useGift ? 'giftCredit' : 'pack') : req.payment,
    pricePaid: req.payment === 'single' ? SINGLE_PRICE : 0,
    pickedUpAt: null,
    cancelledAt: null,
  };
  return { ok: true, order, world: { ...world, wallet, orders: [...world.orders, order] } };
}

function updateOrder(world: World, id: string, update: (o: Order) => Order): World {
  return { ...world, orders: world.orders.map((o) => (o.id === id ? update(o) : o)) };
}

/** Undo (brief §4.5): cancel and refund. The plan allowance comes back by itself — cancelled orders don't count. */
export function cancelOrder(world: World, id: string, now: number): World {
  const order = world.orders.find((o) => o.id === id);
  if (!order || order.cancelledAt !== null || order.pickedUpAt !== null) return world;
  const wallet =
    order.payment === 'pack'
      ? { ...world.wallet, packCredits: world.wallet.packCredits + 1 }
      : order.payment === 'giftCredit'
        ? { ...world.wallet, giftCredits: world.wallet.giftCredits + 1 }
        : world.wallet;
  return { ...updateOrder(world, id, (o) => ({ ...o, cancelledAt: now })), wallet };
}

/** Unlock: only a coffee that is ready right now. */
export function pickUpOrder(world: World, id: string, now: number, machine: MachineConfig = RAJSKA): World {
  const order = world.orders.find((o) => o.id === id);
  if (!order || orderStatus(order, now, machine.brewMinutes) !== 'ready') return world;
  return updateOrder(world, id, (o) => ({ ...o, pickedUpAt: now }));
}

/** Extend (brief §4.4): while ready, once, if the next slot has room and this box stays free for it. */
export function canExtend(world: World, id: string, now: number, machine: MachineConfig = RAJSKA): boolean {
  const order = world.orders.find((o) => o.id === id);
  if (!order || order.extended || machine.maxExtensions < 1) return false;
  if (orderStatus(order, now, machine.brewMinutes) !== 'ready') return false;
  const from = order.holdUntil;
  const to = from + machine.slotMinutes * MINUTE;
  const others = worldBookings(world).filter((b) => b.id !== order.id);
  const busy = boxesBusyDuring(others, from, to, now);
  return !busy.has(order.boxId) && machine.boxes - busy.size > 0;
}

export function extendOrder(world: World, id: string, now: number, machine: MachineConfig = RAJSKA): World {
  if (!canExtend(world, id, now, machine)) return world;
  return updateOrder(world, id, (o) => ({ ...o, holdUntil: o.holdUntil + machine.slotMinutes * MINUTE, extended: true }));
}
