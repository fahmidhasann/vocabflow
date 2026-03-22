'use client';

import { useState } from 'react';
import type { UsageMap } from '@/types';

type UsageMapState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: UsageMap }
  | { status: 'error'; error: string };

const USAGE_MAP_URL = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/usage-map`;

export function useUsageMap() {
  const [state, setState] = useState<UsageMapState>({ status: 'idle' });

  async function generate(word: string) {
    if (!word.trim()) return;
    setState({ status: 'loading' });
    try {
      const res = await fetch(USAGE_MAP_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ word }),
      });
      if (!res.ok) throw new Error('Failed to generate');
      const data: UsageMap = await res.json();
      setState({ status: 'success', data });
    } catch (err) {
      setState({ status: 'error', error: err instanceof Error ? err.message : 'Unknown error' });
    }
  }

  function reset() {
    setState({ status: 'idle' });
  }

  return { ...state, generate, reset };
}
