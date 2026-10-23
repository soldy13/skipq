import { useEffect, useState, type ReactNode } from 'react';
import styles from './DemoPanel.module.css';
import { BottomSheet } from './BottomSheet';
import { Segmented } from './Segmented';
import { useStore } from '../store/useStore';
import { useBoxUsage, useNow } from '../store/hooks';
import { HOUR, MINUTE, addDays, atClock } from '../domain/time';
import { formatTime } from '../domain/format';
import { PERSONA_IDS } from '../data/personas';
import type { LangPref, PersonaId } from '../domain/types';
import type { Speed } from '../domain/clock';
import type { Translator } from '../i18n/useT';

function Group({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className={styles.group}>
      <h3 className={styles.groupTitle}>{title}</h3>
      {children}
    </section>
  );
}

function DemoButton({ children, onClick, disabled, danger }: { children: ReactNode; onClick?: () => void; disabled?: boolean; danger?: boolean }) {
  return (
    <button type="button" className={[styles.button, danger && styles.danger].filter(Boolean).join(' ')} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
}

/** Every control a tester needs to reach any state in seconds (brief §8). Wired straight to the store. */
export function DemoControls({ tr, onDone }: { tr: Translator; onDone?: () => void }) {
  const now = useNow();
  const speed = useStore((s) => s.clock.speed);
  const persona = useStore((s) => s.persona);
  const language = useStore((s) => s.profile.language);
  const actions = useStore.getState();
  const usage = useBoxUsage();
  const [confirmReset, setConfirmReset] = useState(false);

  useEffect(() => {
    if (!confirmReset) return;
    const timer = window.setTimeout(() => setConfirmReset(false), 4000);
    return () => window.clearTimeout(timer);
  }, [confirmReset]);

  // Day jumps are calendar days, so they keep the wall-clock time across the DST change on 25 Oct.
  const jumps: { label: string; go: () => void }[] = [
    { label: tr.t('demo.addMin', { n: 2 }), go: () => actions.advance(2 * MINUTE) },
    { label: tr.t('demo.addMin', { n: 15 }), go: () => actions.advance(15 * MINUTE) },
    { label: tr.t('demo.addHour', { n: 1 }), go: () => actions.advance(HOUR) },
    { label: tr.tp('demo.addDay', 1), go: () => actions.setTime(addDays(now, 1)) },
    { label: tr.tp('demo.addDay', 5), go: () => actions.setTime(addDays(now, 5)) },
  ];

  /** Time only moves forward: an earlier time of day means that time tomorrow. */
  function setTimeOfDay(hhmm: string) {
    const target = atClock(now, hhmm);
    actions.setTime(target > now ? target : addDays(target, 1));
  }

  return (
    <div className={styles.controls}>
      <Group title={tr.t('demo.clock')}>
        <p className={styles.clock}>
          <span className={styles.date}>{tr.date(now)}</span>
          <span className="sq-mono">{tr.time(now)}</span>
        </p>
        <div className={styles.row}>
          {jumps.map((j) => (
            <DemoButton key={j.label} onClick={j.go}>
              {j.label}
            </DemoButton>
          ))}
        </div>
        <label className={styles.field}>
          <span>{tr.t('demo.setTime')}</span>
          <input
            type="time"
            className={`${styles.input} sq-mono`}
            value={formatTime(now, 'cs')}
            onChange={(e) => e.target.value && setTimeOfDay(e.target.value)}
          />
        </label>
        <Segmented<`${Speed}`>
          tone="dark"
          label={tr.t('demo.speed')}
          value={`${speed}`}
          onChange={(v) => actions.setSpeed(Number(v) as Speed)}
          options={[
            { value: '1', label: '1×' },
            { value: '30', label: '30×' },
          ]}
        />
      </Group>

      <Group title={tr.t('demo.orders')}>
        <div className={styles.stack}>
          <DemoButton onClick={actions.makeNextOrderReady}>{tr.t('demo.makeReady')}</DemoButton>
          <DemoButton onClick={actions.expireActiveOrder}>{tr.t('demo.expireActive')}</DemoButton>
        </div>
      </Group>

      <Group title={tr.t('demo.machine')}>
        <label className={styles.field}>
          <span>{tr.t('demo.occupied')}</span>
          <output className="sq-mono">
            {usage.inUse.size} / {usage.total}
          </output>
        </label>
        <input
          type="range"
          min={0}
          max={usage.total}
          step={1}
          value={usage.inUse.size}
          aria-label={tr.t('demo.occupied')}
          className={styles.range}
          onChange={(e) => actions.setOccupiedBoxes(Number(e.target.value))}
        />
        <div className={styles.row}>
          <DemoButton onClick={actions.fillNextSlot}>{tr.t('demo.fillNext')}</DemoButton>
          <DemoButton onClick={actions.resetMachine}>{tr.t('demo.resetMachine')}</DemoButton>
        </div>
      </Group>

      <Group title={tr.t('demo.user')}>
        <Segmented<PersonaId>
          tone="dark"
          label={tr.t('demo.user')}
          value={persona}
          onChange={(p) => actions.switchPersona(p)}
          options={PERSONA_IDS.map((id) => ({ value: id, label: tr.t(`persona.${id}`) }))}
        />
        <p className={styles.note}>{tr.t('demo.personaNote')}</p>
        <div className={styles.row}>
          <DemoButton onClick={actions.resetTodayLimit}>{tr.t('demo.resetLimit')}</DemoButton>
          <DemoButton onClick={() => actions.giveCredits(10)}>{tr.t('demo.giveCredits')}</DemoButton>
        </div>
      </Group>

      <Group title={tr.t('demo.gifts')}>
        <DemoButton onClick={actions.expireAllGifts}>{tr.t('demo.expireGifts')}</DemoButton>
      </Group>

      <Group title={tr.t('demo.language')}>
        <Segmented<LangPref>
          tone="dark"
          label={tr.t('demo.language')}
          value={language}
          onChange={actions.setLanguage}
          options={[
            { value: 'auto', label: tr.t('lang.auto') },
            { value: 'en', label: 'EN' },
            { value: 'cs', label: 'CS' },
          ]}
        />
      </Group>

      <DemoButton
        danger
        onClick={() => {
          if (!confirmReset) {
            setConfirmReset(true);
            return;
          }
          setConfirmReset(false);
          actions.resetAll();
          onDone?.();
        }}
      >
        {confirmReset ? tr.t('demo.resetConfirm') : tr.t('demo.resetAll')}
      </DemoButton>
    </div>
  );
}

export function DemoPanel({ open, onClose, tr }: { open: boolean; onClose: () => void; tr: Translator }) {
  return (
    <BottomSheet open={open} onClose={onClose} title={tr.t('demo.title')} closeLabel={tr.t('common.close')} tone="dark">
      <DemoControls tr={tr} onDone={onClose} />
    </BottomSheet>
  );
}

/** Small floating pill, bottom-left above the tab bar. Shows the simulated time at a glance. */
export function DemoPill({ onOpen, tr }: { onOpen: () => void; tr: Translator }) {
  const now = useNow();
  const speed = useStore((s) => s.clock.speed);
  return (
    <button type="button" className={styles.pill} onClick={onOpen} aria-label={`${tr.t('demo.open')} · ${tr.time(now)}`}>
      <span className={styles.pillWord}>{tr.t('demo.pill')}</span>
      <span className="sq-mono">{tr.time(now)}</span>
      {speed !== 1 ? <span className={styles.fast}>{speed}×</span> : null}
    </button>
  );
}
