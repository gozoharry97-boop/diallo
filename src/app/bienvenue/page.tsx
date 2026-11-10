'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { candidates } from '@/domain/planner';
import { bestPrices, profileStoreIds, referenceTable } from '@/domain/pricing';
import type { Profile } from '@/domain/types';
import { Brand, Loading, Page } from '@/components/layout/Page';
import { DialloSays } from '@/components/Mascot';
import { CuisinesFields, DietFields, HouseholdBudgetFields, StoresFields } from '@/components/ProfileForm';
import { Button } from '@/components/ui/Button';
import { DEFAULT_PROFILE, useAppState } from '@/state/store';
import { composeWeek } from '@/state/useWeek';
import styles from './bienvenue.module.css';

const STEPS = [
  { question: 'Où fais-tu tes courses ?', hint: 'Je prendrai les prix de ces magasins pour ta liste.', Fields: StoresFields },
  { question: 'Qu’est-ce qui te fait envie ?', hint: 'Garde tout ouvert et je te fais voyager chaque soir.', Fields: CuisinesFields },
  { question: 'Comment tu manges ?', hint: 'Je ne te proposerai que des plats compatibles.', Fields: DietFields },
  { question: 'Dernière question : le budget !', hint: 'Combien êtes-vous, et combien veux-tu dépenser pour les dîners ?', Fields: HouseholdBudgetFields },
];

/** E02–E05 — Accueil guidé par Diallo, en 4 étapes. */
export default function OnboardingPage() {
  const { state, hydrated } = useAppState();
  // On attend l'état sauvegardé : un profil existant sert de point de départ.
  if (!hydrated) return <Loading />;
  return <Onboarding initial={state.profile ?? DEFAULT_PROFILE} />;
}

function Onboarding({ initial }: { initial: Profile }) {
  const router = useRouter();
  const { state, dispatch } = useAppState();
  const [step, setStep] = useState(0);
  const [profile, setProfile] = useState<Profile>(initial);

  const { question, hint, Fields } = STEPS[step];
  const last = step === STEPS.length - 1;
  const blocked = step >= 2 && candidates(profile).length < 3;

  const finish = () => {
    // Prix de référence immédiats ; la page Semaine les met à jour avec les prix réels.
    const prices = bestPrices(profile, referenceTable(profileStoreIds(profile)));
    dispatch({ type: 'start', profile, plan: composeWeek(profile, state.pantry, prices) });
    router.push('/semaine');
  };

  return (
    <Page narrow>
      <div className={styles.top}>
        <Brand href="/" />
        <span className={styles.stepLabel}>Étape {step + 1} sur {STEPS.length}</span>
      </div>
      <div className={styles.progress} aria-hidden="true">
        {STEPS.map((_, i) => <span key={i} className={i <= step ? styles.segmentOn : styles.segment} />)}
      </div>

      <div className={styles.question}>
        <DialloSays size={72} title={<h1 className={styles.title}>{question}</h1>}>
          <p className={styles.hint}>{hint}</p>
        </DialloSays>
      </div>

      <div className={styles.body}>
        <Fields profile={profile} onChange={setProfile} />
      </div>

      <div className={styles.footer}>
        {step > 0 && <Button variant="outline" className={styles.back} onClick={() => setStep(step - 1)}>Retour</Button>}
        <Button variant="primary" block disabled={blocked} onClick={() => (last ? finish() : setStep(step + 1))}>
          {last ? 'Composer ma semaine' : 'Continuer'}
        </Button>
      </div>
    </Page>
  );
}
