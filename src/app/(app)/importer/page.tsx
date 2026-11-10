import { Suspense } from 'react';
import { Loading } from '@/components/layout/Page';
import { ImportView } from './ImportView';

export const metadata = { title: 'Importer une recette vidéo' };

export default function ImportPage() {
  return (
    <Suspense fallback={<Loading />}>
      <ImportView />
    </Suspense>
  );
}
