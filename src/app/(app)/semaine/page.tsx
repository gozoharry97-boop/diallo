'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { CONTINENTS, CUISINES_BY_ID, DAYS } from '@/domain/data/catalog';
import { formatDayMonth, weekStartOf } from '@/domain/dates';
import { eur } from '@/domain/format';
import { budgetStreak, passportStamps, piggyBank, type Mood } from '@/domain/game';
import { swapOptions } from '@/domain/planner';
import type { ContinentId } from '@/domain/types';
import { Page, PageHeader, Section, layout } from '@/components/layout/Page';
import { DialloSays } from '@/components/Mascot';
import { Button, ButtonLink } from '@/components/ui/Button';
import { RadioChips } from '@/components/ui/ChoiceGroup';
import { Dialog } from '@/components/ui/Dialog';
import { Icon } from '@/components/ui/Icon';
import { useToast } from '@/components/ui/Toast';
import { CuisineBadge, DinnerCard } from '@/components/week/DinnerCard';
import { ChallengeCard, ProgressTiles } from '@/components/week/Progress';
import { Ticket } from '@/components/week/Ticket';
import week from '@/components/week/week.module.css';
import page from './semaine.module.css';
import { composeWeek, useWeek } from '@/state/useWeek';

export default function WeekPage() {
  const { state, dispatch, prices, livePrices, view } = useWeek();
  const toast = useToast();
  const [swapDay, setSwapDay] = useState<number | null>(null);
  const profile = state.profile!;

  const stamps = useMemo(() => passportStamps(state.history), [state.history]);
  if (!view) return null;

  const streak = budgetStreak(state.history);
  const toBuy = view.cost.lines.filter((l) => l.packs > 0).length;
  const allCooked = view.week.length > 0 && view.cookedCount === view.week.length;
  const mood: Mood = view.overBudget ? 'inquiet' : allCooked ? 'fier' : 'content';
  const staleWeek = state.weekStart !== weekStartOf();

  const recompose = () => {
    const snapshot = state;
    dispatch({ type: 'setPlan', plan: composeWeek(profile, state.pantry, prices) });
    toast({ message: 'Nouvelle semaine composée.', actionLabel: 'Annuler', onAction: () => dispatch({ type: 'restore', state: snapshot }) });
  };

  return (
    <Page>
      <div className={layout.topbar}>
        <span className="visually-hidden">Diallo</span>
        {streak > 0 && (
          <p className={`${layout.row} ${page.streak}`}>
            <Icon name="check" size={16} strokeWidth={2.2} />
            {streak} {streak > 1 ? 'semaines' : 'semaine'} dans le budget
          </p>
        )}
      </div>

      <DialloSays mood={mood} size={92}>
        <p>
          {view.overBudget
            ? `Même la semaine la moins chère dépasse de ${eur(-view.margin)}. Pas de panique, on ajuste ensemble.`
            : allCooked
              ? 'Tous tes dîners sont cuisinés ! Ta semaine est bouclée : on fait le bilan ?'
              : `Ta semaine tient dans ton budget, avec ${eur(view.margin)} de marge. Je l’ajoute à ta cagnotte au bilan.`}
        </p>
        {(allCooked || staleWeek) && <ButtonLink href="/bilan" variant="link">Voir le bilan de la semaine</ButtonLink>}
      </DialloSays>

      <PageHeader title="Ma semaine" subtitle={`Semaine du ${formatDayMonth(state.weekStart)}`} />

      <div className={week.weekLayout}>
        <div>
          <Ticket profile={profile} view={view} livePrices={livePrices} />

          {view.overBudget && (
            <section className={`${layout.note} mt-8`} aria-labelledby="pistes">
              <h2 className="title-sm" id="pistes">Trois pistes pour rentrer dans ton budget</h2>
              <div className={`${layout.stack} mt-3`}>
                <Button variant="dark" block onClick={() => dispatch({ type: 'saveProfile', profile: { ...profile, budget: Math.ceil(view.cost.total) }, applyNow: true })}>
                  Passer le budget à {Math.ceil(view.cost.total)} €
                </Button>
                <ButtonLink href="/reglages" variant="outline" block>Ajouter une épicerie spécialisée</ButtonLink>
                <ButtonLink href="/reglages" variant="outline" block>Élargir mes cuisines ou mon temps</ButtonLink>
              </div>
            </section>
          )}

          {view.week.length < profile.dinners && (
            <p className={`${layout.note} mt-4`}>
              Seulement {view.week.length} dîners correspondent à tes critères. Élargis-les dans Réglages pour en avoir {profile.dinners}.
            </p>
          )}

          <div className="mt-8">
            <ProgressTiles savings={piggyBank(state.history)} stamps={stamps.size} cooked={view.cookedCount} dinners={view.week.length} />
            <ButtonLink href="/progres" variant="link">Voir tous mes progrès</ButtonLink>
            {view.challenge && <ChallengeCard challenge={view.challenge} done={view.challengeDone} />}
          </div>

          <div className="mt-6">
            <ButtonLink href="/courses" variant="primary" block className={layout.between}>
              <span>Voir ma liste de courses</span>
              <span className={page.ctaCount}>{toBuy} articles</span>
            </ButtonLink>
          </div>
        </div>

        <div>
          <section className={`${layout.card} ${page.importCard} mt-6`} aria-labelledby="import-titre">
            <span aria-hidden="true" className={page.importIcon}>
              <Icon name="play" />
            </span>
            <div>
              <h2 className="title-sm" id="import-titre">Vu une recette sur les réseaux ?</h2>
              <p className={`${layout.muted} mt-1`}>
                Colle le lien TikTok, Instagram ou YouTube : je t’en fais une recette cocotte-minute, avec ta liste de courses.
              </p>
              <ButtonLink href="/importer" variant="soft" className="" >Importer une vidéo</ButtonLink>
            </div>
          </section>

          <Section
            title="Tes dîners"
            id="diners-titre"
            action={<Button variant="outline" onClick={recompose}>Recomposer la semaine</Button>}
          >
            <ul className={week.dinners} role="list">
              {view.week.map((recipe, day) => (
                <DinnerCard
                  key={`${recipe.id}-${day}`}
                  recipe={recipe}
                  day={day}
                  perPerson={view.dinnerValues[day] / profile.people}
                  cooked={Boolean(state.cooked[day])}
                  newStamp={!stamps.has(recipe.cuisine)}
                  onToggleCooked={() => dispatch({ type: 'toggleCooked', day })}
                  onSwap={() => setSwapDay(day)}
                />
              ))}
            </ul>
          </Section>
        </div>
      </div>

      <SwapDialog day={swapDay} onClose={() => setSwapDay(null)} />
      <p className={`${layout.small} mt-8`}>
        <Link href="/mentions-legales">Mentions légales et confidentialité</Link>
      </p>
    </Page>
  );
}

