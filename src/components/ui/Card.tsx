import { cn } from '@/lib/utils';
import { HTMLAttributes } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  noPadding?: boolean;
}

export function Card({ className, noPadding = false, children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'bg-ox-surface rounded-lg border border-ox-border',
        !noPadding && 'p-4',
        className
      )}
      style={{ boxShadow: '0 2px 8px rgba(26,18,8,0.06)' }}
      {...props}
    >
      {children}
    </div>
  );
}
