# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Start development server
npm run build        # Production build
npm run lint         # Run ESLint
npm run test         # Vitest run once
npm run test:watch   # Vitest watch mode
```

## Architecture

VocabFlow is an offline-first vocabulary learning PWA built with Next.js 14 (App Router), TypeScript, and Tailwind CSS. Data is stored in Supabase (PostgreSQL) with Google OAuth authentication.

### Data Layer

- **[src/lib/supabase/](src/lib/supabase/)** — Client (`client.ts`) and server (`server.ts`) Supabase factories; `mappers.ts` converts between DB snake_case rows and app camelCase types (`WordRow` ↔ `Word`, etc.)
- **[src/types/index.ts](src/types/index.ts)** — Core types: `Word` (with SRS fields), `Rating` (0–3), `ReviewSession`, `ReviewSessionState` (state machine), `SrsStage`
- **[src/lib/srs.ts](src/lib/srs.ts)** — SM-2 spaced repetition algorithm. `calculateNextReview()` updates `easeFactor`, `interval`, `repetitions`, `nextReviewDate`. Stages: `new` → `learning` (interval ≤6d) → `reviewing` (≤30d) → `mastered` (>30d)

### Hooks (Business Logic)

All data access goes through hooks in [src/hooks/](src/hooks/):

- `useWords({stage?, search?})` / `useDueWords()` — Supabase queries with optional filters
- `useReviewSession` — Session state machine: idle → showing-front → showing-back → complete. Calls `calculateNextReview()` and persists sessions
- `useStats` / `useStreak` — Aggregated metrics from DB
- `useTheme` — Dark/light mode, persisted to localStorage, respects system preference
- `useDictionaryLookup` — Calls the free Dictionary API (`https://api.dictionaryapi.dev/api/v2/entries/en`)
- `useUser` — Current auth user + loading state, subscribes to `onAuthStateChange`

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
| `/login` | Google OAuth sign-in |

Auth middleware ([src/middleware.ts](src/middleware.ts)) guards all routes except `/login` and `/auth/callback`.

### Component Structure

- `src/components/layout/` — `Header`, `BottomNav`, `PageShell`
- `src/components/ui/` — Reusable primitives: `Button`, `Card`, `Modal`, `Toast`, `Badge`, `LoadingSpinner`, `EmptyState`
- `src/components/words/` — `WordForm`, `WordCard`, `WordDetail`, `WordSearchInput`
- `src/components/review/` — `ReviewCard`, `RatingButtons`, `ReviewProgress`, `SessionSummary`
- `src/components/stats/` — `StatsOverview`, `StreakDisplay`, `LevelDistribution`

The root layout chain: `layout.tsx` → `client-layout.tsx` (ToastProvider, Header, BottomNav).

### Styling — Oxbridge Design System

Tailwind CSS with dark mode via the `dark` class strategy. Design tokens are CSS custom properties in [src/app/globals.css](src/app/globals.css), exposed through Tailwind as `ox-*` color aliases (e.g., `ox-bg`, `ox-accent`, `ox-ink-deep`).

**Fonts:** Playfair Display (headings/word titles), Source Serif 4 (body/definitions), JetBrains Mono (labels/badges/buttons, uppercase + letter-spacing). Configured as `font-display`, `font-serif`, `font-mono` in Tailwind.

The `cn()` utility in [src/lib/utils.ts](src/lib/utils.ts) handles conditional class merging.

### PWA

Configured via `next-pwa` in [next.config.mjs](next.config.mjs). Service worker is disabled in dev. Manifest and icons live in `public/`.

### Testing

Vitest tests live alongside source in `src/lib/__tests__/`. Current coverage: SRS algorithm (47 tests) and utility functions (22 tests). No component tests yet.
