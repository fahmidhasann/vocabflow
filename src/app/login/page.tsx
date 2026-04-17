import { Suspense } from 'react';
import { LoginButton } from './LoginButton';
import { LoginErrorNotice } from './LoginErrorNotice';

export default function LoginPage() {
  return (
    <div className="relative flex min-h-screen items-center overflow-hidden px-4 py-10">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(196,168,74,0.18),transparent_26%),radial-gradient(circle_at_bottom_right,rgba(74,112,146,0.12),transparent_24%)]" />
      <div className="relative mx-auto grid w-full max-w-5xl gap-8 lg:grid-cols-[1.05fr,0.95fr]">
        <div className="rounded-[32px] border border-ox-line bg-[linear-gradient(180deg,color-mix(in_srgb,var(--color-surface)_76%,white_24%),color-mix(in_srgb,var(--color-paper)_90%,transparent))] p-8 shadow-[0_24px_60px_rgba(26,18,8,0.12)]">
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-ox-muted">Welcome back</p>
          <h1 className="mt-4 font-display text-[52px] font-semibold italic leading-none text-ox-ink-deep md:text-[64px]">
            Build a sharper vocabulary, one review at a time.
          </h1>
          <p className="mt-5 max-w-xl font-serif text-[17px] leading-8 text-ox-muted">
            VocabFlow keeps the capture, recall, and review loop tight so the words you collect actually stick.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <div className="rounded-[24px] border border-ox-line bg-ox-surface px-4 py-4">
              <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-ox-muted">Capture</p>
              <p className="mt-2 font-serif text-[14px] leading-6 text-ox-ink">Look up a word and save the exact definition you want to remember.</p>
            </div>
            <div className="rounded-[24px] border border-ox-line bg-ox-surface px-4 py-4">
              <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-ox-muted">Recall</p>
              <p className="mt-2 font-serif text-[14px] leading-6 text-ox-ink">Practice in focused review sessions with honest difficulty ratings.</p>
            </div>
            <div className="rounded-[24px] border border-ox-line bg-ox-surface px-4 py-4">
              <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-ox-muted">Compound</p>
              <p className="mt-2 font-serif text-[14px] leading-6 text-ox-ink">Watch consistency turn into streaks, mastery, and long-term retention.</p>
            </div>
          </div>
        </div>

        <div className="flex items-center">
          <div className="w-full rounded-[32px] border border-ox-border bg-[linear-gradient(180deg,color-mix(in_srgb,var(--color-surface)_92%,white_8%),var(--color-surface))] p-8 shadow-[0_24px_60px_rgba(26,18,8,0.12)]">
            <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-ox-muted">Sign in</p>
            <h2 className="mt-3 font-display text-[34px] font-semibold text-ox-ink-deep">
              Continue where you left off
            </h2>
            <p className="mt-3 font-serif text-[15px] leading-7 text-ox-muted">
              Use your Google account to sync your words, review sessions, and streak history across devices.
            </p>

            <Suspense fallback={null}>
              <LoginErrorNotice />
            </Suspense>

            <div className="mt-8">
              <LoginButton />
            </div>

            <p className="mt-6 font-serif text-[13px] leading-6 text-ox-muted">
              By continuing, you allow VocabFlow to keep your vocabulary library and review history in sync with your account.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
