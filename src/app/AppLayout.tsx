import { useEffect, useState, type CSSProperties } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import styles from './AppLayout.module.css';
import { PhoneFrame } from './PhoneFrame';
import { DEMO_HIDDEN } from './demoFlag';
import { OverlayHost } from '../components/Overlay';
import { TabBar } from '../components/TabBar';
import { DemoPanel, DemoPill } from '../components/DemoPanel';
import { useStore } from '../store/useStore';
import { useUi } from '../store/useUi';
import { Notifications } from './Notifications';
import { useT } from '../i18n/useT';

/** A laptop lid or a throttled background tab must not fast-forward the demo by hours. */
const MAX_TICK_MS = 2000;

/** Advances the simulated clock once per real second. The only place real time enters the app. */
function useSimulationLoop() {
  const tick = useStore((s) => s.tick);
  useEffect(() => {
    let last = performance.now();
    const id = window.setInterval(() => {
      const t = performance.now();
      tick(Math.min(t - last, MAX_TICK_MS));
      last = t;
    }, 1000);
    return () => window.clearInterval(id);
  }, [tick]);
}

export function AppLayout() {
  const tr = useT();
  const location = useLocation();
  const onboarded = useStore((s) => s.profile.onboarded);
  const [demoOpen, setDemoOpen] = useState(false);
  const dock = useUi((s) => s.dock);
  useSimulationLoop();

  useEffect(() => {
    document.documentElement.lang = tr.lang;
  }, [tr.lang]);

  const onWelcome = location.pathname === '/welcome';
  if (!onboarded && !onWelcome) return <Navigate to="/welcome" replace />;
  // Switching persona back from "New user" must not strand the tester on onboarding.
  if (onboarded && onWelcome) return <Navigate to="/" replace />;

  return (
    <PhoneFrame tr={tr}>
      <OverlayHost className={styles.app} style={{ '--sq-dock': `${dock}px` } as CSSProperties}>
        <main className={styles.screen} id="main">
          <Outlet />
        </main>
        {onWelcome ? null : <TabBar tr={tr} />}
        {DEMO_HIDDEN ? null : <DemoPill tr={tr} onOpen={() => setDemoOpen(true)} />}
        <DemoPanel open={demoOpen} onClose={() => setDemoOpen(false)} tr={tr} />
        <Notifications />
      </OverlayHost>
    </PhoneFrame>
  );
}
