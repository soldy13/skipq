import type { ReactNode, SVGProps } from 'react';

/** 24 px grid, 1.75 stroke, round caps and joins (canvas board 02). Decorative by default. */
export interface IconProps extends Omit<SVGProps<SVGSVGElement>, 'children'> {
  size?: number;
  /** Gives the icon a role and accessible name; omit when a visible label is next to it. */
  title?: string;
}

function makeIcon(name: string, paths: ReactNode) {
  function Icon({ size = 24, title, ...rest }: IconProps) {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.75}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden={title ? undefined : true}
        role={title ? 'img' : undefined}
        focusable="false"
        {...rest}
      >
        {title ? <title>{title}</title> : null}
        {paths}
      </svg>
    );
  }
  Icon.displayName = `Icon${name}`;
  return Icon;
}

export const IconHome = makeIcon(
  'Home',
  <>
    <path d="M4 10.5 12 4l8 6.5" />
    <path d="M6 9v10a1 1 0 0 0 1 1h3.5v-5.5h3V20H17a1 1 0 0 0 1-1V9" />
  </>,
);

/** Plans: a repeating weekly card. */
export const IconPlans = makeIcon(
  'Plans',
  <>
    <rect x="4" y="5" width="16" height="15" rx="2.5" />
    <path d="M4 9.5h16M8.5 3v4M15.5 3v4" />
    <path d="M9 14.5l2 2 4-4" />
  </>,
);

export const IconGift = makeIcon(
  'Gift',
  <>
    <rect x="4" y="9" width="16" height="11" rx="2" />
    <path d="M3 9h18M12 9v11" />
    <path d="M12 9c-1.5-3.5-5.5-4.5-6-2.5S8.5 9 12 9Zm0 0c1.5-3.5 5.5-4.5 6-2.5S15.5 9 12 9Z" />
  </>,
);

/** Board: podium. */
export const IconBoard = makeIcon(
  'Board',
  <>
    <path d="M9 20V9.5h6V20" />
    <path d="M3.5 20v-6H9M15 12.5h5.5V20" />
    <path d="M2.5 20h19" />
    <path d="m12 3.5.9 1.8 2 .3-1.45 1.4.35 2-1.8-.95-1.8.95.35-2L9.1 5.6l2-.3Z" />
  </>,
);

export const IconMe = makeIcon(
  'Me',
  <>
    <circle cx="12" cy="8.5" r="3.75" />
    <path d="M4.5 20c.9-3.6 3.9-5.75 7.5-5.75S18.6 16.4 19.5 20" />
  </>,
);

export const IconInfo = makeIcon(
  'Info',
  <>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M12 11v5.5" />
    <path d="M12 7.75v.01" strokeWidth={2.4} />
  </>,
);

export const IconCheck = makeIcon('Check', <path d="m5 12.5 4.5 4.5L19 7.5" />);

export const IconClose = makeIcon('Close', <path d="M6 6l12 12M18 6 6 18" />);

export const IconChevronRight = makeIcon('ChevronRight', <path d="m9.5 6 6 6-6 6" />);

export const IconClock = makeIcon(
  'Clock',
  <>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M12 7.5V12l3 2" />
  </>,
);

/** Brewing: cup with steam. */
export const IconBrewing = makeIcon(
  'Brewing',
  <>
    <path d="M5 10.5h11v4.5a4.5 4.5 0 0 1-4.5 4.5h-2A4.5 4.5 0 0 1 5 15v-4.5Z" />
    <path d="M16 12h1.25a2.25 2.25 0 0 1 0 4.5H16" />
    <path d="M8.5 3.5c-.8.9-.8 1.9 0 2.75M12 3.5c-.8.9-.8 1.9 0 2.75" />
  </>,
);

export const IconCup = makeIcon(
  'Cup',
  <>
    <path d="M5 8.5h11V15a4.5 4.5 0 0 1-4.5 4.5h-2A4.5 4.5 0 0 1 5 15V8.5Z" />
    <path d="M16 10h1.25a2.25 2.25 0 0 1 0 4.5H16" />
    <path d="M8 5.5h5" />
  </>,
);

/** Ready: box with a cup inside, door open. */
export const IconReady = makeIcon(
  'Ready',
  <>
    <circle cx="12" cy="12" r="8.5" />
    <path d="m8 12.25 2.75 2.75L16 9.5" />
  </>,
);

