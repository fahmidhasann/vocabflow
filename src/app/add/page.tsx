'use client';

import { useState } from 'react';
import { PageShell } from '@/components/layout/PageShell';
import { Card } from '@/components/ui/Card';
import { WordSearchInput } from '@/components/words/WordSearchInput';
import { WordForm } from '@/components/words/WordForm';
import { useDictionaryLookup } from '@/hooks/useDictionaryLookup';
import { addWord } from '@/hooks/useWords';
import { useToast } from '@/components/ui/Toast';

export default function AddWordPage() {
  const dictionary = useDictionaryLookup();
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  async function handleSave(data: Parameters<typeof addWord>[0]) {
    setSaving(true);
    try {
      await addWord(data);
      toast('Word saved!');
      dictionary.reset();
    } catch {
      toast('Failed to save word', 'error');
    } finally {
      setSaving(false);
    }
  }

  return (
    <PageShell title="Add Word">
      <div className="space-y-6">
        <WordSearchInput onSearch={dictionary.lookup} loading={dictionary.status === 'loading'} />

        {dictionary.status === 'loading' && (
          <Card className="text-center">
            <p className="text-gray-500 dark:text-gray-400">Looking up word...</p>
          </Card>
        )}

        {dictionary.status === 'error' && (
          <Card className="text-center">
            <p className="text-red-500">{dictionary.error}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">You can still add the word manually below.</p>
          </Card>
        )}

        {dictionary.status === 'success' && (
          <Card>
            <WordForm
              initialData={dictionary.data}
              onSave={handleSave}
              saving={saving}
            />
          </Card>
        )}

        {dictionary.status === 'error' && (
          <Card>
            <WordForm
              initialData={{ word: '', meanings: [{ partOfSpeech: '', definition: '' }] }}
              onSave={handleSave}
              saving={saving}
            />
          </Card>
        )}
      </div>
    </PageShell>
  );
}
