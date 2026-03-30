'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { PageShell } from '@/components/layout/PageShell';
import { ReviewCard } from '@/components/review/ReviewCard';
import { RatingButtons } from '@/components/review/RatingButtons';
import { ReviewProgress } from '@/components/review/ReviewProgress';
import { SessionSummary } from '@/components/review/SessionSummary';
import { EmptyState } from '@/components/ui/EmptyState';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useDueWords } from '@/hooks/useWords';
import { useReviewSession } from '@/hooks/useReviewSession';

export default function ReviewPage() {
  const dueWords = useDueWords();
  const session = useReviewSession();

  function handleStart() {
    if (dueWords && dueWords.length > 0) {
      session.startSession(dueWords);
    }
  }

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (session.state === 'showing-front' && (e.key === ' ' || e.key === 'Enter')) {
        e.preventDefault();
        session.showAnswer();
      } else if (session.state === 'showing-back') {
        if (e.key === '1') session.rateAndNext(0);
        else if (e.key === '2') session.rateAndNext(1);
        else if (e.key === '3') session.rateAndNext(2);
        else if (e.key === '4') session.rateAndNext(3);
      }
    }
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [session]);

  if (dueWords === undefined) {
    return <PageShell><LoadingSpinner /></PageShell>;
  }

  if (session.state === 'idle') {
    if (dueWords.length === 0) {
      return (
        <PageShell
          eyebrow="Practice"
          title="Review queue"
          description="Nothing is due right now. Add a new word or come back later when the next cards are ready."
        >
          <EmptyState
            icon="✓"
            eyebrow="Queue clear"
            title="All caught up"
            description="You have no due cards at the moment. Capture another word while the queue is empty, or return later for the next review block."
          >
            <Link href="/add">
              <Button>Add Words</Button>
            </Link>
          </EmptyState>
        </PageShell>
      );
    }

    return (
      <PageShell
        eyebrow="Practice"
        title="Review queue"
        description="A focused session works best when you move through the queue in one pass. Start here, reveal only when you have an answer, and rate honestly."
      >
        <div className="grid gap-6 lg:grid-cols-[1.15fr,0.85fr]">
          <Card variant="hero" padding="lg">
            <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-ox-muted">Ready now</p>
            <p className="mt-4 font-display text-[56px] font-semibold leading-none text-ox-accent md:text-[68px]">
              {dueWords.length}
            </p>
            <h2 className="mt-3 font-display text-[28px] italic text-ox-ink-deep">
              {dueWords.length === 1 ? 'One word is waiting' : `${dueWords.length} words are waiting`}
            </h2>
            <p className="mt-3 max-w-lg font-serif text-[15px] leading-7 text-ox-muted">
              Stay in recall mode: think first, reveal second, then rate how difficult the answer felt.
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Button size="lg" onClick={handleStart} className="sm:min-w-[180px]">
                Start Review
              </Button>
              <Link href="/words">
                <Button variant="secondary" size="lg" className="w-full sm:w-auto">Browse Library</Button>
              </Link>
            </div>
          </Card>

          <Card variant="subtle" padding="lg">
            <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-ox-muted">How this session works</p>
            <div className="mt-4 space-y-4">
              <div className="rounded-2xl border border-ox-line bg-ox-surface px-4 py-4">
                <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-ox-muted">Reveal</p>
                <p className="mt-2 font-serif text-[14px] leading-6 text-ox-ink">Tap the card, press space, or hit enter to reveal the answer.</p>
              </div>
              <div className="rounded-2xl border border-ox-line bg-ox-surface px-4 py-4">
                <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-ox-muted">Rate</p>
                <p className="mt-2 font-serif text-[14px] leading-6 text-ox-ink">Use keys 1-4 or the buttons to rate recall: Again, Hard, Good, Easy.</p>
              </div>
              <div className="rounded-2xl border border-ox-line bg-ox-surface px-4 py-4">
                <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-ox-muted">Goal</p>
                <p className="mt-2 font-serif text-[14px] leading-6 text-ox-ink">Keep ratings honest. Accuracy now gives the SRS schedule better data later.</p>
              </div>
            </div>
          </Card>
        </div>
      </PageShell>
    );
  }

  if (session.state === 'complete') {
    const duration = Math.round((Date.now() - session.startTime) / 1000);
    return (
      <PageShell eyebrow="Practice" title="Session recap" description="A quick look at how that review block went.">
        <SessionSummary
          wordsReviewed={session.words.length}
          ratings={session.ratings}
          duration={duration}
          words={session.words}
          onRestart={() => {
            session.resetSession();
          }}
        />
      </PageShell>
    );
  }

  if (!session.currentWord) return null;

  return (
    <PageShell className="pt-4" contentClassName="space-y-5">
      <div className="mx-auto flex w-full max-w-2xl items-center justify-between gap-3">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-ox-muted">Review session</p>
          <p className="mt-1 font-serif text-[14px] text-ox-muted">Stay in recall mode and rate the difficulty honestly.</p>
        </div>
        <button
          onClick={session.resetSession}
          className="rounded-full border border-ox-line px-3 py-1 font-mono text-[9px] uppercase tracking-[0.18em] text-ox-muted transition-colors hover:border-ox-accent hover:text-ox-accent"
        >
          Exit
        </button>
      </div>

      <ReviewProgress current={session.currentIndex} total={session.words.length} />

      <ReviewCard
        word={session.currentWord}
        showBack={session.state === 'showing-back'}
        onFlip={session.showAnswer}
      />

      {session.state === 'showing-back' ? (
        <RatingButtons word={session.currentWord} onRate={session.rateAndNext} />
      ) : (
        <div className="mx-auto w-full max-w-2xl text-center">
          <Button variant="soft" size="lg" onClick={session.showAnswer} className="w-full">
            Show Answer
          </Button>
        </div>
      )}

      <Card variant="subtle" padding="sm" className="mx-auto max-w-2xl">
        <div className="flex flex-col gap-1 text-center sm:flex-row sm:items-center sm:justify-between sm:text-left">
          <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-ox-muted">
            Keyboard shortcuts
          </p>
          <p className="font-serif text-[13px] text-ox-muted">
            <span className="text-ox-ink">Space / Enter</span> to reveal, then <span className="text-ox-ink">1-4</span> to rate.
          </p>
        </div>
      </Card>
    </PageShell>
  );
}
