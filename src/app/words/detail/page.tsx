'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { PageShell } from '@/components/layout/PageShell';
import { WordDetail } from '@/components/words/WordDetail';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { EmptyState } from '@/components/ui/EmptyState';
import { useWord } from '@/hooks/useWords';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

function WordDetailContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id') ?? '';
  const word = useWord(id);

  if (word === undefined) {
    return <PageShell><LoadingSpinner /></PageShell>;
  }

  if (word === null) {
    return (
      <PageShell eyebrow="Vocabulary" title="Word detail" description="This entry no longer exists in your library.">
        <EmptyState icon="🔍" title="Word not found" description="This word may have been deleted.">
          <Link href="/words"><Button variant="secondary">Back to Words</Button></Link>
        </EmptyState>
      </PageShell>
    );
  }

  return (
    <PageShell eyebrow="Vocabulary" title="Word detail" description="Review the meaning, notes, usage context, and SRS state for this word.">
      <WordDetail word={word} />
    </PageShell>
  );
}

export default function WordDetailPage() {
  return (
    <Suspense fallback={<PageShell><LoadingSpinner /></PageShell>}>
      <WordDetailContent />
    </Suspense>
  );
}
