'use client';

interface StreakDisplayProps {
  currentStreak: number;
  reviewDates: Set<string>;
}

export function StreakDisplay({ currentStreak, reviewDates }: StreakDisplayProps) {
  const days: { date: string; hasReview: boolean }[] = [];
  for (let i = 29; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    days.push({ date: dateStr, hasReview: reviewDates.has(dateStr) });
  }

  return (
    <div>
      <div className="mb-4 flex items-end justify-between gap-3">
        <div className="flex items-baseline gap-2">
          <span className="font-display text-[34px] font-semibold text-ox-accent">{currentStreak}</span>
          <span className="font-mono text-[9px] uppercase tracking-[0.22em] text-ox-muted">day streak</span>
        </div>
        <p className="font-serif text-[13px] text-ox-muted">
          {reviewDates.size} study day{reviewDates.size === 1 ? '' : 's'} logged
        </p>
      </div>
      <div className="grid grid-cols-10 gap-1.5">
        {days.map((day) => (
          <div
            key={day.date}
            className="aspect-square w-full rounded-md border border-ox-line"
            style={{
              background: day.hasReview ? 'linear-gradient(180deg, var(--color-accent-light), var(--color-accent))' : 'var(--color-surface-alt)',
            }}
            title={day.date}
          />
        ))}
      </div>
      <div className="mt-2 flex items-center justify-between">
        <p className="font-mono text-[8px] uppercase tracking-[0.16em] text-ox-muted">30-day history</p>
        <p className="font-serif text-[12px] text-ox-muted">
          {currentStreak > 0 ? 'Consistency is compounding.' : 'Start with one session today.'}
        </p>
      </div>
    </div>
  );
}
