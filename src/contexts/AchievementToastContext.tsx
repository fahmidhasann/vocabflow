import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { Achievement } from '../types';

interface AchievementToastContextType {
  showToast: (achievement: Achievement) => void;
  toasts: Achievement[];
}

const AchievementToastContext = createContext<AchievementToastContextType | undefined>(undefined);

export function AchievementToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Achievement[]>([]);

  const showToast = useCallback((achievement: Achievement) => {
    setToasts((prev) => [...prev, achievement]);
    // Auto-remove after 5 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== achievement.id));
    }, 5000);
  }, []);

  return (
    <AchievementToastContext.Provider value={{ showToast, toasts }}>
      {children}
    </AchievementToastContext.Provider>
  );
}

export function useAchievementToast() {
  const context = useContext(AchievementToastContext);
  if (!context) {
    throw new Error('useAchievementToast must be used within AchievementToastProvider');
  }
  return context;
}
