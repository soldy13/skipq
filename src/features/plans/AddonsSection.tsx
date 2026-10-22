import { useState } from 'react';
import p from './PlansScreen.module.css';
import { CheckoutSheet } from '../order/CheckoutSheet';
import { AddOnRow } from '../../components/AddOnRow';
import { ADDON_IDS, ADDON_PRICES } from '../../data/pricing';
import type { AddonId } from '../../domain/types';
import { useStore } from '../../store/useStore';
import { useUi } from '../../store/useUi';
import { useT } from '../../i18n/useT';

/** Brief F9: switching an add-on on goes through a simulated monthly checkout; switching it off is instant. */
export function AddonsSection() {
  const tr = useT();
  const addons = useStore((s) => s.addons);
  const setAddon = useStore((s) => s.setAddon);
  const showToast = useUi((s) => s.showToast);
  const [pending, setPending] = useState<AddonId | null>(null);
  const name = (id: AddonId) => tr.t(`addon.${id}`);

  return (
    <section className={p.section} aria-labelledby="addons-title">
      <div className={p.head}>
        <h2 id="addons-title" className={p.heading}>
          {tr.t('plans.addons')}
        </h2>
        <p className={p.note}>{tr.t('plans.addonsNote')}</p>
      </div>
      <div className={p.rows}>
        {ADDON_IDS.map((id) => (
          <AddOnRow
            key={id}
            name={name(id)}
            description={tr.t(`addon.${id}Desc`)}
            price={ADDON_PRICES[id]}
            unit={tr.t('common.perMonth')}
            checked={addons[id]}
            onChange={(on) => {
              if (on) {
                setPending(id);
                return;
              }
              setAddon(id, false);
              showToast({ message: tr.t('addon.off', { addon: name(id) }) });
            }}
          />
        ))}
      </div>
      <CheckoutSheet
        open={pending !== null}
        onClose={() => setPending(null)}
        lines={pending ? [{ label: name(pending), value: tr.t('common.perMonth') }] : []}
        amount={pending ? ADDON_PRICES[pending] : 0}
        unit={tr.t('common.perMonth')}
        onPaid={() => {
          if (pending) {
            setAddon(pending, true);
            showToast({ message: tr.t('addon.added', { addon: name(pending) }) });
          }
          setPending(null);
        }}
      />
    </section>
  );
}
