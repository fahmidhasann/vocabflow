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
    { value: total, label: 'Total Words' },
    { value: byStage.mastered ?? 0, label: 'Mastered' },
    { value: totalReviews, label: 'Total Reviews' },
    { value: timeStr, label: 'Time Spent' },
  ];

  return (
    <div className="grid grid-cols-2 gap-3">
      {stats.map(({ value, label }) => (
        <Card key={label} className="text-center">
          <p className="font-display font-semibold text-ox-accent" style={{ fontSize: '22px' }}>{value}</p>
          <p className="font-mono uppercase text-ox-muted mt-0.5" style={{ fontSize: '9px', letterSpacing: '2px' }}>{label}</p>
        </Card>
      ))}
    </div>
  );
}
