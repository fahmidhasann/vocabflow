'use client';

import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/lib/db';

export function useStats() {
  return useLiveQuery(async () => {
    const words = await db.words.toArray();
    const sessions = await db.reviewSessions.toArray();

    const total = words.length;
    const byStage = {
      new: words.filter((w) => w.srsStage === 'new').length,
      learning: words.filter((w) => w.srsStage === 'learning').length,
      reviewing: words.filter((w) => w.srsStage === 'reviewing').length,
      mastered: words.filter((w) => w.srsStage === 'mastered').length,
    };

    const totalReviews = sessions.reduce((sum, s) => sum + s.wordsReviewed, 0);
    const totalDuration = sessions.reduce((sum, s) => sum + s.duration, 0);

    return {
      total,
      byStage,
      totalReviews,
      totalSessions: sessions.length,
      totalDuration,
      sessions,
    };
  });
}
