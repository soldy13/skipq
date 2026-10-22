import type { PaymentOptions, PlaceFailure } from '../../domain/ordering';
import type { AddonId, Bean, DrinkConfig, Milk } from '../../domain/types';
import type { SegmentOption } from '../../components/Segmented';
import type { MessageKey } from '../../i18n/translate';
import type { Translator } from '../../i18n/useT';
import type { PaymentChoice } from '../../domain/ordering';

/** Which add-on unlocks a locked milk or bean option. */
export function addonFor(option: { kind: 'milk'; value: Milk } | { kind: 'bean'; value: Bean }): AddonId {
  if (option.kind === 'milk') return 'altMilk';
  return option.value === 'adaptogenic' ? 'adaptogenic' : 'premium';
}

const FAILURE: Record<PlaceFailure, MessageKey> = {
  locked: 'toast.failed',
  noPlan: 'toast.failed',
  notCovered: 'payment.notCovered',
  limit: 'limit.reached',
  noCredits: 'toast.failed',
  closed: 'toast.closed',
  slot: 'toast.full',
  full: 'toast.full',
};

export function failureMessage(reason: PlaceFailure, tr: Translator): string {
  return tr.t(FAILURE[reason]);
}

/** "Now" or "10:30". */
export function slotLabel(start: number | null, tr: Translator): string {
  return start === null ? tr.t('common.now') : tr.time(start);
}

/** Segmented options for the payment methods the user actually has (brief §4.2). */
export function paymentSegments(opts: PaymentOptions, tr: Translator): SegmentOption<PaymentChoice>[] {
  return opts.options.map((o) => {
    if (o.method === 'plan') {
      return {
        value: 'plan',
        label: tr.t('payment.plan'),
        sublabel: tr.t('limit.counter', { used: Math.min(o.used ?? 0, o.max ?? 0), max: o.max ?? 0 }),
        disabled: !o.available,
        reason:
          o.reason === 'limit'
            ? tr.t((o.max ?? 0) === 1 ? 'limit.reachedOne' : 'limit.reached')
            : o.reason === 'notCovered'
              ? tr.t('payment.notCovered')
              : undefined,
      };
    }
    if (o.method === 'pack') return { value: 'pack', label: tr.t('payment.pack'), sublabel: tr.tp('payment.packLeft', o.credits ?? 0) };
    return { value: 'single', label: tr.t('payment.single'), sublabel: tr.price(o.price ?? 0) };
  });
}

/** Order-screen URL carrying a configuration, so "Order again" and usual cards open it pre-filled. */
export function orderPath(config: DrinkConfig, slotStart?: number | null): string {
  const q = new URLSearchParams();
  if (config.milk) q.set('milk', config.milk);
  q.set('bean', config.bean);
  if (slotStart) q.set('slot', String(slotStart));
  return `/order/${config.drinkId}?${q.toString()}`;
}
