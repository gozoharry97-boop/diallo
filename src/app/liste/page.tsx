import { Suspense } from 'react';
import { Loading } from '@/components/layout/Page';
import { SharedListView } from './SharedListView';

export const metadata = { title: 'Liste partagée', robots: { index: false } };

export default function SharedListPage() {
  return (
    <Suspense fallback={<Loading />}>
      <SharedListView />
    </Suspense>
  );
}
