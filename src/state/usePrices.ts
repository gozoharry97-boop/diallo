'use client';

import { useEffect, useMemo, useState } from 'react';
import { bestPrices, profileStoreIds, referenceTable } from '@/domain/pricing';
import type { BestPrices, PriceTable, Profile } from '@/domain/types';

const cache = new Map<string, PriceTable>();

/**
 * Meilleurs prix pour les magasins du profil. Affiche tout de suite les prix de référence,
 * puis les remplace par la table du serveur (Open Prices) dès qu'elle arrive.
 */
export function usePrices(profile: Pick<Profile, 'store' | 'extras'> | null): { prices: BestPrices; live: boolean } {
  const key = profile ? profileStoreIds(profile).join(',') : '';
  const [fetched, setFetched] = useState<{ key: string; table: PriceTable } | null>(null);
  const table = fetched?.key === key ? fetched.table : (cache.get(key) ?? null);

  useEffect(() => {
    if (!key || cache.has(key)) return;
    let cancelled = false;
    fetch(`/api/prices?stores=${encodeURIComponent(key)}`)
      .then((res) => (res.ok ? (res.json() as Promise<PriceTable>) : null))
      .then((data) => {
        if (!data || cancelled) return;
        cache.set(key, data);
        setFetched({ key, table: data });
      })
      .catch(() => {
        // Hors ligne : on garde les prix de référence calculés sur l'appareil.
      });
    return () => {
      cancelled = true;
    };
  }, [key]);

  return useMemo(() => {
    if (!profile) return { prices: {}, live: false };
    return { prices: bestPrices(profile, table ?? referenceTable(profileStoreIds(profile))), live: Boolean(table) };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, table]);
}
