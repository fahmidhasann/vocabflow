import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  calculateNextReview,
  getSrsStage,
  previewIntervals,
  formatInterval,
  newWordSrsFields,
} from '../srs';
import type { Word } from '@/types';

function makeWord(overrides: Partial<Word> = {}): Word {
  return {
    word: 'test',
    meanings: [],
    easeFactor: 2.5,
    interval: 0,
    repetitions: 0,
    nextReviewDate: '2024-06-15',
    srsStage: 'new',
    createdAt: '2024-06-15T00:00:00Z',
    updatedAt: '2024-06-15T00:00:00Z',
    ...overrides,
  };
}

describe('getSrsStage', () => {
  it('returns "new" when repetitions is 0', () => {
    expect(getSrsStage(0, 0)).toBe('new');
    expect(getSrsStage(10, 0)).toBe('new');
  });

  it('returns "learning" for interval <= 6 with repetitions > 0', () => {
    expect(getSrsStage(1, 1)).toBe('learning');
    expect(getSrsStage(6, 2)).toBe('learning');
  });

  it('returns "reviewing" for interval 7-30', () => {
    expect(getSrsStage(7, 3)).toBe('reviewing');
    expect(getSrsStage(30, 5)).toBe('reviewing');
  });

  it('returns "mastered" for interval > 30', () => {
    expect(getSrsStage(31, 5)).toBe('mastered');
    expect(getSrsStage(365, 10)).toBe('mastered');
  });
});

describe('calculateNextReview', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2024-06-15'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('rating 0 (Again) — failed', () => {
    it('resets repetitions to 0 and interval to 1', () => {
      const word = makeWord({ repetitions: 3, interval: 15, easeFactor: 2.5 });
      const result = calculateNextReview(word, 0);
      expect(result.repetitions).toBe(0);
      expect(result.interval).toBe(1);
    });

    it('reduces ease factor', () => {
      const word = makeWord({ easeFactor: 2.5 });
      const result = calculateNextReview(word, 0);
      expect(result.easeFactor).toBeLessThan(2.5);
    });

    it('clamps ease factor at minimum 1.3', () => {
      const word = makeWord({ easeFactor: 1.3 });
      const result = calculateNextReview(word, 0);
      expect(result.easeFactor).toBe(1.3);
    });
  });

  describe('rating 1 (Hard) — failed (quality < 3)', () => {
    it('resets repetitions to 0 and interval to 1', () => {
      const word = makeWord({ repetitions: 5, interval: 20 });
      const result = calculateNextReview(word, 1);
      expect(result.repetitions).toBe(0);
      expect(result.interval).toBe(1);
    });
  });

  describe('rating 2 (Good) — passed', () => {
    it('first repetition sets interval to 1', () => {
      const word = makeWord({ repetitions: 0, interval: 0 });
      const result = calculateNextReview(word, 2);
      expect(result.repetitions).toBe(1);
      expect(result.interval).toBe(1);
    });

    it('second repetition sets interval to 6', () => {
      const word = makeWord({ repetitions: 1, interval: 1 });
      const result = calculateNextReview(word, 2);
      expect(result.repetitions).toBe(2);
      expect(result.interval).toBe(6);
    });

    it('third+ repetition multiplies by ease factor', () => {
      const word = makeWord({ repetitions: 2, interval: 6, easeFactor: 2.5 });
      const result = calculateNextReview(word, 2);
      expect(result.repetitions).toBe(3);
      expect(result.interval).toBe(Math.round(6 * 2.5)); // 15
    });
  });

  describe('rating 3 (Easy) — passed', () => {
    it('increases ease factor', () => {
      const word = makeWord({ easeFactor: 2.5, repetitions: 2, interval: 6 });
      const result = calculateNextReview(word, 3);
      expect(result.easeFactor).toBeGreaterThan(2.5);
    });

    it('sets nextReviewDate in the future', () => {
      const word = makeWord({ repetitions: 1, interval: 1 });
      const result = calculateNextReview(word, 3);
      expect(result.nextReviewDate).toBe('2024-06-21'); // 1 day → interval=6 → 6 days out
    });
  });

  describe('srsStage transitions', () => {
    it('new word after first good review becomes learning', () => {
      const word = makeWord({ repetitions: 0, interval: 0 });
      const result = calculateNextReview(word, 2);
      // interval=1, repetitions=1 → learning
      expect(result.srsStage).toBe('learning');
    });

    it('reaches reviewing stage after interval enters 7-30 range', () => {
      const word = makeWord({ repetitions: 2, interval: 6, easeFactor: 2.5 });
      const result = calculateNextReview(word, 2);
      // interval = round(6 * 2.5) = 15 → reviewing
      expect(result.srsStage).toBe('reviewing');
    });

    it('reaches mastered when interval exceeds 30', () => {
      const word = makeWord({ repetitions: 5, interval: 30, easeFactor: 2.5 });
      const result = calculateNextReview(word, 2);
      // interval = round(30 * 2.5) = 75 → mastered
      expect(result.srsStage).toBe('mastered');
    });
  });
});

describe('formatInterval', () => {
  it('formats 1 day', () => {
    expect(formatInterval(1)).toBe('1 day');
  });

  it('formats days (2-29)', () => {
    expect(formatInterval(7)).toBe('7 days');
    expect(formatInterval(29)).toBe('29 days');
  });

  it('formats months (30-364)', () => {
    expect(formatInterval(30)).toBe('1 mo');
    expect(formatInterval(60)).toBe('2 mo');
    expect(formatInterval(364)).toBe('12 mo');
  });

  it('formats years (365+)', () => {
    expect(formatInterval(365)).toBe('1.0 yr');
    expect(formatInterval(730)).toBe('2.0 yr');
  });
});

describe('previewIntervals', () => {
  it('ratings 0 and 1 always return 1', () => {
    const word = makeWord({ repetitions: 5, interval: 30, easeFactor: 2.5 });
    const result = previewIntervals(word);
    expect(result[0]).toBe(1);
    expect(result[1]).toBe(1);
  });

  it('rating 2 returns 1 for brand new word', () => {
    const word = makeWord({ repetitions: 0, interval: 0, easeFactor: 2.5 });
    expect(previewIntervals(word)[2]).toBe(1);
  });

  it('rating 2 returns 6 after first repetition', () => {
    const word = makeWord({ repetitions: 1, interval: 1, easeFactor: 2.5 });
    expect(previewIntervals(word)[2]).toBe(6);
  });

  it('rating 2 uses interval * easeFactor for established words', () => {
    const word = makeWord({ repetitions: 3, interval: 10, easeFactor: 2.5 });
    expect(previewIntervals(word)[2]).toBe(Math.round(10 * 2.5));
  });

  it('rating 3 uses slightly higher easeFactor', () => {
    const word = makeWord({ repetitions: 3, interval: 10, easeFactor: 2.5 });
    const result = previewIntervals(word);
    expect(result[3]).toBeGreaterThan(result[2]);
  });
});

describe('newWordSrsFields', () => {
  it('returns default SRS fields for a new word', () => {
    const fields = newWordSrsFields();
    expect(fields.easeFactor).toBe(2.5);
    expect(fields.interval).toBe(0);
    expect(fields.repetitions).toBe(0);
    expect(fields.srsStage).toBe('new');
    expect(fields.nextReviewDate).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });
});
