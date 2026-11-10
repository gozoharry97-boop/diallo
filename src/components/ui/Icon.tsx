const PATHS = {
  calendar: <><rect x="3.5" y="5" width="17" height="15" rx="2.5" /><path d="M3.5 10h17M8 3v4M16 3v4" /></>,
  cart: <><path d="M3 4h2.5l2.2 11h10.6l2-8H7" /><circle cx="9.5" cy="19" r="1.4" /><circle cx="17" cy="19" r="1.4" /></>,
  pantry: <><path d="M7 4h10v3H7zM6 7h12v12.5a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 6 19.5z" /><path d="M9 12h6" /></>,
  settings: <><path d="M4 7h10M18 7h2M4 17h4M12 17h8" /><circle cx="16" cy="7" r="2" /><circle cx="10" cy="17" r="2" /></>,
  check: <path d="M4 12.5l5 5L20 6.5" />,
  back: <path d="M15 6l-6 6 6 6" />,
  chevronDown: <path d="M6 9l6 6 6-6" />,
  chevronRight: <path d="M9 6l6 6-6 6" />,
  close: <path d="M6 6l12 12M18 6L6 18" />,
  share: <path d="M12 15V3M7 8l5-5 5 5M5 13v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6" />,
  alert: <><circle cx="12" cy="12" r="9" /><path d="M12 7.5v5.5M12 16.5v.5" /></>,
  store: <><path d="M4 9.5l1.5-5h13l1.5 5" /><path d="M4 9.5h16v1a2.7 2.7 0 0 1-5.3 0 2.7 2.7 0 0 1-5.4 0 2.7 2.7 0 0 1-5.3 0z" /><path d="M5.5 12.5V20h13v-7.5M10 20v-4.5h4V20" /></>,
  globe: <><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3c-3 3-3 15 0 18M12 3c3 3 3 15 0 18" /></>,
  leaf: <><path d="M5 19c0-8 5-13.5 14-14 0 9-5 14-13 14z" /><path d="M5 19l7.5-7.5" /></>,
  piggy: <><path d="M4.5 12a6.5 5.5 0 0 1 6.5-5.5h3a6.5 5.5 0 0 1 5.8 3H21v4h-1.6a6.5 5.5 0 0 1-3.4 3.4V19h-2.6v-1.5h-3V19H7.8v-2.3A6 5.5 0 0 1 4.5 12z" /><path d="M10.5 9.5h3.5" /></>,
  passport: <><rect x="5" y="3" width="14" height="18" rx="2" /><circle cx="12" cy="10.5" r="3.6" /><path d="M8.4 10.5h7.2M12 6.9c-1.5 1.2-1.5 6 0 7.2M12 6.9c1.5 1.2 1.5 6 0 7.2M9 17.5h6" /></>,
  pot: <><path d="M4.5 11h15v4a5 5 0 0 1-5 5h-5a5 5 0 0 1-5-5z" /><path d="M2.5 11h19M9.5 7.5c0-1.3 1-1.3 1-2.6M13.5 7.5c0-1.3 1-1.3 1-2.6" /></>,
  cooker: <><path d="M5 11h14v4a5 5 0 0 1-5 5h-4a5 5 0 0 1-5-5z" /><path d="M3 11h18M12 8V5M9 5h6" /></>,
  link: <><path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1" /><path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1" /></>,
} as const;

export type IconName = keyof typeof PATHS | 'play';

/** Icônes au trait (1,8 px), décoratives par défaut : le texte voisin porte le sens. */
export function Icon({ name, size = 20, label, strokeWidth = 1.8 }: { name: IconName; size?: number; label?: string; strokeWidth?: number }) {
  const a11y = label ? { role: 'img', 'aria-label': label } : { 'aria-hidden': true as const };
  if (name === 'play') {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" {...a11y}>
        <path d="M8 5.5v13l10.5-6.5z" fill="currentColor" />
      </svg>
    );
  }
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" {...a11y}>
      {PATHS[name]}
    </svg>
  );
}
