import { useState } from 'react';
import { useVocabulary } from '../contexts/VocabularyContext';
import { Search, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { WordEntry } from '../types';

export function WordList() {
  const { words, deleteWord } = useVocabulary();
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filteredWords = words.filter((w) =>
    w.word.toLowerCase().includes(searchTerm.toLowerCase()) ||
    w.definition.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">My Words</h2>
          <p className="text-zinc-500 dark:text-zinc-400 mt-1">You have saved {words.length} words.</p>
        </div>
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400 dark:text-zinc-500" />
          <input
            type="text"
            placeholder="Search words..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 dark:text-zinc-100 dark:placeholder-zinc-400 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
          />
        </div>
      </header>

      {filteredWords.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-100 dark:border-zinc-800">
          <p className="text-zinc-500 dark:text-zinc-400">No words found.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredWords.map((word) => (
            <WordCard
              key={word.id}
              word={word}
              isExpanded={expandedId === word.id}
              onToggle={() => setExpandedId(expandedId === word.id ? null : word.id)}
              onDelete={() => deleteWord(word.id)}
            />
          ))}
        </div>
      )}
    </motion.div>
  );
}

function WordCard({ word, isExpanded, onToggle, onDelete }: { word: WordEntry; isExpanded: boolean; onToggle: () => void; onDelete: () => void }) {
  const statusColors = {
    new: 'bg-amber-100 text-amber-700 border-amber-200',
    learning: 'bg-indigo-100 text-indigo-700 border-indigo-200',
    mastered: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  };

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-700 overflow-hidden transition-all hover:border-zinc-300 dark:hover:border-zinc-600">
      <div
        className="p-4 flex items-center justify-between cursor-pointer select-none"
        onClick={onToggle}
      >
        <div className="flex items-center gap-4">
          <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50 font-serif">{word.word}</h3>
          <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider border ${statusColors[word.status]}`}>
            {word.status}
          </span>
        </div>
        <div className="flex items-center gap-2 text-zinc-400 dark:text-zinc-500">
          <span className="text-sm font-medium mr-2">
            Next review: {new Date(word.nextReviewDate).toLocaleDateString()}
          </span>
          {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </div>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-zinc-100 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800"
          >
            <div className="p-4 space-y-4">
              <div>
                <p className="text-sm font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-1">Definition</p>
                <p className="text-zinc-900 dark:text-zinc-100">{word.definition}</p>
              </div>
              
              {word.context && (
                <div>
                  <p className="text-sm font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-1">Source Context</p>
                  <p className="text-zinc-700 dark:text-zinc-300 italic">"{word.context}"</p>
                </div>
              )}

              {word.personalExample && (
                <div>
                  <p className="text-sm font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-1">Personal Example</p>
                  <p className="text-zinc-700 dark:text-zinc-300">"{word.personalExample}"</p>
                </div>
              )}

              <div className="pt-4 flex justify-end gap-2 border-t border-zinc-200 dark:border-zinc-700">
                <button
                  onClick={onDelete}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  aria-label={`Delete ${word.word}`}
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
