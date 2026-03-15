import { SRS_STAGE_LABELS } from '@/lib/constants';

interface LevelDistributionProps {
  byStage: Record<string, number>;
  total: number;
}

const stages = ['new', 'learning', 'reviewing', 'mastered'] as const;

const barColors: Record<string, string> = {
  new: 'bg-gray-500',
  learning: 'bg-yellow-500',
  reviewing: 'bg-blue-500',
  mastered: 'bg-green-500',
};

export function LevelDistribution({ byStage, total }: LevelDistributionProps) {
  return (
    <div className="space-y-3">
      {stages.map((stage) => {
        const count = byStage[stage] || 0;
        const pct = total > 0 ? (count / total) * 100 : 0;
        return (
          <div key={stage}>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-700 dark:text-gray-300">{SRS_STAGE_LABELS[stage]}</span>
              <span className="text-gray-500 dark:text-gray-400">{count}</span>
            </div>
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${barColors[stage]}`}
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
