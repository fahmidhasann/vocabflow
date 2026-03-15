'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { useUser } from '@/hooks/useUser';
import { createClient } from '@/lib/supabase/client';

export function Header() {
  const { user } = useUser();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/login');
  }

  return (
    <header className="sticky top-0 z-40 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-indigo-600 dark:text-indigo-400">
          VocabFlow
        </Link>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          {user && (
            <div className="relative">
              <button
                onClick={() => setMenuOpen((o) => !o)}
                className="w-8 h-8 rounded-full overflow-hidden border-2 border-indigo-200 dark:border-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                aria-label="User menu"
              >
                {user.user_metadata?.avatar_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={user.user_metadata.avatar_url}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-indigo-500 flex items-center justify-center text-white text-xs font-bold">
                    {(user.email ?? 'U')[0].toUpperCase()}
                  </div>
                )}
              </button>

              {menuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setMenuOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-52 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 z-20 overflow-hidden">
                    <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                        {user.user_metadata?.full_name ?? user.email}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                        {user.email}
                      </p>
                    </div>
                    <button
                      onClick={handleSignOut}
                      className="w-full text-left px-4 py-3 text-sm text-red-600 dark:text-red-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      Sign out
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
