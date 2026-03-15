'use client';

import type { Word } from '@/types';

interface ReviewCardProps {
  word: Word;
  showBack: boolean;
  onFlip: () => void;
}

export function ReviewCard({ word, showBack, onFlip }: ReviewCardProps) {
  return (
    <div className="perspective-1000 w-full max-w-md mx-auto" style={{ perspective: '1000px' }}>
      <div
        onClick={!showBack ? onFlip : undefined}
        className={`relative w-full min-h-[280px] transition-transform duration-500 cursor-pointer`}
        style={{
          transformStyle: 'preserve-3d',
          transform: showBack ? 'rotateY(180deg)' : 'rotateY(0deg)',
        }}
      >
        {/* Front */}
        <div
          className="absolute inset-0 flex flex-col items-center justify-center p-6 bg-white dark:bg-gray-800 rounded-2xl border-2 border-gray-200 dark:border-gray-700 shadow-lg"
          style={{ backfaceVisibility: 'hidden' }}
        >
          <p className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">{word.word}</p>
          {word.phonetic && (
            <p className="text-lg text-gray-500 dark:text-gray-400">{word.phonetic}</p>
          )}
          <p className="mt-6 text-sm text-gray-400 dark:text-gray-500">Tap to reveal</p>
        </div>

        {/* Back */}
        <div
          className="absolute inset-0 flex flex-col items-center justify-center p-6 bg-white dark:bg-gray-800 rounded-2xl border-2 border-indigo-200 dark:border-indigo-700 shadow-lg overflow-y-auto"
          style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
        >
          <div className="w-full space-y-3">
            {word.meanings.map((m, i) => (
              <div key={i}>
                {m.partOfSpeech && (
                  <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wide">{m.partOfSpeech}</span>
                )}
                <p className="text-gray-800 dark:text-gray-200">{m.definition}</p>
              </div>
            ))}
            {word.example && (
              <p className="text-sm text-gray-500 dark:text-gray-400 italic border-t border-gray-200 dark:border-gray-700 pt-3 mt-3">
                &ldquo;{word.example}&rdquo;
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
