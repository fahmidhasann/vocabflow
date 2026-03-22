'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useUser } from '@/hooks/useUser';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

const PUBLIC_PATHS = ['/login', '/auth'];

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useUser();
  const pathname = usePathname();
  const router = useRouter();
  const isPublic = PUBLIC_PATHS.some(p => pathname.startsWith(p));

  useEffect(() => {
    if (loading) return;
    if (!user && !isPublic) {
      router.replace('/login');
    } else if (user && pathname === '/login') {
      router.replace('/');
    }
  }, [user, loading, isPublic, pathname, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-ox-bg">
        <LoadingSpinner />
      </div>
    );
  }

  if (!user && !isPublic) return null;

  return <>{children}</>;
}
