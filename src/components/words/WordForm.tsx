'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import type { Meaning } from '@/types';

interface WordFormProps {
  initialData: {
    word: string;
    phonetic?: string;
    meanings: Meaning[];
    example?: string;
    notes?: string;
  };
  onSave: (data: {
    word: string;
    phonetic?: string;
    meanings: Meaning[];
    example?: string;
    notes?: string;
  }) => void;
  saving?: boolean;
  submitLabel?: string;
}

export function WordForm({ initialData, onSave, saving, submitLabel = 'Save Word' }: WordFormProps) {
  const [word, setWord] = useState(initialData.word);
  const [phonetic, setPhonetic] = useState(initialData.phonetic || '');
  const [meanings, setMeanings] = useState<Meaning[]>(initialData.meanings);
  const [example, setExample] = useState(initialData.example || '');
  const [notes, setNotes] = useState(initialData.notes || '');

  function updateMeaning(index: number, field: keyof Meaning, value: string) {
    setMeanings((prev) => prev.map((m, i) => (i === index ? { ...m, [field]: value } : m)));
  }

  function addMeaning() {
    setMeanings((prev) => [...prev, { partOfSpeech: '', definition: '' }]);
  }

  function removeMeaning(index: number) {
    setMeanings((prev) => prev.filter((_, i) => i !== index));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const hasDefinition = meanings.some((m) => m.definition.trim());
    if (!word.trim() || !hasDefinition) return;
    onSave({
      word: word.trim(),
      phonetic: phonetic || undefined,
      meanings: meanings.filter((m) => m.definition.trim()),
      example: example || undefined,
      notes: notes || undefined,
    });
  }

  const inputClass = 'w-full rounded-2xl border border-ox-border bg-ox-surface px-4 py-3 font-serif text-[15px] text-ox-ink-deep placeholder:text-ox-muted placeholder:italic focus:outline-none focus:ring-2 focus:ring-ox-accent focus:border-transparent';
  const hasDefinition = meanings.some((m) => m.definition.trim());

  function SectionHeading({ title, description }: { title: string; description?: string }) {
    return (
      <div className="space-y-1">
        <p className="font-mono text-[10px] uppercase tracking-[0.26em] text-ox-muted">{title}</p>
        {description && <p className="font-serif text-[14px] text-ox-muted">{description}</p>}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <section className="space-y-4">
        <SectionHeading
          title="Core details"
          description="Keep the definition concise and memorable. You can refine the meaning after lookup."
        />

        <div>
          <label className="mb-1.5 block font-mono text-[10px] uppercase tracking-[0.22em] text-ox-muted">Word</label>
          <input type="text" value={word} onChange={(e) => setWord(e.target.value)} className={inputClass} required />
        </div>
        <div>
          <label className="mb-1.5 block font-mono text-[10px] uppercase tracking-[0.22em] text-ox-muted">Phonetic</label>
          <input type="text" value={phonetic} onChange={(e) => setPhonetic(e.target.value)} className={inputClass} placeholder="/fəˈnɛtɪk/" />
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between gap-3">
            <label className="block font-mono text-[10px] uppercase tracking-[0.22em] text-ox-muted">Meanings</label>
            <Button type="button" variant="ghost" size="sm" onClick={addMeaning}>
              Add meaning
            </Button>
          </div>
          {meanings.map((m, i) => (
            <div key={i} className="rounded-[24px] border border-ox-line bg-ox-surface-alt p-4">
              <div className="mb-3 flex items-center justify-between gap-3">
                <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-ox-muted">
                  Meaning {i + 1}
                </p>
                {meanings.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeMeaning(i)}
                    aria-label="Remove meaning"
                    className="text-ox-danger hover:bg-ox-danger-soft hover:text-ox-danger"
                  >
                    Remove
                  </Button>
                )}
              </div>

              <div className="flex flex-col gap-3">
                <input
                  type="text"
                  value={m.partOfSpeech}
                  onChange={(e) => updateMeaning(i, 'partOfSpeech', e.target.value)}
                  className={inputClass}
                  placeholder="Part of speech (e.g. noun)"
                />
                <input
                  type="text"
                  value={m.definition}
                  onChange={(e) => updateMeaning(i, 'definition', e.target.value)}
                  className={inputClass}
                  placeholder="Definition"
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <SectionHeading
          title="Optional notes"
          description="Add a sentence or a memory cue if it will help the word stick."
        />
        <div>
          <label className="mb-1.5 block font-mono text-[10px] uppercase tracking-[0.22em] text-ox-muted">Example</label>
          <input type="text" value={example} onChange={(e) => setExample(e.target.value)} className={inputClass} placeholder="Use the word in a sentence..." />
        </div>

        <div>
          <label className="mb-1.5 block font-mono text-[10px] uppercase tracking-[0.22em] text-ox-muted">Notes</label>
          <textarea value={notes} onChange={(e) => setNotes(e.target.value)} className={`${inputClass} resize-y min-h-[110px]`} rows={3} placeholder="Personal notes, mnemonics, or usage reminders..." />
        </div>
      </section>

      <Button type="submit" disabled={!word.trim() || !hasDefinition || saving} size="lg" className="w-full">
        {saving ? 'Saving...' : submitLabel}
      </Button>
    </form>
  );
}
