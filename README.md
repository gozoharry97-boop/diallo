# Diallo

Diallo compose tes dîners de la semaine dans ton budget, avec les prix de tes magasins (supermarchés et épiceries du monde), et te prépare la liste de courses. Une mascotte t'accompagne : cagnotte, passeport des cuisines, défi zéro gaspi. Tu peux aussi coller le lien d'une vidéo TikTok, Instagram ou YouTube : Diallo en tire une recette en 4 étapes et la liste de courses chiffrée.

Next.js 16 (App Router) · React 19 · TypeScript · Supabase (facultatif) · Claude API (import vidéo).

## Lancer le projet

```bash
npm install
cp .env.example .env.local   # toutes les clés sont facultatives
npm run dev                  # http://localhost:3000
```

Sans aucune clé, l'application fonctionne : elle utilise les prix de référence par enseigne, l'import vidéo renvoie une recette d'exemple (`IMPORT_DEMO=1`) et le partage de liste passe par un lien instantané.

| Commande | Rôle |
|---|---|
| `npm run dev` | Serveur de développement |
| `npm run build` puis `npm start` | Version de production |
| `npm test` | Tests du domaine (planification, prix, régimes, import) |
| `npm run lint` · `npm run typecheck` | Qualité du code |
| `npm run ingest:prices` | Récupère les prix Open Prices et met à jour la table des prix |

## Variables d'environnement

| Variable | Sert à | Sans elle |
|---|---|---|
| `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` | Prix agrégés, listes partagées synchronisées, vidéos choisies à la main | Prix du fichier `open-prices.generated.json`, partage par lien instantané |
| `ANTHROPIC_API_KEY`, `ANTHROPIC_MODEL` | Résumé « cocotte-minute » des vidéos importées | Import indisponible (sauf `IMPORT_DEMO=1`) |
| `YOUTUBE_API_KEY` | Vidéos YouTube sur les fiches recettes, description des vidéos importées | Seules les vidéos choisies à la main s'affichent |
| `INSTAGRAM_OEMBED_URL` | Métadonnées des liens Instagram | Valeur par défaut, à vérifier |
| `IMPORT_DEMO` | `1` : recette d'exemple sans appel à l'IA | — |
| `HTTP_USER_AGENT` | Identifie Diallo auprès des API publiques | Valeur générique |

La clé `SUPABASE_SERVICE_ROLE_KEY` reste côté serveur (`src/server/`, protégé par `server-only`).

## Base de données (facultatif)

Crée un projet Supabase puis applique `supabase/migrations/0001_init.sql` (éditeur SQL ou `supabase db push`). Les tables ont la sécurité par ligne activée sans règle publique : seul le serveur y accède. Les cases cochées d'une liste partagée sont mises à jour par la fonction atomique `set_shared_item`. Une liste partagée expire après 30 jours.

## D'où viennent les prix

1. **Prix de référence** : prix moyen par ingrédient × indice de l'enseigne × facteur par rayon (`src/domain/pricing.ts`). Toujours disponibles, calculés sur l'appareil.
2. **Open Prices** (Open Food Facts, licence ODbL) : `npm run ingest:prices` lit les relevés de prix en France des 12 derniers mois, les rattache à nos enseignes par la marque OpenStreetMap, garde la médiane (au moins 2 relevés) et écrit `src/domain/data/open-prices.generated.json` (et Supabase si configuré). Ces prix remplacent les prix de référence.
3. **Plus tard** : correction par ticket de caisse, flux partenaires d'enseignes.

Les sites des enseignes ne sont pas aspirés : leurs conditions d'utilisation l'interdisent en général. Il faut un accord écrit avant toute collecte automatique.

## Vidéos

- **Fiche recette** : vidéos choisies à la main (table `curated_videos`) puis recherche YouTube (mise en cache une semaine, quota de 100 recherches par jour). Une vidéo ne se charge qu'au clic (« Lire »), car les plateformes déposent des cookies.
- **Import** (`/importer`, ou partage depuis le téléphone sur Android grâce au manifeste) : Diallo lit uniquement les métadonnées officielles (oEmbed TikTok, YouTube, Instagram, et la description YouTube). La vidéo n'est jamais téléchargée. Si la légende ne contient pas la recette, on demande à l'utilisateur de coller la description. Claude extrait la recette dans un schéma strict. Le texte de la vidéo est traité comme une donnée, jamais comme une instruction. Le résultat est mis en cache et l'import est limité à 15 par heure par appareil.

## Organisation du code

```
src/
  domain/        logique pure, testée : types, données (97 ingrédients, 105 recettes, 21 magasins),
                 prix, planification, régimes, placard, jeu, import (correspondance des ingrédients)
  server/        accès serveur : Supabase, prix, vidéos, import (métadonnées, extraction), partage
  state/         état local (localStorage, sans compte), prix, semaine calculée
  components/    ui/ (primitives), layout/, week/, courses/, recipe/, Mascot, ProfileForm
  app/           pages (E01 à E21) et routes API
  styles/tokens.css   le seul fichier de jetons de design
scripts/ingest-open-prices.ts
supabase/migrations/0001_init.sql
```

## Accessibilité

Cible WCAG 2.2 AA : contrastes vérifiés, lien d'évitement, focus visible, cibles de 44 px, dialogues natifs, onglets au clavier, annonces `aria-live` de la mascotte, mouvements réduits respectés.

## Reste à faire

- Lancer une vraie ingestion Open Prices (le réseau de l'environnement de développement la bloquait) et affiner les catégories dans `open-prices-map.ts`.
- Vérifier le point d'accès oEmbed Instagram et les adresses d'intégration TikTok et Instagram ; choisir des vidéos TikTok et Instagram à la main.
- Correction des prix par ticket de caisse (E17), comptes et historique (P2).
- Versions grand écran plus travaillées pour les écrans autres que l'accueil et la semaine.
- Limite d'import partagée (Redis par exemple) si l'application tourne sur plusieurs instances.
- Tests avec lecteur d'écran et avec de vrais utilisateurs.
- Compléter les mentions légales (`[champs]` dans `src/app/mentions-legales/page.tsx`).
