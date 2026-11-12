'use client';

import Link from 'next/link';
import { useState } from 'react';
import { DAYS, STORES_BY_ID } from '@/domain/data/catalog';
import { eur } from '@/domain/format';
import type { Profile } from '@/domain/types';
import type { WeekView } from '@/state/useWeek';
import { Icon } from '../ui/Icon';
import { ProgressBar } from '../ui/IconBadge';
import styles from './week.module.css';

/** Total de la semaine face au budget, détail en ticket à déplier, accès à la liste de courses. */
export function BudgetCard({ profile, view, livePrices, toBuy }: { profile: Profile; view: WeekView; livePrices: boolean; toBuy: number }) {
  const [open, setOpen] = useState(false);
  const storeNames = [...new Set(view.cost.lines.filter((l) => l.packs > 0).map((l) => STORES_BY_ID[l.storeId].name))];
  const stores = (storeNames.length ? storeNames : [STORES_BY_ID[profile.store].name]).join(' + ');
  const ratio = profile.budget > 0 ? view.cost.total / profile.budget : 1;

  return (
    <section className={styles.budget} aria-label="Total de la semaine">
      <div className={styles.budgetHead}>
        <div>
          <p className={styles.budgetLabel}>À payer · {stores}</p>
          <p className={styles.budgetTotal}>{eur(view.cost.total)}</p>
        </div>
        <div className={styles.budgetSide}>
          <p className={styles.budgetLabel}>Budget {eur(profile.budget)}</p>
          <span className={view.overBudget ? styles.pillBad : styles.pillGood}>
            {view.overBudget ? `${eur(-view.margin)} de trop` : `+${eur(view.margin)} de marge`}
          </span>
        </div>
      </div>
      <div className={styles.budgetBar}>
        <ProgressBar
          ratio={ratio}
          color={view.overBudget ? 'var(--color-danger)' : 'var(--color-brand)'}
          label={`${Math.round(Math.min(ratio, 9.99) * 100)} % du budget utilisé`}
        />
      </div>
      <div className={styles.budgetFoot}>
        <span>{livePrices ? 'Prix relevés à ±10 %' : 'Prix estimés à ±10 %'}</span>
        <button type="button" className={styles.detailToggle} aria-expanded={open} aria-controls="ticket-detail" onClick={() => setOpen((v) => !v)}>
          {open ? 'Masquer le détail' : 'Voir le détail'}
        </button>
      </div>
      {open && (
        <dl id="ticket-detail" className={`${styles.detail} mono`}>
          {view.week.map((recipe, day) => (
            <div className={styles.line} key={`${recipe.id}-${day}`}>
              <dt><strong>{DAYS[day].slice(0, 3).toUpperCase()}</strong> {recipe.name}</dt>
              <dd>{eur(view.dinnerValues[day])}</dd>
            </div>
          ))}
          {view.openedPacks > 0.05 && (
            <div className={styles.line}><dt>Paquets entamés (restes)</dt><dd>{eur(view.openedPacks)}</dd></div>
          )}
          {view.cost.pantrySaved > 0.05 && (
            <div className={`${styles.line} ${styles.good}`}><dt>Déjà dans ton placard</dt><dd>−{eur(view.cost.pantrySaved)}</dd></div>
          )}
        </dl>
      )}
      <Link href="/courses" className={styles.listCta}>
        <span>Voir ma liste de courses</span>
        <span className={styles.listCount}>
          {toBuy} articles
          <Icon name="chevronRight" size={15} strokeWidth={2.2} />
        </span>
      </Link>
    </section>
  );
}
