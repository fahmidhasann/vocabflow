import { cn } from '@/lib/utils';
import { ButtonHTMLAttributes, forwardRef } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
}

const variants = {
  primary: 'bg-ox-accent text-white border border-ox-accent hover:opacity-90',
  secondary: 'bg-transparent text-ox-ink-deep border border-ox-accent hover:bg-ox-bg-dark',
  ghost: 'bg-transparent text-ox-muted border border-ox-border hover:bg-ox-bg-dark',
  danger: 'bg-transparent text-[#8b2020] border border-[#c97070] hover:bg-[#c97070]/10',
};

const sizes = {
  sm: 'px-3.5 py-2',
  md: 'px-5 py-2.5',
  lg: 'px-7 py-3',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center rounded-sm font-mono text-[10px] uppercase tracking-[1.5px] transition-[background,border-color,opacity] duration-150 focus:outline-none focus:ring-2 focus:ring-ox-accent focus:ring-offset-2',
          variants[variant],
          sizes[size],
          disabled && 'opacity-50 cursor-not-allowed',
          className
        )}
        disabled={disabled}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';
