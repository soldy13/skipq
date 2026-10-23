import { useEffect, useRef, useState, type FormEvent } from 'react';
import styles from '../Screen.module.css';
import o from '../order/OrderScreen.module.css';
import w from './Welcome.module.css';
import { StepHeader } from './StepHeader';
import { nicknameErrorText } from './nicknameText';
import { CTA_DOCK, useDock } from '../useDock';
import { Button } from '../../components/Button';
import { LockerGrid } from '../../components/LockerGrid';
import { RichText } from '../../components/RichText';
import { TextField } from '../../components/TextField';
import { TAKEN_NICKNAMES } from '../../data/leaderboard';
import { validateNickname } from '../../domain/nickname';
import { useBoxUsage } from '../../store/hooks';
import { useT } from '../../i18n/useT';

const FORM_ID = 'nickname-form';
const NO_BOXES: ReadonlySet<number> = new Set();

interface NicknameStepProps {
  value: string;
  onChange: (value: string) => void;
  onNext: (nickname: string) => void;
  focusTitle: boolean;
}

/**
 * Step 1: what SkipQ is (the live machine is the proof), then the nickname. "Available" shows as soon as it's
 * true; problems wait for a blur or Continue, then update as you type.
 */
export function NicknameStep({ value, onChange, onNext, focusTitle }: NicknameStepProps) {
  const tr = useT();
  const usage = useBoxUsage();
  const [checked, setChecked] = useState(false);
  const title = useRef<HTMLHeadingElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const form = useRef<HTMLFormElement>(null);
  useDock(CTA_DOCK);

  useEffect(() => {
    if (focusTitle) title.current?.focus();
  }, [focusTitle]);

  const check = validateNickname(value, TAKEN_NICKNAMES);
  const showProblem = checked && !check.ok;

  function submit(e: FormEvent) {
    e.preventDefault();
    if (check.ok) onNext(check.nickname);
    else {
      setChecked(true);
      input.current?.focus({ preventScroll: true });
      // Bring the message and its one-tap fix out from under the docked Continue.
      requestAnimationFrame(() => form.current?.scrollIntoView({ block: 'nearest' }));
    }
  }

  return (
    <div className={`${styles.screen} ${o.screen} ${w.step}`}>
      <StepHeader n={1} />
      <header className={styles.header}>
        <h1 ref={title} tabIndex={-1} className={`${styles.display} ${w.title}`}>
          {tr.t('welcome.title')}
        </h1>
        <p className={w.lead}>{tr.t('welcome.lead')}</p>
      </header>

      <div className={w.machine}>
        <div className={w.machineGrid} aria-hidden="true">
          <LockerGrid total={usage.total} inUse={usage.inUse} mine={NO_BOXES} tr={tr} showLegend={false} />
        </div>
        <p className={w.machineNote}>
          <RichText text={tr.t('welcome.machine', { total: usage.total })} nodes={{ free: <span className="sq-mono">{usage.free}</span> }} />
        </p>
      </div>

      <form ref={form} id={FORM_ID} className={w.form} onSubmit={submit} noValidate>
        <TextField
          ref={input}
          label={tr.t('nick.label')}
          value={value}
          onChange={(v) => onChange(v.toLowerCase())}
          onBlur={() => value.length > 0 && setChecked(true)}
          hint={tr.t('nick.hint')}
          error={showProblem && !check.ok ? nicknameErrorText(check.error, value, tr) : undefined}
          success={check.ok ? tr.t('nick.free', { name: check.nickname }) : undefined}
          action={
            showProblem && !check.ok && check.suggestion ? (
              <Button variant="tertiary" onClick={() => onChange(check.suggestion ?? value)}>
                {tr.t('nick.use', { name: check.suggestion })}
              </Button>
            ) : null
          }
          name="nickname"
          autoComplete="nickname"
          autoCapitalize="none"
          autoCorrect="off"
          spellCheck={false}
          enterKeyHint="next"
        />
      </form>

      <div className={o.dock}>
        <Button block type="submit" form={FORM_ID}>
          {tr.t('welcome.continue')}
        </Button>
      </div>
    </div>
  );
}
