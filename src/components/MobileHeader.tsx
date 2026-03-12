import { Menu, Sun, Moon } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';

interface MobileHeaderProps {
  drawerOpen: boolean;
  setDrawerOpen: (open: boolean) => void;
}

export function MobileHeader({ drawerOpen, setDrawerOpen }: MobileHeaderProps) {
  const { isDark, toggleTheme } = useTheme();

  return (
    <header className="md:hidden fixed top-0 left-0 right-0 h-16 bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-700 flex items-center justify-between px-4 z-40">
      <h1 className="text-xl font-bold tracking-tight text-emerald-600">VocabFlow</h1>
      <div className="flex items-center gap-2">
        <button
          onClick={toggleTheme}
          aria-label="Toggle theme"
          className="p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors text-zinc-600 dark:text-zinc-400"
        >
          {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>
        <button
          onClick={() => setDrawerOpen(!drawerOpen)}
          aria-label="Toggle navigation menu"
          className="p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors text-zinc-600 dark:text-zinc-400"
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
}
