import type { Word, Rating, SrsStage } from '@/types';
import { daysFromNow } from './utils';

// SM-2 quality mapping: Rating 0-3 -> SM-2 quality 0-5
const QUALITY_MAP: Record<Rating, number> = {
  0: 0, // Again -> 0
  1: 2, // Hard -> 2
  2: 4, // Good -> 4
  3: 5, // Easy -> 5
};

export function calculateNextReview(
  word: Word,
  rating: Rating
): Pick<Word, 'easeFactor' | 'interval' | 'repetitions' | 'nextReviewDate' | 'srsStage' | 'updatedAt'> {
  const quality = QUALITY_MAP[rating];
  let { easeFactor, interval, repetitions } = word;

  if (quality < 3) {
    // Failed: reset
    repetitions = 0;
    interval = 1;
  } else {
    // Passed
    repetitions += 1;
    if (repetitions === 1) {
      interval = 1;
    } else if (repetitions === 2) {
      interval = 6;
    } else {
      interval = Math.round(interval * easeFactor);
    }
  }

  // Update ease factor (SM-2 formula)
  easeFactor = easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
  if (easeFactor < 1.3) easeFactor = 1.3;

  const nextReviewDate = daysFromNow(interval);
  const srsStage = getSrsStage(interval, repetitions);

  return {
    easeFactor,
    interval,
    repetitions,
    nextReviewDate,
    srsStage,
    updatedAt: new Date().toISOString(),
  };
}

export function getSrsStage(interval: number, repetitions: number): SrsStage {
  if (repetitions === 0) return 'new';
  if (interval <= 6) return 'learning';
  if (interval <= 30) return 'reviewing';
  return 'mastered';
}

export function previewIntervals(word: Word): Record<Rating, number> {
  return {
    0: 1,
    1: 1,
    2: word.repetitions === 0 ? 1 : word.repetitions === 1 ? 6 : Math.round(word.interval * word.easeFactor),
    3: word.repetitions === 0 ? 1 : word.repetitions === 1 ? 6 : Math.round(word.interval * (word.easeFactor + 0.1)),
  };
}

export function formatInterval(days: number): string {
  if (days === 1) return '1 day';
  if (days < 30) return `${days} days`;
  if (days < 365) return `${Math.round(days / 30)} mo`;
  return `${(days / 365).toFixed(1)} yr`;
}

export function newWordSrsFields(): Pick<Word, 'easeFactor' | 'interval' | 'repetitions' | 'nextReviewDate' | 'srsStage'> {
  return {
    easeFactor: 2.5,
    interval: 0,
    repetitions: 0,
    nextReviewDate: new Date().toISOString().split('T')[0],
    srsStage: 'new',
  };
}
