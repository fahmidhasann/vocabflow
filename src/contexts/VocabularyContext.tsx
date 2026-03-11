import { createContext, ReactNode, useContext } from 'react';
import { useVocabulary as useVocabularyHook } from '../hooks/useVocabulary';

// Type the context value from the hook's return type
type VocabularyContextType = ReturnType<typeof useVocabularyHook>;

const VocabularyContext = createContext<VocabularyContextType | null>(null);

interface VocabularyProviderProps {
  children: ReactNode;
}

/**
 * VocabularyProvider wraps the application to provide single source of truth
 * for vocabulary state management, preventing race conditions from multiple
 * hook instances.
 */
export function VocabularyProvider({ children }: VocabularyProviderProps) {
  const vocabulary = useVocabularyHook();

  return (
    <VocabularyContext.Provider value={vocabulary}>
      {children}
    </VocabularyContext.Provider>
  );
}

/**
 * useVocabulary hook to access vocabulary state and methods.
 * Must be used within a VocabularyProvider.
 *
 * Returns:
 * - words: array of WordEntry objects
 * - isLoaded: boolean indicating if data has been loaded from storage
 * - addWord: function to add a new word
 * - updateWord: function to update a word
 * - deleteWord: function to delete a word
 * - processReview: function to process a review and update SRS metrics
 * - getDueWords: function to get words due for review
 * - getStats: function to get vocabulary statistics
 */
export function useVocabulary() {
  const context = useContext(VocabularyContext);

  if (!context) {
    throw new Error(
      'useVocabulary must be used within a VocabularyProvider. ' +
      'Wrap your component tree with <VocabularyProvider>.</VocabularyProvider>'
    );
  }

  return context;
}
