import { useEffect } from 'react';
import { useUi } from '../store/useUi';

/** While mounted, tells the shell a bottom action is docked so the demo pill and toasts float above it. */
export function useDock(px: number): void {
  const setDock = useUi((s) => s.setDock);
  useEffect(() => {
    setDock(px);
    return () => setDock(0);
  }, [px, setDock]);
}
