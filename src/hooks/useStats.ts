'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { rowToSession, type ReviewSessionRow, type WordRow } from '@/lib/supabase/mappers';
import { subscribe } from '@/lib/events';
import type { ReviewSession } from '@/types';

export function useStats() {
  const [stats, setStats] = useState<{
    total: number;
    byStage: { new: number; learning: number; reviewing: number; mastered: number };
    totalReviews: number;
    totalSessions: number;
    totalDuration: number;
    sessions: ReviewSession[];
  } | undefined>(undefined);

  useEffect(() => {
    const supabase = createClient();

    async function fetch() {
      const [wordsResult, sessionsResult] = await Promise.all([
        supabase.from('words').select('srs_stage'),
        supabase.from('review_sessions').select('*'),
      ]);

      const words = (wordsResult.data ?? []) as Pick<WordRow, 'srs_stage'>[];
      const sessionRows = (sessionsResult.data ?? []) as ReviewSessionRow[];
      const sessions = sessionRows.map(rowToSession);

      const total = words.length;
      const byStage = {
        new: words.filter((w) => w.srs_stage === 'new').length,
        learning: words.filter((w) => w.srs_stage === 'learning').length,
        reviewing: words.filter((w) => w.srs_stage === 'reviewing').length,
        mastered: words.filter((w) => w.srs_stage === 'mastered').length,
      };

      const totalReviews = sessions.reduce((sum, s) => sum + s.wordsReviewed, 0);
      const totalDuration = sessions.reduce((sum, s) => sum + s.duration, 0);

      setStats({
        total,
        byStage,
        totalReviews,
        totalSessions: sessions.length,
        totalDuration,
        sessions,
      });
    }

    fetch();
    const unsubWords = subscribe('words-changed', fetch);
    const unsubSessions = subscribe('sessions-changed', fetch);
    return () => { unsubWords(); unsubSessions(); };
  }, []);

  return stats;
}
