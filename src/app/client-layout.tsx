'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { BottomNav } from '@/components/layout/BottomNav';
import { ToastProvider } from '@/components/ui/Toast';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { createClient } from '@/lib/supabase/client';
import { isNativePlatform } from '@/lib/platform';

export function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  useEffect(() => {
    const supabase = createClient();
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      // Keeps the session cookie in sync client-side
    });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!isNativePlatform()) return;
    document.documentElement.classList.add('native-app');
    import('@/lib/auth-native').then(m => m.setupNativeAuthListener());
  }, []);

  const showAppChrome = pathname !== '/login' && pathname !== '/auth/callback';

  return (
    <ToastProvider>
      <AuthGuard>
        {showAppChrome && <Header />}
        <main className="min-h-screen">
          {children}
        </main>
        {showAppChrome && <BottomNav />}
      </AuthGuard>
    </ToastProvider>
  );
}
