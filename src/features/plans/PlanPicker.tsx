import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import p from './PlansScreen.module.css';
import { CheckoutSheet } from '../order/CheckoutSheet';
import { Button } from '../../components/Button';
import { PlanCard } from '../../components/PlanCard';
import { Segmented } from '../../components/Segmented';
import { PLAN_PRICES } from '../../data/pricing';
import type { PlanTier, PlanType } from '../../domain/types';
import { useStore } from '../../store/useStore';
import { useUi } from '../../store/useUi';
import { useT } from '../../i18n/useT';
import { inlineLabel } from '../../i18n/drinkText';

const TYPES: readonly PlanType[] = ['milk', 'black'];

/** Brief F8: choose 1 a day / up to 3 a day, then Milk or Black, then a simulated checkout. Switching is instant. */
export function PlanPicker() {
  const tr = useT();
  const [params] = useSearchParams();
  const plan = useStore((s) => s.plan);
  const subscribePlan = useStore((s) => s.subscribePlan);
  const cancelPlan = useStore((s) => s.cancelPlan);
  const showToast = useUi((s) => s.showToast);
  const asked = params.get('type');
  const [tier, setTier] = useState<PlanTier>(plan?.perDay ?? 3);
  const [type, setType] = useState<PlanType>(asked === 'milk' || asked === 'black' ? asked : (plan?.type ?? 'milk'));
  const [paying, setPaying] = useState(false);

  const tierLabel = (t: PlanTier) => tr.t(t === 1 ? 'plan.tier1' : 'plan.tier3');
  const price = PLAN_PRICES[type][tier];
  const isCurrent = plan?.type === type && plan.perDay === tier;

  return (
    <section className={p.section} aria-labelledby="plan-title">
      <h2 id="plan-title" className={p.heading}>
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
      <div role="group" aria-label={tr.t('plans.planSection')} className={p.cards}>
        {TYPES.map((t) => (
          <PlanCard
            key={t}
            name={tr.t(`plan.${t}`)}
            allowance={tierLabel(tier)}
            covers={tr.t(t === 'milk' ? 'plan.milkDesc' : 'plan.blackDesc')}
            price={PLAN_PRICES[t][tier]}
            unit={tr.t('common.perWeek')}
            selected={type === t}
            currentLabel={plan?.type === t && plan.perDay === tier ? tr.t('plan.current') : undefined}
            onSelect={() => setType(t)}
          />
        ))}
      </div>
      <Button block disabled={isCurrent} onClick={() => setPaying(true)}>
        {isCurrent ? tr.t('plans.isCurrent') : tr.t(plan ? 'plans.switch' : 'plans.subscribe', { price: tr.price(price) })}
      </Button>
      <p className={p.note}>{tr.t('plans.note')}</p>
      {plan ? (
        <Button
          variant="tertiary"
          className={p.cancel}
          onClick={() => {
            const previous = plan;
            cancelPlan();
            showToast({
              message: tr.t('plans.cancelled'),
              action: {
                label: tr.t('common.undo'),
                run: () => {
                  subscribePlan(previous);
                  showToast({ message: tr.t('plans.restored') });
                },
              },
            });
          }}
        >
          {tr.t('plans.cancel')}
        </Button>
      ) : null}

      <CheckoutSheet
        open={paying}
        onClose={() => setPaying(false)}
        lines={[{ label: tr.t('checkout.plan'), value: `${tr.t(`plan.${type}`)} · ${tierLabel(tier)}` }]}
        amount={price}
        unit={tr.t('common.perWeek')}
        onPaid={() => {
          subscribePlan({ type, perDay: tier });
          setPaying(false);
          showToast({ message: tr.t('plans.subscribed', { plan: tr.t(`plan.${type}`), tier: inlineLabel(tierLabel(tier), tr) }) });
        }}
      />
    </section>
  );
}
