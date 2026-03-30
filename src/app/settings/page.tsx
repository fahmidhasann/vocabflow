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

      await supabase.from('words').delete().eq('user_id', user.id);
      await supabase.from('review_sessions').delete().eq('user_id', user.id);

      const now = new Date().toISOString();

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
    <PageShell
      eyebrow="Settings"
      title="Account and data"
      description="Export your learning history, import a backup, or reset the app if you want to start fresh."
    >
      <div className="grid gap-6 lg:grid-cols-[1.1fr,0.9fr]">
        <Card variant="hero" padding="lg">
          <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-ox-muted">Data management</p>
          <h2 className="mt-2 font-display text-[28px] font-semibold italic text-ox-ink-deep">
            Move your library safely
          </h2>
          <p className="mt-3 font-serif text-[15px] leading-7 text-ox-muted">
            Export creates a portable JSON backup. Import replaces the current cloud data with the file you choose.
          </p>

          <div className="mt-6 space-y-4">
            <div className="rounded-[24px] border border-ox-line bg-ox-surface px-4 py-4">
              <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-ox-muted">Export</p>
              <p className="mt-2 font-serif text-[14px] leading-6 text-ox-ink">
                Download your words and review history as a timestamped JSON file.
              </p>
              <Button variant="secondary" onClick={handleExport} className="mt-4 w-full sm:w-auto">
                Export Data
              </Button>
            </div>

            <div className="rounded-[24px] border border-ox-line bg-ox-surface px-4 py-4">
              <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-ox-muted">Import</p>
              <p className="mt-2 font-serif text-[14px] leading-6 text-ox-ink">
                Restore from a previous export. Import clears current words and review sessions before loading the file.
              </p>
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
                className="mt-4 w-full sm:w-auto"
              >
                Import Data
              </Button>
            </div>
          </div>
        </Card>

        <div className="space-y-6">
          <Card padding="lg">
            <p className="font-mono text-[10px] uppercase tracking-[0.26em] text-ox-muted">About</p>
            <h3 className="mt-2 font-display text-[24px] font-semibold text-ox-ink-deep">VocabFlow</h3>
            <p className="mt-3 font-serif text-[15px] leading-7 text-ox-muted">
              A spaced-repetition vocabulary app designed for deliberate daily practice instead of passive collection.
            </p>
            <div className="mt-5 rounded-2xl border border-ox-line bg-ox-surface-alt px-4 py-4">
              <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-ox-muted">Version</p>
              <p className="mt-2 font-serif text-[14px] text-ox-ink">v1.0.0</p>
            </div>
          </Card>

          <Card padding="lg" className="border-ox-danger/30">
            <p className="font-mono text-[10px] uppercase tracking-[0.26em] text-ox-danger">Danger zone</p>
            <h3 className="mt-2 font-display text-[24px] font-semibold text-ox-ink-deep">Clear all data</h3>
            <p className="mt-3 font-serif text-[15px] leading-7 text-ox-muted">
              Remove all words, review sessions, and local app state from your account. This cannot be undone.
            </p>
            <Button variant="danger" onClick={() => setShowClearModal(true)} className="mt-5 w-full sm:w-auto">
              Clear Everything
            </Button>
          </Card>
        </div>
      </div>

      <Modal open={showClearModal} onClose={() => setShowClearModal(false)} title="Clear all data">
        <p className="mb-5 font-serif text-[15px] leading-7 text-ox-muted">
          This permanently deletes your words, review sessions, and saved app state from the current account.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
          <Button variant="secondary" onClick={() => setShowClearModal(false)}>Cancel</Button>
          <Button variant="danger" onClick={handleClear}>Clear Everything</Button>
        </div>
      </Modal>
    </PageShell>
  );
}
