import styles from './WeekBars.module.css';

export interface WeekBar {
  /** Axis label, e.g. "5 Oct"; the current week says so in words ("This week"). */
  label: string;
  value: number;
  /** Spoken label for the bar, e.g. "Week from 5 Oct — coffees: 9". */
  description: string;
}

export interface WeekBarsProps {
  title: string;
  bars: readonly WeekBar[];
}

/**
 * Coffees per week, oldest → newest (brief §4.8). One series, so no legend: the title names it and every bar
 * carries its value. Bars are Coffee-400 (the meters token) in the DailyLimit pip's cup shape; the current week is
 * full Coffee and its label is a word in Espresso, so it isn't marked by colour alone.
 */
export function WeekBars({ title, bars }: WeekBarsProps) {
  const max = Math.max(1, ...bars.map((b) => b.value));
  return (
    <figure className={styles.chart}>
      <figcaption className={styles.title}>{title}</figcaption>
      <ol className={styles.plot}>
        {bars.map((b, i) => {
          const current = i === bars.length - 1;
          return (
            <li key={b.label} className={styles.col} aria-label={b.description}>
              <span className={`${styles.value} sq-mono`} aria-hidden="true">
                {b.value}
              </span>
              <span className={styles.track} aria-hidden="true">
                <span className={current ? `${styles.bar} ${styles.current}` : styles.bar} style={{ height: `${(b.value / max) * 100}%` }} />
              </span>
              <span className={current ? `${styles.label} ${styles.currentLabel}` : styles.label} aria-hidden="true">
                {b.label}
              </span>
            </li>
          );
        })}
      </ol>
    </figure>
  );
}
