import type { ComponentType } from 'react';
import styles from './StatusPill.module.css';
import { IconBrewing, IconClock, IconClose, IconExpired, IconHourglass, IconPickedUp, IconReady, IconReturn, type IconProps } from './icons';
import type { GiftStatus, OrderStatus } from '../domain/types';

export type PillTone = 'scheduled' | 'brewing' | 'ready' | 'done' | 'expired';

const ORDER: Record<OrderStatus, { tone: PillTone; Icon: ComponentType<IconProps> }> = {
  scheduled: { tone: 'scheduled', Icon: IconClock },
  brewing: { tone: 'brewing', Icon: IconBrewing },
  ready: { tone: 'ready', Icon: IconReady },
  pickedUp: { tone: 'done', Icon: IconPickedUp },
  expired: { tone: 'expired', Icon: IconExpired },
  cancelled: { tone: 'done', Icon: IconClose },
};

const GIFT: Record<GiftStatus, { tone: PillTone; Icon: ComponentType<IconProps> }> = {
  pending: { tone: 'scheduled', Icon: IconHourglass },
  redeemed: { tone: 'ready', Icon: IconReady },
  returned: { tone: 'done', Icon: IconReturn },
};

export interface StatusPillProps {
  /** Always icon + word + colour, never colour alone. */
  label: string;
  status: OrderStatus;
  size?: 'sm' | 'md';
}

export function StatusPill({ label, status, size = 'sm' }: StatusPillProps) {
  const { tone, Icon } = ORDER[status];
  return <Pill tone={tone} Icon={Icon} label={label} size={size} />;
}

export function GiftStatusPill({ label, status }: { label: string; status: GiftStatus }) {
  const { tone, Icon } = GIFT[status];
  return <Pill tone={tone} Icon={Icon} label={label} size="sm" />;
}

function Pill({ tone, Icon, label, size }: { tone: PillTone; Icon: ComponentType<IconProps>; label: string; size: 'sm' | 'md' }) {
  return (
    <span className={[styles.pill, styles[tone], styles[size]].filter(Boolean).join(' ')}>
      <Icon size={size === 'md' ? 18 : 16} />
      <span>{label}</span>
    </span>
  );
}
