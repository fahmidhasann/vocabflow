import type { Word, ReviewSession, Meaning, Rating, SrsStage } from '@/types';

// ─── Word mappers ────────────────────────────────────────────────────────────

export interface WordRow {
  id: string;
  user_id: string;
  word: string;
  phonetic: string | null;
  meanings: Meaning[];
  example: string | null;
  notes: string | null;
  ease_factor: number;
  interval: number;
  repetitions: number;
  next_review_date: string;
  srs_stage: SrsStage;
  created_at: string;
  updated_at: string;
}

export function rowToWord(row: WordRow): Word {
  return {
    id: row.id,
    word: row.word,
    phonetic: row.phonetic ?? undefined,
    meanings: Array.isArray(row.meanings) ? row.meanings : [],
    example: row.example ?? undefined,
    notes: row.notes ?? undefined,
    easeFactor: Number(row.ease_factor),
    interval: row.interval,
    repetitions: row.repetitions,
    nextReviewDate: row.next_review_date,
    srsStage: row.srs_stage,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function wordToInsert(
  data: Omit<Word, 'id' | 'createdAt' | 'updatedAt'>,
  userId: string,
  now: string
) {
  return {
    user_id: userId,
    word: data.word,
    phonetic: data.phonetic ?? null,
    meanings: data.meanings,
    example: data.example ?? null,
    notes: data.notes ?? null,
    ease_factor: data.easeFactor,
    interval: data.interval,
    repetitions: data.repetitions,
    next_review_date: data.nextReviewDate,
    srs_stage: data.srsStage,
    created_at: now,
    updated_at: now,
  };
}

export function wordToUpdate(data: Partial<Word>) {
  const row: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (data.phonetic !== undefined) row.phonetic = data.phonetic ?? null;
  if (data.meanings !== undefined) row.meanings = data.meanings;
  if (data.example !== undefined) row.example = data.example ?? null;
  if (data.notes !== undefined) row.notes = data.notes ?? null;
  if (data.easeFactor !== undefined) row.ease_factor = data.easeFactor;
  if (data.interval !== undefined) row.interval = data.interval;
  if (data.repetitions !== undefined) row.repetitions = data.repetitions;
  if (data.nextReviewDate !== undefined) row.next_review_date = data.nextReviewDate;
  if (data.srsStage !== undefined) row.srs_stage = data.srsStage;
  return row;
}

// ─── ReviewSession mappers ───────────────────────────────────────────────────

export interface ReviewSessionRow {
  id: string;
  user_id: string;
  date: string;
  words_reviewed: number;
  ratings: Record<string, Rating>;
  duration: number;
  completed_at: string;
}

export function rowToSession(row: ReviewSessionRow): ReviewSession {
  return {
    id: row.id,
    date: row.date,
    wordsReviewed: row.words_reviewed,
    ratings: row.ratings,
    duration: row.duration,
    completedAt: row.completed_at,
  };
}

export function sessionToInsert(
  data: Omit<ReviewSession, 'id'>,
  userId: string
) {
  return {
    user_id: userId,
    date: data.date,
    words_reviewed: data.wordsReviewed,
    ratings: data.ratings,
    duration: data.duration,
    completed_at: data.completedAt,
  };
}
