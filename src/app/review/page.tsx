'use client';

import { PageShell } from '@/components/layout/PageShell';
import { ReviewCard } from '@/components/review/ReviewCard';
import { RatingButtons } from '@/components/review/RatingButtons';
import { ReviewProgress } from '@/components/review/ReviewProgress';
import { SessionSummary } from '@/components/review/SessionSummary';
import { EmptyState } from '@/components/ui/EmptyState';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Button } from '@/components/ui/Button';
import { useDueWords } from '@/hooks/useWords';
import { useReviewSession } from '@/hooks/useReviewSession';
import Link from 'next/link';

export default function ReviewPage() {
  const dueWords = useDueWords();
  const session = useReviewSession();

  function handleStart() {
    if (dueWords && dueWords.length > 0) {
      session.startSession(dueWords);
    }
  }

  if (dueWords === undefined) {
    return <PageShell><LoadingSpinner /></PageShell>;
  }

  // Idle state
  if (session.state === 'idle') {
    if (dueWords.length === 0) {
      return (
        <PageShell title="Review">
          <EmptyState
            icon="🎯"
            title="All caught up!"
            description="No words are due for review right now. Add more words or check back later."
          >
            <Link href="/add">
              <Button>Add Words</Button>
            </Link>
          </EmptyState>
        </PageShell>
      );
    }

    return (
      <PageShell title="Review">
        <div className="text-center space-y-4">
          <p className="text-lg text-gray-600 dark:text-gray-400">
            <span className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">{dueWords.length}</span>
            <br />
            {dueWords.length === 1 ? 'word' : 'words'} to review
          </p>
          <Button size="lg" onClick={handleStart} className="w-full max-w-xs">
            Start Review
          </Button>
        </div>
      </PageShell>
    );
  }

  // Complete state
  if (session.state === 'complete') {
    const duration = Math.round((Date.now() - session.startTime) / 1000);
    return (
      <PageShell>
        <SessionSummary
          wordsReviewed={session.words.length}
          ratings={session.ratings}
          duration={duration}
          onRestart={() => {
            session.resetSession();
          }}
        />
      </PageShell>
    );
  }

  // In-progress states
  if (!session.currentWord) return null;

  return (
    <PageShell>
      <div className="space-y-6">
        <ReviewProgress current={session.currentIndex} total={session.words.length} />

        <ReviewCard
          word={session.currentWord}
          showBack={session.state === 'showing-back'}
          onFlip={session.showAnswer}
        />

        {session.state === 'showing-back' && (
          <RatingButtons word={session.currentWord} onRate={session.rateAndNext} />
        )}

        {session.state === 'showing-front' && (
          <div className="text-center">
            <Button variant="secondary" onClick={session.showAnswer} className="w-full max-w-md">
              Show Answer
            </Button>
          </div>
        )}
      </div>
    </PageShell>
  );
}
