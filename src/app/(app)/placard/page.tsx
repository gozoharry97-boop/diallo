'use client';

import { useState } from 'react';
import { DAYS } from '@/domain/data/catalog';
import { INGREDIENTS, INGREDIENT_KEYS, type IngredientKey } from '@/domain/data/ingredients';
import { eur, formatQuantity } from '@/domain/format';
import { Page, PageHeader, Section, layout } from '@/components/layout/Page';
import { Button } from '@/components/ui/Button';
import { IconBadge } from '@/components/ui/IconBadge';
import { useToast } from '@/components/ui/Toast';
import ui from '@/components/ui/ui.module.css';
import { composeWeek, useWeek } from '@/state/useWeek';
import page from './placard.module.css';

/** E10 — Placard : ce qui est déjà à la maison, utilisé en priorité. */
export default function PantryPage() {
  const { state, dispatch, prices, view } = useWeek();
  const toast = useToast();
  const [adding, setAdding] = useState<IngredientKey | ''>('');
  if (!view) return null;

  const entries = (Object.entries(state.pantry) as [IngredientKey, number | true][]).filter(([k]) => INGREDIENTS[k]);
  const usedBy = (key: IngredientKey) => view.week.flatMap((r, i) => (r.ingredients[key] !== undefined ? [DAYS[i].toLowerCase()] : []));
  const used = entries.filter(([k]) => usedBy(k).length > 0);
  const reserve = entries.filter(([k]) => usedBy(k).length === 0);
  const available = INGREDIENT_KEYS.filter((k) => !(k in state.pantry)).sort((a, b) => INGREDIENTS[a].name.localeCompare(INGREDIENTS[b].name, 'fr'));

  const remove = (key: IngredientKey) => {
    const previous = state.pantry[key] ?? null;
    dispatch({ type: 'setPantry', key, value: null });
    toast({ message: `${INGREDIENTS[key].name} retiré du placard`, actionLabel: 'Annuler', onAction: () => dispatch({ type: 'setPantry', key, value: previous }) });
  };

  const describe = (value: number | true, key: IngredientKey) => (value === true ? 'J’en ai assez' : `Reste environ ${formatQuantity(value, INGREDIENTS[key])}`);

  const list = (items: [IngredientKey, number | true][], withDays: boolean) => (
    <ul role="list" className={`${layout.stack} list-reset`}>
      {items.map(([key, value]) => (
        <li key={key} className={`${layout.card} ${page.item}`}>
          <div className="grow">
            <p className="strong">{INGREDIENTS[key].name}</p>
            <p className={`${layout.muted} ${layout.small}`}>
              {describe(value, key)}{withDays ? `, pour ${usedBy(key).join(' et ')}` : ''}
            </p>
          </div>
          <Button variant="soft" onClick={() => remove(key)}>
            Retirer<span className="visually-hidden"> {INGREDIENTS[key].name}</span>
          </Button>
        </li>
      ))}
    </ul>
  );

  return (
    <Page>
      <PageHeader title="Mon placard">
        <p className={`${layout.muted} mt-2`}>Ce que tu as déjà est déduit de tes courses. Je compose tes dîners pour le finir.</p>
      </PageHeader>

      {view.cost.pantrySaved > 0.05 && (
        <p className={`${layout.row} ${page.savings} mt-4`}>
          <IconBadge icon="piggy" tone="neutral" size={40} />
          <span><b>{eur(view.cost.pantrySaved)} économisés</b> cette semaine grâce à ton placard.</span>
        </p>
      )}

      {entries.length === 0 && (
        <p className={`${layout.note} mt-6`}>
          Ton placard est vide. Ajoute ce que tu as déjà, ou touche « Je l’ai déjà » dans ta liste de courses.
        </p>
      )}
      {used.length > 0 && <Section title="Utilisé cette semaine" id="utilise">{list(used, true)}</Section>}
      {reserve.length > 0 && <Section title="En réserve" id="reserve">{list(reserve, false)}</Section>}

      <Section title="Ajouter un produit" id="ajouter">
        <form
          className={layout.card}
          onSubmit={(e) => {
            e.preventDefault();
            if (!adding) return;
            dispatch({ type: 'setPantry', key: adding, value: true });
            toast({ message: `${INGREDIENTS[adding].name} ajouté au placard` });
            setAdding('');
          }}
        >
          <label htmlFor="produit" className={ui.label}>Produit que tu as chez toi</label>
          <div className={page.actions}>
            <select id="produit" className={`${ui.field} grow`} value={adding} onChange={(e) => setAdding(e.target.value as IngredientKey)}>
              <option value="">Choisir…</option>
              {available.map((k) => <option key={k} value={k}>{INGREDIENTS[k].name}</option>)}
            </select>
            <Button type="submit" variant="dark" disabled={!adding}>Ajouter</Button>
          </div>
        </form>
      </Section>

      <div className="mt-6">
        <Button
          variant="outline"
          block
          onClick={() => {
            const snapshot = state;
            dispatch({ type: 'setPlan', plan: composeWeek(state.profile!, state.pantry, prices) });
            toast({ message: 'Semaine recomposée avec ton placard.', actionLabel: 'Annuler', onAction: () => dispatch({ type: 'restore', state: snapshot }) });
          }}
        >
          Recomposer ma semaine avec mon placard
        </Button>
      </div>
    </Page>
  );
}
