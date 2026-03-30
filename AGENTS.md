# Repository Guidelines

## Project Structure & Module Organization
`src/app/` holds App Router pages, layouts, and global styles. Keep route files thin and push logic into `src/hooks/` and `src/lib/`. Reusable UI lives in `src/components/` by domain (`layout/`, `review/`, `stats/`, `ui/`, `words/`). Shared types are in `src/types/`. Public PWA assets live in `public/`; design source assets live in `assets/`. Supabase config, migrations, and Edge Functions live in `supabase/`. The Capacitor Android shell is in `android/` and should only be touched when mobile-specific changes are required.

## Build, Test, and Development Commands
Use `npm run dev` for the local web app at `http://localhost:3000`. Use `npm run build` to verify the production Next.js build and `npm run start` to serve it. Run `npm run lint` before opening a PR. Run `npm run test` for the full Vitest suite and `npm run test:watch` while iterating. Mobile contributors should use `npm run build:mobile` to export static assets, `npm run cap:sync` to copy them into Capacitor, and `npm run mobile:android` to open the Android project after a sync.

## Coding Style & Naming Conventions
This repo uses TypeScript with `strict` mode and the `@/*` import alias. Follow the existing style: 2-space indentation, single quotes in most TS files, and semicolons where present. Components, hooks, and types use PascalCase, `useCamelCase`, and PascalCase respectively; utility modules use lowercase filenames such as `srs.ts` or `db.ts`. Prefer server/client boundaries that match the current App Router patterns. Linting is enforced through `next lint` with `next/core-web-vitals` and `next/typescript`.

## Testing Guidelines
Vitest runs in a Node environment. Place tests next to the relevant code under `__tests__/`, following the existing pattern such as `src/lib/__tests__/srs.test.ts`. Add focused unit tests for business logic changes, especially around SRS calculations, data mapping, and utility functions. Run `npm run test` and `npm run lint` together before submitting.

## Commit & Pull Request Guidelines
Recent history favors short imperative subjects, often with Conventional Commit prefixes like `feat:` and `refactor:`. Keep commits scoped and descriptive, for example `feat: add streak summary card`. PRs should explain user-visible changes, note any Supabase or Android follow-up, link related issues, and include screenshots for UI work. Call out new environment variables, migrations, or manual verification steps explicitly.

## Security & Configuration Tips
Do not commit secrets or `.env` files. Manage database changes through Supabase migrations, not the dashboard. For controlled frontend releases, use the Vercel CLI rather than relying on implicit deploys.
