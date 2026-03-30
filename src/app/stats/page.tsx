'use client';

import Link from 'next/link';
import { PageShell } from '@/components/layout/PageShell';
import { Card } from '@/components/ui/Card';
import { StatsOverview } from '@/components/stats/StatsOverview';
import { StreakDisplay } from '@/components/stats/StreakDisplay';
import { LevelDistribution } from '@/components/stats/LevelDistribution';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { EmptyState } from '@/components/ui/EmptyState';
import { useStats } from '@/hooks/useStats';
import { useStreak } from '@/hooks/useStreak';
import { Button } from '@/components/ui/Button';

export default function StatsPage() {
  const stats = useStats();
  const streak = useStreak();

  if (stats === undefined || streak === undefined) {
    return <PageShell><LoadingSpinner /></PageShell>;
  }

  if (stats.total === 0) {
    return (
      <PageShell
        eyebrow="Progress"
        title="Your stats"
        description="This view fills out once you start adding words and completing review sessions."
      >
        <EmptyState
          icon="◎"
          eyebrow="No stats yet"
          title="Nothing to chart yet"
          description="Add a few words and complete your first review session to unlock progress tracking."
        >
          <Link href="/add"><Button>Add Words</Button></Link>
        </EmptyState>
      </PageShell>
    );
  }

  return (
    <PageShell
      eyebrow="Progress"
      title="How your vocabulary is growing"
      description="Track how much you have captured, how consistently you review, and where words currently sit in the SRS cycle."
    >
      <Card variant="hero" padding="lg">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-ox-muted">Overview</p>
            <h2 className="mt-2 font-display text-[30px] font-semibold italic text-ox-ink-deep">
              Progress becomes visible when the queue stays moving
            </h2>
          </div>
          <p className="max-w-md font-serif text-[15px] leading-7 text-ox-muted">
            {stats.byStage.mastered} words are fully mastered, and {stats.byStage.learning + stats.byStage.reviewing} remain in active rotation.
          </p>
        </div>
        <div className="mt-6">
          <StatsOverview
            total={stats.total}
            byStage={stats.byStage}
            totalReviews={stats.totalReviews}
            totalDuration={stats.totalDuration}
          />
        </div>
      </Card>

      <div className="grid gap-6 lg:grid-cols-[1.05fr,0.95fr]">
        <Card padding="lg">
          <div className="mb-5">
            <p className="font-mono text-[10px] uppercase tracking-[0.26em] text-ox-muted">Consistency</p>
            <h3 className="mt-2 font-display text-[26px] font-semibold text-ox-ink-deep">Review streak</h3>
          </div>
          <StreakDisplay currentStreak={streak.current} reviewDates={streak.reviewDates} />
        </Card>

        <Card padding="lg">
          <div className="mb-5">
            <p className="font-mono text-[10px] uppercase tracking-[0.26em] text-ox-muted">Distribution</p>
            <h3 className="mt-2 font-display text-[26px] font-semibold text-ox-ink-deep">Where words are sitting</h3>
          </div>
          <LevelDistribution byStage={stats.byStage} total={stats.total} />
        </Card>
      </div>
    </PageShell>
  );
}
