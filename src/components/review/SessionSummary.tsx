'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { RATING_LABELS } from '@/lib/constants';
import { formatDuration } from '@/lib/utils';
import type { Rating, Word } from '@/types';

interface SessionSummaryProps {
  wordsReviewed: number;
  ratings: Record<string, Rating>;
  duration: number;
  words: Word[];
  onRestart: () => void;
}

const ratingBarColors: Record<number, string> = {
  0: '#c97070',
  1: '#c4914a',
  2: '#6aab7a',
  3: '#5a90c0',
};

export function SessionSummary({ wordsReviewed, ratings, duration, words, onRestart }: SessionSummaryProps) {
  const hardWords = words.filter((w) => w.id && (ratings[w.id] === 0 || ratings[w.id] === 1));

  const ratingCounts = Object.values(ratings).reduce(
    (acc, r) => {
      acc[r] = (acc[r] || 0) + 1;
      return acc;
    },
    {} as Record<number, number>
  );

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-ox-muted">
          Review complete
        </p>
        <h2 className="mt-2 font-display text-[34px] font-semibold leading-none text-ox-ink-deep">
          Session Complete
        </h2>
        <p className="mt-2 max-w-xl font-serif text-[15px] leading-7 text-ox-muted">
          You cleared the queue. Keep momentum by revisiting difficult words or heading back to your dashboard.
        </p>
      </div>

      <Card variant="hero" padding="lg">
        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <p className="font-display text-[30px] font-semibold text-ox-accent">{wordsReviewed}</p>
            <p className="mt-1 font-mono text-[9px] uppercase tracking-[0.24em] text-ox-muted">Words Reviewed</p>
          </div>
          <div>
            <p className="font-display text-[30px] font-semibold text-ox-accent">{formatDuration(duration)}</p>
            <p className="mt-1 font-mono text-[9px] uppercase tracking-[0.24em] text-ox-muted">Duration</p>
          </div>
        </div>
      </Card>

      <Card variant="subtle" padding="lg">
        <h3 className="mb-4 font-mono text-[10px] uppercase tracking-[0.24em] text-ox-muted">Rating Breakdown</h3>
        <div className="space-y-2.5">
          {([0, 1, 2, 3] as Rating[]).map((rating) => {
            const count = ratingCounts[rating] || 0;
            const pct = wordsReviewed > 0 ? (count / wordsReviewed) * 100 : 0;
            return (
              <div key={rating} className="flex items-center gap-2">
                <span className="w-12 font-mono text-[9px] uppercase tracking-[0.16em] text-ox-muted">
                  {RATING_LABELS[rating]}
                </span>
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-ox-border">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${pct}%`, background: ratingBarColors[rating] }}
                  />
                </div>
                <span className="w-5 text-right font-mono text-[10px] text-ox-muted">{count}</span>
              </div>
            );
          })}
        </div>
      </Card>

      {hardWords.length > 0 && (
        <Card padding="lg">
          <h3 className="mb-4 font-mono text-[10px] uppercase tracking-[0.24em] text-ox-muted">Needs Work</h3>
          <div className="space-y-1.5">
            {hardWords.map((w) => (
              <Link
                key={w.id}
                href={`/words/detail?id=${w.id}`}
                className="flex items-center justify-between rounded-2xl border border-transparent px-3 py-3 transition-colors hover:border-ox-line hover:bg-ox-surface-alt hover:text-ox-accent"
              >
                <span className="font-display text-[18px] text-ox-ink-deep">{w.word}</span>
                <span
                  className="font-mono text-[9px] uppercase tracking-[0.16em]"
                  style={{
                    color: ratings[w.id!] === 0 ? '#c97070' : '#c4914a',
                  }}
                >
                  {RATING_LABELS[ratings[w.id!]]}
                </span>
              </Link>
            ))}
          </div>
        </Card>
      )}

      <div className="flex flex-col gap-3 sm:flex-row">
        <Link href="/" className="flex-1">
          <Button variant="secondary" className="w-full">Home</Button>
        </Link>
        <Button onClick={onRestart} className="flex-1">Review Again</Button>
      </div>
    </div>
  );
}
