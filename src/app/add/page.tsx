'use client';

import { useState } from 'react';
import Link from 'next/link';
import { PageShell } from '@/components/layout/PageShell';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { WordSearchInput } from '@/components/words/WordSearchInput';
import { WordForm } from '@/components/words/WordForm';
import { UsageMapTree } from '@/components/words/UsageMapTree';
import { useDictionaryLookup } from '@/hooks/useDictionaryLookup';
import { useUsageMap } from '@/hooks/useUsageMap';
import { addWord } from '@/hooks/useWords';
import { useToast } from '@/components/ui/Toast';
import { createClient } from '@/lib/supabase/client';

const blankWord = { word: '', meanings: [{ partOfSpeech: '', definition: '' }] };

export default function AddWordPage() {
  const dictionary = useDictionaryLookup();
  const usageMap = useUsageMap();
  const [manualEntry, setManualEntry] = useState(false);
  const [saving, setSaving] = useState(false);
  const [savedWord, setSavedWord] = useState<{ word: string; id: string } | null>(null);
  const { toast } = useToast();

  function handleSearch(word: string) {
    setManualEntry(false);
    usageMap.reset();
    dictionary.lookup(word);
  }

  function startManualEntry() {
    dictionary.reset();
    usageMap.reset();
    setManualEntry(true);
  }

  async function handleSave(data: Parameters<typeof addWord>[0]) {
    setSaving(true);
    try {
      const supabase = createClient();
      const { data: existing } = await supabase
        .from('words')
        .select('id')
        .ilike('word', data.word.trim())
        .limit(1)
        .single();

      if (existing) {
        toast(`"${data.word}" is already in your vocabulary`, 'error');
        setSaving(false);
        return;
      }

      const id = await addWord({
        ...data,
        ...(usageMap.status === 'success' ? { usageMap: usageMap.data } : {}),
      });
      setSavedWord({ word: data.word, id });
      setManualEntry(false);
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

  const showForm = manualEntry || dictionary.status === 'success' || dictionary.status === 'error';

  if (savedWord) {
    return (
      <PageShell
        eyebrow="Capture vocabulary"
        title="Word saved"
        description="The new card is in your library and ready for the next review cycle."
      >
        <Card variant="hero" padding="lg" className="mx-auto max-w-2xl text-center">
          <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-ox-muted">Saved successfully</p>
          <p className="mt-4 font-display text-[48px] font-semibold leading-none text-ox-ink-deep md:text-[56px]">
            {savedWord.word}
          </p>
          <p className="mx-auto mt-4 max-w-xl font-serif text-[15px] leading-7 text-ox-muted">
            Review it right away, open the detail view, or continue adding while you are in capture mode.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link href="/review">
              <Button size="lg" className="w-full sm:w-auto">Review Now</Button>
            </Link>
            <Link href={`/words/detail?id=${savedWord.id}`}>
              <Button variant="secondary" size="lg" className="w-full sm:w-auto">View Word</Button>
            </Link>
            <Button variant="soft" size="lg" onClick={() => setSavedWord(null)} className="w-full sm:w-auto">
              Add Another
            </Button>
          </div>
        </Card>
      </PageShell>
    );
  }

  return (
    <PageShell
      eyebrow="Capture vocabulary"
      title="Add a new word"
      description="Look it up first when you can, then tune the meaning, notes, and optional usage map before saving."
      actions={(
        <Button variant="ghost" onClick={startManualEntry}>
          Add Manually
        </Button>
      )}
    >
      <Card variant="hero" padding="lg">
        <WordSearchInput onSearch={handleSearch} loading={dictionary.status === 'loading'} />
      </Card>

      {dictionary.status === 'loading' && (
        <Card variant="subtle" padding="lg" className="text-center">
          <p className="font-mono text-[10px] uppercase tracking-[0.26em] text-ox-muted">Looking up word</p>
          <p className="mt-3 font-serif text-[15px] text-ox-ink">Fetching dictionary details so you can edit before saving.</p>
        </Card>
      )}

      {dictionary.status === 'error' && (
        <Card variant="subtle" padding="lg">
          <p className="font-mono text-[10px] uppercase tracking-[0.26em] text-ox-danger">Lookup unavailable</p>
          <p className="mt-3 font-serif text-[15px] leading-7 text-ox-ink">
            {dictionary.error}. You can still add the word manually below.
          </p>
        </Card>
      )}

      {manualEntry && dictionary.status === 'idle' && (
        <Card variant="subtle" padding="lg">
          <p className="font-mono text-[10px] uppercase tracking-[0.26em] text-ox-muted">Manual entry</p>
          <p className="mt-3 font-serif text-[15px] leading-7 text-ox-muted">
            Use this when you already know the definition or when lookup is unavailable.
          </p>
        </Card>
      )}

      {dictionary.status === 'success' && (
        <Card padding="lg">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.26em] text-ox-muted">Lookup result</p>
              <h2 className="mt-2 font-display text-[28px] font-semibold text-ox-ink-deep">{dictionary.data.word}</h2>
              {dictionary.data.phonetic && (
                <p className="mt-1 font-serif text-[15px] italic text-ox-muted">{dictionary.data.phonetic}</p>
              )}
            </div>
            <div className="rounded-2xl border border-ox-line bg-ox-surface-alt px-4 py-3 text-center">
              <p className="font-display text-[26px] font-semibold text-ox-accent">{dictionary.data.meanings.length}</p>
              <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-ox-muted">Meaning groups</p>
            </div>
          </div>
        </Card>
      )}

      {dictionary.status === 'success' && (
        <Card padding="lg">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.26em] text-ox-muted">Optional enrichment</p>
                <p className="mt-2 font-serif text-[15px] leading-7 text-ox-muted">
                  Generate a usage map if you want a broader sense of where the word appears. It is secondary to saving the word itself.
                </p>
              </div>

              {usageMap.status === 'idle' && (
                <Button variant="secondary" onClick={() => wordForMap && usageMap.generate(wordForMap)}>
                  Generate Usage Map
                </Button>
              )}
            </div>

            {usageMap.status === 'loading' && (
              <p className="font-serif text-[14px] text-ox-muted">Generating usage map...</p>
            )}

            {usageMap.status === 'error' && (
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="font-serif text-[14px] text-ox-danger">Failed to generate a usage map this time.</p>
                <Button variant="ghost" onClick={() => wordForMap && usageMap.generate(wordForMap)}>
                  Try Again
                </Button>
              </div>
            )}

            {usageMap.status === 'success' && (
              <UsageMapTree data={usageMap.data} />
            )}
          </div>
        </Card>
      )}

      {showForm && (
        <Card padding="lg">
          <WordForm
            initialData={dictionary.status === 'success' ? dictionary.data : blankWord}
            onSave={handleSave}
            saving={saving}
          />
        </Card>
      )}
    </PageShell>
  );
}
