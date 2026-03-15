'use client';

import { useState } from 'react';
import { lookupWord, type DictionaryResult } from '@/lib/dictionary-api';

type LookupState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: DictionaryResult }
  | { status: 'error'; error: string };

export function useDictionaryLookup() {
  const [state, setState] = useState<LookupState>({ status: 'idle' });

  async function lookup(word: string) {
    if (!word.trim()) return;
    setState({ status: 'loading' });
    try {
      const data = await lookupWord(word);
      setState({ status: 'success', data });
    } catch (err) {
      setState({ status: 'error', error: err instanceof Error ? err.message : 'Unknown error' });
    }
  }

  function reset() {
    setState({ status: 'idle' });
  }

  return { ...state, lookup, reset };
}
