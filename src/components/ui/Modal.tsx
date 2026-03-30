'use client';

import { useEffect, useRef } from 'react';
import { Button } from './Button';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export function Modal({ open, onClose, title, children }: ModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose();
    }

    if (!open) return;
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
      style={{ background: 'rgba(26,18,8,0.52)' }}
      onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div className="w-full max-w-md rounded-[28px] border border-ox-border bg-[linear-gradient(180deg,color-mix(in_srgb,var(--color-surface)_86%,white_14%),var(--color-paper))] p-6 shadow-[0_24px_60px_rgba(26,18,8,0.18)]">
        <div className="mb-4 flex items-start justify-between gap-3">
          <h2 className="font-display text-[24px] font-semibold text-ox-ink-deep">{title}</h2>
          <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close modal">
            <span aria-hidden="true" className="text-lg leading-none">×</span>
          </Button>
        </div>
        {children}
      </div>
    </div>
  );
}
