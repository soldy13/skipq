import { machineById, RAJSKA } from '../data/machines';
import { orderStatus, isActiveStatus } from '../domain/orders';
import { worldBookings } from '../domain/ordering';
import type { Booking, Order, World } from '../domain/types';

/** Own orders as box bookings plus anonymous traffic — everything that competes for boxes. */
export function allBookings(traffic: readonly Booking[], orders: readonly Order[]): Booking[] {
  return worldBookings({ traffic, orders });
}

export function selectBookings(s: Pick<World, 'traffic' | 'orders'>): Booking[] {
  return allBookings(s.traffic, s.orders);
}

/** Orders that still need the user: scheduled, brewing or ready. Soonest first. */
export function activeOrders(orders: readonly Order[], now: number): Order[] {
  return orders
    .filter((o) => isActiveStatus(orderStatus(o, now, machineById(o.machineId).brewMinutes)))
    .sort((a, b) => a.readyAt - b.readyAt);
}

export function greetingKey(now: number): 'home.greeting.morning' | 'home.greeting.afternoon' | 'home.greeting.evening' {
  const h = new Date(now).getHours();
  if (h < 12) return 'home.greeting.morning';
  if (h < 17) return 'home.greeting.afternoon';
  return 'home.greeting.evening';
}

export const DEFAULT_MACHINE = RAJSKA;
