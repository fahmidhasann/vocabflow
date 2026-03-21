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
      <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 flex flex-col gap-2">
        {toasts.map((t) => (
          <div
            key={t.id}
            className="flex overflow-hidden rounded-sm border border-ox-border bg-ox-surface animate-slide-up"
            style={{ boxShadow: '0 2px 8px rgba(26,18,8,0.10)' }}
          >
            <div className="w-[3px] flex-shrink-0" style={{ background: barColors[t.type] }} />
            <p className="px-4 py-2.5 font-serif text-[13px] text-ox-ink-deep">{t.message}</p>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
