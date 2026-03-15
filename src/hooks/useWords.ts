'use client';

import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/lib/db';
import type { Word, Meaning, SrsStage } from '@/types';
import { newWordSrsFields } from '@/lib/srs';
import { todayDateString } from '@/lib/utils';

export function useWords(filter?: { stage?: SrsStage; search?: string }) {
  const words = useLiveQuery(async () => {
    const collection = db.words.orderBy('createdAt');
    let results = await collection.reverse().toArray();

    if (filter?.stage) {
      results = results.filter((w) => w.srsStage === filter.stage);
    }
    if (filter?.search) {
      const s = filter.search.toLowerCase();
      results = results.filter((w) => w.word.toLowerCase().includes(s));
    }
    return results;
  }, [filter?.stage, filter?.search]);

  return words;
}

export function useWord(id: number | undefined) {
  return useLiveQuery(
    () => (id ? db.words.get(id) : undefined),
    [id]
  );
}

export function useDueWords() {
  return useLiveQuery(async () => {
    const today = todayDateString();
    const all = await db.words.toArray();
    return all.filter((w) => w.nextReviewDate <= today);
  });
}

export async function addWord(data: {
  word: string;
  phonetic?: string;
  meanings: Meaning[];
  example?: string;
  notes?: string;
}): Promise<number> {
  const now = new Date().toISOString();
  return db.words.add({
    ...data,
    ...newWordSrsFields(),
    createdAt: now,
    updatedAt: now,
  });
}

export async function updateWord(id: number, data: Partial<Word>) {
  return db.words.update(id, { ...data, updatedAt: new Date().toISOString() });
}

export async function deleteWord(id: number) {
  return db.words.delete(id);
}
