# VocabFlow — Oxbridge Visual Overhaul Design Spec

**Date:** 2026-03-22
**Approach:** Component Refresh (Option B)
**Aesthetic:** Oxbridge — warm parchment, serif typography, amber/gold accent
**Theme:** Light-mode primary, dark mode supported
**Scope:** Design tokens + all core UI components. Page routing and data layer unchanged.

> **Data layer note:** The codebase has been migrated from Dexie/IndexedDB to Supabase (see commit `7f35777`). All references to the data layer in this spec refer to Supabase hooks. `CLAUDE.md` architecture description is outdated on this point.

---

## 1. Design Direction

The Oxbridge aesthetic treats VocabFlow as a scholarly instrument — unhurried, typographically rich, and warm. It draws from the visual language of premium dictionaries, academic journals, and leather-bound notebooks.

**Key principles:**
- Typography leads — serif fonts carry hierarchy, not color or scale alone
- Warmth over coolness — parchment backgrounds, amber accents, ink-brown text
- Restraint in motion — transitions exist to orient, not to entertain
- Monospace for metadata — labels, badges, and buttons use JetBrains Mono for precise contrast against the serifs

---

## 2. Colour Palette

### Light Mode

| Token | Hex | Usage |
|-------|-----|-------|
| `--color-bg` | `#f5f0e8` | Page background (parchment) |
| `--color-bg-dark` | `#ede6d6` | Slightly deeper parchment, hover states |
| `--color-surface` | `#ffffff` | Card and component backgrounds |
| `--color-border` | `#d4c5a9` | All borders, dividers |
| `--color-muted` | `#8b7355` | Secondary text, labels, placeholders |
| `--color-ink` | `#4a3728` | Body text |
| `--color-ink-deep` | `#1a1208` | Headings, primary text |
| `--color-accent` | `#8b6914` | Primary accent (amber) — buttons, active states, key numbers |
| `--color-accent-light` | `#c4a84a` | Lighter amber — streak dots, highlight tints |
| `--color-paper` | `#f8f3e8` | Warm white for review card backgrounds |

### Dark Mode

| Token | Hex | Usage |
|-------|-----|-------|
| `--color-bg` | `#1c1710` | Page background (deep walnut) |
| `--color-bg-dark` | `#28210f` | Elevated surfaces |
| `--color-surface` | `#28210f` | Card backgrounds |
| `--color-border` | `#3a3020` | Borders |
| `--color-muted` | `#8b7355` | Secondary text (same as light) |
| `--color-ink` | `#c8b898` | Body text |
| `--color-ink-deep` | `#e8dcc8` | Headings, primary text |
| `--color-accent` | `#c4a84a` | Lighter amber reads better on dark |
| `--color-accent-light` | `#e8c870` | Highlight tints |
| `--color-paper` | `#2a2215` | Review card background in dark mode |

### SRS Stage Colours (shared light/dark)

| Stage | Background | Text | Border |
|-------|-----------|------|--------|
| New | `#e8e4dc` | `#6b6358` | `#c8bfaf` |
| Learning | `#fff4e0` | `#8b6914` | `#e8c870` |
| Reviewing | `#e8f0f8` | `#2a5a8a` | `#a0c0e0` |
| Mastered | `#e8f4ec` | `#2a6840` | `#90c8a0` |

### Rating Colours (outlined buttons)

| Rating | Border | Text |
|--------|--------|------|
| Again (0) | `#c97070` | `#8b2020` |
| Hard (1) | `#c4914a` | `#7a5520` |
| Good (2) | `#6aab7a` | `#2a6840` |
| Easy (3) | `#5a90c0` | `#1a4a70` |

---

## 3. Typography

Three font families. **Loading strategy: `next/font/google`** (not raw `<link>` tags). This avoids FOUT, enables automatic subsetting, and integrates with Next.js 14 App Router via CSS variables passed through the root layout.

Implementation in `src/app/layout.tsx`:
```tsx
import { Playfair_Display, Source_Serif_4, JetBrains_Mono } from 'next/font/google'

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  weight: ['400', '600', '700'],
  style: ['normal', 'italic'],
})
const sourceSerif = Source_Serif_4({
  subsets: ['latin'],
  variable: '--font-source-serif',
  weight: ['300', '400', '600'],
  style: ['normal', 'italic'],
  axes: ['opsz'],
})
const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains',
  weight: ['400', '500'],
})

// Apply to <html>:
// className={`${playfair.variable} ${sourceSerif.variable} ${jetbrainsMono.variable}`}
```

