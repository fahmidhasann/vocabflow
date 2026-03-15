'use client';

import { RATING_LABELS } from '@/lib/constants';
import { previewIntervals, formatInterval } from '@/lib/srs';
import type { Word, Rating } from '@/types';

interface RatingButtonsProps {
  word: Word;
  onRate: (rating: Rating) => void;
}

const ratingStyles: Record<Rating, string> = {
  0: 'bg-red-500 hover:bg-red-600 text-white',
  1: 'bg-orange-500 hover:bg-orange-600 text-white',
  2: 'bg-green-500 hover:bg-green-600 text-white',
  3: 'bg-blue-500 hover:bg-blue-600 text-white',
};

export function RatingButtons({ word, onRate }: RatingButtonsProps) {
  const intervals = previewIntervals(word);

  return (
    <div className="grid grid-cols-4 gap-2 w-full max-w-md mx-auto">
      {([0, 1, 2, 3] as Rating[]).map((rating) => (
        <button
          key={rating}
          onClick={() => onRate(rating)}
          className={`flex flex-col items-center py-3 px-2 rounded-xl font-medium transition-colors ${ratingStyles[rating]}`}
        >
          <span className="text-sm font-semibold">{RATING_LABELS[rating]}</span>
          <span className="text-xs opacity-80 mt-0.5">{formatInterval(intervals[rating])}</span>
        </button>
      ))}
    </div>
  );
}
