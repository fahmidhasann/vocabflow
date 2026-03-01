# Copilot Instructions for VocabFlow

## Build & Run Commands

- `npm install` — install dependencies
- `npm run dev` — start dev server on port 3000
- `npm run build` — production build via Vite
- `npm run lint` — type-check with `tsc --noEmit` (no separate linter)
- `npm run clean` — remove `dist/`

There are no tests configured in this project.

## Environment

Requires a `GEMINI_API_KEY` environment variable. Set it in `.env.local` (gitignored). Vite injects it at build time via `process.env.GEMINI_API_KEY` (defined in `vite.config.ts`).

## Architecture

React 19 SPA built with Vite and TypeScript. Originally scaffolded from Google AI Studio.

**State management:** No external state library. All vocabulary data lives in a single `useVocabulary` custom hook (`src/hooks/useVocabulary.ts`) that reads/writes `localStorage` under the key `vocabflow_words`. Every component that needs word data calls `useVocabulary()` independently — there is no shared context provider, so each call creates its own state instance synced via `localStorage`.

**Spaced repetition (SRS):** The core learning algorithm is a simplified SuperMemo-2 implementation inside `useVocabulary.processReview()`. Words progress through statuses: `new` → `learning` → `mastered` (interval > 21 days). Review ratings are `again | hard | good | easy`, each adjusting the ease factor and interval differently.

**AI integration:** `src/services/geminiService.ts` calls the Gemini API (`gemini-3-flash-preview` model) with a structured JSON schema to auto-fill word definitions, examples, and mnemonics. Used by the "AI Magic Fill" button in `AddWordForm`.

**Routing:** Tab-based navigation managed by `useState` in `App.tsx` (`activeTab` string), not a router library. Tabs: `dashboard`, `add`, `list`, `settings`. The review session is a separate full-screen mode toggled by `isReviewing` state.

## Key Conventions

- **Styling:** Tailwind CSS v4 via the `@tailwindcss/vite` plugin. Custom fonts (Inter + Playfair Display) defined in `src/index.css` using `@theme`. Emerald is the primary accent color; zinc for neutrals.
- **Animations:** Use `motion/react` (not `framer-motion`) for all component animations.
- **Icons:** `lucide-react` for all icons.
- **Path alias:** `@/*` maps to the project root (configured in both `tsconfig.json` and `vite.config.ts`).
- **Types:** Core domain types (`WordEntry`, `WordStatus`, `ReviewRating`) are in `src/types.ts`.
- **Component pattern:** Functional components with named exports. No default exports except `App`. Sub-components (e.g., `StatCard`, `RatingButton`, `WordCard`) are co-located in the same file as their parent.
