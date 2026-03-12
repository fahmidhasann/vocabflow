import { useState, useEffect, useCallback } from 'react';
import { WordEntry, ReviewRating, WordStatus, Category, CategoryColor, Achievement, BadgeType } from '../types';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

const STORAGE_KEY = 'vocabflow_words';
const CATEGORIES_STORAGE_KEY = 'vocabflow_categories';
const ACHIEVEMENTS_STORAGE_KEY = 'vocabflow_achievements';

// Supabase row shape (snake_case columns)
type WordRow = {
  id: string;
  word: string;
  definition: string;
  context: string | null;
  personal_example: string;
  keyword: string | null;
  status: string;
  next_review_date: number;
  interval: number;
  ease_factor: number;
  consecutive_correct: number;
  created_at: number;
  last_reviewed_at: number | null;
  category_id?: string | null;
};

// Category row type - reserved for future category system implementation
// type CategoryRow = {
//   id: string;
//   name: string;
//   description: string | null;
//   color: string | null;
//   created_at: number;
// };

function rowToEntry(row: WordRow): WordEntry {
  return {
    id: row.id,
    word: row.word,
    definition: row.definition,
    context: row.context ?? undefined,
    personalExample: row.personal_example,
    keyword: row.keyword ?? undefined,
    categoryId: row.category_id ?? undefined,
    status: row.status as WordStatus,
    nextReviewDate: row.next_review_date,
    interval: row.interval,
    easeFactor: row.ease_factor,
    consecutiveCorrect: row.consecutive_correct,
    createdAt: row.created_at,
    lastReviewedAt: row.last_reviewed_at ?? undefined,
  };
}

function entryToRow(entry: WordEntry): WordRow {
  return {
    id: entry.id,
    word: entry.word,
    definition: entry.definition,
    context: entry.context ?? null,
    personal_example: entry.personalExample,
    keyword: entry.keyword ?? null,
    status: entry.status,
    next_review_date: entry.nextReviewDate,
    interval: entry.interval,
    ease_factor: entry.easeFactor,
    consecutive_correct: entry.consecutiveCorrect,
    created_at: entry.createdAt,
    last_reviewed_at: entry.lastReviewedAt ?? null,
    category_id: entry.categoryId ?? null,
  };
}

// Category conversion functions - reserved for future category system implementation
// function rowToCategory(row: CategoryRow): Category {
//   return {
//     id: row.id,
//     name: row.name,
//     description: row.description ?? undefined,
//     color: (row.color as CategoryColor) ?? undefined,
//     createdAt: row.created_at,
//   };
// }
// 
// function categoryToRow(category: Category): CategoryRow {
//   return {
//     id: category.id,
//     name: category.name,
//     description: category.description ?? null,
//     color: category.color ?? null,
//     created_at: category.createdAt,
//   };
// }

// Helper to get start of day for accurate daily comparisons
const getStartOfDay = (date: number = Date.now()) => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d.getTime();
};

