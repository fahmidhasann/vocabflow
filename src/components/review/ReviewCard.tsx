'use client';

import { useRef } from 'react';
import type { Word } from '@/types';

interface ReviewCardProps {
  word: Word;
  showBack: boolean;
  onFlip: () => void;
}

export function ReviewCard({ word, showBack, onFlip }: ReviewCardProps) {
  const displayedMeanings = word.meanings.slice(0, 3);
  const hiddenCount = word.meanings.length - displayedMeanings.length;
  const touchStartY = useRef<number | null>(null);

  function handleTouchStart(e: React.TouchEvent) {
    touchStartY.current = e.touches[0].clientY;
  }

  function handleTouchEnd(e: React.TouchEvent) {
    if (showBack || touchStartY.current === null) return;
    const delta = e.changedTouches[0].clientY - touchStartY.current;
    if (delta > 50) onFlip();
    touchStartY.current = null;
  }

  return (
    <div
      className="mx-auto w-full max-w-2xl overflow-hidden rounded-[32px] border border-ox-border"
      style={{
        background: showBack
          ? 'linear-gradient(180deg, color-mix(in srgb, var(--color-surface) 88%, white 12%), var(--color-paper))'
          : 'linear-gradient(180deg, color-mix(in srgb, var(--color-paper) 92%, white 8%), var(--color-surface))',
        boxShadow: '0 26px 54px rgba(26,18,8,0.12)',
      }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className="flex items-center justify-between border-b border-ox-line px-5 py-4">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-ox-muted">
            {showBack ? 'Answer' : 'Prompt'}
          </p>
          <p className="mt-1 font-serif text-[13px] text-ox-muted">
            {showBack ? 'Confirm the meaning, then rate recall.' : 'Recall the meaning before revealing it.'}
          </p>
        </div>
        {!showBack && (
          <span className="rounded-full border border-ox-border bg-ox-surface px-3 py-1 font-mono text-[9px] uppercase tracking-[0.18em] text-ox-muted">
            Space / Tap
          </span>
        )}
      </div>

      <div
        className={`flex min-h-[300px] flex-col items-center justify-center px-6 py-10 text-center ${!showBack ? 'cursor-pointer' : ''}`}
        onClick={!showBack ? onFlip : undefined}
      >
        <p
          className="text-center font-display text-[42px] font-semibold leading-none text-ox-ink-deep md:text-[52px]"
        >
          {word.word}
        </p>
        {word.phonetic && (
          <p className="mt-2 font-serif text-[15px] italic text-ox-muted">
            {word.phonetic}
          </p>
        )}
        {!showBack && (
          <div className="mt-8 rounded-2xl border border-ox-line bg-ox-surface px-5 py-4">
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-ox-muted">
              Reveal when you have your answer
            </p>
            <p className="mt-2 font-serif text-[14px] text-ox-muted">
              Tap the card, press <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-ox-ink">space</span>, or swipe down.
            </p>
          </div>
        )}
      </div>

      {showBack && (
        <div
          className="max-h-[55vh] overflow-y-auto border-t border-ox-line px-6 pb-8 pt-6"
          style={{
            animation: 'reveal-def 250ms ease-out both',
          }}
        >
          <style>{`
            @keyframes reveal-def {
              from { opacity: 0; transform: translateY(6px); }
              to   { opacity: 1; transform: translateY(0); }
            }
          `}</style>
          <div className="space-y-5">
            {displayedMeanings.map((m, i) => (
              <div key={i} className="rounded-2xl border border-ox-line bg-ox-surface/80 px-4 py-4">
                {m.partOfSpeech && (
                  <p className="mb-2 font-mono text-[9px] uppercase tracking-[0.24em] text-ox-muted">
                    {m.partOfSpeech}
                  </p>
                )}
                <p className="font-serif text-[16px] leading-7 text-ox-ink-deep">
                  {m.definition}
                </p>
              </div>
            ))}
            {hiddenCount > 0 && (
              <p className="font-serif text-[14px] italic text-ox-muted">
                and {hiddenCount} more...
              </p>
            )}
            {word.example && (
              <div className="rounded-2xl border border-ox-line bg-ox-surface-alt px-4 py-4">
                <p className="mb-2 font-mono text-[9px] uppercase tracking-[0.22em] text-ox-muted">Example</p>
                <p className="border-t border-ox-line pt-3 font-serif text-[14px] italic leading-7 text-ox-muted">
                  &ldquo;{word.example}&rdquo;
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
