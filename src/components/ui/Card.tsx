import { cn } from '@/lib/utils';
import { HTMLAttributes } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  padding?: 'none' | 'sm' | 'md' | 'lg';
  variant?: 'default' | 'hero' | 'compact' | 'subtle';
}

const paddingStyles = {
  none: '',
  sm: 'p-3',
  md: 'p-4',
  lg: 'p-5 md:p-6',
};

const variantStyles = {
  default: 'bg-ox-surface border border-ox-border',
  hero: 'bg-[linear-gradient(180deg,color-mix(in_srgb,var(--color-surface)_88%,white_12%),var(--color-paper))] border border-ox-border',
  compact: 'bg-ox-surface-alt border border-ox-line',
  subtle: 'bg-[color-mix(in_srgb,var(--color-surface)_84%,transparent)] border border-ox-line',
};

export function Card({
  className,
  padding = 'md',
  variant = 'default',
  children,
  ...props
}: CardProps) {
  return (
    <div
      className={cn(
        'rounded-2xl',
        variantStyles[variant],
        paddingStyles[padding],
        className
      )}
      style={{ boxShadow: '0 14px 32px rgba(26, 18, 8, 0.08)' }}
      {...props}
    >
      {children}
    </div>
  );
}
