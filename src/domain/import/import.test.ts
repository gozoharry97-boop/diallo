import { describe, expect, it } from 'vitest';
import { buildImportedRecipe, matchIngredient, toIngredientUnit } from './match';
import { embedUrl, parseVideoUrl } from './platform';

describe('liens vidéo', () => {
  it('reconnaît YouTube, Shorts, TikTok et Instagram', () => {
    expect(parseVideoUrl('https://www.youtube.com/watch?v=dQw4w9WgXcQ&t=3')).toMatchObject({ platform: 'youtube', videoId: 'dQw4w9WgXcQ' });
    expect(parseVideoUrl('https://youtube.com/shorts/abcdefghijk')).toMatchObject({ platform: 'youtube', videoId: 'abcdefghijk' });
    expect(parseVideoUrl('https://www.tiktok.com/@chef.x/video/7432123456789')).toMatchObject({ platform: 'tiktok', videoId: '7432123456789' });
    expect(parseVideoUrl('https://vm.tiktok.com/ZMabc123/')).toMatchObject({ platform: 'tiktok', videoId: '' });
    expect(parseVideoUrl('https://www.instagram.com/reel/Cx1_ab-Z/')).toMatchObject({ platform: 'instagram', videoId: 'Cx1_ab-Z' });
  });

  it('refuse les autres liens', () => {
    expect(parseVideoUrl('https://www.marmiton.org/recettes/x')).toBeNull();
    expect(parseVideoUrl('tiktok.com/@a/video/1')).toBeNull();
  });

  it('construit les URL des lecteurs officiels', () => {
    expect(embedUrl({ platform: 'youtube', videoId: 'dQw4w9WgXcQ', url: '' })).toContain('youtube-nocookie.com/embed/dQw4w9WgXcQ');
    expect(embedUrl({ platform: 'instagram', videoId: 'abc', url: 'https://www.instagram.com/reel/abc/' })).toContain('/reel/abc/embed');
  });
});

describe('rapprochement avec le catalogue', () => {
  it('trouve le produit à partir d’un nom libre', () => {
    expect(matchIngredient('Beurre de cacahuète crémeux')).toBe('patearachide');
    expect(matchIngredient('2 gousses d’ail')).toBe('ail');
    expect(matchIngredient('citron vert')).toBe('citronvert');
    expect(matchIngredient('Citron')).toBe('citrons');
    expect(matchIngredient('nouilles de riz')).toBe('nouillesriz');
    expect(matchIngredient('safran de Perse')).toBeNull();
  });

  it('convertit les unités', () => {
    expect(toIngredientUnit('soja', 2, 'c. à s.')).toEqual({ value: 30, uncertain: false });
    expect(toIngredientUnit('ail', 2, 'gousses')).toEqual({ value: 0.2, uncertain: false });
    expect(toIngredientUnit('oignons', 1, null)).toEqual({ value: 100, uncertain: false });
    expect(toIngredientUnit('riz', 0.3, 'kg')).toEqual({ value: 300, uncertain: false });
    expect(toIngredientUnit('gingembre', null, null).uncertain).toBe(true);
  });

  it('ramène la recette à une personne et garde les produits inconnus à part', () => {
    const { recipe, guessed } = buildImportedRecipe(
      {
        found: true, title: 'Nouilles sautées sauce cacahuète', cuisine: 'se', minutes: 15, servings: 2, spicy: false,
        ingredients: [
          { name: 'nouilles de riz', quantity: 160, unit: 'g' },
          { name: 'beurre de cacahuète', quantity: 2, unit: 'c. à s.' },
          { name: 'ail', quantity: null, unit: null },
          { name: 'graines de chia', quantity: 1, unit: 'c. à c.' },
        ],
        steps: ['a', 'b', 'c', 'd', 'e'],
        uncertainties: ['Quantité d’ail non précisée'],
      },
      'imp-1',
      { platform: 'tiktok', url: 'https://www.tiktok.com/@x/video/1' },
    );
    expect(recipe.ingredients).toMatchObject({ nouillesriz: 80, patearachide: 15 });
    expect(recipe.steps).toHaveLength(4);
    expect(recipe.extras).toEqual([{ name: 'graines de chia', quantity: 1, unit: 'c. à c.' }]);
    expect(guessed).toEqual(['Ail']);
  });
});
