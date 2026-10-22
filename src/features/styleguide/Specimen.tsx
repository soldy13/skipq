import type { ReactNode } from 'react';
import styles from './Styleguide.module.css';
import { OverlayHost } from '../../components/Overlay';

export function Section({ id, name, note, children }: { id: string; name: string; note?: string; children: ReactNode }) {
  return (
    <section id={id} className={styles.section} aria-labelledby={`${id}-h`}>
      <header className={styles.sectionHead}>
        <h2 id={`${id}-h`} className={styles.sectionName}>
          {name}
        </h2>
        {note ? <p className={styles.sectionNote}>{note}</p> : null}
      </header>
      <div className={styles.specimens}>{children}</div>
    </section>
  );
}

/** One state of one component, on the app's Foam ground at phone width. */
export function State({ label, children, wide, dark }: { label: string; children: ReactNode; wide?: boolean; dark?: boolean }) {
  return (
    <figure className={[styles.state, wide && styles.wide].filter(Boolean).join(' ')}>
      <figcaption className={styles.stateLabel}>{label}</figcaption>
      <div className={[styles.canvas, dark && styles.canvasDark].filter(Boolean).join(' ')}>{children}</div>
    </figure>
  );
}

/**
 * A box with its own overlay layer, for sheets, toasts and banners. It hugs its trigger until
 * something opens, then grows to phone-like height so the overlay has room.
 */
export function Stage({ label, children, height = 560, expanded = false }: { label: string; children: ReactNode; height?: number; expanded?: boolean }) {
  return (
    <figure className={styles.state}>
      <figcaption className={styles.stateLabel}>{label}</figcaption>
      <OverlayHost className={styles.stage}>
        <div className={styles.stageInner} style={expanded ? { height } : undefined}>
          {children}
        </div>
      </OverlayHost>
    </figure>
  );
}

export function Row({ children }: { children: ReactNode }) {
  return <div className={styles.rowGroup}>{children}</div>;
}
