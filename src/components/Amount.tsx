import styles from './Amount.module.css';
import { groupThousands } from '../domain/format';

export interface AmountProps {
  value: number | string;
  /** "Kč", "mg" — set in the sans so the mono's wide space doesn't push it away. */
  unit?: string;
}

/** A number in DM Mono with its unit beside it: 229 Kč, 2 990 mg. */
export function Amount({ value, unit }: AmountProps) {
  return (
    <span className={styles.amount}>
      <span className={`${styles.value} sq-mono`}>{typeof value === 'number' ? groupThousands(value) : value}</span>
      {unit ? <span className={styles.unit}>{unit}</span> : null}
    </span>
  );
}
