'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useRef, useState } from 'react';
import { CUISINES_BY_ID, DAYS } from '@/domain/data/catalog';
import { eur } from '@/domain/format';
import { passportStamps } from '@/domain/game';
import { embedUrl, parseVideoUrl } from '@/domain/import/platform';
import type { Recipe } from '@/domain/types';
import { BackLink, Page, layout } from '@/components/layout/Page';
import { Mascot } from '@/components/Mascot';
import { IngredientsCard, StepsList } from '@/components/recipe/RecipeBody';
import { VideoSection } from '@/components/recipe/VideoSection';
import { WakeLockSwitch } from '@/components/recipe/WakeLockSwitch';
import styles from '@/components/recipe/recipe.module.css';
import { Button } from '@/components/ui/Button';
import { Icon, type IconName } from '@/components/ui/Icon';
import { DishArt } from '@/components/week/DishArt';
import { resolveRecipe, useWeek } from '@/state/useWeek';

const TABS = ['Ingrédients', 'Étapes', 'Vidéos'] as const;

/** Niveau estimé à partir du temps et du nombre d'étapes. */
const level = (recipe: Recipe) => (recipe.minutes <= 30 && recipe.steps.length <= 4 ? 'Facile' : recipe.minutes <= 50 ? 'Moyen' : 'Long');

