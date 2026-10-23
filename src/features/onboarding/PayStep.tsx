import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../Screen.module.css';
import o from '../order/OrderScreen.module.css';
import w from './Welcome.module.css';
import { StepHeader } from './StepHeader';
import { CheckoutSheet } from '../order/CheckoutSheet';
import { CTA_DOCK, useDock } from '../useDock';
import { Button } from '../../components/Button';
import { PlanCard } from '../../components/PlanCard';
import { Segmented } from '../../components/Segmented';
import { PLAN_PRICES, SINGLE_PRICE } from '../../data/pricing';
import { DOT_SEP } from '../../domain/format';
import type { PlanTier, PlanType } from '../../domain/types';
import { useStore } from '../../store/useStore';
import { useUi } from '../../store/useUi';
import { useT } from '../../i18n/useT';
import { inlineLabel } from '../../i18n/drinkText';

type Choice = PlanType | 'single';

const TYPES: readonly PlanType[] = ['milk', 'black'];

/** Step 2: a plan through the usual checkout, or pay per coffee. Either way onboarding ends on Home. */
export function PayStep({ nickname, onBack }: { nickname: string; onBack: () => void }) {
  const tr = useT();
  const navigate = useNavigate();
  const completeOnboarding = useStore((s) => s.completeOnboarding);
  const subscribePlan = useStore((s) => s.subscribePlan);
  const showToast = useUi((s) => s.showToast);
  const [tier, setTier] = useState<PlanTier>(3);
  const [choice, setChoice] = useState<Choice>('milk');
  const [paying, setPaying] = useState(false);
  const title = useRef<HTMLHeadingElement>(null);
  useDock(CTA_DOCK);

  useEffect(() => {
    title.current?.focus();
  }, []);

  const tierLabel = (t: PlanTier) => tr.t(t === 1 ? 'plan.tier1' : 'plan.tier3');

  function finish(): boolean {
    // Validated on step 1; if the board changed meanwhile, send the user back to pick again.
    if (!completeOnboarding(nickname)) {
      onBack();
      return false;
    }
    navigate('/', { replace: true });
    return true;
  }

  return (
    <div className={`${styles.screen} ${o.screen} ${w.step}`}>
      <StepHeader n={2} onBack={onBack} />
      <header className={styles.header}>
        <h1 ref={title} tabIndex={-1} className={`${styles.title} ${w.title}`}>
          {tr.t('pay.title')}
        </h1>
        <p className={w.lead}>{tr.t('pay.lead')}</p>
      </header>

      <section className={w.choices} aria-labelledby="pay-plans">
        <h2 id="pay-plans" className="sq-sr-only">
          {tr.t('plans.planSection')}
        </h2>
        <Segmented<`${PlanTier}`>
          label={tr.t('plans.allowance')}
          value={`${tier}`}
          onChange={(v) => setTier(Number(v) as PlanTier)}
          options={[
            { value: '1', label: tierLabel(1) },
            { value: '3', label: tierLabel(3) },
          ]}
        />
        <div role="group" aria-label={tr.t('pay.title')} className={w.cards}>
          {TYPES.map((t) => (
            <PlanCard
              key={t}
              name={tr.t(`plan.${t}`)}
              allowance={tierLabel(tier)}
              covers={tr.t(t === 'milk' ? 'plan.milkDesc' : 'plan.blackDesc')}
              price={PLAN_PRICES[t][tier]}
              unit={tr.t('common.perWeek')}
              selected={choice === t}
              onSelect={() => setChoice(t)}
            />
          ))}
          <PlanCard
            name={tr.t('pay.single')}
            allowance={tr.t('pay.singleTerms')}
            covers={tr.t('pay.singleCovers')}
            price={SINGLE_PRICE}
            unit={tr.t('common.perCoffee')}
            selected={choice === 'single'}
            onSelect={() => setChoice('single')}
          />
        </div>
      </section>

      <div className={o.dock}>
        {choice === 'single' ? (
          <Button
            block
            onClick={() => {
              if (finish()) showToast({ message: tr.t('welcome.done', { name: nickname }) });
            }}
          >
            {tr.t('pay.startSingle')}
          </Button>
        ) : (
          <Button block onClick={() => setPaying(true)}>
            {tr.t('plans.subscribe', { price: tr.price(PLAN_PRICES[choice][tier]) })}
          </Button>
        )}
      </div>

      {choice === 'single' ? null : (
        <CheckoutSheet
          open={paying}
          onClose={() => setPaying(false)}
          lines={[{ label: tr.t('checkout.plan'), value: `${tr.t(`plan.${choice}`)}${DOT_SEP}${tierLabel(tier)}` }]}
          amount={PLAN_PRICES[choice][tier]}
          unit={tr.t('common.perWeek')}
          onPaid={() => {
            setPaying(false);
            if (!finish()) return;
            subscribePlan({ type: choice, perDay: tier });
            showToast({ message: tr.t('plans.subscribed', { plan: tr.t(`plan.${choice}`), tier: inlineLabel(tierLabel(tier), tr) }) });
          }}
        />
      )}
    </div>
  );
}
