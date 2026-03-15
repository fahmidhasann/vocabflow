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
      className="block p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-600 transition-colors"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 truncate">{word.word}</h3>
            {word.phonetic && (
              <span className="text-sm text-gray-500 dark:text-gray-400 flex-shrink-0">{word.phonetic}</span>
            )}
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 truncate">
            {word.meanings[0]?.partOfSpeech && (
              <span className="italic">{word.meanings[0].partOfSpeech} </span>
            )}
            {word.meanings[0]?.definition}
          </p>
        </div>
        <Badge stage={word.srsStage} />
      </div>
    </Link>
  );
}
