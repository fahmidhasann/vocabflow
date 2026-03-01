export type WordStatus = 'new' | 'learning' | 'mastered';

export interface WordEntry {
  id: string;
  word: string;
  definition: string;
  context?: string;
  personalExample: string;
  keyword?: string;

  // Spaced Repetition System (SRS) Data
  status: WordStatus;
  nextReviewDate: number; // Timestamp in ms
  interval: number; // Days until next review
  easeFactor: number; // Multiplier for interval
  consecutiveCorrect: number;
  createdAt: number;
  lastReviewedAt?: number;
}

export type ReviewRating = 'again' | 'hard' | 'good' | 'easy';
