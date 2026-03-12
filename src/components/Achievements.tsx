import { useState, useMemo } from 'react';
import { Trophy, Lock, BookMarked, Flame, Star } from 'lucide-react';
import { motion } from 'motion/react';
import { Achievement, BadgeType } from '../types';

interface AchievementsProps {
  unlockedAchievements?: Achievement[];
}

const BADGE_DEFINITIONS: Record<BadgeType, Omit<Achievement, 'unlockedAt' | 'id'>> = {
  streak_7: {
    name: 'On Fire',
    description: 'Review words for 7 consecutive days',
    icon: '🔥',
    category: 'streak',
    criteria: { type: 'days', value: 7 },
  },
  streak_30: {
    name: 'Unstoppable',
    description: 'Review words for 30 consecutive days',
    icon: '🌟',
    category: 'streak',
    tier: 'silver',
    criteria: { type: 'days', value: 30 },
  },
  streak_100: {
    name: 'Legendary',
    description: 'Review words for 100 consecutive days',
    icon: '👑',
    category: 'streak',
    tier: 'gold',
    criteria: { type: 'days', value: 100 },
  },
  first_steps_5: {
    name: 'Getting Started',
    description: 'Add your first 5 words',
    icon: '📚',
    category: 'milestone',
    criteria: { type: 'words', value: 5 },
  },
  first_steps_25: {
    name: 'Word Collector',
    description: 'Add 25 words to your vocabulary',
    icon: '📖',
    category: 'milestone',
    tier: 'silver',
    criteria: { type: 'words', value: 25 },
  },
  first_steps_100: {
    name: 'Library Master',
    description: 'Add 100 words to your vocabulary',
    icon: '🏛️',
    category: 'milestone',
    tier: 'gold',
    criteria: { type: 'words', value: 100 },
  },
  perfect_session: {
    name: 'Flawless',
    description: 'Complete a review session with 100% accuracy',
    icon: '✨',
    category: 'mastery',
    criteria: { type: 'accuracy', value: 100 },
  },
  category_master: {
    name: 'Category Master',
    description: 'Master all words in a category',
    icon: '🎯',
    category: 'mastery',
    criteria: { type: 'category', value: 1 },
  },
  consistency_7: {
    name: 'Committed',
    description: 'Review for 7 days in the past 14 days',
    icon: '⏰',
    category: 'consistency',
    criteria: { type: 'days', value: 7 },
  },
  consistency_30: {
    name: 'Dedicated',
    description: 'Review for 30 days in the past 60 days',
    icon: '💪',
    category: 'consistency',
    tier: 'silver',
    criteria: { type: 'days', value: 30 },
  },
  consistency_100: {
    name: 'Obsessed',
    description: 'Review for 100 days in the past 200 days',
    icon: '🚀',
    category: 'consistency',
    tier: 'gold',
    criteria: { type: 'days', value: 100 },
  },
};

const CATEGORY_TABS = [
  { id: 'all', label: 'All', icon: '🏆' },
  { id: 'streak', label: 'Streak', icon: '🔥' },
  { id: 'mastery', label: 'Mastery', icon: '✨' },
  { id: 'consistency', label: 'Consistency', icon: '⏰' },
  { id: 'milestone', label: 'Milestones', icon: '🎯' },
];

