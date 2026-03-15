'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Modal } from '@/components/ui/Modal';
import { WordForm } from './WordForm';
import { updateWord, deleteWord } from '@/hooks/useWords';
import { useToast } from '@/components/ui/Toast';
import { formatDate } from '@/lib/utils';
import { formatInterval } from '@/lib/srs';
import type { Word } from '@/types';

interface WordDetailProps {
  word: Word;
}

export function WordDetail({ word }: WordDetailProps) {
  const [editing, setEditing] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

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
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Edit Word</h2>
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
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{word.word}</h2>
          {word.phonetic && (
            <p className="text-gray-500 dark:text-gray-400">{word.phonetic}</p>
          )}
        </div>
        <Badge stage={word.srsStage} />
      </div>

      <Card>
        <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-2">Meanings</h3>
        <div className="space-y-2">
          {word.meanings.map((m, i) => (
            <div key={i}>
              {m.partOfSpeech && (
                <span className="text-sm font-medium text-indigo-600 dark:text-indigo-400 italic">{m.partOfSpeech}</span>
              )}
              <p className="text-gray-700 dark:text-gray-300 text-sm">{m.definition}</p>
            </div>
          ))}
        </div>
      </Card>

      {word.example && (
        <Card>
          <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-1">Example</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 italic">&ldquo;{word.example}&rdquo;</p>
        </Card>
      )}

      {word.notes && (
        <Card>
          <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-1">Notes</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">{word.notes}</p>
        </Card>
      )}

      <Card>
        <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-2">SRS Info</h3>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="text-gray-500 dark:text-gray-400">Interval</div>
          <div className="text-gray-900 dark:text-gray-100">{word.interval === 0 ? 'New' : formatInterval(word.interval)}</div>
          <div className="text-gray-500 dark:text-gray-400">Ease Factor</div>
          <div className="text-gray-900 dark:text-gray-100">{word.easeFactor.toFixed(2)}</div>
          <div className="text-gray-500 dark:text-gray-400">Next Review</div>
          <div className="text-gray-900 dark:text-gray-100">{formatDate(word.nextReviewDate)}</div>
          <div className="text-gray-500 dark:text-gray-400">Added</div>
          <div className="text-gray-900 dark:text-gray-100">{formatDate(word.createdAt)}</div>
        </div>
      </Card>

      <div className="flex gap-2">
        <Button variant="secondary" onClick={() => setEditing(true)} className="flex-1">Edit</Button>
        <Button variant="danger" onClick={() => setShowDelete(true)} className="flex-1">Delete</Button>
      </div>

      <Modal open={showDelete} onClose={() => setShowDelete(false)} title="Delete Word">
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
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
