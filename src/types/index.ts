export interface Word {
  id?: string;
  word: string;
  phonetic?: string;
  meanings: Meaning[];
  example?: string;
  notes?: string;
  easeFactor: number;
  interval: number;
  repetitions: number;
  nextReviewDate: string; // ISO date string
  srsStage: SrsStage;
  createdAt: string;
  updatedAt: string;
}

export interface Meaning {
  partOfSpeech: string;
  definition: string;
}

export type SrsStage = 'new' | 'learning' | 'reviewing' | 'mastered';

export type Rating = 0 | 1 | 2 | 3; // Again, Hard, Good, Easy

export interface ReviewSession {
  id?: string;
  date: string;
  wordsReviewed: number;
  ratings: Record<string, Rating>;
  duration: number; // seconds
  completedAt: string;
}

export interface AppState {
  key: string;
  value: string;
}

export interface DictionaryResponse {
  word: string;
  phonetic?: string;
  meanings: {
    partOfSpeech: string;
    definitions: {
      definition: string;
      example?: string;
    }[];
  }[];
}

export type ReviewState = 'idle' | 'showing-front' | 'showing-back' | 'complete';

export interface ReviewSessionState {
  state: ReviewState;
  words: Word[];
  currentIndex: number;
  ratings: Record<string, Rating>;
  startTime: number;
}
