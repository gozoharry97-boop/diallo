import 'server-only';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { env } from './env';

let client: SupabaseClient | null | undefined;

/** Client Supabase côté serveur (clé de service), ou null si non configuré. */
export function getSupabase(): SupabaseClient | null {
  if (client !== undefined) return client;
  client = env.supabaseUrl && env.supabaseServiceKey
    ? createClient(env.supabaseUrl, env.supabaseServiceKey, { auth: { persistSession: false } })
    : null;
  return client;
}
