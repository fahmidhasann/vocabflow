interface PageShellProps {
  title?: string;
  children: React.ReactNode;
}

export function PageShell({ title, children }: PageShellProps) {
  return (
    <div className="max-w-2xl mx-auto px-4 py-6 pb-24 animate-slide-up">
      {title && (
        <h1 className="font-display font-bold text-ox-ink-deep mb-6" style={{ fontSize: '24px' }}>
          {title}
        </h1>
      )}
      {children}
    </div>
  );
}
