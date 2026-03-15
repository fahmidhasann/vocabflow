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
    if (!word.trim() || meanings.length === 0) return;
    onSave({
      word: word.trim(),
      phonetic: phonetic || undefined,
      meanings: meanings.filter((m) => m.definition.trim()),
      example: example || undefined,
      notes: notes || undefined,
    });
  }

  const inputClass = 'w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm';
  const labelClass = 'block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1';

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className={labelClass}>Word</label>
        <input type="text" value={word} onChange={(e) => setWord(e.target.value)} className={inputClass} required />
      </div>

      <div>
        <label className={labelClass}>Phonetic</label>
        <input type="text" value={phonetic} onChange={(e) => setPhonetic(e.target.value)} className={inputClass} placeholder="/fəˈnɛtɪk/" />
      </div>

      <div>
        <label className={labelClass}>Meanings</label>
        <div className="space-y-3">
          {meanings.map((m, i) => (
            <div key={i} className="flex gap-2 items-start">
              <input
                type="text"
                value={m.partOfSpeech}
                onChange={(e) => updateMeaning(i, 'partOfSpeech', e.target.value)}
                className={`${inputClass} w-28 flex-shrink-0`}
                placeholder="noun"
              />
              <input
                type="text"
                value={m.definition}
                onChange={(e) => updateMeaning(i, 'definition', e.target.value)}
                className={inputClass}
                placeholder="Definition"
              />
              {meanings.length > 1 && (
                <button type="button" onClick={() => removeMeaning(i)} className="text-red-500 hover:text-red-700 p-2" aria-label="Remove meaning">
                  &times;
                </button>
              )}
            </div>
          ))}
        </div>
        <button type="button" onClick={addMeaning} className="mt-2 text-sm text-indigo-600 dark:text-indigo-400 hover:underline">
          + Add meaning
        </button>
      </div>

      <div>
        <label className={labelClass}>Example</label>
        <input type="text" value={example} onChange={(e) => setExample(e.target.value)} className={inputClass} placeholder="Use the word in a sentence..." />
      </div>

      <div>
        <label className={labelClass}>Notes</label>
        <textarea value={notes} onChange={(e) => setNotes(e.target.value)} className={`${inputClass} resize-none`} rows={2} placeholder="Personal notes..." />
      </div>

      <Button type="submit" disabled={!word.trim() || meanings.length === 0 || saving} className="w-full">
        {saving ? 'Saving...' : submitLabel}
      </Button>
    </form>
  );
}
