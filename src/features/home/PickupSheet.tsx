import { BottomSheet } from '../../components/BottomSheet';
import { SlotGrid } from '../../components/SlotGrid';
import { useNow, useSlotGrid } from '../../store/hooks';
import { useT } from '../../i18n/useT';

/** Home's "Pickup:" chip opens this; the choice applies to the one-tap buttons until the next order. */
export function PickupSheet({ open, selected, onSelect, onClose }: { open: boolean; selected: number | null; onSelect: (start: number | null) => void; onClose: () => void }) {
  const tr = useT();
  const now = useNow();
  const grid = useSlotGrid();
  return (
    <BottomSheet open={open} onClose={onClose} title={tr.t('slot.grid')} closeLabel={tr.t('common.close')}>
      <SlotGrid
        grid={grid}
        selected={selected}
        now={now}
        tr={tr}
        hideTitle
        onSelect={(start) => {
          onSelect(start);
          onClose();
        }}
      />
    </BottomSheet>
  );
}
