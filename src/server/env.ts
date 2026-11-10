import 'server-only';

/** Configuration serveur. Chaque service fonctionne en mode dégradé si sa clé manque. */
export const env = {
  supabaseUrl: process.env.SUPABASE_URL,
  supabaseServiceKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
  anthropicKey: process.env.ANTHROPIC_API_KEY,
  anthropicModel: process.env.ANTHROPIC_MODEL ?? 'claude-sonnet-5-5',
  youtubeKey: process.env.YOUTUBE_API_KEY,
  /** Point d'accès oEmbed Instagram sans jeton (Meta, juin 2026). À vérifier lors du déploiement. */
  instagramOembed: process.env.INSTAGRAM_OEMBED_URL ?? 'https://graph.facebook.com/v24.0/instagram_oembed',
  /** `1` : l'import renvoie une recette d'exemple, sans appel à l'IA (démo, tests). */
  importDemo: process.env.IMPORT_DEMO === '1',
  userAgent: process.env.HTTP_USER_AGENT ?? 'Diallo/0.1 (+https://github.com/)',
};
