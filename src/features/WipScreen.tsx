import type { ReactNode } from 'react';
import styles from './Screen.module.css';
import { WipNote } from './WipNote';
import { useT } from '../i18n/useT';
import type { MessageKey } from '../i18n/translate';

export function WipScreen({ title, milestone, children }: { title: MessageKey; milestone: number; children?: ReactNode }) {
  const tr = useT();
  return (
    <div className={styles.screen}>
      <h1 className={styles.title}>{tr.t(title)}</h1>
      {children}
      <WipNote milestone={milestone} />
    </div>
  );
}
