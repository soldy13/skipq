import { useId, type FormEvent } from 'react';
import styles from './CodeInput.module.css';
import { isCompleteCode, normalizeCodeInput } from '../domain/gifts';
import { IconCheck, IconExpired } from './icons';

export interface CodeInputProps {
  value: string;
  onChange: (code: string) => void;
  label: string;
  hint?: string;
  error?: string;
  onSubmit?: (code: string) => void;
  autoFocus?: boolean;
}

/** SKQ-XXXX: uppercases as you type, inserts the dash, drops characters a code can't contain. */
export function CodeInput({ value, onChange, label, hint, error, onSubmit, autoFocus }: CodeInputProps) {
  const id = useId();
  const complete = isCompleteCode(value);
  const describedBy = [hint && `${id}-hint`, error && `${id}-error`].filter(Boolean).join(' ') || undefined;

  function submit(e: FormEvent) {
    e.preventDefault();
    if (complete) onSubmit?.(value);
  }

  return (
    <form className={styles.wrap} onSubmit={submit} noValidate>
      <label htmlFor={id} className={styles.label}>
        {label}
      </label>
      <div className={[styles.field, error && styles.invalid, complete && !error && styles.complete].filter(Boolean).join(' ')}>
        <input
          id={id}
          className={`${styles.input} sq-mono`}
          value={value}
          onChange={(e) => onChange(normalizeCodeInput(e.target.value))}
          placeholder="SKQ-XXXX"
          inputMode="text"
          autoCapitalize="characters"
          autoComplete="off"
          autoCorrect="off"
          spellCheck={false}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          autoFocus={autoFocus}
          enterKeyHint="go"
        />
        {complete && !error ? <IconCheck className={styles.mark} /> : null}
      </div>
      {error ? (
        <p id={`${id}-error`} className={styles.error} role="alert">
          <IconExpired size={18} />
          <span>{error}</span>
        </p>
      ) : hint ? (
        <p id={`${id}-hint`} className={styles.hint}>
          {hint}
        </p>
      ) : null}
    </form>
  );
}