Then in CSS:
```css
body { font-family: var(--font-source-serif), Georgia, serif; }
.font-display { font-family: var(--font-playfair), Georgia, serif; }
.font-mono-label { font-family: var(--font-jetbrains), monospace; }
```

### Playfair Display
- **Role:** Display — word headings, page titles, hero numbers
- **Weights used:** 600, 700; italic variant for section titles
- **Usage:** `ReviewCard` word, `WordCard` word, `PageShell` title, Dashboard due-count label

### Source Serif 4
- **Role:** Reading — definitions, body text, phonetics, example sentences
- **Weights used:** 300 (italic for phonetics), 400 (body), 600 (emphasis)
- **Variable font** — optical size `opsz` 8–60

### JetBrains Mono
- **Role:** Metadata — badges, buttons, nav labels, filter chips, all-caps labels
- **Weights used:** 400, 500
- **Always paired with:** `letter-spacing: 1.5–2px`, `text-transform: uppercase` for labels; `letter-spacing: 1px` for buttons

### Type Scale

| Element | Font | Size | Weight | Notes |
|---------|------|------|--------|-------|
| Word (review/detail) | Playfair Display | 34–40px | 700 | `letter-spacing: -0.5px` |
| Word (card list) | Playfair Display | 16–22px | 600 | |
| Page title | Playfair Display | 24–28px | 700 | |
| Hero number (due count) | Playfair Display | 52px | 700 | amber colour |
| Stat numbers | Playfair Display | 22px | 600 | |
| Body / definition | Source Serif 4 | 13–15px | 400 | `line-height: 1.7` |
| Phonetic (WordCard) | Source Serif 4 | 11px | 300 italic | muted colour |
| Phonetic (ReviewCard / WordDetail) | Source Serif 4 | 13px | 300 italic | muted colour |
| Example sentence | Source Serif 4 | 13px | 400 italic | muted colour |
| Section labels | JetBrains Mono | 9–10px | 400 | `uppercase`, `letter-spacing: 2px` |
| Buttons | JetBrains Mono | 10–11px | 500 | `uppercase`, `letter-spacing: 1.5px` |
| Badges | JetBrains Mono | 8–9px | 400 | `uppercase`, `letter-spacing: 1px` |
| Nav labels | JetBrains Mono | 8–9px | 400 | `uppercase`, `letter-spacing: 1px` |

---

## 4. Tailwind Configuration

Tokens are expressed as both CSS custom properties (for use in arbitrary CSS) and Tailwind `theme.extend` colour aliases (for use in Tailwind utility classes). This is the bridge pattern:

```ts
// tailwind.config.ts
theme: {
  extend: {
    colors: {
      'ox-bg':           'var(--color-bg)',
      'ox-bg-dark':      'var(--color-bg-dark)',
      'ox-surface':      'var(--color-surface)',
      'ox-border':       'var(--color-border)',
      'ox-muted':        'var(--color-muted)',
      'ox-ink':          'var(--color-ink)',
      'ox-ink-deep':     'var(--color-ink-deep)',
      'ox-accent':       'var(--color-accent)',
      'ox-accent-light': 'var(--color-accent-light)',
      'ox-paper':        'var(--color-paper)',
    },
    fontFamily: {
      display: ['var(--font-playfair)', 'Georgia', 'serif'],
      serif:   ['var(--font-source-serif)', 'Georgia', 'serif'],
      mono:    ['var(--font-jetbrains)', 'monospace'],
    },
  },
}
```

Usage in components: `bg-ox-surface`, `text-ox-accent`, `border-ox-border`, `font-display`, etc. Dark mode works automatically because the CSS variables switch under `.dark {}`.

---

## 5. Components

All components are rebuilt from scratch using the Oxbridge tokens. No external UI library. Existing component files are replaced in-place.

### 5.1 `Button`

**Variants:**
- `primary` — filled amber (`--color-accent`), white text, `border-radius: 3px`
- `secondary` — transparent, amber border, ink-deep text
- `ghost` — transparent, border colour, muted text
- `danger` — transparent, red-toned border and text

