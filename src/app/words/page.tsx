'use client';

import { useState } from 'react';
import { PageShell } from '@/components/layout/PageShell';
import { WordCard } from '@/components/words/WordCard';
import { EmptyState } from '@/components/ui/EmptyState';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Button } from '@/components/ui/Button';
import { useWords } from '@/hooks/useWords';
import { cn } from '@/lib/utils';
import type { SrsStage } from '@/types';
import Link from 'next/link';

const tabs: { label: string; value: SrsStage | undefined }[] = [
  { label: 'All', value: undefined },
  { label: 'New', value: 'new' },
  { label: 'Learning', value: 'learning' },
  { label: 'Reviewing', value: 'reviewing' },
  { label: 'Mastered', value: 'mastered' },
];

export default function WordsPage() {
  const [search, setSearch] = useState('');
  const [stage, setStage] = useState<SrsStage | undefined>(undefined);
  const words = useWords({ stage, search });

  return (
    <PageShell title="Words">
      <div className="space-y-4">
        {/* Search */}
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search words..."
          className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        />

        {/* Filter Tabs */}
        <div className="flex gap-1 overflow-x-auto pb-1">
          {tabs.map((tab) => (
            <button
              key={tab.label}
              onClick={() => setStage(tab.value)}
              className={cn(
                'px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors',
                stage === tab.value
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Word List */}
        {words === undefined ? (
          <LoadingSpinner />
        ) : words.length === 0 ? (
          <EmptyState
            icon="📚"
            title="No words found"
            description={search ? 'Try a different search term' : 'Start building your vocabulary!'}
          >
            <Link href="/add">
              <Button>Add Words</Button>
            </Link>
          </EmptyState>
        ) : (
          <div className="space-y-2">
            {words.map((word) => (
              <WordCard key={word.id} word={word} />
            ))}
          </div>
        )}
      </div>
    </PageShell>
  );
}
