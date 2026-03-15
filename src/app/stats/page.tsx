'use client';

import { PageShell } from '@/components/layout/PageShell';
import { Card } from '@/components/ui/Card';
import { StatsOverview } from '@/components/stats/StatsOverview';
import { StreakDisplay } from '@/components/stats/StreakDisplay';
import { LevelDistribution } from '@/components/stats/LevelDistribution';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { EmptyState } from '@/components/ui/EmptyState';
import { useStats } from '@/hooks/useStats';
import { useStreak } from '@/hooks/useStreak';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export default function StatsPage() {
  const stats = useStats();
  const streak = useStreak();

  if (stats === undefined || streak === undefined) {
    return <PageShell title="Stats"><LoadingSpinner /></PageShell>;
  }

  if (stats.total === 0) {
    return (
      <PageShell title="Stats">
        <EmptyState
          icon="📊"
          title="No stats yet"
          description="Add some words and start reviewing to see your progress."
        >
          <Link href="/add"><Button>Add Words</Button></Link>
        </EmptyState>
      </PageShell>
    );
  }

  return (
    <PageShell title="Stats">
      <div className="space-y-6">
        <StatsOverview
          total={stats.total}
          byStage={stats.byStage}
          totalReviews={stats.totalReviews}
          totalDuration={stats.totalDuration}
        />

        <Card>
          <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-3">Streak</h3>
          <StreakDisplay currentStreak={streak.current} reviewDates={streak.reviewDates} />
        </Card>

        <Card>
          <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-3">Level Distribution</h3>
          <LevelDistribution byStage={stats.byStage} total={stats.total} />
        </Card>
      </div>
    </PageShell>
  );
}
