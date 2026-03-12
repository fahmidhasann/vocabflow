import { Achievement, BadgeType } from '../types';

export interface BadgeDefinition extends Omit<Achievement, 'unlockedAt'> {
  unlockMessage: string;
}

export const BADGE_DEFINITIONS: Record<BadgeType, BadgeDefinition> = {
  // Streak Badges
  streak_7: {
    id: 'streak_7',
    name: '7-Day Fire',
    description: 'Maintain a 7-day review streak',
    icon: '🔥',
    category: 'streak',
    tier: 'bronze',
    criteria: {
      type: 'streak_days',
      value: 7,
    },
    unlockMessage: '🔥 7-Day Fire unlocked! Keep the momentum going!',
  },
  streak_30: {
    id: 'streak_30',
    name: '30-Day Inferno',
    description: 'Maintain a 30-day review streak',
    icon: '🔥🔥',
    category: 'streak',
    tier: 'silver',
    criteria: {
      type: 'streak_days',
      value: 30,
    },
    unlockMessage: '🔥🔥 30-Day Inferno unlocked! You\'re unstoppable!',
  },
  streak_100: {
    id: 'streak_100',
    name: '100-Day Blaze',
    description: 'Maintain a 100-day review streak',
    icon: '🔥🔥🔥',
    category: 'streak',
    tier: 'gold',
    criteria: {
      type: 'streak_days',
      value: 100,
    },
    unlockMessage: '🔥🔥🔥 100-Day Blaze unlocked! You\'re a legend!',
  },

  // First Steps Badges (Milestone)
  first_steps_5: {
    id: 'first_steps_5',
    name: 'First Steps',
    description: 'Add 5 words to your vocabulary',
    icon: '👣',
    category: 'milestone',
    tier: 'bronze',
    criteria: {
      type: 'total_words_added',
      value: 5,
    },
    unlockMessage: '👣 First Steps unlocked! Your vocabulary journey begins!',
  },
  first_steps_25: {
    id: 'first_steps_25',
    name: 'Steady Pace',
    description: 'Add 25 words to your vocabulary',
    icon: '👣',
    category: 'milestone',
    tier: 'silver',
    criteria: {
      type: 'total_words_added',
      value: 25,
    },
    unlockMessage: '👣 Steady Pace unlocked! You\'re building momentum!',
  },
  first_steps_100: {
    id: 'first_steps_100',
    name: 'Word Collector',
    description: 'Add 100 words to your vocabulary',
    icon: '👣',
    category: 'milestone',
    tier: 'gold',
    criteria: {
      type: 'total_words_added',
      value: 100,
    },
    unlockMessage: '👣 Word Collector unlocked! You\'ve built an impressive collection!',
  },

  // Perfect Session Badge
  perfect_session: {
    id: 'perfect_session',
    name: 'Flawless',
    description: 'Complete a review session with all "Easy" ratings',
    icon: '⭐',
    category: 'mastery',
    tier: 'gold',
    criteria: {
      type: 'perfect_session_easy_ratings',
      value: 1,
    },
    unlockMessage: '⭐ Flawless unlocked! Perfect execution!',
  },

  // Category Master Badge
  category_master: {
    id: 'category_master',
    name: 'Category Master',
    description: 'Master 50+ words in a single category',
    icon: '👑',
    category: 'mastery',
    tier: 'gold',
    criteria: {
      type: 'words_mastered_per_category',
      value: 50,
    },
    unlockMessage: '👑 Category Master unlocked! You\'ve dominated this category!',
  },

  // Consistency Badges
  consistency_7: {
    id: 'consistency_7',
    name: 'Consistent Learner',
    description: 'Review on 7 different days',
    icon: '📚',
    category: 'consistency',
    tier: 'bronze',
    criteria: {
      type: 'review_days',
      value: 7,
    },
    unlockMessage: '📚 Consistent Learner unlocked! You\'re building a habit!',
  },
  consistency_30: {
    id: 'consistency_30',
    name: 'Monthly Scholar',
    description: 'Review on 30 different days',
    icon: '📚',
    category: 'consistency',
    tier: 'silver',
    criteria: {
      type: 'review_days',
      value: 30,
    },
    unlockMessage: '📚 Monthly Scholar unlocked! Consistency is your superpower!',
  },
  consistency_100: {
    id: 'consistency_100',
    name: 'Master of Discipline',
    description: 'Review on 100 different days',
    icon: '📚',
    category: 'consistency',
    tier: 'gold',
    criteria: {
      type: 'review_days',
      value: 100,
    },
    unlockMessage: '📚 Master of Discipline unlocked! You\'ve proven your commitment!',
  },
};
