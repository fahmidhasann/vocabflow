'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { RATING_LABELS } from '@/lib/constants';
import { formatDuration } from '@/lib/utils';
import type { Rating } from '@/types';

interface SessionSummaryProps {
  wordsReviewed: number;
  ratings: Record<string, Rating>;
  duration: number;
  onRestart: () => void;
}

const ratingBarColors: Record<number, string> = {
  0: '#c97070',
  1: '#c4914a',
  2: '#6aab7a',
  3: '#5a90c0',
};

export function SessionSummary({ wordsReviewed, ratings, duration, onRestart }: SessionSummaryProps) {
  const ratingCounts = Object.values(ratings).reduce(
    (acc, r) => {
      acc[r] = (acc[r] || 0) + 1;
      return acc;
    },
    {} as Record<number, number>
  );

  return (
    <div className="text-center space-y-6 max-w-md mx-auto">
      <div>
        <h2 className="font-display font-bold text-ox-ink-deep" style={{ fontSize: '24px' }}>
          Session Complete
        </h2>
      </div>

      <Card>
        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <p className="font-display font-semibold text-ox-accent" style={{ fontSize: '22px' }}>{wordsReviewed}</p>
            <p className="font-mono uppercase text-ox-muted mt-0.5" style={{ fontSize: '9px', letterSpacing: '2px' }}>Words Reviewed</p>
          </div>
          <div>
            <p className="font-display font-semibold text-ox-accent" style={{ fontSize: '22px' }}>{formatDuration(duration)}</p>
            <p className="font-mono uppercase text-ox-muted mt-0.5" style={{ fontSize: '9px', letterSpacing: '2px' }}>Duration</p>
          </div>
        </div>
      </Card>

      <Card>
        <h3 className="font-mono uppercase text-ox-muted mb-3" style={{ fontSize: '9px', letterSpacing: '2px' }}>Rating Breakdown</h3>
        <div className="space-y-2.5">
          {([0, 1, 2, 3] as Rating[]).map((rating) => {
            const count = ratingCounts[rating] || 0;
            const pct = wordsReviewed > 0 ? (count / wordsReviewed) * 100 : 0;
            return (
              <div key={rating} className="flex items-center gap-2">
                <span className="font-mono uppercase text-ox-muted w-12" style={{ fontSize: '9px', letterSpacing: '1px' }}>
                  {RATING_LABELS[rating]}
                </span>
                <div className="flex-1 bg-ox-border rounded-sm overflow-hidden" style={{ height: '4px' }}>
                  <div
                    className="h-full rounded-sm transition-all duration-500"
                    style={{ width: `${pct}%`, background: ratingBarColors[rating] }}
                  />
                </div>
                <span className="font-mono text-ox-muted w-5 text-right" style={{ fontSize: '9px' }}>{count}</span>
              </div>
            );
          })}
        </div>
      </Card>

      <div className="flex gap-2">
        <Link href="/" className="flex-1">
          <Button variant="secondary" className="w-full">Home</Button>
        </Link>
        <Button onClick={onRestart} className="flex-1">Review Again</Button>
      </div>
    </div>
  );
}
