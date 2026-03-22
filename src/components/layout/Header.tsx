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
    <header
      className="sticky top-0 z-40 border-b border-ox-border bg-[rgba(245,240,232,0.96)] dark:bg-[rgba(28,23,16,0.96)] backdrop-blur-sm safe-area-top"
    >
      <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="font-display font-bold italic text-ox-ink-deep" style={{ fontSize: '16px' }}>
          VocabFlow
        </Link>
        <div className="flex items-center gap-1">
          <ThemeToggle />
          {user && (
            <div className="relative">
              <button
                onClick={() => setMenuOpen((o) => !o)}
                className="w-8 h-8 rounded-full overflow-hidden border border-ox-border focus:outline-none focus:ring-2 focus:ring-ox-accent"
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
                  <div className="w-full h-full bg-ox-accent flex items-center justify-center text-white font-mono text-[10px] font-medium">
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
                  <div className="absolute right-0 mt-2 w-52 bg-ox-surface rounded-lg shadow-xl border border-ox-border z-20 overflow-hidden">
                    <div className="px-4 py-3 border-b border-ox-border">
                      <p className="font-serif text-[13px] text-ox-ink-deep truncate">
                        {user.user_metadata?.full_name ?? user.email}
                      </p>
                      <p className="font-mono text-[10px] text-ox-muted truncate mt-0.5">
                        {user.email}
                      </p>
                    </div>
                    <button
                      onClick={handleSignOut}
                      className="w-full text-left px-4 py-3 font-mono uppercase text-[#8b2020] hover:bg-ox-bg-dark transition-colors"
                      style={{ fontSize: '10px', letterSpacing: '1px' }}
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
