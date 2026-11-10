import 'server-only';
import { z } from 'zod';
import { getSupabase } from './supabase';

export const SharedListSchema = z.object({
  title: z.string().max(120),
  stores: z.array(
    z.object({
      name: z.string().max(60),
      items: z.array(z.object({ key: z.string().max(40), label: z.string().max(80), detail: z.string().max(120), price: z.string().max(20) })).max(80),
    }),
  ).max(10),
});

export type SharedList = z.infer<typeof SharedListSchema>;

export interface StoredList {
  payload: SharedList;
  checked: Record<string, boolean>;
}

/** Jeton non devinable : seul quelqu'un qui a le lien peut ouvrir la liste. */
const newToken = () => crypto.randomUUID().replace(/-/g, '').slice(0, 16);

export async function createSharedList(payload: SharedList): Promise<string | null> {
  const supabase = getSupabase();
  if (!supabase) return null;
  const token = newToken();
  const { error } = await supabase.from('shared_lists').insert({ token, payload });
  if (error) {
    console.error('[partage] création impossible', error.message);
    return null;
  }
  return token;
}

export async function getSharedList(token: string): Promise<StoredList | null> {
  const supabase = getSupabase();
  if (!supabase) return null;
  const { data } = await supabase
    .from('shared_lists')
    .select('payload, checked')
    .eq('token', token)
    .gt('expires_at', new Date().toISOString())
    .maybeSingle();
  return data ? { payload: data.payload as SharedList, checked: (data.checked ?? {}) as Record<string, boolean> } : null;
}

/** Coche ou décoche un article (mise à jour atomique côté base) ; renvoie l'état complet. */
export async function setItemChecked(token: string, key: string, checked: boolean): Promise<Record<string, boolean> | null> {
  const supabase = getSupabase();
  if (!supabase) return null;
  const { data, error } = await supabase.rpc('set_shared_item', { p_token: token, p_key: key, p_checked: checked });
  return error || !data ? null : (data as Record<string, boolean>);
}
