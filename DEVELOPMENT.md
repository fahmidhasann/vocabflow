# VocabFlow Development Guide

**Version:** 1.0  
**Last Updated:** 2026-03-12  
**Collaborators:** Fahmid Hasan Taohid, Leo (AI Assistant)

---

## 📚 Project Overview

**VocabFlow** is a React 19 + TypeScript single-page application for vocabulary learning using **spaced repetition** and **AI enhancement**.

### Core Purpose
Help users master vocabulary through:
- Adaptive review scheduling (SuperMemo-2 algorithm)
- AI-powered word enhancement (Gemini API)
- Flashcard-style reviews
- Progress tracking

### Tech Stack
- **Frontend:** React 19, TypeScript 5.8, Vite 6.2
- **Styling:** Tailwind CSS v4
- **Animations:** motion/react
- **Icons:** lucide-react
- **AI:** Google Gemini API (@google/genai v1.29)
- **Storage:** LocalStorage (primary) + Supabase (optional)
- **Build:** Vite with React plugin

### Directory Structure
```
src/
├── components/           # UI Components
│   ├── Layout.tsx       # Navigation wrapper (sidebar + mobile nav)
│   ├── MobileHeader.tsx # Mobile top bar with hamburger + dark mode toggle
│   ├── MobileDrawer.tsx # Slide-out drawer menu (motion/react animation)
│   ├── StickyActionBar.tsx # Mobile sticky footer with [Add Word] + [Settings]
│   ├── Dashboard.tsx    # Stats & quick actions
│   ├── ReviewSession.tsx# Flashcard review interface
│   ├── AddWordForm.tsx  # Add new word form
│   ├── WordList.tsx     # Browse vocabulary
│   └── Settings.tsx     # Config & data export
├── hooks/               # Custom React hooks
│   ├── useVocabulary.ts # State management + SRS logic
│   └── useTheme.ts      # Dark mode management
├── services/            # External integrations
│   └── geminiService.ts # Gemini API wrapper
├── lib/                 # Utilities
│   └── supabase.ts      # Supabase client config
├── types.ts             # TypeScript interfaces
├── App.tsx              # Root component
└── main.tsx             # Entry point
```

---

## 🏗️ Architecture & Design Patterns

### State Management
**Single `useVocabulary` Hook** — Manages all vocabulary data.
- **No Context API yet** — Each component calls `useVocabulary()` independently
- **Storage:** LocalStorage (always), optional Supabase sync
- **Sync Strategy:** writes to localStorage immediately, async Supabase updates

**Issue:** Multiple hook instances can cause race conditions. Priority fix: wrap with Context API.

### Component Composition
- **Tab-based navigation** (Dashboard, Add, List, Settings)
- **Full-screen review session** isolates distraction
- **Responsive:** Desktop sidebar (≥ 768px), mobile hamburger menu (< 768px)

### Mobile Navigation Architecture (v1.1)

**Breakpoint:** `md` (768px) — Below this, mobile UI applies.

#### New Components

**1. MobileHeader.tsx**
- Fixed top bar (40px with padding)
- Logo: "VocabFlow" + Dark mode toggle + Hamburger menu
- Visible only on mobile (`md:hidden`)
- Icons: Sun, Moon, Menu from lucide-react

**2. MobileDrawer.tsx**
- Slide-out drawer (256px width, w-64)
- Motion/react animation: Spring slide from left
- Backdrop overlay with tap-to-close
- Navigation items with active state highlight
- Only on mobile (`md:hidden`)

**3. StickyActionBar.tsx**
- Fixed bottom sticky bar with [Add Word] (primary) + [Settings] (secondary)
- Emerald primary button, gray secondary
- Respects safe areas (notches)
- Mobile-only (`md:hidden`)

#### Layout Changes

**Mobile (< 768px):**
```
┌─────────────────┐
│ Header (☰ 🌙)   │ ← MobileHeader (pt-16 offset)
├─────────────────┤
│ Main Content    │ ← pb-24 bottom padding
├─────────────────┤
│ [+Add] [Settings]│ ← StickyActionBar
└─────────────────┘
```

