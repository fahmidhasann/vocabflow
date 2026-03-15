import { DICTIONARY_API_BASE } from './constants';
import type { DictionaryResponse, Meaning } from '@/types';

export interface DictionaryResult {
  word: string;
  phonetic?: string;
  meanings: Meaning[];
  example?: string;
}

export async function lookupWord(word: string): Promise<DictionaryResult> {
  const response = await fetch(`${DICTIONARY_API_BASE}/${encodeURIComponent(word.trim().toLowerCase())}`);

  if (response.status === 404) {
    throw new Error(`Word "${word}" not found in dictionary`);
  }

  if (!response.ok) {
    throw new Error('Dictionary API error. Please try again.');
  }

  const data: DictionaryResponse[] = await response.json();
  const entry = data[0];

  const meanings: Meaning[] = entry.meanings.map((m) => ({
    partOfSpeech: m.partOfSpeech,
    definition: m.definitions[0]?.definition || '',
  }));

  const example = entry.meanings
    .flatMap((m) => m.definitions)
    .find((d) => d.example)?.example;

  return {
    word: entry.word,
    phonetic: entry.phonetic,
    meanings,
    example,
  };
}
