import { forwardRef, useId, type InputHTMLAttributes, type ReactNode } from 'react';
import styles from './TextField.module.css';
import { IconCheck, IconExpired } from './icons';

export interface TextFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value' | 'className'> {
  label: string;
  value: string;
  onChange: (value: string) => void;
  /** Quiet guidance under the field; replaced by the error or the success line when either is set. */
  hint?: string;
  /** What's wrong and how to fix it. Turns the field to the Expired state and is announced. */
  error?: string;
  /** Confirms a value that has been checked ("crema_new is available"). */
  success?: string;
  /** Shown under the message, e.g. a one-tap fix for the error. */
  action?: ReactNode;
}

/** A labelled 52 px text field with the same error anatomy as CodeInput: border, halo, icon plus words. */
export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(function TextField(
  { label, value, onChange, hint, error, success, action, ...input },
  ref,
) {
  const id = useId();
  const messageId = `${id}-message`;
  const message = error ?? success ?? hint;
  const state = error ? styles.invalid : success ? styles.valid : '';

  return (
    <div className={styles.wrap}>
      <label htmlFor={id} className={styles.label}>
        {label}
      </label>
      <div className={`${styles.field} ${state}`}>
        <input
          {...input}
          ref={ref}
          id={id}
          className={styles.input}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          aria-invalid={error ? true : undefined}
          aria-describedby={message ? messageId : undefined}
        />
        {success && !error ? <IconCheck className={styles.mark} /> : null}
      </div>
      {message ? (
        <p id={messageId} className={error ? styles.error : success ? styles.success : styles.hint} role={error ? 'alert' : undefined}>
          {error ? <IconExpired size={18} /> : null}
          <span>{message}</span>
        </p>
      ) : null}
      {action ? <div className={styles.action}>{action}</div> : null}
    </div>
  );
});
