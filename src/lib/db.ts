import Dexie, { type Table } from 'dexie';
import type { Word, ReviewSession, AppState } from '@/types';

export class VocabFlowDB extends Dexie {
  words!: Table<Word, number>;
  reviewSessions!: Table<ReviewSession, number>;
  appState!: Table<AppState, string>;

  constructor() {
    super('vocabflow');
    this.version(1).stores({
      words: '++id, word, srsStage, nextReviewDate, createdAt',
      reviewSessions: '++id, date',
      appState: 'key',
    });
  }
}

export const db = new VocabFlowDB();
