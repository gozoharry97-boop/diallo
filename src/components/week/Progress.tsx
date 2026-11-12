import Link from 'next/link';
import { CUISINES, DAYS } from '@/domain/data/catalog';
import { INGREDIENTS } from '@/domain/data/ingredients';
import { eur, shortName } from '@/domain/format';
import type { Challenge } from '@/domain/game';
import { Icon } from '../ui/Icon';
import styles from './week.module.css';

/** Mes progrès en trois tuiles colorées : cagnotte, passeport, dîners cuisinés. */
export function ProgressTiles({ savings, stamps, cooked, dinners }: { savings: number; stamps: number; cooked: number; dinners: number }) {
  return (
    <section aria-labelledby="prog-titre">
      <div className={styles.sectionHead}>
        <h2 id="prog-titre" className={styles.sectionTitle}>Mes progrès</h2>
        <Link href="/progres" className={styles.seeAll}>Tout voir<Icon name="chevronRight" size={16} strokeWidth={2.2} /></Link>
      </div>
      <div className={styles.tiles}>
        <div className={styles.tile} data-tone="piggy">
          <p className={styles.tileLabel}>Cagnotte</p>
          <p className={styles.tileValue}>{eur(savings)}</p>
          <p className={styles.tileSub}>économisés</p>
        </div>
        <div className={styles.tile} data-tone="passport">
          <p className={styles.tileLabel}>Passeport</p>
          <p className={styles.tileValue}>{stamps} / {CUISINES.length}</p>
          <p className={styles.tileSub}>cuisines</p>
        </div>
        <div className={styles.tile} data-tone="pot">
          <p className={styles.tileLabel}>Cuisinés</p>
          <p className={styles.tileValue}>{cooked} / {dinners}</p>
          <p className={styles.tileSub}>dîners</p>
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
    <section className={styles.challenge} aria-labelledby="defi-titre">
      <div className={styles.challengeHead}>
        <h2 id="defi-titre" className={styles.challengeTitle}>Défi zéro gaspi</h2>
        <span className={styles.challengeReward}>+1 tampon</span>
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
