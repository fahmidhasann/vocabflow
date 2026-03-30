'use client';

import Link from 'next/link';
import { PageShell } from '@/components/layout/PageShell';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { StreakDisplay } from '@/components/stats/StreakDisplay';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { useDueWords } from '@/hooks/useWords';
import { useStreak } from '@/hooks/useStreak';
import { useStats } from '@/hooks/useStats';

export default function DashboardPage() {
  const dueWords = useDueWords();
  const streak = useStreak();
  const stats = useStats();

  if (dueWords === undefined || streak === undefined || stats === undefined) {
    return <PageShell><LoadingSpinner /></PageShell>;
  }

  const learningCount = stats.byStage.learning + stats.byStage.reviewing;
  const masteryRate = stats.total > 0 ? Math.round((stats.byStage.mastered / stats.total) * 100) : 0;
  const heroTitle = dueWords.length > 0 ? "Ready for today's review" : "You're caught up";
  const heroDescription = dueWords.length > 0
    ? `You have ${dueWords.length} ${dueWords.length === 1 ? 'word' : 'words'} ready. Clear the queue first, then add something new while your momentum is up.`
    : 'No cards are due right now. Keep the chain alive by adding a new word or browsing your library.';

  const metrics = [
    { label: 'Due today', value: dueWords.length, tone: 'text-ox-accent' },
    { label: 'Learning', value: learningCount, tone: 'text-ox-ink-deep' },
    { label: 'Mastered', value: stats.byStage.mastered, tone: 'text-ox-success' },
    { label: 'Mastery rate', value: `${masteryRate}%`, tone: 'text-ox-info' },
  ];

  return (
    <PageShell
      eyebrow="Today"
      title="Daily command center"
      description="Review the queue, keep your streak alive, and decide what to study next."
    >
      <div className="grid gap-6 lg:grid-cols-[1.25fr,0.95fr]">
        <Card variant="hero" padding="lg" className="overflow-hidden">
          <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-ox-muted">Review queue</p>
          <div className="mt-4 flex items-start justify-between gap-6">
            <div>
              <p className="font-display text-[48px] font-semibold leading-none text-ox-accent md:text-[58px]">
                {dueWords.length}
              </p>
              <p className="mt-3 font-display text-[28px] italic leading-tight text-ox-ink-deep">
                {heroTitle}
              </p>
              <p className="mt-3 max-w-xl font-serif text-[15px] leading-7 text-ox-muted">
                {heroDescription}
              </p>
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            {dueWords.length > 0 ? (
              <Link href="/review" className="flex-1">
                <Button size="lg" className="w-full">Start Review</Button>
              </Link>
            ) : (
              <Link href="/add" className="flex-1">
                <Button size="lg" className="w-full">Add a Word</Button>
              </Link>
            )}
            <Link href="/words" className="flex-1">
              <Button variant="secondary" size="lg" className="w-full">Browse Library</Button>
            </Link>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-ox-line bg-ox-surface/80 px-4 py-4">
              <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-ox-muted">Next move</p>
              <p className="mt-2 font-serif text-[14px] leading-6 text-ox-ink">
                {dueWords.length > 0 ? 'Finish the due queue first to protect recall accuracy.' : 'Capture a new word while the slate is clear.'}
              </p>
            </div>
            <div className="rounded-2xl border border-ox-line bg-ox-surface/80 px-4 py-4">
              <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-ox-muted">Momentum</p>
              <p className="mt-2 font-serif text-[14px] leading-6 text-ox-ink">
                {streak.current > 0
                  ? `${streak.current} consecutive day${streak.current === 1 ? '' : 's'} reviewed.`
                  : 'No active streak yet. One completed review session starts it again.'}
              </p>
            </div>
          </div>
        </Card>

        <Card variant="subtle" padding="lg">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-ox-muted">Consistency</p>
              <h2 className="mt-2 font-display text-[28px] font-semibold italic text-ox-ink-deep">
                Keep the chain alive
              </h2>
            </div>
          </div>
          <div className="mt-6">
            <StreakDisplay currentStreak={streak.current} reviewDates={streak.reviewDates} />
          </div>
        </Card>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => (
          <Card key={metric.label} variant="compact" padding="md" className="text-center">
            <p className={`font-display text-[30px] font-semibold ${metric.tone}`}>{metric.value}</p>
            <p className="mt-1 font-mono text-[9px] uppercase tracking-[0.22em] text-ox-muted">{metric.label}</p>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card padding="lg">
          <p className="font-mono text-[10px] uppercase tracking-[0.26em] text-ox-muted">Build your library</p>
          <h3 className="mt-2 font-display text-[26px] font-semibold text-ox-ink-deep">Capture words while they are fresh</h3>
          <p className="mt-3 font-serif text-[15px] leading-7 text-ox-muted">
            Add new vocabulary directly from lookup, then tune the definition, example, and notes before it enters review.
          </p>
          <Link href="/add" className="mt-5 inline-flex">
            <Button variant="secondary">Open Add Flow</Button>
          </Link>
        </Card>

        <Card padding="lg">
          <p className="font-mono text-[10px] uppercase tracking-[0.26em] text-ox-muted">Track progress</p>
          <h3 className="mt-2 font-display text-[26px] font-semibold text-ox-ink-deep">See how the backlog is maturing</h3>
          <p className="mt-3 font-serif text-[15px] leading-7 text-ox-muted">
            {stats.total === 0
              ? 'Once you add a few words, this space becomes a clear picture of what is new, in review, and fully mastered.'
              : `${stats.byStage.mastered} of ${stats.total} words are mastered, and ${learningCount} are actively in rotation.`}
          </p>
          <Link href="/stats" className="mt-5 inline-flex">
            <Button variant="secondary">View Stats</Button>
          </Link>
        </Card>
      </div>
    </PageShell>
  );
}
