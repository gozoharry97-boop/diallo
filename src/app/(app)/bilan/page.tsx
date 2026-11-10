'use client';

import { useRouter } from 'next/navigation';
import { CUISINES, CUISINES_BY_ID } from '@/domain/data/catalog';
import { INGREDIENTS, type IngredientKey } from '@/domain/data/ingredients';
import { eur, formatQuantity } from '@/domain/format';
import { bestStreak, budgetStreak, passportStamps, piggyBank, weekSavings } from '@/domain/game';
import { pantryAfterWeek } from '@/domain/pantry';
import { bestPrices, profileStoreIds, referenceTable } from '@/domain/pricing';
import type { CuisineId, WeekRecord } from '@/domain/types';
import { Page, layout } from '@/components/layout/Page';
import { Mascot } from '@/components/Mascot';
import { Button, ButtonLink } from '@/components/ui/Button';
import { IconBadge } from '@/components/ui/IconBadge';
import { composeWeek, useWeek } from '@/state/useWeek';
import styles from './bilan.module.css';

const STAMP_COLORS = ['var(--color-brand)', '#2f4ba8', 'var(--color-success-strong)', '#7a4f00'];

/** E12 — Bilan de la semaine : le moment fort (tampons, cagnotte, série), puis nouvelle semaine. */
export default function WeeklyReviewPage() {
  const router = useRouter();
  const { state, dispatch, prices, view } = useWeek();
  if (!view) return null;
  const profile = state.profile!;

  const known = passportStamps(state.history);
  const cookedCuisines = [...new Set(view.week.filter((_, i) => state.cooked[i]).map((r) => r.cuisine))];
  const newStamps = cookedCuisines.filter((c) => !known.has(c)) as CuisineId[];
  const challengeDone = Boolean(view.challenge && view.challengeDone === view.challenge.days.length);
  const record: WeekRecord = {
    weekStart: state.weekStart,
    budget: profile.budget,
    total: view.cost.total,
    pantrySaved: view.cost.pantrySaved,
    dinners: view.week.length,
    cooked: view.cookedCount,
    cuisinesCooked: cookedCuisines,
    challengeDone,
  };
  const history = [...state.history, record];
  const saved = weekSavings(record);
  const streak = budgetStreak(history);
  const nextPantry = pantryAfterWeek(view.cost.lines, state.pantry);
  const leftovers = (Object.entries(nextPantry) as [IngredientKey, number | true][]).filter(
    ([k, v]) => typeof v === 'number' && v !== state.pantry[k],
  ) as [IngredientKey, number][];
  const underBudget = record.total <= record.budget;

  const startNextWeek = () => {
    const nextProfile = state.pendingProfile ?? profile;
    const samestores = profileStoreIds(nextProfile).join() === profileStoreIds(profile).join();
    const nextPrices = samestores ? prices : bestPrices(nextProfile, referenceTable(profileStoreIds(nextProfile)));
    dispatch({ type: 'finishWeek', record, pantry: nextPantry, profile: nextProfile, plan: composeWeek(nextProfile, nextPantry, nextPrices) });
    router.push('/semaine');
  };

  return (
    <Page narrow>
      <section className={styles.hero} aria-labelledby="bilan-titre">
        <Mascot mood={underBudget ? 'fier' : 'content'} size={128} onDark />
        <h1 id="bilan-titre" className={styles.title}>{view.cookedCount === view.week.length ? 'Semaine bouclée !' : 'Le bilan de ta semaine'}</h1>
        <p className={styles.lead}>
          {view.cookedCount} {view.cookedCount > 1 ? 'dîners cuisinés' : 'dîner cuisiné'} sur {view.week.length}
          {underBudget ? ', et tu es resté sous ton budget.' : '. Le budget a été dépassé : on ajuste la semaine prochaine.'}
        </p>
      </section>

      {newStamps.length > 0 && (
        <section className={styles.block} aria-labelledby="tampons">
          <h2 id="tampons" className={styles.h2}>{newStamps.length} {newStamps.length > 1 ? 'tampons' : 'tampon'} dans ton passeport</h2>
          <p className={layout.muted}>Tu en as maintenant {passportStamps(history).size} sur {CUISINES.length}.</p>
          <ul role="list" className={styles.stamps}>
            {newStamps.map((c, i) => (
              <li key={c} className={styles.stampCard}>
                <span className={styles.stamp} style={{ color: STAMP_COLORS[i % 4], transform: `rotate(${i % 2 ? 6 : -8}deg)` }}>
                  <span className={styles.stampKicker}>Tampon</span>
                  <span className={styles.stampName}>{CUISINES_BY_ID[c].name}</span>
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}

      <ul role="list" className={`${styles.block} ${layout.stack} list-reset`} aria-label="Résultats de la semaine">
        <li className={styles.result}>
          <IconBadge icon="piggy" tone="piggy" size={40} />
          <div><p className={styles.resultTitle}>+ {eur(saved)} dans ta cagnotte</p><p className={layout.muted}>Total : {eur(piggyBank(history))} économisés depuis le début</p></div>
        </li>
        <li className={styles.result}>
          <IconBadge icon="check" tone="pot" size={40} />
          <div>
            <p className={styles.resultTitle}>{streak > 0 ? `${streak} ${streak > 1 ? 'semaines' : 'semaine'} d’affilée dans le budget` : 'Série en pause'}</p>
            <p className={layout.muted}>{streak > 0 && streak >= bestStreak(history) ? 'Ton record' : `Record : ${bestStreak(history)}`}</p>
          </div>
        </li>
        {view.challenge && (
          <li className={`${styles.result} ${styles.resultDark}`}>
            <IconBadge icon="leaf" tone="leaf" size={40} />
            <div>
              <p className={styles.resultTitle}>{challengeDone ? 'Défi zéro gaspi réussi' : 'Défi zéro gaspi pas terminé'}</p>
              <p className={styles.onDarkSoft}>{INGREDIENTS[view.challenge.key].name}</p>
            </div>
          </li>
        )}
      </ul>

      <section className={`${layout.card} ${styles.block}`} aria-labelledby="restes">
        <h2 id="restes" className={styles.h2}>Tes restes vont au placard</h2>
        {leftovers.length ? (
          <>
            <p className={layout.muted}>Je les utiliserai en premier la semaine prochaine.</p>
            <ul className="list-reset mt-2" role="list">
              {leftovers.map(([k, v]) => (
                <li key={k} className={styles.leftover}><span>{INGREDIENTS[k].name}</span><span className={layout.muted}>{formatQuantity(v, INGREDIENTS[k])}</span></li>
              ))}
            </ul>
          </>
        ) : (
          <p className={layout.muted}>Aucun reste qui se conserve : rien n’a été gaspillé.</p>
        )}
      </section>

      {state.pendingProfile && <p className={`${layout.note} mt-4`}>Tes nouveaux réglages s’appliqueront à la semaine qui commence.</p>}

      <div className={`${styles.block} ${layout.stack}`} style={{ marginBottom: 'var(--space-10)' }}>
        <Button variant="primary" block onClick={startNextWeek}>Composer ma nouvelle semaine</Button>
        <ButtonLink href="/semaine" variant="outline" block>Revenir à ma semaine</ButtonLink>
      </div>
    </Page>
  );
}
