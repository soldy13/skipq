import styles from './PlanCard.module.css';
import { IconCheck } from './icons';
import { Amount } from './Amount';

export interface PlanCardProps {
  name: string;
  /** "Up to 3 a day" */
  allowance: string;
  /** "All drinks" / "Black drinks only" */
  covers: string;
  /** Kč per week. */
  price: number;
  /** "/ week" — units always visible. */
  unit: string;
  selected?: boolean;
  /** Badge text when this is the plan the user already has. */
  currentLabel?: string;
  onSelect?: () => void;
}

export function PlanCard({ name, allowance, covers, price, unit, selected = false, currentLabel, onSelect }: PlanCardProps) {
  return (
    <button type="button" aria-pressed={selected} className={[styles.card, selected && styles.selected].filter(Boolean).join(' ')} onClick={onSelect}>
      <span className={styles.head}>
        <span className={styles.nameRow}>
          <span className={styles.name}>{name}</span>
          {currentLabel ? <span className={styles.badge}>{currentLabel}</span> : null}
        </span>
        <span className={styles.radio} aria-hidden="true">
          {selected ? <IconCheck size={16} /> : null}
        </span>
      </span>
      <span className={styles.covers}>
        {allowance} · {covers}
      </span>
      <span className={styles.price}>
        <Amount value={price} unit="Kč" />
        <span className={styles.unit}>{unit}</span>
      </span>
    </button>
  );
}
