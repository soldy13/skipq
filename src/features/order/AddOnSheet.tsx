import { useState } from 'react';
import styles from './sheets.module.css';
import { BottomSheet } from '../../components/BottomSheet';
import { Button } from '../../components/Button';
import { Amount } from '../../components/Amount';
import { CheckoutSheet } from './CheckoutSheet';
import { ADDON_PRICES } from '../../data/pricing';
import type { AddonId } from '../../domain/types';
import { useStore } from '../../store/useStore';
import { useUi } from '../../store/useUi';
import { useT } from '../../i18n/useT';

/**
 * A locked chip opens this: what the add-on unlocks, its monthly price, and a simulated checkout.
 * Milestone 3's Plans screen manages the same add-ons.
 */
export function AddOnSheet({ addon, onClose }: { addon: AddonId | null; onClose: () => void }) {
  const tr = useT();
  const setAddon = useStore((s) => s.setAddon);
  const showToast = useUi((s) => s.showToast);
  const [paying, setPaying] = useState(false);
  const shown = addon ?? 'premium';
  const price = ADDON_PRICES[shown];
  const name = tr.t(`addon.${shown}`);

  return (
    <>
      <BottomSheet
        open={addon !== null && !paying}
        onClose={onClose}
        title={name}
        subtitle={tr.t(`addon.${shown}Desc`)}
        closeLabel={tr.t('common.close')}
        footer={
          <Button block onClick={() => setPaying(true)}>
            {tr.t('addon.add', { price: tr.price(price) })}
          </Button>
        }
      >
        <div className={styles.addonBody}>
          <p className={styles.addonPrice}>
            <Amount value={price} unit="Kč" /> <span>{tr.t('common.perMonth')}</span>
          </p>
          <p className={styles.fine}>{tr.t('addon.sheetNote')}</p>
        </div>
      </BottomSheet>
      <CheckoutSheet
        open={paying}
        onClose={() => setPaying(false)}
        lines={[{ label: name, value: tr.t('common.perMonth') }]}
        amount={price}
        unit={tr.t('common.perMonth')}
        onPaid={() => {
          setAddon(shown, true);
          setPaying(false);
          showToast({ message: tr.t('addon.added', { addon: name }) });
          onClose();
        }}
      />
    </>
  );
}
