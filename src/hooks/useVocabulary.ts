import { useState, useEffect, useCallback } from 'react';
import { WordEntry, ReviewRating, WordStatus } from '../types';

const STORAGE_KEY = 'vocabflow_words';

// Helper to get start of day for accurate daily comparisons
const getStartOfDay = (date: number = Date.now()) => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d.getTime();
};

export function useVocabulary() {
  const [words, setWords] = useState<WordEntry[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from local storage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setWords(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to parse stored words', e);
      }
    }
    setIsLoaded(true);
  }, []);

  // Save to local storage whenever words change
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(words));
    }
  }, [words, isLoaded]);

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
  }, []);

  const updateWord = useCallback((id: string, updates: Partial<WordEntry>) => {
    setWords((prev) => prev.map((w) => (w.id === id ? { ...w, ...updates } : w)));
  }, []);

  const deleteWord = useCallback((id: string) => {
    setWords((prev) => prev.filter((w) => w.id !== id));
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

        return {
          ...word,
          interval,
          easeFactor,
          consecutiveCorrect,
          nextReviewDate,
          status,
          lastReviewedAt: now,
        };
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

  return {
    words,
    isLoaded,
    addWord,
    updateWord,
    deleteWord,
    processReview,
    getDueWords,
    getStats,
  };
}
