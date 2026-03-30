'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { useUser } from '@/hooks/useUser';
import { createClient } from '@/lib/supabase/client';

const ROUTE_META: Record<string, { label: string; subtitle: string }> = {
  '/': { label: 'Home', subtitle: 'Daily progress and review queue' },
  '/add': { label: 'Add', subtitle: 'Capture words while they are fresh' },
  '/review': { label: 'Review', subtitle: 'Focused spaced-repetition practice' },
  '/words': { label: 'Words', subtitle: 'Browse and manage your vocabulary' },
  '/stats': { label: 'Stats', subtitle: 'See how your vocabulary compounds' },
  '/settings': { label: 'Settings', subtitle: 'Data, sync, and account controls' },
};

export function Header() {
  const { user } = useUser();
  const router = useRouter();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/login');
  }

  const meta = Object.entries(ROUTE_META).find(([route]) => {
    if (route === '/') return pathname === '/';
    return pathname.startsWith(route);
  })?.[1] ?? ROUTE_META['/'];
  const showSubtitle = pathname !== '/';

  return (
    <header
      className="sticky top-0 z-40 border-b border-ox-line bg-[rgba(245,240,232,0.74)] backdrop-blur-xl safe-area-top dark:bg-[rgba(28,23,16,0.78)]"
    >
      <div className="mx-auto flex h-16 max-w-3xl items-center justify-between gap-3 px-4">
        <div className="min-w-0">
          <Link href="/" className="inline-flex items-center gap-2 text-ox-ink-deep transition-colors hover:text-ox-accent">
            <span className="rounded-full border border-ox-border bg-ox-surface px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.24em] text-ox-accent">
              VF
            </span>
            <span className="font-display text-[19px] font-semibold italic">VocabFlow</span>
          </Link>
          {showSubtitle ? (
            <p className="truncate font-serif text-[12px] text-ox-muted">{meta.subtitle}</p>
          ) : (
            <p className="font-mono text-[9px] uppercase tracking-[0.24em] text-ox-muted">
              {meta.label}
            </p>
          )}
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          {user && (
            <div className="relative">
              <button
                onClick={() => setMenuOpen((o) => !o)}
                className="h-10 w-10 overflow-hidden rounded-full border border-ox-border bg-ox-surface focus:outline-none focus:ring-2 focus:ring-ox-accent"
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
                  <div className="flex h-full w-full items-center justify-center bg-ox-accent text-[10px] font-medium text-white font-mono">
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
                  <div className="absolute right-0 z-20 mt-2 w-64 overflow-hidden rounded-3xl border border-ox-border bg-[linear-gradient(180deg,color-mix(in_srgb,var(--color-surface)_90%,white_10%),var(--color-surface))] shadow-[0_24px_48px_rgba(26,18,8,0.16)]">
                    <div className="border-b border-ox-line px-4 py-4">
                      <p className="font-serif text-[13px] text-ox-ink-deep truncate">
                        {user.user_metadata?.full_name ?? user.email}
                      </p>
                      <p className="mt-1 truncate font-mono text-[10px] text-ox-muted">
                        {user.email}
                      </p>
                    </div>
                    <button
                      onClick={handleSignOut}
                      className="w-full px-4 py-3 text-left font-mono text-[10px] uppercase tracking-[0.18em] text-ox-danger transition-colors hover:bg-ox-danger-soft"
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
