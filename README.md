# VocabFlow

A personal vocabulary learning system powered by **spaced repetition** and **active recall**. Built with React 19, TypeScript, and the Gemini AI API.

## Features

- **Spaced Repetition (SRS)** — A simplified SuperMemo-2 algorithm schedules reviews at optimal intervals to maximize retention.
- **AI Magic Fill** — Automatically generates definitions, example sentences, and mnemonics using the Gemini API.
- **Review Sessions** — Flashcard-style daily reviews with four rating levels (Again, Hard, Good, Easy).
- **Word Management** — Add, search, and organize your vocabulary. Track each word's status: New → Learning → Mastered.
- **Data Portability** — Export your vocabulary as JSON for backup. Clear all data from Settings.

## Getting Started

**Prerequisites:** [Node.js](https://nodejs.org/) (v18+)

1. Install dependencies:
   ```sh
   npm install
   ```
2. Create a `.env.local` file and set your Gemini API key:
   ```
   GEMINI_API_KEY="your-api-key-here"
   ```
3. Start the development server:
   ```sh
   npm run dev
   ```
4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Scripts

| Command           | Description                          |
| ----------------- | ------------------------------------ |
| `npm run dev`     | Start dev server on port 3000        |
| `npm run build`   | Production build via Vite            |
| `npm run preview` | Preview production build locally     |
| `npm run lint`    | Type-check with `tsc --noEmit`       |
| `npm run clean`   | Remove `dist/` directory             |

## Tech Stack

- **React 19** with TypeScript
- **Vite** for build tooling
- **Tailwind CSS v4** for styling
- **motion/react** for animations
- **lucide-react** for icons
- **@google/genai** for Gemini AI integration
