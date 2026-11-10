'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { CUISINES_BY_ID, DAYS } from '@/domain/data/catalog';
import { eur } from '@/domain/format';
import { passportStamps } from '@/domain/game';
import { embedUrl, parseVideoUrl } from '@/domain/import/platform';
import { BackLink, Page, layout } from '@/components/layout/Page';
import { DialloSays } from '@/components/Mascot';
import { RecipeBody } from '@/components/recipe/RecipeBody';
import { VideoSection } from '@/components/recipe/VideoSection';
import { WakeLockSwitch } from '@/components/recipe/WakeLockSwitch';
import styles from '@/components/recipe/recipe.module.css';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { IconBadge } from '@/components/ui/IconBadge';
import { resolveRecipe, useWeek } from '@/state/useWeek';

/** E08 — Fiche recette : grand texte pour cuisiner, vidéos, « Je l'ai cuisiné ». */
export function RecipeView() {
  const params = useSearchParams();
  const { state, dispatch, view } = useWeek();
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
  const sourceVideo = sourceRef && embedUrl(sourceRef)
    ? [{ ...sourceRef, title: recipe.source?.title ?? '', author: recipe.source?.author ?? '', captions: null, embedUrl: embedUrl(sourceRef)!, curated: true }]
    : undefined;

  return (
    <Page narrow>
      <div className={styles.top}>
        <BackLink href="/semaine">Ma semaine</BackLink>
        <WakeLockSwitch />
      </div>

      <header className="mt-2">
        <p className={layout.muted}>{inWeek ? `${DAYS[day]}, pour ${profile.people} ${profile.people > 1 ? 'personnes' : 'personne'}` : `Pour ${profile.people}`}</p>
        <h1 className={styles.title}>{recipe.name}</h1>
        <ul className={styles.tags}>
          <li>{cuisine.name}</li>
          <li>{recipe.minutes} min</li>
          {perPerson !== null && <li>{eur(perPerson)} la part</li>}
          {recipe.spicy && <li>Pimenté</li>}
        </ul>
        {newCuisine && (
          <p className={styles.banner}>
            <IconBadge icon="passport" tone="passport" />
            Nouvelle cuisine : un tampon « {cuisine.name} » t’attend dans ton passeport.
          </p>
        )}
      </header>

      {(sourceVideo || !recipe.source) && <VideoSection recipeId={recipe.id} fallback={sourceVideo} />}

      <RecipeBody recipe={recipe} people={profile.people} />

      <div className="mt-6">
        <DialloSays mood={cooked ? 'fier' : 'content'} size={56} title={<p style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--color-brand)' }}>{cooked ? 'Bravo !' : 'Astuce de Diallo'}</p>}>
          <p>
            {cooked
              ? newCuisine
                ? `Tampon « ${cuisine.name} » ajouté au bilan de la semaine.`
                : 'Un dîner de plus dans ta semaine. Les restes partent au placard au bilan.'
              : 'Sors tous les ingrédients avant de commencer, et coche-les au fur et à mesure.'}
          </p>
        </DialloSays>
      </div>

      {inWeek && (
        <div className="mt-6">
          <Button variant={cooked ? 'success' : 'primary'} block aria-pressed={cooked} onClick={() => dispatch({ type: 'toggleCooked', day })}>
            {cooked && <Icon name="check" size={20} strokeWidth={2.6} />}
            {cooked ? 'Cuisiné' : 'Je l’ai cuisiné'}
          </Button>
        </div>
      )}

      {inWeek && (
        <nav className={styles.siblings} aria-label="Autres dîners de la semaine">
          {day > 0 && (
            <Link href={`/recette?jour=${day - 1}`} className={styles.sibling}>
              <span>{DAYS[day - 1]}</span>
              {resolveRecipe(state, state.plan[day - 1])?.name}
            </Link>
          )}
          {day < state.plan.length - 1 && (
            <Link href={`/recette?jour=${day + 1}`} className={`${styles.sibling} ${styles.siblingNext}`} style={{ gridColumn: 2 }}>
              <span>{DAYS[day + 1]}</span>
              {resolveRecipe(state, state.plan[day + 1])?.name}
            </Link>
          )}
        </nav>
      )}
    </Page>
  );
}
