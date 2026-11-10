'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState, useSyncExternalStore } from 'react';
import { Brand, Loading, Page, PageHeader, layout } from '@/components/layout/Page';
import { ShoppingItem } from '@/components/courses/ShoppingItem';
import { decodeSnapshot, type SharePayload } from '@/components/courses/shopping-list';
import styles from '@/components/courses/courses.module.css';

type Status = 'loading' | 'ready' | 'missing';

/** Liste ouverte depuis un lien partagé : synchronisée (?t=) ou instantanée (#d=). */
const subscribeHash = (onChange: () => void) => {
  window.addEventListener('hashchange', onChange);
  return () => window.removeEventListener('hashchange', onChange);
};

type Remote = { status: Status; payload: SharePayload | null; checked: Record<string, boolean> };

/** Liste ouverte depuis un lien partagé : synchronisée (?t=) ou instantanée (#d=). */
export function SharedListView() {
  const token = useSearchParams().get('t');
  const hash = useSyncExternalStore(subscribeHash, () => location.hash, () => null);
  const snapshot = useMemo(() => (hash === null ? null : decodeSnapshot(new URLSearchParams(hash.slice(1)).get('d') ?? '')), [hash]);
  const [remote, setRemote] = useState<Remote>({ status: 'loading', payload: null, checked: {} });
  const [localChecked, setLocalChecked] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (!token) return;
    let alive = true;
    const load = () =>
      fetch(`/api/share?token=${token}`)
        .then((res) => (res.ok ? (res.json() as Promise<{ payload: SharePayload; checked: Record<string, boolean> }>) : null))
        .catch(() => null)
        .then((data) => {
          if (!alive) return;
          setRemote(data ? { status: 'ready', payload: data.payload, checked: data.checked } : (r) => ({ ...r, status: r.payload ? r.status : 'missing' }));
        });
    load();
    const id = setInterval(load, 10000);
    return () => {
      alive = false;
      clearInterval(id);
    };
  }, [token]);

  const payload = token ? remote.payload : snapshot;
  const checked = token ? remote.checked : localChecked;
  const status: Status = token ? remote.status : hash === null ? 'loading' : snapshot ? 'ready' : 'missing';

  const toggle = async (key: string) => {
    const next = !checked[key];
    if (!token) return setLocalChecked((c) => ({ ...c, [key]: next }));
    setRemote((r) => ({ ...r, checked: { ...r.checked, [key]: next } }));
    const res = await fetch('/api/share', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ token, key, checked: next }) }).catch(() => null);
    if (res?.ok) {
      const fresh = ((await res.json()) as { checked: Record<string, boolean> }).checked;
      setRemote((r) => ({ ...r, checked: fresh }));
    }
  };

  if (status === 'loading') return <Loading />;
  return (
    <Page narrow>
      <Brand href="/" />
      {status === 'missing' || !payload ? (
        <PageHeader title="Liste introuvable">
          <p className={`${layout.muted} mt-2`}>Ce lien a expiré ou n’est pas complet. Demande à la personne qui l’a partagé de t’en renvoyer un.</p>
        </PageHeader>
      ) : (
        <>
          <PageHeader title={payload.title}>
            <p className={`${layout.muted} mt-2`}>
              {token ? 'Les cases cochées se mettent à jour pour tout le monde.' : 'Lien instantané : tes coches restent sur ton téléphone.'}
            </p>
          </PageHeader>
          {payload.stores.map((store) => (
            <section key={store.name} className={styles.store} aria-label={store.name}>
              <h2 className={styles.storeName}>{store.name}</h2>
              <ul className={`${styles.items} mt-3`} role="list">
                {store.items.map((item) => (
                  <ShoppingItem key={item.key} name={item.label} detail={item.detail} price={item.price} done={Boolean(checked[item.key])} onToggle={() => toggle(item.key)} />
                ))}
              </ul>
            </section>
          ))}
        </>
      )}
    </Page>
  );
}
