import styles from '../Screen.module.css';
import p from './PlansScreen.module.css';
import { PlanPicker } from './PlanPicker';
import { AddonsSection } from './AddonsSection';
import { PacksSection } from './PacksSection';
import { DailyLimit } from '../../components/DailyLimit';
import { PLAN_PRICES, SINGLE_PRICE } from '../../data/pricing';
import { useStore } from '../../store/useStore';
import { useDailyLimit } from '../../store/hooks';
import { useT } from '../../i18n/useT';
import { inlineLabel } from '../../i18n/drinkText';

/** Plans tab (brief §3): the current plan and today's allowance, the plan picker, add-ons and packs. */
export function PlansScreen() {
  const tr = useT();
  const plan = useStore((s) => s.plan);
  const credits = useStore((s) => s.wallet.packCredits + s.wallet.giftCredits);
  const limit = useDailyLimit();

  return (
    <div className={styles.screen}>
      <header className={styles.header}>
        <h1 className={styles.title}>{tr.t('screen.plans')}</h1>
        <p className={p.current}>
          {plan
            ? tr.t('plans.yours', {
                // English keeps the plan's name ("Your plan: Milk plan"); Czech uses it mid-sentence ("Máš mléčné předplatné").
                plan: tr.lang === 'cs' ? inlineLabel(tr.t(`plan.${plan.type}`), tr) : tr.t(`plan.${plan.type}`),
                tier: inlineLabel(tr.t(plan.perDay === 1 ? 'plan.tier1' : 'plan.tier3'), tr),
                price: tr.price(PLAN_PRICES[plan.type][plan.perDay]),
              })
            : credits > 0
              ? tr.t('plans.nonePack', { credits: inlineLabel(tr.tp('payment.packLeft', credits), tr) })
              : tr.t('plans.none', { price: tr.price(SINGLE_PRICE) })}
        </p>
      </header>
      {plan ? <DailyLimit used={limit.used} max={limit.max} tr={tr} variant="banner" /> : null}
      <PlanPicker />
      <AddonsSection />
      <PacksSection />
    </div>
  );
}
