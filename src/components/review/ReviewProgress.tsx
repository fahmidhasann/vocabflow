interface ReviewProgressProps {
  current: number;
  total: number;
}

export function ReviewProgress({ current, total }: ReviewProgressProps) {
  const currentStep = total > 0 ? Math.min(current + 1, total) : 0;
  const percentage = total > 0 ? Math.round((currentStep / total) * 100) : 0;

  return (
    <div className="mx-auto w-full max-w-2xl">
      <div className="mb-2 flex items-center justify-between gap-3">
        <span className="font-mono text-[10px] uppercase tracking-[0.26em] text-ox-muted">
          Progress
        </span>
        <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-ox-muted">
          {currentStep} of {total}
        </span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-ox-border">
        <div
          className="h-full rounded-full bg-[linear-gradient(90deg,var(--color-accent),var(--color-accent-light))] transition-[width] duration-300 ease-linear"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
