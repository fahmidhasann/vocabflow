import { useMemo } from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { TrendingUp, Flame, Clock, Target } from 'lucide-react';
import { useVocabulary } from '../contexts/VocabularyContext';

export function Analytics() {
  const { words } = useVocabulary();

  // Status breakdown data
  const statusBreakdown = useMemo(() => {
    const newCount = words.filter((w) => w.status === 'new').length;
    const learningCount = words.filter((w) => w.status === 'learning').length;
    const masteredCount = words.filter((w) => w.status === 'mastered').length;

    return [
      { name: 'New', value: newCount, fill: '#3b82f6' },
      { name: 'Learning', value: learningCount, fill: '#f59e0b' },
      { name: 'Mastered', value: masteredCount, fill: '#10b981' },
    ].filter((d) => d.value > 0);
  }, [words]);

  // Weekly review stats
  const weeklyStats = useMemo(() => {
    const now = Date.now();
    const sevenDaysAgo = now - 7 * 24 * 60 * 60 * 1000;

    const reviewedLastWeek = words.filter((w) => w.lastReviewedAt && w.lastReviewedAt > sevenDaysAgo).length;
    const correctReviews = words.filter((w) => w.lastReviewedAt && w.lastReviewedAt > sevenDaysAgo && w.consecutiveCorrect > 0).length;
    const accuracy = reviewedLastWeek > 0 ? Math.round((correctReviews / reviewedLastWeek) * 100) : 0;

    return {
      reviewsLastWeek: reviewedLastWeek,
      accuracy,
    };
  }, [words]);

  // Daily streak counter (consecutive days reviewed)
  const dailyStreak = useMemo(() => {
    if (words.length === 0) return 0;

    const now = Date.now();
    const today = new Date(now);
    today.setHours(0, 0, 0, 0);
    const todayStart = today.getTime();

    // Check if reviewed today
    const reviewedToday = words.some((w) => w.lastReviewedAt && w.lastReviewedAt >= todayStart);
    if (!reviewedToday) return 0;

    let streak = 1;
    let currentDate = todayStart;

    for (let i = 1; i <= 365; i++) {
      const checkDate = currentDate - i * 24 * 60 * 60 * 1000;
      const checkDateStart = new Date(checkDate);
      checkDateStart.setHours(0, 0, 0, 0);
      const checkDateEnd = new Date(checkDate);
      checkDateEnd.setHours(23, 59, 59, 999);

      const hasReviewOnDay = words.some((w) => w.lastReviewedAt && w.lastReviewedAt >= checkDateStart.getTime() && w.lastReviewedAt <= checkDateEnd.getTime());
      if (hasReviewOnDay) {
        streak++;
      } else {
        break;
      }
    }

    return streak;
  }, [words]);

  // Forgetting curve (words by interval)
  const forgettingCurve = useMemo(() => {
    const intervals = [
      { range: '0 (New)', min: 0, max: 0 },
      { range: '1-3 Days', min: 1, max: 3 },
      { range: '4-7 Days', min: 4, max: 7 },
      { range: '8-14 Days', min: 8, max: 14 },
      { range: '15-30 Days', min: 15, max: 30 },
      { range: '31+ Days', min: 31, max: Infinity },
    ];

    return intervals.map((interval) => ({
      interval: interval.range,
      count: words.filter((w) => w.interval >= interval.min && w.interval <= interval.max).length,
      avgEase: words
        .filter((w) => w.interval >= interval.min && w.interval <= interval.max)
        .reduce((sum, w) => sum + w.easeFactor, 0) / Math.max(1, words.filter((w) => w.interval >= interval.min && w.interval <= interval.max).length),
    }));
  }, [words]);

  // Time-to-mastery metrics
  const timeToMastery = useMemo(() => {
    const masteredWords = words.filter((w) => w.status === 'mastered');
    if (masteredWords.length === 0) {
      return { avgDays: 0, minDays: 0, maxDays: 0, totalMastered: 0 };
    }

    const daysToMaster = masteredWords.map((w) => {
      const daysDiff = (w.lastReviewedAt || w.createdAt - w.createdAt) - w.createdAt;
      return daysDiff / (24 * 60 * 60 * 1000);
    });

    const avgDays = Math.round(daysToMaster.reduce((a, b) => a + b, 0) / daysToMaster.length);
    const minDays = Math.round(Math.min(...daysToMaster));
    const maxDays = Math.round(Math.max(...daysToMaster));

    return {
      avgDays,
      minDays,
      maxDays,
      totalMastered: masteredWords.length,
    };
  }, [words]);

  // Difficulty distribution (ease factor distribution)
  const difficultyDistribution = useMemo(() => {
    const easeRanges = [
      { range: '1.3-1.5 (Hard)', min: 1.3, max: 1.5 },
      { range: '1.6-1.9 (Medium)', min: 1.6, max: 1.9 },
      { range: '2.0-2.4 (Good)', min: 2.0, max: 2.4 },
      { range: '2.5+ (Easy)', min: 2.5, max: Infinity },
    ];

    return easeRanges.map((range) => ({
      range: range.range,
      count: words.filter((w) => w.easeFactor >= range.min && w.easeFactor <= range.max).length,
    }));
  }, [words]);

  // Learning progress over time (by status)
  const learningProgress = useMemo(() => {
    if (words.length === 0) return [];

    const sorted = [...words].sort((a, b) => a.createdAt - b.createdAt);
    const timeline: { [key: string]: number } = {};

    let newCount = 0,
      learningCount = 0,
      masteredCount = 0;

    sorted.forEach((w, index) => {
      const date = new Date(w.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

      if (w.status === 'new') newCount++;
      else if (w.status === 'learning') learningCount++;
      else if (w.status === 'mastered') masteredCount++;

      if (!timeline[date]) {
        timeline[date] = index + 1;
      }
    });

    return Object.entries(timeline)
      .map(([date, total]) => ({
        date,
        total,
      }))
      .slice(-14); // Last 14 data points
  }, [words]);

  if (words.length === 0) {
    return (
      <div className="space-y-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-white mb-2">Analytics</h1>
          <p className="text-zinc-600 dark:text-zinc-400">Track your vocabulary learning progress</p>
        </div>

        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl p-12 text-center">
          <Target className="w-16 h-16 mx-auto text-zinc-300 dark:text-zinc-700 mb-4" />
          <p className="text-zinc-600 dark:text-zinc-400 text-lg">No data yet. Start adding words to see your analytics!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-white mb-2">Analytics</h1>
        <p className="text-zinc-600 dark:text-zinc-400">Track your vocabulary learning progress</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Words */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400 mb-1">Total Words</p>
              <p className="text-3xl font-bold text-zinc-900 dark:text-white">{words.length}</p>
            </div>
            <Target className="w-10 h-10 text-emerald-500 opacity-20" />
          </div>
        </div>

        {/* Daily Streak */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400 mb-1">Daily Streak</p>
              <p className="text-3xl font-bold text-zinc-900 dark:text-white">{dailyStreak}</p>
            </div>
            <Flame className="w-10 h-10 text-orange-500 opacity-20" />
          </div>
        </div>

        {/* Reviews This Week */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400 mb-1">Reviews (7d)</p>
              <p className="text-3xl font-bold text-zinc-900 dark:text-white">{weeklyStats.reviewsLastWeek}</p>
            </div>
            <TrendingUp className="w-10 h-10 text-blue-500 opacity-20" />
          </div>
        </div>

        {/* Accuracy */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400 mb-1">Accuracy (7d)</p>
              <p className="text-3xl font-bold text-zinc-900 dark:text-white">{weeklyStats.accuracy}%</p>
            </div>
            <Clock className="w-10 h-10 text-purple-500 opacity-20" />
          </div>
        </div>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Status Breakdown */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-white mb-4">Status Breakdown</h2>
          {statusBreakdown.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={statusBreakdown} cx="50%" cy="50%" labelLine={false} label={({ name, value }) => `${name}: ${value}`} outerRadius={80} fill="#8884d8" dataKey="value">
                  {statusBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[250px] flex items-center justify-center text-zinc-500">No data</div>
          )}
        </div>

        {/* Difficulty Distribution */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-white mb-4">Difficulty Distribution</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={difficultyDistribution}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="range" stroke="#6b7280" fontSize={12} />
              <YAxis stroke="#6b7280" fontSize={12} />
              <Tooltip contentStyle={{ backgroundColor: '#18181b', border: 'none', borderRadius: '8px' }} />
              <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Forgetting Curve */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-white mb-4">Forgetting Curve (by Interval)</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={forgettingCurve}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="interval" stroke="#6b7280" fontSize={12} angle={-45} textAnchor="end" height={80} />
              <YAxis stroke="#6b7280" fontSize={12} />
              <Tooltip contentStyle={{ backgroundColor: '#18181b', border: 'none', borderRadius: '8px' }} />
              <Legend />
              <Bar dataKey="count" fill="#f59e0b" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Time-to-Mastery Stats */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-white mb-4">Time-to-Mastery</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-zinc-200 dark:border-zinc-700">
              <span className="text-zinc-600 dark:text-zinc-400">Mastered Words</span>
              <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{timeToMastery.totalMastered}</span>
            </div>
            <div className="flex justify-between items-center pb-3 border-b border-zinc-200 dark:border-zinc-700">
              <span className="text-zinc-600 dark:text-zinc-400">Avg Days to Mastery</span>
              <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">{timeToMastery.avgDays}</span>
            </div>
            <div className="flex justify-between items-center pb-3 border-b border-zinc-200 dark:border-zinc-700">
              <span className="text-zinc-600 dark:text-zinc-400">Fastest (Min)</span>
              <span className="text-2xl font-bold text-purple-600 dark:text-purple-400">{timeToMastery.minDays}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-zinc-600 dark:text-zinc-400">Slowest (Max)</span>
              <span className="text-2xl font-bold text-orange-600 dark:text-orange-400">{timeToMastery.maxDays}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Learning Progress Chart */}
      {learningProgress.length > 0 && (
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-white mb-4">Learning Progress Over Time</h2>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={learningProgress}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="date" stroke="#6b7280" fontSize={12} />
              <YAxis stroke="#6b7280" fontSize={12} />
              <Tooltip contentStyle={{ backgroundColor: '#18181b', border: 'none', borderRadius: '8px' }} />
              <Line type="monotone" dataKey="total" stroke="#10b981" strokeWidth={2} dot={{ fill: '#10b981', r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Summary Stats */}
      <div className="bg-gradient-to-r from-emerald-50 to-blue-50 dark:from-emerald-900/20 dark:to-blue-900/20 border border-emerald-200 dark:border-emerald-700/30 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-4">Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-1">Learning Efficiency</p>
            <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
              {words.length > 0 ? Math.round((statusBreakdown.filter((d) => d.name === 'Mastered')[0]?.value || 0) / words.length * 100) : 0}%
            </p>
            <p className="text-xs text-zinc-500 dark:text-zinc-500 mt-1">of words mastered</p>
          </div>
          <div>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-1">Average Ease Factor</p>
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {words.length > 0 ? (words.reduce((sum, w) => sum + w.easeFactor, 0) / words.length).toFixed(2) : '0.00'}
            </p>
            <p className="text-xs text-zinc-500 dark:text-zinc-500 mt-1">learning difficulty</p>
          </div>
          <div>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-1">Total Reviews</p>
            <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {words.filter((w) => w.lastReviewedAt).length}
            </p>
            <p className="text-xs text-zinc-500 dark:text-zinc-500 mt-1">words reviewed</p>
          </div>
        </div>
      </div>
    </div>
  );
}
