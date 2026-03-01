import { motion } from 'motion/react';
import { Download, Trash2, AlertTriangle } from 'lucide-react';
import { useVocabulary } from '../hooks/useVocabulary';
import { useTheme } from '../hooks/useTheme';

export function Settings() {
  const { words } = useVocabulary();
  const { isDark, toggleTheme } = useTheme();

  const handleExport = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(words, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "vocabflow_backup.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const handleClearData = () => {
    if (window.confirm("Are you sure you want to delete all your words? This cannot be undone.")) {
      localStorage.removeItem('vocabflow_words');
      window.location.reload();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto space-y-8"
    >
      <header>
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Settings</h2>
        <p className="text-zinc-500 dark:text-zinc-400 mt-2">Manage your data and preferences.</p>
      </header>

      <section className="bg-white dark:bg-zinc-900 rounded-3xl p-8 border border-zinc-200 dark:border-zinc-700 shadow-sm">
        <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50 mb-4">Appearance</h3>
        <div className="flex items-center justify-between p-4 bg-zinc-50 dark:bg-zinc-800 rounded-2xl border border-zinc-100 dark:border-zinc-700">
          <div>
            <p className="font-medium text-zinc-900 dark:text-zinc-50">Theme</p>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">{isDark ? 'Dark mode is on' : 'Light mode is on'}</p>
          </div>
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className={`relative inline-flex h-7 w-13 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 dark:focus:ring-offset-zinc-900 ${isDark ? 'bg-emerald-600' : 'bg-zinc-200'}`}
          >
            <span className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition-transform ${isDark ? 'translate-x-7' : 'translate-x-1'}`} />
          </button>
        </div>
      </section>

      <section className="bg-white dark:bg-zinc-900 rounded-3xl p-8 border border-zinc-200 dark:border-zinc-700 shadow-sm space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50 mb-4">Data Management</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-zinc-50 dark:bg-zinc-800 rounded-2xl border border-zinc-100 dark:border-zinc-700">
              <div>
                <p className="font-medium text-zinc-900 dark:text-zinc-50">Export Backup</p>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">Download your vocabulary as a JSON file.</p>
              </div>
              <button
                onClick={handleExport}
                aria-label="Export vocabulary backup as JSON"
                className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-zinc-700 border border-zinc-200 dark:border-zinc-600 rounded-xl text-zinc-700 dark:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-600 transition-colors font-medium shadow-sm"
              >
                <Download className="w-4 h-4" />
                Export
              </button>
            </div>

            <div className="flex items-center justify-between p-4 bg-red-50 rounded-2xl border border-red-100">
              <div>
                <p className="font-medium text-red-900 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  Danger Zone
                </p>
                <p className="text-sm text-red-700">Permanently delete all saved words and progress.</p>
              </div>
              <button
                onClick={handleClearData}
                aria-label="Permanently delete all saved words and progress"
                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors font-medium shadow-sm"
              >
                <Trash2 className="w-4 h-4" />
                Clear All Data
              </button>
            </div>
          </div>
        </div>
      </section>
    </motion.div>
  );
}
