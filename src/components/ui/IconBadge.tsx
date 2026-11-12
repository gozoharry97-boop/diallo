import { Icon, type IconName } from './Icon';
import styles from './ui.module.css';

export type BadgeTone = 'piggy' | 'passport' | 'pot' | 'store' | 'leaf' | 'neutral';

/** Pastille arrondie d'une mécanique de jeu ; chaque mécanique garde sa couleur. */
export function IconBadge({ icon, tone, size = 32 }: { icon: IconName; tone: BadgeTone; size?: number }) {
  const colors = tone === 'neutral'
    ? { background: 'var(--color-action-soft)', color: 'var(--color-ink)' }
    : { background: `var(--badge-${tone}-bg)`, color: `var(--badge-${tone}-ink)` };
  return (
    <span className={styles.badge} style={{ width: size, height: size, ...colors }} aria-hidden="true">
      <Icon name={icon} size={Math.round(size * 0.6)} />
    </span>
  );
}

/** Barre de progression décorative : la valeur doit aussi être donnée en texte à côté. */
export function ProgressBar({ ratio, color, label }: { ratio: number; color: string; label?: string }) {
  const a11y = label ? { role: 'img', 'aria-label': label } : { 'aria-hidden': true as const };
  return (
    <div className={styles.bar} {...a11y}>
      <div className={styles.barFill} style={{ width: `${Math.round(Math.min(1, Math.max(0, ratio)) * 100)}%`, background: color }} />
    </div>
  );
}