export function Achievements({ unlockedAchievements = [] }: AchievementsProps) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Create a set of unlocked badge IDs for quick lookup
  const unlockedIds = useMemo(
    () => new Set(unlockedAchievements.map((a) => a.id)),
    [unlockedAchievements]
  );

  // Create unlocked achievements array with full data
  const fullUnlockedAchievements = useMemo(
    () =>
      unlockedAchievements.map((achievement) => ({
        ...achievement,
        ...BADGE_DEFINITIONS[achievement.id],
      })),
    [unlockedAchievements]
  );

  // Create locked achievements array
  const lockedAchievements = useMemo(
    () =>
      (Object.entries(BADGE_DEFINITIONS) as [BadgeType, any][])
        .filter(([id]) => !unlockedIds.has(id))
        .map(([id, definition]) => ({
          id,
          ...definition,
          unlockedAt: null,
        })),
    [unlockedIds]
  );

  // Filter achievements by category
  const filteredAchievements = useMemo(() => {
    const allAchievements = [
      ...fullUnlockedAchievements.sort(
        (a, b) => (b.unlockedAt || 0) - (a.unlockedAt || 0)
      ),
      ...lockedAchievements.sort((a, b) => a.name.localeCompare(b.name)),
    ];

    if (selectedCategory === 'all') {
      return allAchievements;
    }

    return allAchievements.filter((a) => a.category === selectedCategory);
  }, [fullUnlockedAchievements, lockedAchievements, selectedCategory]);

  const unlockedCount = fullUnlockedAchievements.length;
  const totalCount = Object.keys(BADGE_DEFINITIONS).length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      {/* Header */}
      <header>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Trophy className="w-8 h-8 text-amber-500" />
            <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
              Achievements
            </h1>
          </div>
          <div className="hidden md:flex items-center gap-4">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-all ${
                viewMode === 'grid'
                  ? 'bg-emerald-500 text-white'
                  : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400'
              }`}
              title="Grid view"
            >
              <div className="w-5 h-5 grid grid-cols-2 gap-1">
                <div className="bg-current rounded"></div>
                <div className="bg-current rounded"></div>
                <div className="bg-current rounded"></div>
                <div className="bg-current rounded"></div>
              </div>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-all ${
                viewMode === 'list'
                  ? 'bg-emerald-500 text-white'
                  : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400'
              }`}
              title="List view"
            >
              <div className="w-5 h-5 flex flex-col justify-between">
                <div className="h-px bg-current w-full"></div>
                <div className="h-px bg-current w-full"></div>
                <div className="h-px bg-current w-full"></div>
              </div>
            </button>
          </div>
        </div>

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <p className="text-zinc-500 dark:text-zinc-400 mb-2">
              Unlock badges by completing challenges and milestones.
            </p>
            <div className="flex items-center gap-2">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white font-bold text-lg">
                {unlockedCount}
              </div>
              <div>
                <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                  {unlockedCount} of {totalCount} unlocked
                </p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  {Math.round((unlockedCount / totalCount) * 100)}% complete
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Category Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 md:mx-0 md:px-0 md:gap-3">
        {CATEGORY_TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSelectedCategory(tab.id)}
            className={`px-4 py-2 rounded-xl font-medium whitespace-nowrap transition-all flex items-center gap-2 ${
              selectedCategory === tab.id
                ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30'
                : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700'
            }`}
          >
            <span>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Achievements Display */}
      {filteredAchievements.length === 0 ? (
        <div className="text-center py-12">
          <Lock className="w-12 h-12 text-zinc-300 dark:text-zinc-700 mx-auto mb-3" />
          <p className="text-zinc-500 dark:text-zinc-400">
            No achievements in this category yet.
          </p>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredAchievements.map((achievement, idx) => (
            <AchievementCard
              key={`${achievement.id}-${idx}`}
              achievement={achievement}
              isUnlocked={unlockedIds.has(achievement.id)}
            />
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredAchievements.map((achievement, idx) => (
            <AchievementListItem
              key={`${achievement.id}-${idx}`}
              achievement={achievement}
              isUnlocked={unlockedIds.has(achievement.id)}
            />
          ))}
        </div>
      )}

      {/* Stats Summary */}
      {unlockedCount > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 border-t border-zinc-200 dark:border-zinc-800">
          <div className="bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/30 dark:to-amber-900/20 p-6 rounded-2xl">
            <div className="flex items-center gap-3 mb-2">
              <Flame className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              <h3 className="font-semibold text-zinc-900 dark:text-zinc-50">
                Streaks
              </h3>
            </div>
            <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">
              {fullUnlockedAchievements.filter((a) => a.category === 'streak')
                .length}
            </p>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1">
              Consecutive day challenges
            </p>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-900/20 p-6 rounded-2xl">
            <div className="flex items-center gap-3 mb-2">
              <Star className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              <h3 className="font-semibold text-zinc-900 dark:text-zinc-50">
                Mastery
              </h3>
            </div>
            <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {fullUnlockedAchievements.filter((a) => a.category === 'mastery')
                .length}
            </p>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1">
              Skill and accuracy badges
            </p>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-900/20 p-6 rounded-2xl">
            <div className="flex items-center gap-3 mb-2">
              <BookMarked className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <h3 className="font-semibold text-zinc-900 dark:text-zinc-50">
                Milestones
              </h3>
            </div>
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {
                fullUnlockedAchievements.filter((a) => a.category === 'milestone')
                  .length
              }
            </p>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1">
              Collection and progress badges
            </p>
          </div>
        </div>
      )}
    </motion.div>
  );
}

interface AchievementCardProps {
  achievement: Achievement & Omit<typeof BADGE_DEFINITIONS[keyof typeof BADGE_DEFINITIONS], 'id'>;
  isUnlocked: boolean;
}

