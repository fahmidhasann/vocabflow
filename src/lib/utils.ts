import type { Word } from '@/types';

export function todayDateString(): string {
  return new Date().toISOString().split('T')[0];
}

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function daysBetween(dateStr1: string, dateStr2: string): number {
  const d1 = new Date(dateStr1);
  const d2 = new Date(dateStr2);
  return Math.round((d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24));
}

export function daysFromNow(days: number): string {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString().split('T')[0];
}

export function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  if (mins === 0) return `${secs}s`;
  return `${mins}m ${secs}s`;
}

export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}

export function matchesWordSearch(word: Word, query: string): boolean {
  const term = query.trim().toLowerCase();
  if (!term) return true;

  if (word.word.toLowerCase().includes(term)) return true;
  if (word.phonetic?.toLowerCase().includes(term)) return true;
  if (word.example?.toLowerCase().includes(term)) return true;
  if (word.notes?.toLowerCase().includes(term)) return true;

  if (
    Array.isArray(word.meanings) &&
    word.meanings.some(
      (m) =>
        m.definition?.toLowerCase().includes(term) ||
        m.partOfSpeech?.toLowerCase().includes(term)
    )
  ) {
    return true;
  }

  if (
    word.usageMap?.domains &&
    Array.isArray(word.usageMap.domains) &&
    word.usageMap.domains.some(
      (d) =>
        d.domain?.toLowerCase().includes(term) ||
        (Array.isArray(d.patterns) &&
          d.patterns.some(
            (p) =>
              p.pattern?.toLowerCase().includes(term) ||
              p.meaning?.toLowerCase().includes(term)
          ))
    )
  ) {
    return true;
  }

  return false;
}

