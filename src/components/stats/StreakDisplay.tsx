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
      <div className="flex items-baseline gap-2 mb-3">
        <span className="font-display font-bold text-ox-accent" style={{ fontSize: '22px' }}>{currentStreak}</span>
        <span className="font-mono uppercase text-ox-muted" style={{ fontSize: '9px', letterSpacing: '2px' }}>day streak</span>
      </div>
      <div className="grid grid-cols-10 gap-1">
        {days.map((day) => (
          <div
            key={day.date}
            className="w-full aspect-square rounded-sm"
            style={{
              background: day.hasReview ? 'var(--color-accent-light)' : 'var(--color-bg-dark)',
              borderRadius: '2px',
            }}
            title={day.date}
          />
        ))}
      </div>
      <p className="font-mono uppercase text-ox-muted mt-1" style={{ fontSize: '8px', letterSpacing: '1px' }}>Last 30 days</p>
    </div>
  );
}
