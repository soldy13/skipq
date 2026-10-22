import { createContext, useContext, useState, type CSSProperties, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import styles from './Overlay.module.css';

const OverlayContext = createContext<HTMLElement | null>(null);

/**
 * Sheets, toasts and banners render into the nearest host, so they stay inside the phone frame
 * (or a style-guide stage) instead of covering the whole browser window.
 */
export function OverlayHost({ children, className, style }: { children: ReactNode; className?: string; style?: CSSProperties }) {
  const [el, setEl] = useState<HTMLElement | null>(null);
  return (
    <OverlayContext.Provider value={el}>
      <div className={[styles.host, className].filter(Boolean).join(' ')} style={style}>
        {children}
        <div ref={setEl} className={styles.layer} />
      </div>
    </OverlayContext.Provider>
  );
}

export function Overlay({ children }: { children: ReactNode }) {
  const el = useContext(OverlayContext);
  if (!el) return null;
  return createPortal(children, el);
}
