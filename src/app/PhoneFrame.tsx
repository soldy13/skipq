import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import styles from './PhoneFrame.module.css';
import type { Translator } from '../i18n/useT';

/**
 * Mobile: the app is the whole viewport. Desktop: a 390 × 844 phone, centred,
 * with a one-line note for pitch and test sessions.
 */
export function PhoneFrame({ children, tr }: { children: ReactNode; tr: Translator }) {
  return (
    <div className={styles.stage}>
      <aside className={styles.aside}>
        <p className={styles.wordmark}>{tr.t('app.name')}</p>
        <p className={styles.note}>{tr.t('frame.note')}</p>
        <Link to="/styleguide" className={styles.link}>
          {tr.t('frame.styleguide')}
        </Link>
      </aside>
      <div className={styles.phone}>{children}</div>
    </div>
  );
}
