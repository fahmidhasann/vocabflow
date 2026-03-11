import React from 'react';
import { PlayCircle, BookOpen, CheckCircle, Clock, FolderOpen } from 'lucide-react';
import { useVocabulary } from '../contexts/VocabularyContext';
import { motion } from 'motion/react';

interface DashboardProps {
  onStartReview: () => void;
  onAddWord: () => void;
}

export function Dashboard({ onStartReview, onAddWord }: DashboardProps) {
  const { getStats, categories, getCategoryStats } = useVocabulary();
  const stats = getStats();

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <header>
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">Good morning</h1>
        <p className="text-zinc-500 dark:text-zinc-400 mt-2">Here's your vocabulary progress.</p>
      </header>

      {/* Hero Action Card */}
      <div className="bg-emerald-600 rounded-3xl p-8 text-white shadow-lg shadow-emerald-600/20 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-emerald-500 rounded-full opacity-50 blur-3xl"></div>
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <h2 className="text-2xl font-semibold mb-2">Daily Review</h2>
            <p className="text-emerald-100 mb-6 max-w-md">
              {stats.dueToday > 0
                ? `You have ${stats.dueToday} words to review today. Keep your streak alive!`
                : "You're all caught up for today! Great job."}
            </p>
            <button
              onClick={stats.dueToday > 0 ? onStartReview : onAddWord}
              className="bg-white text-emerald-700 font-semibold py-3 px-6 rounded-xl shadow-sm hover:bg-emerald-50 transition-colors flex items-center gap-2"
            >
              {stats.dueToday > 0 ? (
                <>
                  <PlayCircle className="w-5 h-5" />
                  Start Review
                </>
              ) : (
                <>
                  <BookOpen className="w-5 h-5" />
                  Add New Words
                </>
              )}
            </button>
          </div>
          <div className="hidden md:flex flex-col items-center justify-center bg-emerald-700/50 rounded-2xl p-6 min-w-[140px]">
            <span className="text-4xl font-bold mb-1">{stats.dueToday}</span>
            <span className="text-sm text-emerald-200 font-medium uppercase tracking-wider">Due Today</span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          icon={<BookOpen className="w-5 h-5 text-blue-500" />}
          label="Total Words"
          value={stats.total}
          color="bg-blue-50 dark:bg-blue-900/30"
        />
        <StatCard
          icon={<Clock className="w-5 h-5 text-amber-500" />}
          label="New"
          value={stats.newWords}
          color="bg-amber-50 dark:bg-amber-900/30"
        />
        <StatCard
          icon={<PlayCircle className="w-5 h-5 text-indigo-500" />}
          label="Learning"
          value={stats.learning}
          color="bg-indigo-50 dark:bg-indigo-900/30"
        />
        <StatCard
          icon={<CheckCircle className="w-5 h-5 text-emerald-500" />}
          label="Mastered"
          value={stats.mastered}
          color="bg-emerald-50 dark:bg-emerald-900/30"
        />
      </div>

      {/* Category Stats Section */}
      {categories.length > 0 && (
        <div>
          <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 mb-4 flex items-center gap-2">
            <FolderOpen className="w-5 h-5" />
            Category Breakdown
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((category) => {
              const categoryStats = getCategoryStats(category.id);
              return (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-100 dark:border-zinc-800 shadow-sm"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-zinc-900 dark:text-zinc-50">
                        {category.name}
                      </h3>
                      {category.description && (
                        <p className="text-sm text-zinc-500 dark:text-zinc-400">
                          {category.description}
                        </p>
                      )}
                    </div>
                    {category.color && (
                      <div
                        className={`w-3 h-3 rounded-full flex-shrink-0 bg-${category.color}-500`}
                      />
                    )}
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-sm">
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                      <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
                        {categoryStats.total}
                      </div>
                      <div className="text-xs text-zinc-500 dark:text-zinc-400">Total</div>
                    </div>
                    <div className="bg-amber-50 dark:bg-amber-900/20 p-3 rounded-lg">
                      <div className="text-lg font-bold text-amber-600 dark:text-amber-400">
                        {categoryStats.new}
                      </div>
                      <div className="text-xs text-zinc-500 dark:text-zinc-400">New</div>
                    </div>
                    <div className="bg-indigo-50 dark:bg-indigo-900/20 p-3 rounded-lg">
                      <div className="text-lg font-bold text-indigo-600 dark:text-indigo-400">
                        {categoryStats.learning}
                      </div>
                      <div className="text-xs text-zinc-500 dark:text-zinc-400">Learning</div>
                    </div>
                  </div>
                  <div className="mt-3 bg-emerald-50 dark:bg-emerald-900/20 p-3 rounded-lg">
                    <div className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                      {categoryStats.mastered}
                    </div>
                    <div className="text-xs text-zinc-500 dark:text-zinc-400">Mastered</div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}
    </motion.div>
  );
}

function StatCard({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: number; color: string }) {
  return (
    <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-100 dark:border-zinc-800 shadow-sm flex flex-col items-start">
      <div className={`p-3 rounded-xl ${color} mb-4`}>{icon}</div>
      <span className="text-3xl font-bold text-zinc-900 dark:text-zinc-50 mb-1">{value}</span>
      <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400">{label}</span>
    </div>
  );
}
