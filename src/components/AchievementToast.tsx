import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';

interface Achievement {
  id: string;
  icon: React.ReactNode;
  name: string;
  message: string;
}

interface AchievementToastContextType {
  show: (achievement: Achievement) => void;
}

const AchievementToastContext = createContext<AchievementToastContextType | null>(null);

/**
 * AchievementToastProvider wraps the application to provide achievement toast functionality.
 * Place this at the root level to enable useAchievementToast hook throughout your app.
 */
export function AchievementToastProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState<Achievement | null>(null);

  const show = useCallback((achievement: Achievement) => {
    setToast(achievement);
    // Auto-dismiss after 5 seconds
    const timer = setTimeout(() => {
      setToast(null);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <AchievementToastContext.Provider value={{ show }}>
      {children}
      <AchievementToastContainer toast={toast} onDismiss={() => setToast(null)} />
    </AchievementToastContext.Provider>
  );
}

/**
 * useAchievementToast hook to trigger achievement toasts from anywhere in your component tree.
 * Must be used within an AchievementToastProvider.
 *
 * Usage:
 * const { show } = useAchievementToast();
 * show({
 *   id: 'first-badge',
 *   icon: <Trophy className="w-8 h-8" />,
 *   name: 'First Word!',
 *   message: 'You added your first word to the vocabulary',
 * });
 */
export function useAchievementToast() {
  const context = useContext(AchievementToastContext);

  if (!context) {
    throw new Error(
      'useAchievementToast must be used within an AchievementToastProvider. ' +
      'Wrap your component tree with <AchievementToastProvider>.</AchievementToastProvider>'
    );
  }

  return context;
}

/**
 * Internal component that renders the toast notification.
 */
function AchievementToastContainer({
  toast,
  onDismiss,
}: {
  toast: Achievement | null;
  onDismiss: () => void;
}) {
  return (
    <AnimatePresence>
      {toast && (
        <motion.div
          key={toast.id}
          initial={{ opacity: 0, x: 100, y: 100, scale: 0.8 }}
          animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
          exit={{ opacity: 0, x: 100, y: 100, scale: 0.8 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="fixed bottom-6 right-6 z-50 pointer-events-auto"
        >
          <div className="relative bg-white dark:bg-zinc-900 rounded-2xl shadow-xl shadow-black/20 dark:shadow-black/50 border border-zinc-200 dark:border-zinc-700 overflow-hidden p-6 max-w-sm min-w-80">
            {/* Confetti background elements */}
            <Confetti />

            {/* Content */}
            <div className="relative z-10 flex items-start gap-4">
              {/* Badge Icon */}
              <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/30 animate-pulse">
                <div className="text-white text-2xl">{toast.icon}</div>
              </div>

              {/* Text Content */}
              <div className="flex-1 pt-1">
                <h3 className="font-bold text-lg text-zinc-900 dark:text-zinc-50 mb-1">
                  {toast.name}
                </h3>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  {toast.message}
                </p>
              </div>

              {/* Close Button */}
              <button
                onClick={onDismiss}
                className="flex-shrink-0 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors p-1"
                aria-label="Dismiss achievement"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Accent bar */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-400 via-emerald-500 to-emerald-600" />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/**
 * Confetti animation component using CSS animations.
 * Creates animated particles that fall/float for celebratory effect.
 */
function Confetti() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Confetti particles */}
      {Array.from({ length: 12 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 rounded-full"
          style={{
            backgroundColor: ['#10b981', '#059669', '#047857', '#34d399'][i % 4],
            left: `${Math.random() * 100}%`,
            top: '-8px',
          }}
          initial={{ y: 0, opacity: 1, rotate: 0 }}
          animate={{
            y: 200,
            opacity: 0,
            rotate: 360 + Math.random() * 180,
          }}
          transition={{
            duration: 2.5 + Math.random() * 0.5,
            ease: 'easeOut',
            delay: Math.random() * 0.2,
          }}
        />
      ))}
    </div>
  );
}
