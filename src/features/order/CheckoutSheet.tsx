import { useEffect, useRef, useState } from 'react';
import styles from './sheets.module.css';
import { BottomSheet } from '../../components/BottomSheet';
import { Button } from '../../components/Button';
import { Amount } from '../../components/Amount';
import { useT } from '../../i18n/useT';

export interface CheckoutLine {
  label: string;
  value: string;
}

export interface CheckoutSheetProps {
  open: boolean;
  onClose: () => void;
  lines: readonly CheckoutLine[];
  /** Kč. */
  amount: number;
  /** "/ week" etc. for subscriptions. */
  unit?: string;
  onPaid: () => void;
}

/** Simulated payment (brief §4.2): a wallet-style button and a one-second spinner. Never card data. */
export function CheckoutSheet({ open, onClose, lines, amount, unit, onPaid }: CheckoutSheetProps) {
  const tr = useT();
  const [paying, setPaying] = useState(false);
  const paid = useRef(onPaid);
  paid.current = onPaid;

  useEffect(() => {
    if (!paying) return;
    const timer = window.setTimeout(() => {
      setPaying(false);
      paid.current();
    }, 1000);
    return () => window.clearTimeout(timer);
  }, [paying]);

  return (
    <BottomSheet
      open={open}
      onClose={paying ? () => undefined : onClose}
      title={tr.t('checkout.title')}
      closeLabel={tr.t('common.close')}
      footer={
        <div className={styles.footer}>
          <Button block loading={paying} loadingLabel={tr.t('checkout.paying')} onClick={() => setPaying(true)}>
            {tr.t('checkout.pay', { price: tr.price(amount) })}
          </Button>
          <p className={styles.fine}>{tr.t('checkout.note')}</p>
        </div>
      }
    >
      <dl className={styles.lines}>
        {lines.map((l) => (
          <div key={l.label} className={styles.line}>
            <dt>{l.label}</dt>
            <dd>{l.value}</dd>
          </div>
        ))}
        <div className={`${styles.line} ${styles.total}`}>
          <dt>{tr.t('checkout.total')}</dt>
          <dd>
            <Amount value={amount} unit="Kč" />
            {unit ? `\u00A0${unit}` : null}
          </dd>
        </div>
      </dl>
    </BottomSheet>
  );
}
