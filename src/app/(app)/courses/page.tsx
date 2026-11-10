'use client';

import { useMemo, useState } from 'react';
import { STORES_BY_ID } from '@/domain/data/catalog';
import { eur, plural } from '@/domain/format';
import { Page, PageHeader, layout } from '@/components/layout/Page';
import { DialloSays } from '@/components/Mascot';
import { ShoppingItem } from '@/components/courses/ShoppingItem';
import { encodeSnapshot, groupByStore, lineDetail, sharePayload } from '@/components/courses/shopping-list';
import styles from '@/components/courses/courses.module.css';
import { Button } from '@/components/ui/Button';
import { Dialog } from '@/components/ui/Dialog';
import { Icon } from '@/components/ui/Icon';
import { IconBadge, ProgressBar } from '@/components/ui/IconBadge';
import { useToast } from '@/components/ui/Toast';
import { useWeek } from '@/state/useWeek';
import ui from '@/components/ui/ui.module.css';

/** E09 — Liste de courses par magasin puis par rayon. */
export default function CoursesPage() {
  const { state, dispatch, view } = useWeek();
  const toast = useToast();
  const [sharing, setSharing] = useState(false);
  const profile = state.profile!;
  const groups = useMemo(() => (view ? groupByStore(view.cost.lines, profile) : []), [view, profile]);
  if (!view) return null;

  const toBuy = groups.flatMap((g) => g.aisles.flatMap((a) => a.lines));
  const doneCount = toBuy.filter((l) => state.checked[l.key]).length;
  const left = toBuy.reduce((sum, l) => sum + (state.checked[l.key] ? 0 : l.cost), 0);
  const owned = view.cost.lines.filter((l) => l.packs === 0);
  const allDone = toBuy.length > 0 && doneCount === toBuy.length;
  const specialty = groups.find((g) => STORES_BY_ID[g.storeId].kind === 'specialty');

  const markOwned = (key: (typeof toBuy)[number]['key'], name: string) => {
    const previous = state.pantry[key] ?? null;
    dispatch({ type: 'setPantry', key, value: true });
    toast({ message: `${name} retiré de la liste`, actionLabel: 'Annuler', onAction: () => dispatch({ type: 'setPantry', key, value: previous }) });
  };

  return (
    <Page>
      <div className={layout.topbar}>
        <span />
        <Button variant="outline" onClick={() => setSharing(true)} disabled={!toBuy.length}>
          <Icon name="share" size={18} strokeWidth={2} />
          Partager la liste
        </Button>
      </div>
      <PageHeader title="Ma liste" subtitle={null}>
        <p className={layout.muted}>{plural(toBuy.length, 'article')} dans {plural(groups.length, 'magasin')}</p>
      </PageHeader>

      <section className={`${layout.card} ${styles.summary}`} aria-label="Reste à payer">
        <div className={layout.between}>
          <span className={layout.muted}>Reste à mettre dans le caddie</span>
          <span className={styles.left} aria-live="polite">{eur(left)}</span>
        </div>
        <div className="mt-3">
          <ProgressBar ratio={toBuy.length ? doneCount / toBuy.length : 1} color="var(--color-success)" />
        </div>
        <p className={`${layout.muted} ${layout.small} mt-2`}>{doneCount} sur {toBuy.length} dans le caddie</p>
      </section>

      <div className="mt-4">
        <DialloSays mood={allDone ? 'fier' : 'content'} size={52}>
          <p>
            {allDone
              ? 'Tout est dans le caddie ! Garde ton ticket : bientôt, tu pourras me dire si mes prix étaient justes.'
              : specialty
                ? `Passe aussi chez ${specialty.name} : ${plural(specialty.aisles.reduce((n, a) => n + a.lines.length, 0), 'article')} y sont moins chers.`
                : 'Ta liste suit l’ordre des rayons. Coche au fur et à mesure.'}
          </p>
        </DialloSays>
      </div>

      {toBuy.length === 0 && <p className={`${layout.note} mt-6`}>Rien à acheter : tout est déjà dans ton placard.</p>}

      {groups.map((group) => (
        <section key={group.storeId} className={styles.store} aria-labelledby={`magasin-${group.storeId}`}>
          <div className={styles.storeHead}>
            <h2 id={`magasin-${group.storeId}`} className={styles.storeName}>
              <IconBadge icon="store" tone={STORES_BY_ID[group.storeId].kind === 'specialty' ? 'passport' : 'store'} />
              {group.name}
            </h2>
            <span className="mono strong">{eur(group.subtotal)}</span>
          </div>
          {group.aisles.map((aisle) => (
            <div key={aisle.id}>
              <h3 className={styles.aisle}>{aisle.name}</h3>
              <ul className={styles.items} role="list">
                {aisle.lines.map((line) => (
                  <ShoppingItem
                    key={line.key}
                    name={line.ingredient.name}
                    detail={lineDetail(line)}
                    price={eur(line.cost)}
                    done={Boolean(state.checked[line.key])}
                    onToggle={() => dispatch({ type: 'toggleChecked', key: line.key })}
                    onOwned={() => markOwned(line.key, line.ingredient.name)}
                  />
                ))}
              </ul>
            </div>
          ))}
        </section>
      ))}

      {view.cost.unpriced.length > 0 && (
        <section className={styles.store} aria-labelledby="hors-catalogue">
          <h2 id="hors-catalogue" className={styles.storeName}>À trouver en rayon</h2>
          <p className={`${layout.muted} ${layout.small}`}>Ingrédients de tes recettes vidéo absents de mon catalogue : non chiffrés.</p>
          <ul role="list" className={`${layout.stack} list-reset mt-3`}>
            {view.cost.unpriced.map((x, i) => (
              <li key={`${x.name}-${i}`} className={layout.card}>{x.name}{x.quantity ? ` (${x.quantity}${x.unit ? ` ${x.unit}` : ''})` : ''}</li>
            ))}
          </ul>
        </section>
      )}

      {owned.length > 0 && (
        <section className={styles.store} aria-labelledby="deja-chez-toi">
          <h2 id="deja-chez-toi" className={styles.aisle} style={{ color: 'var(--color-ink-soft)' }}>Déjà chez toi</h2>
          <p className={layout.muted}>{owned.map((l) => l.ingredient.name).join(', ')}.</p>
        </section>
      )}

      <ShareDialog open={sharing} onClose={() => setSharing(false)} payload={sharePayload(groups, 'Liste de courses Diallo')} />
    </Page>
  );
}