**Desktop (≥ 768px):**
- Existing sidebar + main content (unchanged)
- Mobile components hidden

**Key Points:**
- Reclaims ~80px of screen space on mobile
- Drawer animation smooth (spring damping: 25)
- Dark mode toggle in header + sidebar
- No breaking changes to desktop
- All Tailwind breakpoints: sm (640px), md (768px), lg (1024px)

### Data Model

```typescript
// src/types.ts

export type WordStatus = 'new' | 'learning' | 'mastered';

export interface WordEntry {
  id: string;                    // UUID
  word: string;                  // The vocabulary word
  definition: string;            // AI-generated or manual
  context?: string;              // Usage context (optional)
  personalExample: string;       // User's own example sentence
  keyword?: string;              // Mnemonic keyword
  
  // Spaced Repetition Data
  status: WordStatus;            // Lifecycle status
  nextReviewDate: number;        // Timestamp (ms) for next review
  interval: number;              // Days until next review
  easeFactor: number;            // SM2 multiplier (1.3–4.0+)
  consecutiveCorrect: number;    // Streak counter
  createdAt: number;             // Timestamp when added
  lastReviewedAt?: number;       // Timestamp of last review
}

export type ReviewRating = 'again' | 'hard' | 'good' | 'easy';
```

### Spaced Repetition Algorithm (SuperMemo-2 variant)

**Inputs:** Word, review rating (again/hard/good/easy)

**Process:**
```typescript
// in useVocabulary.ts → processReview()

if (rating === 'again') {
  // Wrong answer: restart
  interval = 1
  easeFactor = max(1.3, easeFactor - 0.2)
  consecutiveCorrect = 0
} else {
  // Correct answer
  if (rating === 'hard') {
    easeFactor = max(1.3, easeFactor - 0.15)
    interval = interval === 0 ? 1 : interval * 1.2
  } else if (rating === 'good') {
    interval = interval === 0 ? 1 : interval === 1 ? 4 : interval * easeFactor
  } else if (rating === 'easy') {
    easeFactor += 0.15
    interval = interval === 0 ? 4 : interval * easeFactor * 1.3
  }
  consecutiveCorrect++
}

// Determine status
status = 'learning'
if (interval > 21) status = 'mastered'
if (interval === 0) status = 'new'
```

**Status Thresholds:**
- `new`: interval = 0
- `learning`: 0 < interval ≤ 21
- `mastered`: interval > 21

**Known Issues:**
1. Once status = "mastered", word is never reviewed again (no decay/lapse handling)
2. Status determination has edge case: word with interval=1 shows as "learning" instead of "new"
3. No long-term retention optimization (SuperMemo-2 full version recommended)

### Data Flow

```
User adds word
  ↓
AddWordForm → useVocabulary.addWord()
  ↓
setWords([...prev, newWord])
  ↓
useEffect syncs to localStorage + Supabase (async)
  ↓
Components read from words array

User reviews word
  ↓
ReviewSession → useVocabulary.processReview(id, rating)
  ↓
Algorithm updates interval, easeFactor, status
  ↓
setWords([...map updated word...])
  ↓
useEffect syncs to storage
```

### Gemini API Integration

**File:** `src/services/geminiService.ts`

**Function:** `getWordDetails(word: string) → Promise<WordInfo>`

**Input:** English word (string)

**Output:** Structured JSON
```json
{
  "definition": "Simple, clear definition",
  "personalExample": "Relatable example sentence",
  "keyword": "Mnemonic or memory aid"
}
```

**Usage in AddWordForm:**
```typescript
const [isLoading, setIsLoading] = useState(false);

const handleMagicFill = async () => {
  setIsLoading(true);
  try {
    const details = await getWordDetails(word);
    setFormData({ ...formData, ...details });
  } catch (error) {
    // Show error toast
  } finally {
    setIsLoading(false);
  }
};
```

**Known Issues:**
1. No error handling (can fail silently)
2. No response caching (duplicate requests waste API quota)
3. No rate limiting/retry logic
4. No fallback if API fails

### Supabase Integration (Optional)

