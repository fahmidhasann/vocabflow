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
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type a word to look up…"
        className="flex-1 px-4 py-2 rounded-sm border border-ox-border bg-ox-bg font-serif text-[14px] text-ox-ink-deep placeholder:text-ox-muted placeholder:italic focus:outline-none focus:ring-2 focus:ring-ox-accent focus:border-transparent"
        autoFocus
        autoComplete="off"
      />
      <Button type="submit" disabled={!input.trim() || loading}>
        {loading ? 'Looking up…' : 'Look up'}
      </Button>
    </form>
  );
}
