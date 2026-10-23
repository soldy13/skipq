import styles from '../Screen.module.css';
import p from './PlansScreen.module.css';
import { PlanPicker } from './PlanPicker';
import { AddonsSection } from './AddonsSection';
import { PacksSection } from './PacksSection';
import { DailyLimit } from '../../components/DailyLimit';
import { useStore } from '../../store/useStore';
import { useDailyLimit } from '../../store/hooks';
import { useT } from '../../i18n/useT';
import { planSummary } from './planText';

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
        <p className={p.current}>{planSummary(plan, credits, tr)}</p>
      </header>
      {plan ? <DailyLimit used={limit.used} max={limit.max} tr={tr} variant="banner" /> : null}
      <PlanPicker />
      <AddonsSection />
      <PacksSection />
    </div>
  );
}
