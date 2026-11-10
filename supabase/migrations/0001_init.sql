-- Diallo : schéma initial.
-- Toutes les tables sont lues et écrites par le serveur (clé de service) ;
-- RLS activé sans politique publique : aucun accès direct depuis le navigateur.

-- Prix agrégés par magasin et produit du catalogue (ingestion Open Prices, puis autres sources).
create table if not exists price_aggregates (
  store_id text not null,
  ingredient_key text not null,
  pack_price numeric(8, 2) not null check (pack_price > 0),
  observations integer not null default 1,
  observed_from date,
  observed_to date,
  source text not null default 'open-prices',
  updated_at timestamptz not null default now(),
  primary key (store_id, ingredient_key, source)
);

-- Listes de courses partagées par lien (sans compte).
create table if not exists shared_lists (
  token text primary key,
  payload jsonb not null,
  checked jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  expires_at timestamptz not null default now() + interval '30 days'
);
create index if not exists shared_lists_expires_idx on shared_lists (expires_at);

-- Vidéos choisies à la main pour une recette (TikTok et Instagram n'ont pas de recherche ouverte).
create table if not exists curated_videos (
  recipe_id text not null,
  platform text not null check (platform in ('youtube', 'tiktok', 'instagram')),
  video_id text not null,
  url text not null,
  title text,
  author text,
  duration_seconds integer,
  has_captions boolean,
  created_at timestamptz not null default now(),
  primary key (recipe_id, platform, video_id)
);

-- Cache des imports vidéo : évite de rappeler l'IA pour un même lien.
create table if not exists import_cache (
  cache_key text primary key,
  metadata jsonb not null,
  extraction jsonb not null,
  created_at timestamptz not null default now()
);

alter table price_aggregates enable row level security;
alter table shared_lists enable row level security;
alter table curated_videos enable row level security;
alter table import_cache enable row level security;

-- Coche atomique d'un article d'une liste partagée (évite d'écraser la coche d'un colocataire).
create or replace function set_shared_item(p_token text, p_key text, p_checked boolean)
returns jsonb
language sql
security definer
set search_path = public
as $$
  update shared_lists
     set checked = checked || jsonb_build_object(p_key, p_checked)
   where token = p_token and expires_at > now()
  returning checked;
$$;
revoke all on function set_shared_item(text, text, boolean) from public, anon, authenticated;
grant execute on function set_shared_item(text, text, boolean) to service_role;
