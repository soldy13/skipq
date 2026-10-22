import { Link } from 'react-router-dom';
import styles from './Screen.module.css';
import { useT } from '../i18n/useT';
import type { MessageKey } from '../i18n/translate';

/** Honest placeholder for screens that land in a later milestone. */
export function WipNote({ milestone, message = 'wip.body' }: { milestone: number; message?: MessageKey }) {
  const tr = useT();
  return (
    <div className={styles.wip}>
      <p>{tr.t(message, { n: milestone })}</p>
      <Link to="/styleguide">{tr.t('wip.styleguide')}</Link>
    </div>
  );
}
