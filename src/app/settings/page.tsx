'use client';

import { useState, useRef } from 'react';
import { PageShell } from '@/components/layout/PageShell';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { useToast } from '@/components/ui/Toast';
import { db } from '@/lib/db';

export default function SettingsPage() {
  const [showClearModal, setShowClearModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  async function handleExport() {
    try {
      const words = await db.words.toArray();
      const sessions = await db.reviewSessions.toArray();
      const appState = await db.appState.toArray();

      const data = { words, reviewSessions: sessions, appState, exportedAt: new Date().toISOString() };
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = url;
      a.download = `vocabflow-export-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);

      toast('Data exported successfully');
    } catch {
      toast('Export failed', 'error');
    }
  }

  async function handleImport(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const data = JSON.parse(text);

      if (!data.words || !Array.isArray(data.words)) {
        throw new Error('Invalid format');
      }

      // Clear existing data first
      await db.words.clear();
      await db.reviewSessions.clear();
      await db.appState.clear();

      // Import
      if (data.words.length > 0) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        await db.words.bulkAdd(data.words.map(({ id, ...rest }: Record<string, unknown>) => rest));
      }
      if (data.reviewSessions?.length > 0) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        await db.reviewSessions.bulkAdd(data.reviewSessions.map(({ id, ...rest }: Record<string, unknown>) => rest));
      }
      if (data.appState?.length > 0) {
        await db.appState.bulkPut(data.appState);
      }

      toast(`Imported ${data.words.length} words`);
    } catch {
      toast('Import failed. Check file format.', 'error');
    }

    // Reset input
    if (fileInputRef.current) fileInputRef.current.value = '';
  }

  async function handleClear() {
    try {
      await db.words.clear();
      await db.reviewSessions.clear();
      await db.appState.clear();
      setShowClearModal(false);
      toast('All data cleared');
    } catch {
      toast('Failed to clear data', 'error');
    }
  }

  return (
    <PageShell title="Settings">
      <div className="space-y-4">
        <Card>
          <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-3">Data Management</h3>
          <div className="space-y-3">
            <Button variant="secondary" onClick={handleExport} className="w-full">
              Export Data (JSON)
            </Button>

            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={handleImport}
                className="hidden"
                id="import-input"
              />
              <Button
                variant="secondary"
                onClick={() => fileInputRef.current?.click()}
                className="w-full"
              >
                Import Data (JSON)
              </Button>
            </div>

            <Button variant="danger" onClick={() => setShowClearModal(true)} className="w-full">
              Clear All Data
            </Button>
          </div>
        </Card>

        <Card>
          <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-2">About</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            VocabFlow v1.0.0 — A vocabulary learning app with spaced repetition.
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            All data is stored locally on your device.
          </p>
        </Card>
      </div>

      <Modal open={showClearModal} onClose={() => setShowClearModal(false)} title="Clear All Data">
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          This will permanently delete all your words, review sessions, and settings. This action cannot be undone.
        </p>
        <div className="flex gap-2 justify-end">
          <Button variant="secondary" onClick={() => setShowClearModal(false)}>Cancel</Button>
          <Button variant="danger" onClick={handleClear}>Clear Everything</Button>
        </div>
      </Modal>
    </PageShell>
  );
}
