import { cn } from '@/lib/utils';
import { ButtonHTMLAttributes, forwardRef } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'soft' | 'danger';
  size?: 'sm' | 'md' | 'lg' | 'icon';
}

const variants = {
  primary: 'border border-ox-accent bg-ox-accent text-white shadow-[0_8px_20px_rgba(139,105,20,0.22)] hover:-translate-y-px hover:opacity-95',
  secondary: 'border border-ox-border bg-ox-surface text-ox-ink-deep hover:border-ox-accent hover:bg-ox-surface-alt',
  ghost: 'border border-transparent bg-transparent text-ox-muted hover:bg-ox-surface-alt hover:text-ox-ink',
  soft: 'border border-ox-accent/30 bg-ox-accent-soft text-ox-ink-deep hover:border-ox-accent hover:bg-ox-accent-soft',
  danger: 'border border-ox-danger/40 bg-ox-danger-soft text-ox-danger hover:border-ox-danger hover:bg-ox-danger-soft',
};

const sizes = {
  sm: 'min-h-10 px-3.5 py-2',
  md: 'min-h-11 px-4 py-2.5',
  lg: 'min-h-12 px-5 py-3',
  icon: 'h-11 w-11',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center gap-2 rounded-xl font-mono text-[10px] uppercase tracking-[0.18em] transition-[background,border-color,opacity,transform,color] duration-150 focus:outline-none focus:ring-2 focus:ring-ox-accent focus:ring-offset-2 focus:ring-offset-ox-bg',
          variants[variant],
          sizes[size],
          disabled && 'cursor-not-allowed opacity-50',
          className
        )}
        disabled={disabled}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';
