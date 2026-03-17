'use client';

import { PageShell } from '@/components/layout/PageShell';
import { WordDetail } from '@/components/words/WordDetail';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { EmptyState } from '@/components/ui/EmptyState';
import { useWord } from '@/hooks/useWords';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export default function WordDetailPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const word = useWord(id);

  if (word === undefined) {
    return <PageShell><LoadingSpinner /></PageShell>;
  }

  if (word === null) {
    return (
      <PageShell>
        <EmptyState icon="🔍" title="Word not found" description="This word may have been deleted.">
          <Link href="/words"><Button variant="secondary">Back to Words</Button></Link>
        </EmptyState>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <WordDetail word={word} />
    </PageShell>
  );
}