**File:** `src/lib/supabase.ts`

**Table Schema:**
```sql
CREATE TABLE words (
  id UUID PRIMARY KEY,
  word TEXT NOT NULL,
  definition TEXT NOT NULL,
  context TEXT,
  personal_example TEXT NOT NULL,
  keyword TEXT,
  status VARCHAR(20) NOT NULL,
  next_review_date BIGINT NOT NULL,
  interval BIGINT NOT NULL,
  ease_factor FLOAT NOT NULL,
  consecutive_correct INTEGER NOT NULL,
  created_at BIGINT NOT NULL,
  last_reviewed_at BIGINT
);
```

**Sync Strategy:**
- Read from Supabase on app load (if configured)
- If no Supabase data, migrate localStorage → Supabase
- Every update written to localStorage + async Supabase

**Status:** Optional (no auth yet, basic insert/update/delete)

---

## 🔧 Development Setup

### Prerequisites
- Node.js 18+
- npm 9+
- `.env.local` with `GEMINI_API_KEY`

### Installation
```bash
npm install
npm run dev  # Runs on http://localhost:3000
```

### Environment Variables
```
GEMINI_API_KEY=your-gemini-api-key
# Optional for Supabase sync:
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-key
```

### Scripts
- `npm run dev` — Dev server (hot reload)
- `npm run build` — Production build
- `npm run preview` — Preview prod build locally
- `npm run lint` — Type-check with tsc
- `npm run clean` — Remove dist/

---

## 🐛 Known Issues & Roadmap

### Critical (Fix First)
- [ ] **State Management:** No Context API—multiple instances can cause race conditions
- [ ] **SRS Edge Case:** Words marked "mastered" never reviewed again (no decay)
- [ ] **Gemini Error Handling:** API failures can be silent

### High Priority (Next Sprint)
- [ ] Category/Deck system for organizing vocabularies
- [ ] Keyboard shortcuts in review (Spacebar, 1-4 for ratings)
- [ ] Analytics dashboard (retention curves, difficulty heatmaps)
- [ ] Synonyms/antonyms from Gemini

### Medium Priority
- [ ] Audio/pronunciation via TTS
- [ ] CSV bulk import
- [ ] Accessibility (ARIA labels, focus management)
- [ ] Error boundaries
- [ ] Caching for Gemini responses

### Low Priority
- [ ] PWA support
- [ ] Multi-language UI (i18n)
- [ ] Test coverage (Vitest + React Testing Library)

---

## ✨ Code Patterns & Conventions

### Component Template
```typescript
import { useCallback, useState } from 'react';
import { useVocabulary } from '../hooks/useVocabulary';
import { SomeIcon } from 'lucide-react';

interface ComponentProps {
  onAction?: () => void;
}

export function MyComponent({ onAction }: ComponentProps) {
  const { words, addWord } = useVocabulary();
  const [state, setState] = useState('');

  const handleAction = useCallback(() => {
    // Logic here
    onAction?.();
  }, [onAction]);

  return (
    <div className="p-4 rounded-lg bg-white dark:bg-zinc-900">
      <h2 className="text-lg font-semibold">Title</h2>
      <button onClick={handleAction}>Action</button>
    </div>
  );
}
```

### Styling
- **Framework:** Tailwind CSS v4
- **Colors:** `emerald-*` (primary), `zinc-*` (neutral)
- **Spacing:** Follow Tailwind scale (p-4, mb-6, etc.)
- **Dark mode:** Prefix with `dark:` (e.g., `dark:bg-zinc-900`)
- **Animations:** Use `motion/react` for page transitions

### TypeScript
- Strict mode enabled
- Explicit return types on all functions
- Props interfaces for all components
- Use `useCallback` for event handlers

### Error Handling
```typescript
try {
  const result = await someAsyncFunction();
} catch (error) {
  console.error('Descriptive error message', error);
  // Show user feedback (toast, alert, etc.)
}
```

---

## 📋 Task Specifications for Improvements

### Task 1: State Management Fix (Context API)

**Objective:** Prevent race conditions and state inconsistencies.

