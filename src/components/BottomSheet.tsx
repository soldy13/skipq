import { useEffect, useId, useRef, type KeyboardEvent, type ReactNode } from 'react';
import styles from './BottomSheet.module.css';
import { Overlay } from './Overlay';
import { IconButton } from './Button';
import { IconClose } from './icons';
import { usePresence } from './usePresence';

export interface BottomSheetProps {
  open: boolean;
  onClose: () => void;
  title: string;
  /** Short line under the title. */
  subtitle?: string;
  closeLabel: string;
  children: ReactNode;
  /** Pinned under the scrolling body — where the sheet's action goes. */
  footer?: ReactNode;
  tone?: 'light' | 'dark';
}

const FOCUSABLE = 'button:not([disabled]), [href], input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])';

export function BottomSheet({ open, onClose, title, subtitle, closeLabel, children, footer, tone = 'light' }: BottomSheetProps) {
  const { mounted, shown } = usePresence(open);
  const titleId = useId();
  const sheetRef = useRef<HTMLDivElement>(null);
  const returnTo = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) return;
    returnTo.current = document.activeElement as HTMLElement | null;
    const raf = requestAnimationFrame(() => sheetRef.current?.focus());
    return () => {
      cancelAnimationFrame(raf);
      returnTo.current?.focus?.();
    };
  }, [open]);

  function onKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    if (e.key === 'Escape') {
      e.stopPropagation();
      onClose();
      return;
    }
    if (e.key !== 'Tab' || !sheetRef.current) return;
    const items = [...sheetRef.current.querySelectorAll<HTMLElement>(FOCUSABLE)];
    const first = items[0];
    const last = items[items.length - 1];
    if (!first || !last) return;
    if (e.shiftKey && (document.activeElement === first || document.activeElement === sheetRef.current)) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }

  if (!mounted) return null;
  return (
    <Overlay>
      <div className={[styles.root, shown && styles.shown, styles[tone]].filter(Boolean).join(' ')}>
        <div className={styles.scrim} onClick={onClose} aria-hidden="true" />
        <div
          ref={sheetRef}
          className={styles.sheet}
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          tabIndex={-1}
          onKeyDown={onKeyDown}
        >
          <div className={styles.handle} aria-hidden="true" />
          <header className={styles.header}>
            <div className={styles.titles}>
              <h2 id={titleId} className={styles.title}>
                {title}
              </h2>
              {subtitle ? <p className={styles.subtitle}>{subtitle}</p> : null}
            </div>
            <IconButton label={closeLabel} icon={<IconClose />} tone={tone === 'dark' ? 'onDark' : 'filled'} onClick={onClose} />
          </header>
          <div className={styles.body}>{children}</div>
          {footer ? <footer className={styles.footer}>{footer}</footer> : null}
        </div>
      </div>
    </Overlay>
  );
}
