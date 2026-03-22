'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { createClient } from '@/lib/supabase/client';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const code = searchParams.get('code');
    if (!code) {
      router.replace('/login?error=auth_failed');
      return;
    }

    const supabase = createClient();
    supabase.auth.exchangeCodeForSession(code).then(({ error }) => {
      if (error) {
        router.replace('/login?error=auth_failed');
      } else {
        router.replace('/');
      }
    });
  }, [router, searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-ox-bg">
      <LoadingSpinner />
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-ox-bg">
        <LoadingSpinner />
      </div>
    }>
      <AuthCallbackContent />
    </Suspense>
  );
}
