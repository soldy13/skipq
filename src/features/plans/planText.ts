import { PLAN_PRICES, SINGLE_PRICE } from '../../data/pricing';
import type { Plan } from '../../domain/types';
import type { Translator } from '../../i18n/useT';
import { inlineLabel } from '../../i18n/drinkText';

/** "Your plan: Milk plan, up to 3 a day · 229 Kč / week", or the pay-per-coffee / pack line. Plans and Me. */
export function planSummary(plan: Plan | null, credits: number, tr: Translator): string {
  if (plan) {
    const name = tr.t(`plan.${plan.type}`);
    return tr.t('plans.yours', {
      // English keeps the plan's name ("Your plan: Milk plan"); Czech uses it mid-sentence ("Máš mléčné předplatné").
      plan: tr.lang === 'cs' ? inlineLabel(name, tr) : name,
      tier: inlineLabel(tr.t(plan.perDay === 1 ? 'plan.tier1' : 'plan.tier3'), tr),
      price: tr.price(PLAN_PRICES[plan.type][plan.perDay]),
    });
  }
  if (credits > 0) return tr.t('plans.nonePack', { credits: inlineLabel(tr.tp('payment.packLeft', credits), tr) });
  return tr.t('plans.none', { price: tr.price(SINGLE_PRICE) });
}
