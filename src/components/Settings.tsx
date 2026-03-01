import { motion } from 'motion/react';
import { Download, Trash2, AlertTriangle } from 'lucide-react';
import { useVocabulary } from '../hooks/useVocabulary';

export function Settings() {
  const { words } = useVocabulary();

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
        <h2 className="text-2xl font-bold text-zinc-900">Settings</h2>
        <p className="text-zinc-500 mt-2">Manage your data and preferences.</p>
      </header>

      <section className="bg-white rounded-3xl p-8 border border-zinc-200 shadow-sm space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-zinc-900 mb-4">Data Management</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-zinc-50 rounded-2xl border border-zinc-100">
              <div>
                <p className="font-medium text-zinc-900">Export Backup</p>
                <p className="text-sm text-zinc-500">Download your vocabulary as a JSON file.</p>
              </div>
              <button
                onClick={handleExport}
                aria-label="Export vocabulary backup as JSON"
                className="flex items-center gap-2 px-4 py-2 bg-white border border-zinc-200 rounded-xl text-zinc-700 hover:bg-zinc-50 transition-colors font-medium shadow-sm"
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
