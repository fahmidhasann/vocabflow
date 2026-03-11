import { useState, useEffect, useCallback } from 'react';
import { useVocabulary } from '../contexts/VocabularyContext';
import { WordEntry, ReviewRating } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, XCircle, RefreshCw, ArrowRight, BrainCircuit } from 'lucide-react';

interface ReviewSessionProps {
  onComplete: () => void;
}

export function ReviewSession({ onComplete }: ReviewSessionProps) {
  const { getDueWords, processReview, isLoaded } = useVocabulary();
  const [dueWords, setDueWords] = useState<WordEntry[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [reviewedCount, setReviewedCount] = useState(0);

  // Initialize session — wait until data is loaded to avoid treating empty words as "no reviews"
  useEffect(() => {
    if (!isLoaded) return;
    const words = getDueWords();
    // Shuffle words for variety
    const shuffled = [...words].sort(() => Math.random() - 0.5);
    setDueWords(shuffled);
    if (shuffled.length === 0) {
      setIsFinished(true);
    }
  }, [getDueWords, isLoaded]);

  const currentWord = dueWords[currentIndex];

  const handleRating = useCallback((rating: ReviewRating) => {
    if (!currentWord) return;
    processReview(currentWord.id, rating);
    setReviewedCount((prev) => prev + 1);
    handleNext();
  }, [currentWord, processReview]);

  const handleNext = useCallback(() => {
    setShowAnswer(false);
    if (currentIndex < dueWords.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setIsFinished(true);
    }
  }, [currentIndex, dueWords.length]);

  // Keyboard shortcuts handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only respond to keyboard shortcuts if not typing in an input field
      const activeElement = document.activeElement;
      const isTypingInInput =
        activeElement?.tagName === 'INPUT' ||
        activeElement?.tagName === 'TEXTAREA';

      if (isTypingInInput) return;

      // Spacebar: toggle answer
      if (e.code === 'Space') {
        e.preventDefault();
        setShowAnswer((prev) => !prev);
      }
      // 1: rate as "again"
      else if (e.key === '1') {
        e.preventDefault();
        if (showAnswer && currentWord) {
          handleRating('again');
        }
      }
      // 2: rate as "hard"
      else if (e.key === '2') {
        e.preventDefault();
        if (showAnswer && currentWord) {
          handleRating('hard');
        }
      }
      // 3: rate as "good"
      else if (e.key === '3') {
        e.preventDefault();
        if (showAnswer && currentWord) {
          handleRating('good');
        }
      }
      // 4: rate as "easy"
      else if (e.key === '4') {
        e.preventDefault();
        if (showAnswer && currentWord) {
          handleRating('easy');
        }
      }
      // n: advance to next word
      else if (e.key === 'n' || e.key === 'N') {
        e.preventDefault();
        if (showAnswer && currentWord) {
          handleNext();
          setShowAnswer(false);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showAnswer, currentWord, handleRating, handleNext]);

  if (isFinished) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center min-h-[60vh] text-center"
      >
        <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-6 shadow-inner">
          <CheckCircle2 className="w-12 h-12" />
        </div>
        <h2 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50 mb-4">Session Complete!</h2>
        <p className="text-zinc-500 dark:text-zinc-400 text-lg max-w-md mb-8">
          You reviewed {reviewedCount} words today. Consistency is the key to mastery.
        </p>
        <button
          onClick={onComplete}
          className="bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 font-semibold py-3 px-8 rounded-xl shadow-sm hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors flex items-center gap-2"
        >
          Back to Dashboard
          <ArrowRight className="w-5 h-5" />
        </button>
      </motion.div>
    );
  }

  if (!currentWord) return null;

  return (
    <div className="max-w-2xl mx-auto flex flex-col min-h-[70vh]">
      <header className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
            <BrainCircuit className="w-6 h-6 text-emerald-600" />
            Daily Review
          </h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Word {currentIndex + 1} of {dueWords.length}
          </p>
        </div>
        <div className="w-32 h-2 bg-zinc-200 dark:bg-zinc-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-emerald-500 transition-all duration-300"
            style={{ width: `${((currentIndex) / dueWords.length) * 100}%` }}
          />
        </div>
      </header>

      <div className="flex-1 flex flex-col relative" style={{ perspective: '1000px' }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentWord.id + (showAnswer ? '-back' : '-front')}
            initial={{ opacity: 0, y: 20, rotateX: -10 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            exit={{ opacity: 0, y: -20, rotateX: 10 }}
            transition={{ duration: 0.3 }}
            className="bg-white dark:bg-zinc-900 rounded-3xl shadow-sm border border-zinc-200 dark:border-zinc-700 p-8 md:p-12 flex-1 flex flex-col justify-center items-center text-center relative overflow-hidden"
          >
            {/* Front of Card */}
            {!showAnswer ? (
              <>
                <span className="text-sm font-medium text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mb-6">What does this mean?</span>
                <h3 className="text-5xl md:text-6xl font-bold text-zinc-900 dark:text-zinc-50 font-serif mb-8 tracking-tight">
                  {currentWord.word}
                </h3>
                {currentWord.context && (
                  <div className="mt-8 p-6 bg-zinc-50 dark:bg-zinc-800 rounded-2xl border border-zinc-100 dark:border-zinc-700 max-w-lg w-full">
                    <p className="text-sm text-zinc-500 dark:text-zinc-400 italic mb-2">Context</p>
                    <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed">"{currentWord.context}"</p>
                  </div>
                )}
              </>
            ) : (
              /* Back of Card */
              <div className="w-full text-left space-y-8">
                <div>
                  <h3 className="text-4xl font-bold text-zinc-900 dark:text-zinc-50 font-serif mb-2">{currentWord.word}</h3>
                  <p className="text-xl text-zinc-700 dark:text-zinc-200 font-medium leading-relaxed">{currentWord.definition}</p>
                </div>

                {currentWord.personalExample && (
                  <div className="p-6 bg-emerald-50 rounded-2xl border border-emerald-100">
                    <p className="text-sm text-emerald-600 font-semibold uppercase tracking-wider mb-2">Your Example</p>
                    <p className="text-emerald-900 italic text-lg">"{currentWord.personalExample}"</p>
                  </div>
                )}

                {currentWord.keyword && (
                  <div className="inline-block px-4 py-2 bg-zinc-100 dark:bg-zinc-700 rounded-lg text-sm font-medium text-zinc-600 dark:text-zinc-400">
                    Keyword: {currentWord.keyword}
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="mt-8 flex flex-col items-center justify-center gap-4">
        {!showAnswer ? (
          <button
            onClick={() => setShowAnswer(true)}
            className="w-full max-w-sm bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 font-semibold py-4 px-8 rounded-2xl shadow-lg shadow-zinc-900/20 hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-all text-lg focus:ring-4 focus:ring-zinc-200 dark:focus:ring-zinc-700"
          >
            Show Answer
          </button>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full grid grid-cols-2 md:grid-cols-4 gap-3"
          >
            <RatingButton
              rating="again"
              label="Forgot"
              shortcut="1"
              icon={<RefreshCw className="w-5 h-5" />}
              color="bg-red-50 text-red-700 border-red-200 hover:bg-red-100"
              onClick={() => handleRating('again')}
            />
            <RatingButton
              rating="hard"
              label="Hard"
              shortcut="2"
              icon={<XCircle className="w-5 h-5" />}
              color="bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100"
              onClick={() => handleRating('hard')}
            />
            <RatingButton
              rating="good"
              label="Good"
              shortcut="3"
              icon={<CheckCircle2 className="w-5 h-5" />}
              color="bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
              onClick={() => handleRating('good')}
            />
            <RatingButton
              rating="easy"
              label="Easy"
              shortcut="4"
              icon={<ArrowRight className="w-5 h-5" />}
              color="bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100"
              onClick={() => handleRating('easy')}
            />
          </motion.div>
        )}

        {showAnswer && (
          <div className="mt-4 text-center text-xs text-zinc-500 dark:text-zinc-400">
            <p>Press <kbd className="px-2 py-1 bg-zinc-200 dark:bg-zinc-700 rounded text-zinc-900 dark:text-zinc-100 font-mono">Space</kbd> to hide • <kbd className="px-2 py-1 bg-zinc-200 dark:bg-zinc-700 rounded text-zinc-900 dark:text-zinc-100 font-mono">N</kbd> to skip</p>
          </div>
        )}
      </div>
    </div>
  );
}

function RatingButton({
  label,
  shortcut,
  icon,
  color,
  onClick,
}: {
  rating: ReviewRating;
  label: string;
  shortcut: string;
  icon: React.ReactNode;
  color: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center justify-center gap-2 p-4 rounded-2xl border transition-all ${color}`}
    >
      {icon}
      <span className="font-semibold">{label}</span>
      <span className="text-xs opacity-70 font-mono">({shortcut})</span>
    </button>
  );
}
