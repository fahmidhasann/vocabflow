import { Home, BookOpen, TrendingUp, FolderOpen, Trophy, Sun, Moon } from 'lucide-react';
import { useState } from 'react';
import { useTheme } from '../hooks/useTheme';
import { MobileHeader } from './MobileHeader';
import { MobileDrawer } from './MobileDrawer';
import { StickyActionBar } from './StickyActionBar';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export function Layout({ children, activeTab, setActiveTab }: LayoutProps) {
  const { isDark, toggleTheme } = useTheme();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const desktopNavItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'list', label: 'My Words', icon: BookOpen },
    { id: 'categories', label: 'Categories', icon: FolderOpen },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp },
    { id: 'achievements', label: 'Achievements', icon: Trophy },
  ];

  return (
    <div className="flex flex-col h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 font-sans">
      {/* Mobile Header (< 768px) */}
      <MobileHeader drawerOpen={drawerOpen} setDrawerOpen={setDrawerOpen} />

      {/* Mobile Drawer (< 768px) */}
      <MobileDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      <div className="flex flex-1 overflow-hidden">
        {/* Desktop Sidebar (≥ 768px) */}
        <aside className="hidden md:flex flex-col w-64 bg-white dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-700">
          <div className="p-6">
            <h1 className="text-2xl font-bold tracking-tight text-emerald-600">VocabFlow</h1>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">Master your vocabulary</p>
          </div>
          <nav className="flex-1 px-4 space-y-2">
            {desktopNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                    isActive
                      ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 font-medium'
                      : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'text-emerald-600 dark:text-emerald-400' : 'text-zinc-400 dark:text-zinc-500'}`} />
                  {item.label}
                </button>
              );
            })}
          </nav>
          <div className="p-4 border-t border-zinc-200 dark:border-zinc-700">
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            >
              {isDark ? <Sun className="w-5 h-5 text-zinc-400 dark:text-zinc-500" /> : <Moon className="w-5 h-5 text-zinc-400" />}
              {isDark ? 'Light Mode' : 'Dark Mode'}
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto pt-16 md:pt-0 pb-24 md:pb-0">
          <div className="max-w-4xl mx-auto p-4 md:p-8">
            {children}
          </div>
        </main>
      </div>

      {/* Sticky Action Bar (Mobile only) */}
      <StickyActionBar
        onAddWord={() => {
          setActiveTab('add');
          setDrawerOpen(false);
        }}
        onSettings={() => {
          setActiveTab('settings');
          setDrawerOpen(false);
        }}
      />
    </div>
  );
}
