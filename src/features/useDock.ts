import { useEffect } from 'react';
import { useUi } from '../store/useUi';
import { DEMO_HIDDEN } from '../app/demoFlag';

/** Extra top padding a docked bar keeps for the demo pill, so the pill never sits on top of content. */
export const DEMO_LANE = DEMO_HIDDEN ? 0 : 44;

/** Height of a docked single-button commit bar (52 px button plus its padding), before the demo lane. */
export const CTA_DOCK = 80;

/**
 * While mounted, tells the shell a bottom action is docked (its full height in px, without the demo lane):
 * toasts float above it and the demo pill moves into the bar's lane.
 */
export function useDock(px: number): void {
  const setDock = useUi((s) => s.setDock);
  useEffect(() => {
    setDock(px > 0 ? px + DEMO_LANE : 0);
    return () => setDock(0);
  }, [px, setDock]);
}
