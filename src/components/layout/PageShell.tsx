interface PageShellProps {
  title?: string;
  children: React.ReactNode;
}

export function PageShell({ title, children }: PageShellProps) {
  return (
    <div className="max-w-2xl mx-auto px-4 py-6 pb-24">
      {title && (
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">{title}</h1>
      )}
      {children}
    </div>
  );
}
