'use client';

import { useState, FormEvent } from 'react';
import { Button } from '@/components/ui/Button';

interface WordSearchInputProps {
  onSearch: (word: string) => void;
  loading?: boolean;
}

export function WordSearchInput({ onSearch, loading }: WordSearchInputProps) {
  const [input, setInput] = useState('');

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (input.trim()) {
      onSearch(input.trim());
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <label className="block font-mono text-[10px] uppercase tracking-[0.26em] text-ox-muted">
        Search the dictionary
      </label>
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ox-muted">
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.5-3.5" />
            </svg>
          </span>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a word to look up..."
            className="w-full rounded-2xl border border-ox-border bg-ox-surface px-11 py-3.5 font-serif text-[16px] text-ox-ink-deep placeholder:italic placeholder:text-ox-muted focus:outline-none focus:ring-2 focus:ring-ox-accent focus:border-transparent"
            autoFocus
            autoComplete="off"
          />
        </div>
        <Button type="submit" disabled={!input.trim() || loading} size="lg" className="sm:min-w-[160px]">
          {loading ? 'Looking up...' : 'Look up'}
        </Button>
      </div>
      <p className="font-serif text-[14px] text-ox-muted">
        Start with a quick lookup, then adjust the meaning and notes before saving.
      </p>
    </form>
  );
}