**Changes:**
1. Create `src/contexts/VocabularyContext.tsx`
   ```typescript
   import { createContext, ReactNode, useContext } from 'react';
   import { useVocabulary as useVocabularyHook } from '../hooks/useVocabulary';

   type VocabularyContextType = ReturnType<typeof useVocabularyHook>;
   const VocabularyContext = createContext<VocabularyContextType | null>(null);

   export function VocabularyProvider({ children }: { children: ReactNode }) {
     const vocabulary = useVocabularyHook();
     return (
       <VocabularyContext.Provider value={vocabulary}>
         {children}
       </VocabularyContext.Provider>
     );
   }

   export function useVocabulary() {
     const context = useContext(VocabularyContext);
     if (!context) throw new Error('useVocabulary must be used within VocabularyProvider');
     return context;
   }
   ```

2. Wrap `App` in `src/App.tsx`:
   ```typescript
   <VocabularyProvider>
     <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
       {/* ... */}
     </Layout>
   </VocabularyProvider>
   ```

3. All components use `useVocabulary()` from the context (no change needed—same signature)

**Acceptance Criteria:**
- Single source of truth for vocabulary state
- No race conditions on simultaneous updates
- localStorage sync still works
- All components receive same state instance

**Time Estimate:** 1 day

---

### Task 2: Keyboard Shortcuts in Review

**Objective:** Speed up review sessions with keyboard controls.

**Changes in ReviewSession.tsx:**
```typescript
useEffect(() => {
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.code === 'Space') {
      e.preventDefault();
      setShowAnswer(!showAnswer);
    } else if (e.key === '1') {
      handleRating('again');
    } else if (e.key === '2') {
      handleRating('hard');
    } else if (e.key === '3') {
      handleRating('good');
    } else if (e.key === '4') {
      handleRating('easy');
    } else if (e.key === 'n' || e.key === 'N') {
      handleNext();
    }
  };

  window.addEventListener('keydown', handleKeyDown);
  return () => window.removeEventListener('keydown', handleKeyDown);
}, [showAnswer, currentWord]);
```

**UI Update:** Add hint text below buttons:
```typescript
<button
  onClick={() => handleRating('easy')}
  className="..."
>
  Easy <span className="text-xs text-zinc-400">(4)</span>
</button>
```

**Acceptance Criteria:**
- Spacebar flips card
- 1/2/3/4 rate (again/hard/good/easy)
- n advances to next word
- Hints visible to users
- Works on keyboard-only flow

**Time Estimate:** 2 hours

---

### Task 3: Category/Deck System

**Objective:** Enable word organization by topic, language, or study path.

**Changes:**

1. **Update types.ts:**
   ```typescript
   export interface Category {
     id: string;
     name: string;
     description?: string;
     color?: string; // e.g., "emerald", "blue", "red"
     createdAt: number;
   }

   export interface WordEntry {
     // ... existing fields
     categoryId?: string; // NEW
   }
   ```

2. **Add to useVocabulary hook:**
   ```typescript
   const [categories, setCategories] = useState<Category[]>([]);

   const addCategory = useCallback((name: string, description?: string) => {
     const category: Category = {
       id: crypto.randomUUID(),
       name,
       description,
       createdAt: Date.now(),
     };
     setCategories((prev) => [...prev, category]);
     // Sync to localStorage + Supabase
   }, []);

   const getWordsByCategory = useCallback((categoryId: string) => {
     return words.filter((w) => w.categoryId === categoryId);
   }, [words]);

   const getCategoryStats = useCallback((categoryId: string) => {
     const wordsInCategory = getWordsByCategory(categoryId);
     return {
       total: wordsInCategory.length,
       mastered: wordsInCategory.filter((w) => w.status === 'mastered').length,
       learning: wordsInCategory.filter((w) => w.status === 'learning').length,
     };
   }, [words]);
   ```

3. **Create CategoryManager component** with add/edit/delete UI

4. **Filter reviews by category** in ReviewSession (optional selector)

5. **Update Dashboard** to show per-category stats

**Acceptance Criteria:**
- Create/read/update/delete categories
- Assign words to categories
- Filter reviews by category
- Category stats on Dashboard
- Supabase sync (if using)

