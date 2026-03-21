interface ReviewProgressProps {
  current: number;
  total: number;
}

export function ReviewProgress({ current, total }: ReviewProgressProps) {
  const percentage = total > 0 ? Math.round((current / total) * 100) : 0;

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="flex justify-between mb-1.5">
        <span className="font-mono uppercase text-ox-muted" style={{ fontSize: '9px', letterSpacing: '2px' }}>
          Progress
        </span>
        <span className="font-mono text-ox-muted" style={{ fontSize: '9px', letterSpacing: '1px' }}>
          {current} / {total}
        </span>
      </div>
      <div className="w-full bg-ox-border rounded-sm overflow-hidden" style={{ height: '3px' }}>
        <div
          className="h-full bg-ox-accent rounded-sm transition-[width] duration-300 ease-linear"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
