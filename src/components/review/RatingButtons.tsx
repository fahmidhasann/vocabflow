'use client';

import { RATING_LABELS } from '@/lib/constants';
import { previewIntervals, formatInterval } from '@/lib/srs';
import type { Word, Rating } from '@/types';

interface RatingButtonsProps {
  word: Word;
  onRate: (rating: Rating) => void;
}

const ratingColors: Record<Rating, { border: string; text: string }> = {
  0: { border: '#c97070', text: '#8b2020' },
  1: { border: '#c4914a', text: '#7a5520' },
  2: { border: '#6aab7a', text: '#2a6840' },
  3: { border: '#5a90c0', text: '#1a4a70' },
};

export function RatingButtons({ word, onRate }: RatingButtonsProps) {
  const intervals = previewIntervals(word);

  return (
    <div className="mx-auto grid w-full max-w-2xl grid-cols-2 gap-3 md:grid-cols-4">
      {([0, 1, 2, 3] as Rating[]).map((rating) => {
        const colors = ratingColors[rating];
        return (
          <button
            key={rating}
            onClick={() => onRate(rating)}
            className="flex min-h-[108px] flex-col items-start justify-between rounded-[24px] border px-4 py-4 text-left transition-[background,border-color,transform] duration-150 hover:-translate-y-px"
            style={{
              border: `1.5px solid ${colors.border}`,
              color: colors.text,
              background: `${colors.border}12`,
            }}
            aria-keyshortcuts={`${rating + 1}`}
          >
            <div className="flex w-full items-start justify-between gap-3">
              <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-ox-muted">
                {rating + 1}
              </span>
              <span className="rounded-full border border-current/25 px-2 py-0.5 font-mono text-[8px] uppercase tracking-[0.16em]">
                {formatInterval(intervals[rating])}
              </span>
            </div>
            <div>
              <span className="block font-display text-[22px] font-semibold leading-none">
                {RATING_LABELS[rating]}
              </span>
              <span className="mt-2 block font-serif text-[13px] leading-6 text-ox-muted">
                {rating === 0 && 'Could not recall it.'}
                {rating === 1 && 'Remembered with effort.'}
                {rating === 2 && 'Solid recall.'}
                {rating === 3 && 'Instantly remembered.'}
              </span>
            </div>
          </button>
        );
      })}
    </div>
  );
}
