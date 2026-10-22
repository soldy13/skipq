import styles from './LockerGrid.module.css';
import type { Translator } from '../i18n/useT';

export interface LockerGridProps {
  total: number;
  inUse: ReadonlySet<number>;
  /** The user's box(es), highlighted in Vanilla. */
  mine: ReadonlySet<number>;
  tr: Translator;
  columns?: number;
  /** Compact mini-map for the pickup screen. */
  size?: 'full' | 'mini';
  showLegend?: boolean;
}

type BoxState = 'free' | 'inUse' | 'yours';

/** The machine's front: 6 × 5 doors, numbered left to right, top to bottom. */
export function LockerGrid({ total, inUse, mine, tr, columns = 6, size = 'full', showLegend = true }: LockerGridProps) {
  const stateOf = (n: number): BoxState => (mine.has(n) ? 'yours' : inUse.has(n) ? 'inUse' : 'free');
  const word: Record<BoxState, string> = { free: tr.t('locker.free'), inUse: tr.t('locker.inUse'), yours: tr.t('locker.yours') };
  return (
    <figure className={`${styles.locker} ${styles[size]}`}>
      <ol className={styles.grid} style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }} aria-label={tr.t('locker.title')}>
        {Array.from({ length: total }, (_, i) => {
          const n = i + 1;
          const state = stateOf(n);
          return (
            <li key={n} className={`${styles.box} ${styles[state]}`} aria-label={tr.t('locker.box', { n, state: word[state] })}>
              <span className="sq-mono" aria-hidden="true">
                {n}
              </span>
              <span className={styles.handle} aria-hidden="true" />
            </li>
          );
        })}
      </ol>
      {showLegend ? (
        <figcaption className={styles.legend}>
          {(['free', 'inUse', 'yours'] as const).map((s) => (
            <span key={s} className={styles.key}>
              <span className={`${styles.swatch} ${styles[s]}`} aria-hidden="true" />
              {word[s]}
            </span>
          ))}
        </figcaption>
      ) : null}
    </figure>
  );
}