**Shared styles:** JetBrains Mono, 10–11px, uppercase, `letter-spacing: 1.5px`, `padding: 9px 20px`, `border-radius: 3px`

**Sizes:** `sm` (8px 14px), `md` (9px 20px, default), `lg` (11px 28px)

**Motion:** `transition: background 0.15s, border-color 0.15s, opacity 0.15s`

---

### 5.2 `Badge`

Single component with `stage: 'new' | 'learning' | 'reviewing' | 'mastered'` prop.

**Implementation:** Inline the Oxbridge colour values directly in the component using a lookup object — do not depend on or modify `src/lib/constants`. The existing constants file (`SRS_STAGE_LABELS`, `SRS_STAGE_COLORS`) is used by the SRS hooks and must not be changed. Badge renders its own colour map:

```ts
const BADGE_STYLES: Record<Stage, { bg: string; text: string; border: string }> = {
  new:       { bg: '#e8e4dc', text: '#6b6358', border: '#c8bfaf' },
  learning:  { bg: '#fff4e0', text: '#8b6914', border: '#e8c870' },
  reviewing: { bg: '#e8f0f8', text: '#2a5a8a', border: '#a0c0e0' },
  mastered:  { bg: '#e8f4ec', text: '#2a6840', border: '#90c8a0' },
}
```

**Shared styles:** JetBrains Mono, 8–9px, uppercase, `letter-spacing: 1px`, `padding: 3px 8–10px`, `border-radius: 2px`, `border: 1px solid`

---

### 5.3 `Card`

Replaces the current generic Card primitive.

- Background: `--color-surface`
- Border: `1px solid var(--color-border)`
- Border radius: `8px` (was `rounded-xl` = 12px — slightly tighter)
- Shadow: `0 2px 8px rgba(26,18,8,0.06)` (warm-toned shadow, not gray)
- Optional `noPadding` prop for custom inner layouts

---

### 5.4 `WordCard`

Word list item card.

**Layout:** horizontal flex, word+phonetic+definition left, badge right
**Word:** Playfair Display 16px 600
**Phonetic:** Source Serif 4 11px 300 italic, muted
**Definition:** Source Serif 4 11px italic, muted, `line-height: 1.4`, truncated to 1 line (`overflow: hidden; text-overflow: ellipsis; white-space: nowrap`)
**Definition left-border:** `2px solid var(--color-border)`, `padding-left: 10px`
**Hover:** border colour shifts to `--color-accent`, `transition: border-color 0.15s`

---

### 5.5 `ReviewCard`

The SRS flashcard component (replaces 3D flip).

**Design decision:** Remove the CSS 3D flip. Replace with a **fade/slide reveal** — the definition section fades in below the word when the user taps. This is more legible, works better on varied content lengths, and suits the Oxbridge aesthetic.

**Front state:**
- Background: `--color-paper` (`#f8f3e8`)
- Border: `1px solid var(--color-border)`
- Border radius: `8px`
- Shadow: `0 4px 20px rgba(26,18,8,0.07)`
- Word: Playfair Display 34–40px 700, centred
- Phonetic: Source Serif 4 13px 300 italic, muted, centred
- Hint: JetBrains Mono 9px uppercase `TAP TO REVEAL`, centred, very muted

**Revealed state (definition visible):**
- Definition section fades in with `opacity 0→1, translateY 6px→0`, `250ms ease-out`
- A `1px solid var(--color-border)` divider separates the word area from the definition area
- **Multiple meanings:** Render **all meanings** from `word.meanings`. Each meaning is a block with:
  - Part of speech: JetBrains Mono 9px uppercase label
  - Definition: Source Serif 4 14px `line-height: 1.7`
  - Example (if present): Source Serif 4 13px italic muted, indented
- If there are more than 3 meanings, show the first 3 and a muted "and N more…" label in Source Serif 4 italic. No truncation of meanings that are shown.
- The card is scrollable vertically when content overflows (`overflow-y: auto`, `max-height` constrained by viewport)

---

### 5.6 `RatingButtons`

2×2 grid below the revealed review card.

- All outlined (transparent background), `border: 1.5px solid`, `border-radius: 4px`
- Uses rating colour tokens (Again/Hard/Good/Easy)
- Label: JetBrains Mono 10px uppercase
- Interval: Source Serif 4 10px italic, muted
- Hover: subtle background tint matching border colour at 8% opacity

---

