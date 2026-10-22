import type { ReactNode } from 'react';
import styles from './Chip.module.css';
import { IconCheck, IconLock } from './icons';

export interface ChipProps {
  children: ReactNode;
  selected?: boolean;
  disabled?: boolean;
  /** Needs an add-on: shows a lock and the badge, and stays tappable so it can open the add-on. */
  locked?: boolean;
  badge?: string;
  icon?: ReactNode;
  onClick?: () => void;
}

export function Chip({ children, selected = false, disabled, locked, badge, icon, onClick }: ChipProps) {
  const cls = [styles.chip, selected && styles.selected, locked && styles.locked].filter(Boolean).join(' ');
  return (
    <button type="button" className={cls} aria-pressed={selected} disabled={disabled} onClick={onClick}>
      {selected ? <IconCheck size={18} /> : locked ? <IconLock size={18} /> : icon}
      <span>{children}</span>
      {badge ? <span className={styles.badge}>{badge}</span> : null}
    </button>
  );
}

export function ChipGroup({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div role="group" aria-label={label} className={styles.group}>
      {children}
    </div>
  );
}
