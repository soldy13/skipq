import type { ReactNode } from 'react';
import styles from './DailyLimit.module.css';
import type { Translator } from '../i18n/useT';

export interface DailyLimitProps {
  used: number;
  /** 0 = no plan (pay per coffee). */
  max: number;
  tr: Translator;
  /** Alternatives offered when the allowance is used up (Single / Pack). */
  actions?: ReactNode;
  variant?: 'tile' | 'banner';
}

/** Plan allowance for today. Neutral at the limit — limits are never red. */
export function DailyLimit({ used, max, tr, actions, variant = 'tile' }: DailyLimitProps) {
  const noPlan = max === 0;
  const reached = !noPlan && used >= max;
  return (
    <section className={[styles.limit, styles[variant], reached && styles.reached].filter(Boolean).join(' ')} aria-label={tr.t('limit.title')}>
      <h2 className={styles.title}>{tr.t('limit.title')}</h2>
      {noPlan ? (
        <>
          <p className={styles.value}>{tr.t('limit.noPlan')}</p>
          <p className={styles.note}>{tr.t('limit.noPlanHint')}</p>
        </>
      ) : (
        <>
          <ol className={styles.pips} aria-hidden="true">
            {Array.from({ length: max }, (_, i) => (
              <li key={i} className={i < used ? styles.used : styles.left} />
            ))}
          </ol>
          <p className={styles.value}>{tr.t('limit.counter', { used: Math.min(used, max), max })}</p>
          {reached ? <p className={styles.note}>{tr.t(max === 1 ? 'limit.reachedOne' : 'limit.reached')}</p> : null}
          {reached && actions ? <div className={styles.actions}>{actions}</div> : null}
        </>
      )}
    </section>
  );
}