**Time Estimate:** 2-3 days

---

### Task 4: Keyboard Shortcuts (Quick Win)

See Task 2 above.

---

### Task 5: Analytics Dashboard

**Objective:** Show learning progress, retention curves, difficulty heatmaps.

**New Route:** `/analytics` (or new tab "Analytics")

**Metrics to Display:**
1. **Weekly Stats**
   - Words reviewed
   - Review accuracy (% of "good" + "easy")
   - Streak (consecutive days reviewed)

2. **Forgetting Curve Visualization**
   - X-axis: Days since last review
   - Y-axis: Count of words
   - Words at risk = high interval + low ease factor

3. **Status Breakdown** (pie or bar chart)
   - New, Learning, Mastered counts

4. **Time-to-Mastery** (average days from new → mastered)

5. **Difficulty Heatmap** (if categories exist)
   - Category → avg ease factor

**Libraries to Use:**
- `recharts` (simple charts, easy integration)
- or canvas/SVG if minimal dependencies preferred

**Acceptance Criteria:**
- All metrics display correctly
- Charts are responsive
- Data is accurate (cross-check with raw words)
- Smooth animations

**Time Estimate:** 1-2 days for basic, 3-4 days for advanced

---

### Task 6: SRS Algorithm Refinement

**Objective:** Fix mastery decay and edge cases.

**Changes in processReview():**
1. **Mastery Decay:** Words mastered >90 days ago should re-enter "learning" phase
   ```typescript
   const daysSinceMastery = (now - word.lastReviewedAt) / (24 * 60 * 60 * 1000);
   if (status === 'mastered' && daysSinceMastery > 90) {
     status = 'learning';
     interval = Math.max(1, interval * 0.5); // Reduce interval
   }
   ```

2. **Fix Status Edge Case:**
   ```typescript
   let status: WordStatus = 'learning';
   if (interval === 0) status = 'new';
   else if (interval > 21) status = 'mastered';
   ```

3. **Ease Factor Bounds:**
   - Min: 1.3 (already done)
   - Max: 2.8 (recommended for stability)

4. **Consecutive Correct Tracking:** Reset on "again" (already done)

**Acceptance Criteria:**
- Words decay from "mastered" after 90 days
- Status transitions correct
- Ease factor within 1.3–2.8
- Backward compatible with existing data

**Time Estimate:** 2 days (including testing)

---

## 🚀 Deployment & Workflow

### Branching Strategy
- `main` — Production branch (tested, stable)
- `develop` — Integration branch
- `feature/*` — Individual feature branches

### Commit Convention
```
<type>(<scope>): <subject>

<body>

<footer>
```

Examples:
- `feat(srs): implement mastery decay after 90 days`
- `fix(state): add VocabularyContext to prevent race conditions`
- `refactor(components): extract KeyboardHandler into custom hook`

### Pull Request Checklist
- [ ] All TypeScript checks pass (`npm run lint`)
- [ ] Features work locally (`npm run dev`)
- [ ] No console errors/warnings
- [ ] Code follows patterns (see above)
- [ ] Commits are clean and descriptive

### Building & Hosting
```bash
npm run build  # Creates dist/
```

Deploy `dist/` to:
- GitHub Pages
- Vercel
- Netlify
- Self-hosted server

---

## 📞 Communication

**When stuck or have questions:**
1. Check this guide first (DEVELOPMENT.md)
2. Read the relevant component/hook source
3. Ask Leo or Fahmid in the main session

**Reporting issues:**
- **Bug:** "In ReviewSession, pressing Space twice doesn't re-hide the card"
- **Question:** "Should categories be stored in Supabase or just localStorage?"
- **Suggestion:** "Consider adding a 'custom difficulty' field to words"

---

## 🎯 Success Metrics

A task is "done" when:
1. ✅ Code matches task spec
2. ✅ TypeScript passes (`npm run lint`)
3. ✅ Feature works locally
4. ✅ No console errors
5. ✅ Follows code patterns
6. ✅ Commit message is clear

---

**Let's build something great.** 🚀
