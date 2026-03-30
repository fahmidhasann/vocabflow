'use client';

import { useState } from 'react';
import Link from 'next/link';
import { PageShell } from '@/components/layout/PageShell';
import { Card } from '@/components/ui/Card';
import { WordCard } from '@/components/words/WordCard';
import { EmptyState } from '@/components/ui/EmptyState';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Button } from '@/components/ui/Button';
import { useWords } from '@/hooks/useWords';
import { useDebounce } from '@/hooks/useDebounce';
import { cn } from '@/lib/utils';
import type { SrsStage } from '@/types';

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
  const debouncedSearch = useDebounce(search);
  const allWords = useWords();
  const words = useWords({ stage, search: debouncedSearch });

  const counts = {
    all: allWords?.length ?? 0,
    new: allWords?.filter((word) => word.srsStage === 'new').length ?? 0,
    learning: allWords?.filter((word) => word.srsStage === 'learning').length ?? 0,
    reviewing: allWords?.filter((word) => word.srsStage === 'reviewing').length ?? 0,
    mastered: allWords?.filter((word) => word.srsStage === 'mastered').length ?? 0,
  };

  const selectedLabel = stage ? tabs.find((tab) => tab.value === stage)?.label ?? 'Filtered' : 'All words';

  return (
    <PageShell
      eyebrow="Library"
      title="Your vocabulary"
      description="Search by word, filter by learning stage, and jump into the detail view when you need to edit or review context."
      actions={(
        <Link href="/add">
          <Button>Add Word</Button>
        </Link>
      )}
    >
      <Card variant="hero" padding="lg">
        <div className="space-y-4">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.26em] text-ox-muted">Browse and filter</p>
            <p className="mt-2 font-serif text-[15px] leading-7 text-ox-muted">
              Narrow the list by typing a word or focusing on a specific stage in the SRS cycle.
            </p>
          </div>

          <div className="relative">
            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ox-muted">
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="7" />
                <path d="m20 20-3.5-3.5" />
              </svg>
            </span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search words..."
              className="w-full rounded-2xl border border-ox-border bg-ox-surface px-11 py-3.5 font-serif text-[16px] text-ox-ink-deep placeholder:text-ox-muted placeholder:italic focus:outline-none focus:ring-2 focus:ring-ox-accent focus:border-transparent"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full border border-ox-line px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.16em] text-ox-muted transition-colors hover:border-ox-accent hover:text-ox-accent"
              >
                Clear
              </button>
            )}
          </div>

          <div className="flex gap-2 overflow-x-auto pb-1">
            {tabs.map((tab) => {
              const isActive = stage === tab.value;
              const countKey = (tab.value ?? 'all') as keyof typeof counts;
              return (
                <button
                  key={tab.label}
                  onClick={() => setStage(tab.value)}
                  className={cn(
                    'inline-flex items-center gap-2 whitespace-nowrap rounded-full border px-4 py-2 font-mono text-[10px] uppercase tracking-[0.18em] transition-colors',
                    isActive
                      ? 'border-ox-accent bg-ox-accent text-white'
                      : 'border-ox-line bg-ox-surface text-ox-muted hover:border-ox-accent hover:text-ox-accent'
                  )}
                >
                  <span>{tab.label}</span>
                  <span className={cn('rounded-full px-2 py-0.5 text-[9px] tracking-[0.14em]', isActive ? 'bg-white/18 text-white' : 'bg-ox-surface-alt text-ox-muted')}>
                    {counts[countKey]}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </Card>

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-ox-muted">Showing</p>
          <p className="mt-1 font-serif text-[15px] text-ox-ink">
            {selectedLabel}{debouncedSearch ? ` for "${debouncedSearch}"` : ''}
          </p>
        </div>
        {allWords && (
          <p className="font-serif text-[14px] text-ox-muted">
            {allWords.length} total word{allWords.length === 1 ? '' : 's'} in your library
          </p>
        )}
      </div>

      {words === undefined || allWords === undefined ? (
        <LoadingSpinner />
      ) : words.length === 0 ? (
        <EmptyState
          icon="⌕"
          eyebrow="No matches"
          title="No words found"
          description={search ? 'Try a broader search term or switch stages to find what you need.' : 'Your library is empty. Start by adding the first word.'}
        >
          <Link href="/add">
            <Button>Add Words</Button>
          </Link>
        </EmptyState>
      ) : (
        <div className="space-y-3">
          {words.map((word) => (
            <WordCard key={word.id} word={word} />
          ))}
        </div>
      )}
    </PageShell>
  );
}
