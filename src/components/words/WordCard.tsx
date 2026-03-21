import Link from 'next/link';
import { Badge } from '@/components/ui/Badge';
import type { Word } from '@/types';

interface WordCardProps {
  word: Word;
}

export function WordCard({ word }: WordCardProps) {
  return (
    <Link
      href={`/words/${word.id}`}
      className="block p-4 bg-ox-surface rounded-lg border border-ox-border hover:border-ox-accent transition-[border-color] duration-150"
      style={{ boxShadow: '0 2px 8px rgba(26,18,8,0.06)' }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-baseline gap-2">
            <h3 className="font-display font-semibold text-ox-ink-deep" style={{ fontSize: '18px' }}>
              {word.word}
            </h3>
            {word.phonetic && (
              <span className="font-serif font-light italic text-ox-muted flex-shrink-0" style={{ fontSize: '11px' }}>
                {word.phonetic}
              </span>
            )}
          </div>
          {word.meanings[0]?.definition && (
            <p
              className="font-serif italic text-ox-muted mt-1 border-l-2 border-ox-border pl-2.5 truncate"
              style={{ fontSize: '11px', lineHeight: '1.4' }}
            >
              {word.meanings[0].partOfSpeech && (
                <span className="not-italic font-mono uppercase mr-1" style={{ fontSize: '9px', letterSpacing: '1px' }}>
                  {word.meanings[0].partOfSpeech}
                </span>
              )}
              {word.meanings[0].definition}
            </p>
          )}
        </div>
        <Badge stage={word.srsStage} />
      </div>
    </Link>
  );
}
