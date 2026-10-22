export interface MachineConfig {
  id: string;
  name: string;
  boxes: number;
  /** Wall-clock "HH:MM". */
  open: string;
  close: string;
  /** ISO weekdays the machine runs, 1 = Monday. */
  days: readonly number[];
  brewMinutes: number;
  slotMinutes: number;
  maxExtensions: number;
  /** How many upcoming slots the grid shows next to Now. */
  gridSlots: number;
  /** "3 left" (amber) at or below this many free boxes. */
  fewThreshold: number;
}

/** Brief §6.2. Opening hours and max extensions are assumptions (§12.1–2). */
export const RAJSKA: MachineConfig = {
  id: 'vse-rb-1',
  name: 'VŠE · Rajská budova',
  boxes: 30,
  open: '07:30',
  close: '19:00',
  days: [1, 2, 3, 4, 5],
  brewMinutes: 2,
  slotMinutes: 15,
  maxExtensions: 1,
  gridSlots: 8,
  fewThreshold: 3,
};

export const MACHINES: readonly MachineConfig[] = [RAJSKA];

export function machineById(id: string): MachineConfig {
  return MACHINES.find((m) => m.id === id) ?? RAJSKA;
}
