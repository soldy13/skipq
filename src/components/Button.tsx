import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { forwardRef } from 'react';
import styles from './Button.module.css';
import { Spinner } from './Spinner';

export type ButtonVariant = 'primary' | 'secondary' | 'tertiary' | 'unlock';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  /** Full width of the container. */
  block?: boolean;
  /** Shows a spinner and swaps the label; the button stays focusable but inert. */
  loading?: boolean;
  loadingLabel?: string;
  icon?: ReactNode;
  /** Compact height for in-card actions (44 px, still a full touch target). */
  compact?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = 'primary', block, loading, loadingLabel, icon, compact, className, children, disabled, onClick, type = 'button', ...rest },
  ref,
) {
  const cls = [styles.button, styles[variant], block && styles.block, compact && styles.compact, loading && styles.loading, className]
    .filter(Boolean)
    .join(' ');
  return (
    <button
      ref={ref}
      type={type}
      className={cls}
      disabled={disabled}
      aria-busy={loading || undefined}
      aria-disabled={loading || undefined}
      onClick={loading ? undefined : onClick}
      {...rest}
    >
      {loading ? <Spinner /> : icon}
      <span className={styles.label}>{loading && loadingLabel ? loadingLabel : children}</span>
    </button>
  );
});

export interface IconButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  /** Required: icon buttons have no visible text. */
  label: string;
  icon: ReactNode;
  tone?: 'plain' | 'filled' | 'onDark';
}

export function IconButton({ label, icon, tone = 'plain', className, type = 'button', ...rest }: IconButtonProps) {
  return (
    <button type={type} aria-label={label} title={label} className={[styles.iconButton, styles[`icon_${tone}`], className].filter(Boolean).join(' ')} {...rest}>
      {icon}
    </button>
  );
}
