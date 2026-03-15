'use client';

import { useState, useRef } from 'react';
import { PageShell } from '@/components/layout/PageShell';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { useToast } from '@/components/ui/Toast';
import { createClient } from '@/lib/supabase/client';
import { wordToInsert, sessionToInsert, type WordRow, type ReviewSessionRow } from '@/lib/supabase/mappers';

export default function SettingsPage() {
  const [showClearModal, setShowClearModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  async function handleExport() {
    try {
      const supabase = createClient();
      const [wordsResult, sessionsResult] = await Promise.all([
        supabase.from('words').select('*'),
        supabase.from('review_sessions').select('*'),
      ]);

      const data = {
        words: wordsResult.data ?? [],
        reviewSessions: sessionsResult.data ?? [],
        exportedAt: new Date().toISOString(),
      };

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

      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Clear existing data first
      await supabase.from('words').delete().eq('user_id', user.id);
      await supabase.from('review_sessions').delete().eq('user_id', user.id);

      const now = new Date().toISOString();

      // Import words
      if (data.words.length > 0) {
        const rows = (data.words as WordRow[]).map((w) =>
          wordToInsert(
            {
              word: w.word,
              phonetic: w.phonetic ?? undefined,
              meanings: w.meanings,
              example: w.example ?? undefined,
              notes: w.notes ?? undefined,
              easeFactor: Number(w.ease_factor),
              interval: w.interval,
              repetitions: w.repetitions,
              nextReviewDate: w.next_review_date,
              srsStage: w.srs_stage,
            },
            user.id,
            now
          )
        );
        await supabase.from('words').insert(rows);
      }

      // Import sessions
      if (data.reviewSessions?.length > 0) {
        const rows = (data.reviewSessions as ReviewSessionRow[]).map((s) =>
          sessionToInsert(
            {
              date: s.date,
              wordsReviewed: s.words_reviewed,
              ratings: s.ratings,
              duration: s.duration,
              completedAt: s.completed_at,
            },
            user.id
          )
        );
        await supabase.from('review_sessions').insert(rows);
      }

      toast(`Imported ${data.words.length} words`);
    } catch {
      toast('Import failed. Check file format.', 'error');
    }

    if (fileInputRef.current) fileInputRef.current.value = '';
  }

  async function handleClear() {
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      await supabase.from('words').delete().eq('user_id', user.id);
      await supabase.from('review_sessions').delete().eq('user_id', user.id);
      await supabase.from('app_state').delete().eq('user_id', user.id);

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
            Your data is securely stored in the cloud.
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
