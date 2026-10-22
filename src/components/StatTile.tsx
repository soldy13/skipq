import type { ReactNode } from 'react';
import styles from './StatTile.module.css';
import { Amount } from './Amount';

export interface StatTileProps {
  label: string;
  /** The number itself, set in mono. */
  value: number | string;
  /** Unit beside the number: "mg". */
  unit?: string;
  /** Second line: "6 weekdays", the Red Bull equivalent. */
  sub?: string;
  icon?: ReactNode;
  /** Text values (a drink name) read better in the serif than in mono. */
  textValue?: boolean;
}

export function StatTile({ label, value, unit, sub, icon, textValue }: StatTileProps) {
  return (
    <div className={styles.tile}>
      <span className={styles.label}>
        {icon}
        {label}
      </span>
      {textValue ? (
        <span className={styles.text}>{value}</span>
      ) : (
        <span className={styles.value}>
          <Amount value={value} unit={unit} />
        </span>
      )}
      {sub ? <span className={styles.sub}>{sub}</span> : null}
    </div>
  );
}
