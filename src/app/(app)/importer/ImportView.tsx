'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { PLATFORM_LABEL, parseVideoUrl } from '@/domain/import/platform';
import type { Mood } from '@/domain/game';
import type { Recipe } from '@/domain/types';
import { BackLink, Page, PageHeader, layout } from '@/components/layout/Page';
import { DialloSays } from '@/components/Mascot';
import { Button, ButtonLink } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import ui from '@/components/ui/ui.module.css';
import { useAppState } from '@/state/store';
import styles from './import.module.css';

type Phase = 'paste' | 'cooking' | 'need-text' | 'no-recipe' | 'unavailable' | 'error';

const STEPS = ['Je regarde la vidéo', 'Je note les ingrédients et les étapes', 'J’adapte les quantités pour ton foyer', 'Je cherche les prix dans tes magasins'];

/** Premier lien trouvé dans un texte partagé (TikTok met souvent le lien dans « text »). */
const firstUrl = (...values: (string | null)[]) => values.flatMap((v) => v?.match(/https?:\/\/\S+/g) ?? [])[0] ?? '';

/** E20 — Importer une recette vidéo : coller ou partager un lien, analyse « ça mijote ». */
export function ImportView() {
  const router = useRouter();
  const params = useSearchParams();
  const { state, dispatch } = useAppState();
  const [url, setUrl] = useState(() => firstUrl(params.get('url'), params.get('text'), params.get('title')));
  const [text, setText] = useState('');
  const [phase, setPhase] = useState<Phase>('paste');
  const [urlError, setUrlError] = useState(false);
  const [progress, setProgress] = useState(0);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const started = useRef(false);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const run = async (withText?: string) => {
    if (!parseVideoUrl(url)) {
      setUrlError(true);
      setPhase('paste');
      return;
    }
    setPhase('cooking');
    setProgress(0);
    timers.current.forEach(clearTimeout);
    timers.current = STEPS.slice(0, -1).map((_, i) => setTimeout(() => setProgress(i + 1), (i + 1) * 900));
    const res = await fetch('/api/import', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ url, text: withText || undefined }) }).catch(() => null);
    const data = res ? ((await res.json().catch(() => null)) as { status: string; recipe?: Recipe; guessed?: string[] } | null) : null;
    timers.current.forEach(clearTimeout);
    setProgress(STEPS.length);

    if (data?.status === 'ok' && data.recipe) {
      dispatch({ type: 'saveImport', record: { id: data.recipe.id, recipe: data.recipe, guessed: data.guessed ?? [], importedAt: new Date().toISOString(), addedTo: null } });
      router.push(`/importer/resultat?id=${data.recipe.id}`);
      return;
    }
    const next: Record<string, Phase> = { 'invalid-url': 'paste', 'need-text': 'need-text', 'no-recipe': 'no-recipe', 'unavailable-video': 'unavailable' };
    if (data?.status === 'invalid-url') setUrlError(true);
    setPhase(next[data?.status ?? ''] ?? 'error');
  };

  // Partage depuis une autre app (Web Share Target) : on lance directement l'analyse.
  useEffect(() => {
    const shared = ['url', 'text', 'title'].some((k) => params.get(k) !== null);
    if (!started.current && url && shared) {
      started.current = true;
      run();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const ref = parseVideoUrl(url);
  const mood: Mood = phase === 'cooking' ? (progress >= STEPS.length ? 'fier' : 'concentre') : phase === 'paste' || phase === 'need-text' ? 'content' : 'inquiet';
  const bubble: Record<Phase, string> = {
    paste: 'Vu une recette sur les réseaux ? Colle le lien : je t’en fais une version cocotte-minute, avec ta liste de courses.',
    cooking: 'Ça mijote… je regarde la vidéo pour toi.',
    'need-text': `${ref ? PLATFORM_LABEL[ref.platform] : 'Cette plateforme'} ne me laisse pas lire la description de cette vidéo. Colle-la ici, je m’occupe du reste.`,
    'no-recipe': 'Je n’ai trouvé ni ingrédients ni étapes dans cette vidéo.',
    unavailable: 'Je n’arrive pas à ouvrir cette vidéo : elle est peut-être privée ou supprimée.',
    error: 'L’import ne répond pas pour le moment. Réessaie dans quelques minutes.',
  };

  return (
    <Page narrow>
      <BackLink href="/semaine">Ma semaine</BackLink>
      <PageHeader title="Importer une recette vidéo" />
      <div className="mt-5">
        <DialloSays mood={mood} size={76}>
          <p>{bubble[phase]}</p>
        </DialloSays>
      </div>

      {(phase === 'paste' || phase === 'need-text') && (
        <form
          className={`${layout.card} ${styles.form}`}
          onSubmit={(e) => {
            e.preventDefault();
            run(phase === 'need-text' ? text : undefined);
          }}
          noValidate
        >
          <label htmlFor="lien-video" className={ui.label}>Lien de la vidéo</label>
          <input
            id="lien-video"
            type="url"
            inputMode="url"
            autoComplete="off"
            className={`${ui.field} mono`}
            placeholder="https://www.tiktok.com/@…/video/…"
            value={url}
            aria-invalid={urlError}
            aria-describedby={urlError ? 'lien-erreur lien-aide' : 'lien-aide'}
            onChange={(e) => {
              setUrl(e.target.value);
              setUrlError(false);
              if (phase === 'need-text') setPhase('paste');
            }}
          />
          {urlError && (
            <p id="lien-erreur" role="alert" className={ui.error}>
              <Icon name="alert" size={18} strokeWidth={2} />
              Ce lien ne vient pas de TikTok, Instagram ou YouTube. Vérifie-le ou colle-en un autre.
            </p>
          )}
          <p id="lien-aide" className={`${layout.muted} ${layout.small} mt-2`}>TikTok, Instagram (Reels) ou YouTube (vidéos et Shorts).</p>

          {phase === 'need-text' && (
            <div className="mt-4">
              <label htmlFor="description" className={ui.label}>Description de la vidéo</label>
              <textarea id="description" className={ui.field} value={text} onChange={(e) => setText(e.target.value)} placeholder="Ingrédients, étapes, ce qui est écrit sous la vidéo…" />
            </div>
          )}

          <Button className="mt-4" type="submit" variant="primary" block disabled={!url || (phase === 'need-text' && text.trim().length < 20)}>
            Préparer ma recette
          </Button>
        </form>
      )}

      {phase === 'paste' && (
        <p className={styles.tip}>
          <Icon name="share" size={22} strokeWidth={2} />
          <span><b>Plus rapide sur Android :</b> ajoute Diallo à ton écran d’accueil, puis dans TikTok ou Instagram, touche Partager puis Diallo.</span>
        </p>
      )}

      {phase === 'cooking' && (
        <section className={`${layout.card} ${styles.form}`} aria-label="Préparation en cours">
          <p className={`mono ${layout.muted} ${layout.small}`} style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{url}</p>
          <ol className={styles.steps} aria-live="polite">
            {STEPS.map((step, i) => {
              const status = i < progress ? 'done' : i === progress ? 'current' : 'todo';
              return (
                <li key={step} className={styles[status]}>
                  <span className={styles.dot} aria-hidden="true">{status === 'done' && <Icon name="check" size={14} strokeWidth={3.2} />}</span>
                  <span style={{ flex: 1 }}>{step}</span>
                  <span className={layout.small}>{status === 'done' ? 'Fait' : status === 'current' ? 'En cours…' : 'À venir'}</span>
                </li>
              );
            })}
          </ol>
        </section>
      )}

      {(phase === 'no-recipe' || phase === 'unavailable' || phase === 'error') && (
        <section className={`${layout.note} ${styles.form}`}>
          <h2 className="title-sm">
            {phase === 'no-recipe' ? 'Pas de recette dans cette vidéo' : phase === 'unavailable' ? 'Vidéo introuvable' : 'Import indisponible'}
          </h2>
          {phase === 'no-recipe' && <p className="mt-2">Ça arrive avec les vidéos de dégustation ou de restaurant.</p>}
          <div className={`${layout.stack} mt-4`}>
            <Button variant="dark" block onClick={() => { setUrl(''); setPhase('paste'); }}>Essayer un autre lien</Button>
            {phase !== 'error' && <Button variant="outline" block onClick={() => setPhase('need-text')}>Coller la description moi-même</Button>}
            <ButtonLink href="/semaine" variant="outline" block>Chercher le plat dans mes recettes</ButtonLink>
          </div>
        </section>
      )}

      {phase === 'paste' && state.imports.length > 0 && (
        <section className="mt-8" aria-labelledby="derniers">
          <h2 id="derniers" style={{ fontSize: 'var(--text-lg)', fontWeight: 700, marginBottom: 'var(--space-3)' }}>Mes derniers imports</h2>
          <ul role="list" className={`${layout.stack} list-reset`}>
            {state.imports.slice(0, 5).map((imp) => (
              <li key={imp.id}>
                <Link href={`/importer/resultat?id=${imp.id}`} className={`${layout.card} ${styles.history}`}>
                  <span className={styles.thumb} aria-hidden="true"><Icon name="play" size={16} /></span>
                  <span>
                    <span style={{ display: 'block', fontWeight: 600 }}>{imp.recipe.name}</span>
                    <span className={`${layout.muted} ${layout.small}`}>
                      {imp.recipe.source ? PLATFORM_LABEL[imp.recipe.source.platform] : 'Vidéo'}
                      {imp.addedTo === 'week' ? ', dans ta semaine' : imp.addedTo === 'list' ? ', dans ta liste' : ''}
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </Page>
  );
}