/** E09a — Partager la liste par lien (synchronisée si le serveur est configuré, instantanée sinon). */
function ShareDialog({ open, onClose, payload }: { open: boolean; onClose: () => void; payload: ReturnType<typeof sharePayload> }) {
  const [link, setLink] = useState<{ url: string; synced: boolean } | null>(null);
  const [copied, setCopied] = useState(false);
  const [busy, setBusy] = useState(false);

  const create = async () => {
    setBusy(true);
    const res = await fetch('/api/share', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) }).catch(() => null);
    const data = res?.ok ? ((await res.json()) as { token: string }) : null;
    setLink(
      data
        ? { url: `${location.origin}/liste?t=${data.token}`, synced: true }
        : { url: `${location.origin}/liste#d=${encodeSnapshot(payload)}`, synced: false },
    );
    setBusy(false);
  };

  const copy = async () => {
    if (!link) return;
    try {
      await navigator.clipboard.writeText(link.url);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  };

  const close = () => {
    setLink(null);
    setCopied(false);
    onClose();
  };

  return (
    <Dialog open={open} onClose={close} title="Partager ma liste">
      <p className={layout.muted}>Ouvre ce lien sur ton téléphone ou envoie-le à ta coloc. Pas besoin de compte.</p>
      {!link ? (
        <Button className="mt-4" variant="primary" block onClick={create} disabled={busy}>
          {busy ? 'Création du lien…' : 'Créer le lien'}
        </Button>
      ) : (
        <div className="mt-4">
          <label htmlFor="lien-liste" className="visually-hidden">Lien de la liste</label>
          <input id="lien-liste" readOnly value={link.url} className={`mono ${ui.textInput}`} onFocus={(e) => e.currentTarget.select()} />
          <p className={`${layout.muted} ${layout.small} mt-2`}>
            {link.synced ? 'Les cases cochées se mettent à jour pour tout le monde.' : 'Lien instantané : chacun coche de son côté.'}
          </p>
          <div className={`${layout.stack} mt-3`}>
            <Button variant={copied ? 'success' : 'primary'} block onClick={copy}>
              {copied && <Icon name="check" size={18} strokeWidth={2.6} />}
              <span aria-live="polite">{copied ? 'Lien copié' : 'Copier le lien'}</span>
            </Button>
            {typeof navigator !== 'undefined' && 'share' in navigator && (
              <Button variant="outline" block onClick={() => navigator.share({ title: payload.title, url: link.url }).catch(() => {})}>
                Envoyer…
              </Button>
            )}
          </div>
        </div>
      )}
    </Dialog>
  );
}
