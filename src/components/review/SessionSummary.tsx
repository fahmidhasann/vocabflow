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
        <p className="text-4xl mb-2">🎉</p>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Session Complete!</h2>
      </div>

      <Card>
        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{wordsReviewed}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Words Reviewed</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{formatDuration(duration)}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Duration</p>
          </div>
        </div>
      </Card>

      <Card>
        <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-3">Rating Breakdown</h3>
        <div className="space-y-2">
          {([0, 1, 2, 3] as Rating[]).map((rating) => {
            const count = ratingCounts[rating] || 0;
            const pct = wordsReviewed > 0 ? (count / wordsReviewed) * 100 : 0;
            return (
              <div key={rating} className="flex items-center gap-2 text-sm">
                <span className="w-12 text-gray-600 dark:text-gray-400">{RATING_LABELS[rating]}</span>
                <div className="flex-1 h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${rating === 0 ? 'bg-red-500' : rating === 1 ? 'bg-orange-500' : rating === 2 ? 'bg-green-500' : 'bg-blue-500'}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span className="w-6 text-right text-gray-500 dark:text-gray-400">{count}</span>
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
