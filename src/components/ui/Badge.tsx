import type { SrsStage } from '@/types';

interface BadgeProps {
  stage: SrsStage;
  className?: string;
}

const BADGE_STYLES: Record<SrsStage, { bg: string; text: string; border: string }> = {
  new:       { bg: '#e8e4dc', text: '#6b6358', border: '#c8bfaf' },
  learning:  { bg: '#fff4e0', text: '#8b6914', border: '#e8c870' },
  reviewing: { bg: '#e8f0f8', text: '#2a5a8a', border: '#a0c0e0' },
  mastered:  { bg: '#e8f4ec', text: '#2a6840', border: '#90c8a0' },
};

const STAGE_LABELS: Record<SrsStage, string> = {
  new: 'New',
  learning: 'Learning',
  reviewing: 'Reviewing',
  mastered: 'Mastered',
};

export function Badge({ stage, className }: BadgeProps) {
  const styles = BADGE_STYLES[stage];
  return (
    <span
      className={`inline-flex items-center font-mono text-[8px] uppercase tracking-[1px] px-2 py-0.5 border rounded-sm ${className ?? ''}`}
      style={{ background: styles.bg, color: styles.text, borderColor: styles.border }}
    >
      {STAGE_LABELS[stage]}
    </span>
  );
}
