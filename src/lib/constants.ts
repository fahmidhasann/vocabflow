export const RATING_LABELS: Record<number, string> = {
  0: 'Again',
  1: 'Hard',
  2: 'Good',
  3: 'Easy',
};

export const RATING_COLORS: Record<number, string> = {
  0: 'bg-red-500',
  1: 'bg-orange-500',
  2: 'bg-green-500',
  3: 'bg-blue-500',
};

export const SRS_STAGE_LABELS: Record<string, string> = {
  new: 'New',
  learning: 'Learning',
  reviewing: 'Reviewing',
  mastered: 'Mastered',
};

export const SRS_STAGE_COLORS: Record<string, string> = {
  new: 'bg-gray-500',
  learning: 'bg-yellow-500',
  reviewing: 'bg-blue-500',
  mastered: 'bg-green-500',
};

export const DICTIONARY_API_BASE = 'https://api.dictionaryapi.dev/api/v2/entries/en';
