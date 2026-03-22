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
          <p className="font-display font-bold text-ox-accent mb-1" style={{ fontSize: '40px' }}>
            {dueWords.length}
          </p>
          <p className="font-serif text-ox-muted mb-4" style={{ fontSize: '13px' }}>
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
            <p className="font-display font-semibold text-ox-ink-deep" style={{ fontSize: '22px' }}>{stats.total}</p>
            <p className="font-mono uppercase text-ox-muted mt-0.5" style={{ fontSize: '9px', letterSpacing: '2px' }}>Total</p>
          </Card>
          <Card className="text-center">
            <p className="font-display font-semibold text-ox-accent" style={{ fontSize: '22px' }}>{stats.byStage.learning + stats.byStage.reviewing}</p>
            <p className="font-mono uppercase text-ox-muted mt-0.5" style={{ fontSize: '9px', letterSpacing: '2px' }}>Learning</p>
          </Card>
          <Card className="text-center">
            <p className="font-display font-semibold text-ox-accent-light" style={{ fontSize: '22px' }}>{stats.byStage.mastered}</p>
            <p className="font-mono uppercase text-ox-muted mt-0.5" style={{ fontSize: '9px', letterSpacing: '2px' }}>Mastered</p>
          </Card>
        </div>
      </div>
    </PageShell>
  );
}
