import { giftStatus } from '../../domain/gifts';
import { DAY, startOfDay } from '../../domain/time';
import type { GiftCode } from '../../domain/types';
import type { Translator } from '../../i18n/useT';
import { drinkName, drinkNameInline } from '../../i18n/drinkText';
import type { RedeemError } from '../../domain/giving';
import type { PlaceFailure } from '../../domain/ordering';
import { failureMessage } from '../order/orderText';
import type { MessageKey } from '../../i18n/translate';

/** "Pending · expires in 2 days", "Redeemed by crema_kral", "Returned to you" (brief §4.7). */
export function giftStatusLabel(gift: GiftCode, now: number, tr: Translator): string {
  const status = giftStatus(gift, now);
  if (status === 'redeemed') return tr.t('gift.redeemedBy', { name: gift.redeemedBy ?? '' });
  if (status === 'returned') return tr.t('gift.returned');
  // Calendar days, so "today" means today, and a code expiring tomorrow morning says "in 1 day".
  const days = Math.round((startOfDay(gift.expiresAt) - startOfDay(now)) / DAY);
  return days <= 0 ? tr.t('gift.expiresToday') : tr.tp('gift.pending', days);
}

/** "A cappuccino from rajska_raccoon." / "Cappuccino od rajska_raccoon." — the drink opens the Czech sentence. */
export function giftFromLine(gift: GiftCode, tr: Translator): string {
  const drink = tr.lang === 'en' ? drinkNameInline(gift.config.drinkId, tr) : drinkName(gift.config.drinkId, tr);
  return tr.t('gift.from', { drink, name: gift.fromNickname });
}

const REDEEM_ERRORS: Record<RedeemError, MessageKey> = {
  unknown: 'code.error.unknown',
  redeemed: 'code.error.redeemed',
  expired: 'code.error.expired',
  own: 'code.error.own',
};

export function redeemErrorText(error: RedeemError, tr: Translator): string {
  return tr.t(REDEEM_ERRORS[error]);
}

/** A redeem attempt fails either on the code or, like any order, on the slot. */
export function redeemFailureText(reason: RedeemError | PlaceFailure, tr: Translator): string {
  return reason in REDEEM_ERRORS ? redeemErrorText(reason as RedeemError, tr) : failureMessage(reason as PlaceFailure, tr);
}