const FILTERS: { value: ContinentId | 'all'; label: string }[] = [{ value: 'all', label: 'Tout' }, ...CONTINENTS.map((c) => ({ value: c.id, label: c.name }))];

/** E07 — Changer un dîner : suggestions avec le nouveau total de la semaine. */
function SwapDialog({ day, onClose }: { day: number | null; onClose: () => void }) {
  const { state, dispatch, prices, view } = useWeek();
  const toast = useToast();
  const [filter, setFilter] = useState<ContinentId | 'all'>('all');
  const [showAll, setShowAll] = useState(false);
  const profile = state.profile!;

  const options = useMemo(
    () => (day === null || !view ? [] : swapOptions(view.week, day, profile, state.pantry, prices)),
    [day, view, profile, state.pantry, prices],
  );
  if (day === null || !view) return <Dialog open={false} onClose={onClose} title="">{null}</Dialog>;

  const filtered = options.filter((o) => filter === 'all' || CUISINES_BY_ID[o.recipe.cuisine].continent === filter);
  const shown = showAll || filter !== 'all' ? filtered : filtered.slice(0, 5);
  const current = view.week[day];

  const close = () => {
    setShowAll(false);
    setFilter('all');
    onClose();
  };

  return (
    <Dialog open onClose={close} title="Changer ce dîner" subtitle={`${DAYS[day]}, à la place de ${current?.name ?? ''}`}>
      <RadioChips legend="Filtrer par continent" hideLegend options={FILTERS} value={filter} onChange={setFilter} />
      <h3 className={page.groupTitle}>
        {filter === 'all' && !showAll ? 'Mes 5 suggestions' : `${filtered.length} recettes`}
      </h3>
      <p className={`${layout.muted} ${layout.small} mb-3`}>Nouveau total de la semaine à droite.</p>
      {shown.length === 0 && <p className={layout.muted}>Aucune autre recette ne correspond à tes critères ici.</p>}
      <ul role="list" className={`${layout.stack} list-reset`}>
        {shown.map((o) => (
          <li key={o.recipe.id}>
            <button
              type="button"
              disabled={o.blocked !== null}
              onClick={() => {
                dispatch({ type: 'swap', day, recipeId: o.recipe.id });
                toast({ message: `${DAYS[day]} : ${o.recipe.name}` });
                close();
              }}
              className={`${layout.card} ${page.option} ${o.blocked ? page.optionBlocked : ''}`}
            >
              <CuisineBadge cuisine={o.recipe.cuisine} size={44} />
              <span className="grow">
                <span className={page.optionName}>{o.recipe.name}</span>
                <span className={`${layout.small} ${page.optionMeta}`}>
                  {CUISINES_BY_ID[o.recipe.cuisine].name}, {o.recipe.minutes} min
                  {o.blocked === 'hors budget' ? ', hors budget' : o.blocked === 'flexitarien' ? ', déjà 2 soirs viande' : ''}
                </span>
              </span>
              <span className={`mono ${page.optionPrice}`}>
                <span className={page.optionName}>{eur(o.total)}</span>
                <span className={o.delta <= 0 ? `${page.delta} ${page.deltaGood}` : page.delta}>
                  {o.delta > 0 ? '+' : o.delta < 0 ? '−' : ''}{eur(Math.abs(o.delta))}
                </span>
              </span>
            </button>
          </li>
        ))}
      </ul>
      {filter === 'all' && !showAll && filtered.length > 5 && (
        <Button className="mt-4" variant="outline" block onClick={() => setShowAll(true)}>
          Voir les {filtered.length} recettes compatibles
        </Button>
      )}
      <ButtonLink href="/importer" variant="link">Ou coller un lien de vidéo</ButtonLink>
    </Dialog>
  );
}
