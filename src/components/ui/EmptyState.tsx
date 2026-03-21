interface EmptyStateProps {
  icon?: string;
  title: string;
  description?: string;
  children?: React.ReactNode;
}

export function EmptyState({ title, description, children }: EmptyStateProps) {
  // icon prop is intentionally unused — replaced by typographic ornament per Oxbridge spec
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <span className="text-ox-muted text-3xl mb-4">✦</span>
      <h3 className="font-display text-[20px] font-semibold italic text-ox-ink-deep">{title}</h3>
      {description && (
        <p className="mt-1 font-serif text-[14px] text-ox-muted">{description}</p>
      )}
      {children && <div className="mt-4">{children}</div>}
    </div>
  );
}
