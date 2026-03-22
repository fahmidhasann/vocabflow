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
      className="w-full max-w-md mx-auto rounded-lg border border-ox-border overflow-hidden"
      style={{
        background: 'var(--color-paper)',
        boxShadow: '0 4px 20px rgba(26,18,8,0.07)',
      }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Word area — always visible, tappable when unrevealed */}
      <div
        className={`flex flex-col items-center justify-center px-6 pt-10 pb-8 ${!showBack ? 'cursor-pointer' : ''}`}
        onClick={!showBack ? onFlip : undefined}
      >
        <p
          className="font-display font-bold text-ox-ink-deep text-center"
          style={{ fontSize: '36px', letterSpacing: '-0.5px' }}
        >
          {word.word}
        </p>
        {word.phonetic && (
          <p className="font-serif font-light italic text-ox-muted mt-1" style={{ fontSize: '13px' }}>
            {word.phonetic}
          </p>
        )}
        {!showBack && (
          <p className="font-mono uppercase text-ox-muted/50 mt-6" style={{ fontSize: '9px', letterSpacing: '2px' }}>
            Tap to reveal
          </p>
        )}
      </div>

      {/* Definition area — fades in on reveal */}
      {showBack && (
        <div
          className="border-t border-ox-border px-6 pb-8 pt-5 overflow-y-auto"
          style={{
            maxHeight: '55vh',
            animation: 'reveal-def 250ms ease-out both',
          }}
        >
          <style>{`
            @keyframes reveal-def {
              from { opacity: 0; transform: translateY(6px); }
              to   { opacity: 1; transform: translateY(0); }
            }
          `}</style>
          <div className="space-y-4">
            {displayedMeanings.map((m, i) => (
              <div key={i}>
                {m.partOfSpeech && (
                  <p className="font-mono uppercase text-ox-muted mb-1" style={{ fontSize: '9px', letterSpacing: '2px' }}>
                    {m.partOfSpeech}
                  </p>
                )}
                <p className="font-serif text-ox-ink-deep" style={{ fontSize: '14px', lineHeight: '1.7' }}>
                  {m.definition}
                </p>
              </div>
            ))}
            {hiddenCount > 0 && (
              <p className="font-serif italic text-ox-muted" style={{ fontSize: '13px' }}>
                and {hiddenCount} more…
              </p>
            )}
            {word.example && (
              <p className="font-serif italic text-ox-muted pt-2 border-t border-ox-border" style={{ fontSize: '13px' }}>
                &ldquo;{word.example}&rdquo;
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
