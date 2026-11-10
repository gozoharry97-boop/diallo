import { z } from 'zod';

const CUISINE_IDS = [
  'fr', 'it', 'es', 'med', 'nord', 'ao', 'ac', 'ae', 'ma',
  'cn', 'jp', 'kr', 'se', 'in', 'mo', 'lat', 'ant', 'us',
] as const;

/**
 * Ce que le modèle renvoie pour une vidéo. Pas de contraintes de longueur dans le
 * schéma (non prises en charge par les sorties structurées) : elles sont appliquées après.
 */
export const ExtractionSchema = z.object({
  found: z.boolean().describe('false si la vidéo ne contient pas de recette exploitable'),
  title: z.string().describe('Nom du plat en français'),
  cuisine: z.enum(CUISINE_IDS).describe('Cuisine la plus proche'),
  minutes: z.number().describe('Temps total estimé, en minutes'),
  servings: z.number().describe('Nombre de portions de la recette d’origine'),
  ingredients: z.array(
    z.object({
      name: z.string().describe('Nom courant en français, au singulier, sans marque'),
      quantity: z.number().nullable().describe('Quantité pour toute la recette, null si non précisée'),
      unit: z.string().nullable().describe('g, kg, ml, cl, l, pièce, c. à s., c. à c., gousse, botte… ou null'),
    }),
  ),
  steps: z.array(z.string()).describe('4 étapes maximum, courtes, reformulées, à la 2e personne du singulier'),
  uncertainties: z.array(z.string()).describe('Ce que la vidéo ne précise pas et qui a été supposé'),
  spicy: z.boolean(),
});

export type Extraction = z.infer<typeof ExtractionSchema>;

/** Métadonnées publiques d'une vidéo, lues via oEmbed ou l'API officielle. */
export interface VideoMetadata {
  platform: 'youtube' | 'tiktok' | 'instagram';
  url: string;
  videoId: string;
  title?: string;
  author?: string;
  thumbnailUrl?: string;
  /** Texte exploitable : légende, description ou texte de l'intégration. */
  text?: string;
}
