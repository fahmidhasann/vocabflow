'use client';

import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/lib/db';
import { todayDateString } from '@/lib/utils';

export function useStreak() {
  return useLiveQuery(async () => {
    const sessions = await db.reviewSessions.orderBy('date').toArray();
    const today = todayDateString();

    if (sessions.length === 0) {
      return { current: 0, reviewDates: new Set<string>() };
    }

    const reviewDates = new Set(sessions.map((s) => s.date));

    // Calculate current streak
    let streak = 0;
    let checkDate = today;

    // If no review today, start from yesterday
    if (!reviewDates.has(today)) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      checkDate = yesterday.toISOString().split('T')[0];
      if (!reviewDates.has(checkDate)) {
        return { current: 0, reviewDates };
      }
    }

    while (reviewDates.has(checkDate)) {
      streak++;
      const prev = new Date(checkDate);
      prev.setDate(prev.getDate() - 1);
      checkDate = prev.toISOString().split('T')[0];
    }

    return { current: streak, reviewDates };
  });
}
