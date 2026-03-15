'use client';

import { Header } from '@/components/layout/Header';
import { BottomNav } from '@/components/layout/BottomNav';
import { ToastProvider } from '@/components/ui/Toast';

export function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      <Header />
      <main className="min-h-screen bg-gray-50 dark:bg-slate-900">
        {children}
      </main>
      <BottomNav />
    </ToastProvider>
  );
}
