import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class',
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
  },
  plugins: [],
};
export default config;
