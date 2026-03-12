import { PlusCircle, Settings } from 'lucide-react';

interface StickyActionBarProps {
  onAddWord: () => void;
  onSettings: () => void;
}

export function StickyActionBar({ onAddWord, onSettings }: StickyActionBarProps) {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-700 p-4 pb-safe flex gap-3 z-30">
      {/* Add Word Button (Primary) */}
      <button
        onClick={onAddWord}
        className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-700 dark:hover:bg-emerald-600 text-white font-medium transition-colors shadow-sm"
      >
        <PlusCircle className="w-5 h-5" />
        <span>Add Word</span>
      </button>

      {/* Settings Button (Secondary) */}
      <button
        onClick={onSettings}
        className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 font-medium transition-colors"
      >
        <Settings className="w-5 h-5" />
        <span className="hidden sm:inline">Settings</span>
      </button>
    </div>
  );
}
