import { cn } from '@/lib/utils';

interface PageShellProps {
  title?: string;
  eyebrow?: string;
  description?: string;
  actions?: React.ReactNode;
  className?: string;
  contentClassName?: string;
  children: React.ReactNode;
}

export function PageShell({
  title,
  eyebrow,
  description,
  actions,
  className,
  contentClassName,
  children,
}: PageShellProps) {
  const hasHeader = Boolean(title || description || actions || eyebrow);

  return (
    <div className={cn('animate-slide-up px-4 pb-28 pt-6', className)}>
      <div className="mx-auto max-w-3xl">
        {hasHeader && (
          <div className="mb-6 flex flex-col gap-4 border-b border-ox-line pb-5 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl space-y-2">
              {eyebrow && (
                <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-ox-muted">
                  {eyebrow}
                </p>
              )}
              {title && (
                <h1 className="font-display text-[30px] font-semibold leading-none text-ox-ink-deep md:text-[34px]">
                  {title}
                </h1>
              )}
              {description && (
                <p className="max-w-xl font-serif text-[15px] leading-7 text-ox-muted md:text-[16px]">
                  {description}
                </p>
              )}
            </div>
            {actions && <div className="flex flex-wrap gap-2 md:justify-end">{actions}</div>}
          </div>
        )}

        <div className={cn('space-y-6', contentClassName)}>{children}</div>
      </div>
    </div>
  );
}
