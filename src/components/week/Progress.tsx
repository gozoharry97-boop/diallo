import Link from 'next/link';
import { INGREDIENTS } from '@/domain/data/ingredients';
import { DAYS } from '@/domain/data/catalog';
import { eur, shortName } from '@/domain/format';
import type { Challenge } from '@/domain/game';
import { CUISINES } from '@/domain/data/catalog';
import { IconBadge } from '../ui/IconBadge';
import { layout } from '../layout/Page';
import styles from './week.module.css';

export function ProgressTiles({ savings, stamps, cooked, dinners }: { savings: number; stamps: number; cooked: number; dinners: number }) {
  return (
    <section aria-label="Mes progrès">
      <div className={styles.tiles}>
        <Link href="/progres" className={styles.tile}>
          <IconBadge icon="piggy" tone="piggy" />
          <p className={styles.tileLabel}>Cagnotte</p>
          <p className={styles.tileValue}>{eur(savings)}</p>
          <p className={styles.tileLabel}>économisés</p>
        </Link>
        <Link href="/progres" className={styles.tile}>
          <IconBadge icon="passport" tone="passport" />
          <p className={styles.tileLabel}>Passeport</p>
          <p className={styles.tileValue}>{stamps} / {CUISINES.length}</p>
          <p className={styles.tileLabel}>cuisines goûtées</p>
        </Link>
        <div className={styles.tile}>
          <IconBadge icon="pot" tone="pot" />
          <p className={styles.tileLabel}>Cette semaine</p>
          <p className={styles.tileValue}>{cooked} / {dinners}</p>
          <p className={styles.tileLabel}>dîners cuisinés</p>
        </div>
      </div>
    </section>
  );
}

export function ChallengeCard({ challenge, done }: { challenge: Challenge; done: number }) {
  const name = shortName(INGREDIENTS[challenge.key]).toLowerCase();
  const days = challenge.days.map((d) => DAYS[d].toLowerCase());
  const total = challenge.days.length;
  return (
    <section className={`${layout.cardDark} ${styles.challenge}`} aria-labelledby="defi-titre">
      <div className={layout.between}>
        <h2 id="defi-titre" className={styles.challengeTitle}>
          <IconBadge icon="leaf" tone="leaf" />
          Défi zéro gaspi
        </h2>
        <span style={{ color: 'var(--color-budget)', fontSize: 'var(--text-xs)', fontWeight: 600 }}>+1 tampon</span>
      </div>
      <p className={styles.challengeText}>
        Finis le paquet de {name} : il sert {days.length > 1 ? `${days.slice(0, -1).join(', ')} et ${days.at(-1)}` : days[0]}.
      </p>
      <div className={styles.segments} aria-hidden="true">
        {challenge.days.map((d, i) => (
          <span key={d} className={`${styles.segment} ${i < done ? styles.segmentDone : ''}`} />
        ))}
      </div>
      <p className={styles.challengeCount}>{done === total ? 'Défi réussi !' : `${done} dîner${done > 1 ? 's' : ''} sur ${total}`}</p>
    </section>
  );
}
