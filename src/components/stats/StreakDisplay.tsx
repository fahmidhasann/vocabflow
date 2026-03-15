'use client';

import { cn } from '@/lib/utils';

interface StreakDisplayProps {
  currentStreak: number;
  reviewDates: Set<string>;
}

export function StreakDisplay({ currentStreak, reviewDates }: StreakDisplayProps) {
  // Generate last 30 days
  const days: { date: string; hasReview: boolean }[] = [];
  for (let i = 29; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    days.push({ date: dateStr, hasReview: reviewDates.has(dateStr) });
  }

  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <span className="text-2xl font-bold text-orange-500">{currentStreak}</span>
        <span className="text-sm text-gray-500 dark:text-gray-400">day streak</span>
      </div>
      <div className="grid grid-cols-10 gap-1">
        {days.map((day) => (
          <div
            key={day.date}
            className={cn(
              'w-full aspect-square rounded-sm',
              day.hasReview
                ? 'bg-green-500 dark:bg-green-400'
                : 'bg-gray-200 dark:bg-gray-700'
            )}
            title={day.date}
          />
        ))}
      </div>
      <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Last 30 days</p>
    </div>
  );
}
