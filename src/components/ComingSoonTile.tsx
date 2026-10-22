import styles from './ComingSoonTile.module.css';
import { IconChevronRight, IconHeart } from './icons';

export interface ComingSoonTileProps {
  title: string;
  badge: string;
  description: string;
  onOpen: () => void;
}

/** Apple Health: visible, honest about not existing yet, and tappable for the explanation. */
export function ComingSoonTile({ title, badge, description, onOpen }: ComingSoonTileProps) {
  return (
    <button type="button" className={styles.tile} onClick={onOpen}>
      <span className={styles.icon} aria-hidden="true">
        <IconHeart />
      </span>
      <span className={styles.text}>
        <span className={styles.head}>
          <span className={styles.title}>{title}</span>
          <span className={styles.badge}>{badge}</span>
        </span>
        <span className={styles.desc}>{description}</span>
      </span>
      <IconChevronRight size={18} className={styles.chev} />
    </button>
  );
}
