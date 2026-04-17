'use client';

import { useSearchParams } from 'next/navigation';

export function LoginErrorNotice() {
  const searchParams = useSearchParams();
  const hasError = searchParams.get('error') === 'auth_failed';

  if (!hasError) return null;

  return (
    <div className="mt-6 rounded-2xl border border-ox-danger/30 bg-ox-danger-soft px-4 py-4">
      <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-ox-danger">Authentication failed</p>
      <p className="mt-2 font-serif text-[14px] leading-6 text-ox-ink">
        The last sign-in attempt did not complete. Try again and you&apos;ll be returned to your dashboard.
      </p>
    </div>
  );
}
