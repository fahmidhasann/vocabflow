import { useState, useEffect } from 'react';
import { useVocabulary } from '../hooks/useVocabulary';
import { WordEntry, ReviewRating } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, XCircle, RefreshCw, ArrowRight, BrainCircuit } from 'lucide-react';

interface ReviewSessionProps {
  onComplete: () => void;
}

export function ReviewSession({ onComplete }: ReviewSessionProps) {
  const { getDueWords, processReview } = useVocabulary();
  const [dueWords, setDueWords] = useState<WordEntry[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [reviewedCount, setReviewedCount] = useState(0);

  // Initialize session
  useEffect(() => {
    const words = getDueWords();
    // Shuffle words for variety
    const shuffled = [...words].sort(() => Math.random() - 0.5);
    setDueWords(shuffled);
    if (shuffled.length === 0) {
      setIsFinished(true);
    }
  }, [getDueWords]);

  const currentWord = dueWords[currentIndex];

  const handleRating = (rating: ReviewRating) => {
    if (!currentWord) return;
    processReview(currentWord.id, rating);
    setReviewedCount((prev) => prev + 1);
    handleNext();
  };

  const handleNext = () => {
    setShowAnswer(false);
    if (currentIndex < dueWords.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setIsFinished(true);
    }
  };

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
        <h2 className="text-3xl font-bold text-zinc-900 mb-4">Session Complete!</h2>
        <p className="text-zinc-500 text-lg max-w-md mb-8">
          You reviewed {reviewedCount} words today. Consistency is the key to mastery.
        </p>
        <button
          onClick={onComplete}
          className="bg-zinc-900 text-white font-semibold py-3 px-8 rounded-xl shadow-sm hover:bg-zinc-800 transition-colors flex items-center gap-2"
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
          <h2 className="text-xl font-bold text-zinc-900 flex items-center gap-2">
            <BrainCircuit className="w-6 h-6 text-emerald-600" />
            Daily Review
          </h2>
          <p className="text-sm text-zinc-500 mt-1">
            Word {currentIndex + 1} of {dueWords.length}
          </p>
        </div>
        <div className="w-32 h-2 bg-zinc-200 rounded-full overflow-hidden">
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
            className="bg-white rounded-3xl shadow-sm border border-zinc-200 p-8 md:p-12 flex-1 flex flex-col justify-center items-center text-center relative overflow-hidden"
          >
            {/* Front of Card */}
            {!showAnswer ? (
              <>
                <span className="text-sm font-medium text-zinc-400 uppercase tracking-widest mb-6">What does this mean?</span>
                <h3 className="text-5xl md:text-6xl font-bold text-zinc-900 font-serif mb-8 tracking-tight">
                  {currentWord.word}
                </h3>
                {currentWord.context && (
                  <div className="mt-8 p-6 bg-zinc-50 rounded-2xl border border-zinc-100 max-w-lg w-full">
                    <p className="text-sm text-zinc-500 italic mb-2">Context</p>
                    <p className="text-zinc-700 leading-relaxed">"{currentWord.context}"</p>
                  </div>
                )}
              </>
            ) : (
              /* Back of Card */
              <div className="w-full text-left space-y-8">
                <div>
                  <h3 className="text-4xl font-bold text-zinc-900 font-serif mb-2">{currentWord.word}</h3>
                  <p className="text-xl text-zinc-700 font-medium leading-relaxed">{currentWord.definition}</p>
                </div>

                {currentWord.personalExample && (
                  <div className="p-6 bg-emerald-50 rounded-2xl border border-emerald-100">
                    <p className="text-sm text-emerald-600 font-semibold uppercase tracking-wider mb-2">Your Example</p>
                    <p className="text-emerald-900 italic text-lg">"{currentWord.personalExample}"</p>
                  </div>
                )}

                {currentWord.keyword && (
                  <div className="inline-block px-4 py-2 bg-zinc-100 rounded-lg text-sm font-medium text-zinc-600">
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
            className="w-full max-w-sm bg-zinc-900 text-white font-semibold py-4 px-8 rounded-2xl shadow-lg shadow-zinc-900/20 hover:bg-zinc-800 transition-all text-lg focus:ring-4 focus:ring-zinc-200"
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
              icon={<RefreshCw className="w-5 h-5" />}
              color="bg-red-50 text-red-700 border-red-200 hover:bg-red-100"
              onClick={() => handleRating('again')}
            />
            <RatingButton
              rating="hard"
              label="Hard"
              icon={<XCircle className="w-5 h-5" />}
              color="bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100"
              onClick={() => handleRating('hard')}
            />
            <RatingButton
              rating="good"
              label="Good"
              icon={<CheckCircle2 className="w-5 h-5" />}
              color="bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
              onClick={() => handleRating('good')}
            />
            <RatingButton
              rating="easy"
              label="Easy"
              icon={<ArrowRight className="w-5 h-5" />}
              color="bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100"
              onClick={() => handleRating('easy')}
            />
          </motion.div>
        )}
      </div>
    </div>
  );
}

function RatingButton({ label, icon, color, onClick }: { rating: ReviewRating; label: string; icon: React.ReactNode; color: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center justify-center gap-2 p-4 rounded-2xl border transition-all ${color}`}
    >
      {icon}
      <span className="font-semibold">{label}</span>
    </button>
  );
}
