# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start development server
npm run build    # Production build
npm run lint     # Run ESLint
```

No test framework is configured.

## Workflow

### Planning
- Enter plan mode for ANY non-trivial task (3+ steps or architectural decisions)
- Write detailed specs upfront; if something goes sideways, STOP and re-plan
- Use subagents to keep the main context window clean — one focused task per subagent

### Task Management
1. Write plan to `tasks/todo.md` with checkable items before starting
2. Check in with user before implementing
3. Mark items complete as you go
4. Add a review section to `tasks/todo.md` when done
5. Update `tasks/lessons.md` after any correction — capture the pattern to avoid repeating it

### Core Principles
- **Simplicity first** — minimal impact, only touch what's necessary
- **No laziness** — find root causes, no temporary fixes, senior developer standards
- **Verification before done** — never mark complete without proving it works; ask "Would a staff engineer approve this?"
- **Demand elegance (balanced)** — pause on non-trivial changes and ask if there's a more elegant way; skip for simple obvious fixes
- **Autonomous bug fixing** — when given a bug report, just fix it; point at logs/errors and resolve them

## Architecture

VocabFlow is an offline-first vocabulary learning PWA. There is no backend — all data lives in the browser's IndexedDB via Dexie.

### Data Layer

- **[src/lib/db.ts](src/lib/db.ts)** — Dexie database with 3 tables: `words`, `reviewSessions`, `appState` (key-value settings)
- **[src/types/index.ts](src/types/index.ts)** — Core types: `Word` (with SRS fields), `Rating` (0–3), `ReviewSession`, `ReviewState`
- **[src/lib/srs.ts](src/lib/srs.ts)** — SM-2 spaced repetition algorithm. `calculateNextReview()` updates `easeFactor`, `interval`, `repetitions`, `nextReviewDate`. Stages: `new` → `learning` (interval ≤6d) → `reviewing` (≤30d) → `mastered` (>30d)

### Hooks (Business Logic)

All data access goes through hooks in [src/hooks/](src/hooks/):

- `useWords({stage?, search?})` / `useDueWords()` — Live Dexie queries
- `useReviewSession` — Session state machine: idle → showing-front → showing-back → complete. Calls `calculateNextReview()` and persists sessions
- `useStats` / `useStreak` — Aggregated metrics from DB
- `useTheme` — Dark/light mode, persisted to localStorage, respects system preference
- `useDictionaryLookup` — Calls the free Dictionary API (`https://api.dictionaryapi.dev/api/v2/entries/en`)

### Routing / Pages

Next.js App Router. Pages are thin — they delegate to hooks and components:

| Route | Purpose |
|-------|---------|
| `/` | Dashboard: due count, streak, quick stats |
| `/add` | Dictionary lookup + word form |
| `/review` | Spaced repetition review interface |
| `/words` | Browse/search/filter words by SRS stage |
| `/stats` | Progress metrics and streak calendar |
| `/settings` | JSON export/import, clear all data |

### Component Structure

- `src/components/layout/` — `Header`, `BottomNav`, `PageShell`
- `src/components/ui/` — Reusable primitives: `Button`, `Card`, `Modal`, `Toast`, `Badge`, `LoadingSpinner`, `EmptyState`
- `src/components/words/` — `WordForm`, `WordCard`, `WordDetail`, `WordSearchInput`
- `src/components/review/` — `ReviewCard`, `RatingButtons`, `ReviewProgress`, `SessionSummary`
- `src/components/stats/` — `StatsOverview`, `StreakDisplay`, `LevelDistribution`

The root layout chain: `layout.tsx` → `client-layout.tsx` (ToastProvider, Header, BottomNav).

### PWA

Configured via `next-pwa` in `next.config.mjs`. Service worker is disabled in dev. Manifest and icons live in `public/`.

### Styling

Tailwind CSS with dark mode via the `dark` class strategy. The `cn()` utility in [src/lib/utils.ts](src/lib/utils.ts) handles conditional class merging.
