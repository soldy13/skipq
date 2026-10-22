import { MINUTE } from './time';
import type { Booking, Order, OrderStatus } from './types';

/** Status is derived from the simulated clock, so any time jump lands in a consistent state. */
export function orderStatus(order: Order, now: number, brewMinutes: number): OrderStatus {
  if (order.cancelledAt !== null) return 'cancelled';
  if (order.pickedUpAt !== null) return 'pickedUp';
  if (now < order.readyAt - brewMinutes * MINUTE) return 'scheduled';
  if (now < order.readyAt) return 'brewing';
  if (now < order.holdUntil) return 'ready';
  return 'expired';
}

export function isActiveStatus(status: OrderStatus): boolean {
  return status === 'scheduled' || status === 'brewing' || status === 'ready';
}

/** The box holds the coffee from the moment it's ready until pickup, cancel or hold end. */
export function orderBooking(order: Order): Booking {
  return {
    id: order.id,
    boxId: order.boxId,
    bookedAt: order.paidAt,
    needFrom: order.readyAt,
    until: order.holdUntil,
    releasedAt: order.pickedUpAt ?? order.cancelledAt,
  };
}
