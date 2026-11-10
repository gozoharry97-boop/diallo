'use client';

import { useMemo, useState } from 'react';
import { CONTINENTS, CUISINES, DIETS, EXCLUSIONS, MAX_MINUTES_OPTIONS, SPECIALTY_STORES, SUPERMARKETS } from '@/domain/data/catalog';
import { candidates, cheapestWeekTotal } from '@/domain/planner';
import type { CuisineId, Profile } from '@/domain/types';
import { usePrices } from '@/state/usePrices';
import { Button } from './ui/Button';
import { CheckChips, RadioChips } from './ui/ChoiceGroup';
import { Icon } from './ui/Icon';
import { Stepper } from './ui/Stepper';
import { layout } from './layout/Page';
import styles from './ProfileForm.module.css';

const toggle = <T,>(list: readonly T[], value: T): T[] => (list.includes(value) ? list.filter((v) => v !== value) : [...list, value]);

type Setter = (profile: Profile) => void;

export function StoresFields({ profile, onChange }: { profile: Profile; onChange: Setter }) {
  return (
    <div className={styles.fields}>
      <RadioChips
        legend="Ton supermarché principal"
        options={SUPERMARKETS.map((s) => ({ value: s.id, label: s.name }))}
        value={profile.store}
        onChange={(store) => onChange({ ...profile, store })}
      />
      <CheckChips
        legend="Tu passes aussi par… (facultatif)"
        hint="Chaque produit ira dans la liste du magasin où il coûte le moins cher."
        layout="cards"
        options={SPECIALTY_STORES.map((s) => ({ value: s.id, label: s.name, detail: s.description }))}
        values={profile.extras}
        onToggle={(id) => onChange({ ...profile, extras: toggle(profile.extras, id) })}
      />
    </div>
  );
}

