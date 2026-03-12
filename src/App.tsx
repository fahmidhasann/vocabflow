import { useState } from 'react';
import { useTheme } from './hooks/useTheme';
import { VocabularyProvider, useVocabulary } from './contexts/VocabularyContext';
import { AchievementToastProvider } from './contexts/AchievementToastContext';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { AddWordForm } from './components/AddWordForm';
import { ReviewSession } from './components/ReviewSession';
import { WordList } from './components/WordList';
import { CategoryManager } from './components/CategoryManager';
import { Settings } from './components/Settings';
import { Analytics } from './components/Analytics';
import { Achievements } from './components/Achievements';

/**
 * AppContent component that uses the VocabularyContext.
 * This is wrapped by VocabularyProvider at the root level.
 */
function AppContent() {
  useTheme();
  const { isLoaded } = useVocabulary();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isReviewing, setIsReviewing] = useState(false);

  if (!isLoaded) {
    return (
      <div className="flex h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-950">
        <div className="w-12 h-12 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (isReviewing) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 p-4 md:p-8">
        <ReviewSession onComplete={() => setIsReviewing(false)} />
      </div>
    );
  }

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
      {activeTab === 'dashboard' && (
        <Dashboard
          onStartReview={() => setIsReviewing(true)}
          onAddWord={() => setActiveTab('add')}
        />
      )}
      {activeTab === 'add' && <AddWordForm onAdded={() => setActiveTab('list')} />}
      {activeTab === 'list' && <WordList />}
      {activeTab === 'categories' && <CategoryManager />}
      {activeTab === 'analytics' && <Analytics />}
      {activeTab === 'achievements' && <Achievements />}
      {activeTab === 'settings' && <Settings />}
    </Layout>
  );
}

/**
 * Root App component wrapped with VocabularyProvider.
 * Ensures single source of truth for vocabulary state across all components.
 */
export default function App() {
  return (
    <VocabularyProvider>
      <AchievementToastProvider>
        <AppContent />
      </AchievementToastProvider>
    </VocabularyProvider>
  );
}
