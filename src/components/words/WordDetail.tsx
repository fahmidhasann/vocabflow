'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Modal } from '@/components/ui/Modal';
import { WordForm } from './WordForm';
import { updateWord, deleteWord } from '@/hooks/useWords';
import { useToast } from '@/components/ui/Toast';
import { useUsageMap } from '@/hooks/useUsageMap';
import { UsageMapTree } from './UsageMapTree';
import { formatDate } from '@/lib/utils';
import { formatInterval } from '@/lib/srs';
import type { Word } from '@/types';

interface WordDetailProps {
  word: Word;
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <p className="font-mono text-[10px] uppercase tracking-[0.26em] text-ox-muted">{children}</p>;
}

export function WordDetail({ word }: WordDetailProps) {
  const [editing, setEditing] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const usageMap = useUsageMap();

  useEffect(() => {
    if (usageMap.status === 'success' && word.id) {
      updateWord(word.id, { usageMap: usageMap.data });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [usageMap.status]);

  async function handleSave(data: Parameters<typeof updateWord>[1]) {
    if (!word.id) return;
    await updateWord(word.id, data);
    setEditing(false);
    toast('Word updated');
  }

  async function handleDelete() {
    if (!word.id) return;
    await deleteWord(word.id);
    toast('Word deleted');
    router.push('/words');
  }

  if (editing) {
    return (
      <div className="space-y-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <SectionLabel>Edit</SectionLabel>
            <h2 className="mt-2 font-display text-[30px] font-semibold text-ox-ink-deep">Update this word</h2>
            <p className="mt-2 font-serif text-[15px] leading-7 text-ox-muted">
              Refine the definition, notes, or example without changing its review history.
            </p>
          </div>
          <Button variant="secondary" onClick={() => setEditing(false)}>Cancel</Button>
        </div>

        <Card padding="lg">
          <WordForm
            initialData={word}
            onSave={handleSave}
            submitLabel="Update Word"
          />
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <Card variant="hero" padding="lg">
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <SectionLabel>Word profile</SectionLabel>
              <h2 className="mt-3 font-display text-[46px] font-semibold leading-none text-ox-ink-deep md:text-[58px]">
                {word.word}
              </h2>
              {word.phonetic && (
                <p className="mt-3 font-serif text-[16px] italic text-ox-muted">
                  {word.phonetic}
                </p>
              )}
            </div>
            <Badge stage={word.srsStage} />
          </div>

          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-2xl border border-ox-line bg-ox-surface px-4 py-4">
              <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-ox-muted">Interval</p>
              <p className="mt-2 font-serif text-[15px] text-ox-ink">{word.interval === 0 ? 'New card' : formatInterval(word.interval)}</p>
            </div>
            <div className="rounded-2xl border border-ox-line bg-ox-surface px-4 py-4">
              <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-ox-muted">Ease factor</p>
              <p className="mt-2 font-serif text-[15px] text-ox-ink">{word.easeFactor.toFixed(2)}</p>
            </div>
            <div className="rounded-2xl border border-ox-line bg-ox-surface px-4 py-4">
              <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-ox-muted">Next review</p>
              <p className="mt-2 font-serif text-[15px] text-ox-ink">{formatDate(word.nextReviewDate)}</p>
            </div>
            <div className="rounded-2xl border border-ox-line bg-ox-surface px-4 py-4">
              <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-ox-muted">Added</p>
              <p className="mt-2 font-serif text-[15px] text-ox-ink">{formatDate(word.createdAt)}</p>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button variant="secondary" onClick={() => setEditing(true)} className="sm:min-w-[150px]">Edit Word</Button>
            <Button variant="ghost" onClick={() => setShowDelete(true)} className="text-ox-danger hover:bg-ox-danger-soft hover:text-ox-danger sm:min-w-[150px]">
              Delete Word
            </Button>
          </div>
        </div>
      </Card>

      <Card padding="lg">
        <SectionLabel>Meanings</SectionLabel>
        <div className="mt-4 space-y-3">
          {word.meanings.map((m, i) => (
            <div key={i} className="rounded-2xl border border-ox-line bg-ox-surface-alt px-4 py-4">
              {m.partOfSpeech && (
                <p className="mb-2 font-mono text-[9px] uppercase tracking-[0.18em] text-ox-muted">
                  {m.partOfSpeech}
                </p>
              )}
              <p className="font-serif text-[15px] leading-7 text-ox-ink">{m.definition}</p>
            </div>
          ))}
        </div>
      </Card>

      {(word.example || word.notes) && (
        <div className="grid gap-5 lg:grid-cols-2">
          {word.example && (
            <Card padding="lg">
              <SectionLabel>Example</SectionLabel>
              <p className="mt-4 font-serif text-[15px] italic leading-7 text-ox-muted">&ldquo;{word.example}&rdquo;</p>
            </Card>
          )}

          {word.notes && (
            <Card padding="lg">
              <SectionLabel>Notes</SectionLabel>
              <p className="mt-4 font-serif text-[15px] leading-7 text-ox-ink">{word.notes}</p>
            </Card>
          )}
        </div>
      )}

      <Card padding="lg">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <SectionLabel>Usage map</SectionLabel>
            <p className="mt-2 font-serif text-[15px] leading-7 text-ox-muted">
              Keep this optional. It is useful when you want more context around how the word tends to appear.
            </p>
          </div>

          {usageMap.status === 'idle' && (
            <Button variant="secondary" onClick={() => usageMap.generate(word.word)}>
              {word.usageMap ? 'Regenerate Map' : 'Generate Map'}
            </Button>
          )}
        </div>

        <div className="mt-5">
          {usageMap.status === 'idle' && word.usageMap && (
            <UsageMapTree data={word.usageMap} />
          )}
          {usageMap.status === 'loading' && (
            <p className="font-serif text-[14px] text-ox-muted">Generating usage map...</p>
          )}
          {usageMap.status === 'error' && (
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="font-serif text-[14px] text-ox-danger">Failed to generate the usage map.</p>
              <Button variant="ghost" onClick={() => usageMap.generate(word.word)}>Try Again</Button>
            </div>
          )}
          {usageMap.status === 'success' && (
            <UsageMapTree data={usageMap.data} />
          )}
        </div>
      </Card>

      <Modal open={showDelete} onClose={() => setShowDelete(false)} title="Delete word">
        <p className="mb-5 font-serif text-[15px] leading-7 text-ox-muted">
          Delete &ldquo;{word.word}&rdquo; from your library and remove it from future review sessions.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
          <Button variant="secondary" onClick={() => setShowDelete(false)}>Cancel</Button>
          <Button variant="danger" onClick={handleDelete}>Delete</Button>
        </div>
      </Modal>
    </div>
  );
}
