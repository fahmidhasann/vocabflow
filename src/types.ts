export type WordStatus = 'new' | 'learning' | 'mastered';

export type CategoryColor = 'emerald' | 'blue' | 'purple' | 'red' | 'amber' | 'pink' | 'cyan';

export interface Category {
  id: string;
  name: string;
  description?: string;
  color?: CategoryColor;
  createdAt: number;
}

export interface WordEntry {
  id: string;
  word: string;
  definition: string;
  context?: string;
  personalExample: string;
  keyword?: string;
  categoryId?: string; // NEW: Reference to category

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

export type BadgeType = 
  | 'streak_7' 
  | 'streak_30' 
  | 'streak_100'
  | 'first_steps_5'
  | 'first_steps_25'
  | 'first_steps_100'
  | 'perfect_session'
  | 'category_master'
  | 'consistency_7'
  | 'consistency_30'
  | 'consistency_100';

export interface Achievement {
  id: BadgeType;
  name: string;
  description: string;
  icon: string; // Emoji or icon name
  category: 'streak' | 'mastery' | 'consistency' | 'milestone';
  tier?: 'bronze' | 'silver' | 'gold'; // For progressive badges
  unlockedAt: number; // Timestamp when earned
  criteria: {
    type: string;
    value: number;
  };
}
