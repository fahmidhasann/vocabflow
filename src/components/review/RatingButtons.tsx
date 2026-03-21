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
    <div className="grid grid-cols-4 gap-2 w-full max-w-md mx-auto">
      {([0, 1, 2, 3] as Rating[]).map((rating) => {
        const colors = ratingColors[rating];
        return (
          <button
            key={rating}
            onClick={() => onRate(rating)}
            className="flex flex-col items-center py-3 px-2 rounded-[4px] transition-colors"
            style={{
              border: `1.5px solid ${colors.border}`,
              color: colors.text,
              background: 'transparent',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = `${colors.border}14`;
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
            }}
          >
            <span className="font-mono uppercase" style={{ fontSize: '10px', letterSpacing: '1px' }}>
              {RATING_LABELS[rating]}
            </span>
            <span className="font-serif italic text-ox-muted mt-0.5" style={{ fontSize: '10px' }}>
              {formatInterval(intervals[rating])}
            </span>
          </button>
        );
      })}
    </div>
  );
}
