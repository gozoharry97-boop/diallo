import { Suspense } from 'react';
import { Loading } from '@/components/layout/Page';
import { RecipeView } from './RecipeView';

export const metadata = { title: 'Recette' };

export default function RecipePage() {
  return (
    <Suspense fallback={<Loading />}>
      <RecipeView />
    </Suspense>
  );
}
