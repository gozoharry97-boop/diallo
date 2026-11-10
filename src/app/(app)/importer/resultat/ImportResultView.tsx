'use client';

import { useSearchParams } from 'next/navigation';
import { useMemo, useState } from 'react';
import { CUISINES_BY_ID, DAYS } from '@/domain/data/catalog';
import { eur } from '@/domain/format';
import { PLATFORM_LABEL } from '@/domain/import/platform';
import { dinnerValue, planCost } from '@/domain/planner';
import { BackLink, Page, layout } from '@/components/layout/Page';
import { Mascot } from '@/components/Mascot';
import { groupByStore, lineDetail } from '@/components/courses/shopping-list';
import { RecipeBody } from '@/components/recipe/RecipeBody';
import recipeStyles from '@/components/recipe/recipe.module.css';
import { Button, ButtonLink } from '@/components/ui/Button';
import { RadioChips } from '@/components/ui/ChoiceGroup';
import { Icon } from '@/components/ui/Icon';
import { useWeek } from '@/state/useWeek';
import styles from './result.module.css';

/** E21 — Recette cocotte-minute : résumé, achats par magasin, ajout à la semaine ou à la liste. */
export function ImportResultView() {
  const id = useSearchParams().get('id') ?? '';
  const { state, dispatch, prices, view } = useWeek();
  const record = state.imports.find((i) => i.id === id);
  const profile = state.profile!;
  const [day, setDay] = useState<number | null>(null);
  const [snapshot, setSnapshot] = useState<typeof state | null>(null);

  const options = useMemo(() => {
    if (!record || !view) return [];
    return view.week.map((current, i) => {
      const next = view.week.map((r, j) => (j === i ? record.recipe : r));
      return { day: i, replaced: current.name, total: planCost(next, profile.people, state.pantry, prices).total };
    });
  }, [record, view, profile.people, state.pantry, prices]);

  if (!record || !view) {
    return (
      <Page narrow>
        <BackLink href="/importer">Importer une vidéo</BackLink>
        <p className={`${layout.note} mt-4`}>Cet import n’existe plus sur cet appareil.</p>
      </Page>
    );
  }

  const { recipe } = record;
  const own = planCost([recipe], profile.people, state.pantry, prices);
  const groups = groupByStore(own.lines, profile);
  const owned = own.lines.filter((l) => l.packs === 0).map((l) => l.ingredient.name.toLowerCase());
  const best = options.reduce<(typeof options)[number] | null>((b, o) => (!b || o.total < b.total ? o : b), null);
  const selected = options.find((o) => o.day === (day ?? best?.day)) ?? null;
  const added = record.addedTo;

  const add = (target: number | null) => {
    setSnapshot(state);
    dispatch({ type: 'useImport', id: record.id, day: target });
  };

  return (
    <Page narrow>
      <BackLink href="/importer">Importer une vidéo</BackLink>
      <p className={styles.badge}>
        <span className={styles.badgeIcon} aria-hidden="true"><Icon name="cooker" size={16} strokeWidth={2} /></span>
        Recette cocotte-minute
      </p>
      <h1 className={recipeStyles.title}>{recipe.name}</h1>
      <ul className={recipeStyles.tags}>
        <li>{CUISINES_BY_ID[recipe.cuisine].name}</li>
        <li>{recipe.minutes} min</li>
        <li>{profile.people} {profile.people > 1 ? 'personnes' : 'personne'}</li>
        <li>{eur(dinnerValue(recipe, 1, prices))} la part</li>
      </ul>

      {recipe.source && (
        <section className={`${layout.card} ${styles.source}`} aria-label="Vidéo d’origine">
          <span className={styles.thumb} aria-hidden="true"><Icon name="play" size={18} /></span>
          <div className="grow">
            <p className="strong">D’après une vidéo {PLATFORM_LABEL[recipe.source.platform]}{recipe.source.author ? ` de ${recipe.source.author}` : ''}</p>
            <p className={`${layout.muted} ${layout.small}`}>Résumée et adaptée par Diallo</p>
          </div>
          <a href={recipe.source.url} target="_blank" rel="noopener noreferrer" className={styles.rewatch}>
            Revoir<span className="visually-hidden"> la vidéo (nouvel onglet)</span>
          </a>
        </section>
      )}

      <RecipeBody recipe={recipe} people={profile.people} guessed={record.guessed} />

      <section className={`${layout.card} ${styles.block}`} aria-labelledby="a-acheter">
        <div className={layout.between}>
          <h2 id="a-acheter" className={recipeStyles.h2}>À acheter</h2>
          <span className="mono" style={{ fontSize: '1.125rem', fontWeight: 600 }}>{eur(own.total)}</span>
        </div>
        {groups.map((g) => (
          <div key={g.storeId}>
            <h3 className={styles.storeHead}><span>{g.name}</span><span className="mono">{eur(g.subtotal)}</span></h3>
            <ul className="list-reset" role="list">
              {g.aisles.flatMap((a) => a.lines).map((l) => (
                <li key={l.key} className={styles.buyLine}>
                  <span>{l.ingredient.name} <span className={layout.muted}>({lineDetail(l).split(' (')[0]})</span></span>
                  <span className="mono">{eur(l.cost)}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
        {owned.length > 0 && <p className={`${layout.muted} ${layout.small} mt-3`}>Déjà chez toi : {owned.join(', ')}.</p>}
        {own.unpriced.length > 0 && <p className={`${layout.muted} ${layout.small} mt-2`}>À trouver en rayon (non chiffré) : {own.unpriced.map((x) => x.name).join(', ')}.</p>}
      </section>

      {!added && options.length > 0 && selected && (
        <section className={`${layout.card} ${styles.block}`} aria-labelledby="ajout">
          <h2 id="ajout" className={recipeStyles.h2}>L’ajouter à ma semaine</h2>
          <p className={`${layout.muted} ${layout.small}`} style={{ margin: 'var(--space-1) 0 var(--space-3)' }}>Elle remplace le dîner du jour choisi.</p>
          <RadioChips
            legend="Jour à remplacer"
            hideLegend
            options={options.map((o) => ({ value: o.day, label: DAYS[o.day].slice(0, 3) }))}
            value={selected.day}
            onChange={setDay}
          />
          <div className={styles.impact} aria-live="polite">
            <p>À la place de <b>{selected.replaced}</b></p>
            <p>Ta semaine passe à <b className="mono">{eur(selected.total)}</b> pour un budget de {eur(profile.budget)}</p>
            {best && selected.day === best.day && <p className={styles.bestDay}>C’est le jour le moins cher pour l’ajouter.</p>}
            {selected.total > profile.budget && <p className={styles.overBudget}>Ça dépasse ton budget de {eur(selected.total - profile.budget)}.</p>}
          </div>
          <div className={`${layout.stack} mt-4`}>
            <Button variant="primary" block onClick={() => add(selected.day)}>Ajouter {DAYS[selected.day].toLowerCase()}</Button>
            <Button variant="outline" block onClick={() => add(null)}>Ajouter seulement les ingrédients à ma liste</Button>
          </div>
        </section>
      )}

      {added && (
        <section role="status" className={`${layout.cardDark} ${styles.block} ${styles.added}`}>
          <Mascot mood="fier" size={60} onDark />
          <div>
            <p className={styles.addedTitle}>{added === 'week' ? 'Ajoutée à ta semaine !' : 'Ingrédients ajoutés à ta liste'}</p>
            <p className={styles.addedText}>
              {added === 'week' ? `Ta liste est à jour. Un tampon « ${CUISINES_BY_ID[recipe.cuisine].name} » t’attend quand tu l’auras cuisinée.` : `${groups.flatMap((g) => g.aisles.flatMap((a) => a.lines)).length} articles en plus, pour ${eur(own.total)}.`}
            </p>
            <div className={`${layout.row} mt-3`}>
              <ButtonLink href="/semaine" variant="light">Voir ma semaine</ButtonLink>
              <ButtonLink href="/courses" variant="outline" className={styles.onDarkOutline}>Voir ma liste</ButtonLink>
            </div>
            {snapshot && (
              <Button variant="link" className={styles.undo} onClick={() => { dispatch({ type: 'restore', state: snapshot }); setSnapshot(null); }}>
                Annuler
              </Button>
            )}
          </div>
        </section>
      )}

      <p className={`${layout.muted} ${layout.small}`} style={{ margin: 'var(--space-5) 0 var(--space-10)' }}>
        Diallo résume la recette pour toi et renvoie toujours vers la vidéo de son créateur.
      </p>
    </Page>
  );
}
