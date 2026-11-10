import type { Mood } from '@/domain/game';
import styles from './Mascot.module.css';

const MOUTH: Record<Mood, string> = {
  content: 'M39 66 Q48 73 57 66',
  concentre: 'M41 67 L55 67',
  fier: 'M37 64 Q48 78 59 64',
  inquiet: 'M39 70 Q43.5 66 48 70 Q52.5 74 57 70',
};
const BROWS: Partial<Record<Mood, string>> = {
  fier: 'M32 43 Q37 39 42 42 M54 42 Q59 39 64 43',
  inquiet: 'M32 42 L42 45 M54 45 L64 42',
};
const LABEL: Record<Mood, string> = { content: 'contente', concentre: 'concentrée', fier: 'fière', inquiet: 'inquiète' };

/** Diallo, la petite marmite. Le texte de son humeur est lu par les lecteurs d'écran. */
export function Mascot({ mood = 'content', size = 92, onDark = false, steaming = false }: { mood?: Mood; size?: number; onDark?: boolean; steaming?: boolean }) {
  const lid = onDark ? '#ffffff' : '#171a33';
  return (
    <svg width={size} height={size} viewBox="0 0 96 96" role="img" aria-label={`Diallo, la petite marmite, ${LABEL[mood]}`} className={styles.mascot}>
      <path
        className={steaming ? styles.steam : undefined}
        d="M38 20c-4-5 4-8 0-13M48 18c-4-5 4-8 0-13M58 20c-4-5 4-8 0-13"
        fill="none"
        stroke="#9ea3b8"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <rect x="9" y="50" width="14" height="9" rx="4.5" fill="var(--color-brand)" />
      <rect x="73" y="50" width="14" height="9" rx="4.5" fill="var(--color-brand)" />
      <rect x="19" y="36" width="58" height="46" rx="20" fill="var(--color-brand)" />
      <rect x="44" y="23" width="8" height="7" rx="3" fill={lid} />
      <ellipse cx="48" cy="34" rx="32" ry="7" fill={lid} />
      <circle cx="38" cy="54" r="7.5" fill="#fff" />
      <circle cx="58" cy="54" r="7.5" fill="#fff" />
      <circle cx="39" cy="55" r="3.6" fill="#171a33" />
      <circle cx="59" cy="55" r="3.6" fill="#171a33" />
      <circle cx="29" cy="66" r="4" fill="var(--color-budget)" />
      <circle cx="67" cy="66" r="4" fill="var(--color-budget)" />
      {BROWS[mood] && <path d={BROWS[mood]} fill="none" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" />}
      <path d={MOUTH[mood]} fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** Diallo qui parle : mascotte + bulle. Le contenu est annoncé quand il change. */
export function DialloSays({ mood, size = 76, title, children }: { mood?: Mood; size?: number; title?: React.ReactNode; children: React.ReactNode }) {
  return (
    <section className={styles.says} aria-label="Message de Diallo">
      <Mascot mood={mood} size={size} />
      <div className={styles.bubble} aria-live="polite">
        {title ?? <p className={styles.name}>Diallo</p>}
        <div className={styles.text}>{children}</div>
      </div>
    </section>
  );
}
