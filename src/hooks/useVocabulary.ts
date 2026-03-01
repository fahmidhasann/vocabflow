import { useState, useEffect, useCallback } from 'react';
import { WordEntry, ReviewRating, WordStatus } from '../types';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

const STORAGE_KEY = 'vocabflow_words';

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
};

function rowToEntry(row: WordRow): WordEntry {
  return {
    id: row.id,
    word: row.word,
    definition: row.definition,
    context: row.context ?? undefined,
    personalExample: row.personal_example,
    keyword: row.keyword ?? undefined,
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
  };
}

// Helper to get start of day for accurate daily comparisons
const getStartOfDay = (date: number = Date.now()) => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d.getTime();
};

export function useVocabulary() {
  const [words, setWords] = useState<WordEntry[]>([]);
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

  // Always cache to localStorage (fast reloads + offline fallback)
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
