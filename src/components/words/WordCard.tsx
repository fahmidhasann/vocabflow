import { useState } from 'react';
import Link from 'next/link';
import { Badge } from '@/components/ui/Badge';
import { formatDate, todayDateString } from '@/lib/utils';
import type { Word } from '@/types';

interface WordCardProps {
  word: Word;
}

export function WordCard({ word }: WordCardProps) {
  const [expanded, setExpanded] = useState(false);
  const hasMore = word.meanings.length > 1;
  const isDue = word.nextReviewDate <= todayDateString();

  return (
    <div
      className="rounded-[26px] border border-ox-border bg-[linear-gradient(180deg,color-mix(in_srgb,var(--color-surface)_90%,white_10%),var(--color-surface))] p-4 transition-[border-color,transform] duration-150 hover:-translate-y-px hover:border-ox-accent"
      style={{ boxShadow: '0 14px 30px rgba(26,18,8,0.08)' }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-ox-muted">
                {isDue ? 'Due now' : `Next review ${formatDate(word.nextReviewDate)}`}
              </p>
              <Link href={`/words/detail?id=${word.id}`} className="mt-1 block transition-colors hover:text-ox-accent">
                <h3 className="font-display text-[24px] font-semibold leading-none text-ox-ink-deep">
                  {word.word}
                </h3>
              </Link>
            </div>
            <Badge stage={word.srsStage} />
          </div>

          {word.phonetic && (
            <p className="mt-3 font-serif text-[12px] italic text-ox-muted">
              {word.phonetic}
            </p>
          )}

          {expanded ? (
            <div className="mt-4 space-y-2">
              {word.meanings.map((m, i) => (
                <div
                  key={i}
                  className="rounded-2xl border border-ox-line bg-ox-surface-alt px-3 py-3"
                >
                  {m.partOfSpeech && (
                    <span className="mr-2 font-mono text-[9px] uppercase tracking-[0.16em] text-ox-muted">
                      {m.partOfSpeech}
                    </span>
                  )}
                  <span className="font-serif text-[14px] leading-6 text-ox-ink">{m.definition}</span>
                </div>
              ))}
            </div>
          ) : (
            word.meanings[0]?.definition && (
              <p className="mt-4 rounded-2xl border border-ox-line bg-ox-surface-alt px-3 py-3 font-serif text-[14px] italic leading-6 text-ox-muted">
                {word.meanings[0].partOfSpeech && (
                  <span className="mr-2 font-mono text-[9px] uppercase tracking-[0.16em] not-italic text-ox-muted">
                    {word.meanings[0].partOfSpeech}
                  </span>
                )}
                {word.meanings[0].definition}
              </p>
            )
          )}
        </div>

        <div className="flex flex-shrink-0 flex-col items-end gap-2">
          <Link
            href={`/words/detail?id=${word.id}`}
            className="rounded-full border border-ox-line px-3 py-1 font-mono text-[9px] uppercase tracking-[0.16em] text-ox-muted transition-colors hover:border-ox-accent hover:text-ox-accent"
          >
            Open
          </Link>
          {hasMore && (
            <button
              onClick={() => setExpanded((e) => !e)}
              className="rounded-full border border-ox-line px-3 py-1 font-mono text-[9px] uppercase tracking-[0.16em] text-ox-muted transition-colors hover:border-ox-accent hover:text-ox-accent"
              aria-label={expanded ? 'Collapse meanings' : 'Expand meanings'}
            >
              {expanded ? 'Less' : `${word.meanings.length} meanings`}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
