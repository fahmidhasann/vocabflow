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
          <div key={stage} className="rounded-2xl border border-ox-line bg-ox-surface-alt px-4 py-4">
            <div className="mb-2 flex items-center justify-between gap-3">
              <span className="font-mono text-[9px] uppercase tracking-[0.22em] text-ox-muted">
                {SRS_STAGE_LABELS[stage]}
              </span>
              <span className="font-mono text-[10px] text-ox-muted">{count}</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-ox-border">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{ width: `${pct}%`, background: barColors[stage] }}
              />
            </div>
            <p className="mt-2 font-serif text-[13px] text-ox-muted">{Math.round(pct)}% of your library</p>
          </div>
        );
      })}
    </div>
  );
}
