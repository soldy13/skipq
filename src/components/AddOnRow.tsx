import { useId } from 'react';
import styles from './AddOnRow.module.css';
import { Switch } from './Switch';
import { Amount } from './Amount';

export interface AddOnRowProps {
  name: string;
  description: string;
  /** Kč per month. */
  price: number;
  /** "/ month" */
  unit: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}

export function AddOnRow({ name, description, price, unit, checked, onChange, disabled }: AddOnRowProps) {
  const id = useId();
  return (
    <div className={[styles.row, checked && styles.on].filter(Boolean).join(' ')}>
      <div className={styles.text}>
        <span id={`${id}-name`} className={styles.name}>
          {name}
        </span>
        <span id={`${id}-desc`} className={styles.desc}>
          {description}
        </span>
        <span className={styles.price}>
          <Amount value={price} unit="Kč" /> {unit}
        </span>
      </div>
      <Switch checked={checked} onChange={onChange} labelledBy={`${id}-name`} describedBy={`${id}-desc`} disabled={disabled} />
    </div>
  );
}
