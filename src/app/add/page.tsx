'use client';

import { useState } from 'react';
import { PageShell } from '@/components/layout/PageShell';
import { Card } from '@/components/ui/Card';
import { WordSearchInput } from '@/components/words/WordSearchInput';
import { WordForm } from '@/components/words/WordForm';
import { UsageMapTree } from '@/components/words/UsageMapTree';
import { useDictionaryLookup } from '@/hooks/useDictionaryLookup';
import { useUsageMap } from '@/hooks/useUsageMap';
import { addWord } from '@/hooks/useWords';
import { useToast } from '@/components/ui/Toast';

const labelStyle = { fontSize: '10px', letterSpacing: '2px' } as const;

export default function AddWordPage() {
  const dictionary = useDictionaryLookup();
  const usageMap = useUsageMap();
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  function handleSearch(word: string) {
    usageMap.reset();
    dictionary.lookup(word);
  }

  async function handleSave(data: Parameters<typeof addWord>[0]) {
    setSaving(true);
    try {
      await addWord({
        ...data,
        ...(usageMap.status === 'success' ? { usageMap: usageMap.data } : {}),
      });
      toast('Word saved!');
      dictionary.reset();
      usageMap.reset();
    } catch {
      toast('Failed to save word', 'error');
    } finally {
      setSaving(false);
    }
  }

  const wordForMap =
    dictionary.status === 'success'
      ? dictionary.data.word
      : undefined;

  return (
    <PageShell title="Add Word">
      <div className="space-y-6">
        <WordSearchInput onSearch={handleSearch} loading={dictionary.status === 'loading'} />

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

        {(dictionary.status === 'success' || dictionary.status === 'error') && (
          <Card>
            {usageMap.status === 'idle' && (
              <button
                onClick={() => wordForMap && usageMap.generate(wordForMap)}
                disabled={!wordForMap}
                className="font-mono uppercase text-ox-accent hover:text-ox-ink transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                style={labelStyle}
              >
                Generate Usage Map (optional) ↓
              </button>
            )}
            {usageMap.status === 'loading' && (
              <p className="font-mono uppercase text-ox-muted" style={labelStyle}>Generating usage map…</p>
            )}
            {usageMap.status === 'error' && (
              <div>
                <p className="font-mono uppercase text-red-500 mb-1" style={labelStyle}>Failed to generate</p>
                <button
                  onClick={() => wordForMap && usageMap.generate(wordForMap)}
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
