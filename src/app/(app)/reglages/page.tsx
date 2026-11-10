'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { CUISINES_BY_ID, DIETS, STORES_BY_ID } from '@/domain/data/catalog';
import { candidates } from '@/domain/planner';
import type { Profile } from '@/domain/types';
import { Page, PageHeader, Section, layout } from '@/components/layout/Page';
import { CuisinesFields, DietFields, HouseholdBudgetFields, StoresFields } from '@/components/ProfileForm';
import { Button, ButtonLink } from '@/components/ui/Button';
import { Dialog } from '@/components/ui/Dialog';
import { IconBadge } from '@/components/ui/IconBadge';
import { useToast } from '@/components/ui/Toast';
import { composeWeek, useWeek } from '@/state/useWeek';
import page from './reglages.module.css';
import ui from '@/components/ui/ui.module.css';

type Part = 'stores' | 'cuisines' | 'diet' | 'household';

const PARTS: { id: Part; title: string; Fields: typeof StoresFields }[] = [
  { id: 'stores', title: 'Magasins', Fields: StoresFields },
  { id: 'cuisines', title: 'Cuisines', Fields: CuisinesFields },
  { id: 'diet', title: 'Alimentation', Fields: DietFields },
  { id: 'household', title: 'Foyer et budget', Fields: HouseholdBudgetFields },
];

function summary(part: Part, p: Profile): string {
  switch (part) {
    case 'stores':
      return [p.store, ...p.extras].map((id) => STORES_BY_ID[id]?.name).join(' + ');
    case 'cuisines':
      return p.cuisines.length ? p.cuisines.map((c) => CUISINES_BY_ID[c].name).join(', ') : 'Ouvert à tout';
    case 'diet':
      return `${DIETS.find((d) => d.id === p.diet)?.name}, ${p.maxMinutes >= 999 ? 'sans limite de temps' : `${p.maxMinutes} min maximum`}${p.exclusions.length ? `, ${p.exclusions.length} exclusion(s)` : ''}`;
    case 'household':
      return `${p.people} pers., ${p.dinners} dîners, ${p.budget} €`;
  }
}

/** E11 — Réglages, avec le choix « maintenant ou semaine prochaine ». */
export default function SettingsPage() {
  const router = useRouter();
  const { state, dispatch, prices } = useWeek();
  const toast = useToast();
  const current = state.pendingProfile ?? state.profile!;
  const [draft, setDraft] = useState<Profile>(current);
  const [editing, setEditing] = useState<Part | null>(null);
  const [applyNow, setApplyNow] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);
  const dirty = JSON.stringify(draft) !== JSON.stringify(current);
  const valid = candidates(draft).length >= 3;

  const save = () => {
    dispatch({ type: 'saveProfile', profile: draft, applyNow, plan: applyNow ? composeWeek(draft, state.pantry, prices) : undefined });
    toast({ message: applyNow ? 'Enregistré. Ta semaine a été recomposée.' : 'Enregistré. Tes réglages s’appliqueront à la semaine prochaine.' });
  };

  return (
    <Page narrow>
      <PageHeader title="Réglages" />
      {state.pendingProfile && !dirty && (
        <p className={`${layout.note} mt-4`}>Des réglages modifiés s’appliqueront à ta prochaine semaine.</p>
      )}

      <ul role="list" className={`${layout.card} list-reset mt-5`}>
        {PARTS.map((part) => {
          const open = editing === part.id;
          return (
            <li key={part.id} className={page.part}>
              <div className={`${layout.between} ${page.partHead}`}>
                <div className="grow">
                  <h2 className={page.partTitle}>{part.title}</h2>
                  <p className={`${layout.muted} ${layout.small}`}>{summary(part.id, draft)}</p>
                </div>
                <Button variant="soft" aria-expanded={open} aria-controls={`reglage-${part.id}`} onClick={() => setEditing(open ? null : part.id)}>
                  {open ? 'Fermer' : 'Modifier'}<span className="visually-hidden"> {part.title}</span>
                </Button>
              </div>
              {open && (
                <div id={`reglage-${part.id}`} className={page.partBody}>
                  <part.Fields profile={draft} onChange={setDraft} />
                </div>
              )}
            </li>
          );
        })}
      </ul>

      {dirty && (
        <section className={`${layout.note} mt-4`} aria-labelledby="appliquer">
          <h2 className="title-sm" id="appliquer">Quand appliquer tes changements ?</h2>
          <fieldset className={page.when}>
            <legend className="visually-hidden">Quand appliquer les changements</legend>
            {[
              { now: false, title: 'À partir de la semaine prochaine', detail: 'Ta semaine et ta liste en cours ne bougent pas.' },
              { now: true, title: 'Maintenant', detail: 'Je recompose ta semaine. Les cases déjà cochées seront perdues.' },
            ].map((o) => (
              <label key={String(o.now)} className={`${layout.card} ${page.whenOption}`}>
                <input type="radio" name="quand" checked={applyNow === o.now} onChange={() => setApplyNow(o.now)} className={page.radio} />
                <span><b>{o.title}</b><br /><span className={layout.muted}>{o.detail}</span></span>
              </label>
            ))}
          </fieldset>
          {!valid && <p className={page.error}>Moins de 3 recettes correspondent : élargis un critère pour enregistrer.</p>}
          <div className={`${layout.row} mt-3`}>
            <Button variant="dark" onClick={save} disabled={!valid} className="grow">Enregistrer</Button>
            <Button variant="outline" onClick={() => setDraft(current)}>Annuler</Button>
          </div>
        </section>
      )}

      <Section title="Mes progrès" id="progres">
        <ButtonLink href="/progres" variant="light" block className={layout.between}>
          <span className={layout.row}><IconBadge icon="passport" tone="passport" />Passeport, cagnotte et séries</span>
        </ButtonLink>
      </Section>

      <Section title="Mes données" id="donnees">
        <p className={layout.muted}>Tes réglages, ton placard et tes progrès restent sur cet appareil.</p>
        <div className={`${layout.stack} mt-3`}>
          <ButtonLink href="/mentions-legales" variant="link">Mentions légales et confidentialité</ButtonLink>
          <Button variant="link" danger onClick={() => setConfirmReset(true)}>Tout effacer et recommencer</Button>
        </div>
      </Section>

      <Dialog open={confirmReset} onClose={() => setConfirmReset(false)} title="Tout effacer ?">
        <p>Ceci supprime de cet appareil tes réglages, ta semaine, ton placard, ta cagnotte, ton passeport et tes recettes importées. Tu ne pourras pas revenir en arrière.</p>
        <div className={`${layout.stack} mt-5`}>
          <Button
            variant="dark"
            block
            className={ui.destructive}
            onClick={() => {
              dispatch({ type: 'reset' });
              router.replace('/bienvenue');
            }}
          >
            Tout effacer
          </Button>
          <Button variant="outline" block onClick={() => setConfirmReset(false)}>Garder mes données</Button>
        </div>
      </Dialog>
    </Page>
  );
}
