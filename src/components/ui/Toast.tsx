'use client';

import { createContext, useContext, useState, useCallback } from 'react';

type ToastType = 'success' | 'error' | 'info';

interface Toast {
  id: number;
  message: string;
  type: ToastType;
}

interface ToastContextValue {
  toast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextValue>({ toast: () => {} });

export function useToast() {
  return useContext(ToastContext);
}

let nextId = 0;

const barColors: Record<ToastType, string> = {
  success: '#6aab7a',
  error: '#c97070',
  info: '#5a90c0',
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = useCallback((message: string, type: ToastType = 'success') => {
    const id = nextId++;
    setToasts((t) => [...t, { id, message, type }]);
    setTimeout(() => {
      setToasts((t) => t.filter((toast) => toast.id !== id));
    }, 3000);
  }, []);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="pointer-events-none fixed bottom-24 left-1/2 z-50 flex w-full max-w-md -translate-x-1/2 flex-col gap-2 px-4">
        {toasts.map((t) => (
          <div
            key={t.id}
            className="pointer-events-auto flex overflow-hidden rounded-2xl border border-ox-border bg-[linear-gradient(180deg,color-mix(in_srgb,var(--color-surface)_92%,white_8%),var(--color-surface))] animate-slide-up"
            style={{ boxShadow: '0 16px 30px rgba(26,18,8,0.14)' }}
          >
            <div className="w-1.5 flex-shrink-0" style={{ background: barColors[t.type] }} />
            <p className="px-4 py-3 font-serif text-[14px] text-ox-ink-deep">{t.message}</p>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
