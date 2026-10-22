import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './ScreenHeader.module.css';
import { IconButton } from '../components/Button';
import { IconChevronLeft } from '../components/icons';
import { useT } from '../i18n/useT';

/** Back arrow + optional trailing control. Goes back in history, or Home when opened directly. */
export function ScreenHeader({ trailing, fallback = '/' }: { trailing?: ReactNode; fallback?: string }) {
  const tr = useT();
  const navigate = useNavigate();
  const canGoBack = typeof window !== 'undefined' && (window.history.state as { idx?: number } | null)?.idx;
  return (
    <div className={styles.bar}>
      <IconButton
        label={tr.t('nav.back')}
        tone="filled"
        icon={<IconChevronLeft />}
        onClick={() => (canGoBack ? navigate(-1) : navigate(fallback))}
      />
      {trailing}
    </div>
  );
}
