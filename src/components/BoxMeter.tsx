import styles from './BoxMeter.module.css';
import { RichText } from './RichText';
import type { Translator } from '../i18n/useT';

export interface BoxMeterProps {
  free: number;
  total: number;
  /** Boxes the user holds right now, drawn in Vanilla. */
  mine?: number;
  tr: Translator;
  fewThreshold?: number;
}

/** "12 of 30 free" over a 30-segment strip — one segment per locker door. */
export function BoxMeter({ free, total, mine = 0, tr, fewThreshold = 3 }: BoxMeterProps) {
  const inUse = total - free;
  const othersInUse = Math.max(0, inUse - mine);
  const state = free === 0 ? 'full' : free <= fewThreshold ? 'few' : 'open';
  const label = free === 0 ? tr.t('boxes.full') : tr.t('boxes.free', { free, total });
  return (
    <section className={`${styles.meter} ${styles[state]}`} aria-label={tr.t('boxes.title')}>
      <h2 className={styles.title}>{tr.t('boxes.title')}</h2>
      <p className={styles.value} aria-live="polite">
        {free === 0 ? (
          label
        ) : (
          <RichText
            text={tr.t('boxes.free', { total })}
            nodes={{ free: <span className={`${styles.num} sq-mono`}>{free}</span> }}
          />
        )}
      </p>
      <ol className={styles.strip} aria-hidden="true" style={{ gridTemplateColumns: `repeat(${total}, minmax(0, 1fr))` }}>
        {Array.from({ length: total }, (_, i) => (
          <li key={i} className={i < mine ? styles.mine : i < mine + othersInUse ? styles.taken : styles.free} />
        ))}
      </ol>
    </section>
  );
}
