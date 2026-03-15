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

  return (
    <PageShell>
      <div className="space-y-6">
        {/* Welcome + Streak */}
        <Card>
          <StreakDisplay currentStreak={streak.current} reviewDates={streak.reviewDates} />
        </Card>

        {/* Due Today CTA */}
        <Card className="text-center">
          <p className="text-4xl font-bold text-indigo-600 dark:text-indigo-400 mb-1">
            {dueWords.length}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            {dueWords.length === 1 ? 'word' : 'words'} due for review
          </p>
          {dueWords.length > 0 ? (
            <Link href="/review">
              <Button size="lg" className="w-full">Start Review</Button>
            </Link>
          ) : (
            <Link href="/add">
              <Button variant="secondary" size="lg" className="w-full">Add New Words</Button>
            </Link>
          )}
        </Card>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-3">
          <Card className="text-center">
            <p className="text-xl font-bold text-gray-900 dark:text-gray-100">{stats.total}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Total</p>
          </Card>
          <Card className="text-center">
            <p className="text-xl font-bold text-blue-600 dark:text-blue-400">{stats.byStage.learning + stats.byStage.reviewing}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Learning</p>
          </Card>
          <Card className="text-center">
            <p className="text-xl font-bold text-green-600 dark:text-green-400">{stats.byStage.mastered}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Mastered</p>
          </Card>
        </div>
      </div>
    </PageShell>
  );
}