### 5.7 `ReviewProgress`

Thin progress bar above the review card.

- Track: `3–4px` height, `background: var(--color-border)`, `border-radius: 2px`
- Fill: `background: var(--color-accent)`, animated `width` transition `300ms ease`
- Meta row above: JetBrains Mono 9px, "Progress" left / "X / Y" right, muted

---

### 5.8 `Header`

Sticky top header.

- Background: `rgba(245,240,232,0.96)` + `backdrop-filter: blur(8px)`
- Border-bottom: `1px solid var(--color-border)`
- Logo: Playfair Display 16px 700 italic, ink-deep
- Right slot: theme toggle + user avatar (unchanged functionally)
- Dark mode: background `rgba(28,23,16,0.96)`

---

### 5.9 `BottomNav`

Fixed bottom navigation.

- Background: `rgba(245,240,232,0.97)` + `backdrop-filter: blur(8px)`
- Border-top: `1px solid var(--color-border)`
- Icons: replaced with clean SVG strokes (same paths, but `stroke-width: 1.5` for a lighter feel)
- Labels: JetBrains Mono 8–9px uppercase
- Active state: label and icon colour `--color-accent`
- Inactive: `--color-muted`

---

### 5.10 `PageShell`

Token and font update. No structural change.

- Page title (when rendered): Playfair Display 24px 700
- Background passes through to `--color-bg`
- Bottom padding unchanged (`pb-24` for bottom nav clearance)

---

### 5.11 `ThemeToggle`

Token update only. No structural or functional change.

- Icon colour: `--color-muted` (inactive), `--color-accent` (active/hover)
- No background fill — icon only

---

### 5.12 `WordSearchInput`

Token and font update.

- Input: Source Serif 4 14px, parchment background (`--color-bg`), border `--color-border`
- Focus ring: `2px solid var(--color-accent)`, `outline: none`
- Placeholder text: `--color-muted`, italic
- Search/Lookup button: `primary` Button variant

---

### 5.13 `StatsOverview`, `StreakDisplay`, `LevelDistribution`

Token updates only — no structural changes.

- `StreakDisplay` dots: `border-radius: 2px` (square-ish, not circular), active dots use `--color-accent-light`, inactive use `--color-bg-dark`
- `LevelDistribution` bars: `height: 4px`, same thin-bar treatment as ReviewProgress
- `StatsOverview` numbers: Playfair Display 22px 600

---

### 5.14 `EmptyState`

- Emoji replaced with a typographic ornament (`✦`)
- Title: Playfair Display 20px 600 italic
- Description: Source Serif 4 14px muted

---

### 5.15 `Toast`

- Background: `--color-surface`, border: `1px solid var(--color-border)`
- Coloured left accent bar (3px wide) instead of coloured background
- Success bar: `#6aab7a`; Error bar: `#c97070`; Info bar: `#5a90c0`
- Text: Source Serif 4 13px

---

### 5.16 `Modal`

- Backdrop: `rgba(26,18,8,0.5)` (warm black, not neutral)
- Modal panel: `--color-surface`, `border: 1px solid var(--color-border)`, `border-radius: 10px`
- Title: Playfair Display 18px 600

---

### 5.17 `LoadingSpinner`

- Stroke colour: `--color-accent`
- Thin ring: `border-width: 2px`

---

### 5.18 `WordForm`

- Input fields: Source Serif 4 14px, `background: var(--color-bg)`, `border: 1px solid var(--color-border)`, amber focus ring
- Labels: JetBrains Mono 10px uppercase
- Add meaning button: ghost variant

---

### 5.19 `SessionSummary`

Token and font update.

- Heading: Playfair Display 24px 700
- Stats: Playfair Display 22px 600
- Rating breakdown bars: same thin-bar style as `ReviewProgress`

---

## 6. Global CSS

### `globals.css`

