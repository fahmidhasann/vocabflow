import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  todayDateString,
  formatDate,
  daysBetween,
  daysFromNow,
  formatDuration,
  cn,
  matchesWordSearch,
} from '../utils';
import type { Word } from '@/types';

const sampleWord: Word = {
  id: '1',
  word: 'Hubris',
  phonetic: '/ˈhjuː.brɪs/',
  meanings: [
    { partOfSpeech: 'noun', definition: 'Excessive pride or dangerous self-confidence, arrogance.' },
  ],
  example: 'His hubris eventually led to his tragic downfall.',
  notes: 'Key vocabulary term for classical literature.',
  easeFactor: 2.5,
  interval: 1,
  repetitions: 0,
  nextReviewDate: '2024-06-15',
  srsStage: 'new',
  createdAt: '2024-06-15T00:00:00Z',
  updatedAt: '2024-06-15T00:00:00Z',
  usageMap: {
    word: 'Hubris',
    domains: [
      {
        domain: 'Literary Analysis',
        patterns: [
          { pattern: 'tragic hubris', meaning: 'flaw leading to downfall' },
        ],
      },
    ],
  },
};

describe('matchesWordSearch', () => {
  it('returns true for empty or whitespace query', () => {
    expect(matchesWordSearch(sampleWord, '')).toBe(true);
    expect(matchesWordSearch(sampleWord, '   ')).toBe(true);
  });

  it('matches word term case-insensitively', () => {
    expect(matchesWordSearch(sampleWord, 'hubris')).toBe(true);
    expect(matchesWordSearch(sampleWord, 'HUBRIS')).toBe(true);
    expect(matchesWordSearch(sampleWord, 'Hub')).toBe(true);
  });

  it('matches definition in meanings (e.g. Arrogance)', () => {
    expect(matchesWordSearch(sampleWord, 'Arrogance')).toBe(true);
    expect(matchesWordSearch(sampleWord, 'arrogance')).toBe(true);
    expect(matchesWordSearch(sampleWord, 'self-confidence')).toBe(true);
  });

  it('matches partOfSpeech in meanings', () => {
    expect(matchesWordSearch(sampleWord, 'noun')).toBe(true);
  });

  it('matches phonetic', () => {
    expect(matchesWordSearch(sampleWord, 'hjuː')).toBe(true);
  });

  it('matches example sentence', () => {
    expect(matchesWordSearch(sampleWord, 'tragic downfall')).toBe(true);
  });

  it('matches notes', () => {
    expect(matchesWordSearch(sampleWord, 'classical literature')).toBe(true);
  });

  it('matches usage map domain, pattern, or meaning', () => {
    expect(matchesWordSearch(sampleWord, 'Literary Analysis')).toBe(true);
    expect(matchesWordSearch(sampleWord, 'flaw leading')).toBe(true);
  });

  it('returns false when no field matches query', () => {
    expect(matchesWordSearch(sampleWord, 'banana')).toBe(false);
    expect(matchesWordSearch(sampleWord, 'Apple')).toBe(false);
  });
});

describe('todayDateString', () => {
  it('returns a string in YYYY-MM-DD format', () => {
    const result = todayDateString();
    expect(result).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it('matches today\'s date', () => {
    const today = new Date().toISOString().split('T')[0];
    expect(todayDateString()).toBe(today);
  });
});

describe('formatDate', () => {
  it('formats a date string into human-readable form', () => {
    const result = formatDate('2024-06-15');
    expect(result).toContain('Jun');
    expect(result).toContain('15');
    expect(result).toContain('2024');
  });
});

describe('daysBetween', () => {
  it('returns 0 for the same date', () => {
    expect(daysBetween('2024-01-01', '2024-01-01')).toBe(0);
  });

  it('returns 1 for consecutive dates', () => {
    expect(daysBetween('2024-01-01', '2024-01-02')).toBe(1);
  });

  it('returns negative for reversed order', () => {
    expect(daysBetween('2024-01-10', '2024-01-05')).toBe(-5);
  });

  it('handles month boundaries', () => {
    expect(daysBetween('2024-01-31', '2024-02-01')).toBe(1);
  });

  it('handles year boundaries', () => {
    expect(daysBetween('2023-12-31', '2024-01-01')).toBe(1);
  });
});

describe('daysFromNow', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2024-06-15'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('returns today for 0 days', () => {
    expect(daysFromNow(0)).toBe('2024-06-15');
  });

  it('returns tomorrow for 1 day', () => {
    expect(daysFromNow(1)).toBe('2024-06-16');
  });

  it('returns correct date for 7 days', () => {
    expect(daysFromNow(7)).toBe('2024-06-22');
  });

  it('handles month rollover', () => {
    expect(daysFromNow(16)).toBe('2024-07-01');
  });
});

describe('formatDuration', () => {
  it('formats seconds only when under a minute', () => {
    expect(formatDuration(45)).toBe('45s');
    expect(formatDuration(0)).toBe('0s');
    expect(formatDuration(59)).toBe('59s');
  });

  it('formats minutes and seconds', () => {
    expect(formatDuration(60)).toBe('1m 0s');
    expect(formatDuration(90)).toBe('1m 30s');
    expect(formatDuration(3661)).toBe('61m 1s');
  });
});

describe('cn', () => {
  it('joins class strings', () => {
    expect(cn('foo', 'bar')).toBe('foo bar');
  });

  it('filters out falsy values', () => {
    expect(cn('foo', false, undefined, null, 'bar')).toBe('foo bar');
  });

  it('returns empty string for all falsy', () => {
    expect(cn(false, undefined, null)).toBe('');
  });

  it('handles a single class', () => {
    expect(cn('only')).toBe('only');
  });
});