/** Picked up: an emptied box. */
export const IconPickedUp = makeIcon(
  'PickedUp',
  <>
    <rect x="4" y="4" width="16" height="16" rx="2.5" />
    <path d="m8.5 12.25 2.5 2.5 4.5-5" />
  </>,
);

export const IconExpired = makeIcon(
  'Expired',
  <>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M12 7.5v5" />
    <path d="M12 16.25v.01" strokeWidth={2.4} />
  </>,
);

/** A locker box with its handle: the product's own object. */
export const IconBox = makeIcon(
  'Box',
  <>
    <rect x="4" y="4" width="16" height="16" rx="2.5" />
    <path d="M15.5 10.5v3" />
  </>,
);

export const IconUnlock = makeIcon(
  'Unlock',
  <>
    <rect x="5" y="10.5" width="14" height="9.5" rx="2" />
    <path d="M8.5 10.5V7.5a3.5 3.5 0 0 1 6.8-1.2" />
    <path d="M12 14.25v2" />
  </>,
);

export const IconLock = makeIcon(
  'Lock',
  <>
    <rect x="5" y="10.5" width="14" height="9.5" rx="2" />
    <path d="M8.5 10.5V7.5a3.5 3.5 0 0 1 7 0v3" />
  </>,
);

export const IconCopy = makeIcon(
  'Copy',
  <>
    <rect x="8.5" y="8.5" width="11" height="11" rx="2" />
    <path d="M15.5 8.5V6a1.5 1.5 0 0 0-1.5-1.5H6A1.5 1.5 0 0 0 4.5 6v8A1.5 1.5 0 0 0 6 15.5h2.5" />
  </>,
);

export const IconShare = makeIcon(
  'Share',
  <>
    <path d="M12 14.5V3.5M8 7.5l4-4 4 4" />
    <path d="M7 11H6a1.5 1.5 0 0 0-1.5 1.5v6A1.5 1.5 0 0 0 6 20h12a1.5 1.5 0 0 0 1.5-1.5v-6A1.5 1.5 0 0 0 18 11h-1" />
  </>,
);

export const IconReturn = makeIcon(
  'Return',
  <>
    <path d="M9 14 4.5 9.5 9 5" />
    <path d="M4.5 9.5H14a5.5 5.5 0 0 1 0 11h-3" />
  </>,
);

export const IconHourglass = makeIcon(
  'Hourglass',
  <>
    <path d="M7 3.5h10M7 20.5h10" />
    <path d="M8 3.5c0 4 8 5 8 8.5s-8 4.5-8 8.5M16 3.5c0 4-8 5-8 8.5s8 4.5 8 8.5" />
  </>,
);

export const IconHeart = makeIcon(
  'Heart',
  <path d="M12 19.5s-7.5-4.4-7.5-9.75A4.25 4.25 0 0 1 12 7.1a4.25 4.25 0 0 1 7.5 2.65C19.5 15.1 12 19.5 12 19.5Z" />,
);

export const IconBolt = makeIcon('Bolt', <path d="M13 3.5 5.5 13.5H12l-1 7 7.5-10H12l1-7Z" />);

export const IconFlame = makeIcon(
  'Flame',
  <path d="M12 20.5a6 6 0 0 0 6-6c0-4.5-4-6-4.5-10.5C10.5 6 9.5 8.5 10 11c-1.5-.5-2.5-2-2.5-3C6.5 9.5 6 11.75 6 14.5a6 6 0 0 0 6 6Z" />,
);

export const IconBean = makeIcon(
  'Bean',
  <>
    <ellipse cx="12" cy="12" rx="5.75" ry="8" transform="rotate(35 12 12)" />
    <path d="M8.5 17.5c2-2.5 1-5 3.5-6.5s2.5-4 3.5-5.5" />
  </>,
);

export const IconMilk = makeIcon(
  'Milk',
  <>
    <path d="M8.5 3.5h7M9 3.5v3L7 10v9.5a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V10l-2-3.5v-3" />
    <path d="M7 13h10" />
  </>,
);

export const IconMinus = makeIcon('Minus', <path d="M5.5 12h13" />);
export const IconPlus = makeIcon('Plus', <path d="M12 5.5v13M5.5 12h13" />);

export const IconSpark = makeIcon(
  'Spark',
  <path d="M12 3.5v4M12 16.5v4M3.5 12h4M16.5 12h4M6 6l2.5 2.5M15.5 15.5 18 18M18 6l-2.5 2.5M8.5 15.5 6 18" />,
);
