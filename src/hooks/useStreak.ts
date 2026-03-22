'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { todayDateString } from '@/lib/utils';
import { subscribe } from '@/lib/events';

export function useStreak() {
  const [result, setResult] = useState<
    { current: number; reviewDates: Set<string> } | undefined
  >(undefined);

  useEffect(() => {
    const supabase = createClient();

    async function fetch() {
      const { data } = await supabase
        .from('review_sessions')
        .select('date')
        .order('date', { ascending: true });

      const sessions = (data ?? []) as { date: string }[];
      const today = todayDateString();

      if (sessions.length === 0) {
        setResult({ current: 0, reviewDates: new Set<string>() });
        return;
      }

      const reviewDates = new Set(sessions.map((s) => s.date));

      let streak = 0;
      let checkDate = today;

      if (!reviewDates.has(today)) {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        checkDate = yesterday.toISOString().split('T')[0];
        if (!reviewDates.has(checkDate)) {
          setResult({ current: 0, reviewDates });
          return;
        }
      }

      while (reviewDates.has(checkDate)) {
        streak++;
        const prev = new Date(checkDate);
        prev.setDate(prev.getDate() - 1);
        checkDate = prev.toISOString().split('T')[0];
      }

      setResult({ current: streak, reviewDates });
    }

    fetch();
    return subscribe('sessions-changed', fetch);
  }, []);

  return result;
}