```css
:root {
  --color-bg: #f5f0e8;
  --color-bg-dark: #ede6d6;
  --color-surface: #ffffff;
  --color-border: #d4c5a9;
  --color-muted: #8b7355;
  --color-ink: #4a3728;
  --color-ink-deep: #1a1208;
  --color-accent: #8b6914;
  --color-accent-light: #c4a84a;
  --color-paper: #f8f3e8;
}

.dark {
  --color-bg: #1c1710;
  --color-bg-dark: #28210f;
  --color-surface: #28210f;
  --color-border: #3a3020;
  --color-muted: #8b7355;
  --color-ink: #c8b898;
  --color-ink-deep: #e8dcc8;
  --color-accent: #c4a84a;
  --color-accent-light: #e8c870;
  --color-paper: #2a2215;
}

body {
  background-color: var(--color-bg);
  color: var(--color-ink-deep);
  font-family: var(--font-source-serif), Georgia, serif;
}

@keyframes slide-up {
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
}

.animate-slide-up {
  animation: slide-up 300ms ease-out both;
}
```

---

## 7. Pages — What Changes

Pages themselves are **not restructured**. Only the components they use get updated.

| Page | Change |
|------|--------|
| `/` (Dashboard) | Due count uses Playfair Display 52px amber. Streak dots square. |
| `/review` | ReviewCard uses fade reveal. RatingButtons outlined. |
| `/words` | Filter chips: JetBrains Mono, outlined, amber active. WordCard updated. |
| `/words/[id]` | Word title Playfair Display 40px. Definitions in Source Serif 4. |
| `/add` | WordForm + WordSearchInput styled to Oxbridge tokens. |
| `/stats` | StatsOverview, StreakDisplay, LevelDistribution token update. |
| `/settings` | Button variants updated. No layout change. |

---

## 8. Motion

All motion is **refined & purposeful**:

- **ReviewCard reveal:** `opacity 0→1, translateY 6px→0`, `250ms ease-out`
- **Page entrance:** `animate-slide-up` class on page shell, CSS `@keyframes`, `300ms ease-out`
- **Progress bar fill:** `width transition 300ms ease`
- **Hover states:** `border-color 0.15s`, `background 0.15s`, `opacity 0.15s`
- **Toast enter/exit:** `translateY 8px→0, opacity 0→1`, `200ms ease-out`
- **No** spring physics, layout animations, or staggered lists

---

## 9. What Is NOT Changing

- Page routing and file structure
- Supabase data layer and hooks (`src/hooks/`)
- `src/lib/` files including `srs.ts`, `db.ts`, `utils.ts`, and any constants
- PWA configuration (`next-pwa`, manifest, service worker)
- Auth flow (`/login`, Supabase SSR)
- `src/types/index.ts`
- `public/` directory
- `next.config.mjs`

---

## 10. Files to Create / Modify

### New / Replaced
- `src/app/globals.css` — new CSS custom properties, font-family, slide-up keyframe
- `src/app/layout.tsx` — `next/font/google` imports, CSS variable classes on `<html>`
- `tailwind.config.ts` — `theme.extend.colors` with `ox-*` aliases, `fontFamily` aliases
- `src/components/ui/Button.tsx` — full rewrite
- `src/components/ui/Card.tsx` — full rewrite
- `src/components/ui/Badge.tsx` — full rewrite (inline colour map, no constants dependency)
- `src/components/ui/Toast.tsx` — full rewrite
- `src/components/ui/Modal.tsx` — full rewrite
- `src/components/ui/LoadingSpinner.tsx` — token update
- `src/components/ui/EmptyState.tsx` — full rewrite
- `src/components/ui/ThemeToggle.tsx` — token update
- `src/components/review/ReviewCard.tsx` — full rewrite (fade reveal, multi-meaning rendering)
- `src/components/review/RatingButtons.tsx` — full rewrite
- `src/components/review/ReviewProgress.tsx` — full rewrite
- `src/components/review/SessionSummary.tsx` — token + font update
- `src/components/words/WordCard.tsx` — full rewrite
- `src/components/words/WordForm.tsx` — token + font update
- `src/components/words/WordDetail.tsx` — token + font update
- `src/components/words/WordSearchInput.tsx` — token + font update
- `src/components/layout/Header.tsx` — token + font update
- `src/components/layout/BottomNav.tsx` — token + font update, SVG stroke-width
- `src/components/layout/PageShell.tsx` — token + font update
- `src/components/stats/StatsOverview.tsx` — token + font update
- `src/components/stats/StreakDisplay.tsx` — dot style update
- `src/components/stats/LevelDistribution.tsx` — bar style update

### Unchanged
- All `src/app/*/page.tsx` route files
- All `src/hooks/` files
- All `src/lib/` files
- `src/types/index.ts`
- `public/`
- `next.config.mjs`
