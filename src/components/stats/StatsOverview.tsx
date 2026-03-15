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

  return (
    <div className="grid grid-cols-2 gap-3">
      <Card className="text-center">
        <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{total}</p>
        <p className="text-xs text-gray-500 dark:text-gray-400">Total Words</p>
      </Card>
      <Card className="text-center">
        <p className="text-2xl font-bold text-green-600 dark:text-green-400">{byStage.mastered}</p>
        <p className="text-xs text-gray-500 dark:text-gray-400">Mastered</p>
      </Card>
      <Card className="text-center">
        <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{totalReviews}</p>
        <p className="text-xs text-gray-500 dark:text-gray-400">Total Reviews</p>
      </Card>
      <Card className="text-center">
        <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{timeStr}</p>
        <p className="text-xs text-gray-500 dark:text-gray-400">Time Spent</p>
      </Card>
    </div>
  );
}
