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

const labelStyle = { fontSize: '10px', letterSpacing: '2px' } as const;

export function WordDetail({ word }: WordDetailProps) {
  const [editing, setEditing] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const usageMap = useUsageMap();

  // Auto-persist usage map to DB whenever a new one is generated
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
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display font-semibold text-ox-ink-deep" style={{ fontSize: '18px' }}>Edit Word</h2>
          <Button variant="ghost" size="sm" onClick={() => setEditing(false)}>Cancel</Button>
        </div>
        <WordForm
          initialData={word}
          onSave={handleSave}
          submitLabel="Update Word"
        />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="font-display font-bold text-ox-ink-deep" style={{ fontSize: '40px', letterSpacing: '-0.5px' }}>
            {word.word}
          </h2>
          {word.phonetic && (
            <p className="font-serif font-light italic text-ox-muted" style={{ fontSize: '13px' }}>
              {word.phonetic}
            </p>
          )}
        </div>
        <Badge stage={word.srsStage} />
      </div>

      <Card>
        <h3 className="font-mono uppercase text-ox-muted mb-3" style={labelStyle}>Meanings</h3>
        <div className="space-y-3">
          {word.meanings.map((m, i) => (
            <div key={i}>
              {m.partOfSpeech && (
                <p className="font-mono uppercase text-ox-muted mb-0.5" style={{ fontSize: '9px', letterSpacing: '2px' }}>
                  {m.partOfSpeech}
                </p>
              )}
              <p className="font-serif text-ox-ink" style={{ fontSize: '14px', lineHeight: '1.7' }}>{m.definition}</p>
            </div>
          ))}
        </div>
      </Card>

      {word.example && (
        <Card>
          <h3 className="font-mono uppercase text-ox-muted mb-2" style={labelStyle}>Example</h3>
          <p className="font-serif italic text-ox-muted" style={{ fontSize: '13px' }}>&ldquo;{word.example}&rdquo;</p>
        </Card>
      )}

      {word.notes && (
        <Card>
          <h3 className="font-mono uppercase text-ox-muted mb-2" style={labelStyle}>Notes</h3>
          <p className="font-serif text-ox-ink" style={{ fontSize: '13px' }}>{word.notes}</p>
        </Card>
      )}

      <Card>
        {usageMap.status === 'idle' && word.usageMap ? (
          <div>
            <UsageMapTree data={word.usageMap} />
            <button
              onClick={() => usageMap.generate(word.word)}
              className="font-mono uppercase text-ox-muted hover:text-ox-accent transition-colors mt-3"
              style={labelStyle}
            >
              Regenerate ↻
            </button>
          </div>
        ) : (
          <>
            {usageMap.status === 'idle' && (
              <button
                onClick={() => usageMap.generate(word.word)}
                className="font-mono uppercase text-ox-accent hover:text-ox-ink transition-colors"
                style={labelStyle}
              >
                Generate Usage Map ↓
              </button>
            )}
            {usageMap.status === 'loading' && (
              <p className="font-mono uppercase text-ox-muted" style={labelStyle}>Generating…</p>
            )}
            {usageMap.status === 'error' && (
              <div>
                <p className="font-mono uppercase text-red-500 mb-1" style={labelStyle}>Failed to generate</p>
                <button
                  onClick={() => usageMap.generate(word.word)}
                  className="font-mono uppercase text-ox-accent hover:text-ox-ink transition-colors"
                  style={labelStyle}
                >
                  Try again
                </button>
              </div>
            )}
            {usageMap.status === 'success' && (
              <UsageMapTree data={usageMap.data} />
            )}
          </>
        )}
      </Card>

      <Card>
        <h3 className="font-mono uppercase text-ox-muted mb-3" style={labelStyle}>SRS Info</h3>
        <div className="grid grid-cols-2 gap-2">
          <div className="font-mono uppercase text-ox-muted" style={{ fontSize: '9px', letterSpacing: '1px' }}>Interval</div>
          <div className="font-serif text-ox-ink" style={{ fontSize: '13px' }}>{word.interval === 0 ? 'New' : formatInterval(word.interval)}</div>
          <div className="font-mono uppercase text-ox-muted" style={{ fontSize: '9px', letterSpacing: '1px' }}>Ease Factor</div>
          <div className="font-serif text-ox-ink" style={{ fontSize: '13px' }}>{word.easeFactor.toFixed(2)}</div>
          <div className="font-mono uppercase text-ox-muted" style={{ fontSize: '9px', letterSpacing: '1px' }}>Next Review</div>
          <div className="font-serif text-ox-ink" style={{ fontSize: '13px' }}>{formatDate(word.nextReviewDate)}</div>
          <div className="font-mono uppercase text-ox-muted" style={{ fontSize: '9px', letterSpacing: '1px' }}>Added</div>
          <div className="font-serif text-ox-ink" style={{ fontSize: '13px' }}>{formatDate(word.createdAt)}</div>
        </div>
      </Card>

      <div className="flex gap-2">
        <Button variant="secondary" onClick={() => setEditing(true)} className="flex-1">Edit</Button>
        <Button variant="danger" onClick={() => setShowDelete(true)} className="flex-1">Delete</Button>
      </div>

      <Modal open={showDelete} onClose={() => setShowDelete(false)} title="Delete Word">
        <p className="font-serif text-ox-muted mb-4" style={{ fontSize: '13px' }}>
          Are you sure you want to delete &ldquo;{word.word}&rdquo;? This cannot be undone.
        </p>
        <div className="flex gap-2 justify-end">
          <Button variant="secondary" onClick={() => setShowDelete(false)}>Cancel</Button>
          <Button variant="danger" onClick={handleDelete}>Delete</Button>
        </div>
      </Modal>
    </div>
  );
}