/** E08 — Fiche recette (v2) : visuel du plat, chiffres clés, onglets, « Je l'ai cuisiné » toujours à portée. */
export function RecipeView() {
  const params = useSearchParams();
  const { state, dispatch, view } = useWeek();
  const [tab, setTab] = useState(0);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const dayParam = params.get('jour');
  const day = dayParam === null ? -1 : Number(dayParam);
  const recipeId = params.get('id') ?? state.plan[day];
  const recipe = recipeId ? resolveRecipe(state, recipeId) : undefined;
  const profile = state.profile!;
  const inWeek = Number.isInteger(day) && state.plan[day] === recipeId;

  if (!recipe || !view) {
    return (
      <Page narrow>
        <BackLink href="/semaine">Ma semaine</BackLink>
        <p className={`${layout.note} mt-4`}>Cette recette n’est plus dans ta semaine.</p>
      </Page>
    );
  }

  const cooked = inWeek && Boolean(state.cooked[day]);
  const newCuisine = !passportStamps(state.history).has(recipe.cuisine);
  const cuisine = CUISINES_BY_ID[recipe.cuisine];
  const perPerson = inWeek ? view.dinnerValues[day] / profile.people : null;
  const sourceRef = recipe.source ? parseVideoUrl(recipe.source.url) : null;
  const sourceVideo =
    sourceRef && embedUrl(sourceRef)
      ? [{ ...sourceRef, title: recipe.source?.title ?? '', author: recipe.source?.author ?? '', captions: null, embedUrl: embedUrl(sourceRef)!, curated: true }]
      : undefined;
  const people = `${profile.people} ${profile.people > 1 ? 'personnes' : 'personne'}`;

  const facts: { icon: IconName; tone: string; value: string; label: string }[] = [
    { icon: 'clock', tone: 'passport', value: `${recipe.minutes} min`, label: 'Temps' },
    ...(perPerson !== null ? [{ icon: 'wallet' as const, tone: 'piggy', value: eur(perPerson), label: 'la part' }] : []),
    { icon: 'person', tone: 'pot', value: String(profile.people), label: profile.people > 1 ? 'personnes' : 'personne' },
    { icon: 'level', tone: 'store', value: level(recipe), label: 'niveau' },
  ];

  const selectTab = (i: number) => {
    setTab(i);
    tabRefs.current[i]?.focus();
  };
  const onTabKey = (e: React.KeyboardEvent) => {
    const last = TABS.length - 1;
    if (e.key === 'ArrowRight') selectTab(tab === last ? 0 : tab + 1);
    else if (e.key === 'ArrowLeft') selectTab(tab === 0 ? last : tab - 1);
    else if (e.key === 'Home') selectTab(0);
    else if (e.key === 'End') selectTab(last);
    else return;
    e.preventDefault();
  };

  return (
    <Page narrow>
      <div className={styles.hero} style={{ background: cuisine.tint }}>
        <div className={styles.heroBar}>
          <Link href="/semaine" className={styles.roundButton} aria-label="Retour à Ma semaine">
            <Icon name="back" size={22} strokeWidth={2} />
          </Link>
          <WakeLockSwitch />
        </div>
        <DishArt recipe={recipe} size={240} bare />
      </div>

      <div className={styles.sheet}>
        <ul className={styles.tags} aria-label="Étiquettes">
          <li data-tone="passport">{cuisine.name}</li>
          {recipe.spicy && <li data-tone="danger">Pimenté</li>}
          {newCuisine && <li data-tone="piggy">Nouveau tampon</li>}
          {recipe.source && <li data-tone="store">Recette vidéo</li>}
        </ul>
        <p className={`${layout.muted} mt-3`}>{inWeek ? `${DAYS[day]}, pour ${people}` : `Pour ${people}`}</p>
        <h1 className={styles.title}>{recipe.name}</h1>

        <ul className={styles.facts} aria-label="En bref">
          {facts.map((f) => (
            <li key={f.label} className={styles.fact}>
              <span className={styles.factIcon} data-tone={f.tone} aria-hidden="true"><Icon name={f.icon} /></span>
              <span className={styles.factValue}>{f.value}</span>
              <span className={styles.factLabel}>{f.label}</span>
            </li>
          ))}
        </ul>

        <div role="tablist" aria-label="Contenu de la recette" className={styles.segmented} onKeyDown={onTabKey}>
          {TABS.map((name, i) => (
            <button
              key={name}
              ref={(el) => {
                tabRefs.current[i] = el;
              }}
              type="button"
              role="tab"
              id={`onglet-${i}`}
              aria-selected={tab === i}
              aria-controls={`panneau-${i}`}
              tabIndex={tab === i ? 0 : -1}
              onClick={() => setTab(i)}
            >
              {name}
            </button>
          ))}
        </div>

        {/* Les trois panneaux restent montés : les cases cochées et la vidéo en cours ne se perdent pas. */}
        <div role="tabpanel" id="panneau-0" aria-labelledby="onglet-0" hidden={tab !== 0} className="mt-4">
          <IngredientsCard recipe={recipe} people={profile.people} />
        </div>
        <div role="tabpanel" id="panneau-1" aria-labelledby="onglet-1" hidden={tab !== 1} className="mt-4">
          <StepsList recipe={recipe} />
        </div>
        <div role="tabpanel" id="panneau-2" aria-labelledby="onglet-2" hidden={tab !== 2} className="mt-4">
          <VideoSection recipeId={recipe.id} fallback={sourceVideo} heading={false} />
        </div>

        <section className={styles.tip} aria-live="polite">
          <Mascot mood={cooked ? 'fier' : 'content'} size={52} />
          <div className="grow">
            <p className={styles.tipTitle}>{cooked ? 'Bravo !' : 'Astuce de Diallo'}</p>
            <p>
              {cooked
                ? newCuisine
                  ? `Tampon « ${cuisine.name} » ajouté au bilan de la semaine.`
                  : 'Un dîner de plus dans ta semaine. Les restes partent au placard au bilan.'
                : 'Sors tous les ingrédients avant de commencer, et coche-les au fur et à mesure.'}
            </p>
          </div>
        </section>

        {inWeek && (
          <nav className={styles.siblings} aria-label="Autres dîners de la semaine">
            {day > 0 && (
              <Link href={`/recette?jour=${day - 1}`} className={styles.sibling}>
                <span>‹ {DAYS[day - 1]}</span>
                {resolveRecipe(state, state.plan[day - 1])?.name}
              </Link>
            )}
            {day < state.plan.length - 1 && (
              <Link href={`/recette?jour=${day + 1}`} className={`${styles.sibling} ${styles.siblingNext}`}>
                <span>{DAYS[day + 1]} ›</span>
                {resolveRecipe(state, state.plan[day + 1])?.name}
              </Link>
            )}
          </nav>
        )}
      </div>

      {inWeek && (
        <div className={styles.cookBar}>
          <Button variant={cooked ? 'success' : 'primary'} block aria-pressed={cooked} onClick={() => dispatch({ type: 'toggleCooked', day })}>
            {cooked && <Icon name="check" size={20} strokeWidth={2.6} />}
            {cooked ? 'Cuisiné ! Tampon ajouté' : 'Je l’ai cuisiné'}
          </Button>
        </div>
      )}
    </Page>
  );
}
