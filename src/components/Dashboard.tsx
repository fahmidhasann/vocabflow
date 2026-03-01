import React from 'react';
import { PlayCircle, BookOpen, CheckCircle, Clock } from 'lucide-react';
import { useVocabulary } from '../hooks/useVocabulary';
import { motion } from 'motion/react';

interface DashboardProps {
  onStartReview: () => void;
  onAddWord: () => void;
}

export function Dashboard({ onStartReview, onAddWord }: DashboardProps) {
  const { getStats } = useVocabulary();
  const stats = getStats();

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <header>
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900">Good morning</h1>
        <p className="text-zinc-500 mt-2">Here's your vocabulary progress.</p>
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
          color="bg-blue-50"
        />
        <StatCard
          icon={<Clock className="w-5 h-5 text-amber-500" />}
          label="New"
          value={stats.newWords}
          color="bg-amber-50"
        />
        <StatCard
          icon={<PlayCircle className="w-5 h-5 text-indigo-500" />}
          label="Learning"
          value={stats.learning}
          color="bg-indigo-50"
        />
        <StatCard
          icon={<CheckCircle className="w-5 h-5 text-emerald-500" />}
          label="Mastered"
          value={stats.mastered}
          color="bg-emerald-50"
        />
      </div>
    </motion.div>
  );
}

function StatCard({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: number; color: string }) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-zinc-100 shadow-sm flex flex-col items-start">
      <div className={`p-3 rounded-xl ${color} mb-4`}>{icon}</div>
      <span className="text-3xl font-bold text-zinc-900 mb-1">{value}</span>
      <span className="text-sm font-medium text-zinc-500">{label}</span>
    </div>
  );
}
