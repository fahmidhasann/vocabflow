import { cn } from '@/lib/utils';
import { SRS_STAGE_LABELS, SRS_STAGE_COLORS } from '@/lib/constants';
import type { SrsStage } from '@/types';

interface BadgeProps {
  stage: SrsStage;
  className?: string;
}

export function Badge({ stage, className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium text-white',
        SRS_STAGE_COLORS[stage],
        className
      )}
    >
      {SRS_STAGE_LABELS[stage]}
    </span>
  );
}