export function useVocabulary() {
  const [words, setWords] = useState<WordEntry[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load data: prefer Supabase if configured, else localStorage
  useEffect(() => {
    (async () => {
      if (isSupabaseConfigured && supabase) {
        const { data, error } = await supabase
          .from('words')
          .select('*')
          .order('created_at', { ascending: true });
        if (!error && data) {
          if (data.length === 0) {
            // Migrate any existing localStorage data to Supabase
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
              try {
                const localWords: WordEntry[] = JSON.parse(stored);
                if (localWords.length > 0) {
                  await supabase.from('words').insert(localWords.map(entryToRow));
                  setWords(localWords);
                }
              } catch {}
            }
          } else {
            setWords((data as WordRow[]).map(rowToEntry));
          }
        } else {
          // Supabase error — fall back to localStorage
          const stored = localStorage.getItem(STORAGE_KEY);
          if (stored) try { setWords(JSON.parse(stored)); } catch {}
        }
      } else {
        // No Supabase — use localStorage only
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          try {
            setWords(JSON.parse(stored));
          } catch (e) {
            console.error('Failed to parse stored words', e);
          }
        }
      }
      setIsLoaded(true);
    })();
  }, []);

  // Load categories from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(CATEGORIES_STORAGE_KEY);
    if (stored) {
      try {
        setCategories(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to parse stored categories', e);
      }
    }
  }, []);

  // Load achievements from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(ACHIEVEMENTS_STORAGE_KEY);
    if (stored) {
      try {
        setAchievements(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to parse stored achievements', e);
      }
    }
  }, []);

  // Always cache to localStorage (fast reloads + offline fallback)
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(words));
    }
  }, [words, isLoaded]);

  // Cache categories to localStorage
  useEffect(() => {
    localStorage.setItem(CATEGORIES_STORAGE_KEY, JSON.stringify(categories));
  }, [categories]);

  // Cache achievements to localStorage
  useEffect(() => {
    localStorage.setItem(ACHIEVEMENTS_STORAGE_KEY, JSON.stringify(achievements));
  }, [achievements]);

  // Check achievements whenever words or categories change (after reviews/updates)
  useEffect(() => {
    if (isLoaded && words.length > 0) {
      checkAchievements();
    }
  }, [words.length, isLoaded]);

  const addWord = useCallback((newWord: Omit<WordEntry, 'id' | 'status' | 'nextReviewDate' | 'interval' | 'easeFactor' | 'consecutiveCorrect' | 'createdAt'>) => {
    const word: WordEntry = {
      ...newWord,
      id: crypto.randomUUID(),
      status: 'new',
      // Schedule first review for today
      nextReviewDate: getStartOfDay(),
      interval: 0,
      easeFactor: 2.5,
      consecutiveCorrect: 0,
      createdAt: Date.now(),
    };
    setWords((prev) => [...prev, word]);
    if (isSupabaseConfigured && supabase) {
      supabase.from('words').insert(entryToRow(word)).then(({ error }) => {
        if (error) console.error('Supabase insert error', error);
      });
    }
  }, []);

  const updateWord = useCallback((id: string, updates: Partial<WordEntry>) => {
    setWords((prev) => prev.map((w) => (w.id === id ? { ...w, ...updates } : w)));
    if (isSupabaseConfigured && supabase) {
      // Build a partial row from the updates
      const rowUpdates: Partial<WordRow> = {};
      if (updates.word !== undefined) rowUpdates.word = updates.word;
      if (updates.definition !== undefined) rowUpdates.definition = updates.definition;
      if (updates.context !== undefined) rowUpdates.context = updates.context ?? null;
      if (updates.personalExample !== undefined) rowUpdates.personal_example = updates.personalExample;
      if (updates.keyword !== undefined) rowUpdates.keyword = updates.keyword ?? null;
      if (updates.status !== undefined) rowUpdates.status = updates.status;
      if (updates.nextReviewDate !== undefined) rowUpdates.next_review_date = updates.nextReviewDate;
      if (updates.interval !== undefined) rowUpdates.interval = updates.interval;
      if (updates.easeFactor !== undefined) rowUpdates.ease_factor = updates.easeFactor;
      if (updates.consecutiveCorrect !== undefined) rowUpdates.consecutive_correct = updates.consecutiveCorrect;
      if (updates.lastReviewedAt !== undefined) rowUpdates.last_reviewed_at = updates.lastReviewedAt ?? null;
      supabase.from('words').update(rowUpdates).eq('id', id).then(({ error }) => {
        if (error) console.error('Supabase update error', error);
      });
    }
  }, []);

  const deleteWord = useCallback((id: string) => {
    setWords((prev) => prev.filter((w) => w.id !== id));
    if (isSupabaseConfigured && supabase) {
      supabase.from('words').delete().eq('id', id).then(({ error }) => {
        if (error) console.error('Supabase delete error', error);
      });
    }
  }, []);

  // Simplified SuperMemo-2 Algorithm
  const processReview = useCallback((id: string, rating: ReviewRating) => {
    setWords((prev) =>
      prev.map((word) => {
        if (word.id !== id) return word;

        let { interval, easeFactor, consecutiveCorrect } = word;
        const now = Date.now();

        if (rating === 'again') {
          consecutiveCorrect = 0;
          interval = 1;
          easeFactor = Math.max(1.3, easeFactor - 0.2);
        } else {
          if (rating === 'hard') {
            easeFactor = Math.max(1.3, easeFactor - 0.15);
            interval = interval === 0 ? 1 : interval * 1.2;
          } else if (rating === 'good') {
            interval = interval === 0 ? 1 : interval === 1 ? 4 : interval * easeFactor;
          } else if (rating === 'easy') {
            easeFactor += 0.15;
            interval = interval === 0 ? 4 : interval * easeFactor * 1.3;
          }
          consecutiveCorrect++;
        }

        // Round interval to nearest day
        interval = Math.round(interval);
        
        // Calculate next review date
        const nextReviewDate = getStartOfDay(now + interval * 24 * 60 * 60 * 1000);

        // Determine status
        let status: WordStatus = 'learning';
        if (interval > 21) status = 'mastered';
        else if (interval === 0) status = 'new';

        const updated: WordEntry = {
          ...word,
          interval,
          easeFactor,
          consecutiveCorrect,
          nextReviewDate,
          status,
          lastReviewedAt: now,
        };

        if (isSupabaseConfigured && supabase) {
          supabase.from('words').update(entryToRow(updated)).eq('id', id).then(({ error }) => {
            if (error) console.error('Supabase update error', error);
          });
        }

        return updated;
      })
    );
  }, []);

  const getDueWords = useCallback(() => {
    const today = getStartOfDay();
    return words.filter((w) => w.nextReviewDate <= today);
  }, [words]);

  const getStats = useCallback(() => {
    const total = words.length;
    const newWords = words.filter((w) => w.status === 'new').length;
    const learning = words.filter((w) => w.status === 'learning').length;
    const mastered = words.filter((w) => w.status === 'mastered').length;
    const dueToday = getDueWords().length;

    return { total, newWords, learning, mastered, dueToday };
  }, [words, getDueWords]);

  // ===== CATEGORY MANAGEMENT =====
  const addCategory = useCallback((name: string, description?: string, color?: CategoryColor) => {
    const category: Category = {
      id: crypto.randomUUID(),
      name,
      description,
      color,
      createdAt: Date.now(),
    };
    setCategories((prev) => [...prev, category]);
  }, []);

  const updateCategory = useCallback((id: string, updates: Partial<Category>) => {
    setCategories((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updates } : c))
    );
  }, []);

  const deleteCategory = useCallback((id: string) => {
    setCategories((prev) => prev.filter((c) => c.id !== id));
    // Remove categoryId from all words in this category
    setWords((prev) =>
      prev.map((w) => (w.categoryId === id ? { ...w, categoryId: undefined } : w))
    );
  }, []);

  const getWordsByCategory = useCallback(
    (categoryId: string) => {
      return words.filter((w) => w.categoryId === categoryId);
    },
    [words]
  );

  const getCategoryStats = useCallback(
    (categoryId: string) => {
      const wordsInCategory = getWordsByCategory(categoryId);
      return {
        total: wordsInCategory.length,
        mastered: wordsInCategory.filter((w) => w.status === 'mastered').length,
        learning: wordsInCategory.filter((w) => w.status === 'learning').length,
        new: wordsInCategory.filter((w) => w.status === 'new').length,
      };
    },
    [getWordsByCategory]
  );

  const getUncategorizedWords = useCallback(() => {
    return words.filter((w) => !w.categoryId);
  }, [words]);

  // ===== ACHIEVEMENT MANAGEMENT =====
  const unlockAchievement = useCallback((badgeType: BadgeType, name: string, description: string, icon: string, category: 'streak' | 'mastery' | 'consistency' | 'milestone', tier?: 'bronze' | 'silver' | 'gold') => {
    // Check if already unlocked
    if (achievements.some((a) => a.id === badgeType)) {
      return;
    }

    const achievement: Achievement = {
      id: badgeType,
      name,
      description,
      icon,
      category,
      tier,
      unlockedAt: Date.now(),
      criteria: {
        type: badgeType,
        value: 0,
      },
    };

    setAchievements((prev) => [...prev, achievement]);
  }, [achievements]);

  // Calculate daily streak from review history
  const calculateDailyStreak = useCallback(() => {
    if (words.length === 0) return 0;

    const reviewedByDay = new Map<string, boolean>();
    
    words.forEach((word) => {
      if (word.lastReviewedAt) {
        const day = getStartOfDay(word.lastReviewedAt);
        reviewedByDay.set(day.toString(), true);
      }
    });

    let streak = 0;
    let currentDay = getStartOfDay();

    while (reviewedByDay.has(currentDay.toString())) {
      streak++;
      currentDay -= 24 * 60 * 60 * 1000;
    }

    return streak;
  }, [words]);

  // Check all achievement criteria
  const checkAchievements = useCallback(() => {
    const dailyStreak = calculateDailyStreak();
    const totalWords = words.length;
    const perfectSessions = words.filter((w) => w.consecutiveCorrect > 0).length;
    const reviewDaysCount = new Set(
      words
        .filter((w) => w.lastReviewedAt)
        .map((w) => getStartOfDay(w.lastReviewedAt!).toString())
    ).size;

    // Streak achievements
    if (dailyStreak >= 7 && !achievements.some((a) => a.id === 'streak_7')) {
      unlockAchievement(
        'streak_7',
        'Week Warrior',
        'Maintained a 7-day review streak',
        '🔥',
        'streak',
        'bronze'
      );
    }

    if (dailyStreak >= 30 && !achievements.some((a) => a.id === 'streak_30')) {
      unlockAchievement(
        'streak_30',
        'Month Master',
        'Maintained a 30-day review streak',
        '🔥',
        'streak',
        'silver'
      );
    }

    if (dailyStreak >= 100 && !achievements.some((a) => a.id === 'streak_100')) {
      unlockAchievement(
        'streak_100',
        'Legendary Learner',
        'Maintained a 100-day review streak',
        '🔥',
        'streak',
        'gold'
      );
    }

    // Word count milestones
    if (totalWords >= 5 && !achievements.some((a) => a.id === 'first_steps_5')) {
      unlockAchievement(
        'first_steps_5',
        'First Steps',
        'Added 5 words to vocabulary',
        '👣',
        'milestone',
        'bronze'
      );
    }

    if (totalWords >= 25 && !achievements.some((a) => a.id === 'first_steps_25')) {
      unlockAchievement(
        'first_steps_25',
        'Building Momentum',
        'Added 25 words to vocabulary',
        '👣',
        'milestone',
        'silver'
      );
    }

    if (totalWords >= 100 && !achievements.some((a) => a.id === 'first_steps_100')) {
      unlockAchievement(
        'first_steps_100',
        'Vocabulary Virtuoso',
        'Added 100 words to vocabulary',
        '👣',
        'milestone',
        'gold'
      );
    }

    // Perfect session achievement
    if (perfectSessions > 0 && !achievements.some((a) => a.id === 'perfect_session')) {
      unlockAchievement(
        'perfect_session',
        'Flawless',
        'Completed a perfect review session',
        '⭐',
        'mastery'
      );
    }

    // Category mastery
    categories.forEach((category) => {
      const categoryWords = words.filter((w) => w.categoryId === category.id);
      const masteredInCategory = categoryWords.filter((w) => w.status === 'mastered').length;
      
      if (categoryWords.length > 0 && masteredInCategory === categoryWords.length && categoryWords.length > 0) {
        const masteryBadge: BadgeType = `category_master` as BadgeType;
        if (!achievements.some((a) => a.id === masteryBadge)) {
          unlockAchievement(
            masteryBadge,
            'Category Master',
            `Mastered all words in ${category.name}`,
            '🏆',
            'mastery'
          );
        }
      }
    });

    // Consistency achievements (review days count)
    if (reviewDaysCount >= 7 && !achievements.some((a) => a.id === 'consistency_7')) {
      unlockAchievement(
        'consistency_7',
        'Consistent Learner',
        'Reviewed on 7 different days',
        '📅',
        'consistency',
        'bronze'
      );
    }

    if (reviewDaysCount >= 30 && !achievements.some((a) => a.id === 'consistency_30')) {
      unlockAchievement(
        'consistency_30',
        'Dedicated Scholar',
        'Reviewed on 30 different days',
        '📅',
        'consistency',
        'silver'
      );
    }

    if (reviewDaysCount >= 100 && !achievements.some((a) => a.id === 'consistency_100')) {
      unlockAchievement(
        'consistency_100',
        'Eternal Student',
        'Reviewed on 100 different days',
        '📅',
        'consistency',
        'gold'
      );
    }
  }, [words, categories, achievements, unlockAchievement]);

  return {
    words,
    categories,
    achievements,
    isLoaded,
    addWord,
    updateWord,
    deleteWord,
    processReview,
    getDueWords,
    getStats,
    addCategory,
    updateCategory,
    deleteCategory,
    getWordsByCategory,
    getCategoryStats,
    getUncategorizedWords,
    unlockAchievement,
    checkAchievements,
  };
}
