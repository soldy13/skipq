import { useState, type ReactNode } from 'react';
import { CheckoutSheet } from './CheckoutSheet';
import { failureMessage, slotLabel } from './orderText';
import { SINGLE_PRICE } from '../../data/pricing';
import { DOT_SEP } from '../../domain/format';
import type { OrderRequest, PlaceFailure } from '../../domain/ordering';
import type { Order } from '../../domain/types';
import { useStore } from '../../store/useStore';
import { useUi } from '../../store/useUi';
import { useT } from '../../i18n/useT';
import { configSummary, drinkName } from '../../i18n/drinkText';

export interface OrderFlow {
  /** Plan and pack orders go straight through; singles pass the simulated checkout first. */
  submit: (req: OrderRequest, onPlaced: (order: Order) => void, onFailed?: (reason: PlaceFailure) => void) => void;
  /** Render this once in the screen. */
  sheet: ReactNode;
}

export function useOrderFlow(): OrderFlow {
  const tr = useT();
  const placeOrder = useStore((s) => s.placeOrder);
  const showToast = useUi((s) => s.showToast);
  const [pending, setPending] = useState<{ req: OrderRequest; onPlaced: (o: Order) => void; onFailed?: (r: PlaceFailure) => void } | null>(null);

  function place(req: OrderRequest, onPlaced: (o: Order) => void, onFailed?: (r: PlaceFailure) => void) {
    const result = placeOrder(req);
    if (result.ok) onPlaced(result.order);
    else {
      showToast({ message: failureMessage(result.reason, tr) });
      onFailed?.(result.reason);
    }
  }

  const submit: OrderFlow['submit'] = (req, onPlaced, onFailed) => {
    if (req.payment === 'single') setPending({ req, onPlaced, onFailed });
    else place(req, onPlaced, onFailed);
  };

  const req = pending?.req;
  const sheet = (
    <CheckoutSheet
      open={pending !== null}
      onClose={() => setPending(null)}
      lines={
        req
          ? [
              { label: tr.t('checkout.single'), value: `${drinkName(req.config.drinkId, tr)}${DOT_SEP}${configSummary(req.config, tr)}` },
              { label: tr.t('checkout.pickup'), value: slotLabel(req.slotStart, tr) },
            ]
          : []
      }
      amount={SINGLE_PRICE}
      onPaid={() => {
        if (pending) place(pending.req, pending.onPlaced, pending.onFailed);
        setPending(null);
      }}
    />
  );

  return { submit, sheet };
}
