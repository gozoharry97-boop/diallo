import { Suspense } from 'react';
import { Loading } from '@/components/layout/Page';
import { ImportResultView } from './ImportResultView';

export const metadata = { title: 'Recette cocotte-minute' };

export default function ImportResultPage() {
  return (
    <Suspense fallback={<Loading />}>
      <ImportResultView />
    </Suspense>
  );
}
