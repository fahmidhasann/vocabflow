'use client';

import { useState, useCallback } from 'react';
import { db } from '@/lib/db';
import { calculateNextReview } from '@/lib/srs';
import { todayDateString } from '@/lib/utils';
import type { Word, Rating, ReviewSessionState } from '@/types';

const INITIAL_STATE: ReviewSessionState = {
  state: 'idle',
  words: [],
  currentIndex: 0,
  ratings: {},
  startTime: 0,
};

export function useReviewSession() {
  const [session, setSession] = useState<ReviewSessionState>(INITIAL_STATE);

  const startSession = useCallback((words: Word[]) => {
    if (words.length === 0) return;
    setSession({
      state: 'showing-front',
      words,
      currentIndex: 0,
      ratings: {},
      startTime: Date.now(),
    });
  }, []);

  const showAnswer = useCallback(() => {
    setSession((s) => ({ ...s, state: 'showing-back' }));
  }, []);

  const rateAndNext = useCallback(async (rating: Rating) => {
    const { words, currentIndex, ratings } = session;
    const currentWord = words[currentIndex];
    if (!currentWord?.id) return;

    // Update SRS fields
    const updates = calculateNextReview(currentWord, rating);
    await db.words.update(currentWord.id, updates);

    const newRatings = { ...ratings, [currentWord.id]: rating };
    const nextIndex = currentIndex + 1;

    if (nextIndex >= words.length) {
      // Session complete - save record
      const duration = Math.round((Date.now() - session.startTime) / 1000);
      await db.reviewSessions.add({
        date: todayDateString(),
        wordsReviewed: words.length,
        ratings: newRatings,
        duration,
        completedAt: new Date().toISOString(),
      });

      // Update streak
      await db.appState.put({ key: 'lastReviewDate', value: todayDateString() });

      setSession((s) => ({
        ...s,
        state: 'complete',
        ratings: newRatings,
      }));
    } else {
      setSession((s) => ({
        ...s,
        state: 'showing-front',
        currentIndex: nextIndex,
        ratings: newRatings,
      }));
    }
  }, [session]);

  const resetSession = useCallback(() => {
    setSession(INITIAL_STATE);
  }, []);

  const currentWord = session.words[session.currentIndex];
  const progress = session.words.length > 0
    ? Math.round((session.currentIndex / session.words.length) * 100)
    : 0;

  return {
    ...session,
    currentWord,
    progress,
    startSession,
    showAnswer,
    rateAndNext,
    resetSession,
  };
}
