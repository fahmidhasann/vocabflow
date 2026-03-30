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
        'ox-surface-alt':  'var(--color-surface-alt)',
        'ox-border':       'var(--color-border)',
        'ox-line':         'var(--color-line)',
        'ox-muted':        'var(--color-muted)',
        'ox-ink':          'var(--color-ink)',
        'ox-ink-deep':     'var(--color-ink-deep)',
        'ox-accent':       'var(--color-accent)',
        'ox-accent-light': 'var(--color-accent-light)',
        'ox-accent-soft':  'var(--color-accent-soft)',
        'ox-paper':        'var(--color-paper)',
        'ox-success':      'var(--color-success)',
        'ox-success-soft': 'var(--color-success-soft)',
        'ox-warning':      'var(--color-warning)',
        'ox-warning-soft': 'var(--color-warning-soft)',
        'ox-info':         'var(--color-info)',
        'ox-info-soft':    'var(--color-info-soft)',
        'ox-danger':       'var(--color-danger)',
        'ox-danger-soft':  'var(--color-danger-soft)',
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
