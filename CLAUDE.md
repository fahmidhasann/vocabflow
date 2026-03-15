# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start development server
npm run build    # Production build
npm run lint     # Run ESLint
```

No test framework is configured.

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
