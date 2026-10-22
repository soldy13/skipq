import styles from './PackTile.module.css';
import { Amount } from './Amount';

export interface PackTileProps {
  size: number;
  /** "coffees" — the word under the big number. */
  unitLabel: string;
  /** Kč. */
  price: number;
  /** "26.90 Kč per coffee" */
  perCoffee: string;
  selected?: boolean;
  onSelect?: () => void;
}

export function PackTile({ size, unitLabel, price, perCoffee, selected = false, onSelect }: PackTileProps) {
  return (
    <button type="button" aria-pressed={selected} className={[styles.tile, selected && styles.selected].filter(Boolean).join(' ')} onClick={onSelect}>
      <span className={`${styles.size} sq-mono`}>{size}</span>
      <span className={styles.unit}>{unitLabel}</span>
      <span className={styles.price}>
        <Amount value={price} unit="Kč" />
      </span>
      <span className={styles.per}>{perCoffee}</span>
    </button>
  );
}
