import { useEffect, useRef } from 'react';
import styles from './Toast.module.css';
import { Overlay } from './Overlay';
import { BoxTag } from './BoxTag';

export interface ToastProps {
  message: string;
  /** Shows the box plate next to the message ("Ordered. Box 14 reserved."). */
  box?: number;
  actionLabel?: string;
  onAction?: () => void;
  /** Real milliseconds — the undo window is a UI promise, not simulated time. */
  duration?: number;
  onDone?: () => void;
  /** Render in place (style guide) instead of in the overlay layer. */
  inline?: boolean;
  /** Style guide: freeze the countdown. */
  paused?: boolean;
}

export function Toast({ message, box, actionLabel, onAction, duration = 5000, onDone, inline, paused }: ToastProps) {
  const done = useRef(onDone);
  done.current = onDone;

  // A new message is a new undo window.
  useEffect(() => {
    if (paused) return;
    const timer = window.setTimeout(() => done.current?.(), duration);
    return () => window.clearTimeout(timer);
  }, [duration, paused, message]);

  const toast = (
    <div className={[styles.toast, inline && styles.inline].filter(Boolean).join(' ')} role="status">
      <div className={styles.row}>
        {box !== undefined ? <BoxTag n={box} size="sm" /> : null}
        <p className={styles.message}>{message}</p>
        {actionLabel && onAction ? (
          <button type="button" className={styles.action} onClick={onAction}>
            {actionLabel}
          </button>
        ) : null}
      </div>
      {actionLabel ? (
        <span
          key={message}
          className={styles.timer}
          style={{ animationDuration: `${duration}ms`, animationPlayState: paused ? 'paused' : 'running' }}
          aria-hidden="true"
        />
      ) : null}
    </div>
  );

  return inline ? toast : <Overlay>{toast}</Overlay>;
}
