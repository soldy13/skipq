import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import styles from './Styleguide.module.css';
import { Foundations } from './Foundations';
import { ActionsSection } from './ActionsSection';
import { StatusSection } from './StatusSection';
import { ShellSection } from './ShellSection';
import { CatalogSection } from './CatalogSection';
import { Segmented } from '../../components/Segmented';
import { useT } from '../../i18n/useT';
import { useStore } from '../../store/useStore';
import type { LangPref } from '../../domain/types';

const NAV: readonly { group: string; items: readonly [string, string][] }[] = [
  { group: 'Foundations', items: [['color', 'Colour'], ['type', 'Type'], ['icons', 'Icons']] },
  {
    group: 'Actions',
    items: [['button', 'Button'], ['chip', 'Chip'], ['slotchip', 'SlotChip'], ['slotgrid', 'SlotGrid'], ['segmented', 'Segmented'], ['switch', 'Switch'], ['codeinput', 'CodeInput']],
  },
  { group: 'Status', items: [['statuspill', 'StatusPill'], ['dailylimit', 'DailyLimit'], ['boxmeter', 'BoxMeter'], ['lockergrid', 'LockerGrid']] },
  {
    group: 'Shell',
    items: [['tabbar', 'TabBar'], ['pushbanner', 'PushBanner'], ['toast', 'Toast'], ['bottomsheet', 'BottomSheet'], ['phoneframe', 'PhoneFrame'], ['demopanel', 'DemoPanel']],
  },
  { group: 'Ordering', items: [['usualcard', 'UsualCard'], ['drinkrow', 'DrinkRow'], ['drinkcompare', 'DrinkCompare']] },
  { group: 'Money', items: [['plancard', 'PlanCard'], ['addonrow', 'AddOnRow'], ['packtile', 'PackTile']] },
  { group: 'Social', items: [['giftcode', 'GiftCode'], ['boardrow', 'BoardRow'], ['stattile', 'StatTile'], ['comingsoon', 'ComingSoonTile']] },
];

/** Hidden route: every component in every state, on the live store. Doubles as a visual test against the canvas. */
export default function Styleguide() {
  const tr = useT();
  const language = useStore((s) => s.profile.language);
  const setLanguage = useStore((s) => s.setLanguage);

  useEffect(() => {
    document.documentElement.lang = tr.lang;
    document.title = 'SkipQ · Components';
    return () => {
      document.title = 'SkipQ';
    };
  }, [tr.lang]);

  // Hash routing owns the URL, so in-page links scroll by id instead of navigating.
  function jump(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  return (
    <div className={styles.page}>
      <header className={styles.top}>
        <div className={styles.brand}>
          <p className={styles.wordmark}>SkipQ</p>
          <h1 className={styles.h1}>Components</h1>
          <p className={styles.lede}>Every component from the brief (§10) in its states, running on the same simulated store as the app. Switch the language to check Czech lengths.</p>
        </div>
        <div className={styles.topActions}>
          <div className={styles.langSwitch}>
            <Segmented<LangPref>
              label="Language"
              value={language}
              onChange={setLanguage}
              options={[
                { value: 'auto', label: 'Auto' },
                { value: 'en', label: 'EN' },
                { value: 'cs', label: 'CS' },
              ]}
            />
          </div>
          <Link to="/" className={styles.back}>
            Open the app
          </Link>
        </div>
      </header>

      <div className={styles.layout}>
        <nav className={styles.nav} aria-label="Components">
          {NAV.map((g) => (
            <div key={g.group} className={styles.navGroup}>
              <p className={styles.navTitle}>{g.group}</p>
              <ul>
                {g.items.map(([id, name]) => (
                  <li key={id}>
                    <button type="button" className={styles.navLink} onClick={() => jump(id)}>
                      {name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
        <main className={styles.main}>
          <Foundations />
          <ActionsSection tr={tr} />
          <StatusSection tr={tr} />
          <ShellSection tr={tr} />
          <CatalogSection tr={tr} />
        </main>
      </div>
    </div>
  );
}
