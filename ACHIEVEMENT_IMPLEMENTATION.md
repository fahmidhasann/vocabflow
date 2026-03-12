# Achievement Tracking Implementation

## Summary
Extended `useVocabulary` hook to track and unlock achievements based on user progress in vocabulary learning.

## Changes Made to `src/hooks/useVocabulary.ts`

### 1. **Imports & Constants**
- Added `Achievement` and `BadgeType` to imports from types
- Added `ACHIEVEMENTS_STORAGE_KEY` constant for localStorage persistence

### 2. **State Management**
- Added `achievements` state: `useState<Achievement[]>([])`
- Returns `achievements` in the hook return object

### 3. **Persistence**
- Loads achievements from localStorage on mount
- Persists achievements to localStorage on any change via useEffect
- Uses consistent pattern with existing words/categories localStorage

### 4. **Achievement Criteria Functions**

#### `calculateDailyStreak()`
- Scans through all words and their `lastReviewedAt` timestamps
- Returns consecutive days with reviews counting backwards from today
- Used by streak-based achievements (7, 30, 100 day streaks)

#### `unlockAchievement()`
- Prevents duplicate unlocks via existence check
- Creates Achievement object with:
  - `id`: BadgeType identifier (unique key)
  - `name`, `description`, `icon` (emoji)
  - `category`: 'streak' | 'mastery' | 'consistency' | 'milestone'
  - `tier`: optional 'bronze' | 'silver' | 'gold'
  - `unlockedAt`: timestamp
  - `criteria`: type and value for reference

#### `checkAchievements()`
Evaluates all badge criteria:

1. **Daily Streak Achievements** (`streak_7`, `streak_30`, `streak_100`)
   - Checks: consecutive days with reviews
   - Tiers: bronze (7) → silver (30) → gold (100)

2. **Word Count Milestones** (`first_steps_5`, `first_steps_25`, `first_steps_100`)
   - Checks: total words in vocabulary
   - Tiers: bronze (5) → silver (25) → gold (100)

3. **Perfect Session** (`perfect_session`)
   - Checks: any word with consecutive correct reviews > 0
   - Category: mastery

4. **Category Mastery** (`category_master`)
   - Checks: all words in a category have status 'mastered'
   - Creates per-category achievement

5. **Consistency Achievements** (`consistency_7`, `consistency_30`, `consistency_100`)
   - Checks: unique review days count
   - Tiers: bronze (7 days) → silver (30 days) → gold (100 days)

### 5. **Automatic Achievement Checking**
- Added useEffect that watches `words.length` and `isLoaded`
- Calls `checkAchievements()` after each review/word addition
- Prevents unnecessary recalculations

### 6. **Hook Return Object**
Added to return:
```typescript
achievements,
unlockAchievement,
checkAchievements,
```

## Badge Types Reference
```typescript
'streak_7' | 'streak_30' | 'streak_100'           // Daily review streaks
'first_steps_5' | 'first_steps_25' | 'first_steps_100'  // Word count
'perfect_session'                                   // Perfect reviews
'category_master'                                   // Category completion
'consistency_7' | 'consistency_30' | 'consistency_100'   // Review frequency
```

## Data Structure
```typescript
interface Achievement {
  id: BadgeType;
  name: string;
  description: string;
  icon: string;
  category: 'streak' | 'mastery' | 'consistency' | 'milestone';
  tier?: 'bronze' | 'silver' | 'gold';
  unlockedAt: number;
  criteria: { type: string; value: number };
}
```

## Usage in Components
```typescript
const { achievements, checkAchievements } = useVocabulary();

// Get all achievements
achievements.forEach(achievement => {
  console.log(achievement.name, achievement.icon, achievement.unlockedAt);
});

// Manually trigger check (usually happens automatically)
checkAchievements();

// Filter by category
const streakAchievements = achievements.filter(a => a.category === 'streak');
const masterAchievements = achievements.filter(a => a.category === 'mastery');
```

## Design Patterns Used
- **React Hooks**: useState, useEffect, useCallback (matching existing code)
- **localStorage**: Same pattern as words/categories persistence
- **Memoization**: useCallback to prevent unnecessary recalculations
- **TypeScript**: Type-safe Achievement and BadgeType handling
- **Duplicate Prevention**: Checks before unlocking via `achievements.some()`
- **Automatic Triggering**: useEffect watches word changes for auto-checking

## Testing Checklist
- [ ] Add 5+ words → `first_steps_5` unlocks
- [ ] Review words for 7 consecutive days → `streak_7` unlocks
- [ ] Review on 7 different days → `consistency_7` unlocks
- [ ] Master a category (all words status='mastered') → `category_master` unlocks
- [ ] Complete perfect review session → `perfect_session` unlocks
- [ ] Refresh page → achievements persist from localStorage
- [ ] Duplicate unlock prevention works
