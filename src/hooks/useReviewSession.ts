'use client';

import { useState, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { wordToUpdate, sessionToInsert } from '@/lib/supabase/mappers';
import { calculateNextReview } from '@/lib/srs';
import { todayDateString } from '@/lib/utils';
import { emit } from '@/lib/events';
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

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // Update SRS fields
    const updates = calculateNextReview(currentWord, rating);
    await supabase
      .from('words')
      .update(wordToUpdate(updates))
      .eq('id', currentWord.id);

    const newRatings = { ...ratings, [currentWord.id]: rating };
    const nextIndex = currentIndex + 1;

    if (nextIndex >= words.length) {
      // Session complete — save record
      const duration = Math.round((Date.now() - session.startTime) / 1000);
      await supabase.from('review_sessions').insert(
        sessionToInsert(
          {
            date: todayDateString(),
            wordsReviewed: words.length,
            ratings: newRatings,
            duration,
            completedAt: new Date().toISOString(),
          },
          user.id
        )
      );

      // Update last review date
      await supabase.from('app_state').upsert({
        user_id: user.id,
        key: 'lastReviewDate',
        value: todayDateString(),
      });

      emit('words-changed');
      emit('sessions-changed');
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
