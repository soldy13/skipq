import styles from './PushBanner.module.css';
import { Overlay } from './Overlay';
import { IconButton } from './Button';
import { IconClose } from './icons';

export interface PushBannerProps {
  /** "SkipQ · now" */
  from: string;
  message: string;
  onOpen: () => void;
  onDismiss: () => void;
  dismissLabel: string;
  inline?: boolean;
}

/** In-app, push-style notification. Tapping the message opens the related screen. */
export function PushBanner({ from, message, onOpen, onDismiss, dismissLabel, inline }: PushBannerProps) {
  const banner = (
    <div className={[styles.banner, inline && styles.inline].filter(Boolean).join(' ')} role="alert">
      <button type="button" className={styles.open} onClick={onOpen}>
        <span className={styles.appIcon} aria-hidden="true">
          <span className={styles.door} />
        </span>
        <span className={styles.text}>
          <span className={styles.from}>{from}</span>
          <span className={styles.message}>{message}</span>
        </span>
      </button>
      <IconButton label={dismissLabel} icon={<IconClose size={18} />} onClick={onDismiss} className={styles.dismiss} />
    </div>
  );
  return inline ? banner : <Overlay>{banner}</Overlay>;
}
