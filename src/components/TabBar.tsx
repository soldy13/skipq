import { NavLink } from 'react-router-dom';
import type { ComponentType } from 'react';
import styles from './TabBar.module.css';
import { IconBoard, IconGift, IconHome, IconMe, IconPlans, type IconProps } from './icons';
import type { Translator } from '../i18n/useT';
import type { MessageKey } from '../i18n/translate';

interface Tab {
  to: string;
  label: MessageKey;
  Icon: ComponentType<IconProps>;
}

export const TABS: readonly Tab[] = [
  { to: '/', label: 'tab.home', Icon: IconHome },
  { to: '/plans', label: 'tab.plans', Icon: IconPlans },
  { to: '/gift', label: 'tab.gift', Icon: IconGift },
  { to: '/board', label: 'tab.board', Icon: IconBoard },
  { to: '/me', label: 'tab.me', Icon: IconMe },
];

export interface TabBarProps {
  tr: Translator;
  /** Style guide only: show this tab as active regardless of the route. */
  forceActive?: string;
}

export function TabBar({ tr, forceActive }: TabBarProps) {
  return (
    <nav className={styles.bar} aria-label={tr.t('tab.label')}>
      <ul className={styles.list}>
        {TABS.map(({ to, label, Icon }) => (
          <li key={to}>
            <NavLink to={to} end={to === '/'} className={({ isActive }) => [styles.tab, (forceActive === undefined ? isActive : forceActive === to) && styles.active].filter(Boolean).join(' ')}>
              <span className={styles.icon}>
                <Icon />
              </span>
              <span className={styles.label}>{tr.t(label)}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