export function CuisinesFields({ profile, onChange }: { profile: Profile; onChange: Setter }) {
  const [open, setOpen] = useState<string | null>(null);
  const openToAll = profile.cuisines.length === 0;
  return (
    <div className={styles.fields}>
      <label className={styles.openAll}>
        <input type="checkbox" checked={openToAll} onChange={() => onChange({ ...profile, cuisines: [] })} disabled={openToAll} />
        <Icon name="globe" size={24} />
        <span>
          <span className={styles.openAllTitle}>Ouvert à tout</span>
          <span className={styles.openAllDetail}>{CUISINES.length} cuisines, je varie chaque soir</span>
        </span>
      </label>
      <div>
        <p className={styles.subhead}>Ou choisis par continent</p>
        <ul role="list" className={`${layout.stack} list-reset`}>
          {CONTINENTS.map((continent) => {
            const items = CUISINES.filter((c) => c.continent === continent.id);
            const count = items.filter((c) => profile.cuisines.includes(c.id)).length;
            const expanded = open === continent.id;
            return (
              <li key={continent.id} className={styles.continent}>
                <div className={styles.continentHead}>
                  <span>
                    <span className={styles.continentName}>{continent.name}</span>
                    <span className={count ? styles.continentCount : styles.continentSummary}>
                      {count ? `${count} ${count > 1 ? 'cuisines choisies' : 'cuisine choisie'}` : continent.summary}
                    </span>
                  </span>
                  <Button variant="soft" aria-expanded={expanded} aria-controls={`cuisines-${continent.id}`} onClick={() => setOpen(expanded ? null : continent.id)}>
                    {expanded ? 'Masquer' : 'Choisir'}
                  </Button>
                </div>
                {expanded && (
                  <div id={`cuisines-${continent.id}`} className={styles.continentBody}>
                    <CheckChips<CuisineId>
                      legend={`Cuisines : ${continent.name}`}
                      hideLegend
                      options={items.map((c) => ({ value: c.id, label: c.name }))}
                      values={profile.cuisines}
                      onToggle={(id) => onChange({ ...profile, cuisines: toggle(profile.cuisines, id) })}
                    />
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

export function DietFields({ profile, onChange }: { profile: Profile; onChange: Setter }) {
  const [showExclusions, setShowExclusions] = useState(profile.exclusions.length > 0);
  const count = candidates(profile).length;
  const diet = DIETS.find((d) => d.id === profile.diet);
  return (
    <div className={styles.fields}>
      <div>
        <RadioChips legend="Ton alimentation" options={DIETS.map((d) => ({ value: d.id, label: d.name }))} value={profile.diet} onChange={(d) => onChange({ ...profile, diet: d })} />
        {diet?.hint && <p className={styles.hint}>{diet.hint}</p>}
      </div>
      <div>
        <Button variant="light" block aria-expanded={showExclusions} aria-controls="exclusions" onClick={() => setShowExclusions((v) => !v)} className={styles.disclosure}>
          <span>J’ai des allergies ou des interdits{profile.exclusions.length ? ` (${profile.exclusions.length})` : ''}</span>
          <Icon name="chevronDown" />
        </Button>
        {showExclusions && (
          <div id="exclusions" className={styles.continentBody}>
            <CheckChips
              legend="À éviter"
              hideLegend
              options={EXCLUSIONS.map((e) => ({ value: e.id, label: e.name }))}
              values={profile.exclusions}
              onToggle={(id) => onChange({ ...profile, exclusions: toggle(profile.exclusions, id) })}
            />
          </div>
        )}
      </div>
      <RadioChips legend="Temps maximum en cuisine" options={MAX_MINUTES_OPTIONS} value={profile.maxMinutes} onChange={(m) => onChange({ ...profile, maxMinutes: m })} />
      <p className={count >= 3 ? styles.count : styles.countLow} role="status">
        <Icon name={count >= 3 ? 'check' : 'alert'} size={18} strokeWidth={2.2} />
        {count >= 3 ? `${count} recettes correspondent à tes choix` : `Seulement ${count} recette${count > 1 ? 's' : ''} : élargis un critère pour continuer.`}
      </p>
    </div>
  );
}

export function HouseholdBudgetFields({ profile, onChange }: { profile: Profile; onChange: Setter }) {
  const { prices } = usePrices(profile);
  const minimum = useMemo(
    () => cheapestWeekTotal(profile, prices),
    // Le minimum ne dépend pas du budget lui-même.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [prices, profile.people, profile.dinners, profile.diet, profile.exclusions, profile.cuisines, profile.maxMinutes],
  );
  const rounded = Number.isFinite(minimum) ? Math.ceil(minimum) : null;
  return (
    <div className={styles.fields}>
      <div className={layout.stack}>
        <Stepper label="Personnes à table" value={profile.people} min={1} max={8} unitLabel={['Une personne', '']} onChange={(people) => onChange({ ...profile, people })} />
        <Stepper label="Dîners par semaine" value={profile.dinners} min={3} max={7} unitLabel={['Un dîner', '']} onChange={(dinners) => onChange({ ...profile, dinners })} />
      </div>
      <div className={layout.card}>
        <label htmlFor="budget" className={styles.subhead}>Budget de la semaine pour les dîners</label>
        <p className={styles.budget} aria-hidden="true">{profile.budget} €</p>
        <input
          id="budget"
          type="range"
          min={10}
          max={250}
          step={1}
          value={profile.budget}
          aria-valuetext={`${profile.budget} euros`}
          onChange={(e) => onChange({ ...profile, budget: Number(e.target.value) })}
          className={styles.range}
        />
        {rounded !== null && <p className={`${layout.muted} ${layout.small}`}>Minimum réaliste avec tes magasins : environ {rounded} €</p>}
        {rounded !== null && profile.budget < rounded && (
          <p className={`${layout.note} mt-3`}>
            C’est sous le minimum : je te proposerai la semaine la moins chère possible et je t’indiquerai l’écart.
          </p>
        )}
      </div>
    </div>
  );
}
