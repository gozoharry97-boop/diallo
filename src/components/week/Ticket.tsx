import { DAYS } from '@/domain/data/catalog';
import { STORES_BY_ID } from '@/domain/data/catalog';
import { eur } from '@/domain/format';
import type { Profile, Recipe } from '@/domain/types';
import type { WeekView } from '@/state/useWeek';
import { ProgressBar } from '../ui/IconBadge';
import styles from './week.module.css';

/** Récapitulatif de la semaine sous forme de ticket de caisse. */
export function Ticket({ profile, view, livePrices }: { profile: Profile; view: WeekView; livePrices: boolean }) {
  const storeNames = [...new Set(view.cost.lines.filter((l) => l.packs > 0).map((l) => STORES_BY_ID[l.storeId].name))];
  const ratio = profile.budget > 0 ? view.cost.total / profile.budget : 1;
  return (
    <section className={styles.ticket} aria-label="Total de la semaine">
      <div className={styles.ticketHead}>
        <p className={styles.ticketStores}>{(storeNames.length ? storeNames : [STORES_BY_ID[profile.store].name]).join(' + ')}</p>
        <p className="muted">
          {view.week.length} dîners pour {profile.people} {profile.people > 1 ? 'personnes' : 'personne'}
        </p>
      </div>
      <hr className={styles.dash} />
      <dl>
        {view.week.map((recipe: Recipe, day) => (
          <div className={styles.line} key={`${recipe.id}-${day}`}>
            <dt>{DAYS[day].slice(0, 3).toUpperCase()} {recipe.name}</dt>
            <dd>{eur(view.dinnerValues[day])}</dd>
          </div>
        ))}
        {view.openedPacks > 0.05 && (
          <div className={styles.line}><dt>Paquets entamés (restes)</dt><dd>{eur(view.openedPacks)}</dd></div>
        )}
        {view.cost.pantrySaved > 0.05 && (
          <div className={styles.line}><dt>Déjà dans ton placard</dt><dd>−{eur(view.cost.pantrySaved)}</dd></div>
        )}
      </dl>
      <hr className={styles.dash} />
      <dl>
        <div className={`${styles.line} ${styles.total}`}><dt>À PAYER</dt><dd>{eur(view.cost.total)}</dd></div>
        <div className={styles.line}><dt>Budget</dt><dd>{eur(profile.budget)}</dd></div>
        <div className={`${styles.line} ${view.overBudget ? styles.bad : styles.good}`}>
          <dt>{view.overBudget ? 'Dépassement' : 'Marge'}</dt>
          <dd>{eur(Math.abs(view.margin))}</dd>
        </div>
      </dl>
      <div className={styles.ticketBar}>
        <ProgressBar ratio={ratio} color={view.overBudget ? 'var(--color-danger)' : 'var(--color-budget)'} />
      </div>
      <p className={styles.ticketFoot}>
        {Math.round(Math.min(ratio, 9.99) * 100)} % du budget.{' '}
        {livePrices ? 'Prix relevés dans tes magasins, à ±10 %.' : 'Prix estimés, à ±10 %.'}
      </p>
    </section>
  );
}
