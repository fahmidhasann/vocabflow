interface EmptyStateProps {
  icon?: string;
  title: string;
  description?: string;
  eyebrow?: string;
  children?: React.ReactNode;
}

export function EmptyState({ icon, title, description, eyebrow, children }: EmptyStateProps) {
  return (
    <div className="rounded-[28px] border border-ox-line bg-[linear-gradient(180deg,color-mix(in_srgb,var(--color-surface)_82%,white_18%),color-mix(in_srgb,var(--color-paper)_88%,transparent))] px-6 py-10 text-center shadow-[0_18px_36px_rgba(26,18,8,0.07)]">
      <span className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-full border border-ox-border bg-ox-surface-alt text-2xl text-ox-accent">
        {icon ?? '✦'}
      </span>
      {eyebrow && (
        <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-ox-muted">
          {eyebrow}
        </p>
      )}
      <h3 className="mt-2 font-display text-[24px] font-semibold italic text-ox-ink-deep">{title}</h3>
      {description && (
        <p className="mx-auto mt-2 max-w-md font-serif text-[15px] leading-7 text-ox-muted">
          {description}
        </p>
      )}
      {children && <div className="mt-6 flex justify-center">{children}</div>}
    </div>
  );
}
