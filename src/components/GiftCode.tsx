import { useEffect, useState } from 'react';
import styles from './GiftCode.module.css';
import { Button } from './Button';
import { IconCopy, IconShare, IconGift } from './icons';
import { GiftStatusPill } from './StatusPill';
import type { GiftStatus } from '../domain/types';

export interface GiftCodeLabels {
  copy: string;
  copied: string;
  share: string;
  /** "For Ondra · Expires Tue 27 Oct. …" — left out once the gift is settled. */
  valid?: string;
  status: string;
}

export interface GiftCodeProps {
  code: string;
  drink: string;
  status: GiftStatus;
  labels: GiftCodeLabels;
  /** Text shared alongside the code. */
  shareText?: string;
  variant?: 'ticket' | 'row';
}

async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // Older browsers / insecure contexts: fall back to a hidden textarea.
    const area = document.createElement('textarea');
    area.value = text;
    area.setAttribute('readonly', '');
    area.style.position = 'fixed';
    area.style.opacity = '0';
    document.body.appendChild(area);
    try {
      area.select();
      return document.execCommand('copy');
    } catch {
      return false;
    } finally {
      area.remove();
    }
  }
}

/** The gift as a ticket: the code is the thing you pass on, so it's set large and mono. */
export function GiftCode({ code, drink, status, labels, shareText, variant = 'ticket' }: GiftCodeProps) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timer = window.setTimeout(() => setCopied(false), 2000);
    return () => window.clearTimeout(timer);
  }, [copied]);

  async function onCopy() {
    setCopied(await copyText(code));
  }

  async function onShare() {
    const text = shareText ? `${shareText} ${code}` : code;
    if (typeof navigator.share === 'function') {
      try {
        await navigator.share({ text });
        return;
      } catch (err) {
        if (err instanceof DOMException && err.name === 'AbortError') return;
      }
    }
    setCopied(await copyText(text));
  }

  if (variant === 'row') {
    return (
      <div className={styles.row}>
        <span className={`${styles.rowCode} sq-mono`}>{code}</span>
        <span className={styles.rowDrink}>{drink}</span>
        <span className={styles.rowStatus}>
          <GiftStatusPill status={status} label={labels.status} />
        </span>
      </div>
    );
  }

  return (
    <article className={styles.ticket}>
      <header className={styles.head}>
        <IconGift size={20} />
        <span className={styles.drink}>{drink}</span>
        <GiftStatusPill status={status} label={labels.status} />
      </header>
      <p className={`${styles.code} sq-mono`}>{code}</p>
      {labels.valid ? <p className={styles.valid}>{labels.valid}</p> : null}
      <div className={styles.actions}>
        <Button variant="secondary" compact icon={<IconCopy size={20} />} onClick={onCopy} aria-live="polite">
          {copied ? labels.copied : labels.copy}
        </Button>
        <Button variant="secondary" compact icon={<IconShare size={20} />} onClick={onShare}>
          {labels.share}
        </Button>
      </div>
    </article>
  );
}
