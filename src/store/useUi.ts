import { create } from 'zustand';

export interface ToastState {
  id: number;
  message: string;
  /** Shows the box plate beside the message. */
  box?: number;
  /** An undo-style action, offered for 5 seconds (undo a one-tap order, restore a cancelled plan). */
  action?: { label: string; run: () => void };
}

interface UiState {
  toast: ToastState | null;
  /** Home's "Pickup:" choice for one-tap orders; null = Now. Resets to Now after each order. */
  pickup: number | null;
  /** Height of a docked bottom action (order CTA, unlock), so the demo pill floats above it. */
  dock: number;
  setDock: (px: number) => void;
  showToast: (toast: Omit<ToastState, 'id'>) => void;
  clearToast: (id: number) => void;
  setPickup: (start: number | null) => void;
}

let nextToastId = 1;

/** Transient UI state: never persisted, never part of the simulated world. */
export const useUi = create<UiState>()((set) => ({
  toast: null,
  pickup: null,
  dock: 0,
  setDock: (dock) => set({ dock }),
  showToast: (toast) => {
    nextToastId += 1;
    set({ toast: { ...toast, id: nextToastId } });
  },
  clearToast: (id) => set((s) => (s.toast?.id === id ? { toast: null } : s)),
  setPickup: (pickup) => set({ pickup }),
}));
