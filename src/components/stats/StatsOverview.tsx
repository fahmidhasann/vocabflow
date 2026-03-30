import { Card } from '@/components/ui/Card';

interface StatsOverviewProps {
  total: number;
  byStage: Record<string, number>;
  totalReviews: number;
  totalDuration: number;
}

export function StatsOverview({ total, byStage, totalReviews, totalDuration }: StatsOverviewProps) {
  const hours = Math.floor(totalDuration / 3600);
  const mins = Math.floor((totalDuration % 3600) / 60);
  const timeStr = hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;

  const stats = [
    { value: total, label: 'Total Words', tone: 'text-ox-accent' },
    { value: byStage.mastered ?? 0, label: 'Mastered', tone: 'text-ox-success' },
    { value: totalReviews, label: 'Reviews', tone: 'text-ox-info' },
    { value: timeStr, label: 'Time Spent', tone: 'text-ox-ink-deep' },
  ];

  return (
    <div className="grid grid-cols-2 gap-3">
      {stats.map(({ value, label, tone }) => (
        <Card key={label} variant="compact" padding="md" className="text-center">
          <p className={`font-display text-[28px] font-semibold ${tone}`}>{value}</p>
          <p className="mt-1 font-mono text-[9px] uppercase tracking-[0.22em] text-ox-muted">{label}</p>
        </Card>
      ))}
    </div>
  );
}
