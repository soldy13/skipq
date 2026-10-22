import { useState } from 'react';
import styles from './Styleguide.module.css';
import { Section, Stage, State } from './Specimen';
import { TabBar } from '../../components/TabBar';
import { PushBanner } from '../../components/PushBanner';
import { Toast } from '../../components/Toast';
import { BottomSheet } from '../../components/BottomSheet';
import { DrinkCompare } from '../../components/DrinkCompare';
import { Button } from '../../components/Button';
import { DemoControls } from '../../components/DemoPanel';
import { OverlayHost } from '../../components/Overlay';
import { HomeScreen } from '../home/HomeScreen';
import type { Translator } from '../../i18n/useT';

/** React 18's types predate `inert`; the DOM attribute still works. Keeps the preview out of the tab order. */
const INERT = { inert: '' } as Record<string, string>;

export function ShellSection({ tr }: { tr: Translator }) {
  const [push, setPush] = useState(false);
  const [toast, setToast] = useState(false);
  const [undone, setUndone] = useState(false);
  const [sheet, setSheet] = useState(false);
  const pushText = tr.t('push.ready', { drink: tr.lang === 'en' ? 'flat white' : 'Flat white', n: 14, time: '10:45' });

  return (
    <>
      <Section id="tabbar" name="TabBar" note="Five tabs. Active is Coffee with a tinted pill; labels shrink before they wrap.">
        <State label="Home active">
          <TabBar tr={tr} forceActive="/" />
        </State>
        <State label="Board active">
          <TabBar tr={tr} forceActive="/board" />
        </State>
      </Section>

      <Section id="pushbanner" name="PushBanner" note="In-app, push-style. Tapping opens the pickup screen.">
        <State label="Static">
          <PushBanner inline from={tr.t('push.from')} message={pushText} onOpen={() => undefined} onDismiss={() => undefined} dismissLabel={tr.t('common.close')} />
        </State>
        <Stage label="Live" height={220} expanded={push}>
          <Button variant="secondary" onClick={() => setPush(true)}>
            Ready notification
          </Button>
          {push ? <PushBanner from={tr.t('push.from')} message={pushText} onOpen={() => setPush(false)} onDismiss={() => setPush(false)} dismissLabel={tr.t('common.close')} /> : null}
        </Stage>
      </Section>

      <Section id="toast" name="Toast" note="Espresso, above the tab bar. Undo drains over 5 seconds (real time).">
        <State label="Static — paused countdown">
          <div style={{ display: 'grid', gap: 12 }}>
            <Toast inline paused box={14} message={tr.t('toast.ordered', { n: 14 })} actionLabel={tr.t('common.undo')} onAction={() => undefined} />
            <Toast inline paused message={tr.t('toast.undone')} />
          </div>
        </State>
        <Stage label="Live" height={220} expanded={toast}>
          <Button
            variant="secondary"
            onClick={() => {
              setUndone(false);
              setToast(true);
            }}
          >
            One-tap order
          </Button>
          {undone ? <p className={styles.stageNote}>{tr.t('toast.undone')}</p> : null}
          {toast ? (
            <Toast
              box={14}
              message={tr.t('toast.ordered', { n: 14 })}
              actionLabel={tr.t('common.undo')}
              onAction={() => {
                setToast(false);
                setUndone(true);
              }}
              onDone={() => setToast(false)}
            />
          ) : null}
        </Stage>
      </Section>

      <Section id="bottomsheet" name="BottomSheet" note="Scrim, Esc and the close button dismiss it; focus stays inside and returns to the opener.">
        <Stage label="Live — drink info" expanded={sheet}>
          <Button variant="secondary" onClick={() => setSheet(true)}>
            Open drink info
          </Button>
          <BottomSheet open={sheet} onClose={() => setSheet(false)} title="Flat white" subtitle={tr.t('compare.title')} closeLabel={tr.t('common.close')}>
            <DrinkCompare current="flatwhite" tr={tr} />
          </BottomSheet>
        </Stage>
      </Section>

      <Section id="phoneframe" name="PhoneFrame" note="Desktop: a centred 390 × 844 phone. Below 600 px the app fills the screen.">
        <State label="Home inside the frame, at 60 % (live store)">
          <div className={styles.framePreview} aria-hidden="true" {...INERT}>
            <div className={styles.framePhone}>
              <OverlayHost className={styles.frameApp}>
                <div className={styles.frameScreen}>
                  <HomeScreen />
                </div>
                <TabBar tr={tr} forceActive="/" />
              </OverlayHost>
            </div>
          </div>
        </State>
      </Section>

      <Section id="demopanel" name="DemoPanel" note="Live: these controls drive the same simulated world as the app.">
        <State label="Controls" dark>
          <DemoControls tr={tr} />
        </State>
      </Section>
    </>
  );
}
