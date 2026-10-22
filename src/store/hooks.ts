import { useMemo } from 'react';
import { useStore } from './useStore';
import { activeOrders, allBookings } from './selectors';
import { RAJSKA } from '../data/machines';
import { boxesInUseAt } from '../domain/boxes';
import { dailyLimit, type DailyLimit } from '../domain/limits';
import { buildSlotGrid, type SlotGrid } from '../domain/slots';
import { topUsuals, type Usual } from '../domain/usuals';
import { orderBooking } from '../domain/orders';
import type { Booking, Order, World } from '../domain/types';

/** The simulated world as one object, stable while none of its parts change. */
export function useWorld(): World {
  const persona = useStore((s) => s.persona);
  const profile = useStore((s) => s.profile);
  const plan = useStore((s) => s.plan);
  const addons = useStore((s) => s.addons);
  const wallet = useStore((s) => s.wallet);
  const orders = useStore((s) => s.orders);
  const traffic = useStore((s) => s.traffic);
  const gifts = useStore((s) => s.gifts);
  const limitResetAt = useStore((s) => s.limitResetAt);
  return useMemo(
    () => ({ persona, profile, plan, addons, wallet, orders, traffic, gifts, limitResetAt }),
    [persona, profile, plan, addons, wallet, orders, traffic, gifts, limitResetAt],
  );
}

/** Simulated "now". Never use Date.now() in features. */
export function useNow(): number {
  return useStore((s) => s.clock.now);
}

export function useBookings(): Booking[] {
  const traffic = useStore((s) => s.traffic);
  const orders = useStore((s) => s.orders);
  return useMemo(() => allBookings(traffic, orders), [traffic, orders]);
}

export interface BoxUsage {
  inUse: Set<number>;
  mine: Set<number>;
  free: number;
  total: number;
}

export function useBoxUsage(): BoxUsage {
  const now = useNow();
  const bookings = useBookings();
  const orders = useStore((s) => s.orders);
  return useMemo(() => {
    const inUse = boxesInUseAt(bookings, now);
    const mine = boxesInUseAt(orders.map(orderBooking), now);
    return { inUse, mine, free: RAJSKA.boxes - inUse.size, total: RAJSKA.boxes };
  }, [bookings, orders, now]);
}

export function useSlotGrid(): SlotGrid {
  const now = useNow();
  const bookings = useBookings();
  return useMemo(() => buildSlotGrid(RAJSKA, now, bookings), [now, bookings]);
}

export function useDailyLimit(): DailyLimit {
  const now = useNow();
  const plan = useStore((s) => s.plan);
  const orders = useStore((s) => s.orders);
  const gifts = useStore((s) => s.gifts);
  const nickname = useStore((s) => s.profile.nickname);
  const resetAt = useStore((s) => s.limitResetAt);
  return useMemo(
    () => dailyLimit({ plan, orders, gifts, nickname, now, resetAt }),
    [plan, orders, gifts, nickname, now, resetAt],
  );
}

export function useUsuals(): Usual[] {
  const orders = useStore((s) => s.orders);
  return useMemo(() => topUsuals(orders), [orders]);
}

export function useActiveOrders(): Order[] {
  const now = useNow();
  const orders = useStore((s) => s.orders);
  return useMemo(() => activeOrders(orders, now), [orders, now]);
}
