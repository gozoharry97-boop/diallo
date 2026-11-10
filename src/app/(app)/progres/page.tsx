'use client';

import { CUISINES } from '@/domain/data/catalog';
import { formatDayMonth } from '@/domain/dates';
import { eur } from '@/domain/format';
import { bestStreak, budgetStreak, passportStamps, piggyBank, weekSavings } from '@/domain/game';
import { BackLink, Page, PageHeader, layout } from '@/components/layout/Page';
import { Mascot } from '@/components/Mascot';
import { IconBadge } from '@/components/ui/IconBadge';
import { useAppState } from '@/state/store';
import styles from './progres.module.css';

const COLORS = ['var(--color-brand)', '#2f4ba8', 'var(--color-success-strong)', '#7a4f00'];

/** E19 — Mes progrès : cagnotte, passeport des cuisines, séries et défis. Aucun classement. */
export default function ProgressPage() {
  const { state } = useAppState();
  const stamps = passportStamps(state.history);
  const weeks = [...state.history].reverse();

  return (
    <Page narrow>
      <BackLink href="/semaine">Ma semaine</BackLink>
      <div className={layout.between} style={{ alignItems: 'center' }}>
        <PageHeader title="Mes progrès" subtitle={weeks.length ? `Depuis le ${formatDayMonth(state.history[0].weekStart)}` : 'Ta première semaine est en cours'} />
        <Mascot size={72} />
      </div>

      <section className={`${layout.card} ${styles.block}`} aria-labelledby="cagnotte">
        <div className={styles.head}>
          <IconBadge icon="piggy" tone="piggy" size={40} />
          <div>
            <h2 id="cagnotte" className={styles.label}>Cagnotte</h2>
            <p className={styles.big}>{eur(piggyBank(state.history))}</p>
          </div>
        </div>
        <p className={layout.muted}>Marges sous ton budget et produits déjà au placard.</p>
        {weeks.length > 0 ? (
          <table className={styles.table}>
            <caption className="visually-hidden">Économies par semaine</caption>
            <thead className="visually-hidden"><tr><th scope="col">Semaine</th><th scope="col">Économie</th></tr></thead>
            <tbody>
              {weeks.map((w) => (
                <tr key={w.weekStart}><th scope="row">Semaine du {formatDayMonth(w.weekStart)}</th><td className="mono">{eur(weekSavings(w))}</td></tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className={`${layout.muted} mt-3`}>Ta cagnotte se remplit au premier bilan de semaine.</p>
        )}
      </section>

      <section className={`${layout.card} ${styles.block}`} aria-labelledby="passeport">
        <div className={styles.head}>
          <IconBadge icon="passport" tone="passport" size={40} />
          <div>
            <h2 id="passeport" className={styles.label}>Passeport des cuisines</h2>
            <p className={styles.big}>{stamps.size} / {CUISINES.length}</p>
          </div>
        </div>
        <ul role="list" className={styles.stamps}>
          {CUISINES.map((c, i) => {
            const got = stamps.has(c.id);
            return (
              <li key={c.id} className={got ? styles.stamp : styles.stampEmpty} style={got ? { color: COLORS[i % 4], transform: `rotate(${(i % 5) * 3 - 6}deg)` } : undefined}>
                <span className={styles.stampName}>{c.name}</span>
                <span className={styles.stampState}>{got ? 'Goûtée' : 'À découvrir'}</span>
              </li>
            );
          })}
        </ul>
      </section>

      <section className={styles.tiles} aria-label="Séries et défis">
        <div className={layout.card}>
          <IconBadge icon="check" tone="pot" />
          <p className={styles.tileValue}>{budgetStreak(state.history)}</p>
          <p className={layout.muted}>semaines d’affilée dans le budget (record : {bestStreak(state.history)})</p>
        </div>
        <div className={layout.cardDark}>
          <IconBadge icon="leaf" tone="leaf" />
          <p className={styles.tileValue}>{state.history.filter((w) => w.challengeDone).length}</p>
          <p style={{ color: 'var(--color-on-dark-soft)' }}>défis zéro gaspi réussis</p>
        </div>
      </section>

      <p className={`${layout.muted} ${layout.small}`} style={{ margin: 'var(--space-5) 0 var(--space-10)' }}>
        Tes progrès restent à toi : pas de classement, pas de comparaison avec les autres.
      </p>
    </Page>
  );
}
