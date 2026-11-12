'use client';

import { useState } from 'react';
import { INGREDIENTS, type IngredientKey } from '@/domain/data/ingredients';
import { formatQuantity, shortName } from '@/domain/format';
import type { Recipe } from '@/domain/types';
import { layout } from '../layout/Page';
import { Icon } from '../ui/Icon';
import styles from './recipe.module.css';

/** Ingrédients puis étapes, l'un sous l'autre (fiche importée). */
export function RecipeBody({ recipe, people, guessed = [] }: { recipe: Recipe; people: number; guessed?: string[] }) {
  return (
    <>
      <IngredientsCard recipe={recipe} people={people} />
      <div className="mt-8">
        <StepsList recipe={recipe} guessed={guessed} />
      </div>
    </>
  );
}

/** Ingrédients à cocher, quantités calculées pour le foyer. */
export function IngredientsCard({ recipe, people }: { recipe: Recipe; people: number }) {
  const [ready, setReady] = useState<Record<string, boolean>>({});
  const entries = Object.entries(recipe.ingredients) as [IngredientKey, number][];
  const total = entries.length + (recipe.extras?.length ?? 0);

  return (
    <section className={`${layout.card} ${styles.ingredients}`} aria-labelledby="ingredients">
      <div className={layout.between}>
        <h2 id="ingredients" className={styles.h2}>
          Ingrédients
        </h2>
        <span className={layout.muted} aria-live="polite">
          {Object.values(ready).filter(Boolean).length} sur {total} prêts
        </span>
      </div>
      <ul className="list-reset mt-3" role="list">
        {entries.map(([key, perPerson]) => {
          const ingredient = INGREDIENTS[key];
          return (
            <li key={key}>
              <label className={styles.ingredient}>
                <input type="checkbox" checked={Boolean(ready[key])} onChange={() => setReady((r) => ({ ...r, [key]: !r[key] }))} />
                <span>{shortName(ingredient)}</span>
                <span className={styles.qty}>{formatQuantity(perPerson * people, ingredient)}</span>
              </label>
            </li>
          );
        })}
        {recipe.extras?.map((x) => (
          <li key={x.name}>
            <label className={styles.ingredient}>
              <input type="checkbox" checked={Boolean(ready[x.name])} onChange={() => setReady((r) => ({ ...r, [x.name]: !r[x.name] }))} />
              <span>{x.name}</span>
              <span className={styles.qty}>{x.quantity ? `${x.quantity}${x.unit ? ` ${x.unit}` : ''}` : ''}</span>
            </label>
          </li>
        ))}
      </ul>
      <p className={styles.muted}>Huile, sel, poivre et épices non comptés. En cas d’allergie, vérifie les étiquettes.</p>
    </section>
  );
}

/** Étapes numérotées et points à vérifier (quantités devinées d'une vidéo, par exemple). */
export function StepsList({ recipe, guessed = [] }: { recipe: Recipe; guessed?: string[] }) {
  const checks = [...(recipe.uncertainties ?? []), ...guessed.map((g) => `Quantité estimée : ${g.toLowerCase()}.`)];
  return (
    <section aria-labelledby="etapes">
      <h2 id="etapes" className={`${styles.h2} mb-3`}>
        {recipe.source ? `En ${recipe.steps.length} étapes` : 'Étapes'}
      </h2>
      <ol className={styles.steps}>
        {recipe.steps.map((step) => (
          <li key={step} className={styles.step}>
            <span>{step}</span>
          </li>
        ))}
      </ol>
      {checks.length > 0 && (
        <div className={styles.check}>
          <Icon name="alert" size={20} strokeWidth={2} />
          <div>
            <p>
              <b>À vérifier :</b>
            </p>
            <ul className={styles.checkList}>
              {checks.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </section>
  );
}