function AchievementCard({
  achievement,
  isUnlocked,
}: AchievementCardProps) {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`relative rounded-2xl p-4 transition-all cursor-pointer group ${
        isUnlocked
          ? 'bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/30 dark:to-emerald-900/20 border border-emerald-200 dark:border-emerald-800 hover:shadow-lg hover:shadow-emerald-500/20'
          : 'bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 opacity-60'
      }`}
      onMouseEnter={() => setShowDetails(true)}
      onMouseLeave={() => setShowDetails(false)}
    >
      {/* Locked Badge */}
      {!isUnlocked && (
        <div className="absolute top-2 right-2">
          <Lock className="w-4 h-4 text-zinc-400 dark:text-zinc-600" />
        </div>
      )}

      {/* Badge Icon */}
      <div className="text-4xl mb-3 text-center group-hover:scale-110 transition-transform">
        {achievement.icon}
      </div>

      {/* Badge Name */}
      <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-50 text-center mb-1 line-clamp-2">
        {achievement.name}
      </h3>

      {/* Unlock Date or Criteria */}
      {isUnlocked && achievement.unlockedAt ? (
        <p className="text-xs text-emerald-600 dark:text-emerald-400 text-center">
          {new Date(achievement.unlockedAt).toLocaleDateString(undefined, {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          })}
        </p>
      ) : (
        <p className="text-xs text-zinc-500 dark:text-zinc-400 text-center">
          {achievement.criteria.type}: {achievement.criteria.value}
        </p>
      )}

      {/* Tier Badge */}
      {achievement.tier && (
        <div
          className={`mt-2 inline-flex w-full justify-center rounded-lg py-1 text-xs font-semibold uppercase tracking-wide ${
            achievement.tier === 'gold'
              ? 'bg-amber-200 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300'
              : achievement.tier === 'silver'
                ? 'bg-slate-200 dark:bg-slate-900/40 text-slate-800 dark:text-slate-300'
                : 'bg-orange-200 dark:bg-orange-900/40 text-orange-800 dark:text-orange-300'
          }`}
        >
          {achievement.tier}
        </div>
      )}

      {/* Tooltip */}
      {showDetails && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 bg-zinc-900 dark:bg-zinc-950 text-white text-xs rounded-lg p-2 z-50 whitespace-normal break-words">
          {achievement.description}
          <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-zinc-900 dark:border-t-zinc-950"></div>
        </div>
      )}
    </motion.div>
  );
}

function AchievementListItem({
  achievement,
  isUnlocked,
}: AchievementCardProps) {
  const getCategoryIcon = () => {
    switch (achievement.category) {
      case 'streak':
        return '🔥';
      case 'mastery':
        return '✨';
      case 'consistency':
        return '⏰';
      case 'milestone':
        return '🎯';
      default:
        return '🏆';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      className={`flex items-start gap-4 p-4 rounded-xl border transition-all ${
        isUnlocked
          ? 'bg-white dark:bg-zinc-900 border-emerald-200 dark:border-emerald-800 hover:shadow-md'
          : 'bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 opacity-60'
      }`}
    >
      {/* Icon */}
      <div className="flex-shrink-0">
        <div className={`text-2xl w-12 h-12 flex items-center justify-center rounded-lg ${
          isUnlocked
            ? 'bg-emerald-100 dark:bg-emerald-900/30'
            : 'bg-zinc-200 dark:bg-zinc-800'
        }`}>
          {achievement.icon}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <h3 className="font-semibold text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
              {achievement.name}
              {isUnlocked && achievement.tier && (
                <span
                  className={`text-xs font-bold uppercase px-2 py-0.5 rounded ${
                    achievement.tier === 'gold'
                      ? 'bg-amber-200 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300'
                      : achievement.tier === 'silver'
                        ? 'bg-slate-200 dark:bg-slate-900/40 text-slate-800 dark:text-slate-300'
                        : 'bg-orange-200 dark:bg-orange-900/40 text-orange-800 dark:text-orange-300'
                  }`}
                >
                  {achievement.tier}
                </span>
              )}
            </h3>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
              {achievement.description}
            </p>
          </div>

          {!isUnlocked && (
            <Lock className="w-4 h-4 text-zinc-400 dark:text-zinc-600 flex-shrink-0 mt-1" />
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-zinc-200 dark:border-zinc-800">
          <span className="text-xs text-zinc-500 dark:text-zinc-400 flex items-center gap-1">
            <span>{getCategoryIcon()}</span>
            {achievement.category.charAt(0).toUpperCase() +
              achievement.category.slice(1)}
          </span>

          {isUnlocked ? (
            <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
              ✓ Unlocked{' '}
              {achievement.unlockedAt &&
                new Date(achievement.unlockedAt).toLocaleDateString(undefined, {
                  month: 'short',
                  day: 'numeric',
                })}
            </span>
          ) : (
            <span className="text-xs text-zinc-500 dark:text-zinc-400">
              {achievement.criteria.type}: {achievement.criteria.value}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}
