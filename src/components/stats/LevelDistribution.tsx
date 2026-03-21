import { SRS_STAGE_LABELS } from '@/lib/constants';

interface LevelDistributionProps {
  byStage: Record<string, number>;
  total: number;
}

const stages = ['new', 'learning', 'reviewing', 'mastered'] as const;

const barColors: Record<string, string> = {
  new:       '#c8bfaf',
  learning:  '#e8c870',
  reviewing: '#a0c0e0',
  mastered:  '#90c8a0',
};

export function LevelDistribution({ byStage, total }: LevelDistributionProps) {
  return (
    <div className="space-y-3">
      {stages.map((stage) => {
        const count = byStage[stage] || 0;
        const pct = total > 0 ? (count / total) * 100 : 0;
        return (
          <div key={stage}>
            <div className="flex justify-between mb-1">
              <span className="font-mono uppercase text-ox-muted" style={{ fontSize: '9px', letterSpacing: '2px' }}>
                {SRS_STAGE_LABELS[stage]}
              </span>
              <span className="font-mono text-ox-muted" style={{ fontSize: '9px' }}>{count}</span>
            </div>
            <div className="bg-ox-border rounded-sm overflow-hidden" style={{ height: '4px' }}>
              <div
                className="h-full rounded-sm transition-all duration-500"
                style={{ width: `${pct}%`, background: barColors[stage] }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
