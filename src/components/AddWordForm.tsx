import { useState } from 'react';
import { useVocabulary } from '../hooks/useVocabulary';
import { motion } from 'motion/react';
import { CheckCircle2, XCircle, Sparkles, Loader2 } from 'lucide-react';
import { getWordDetails } from '../services/geminiService';

export function AddWordForm({ onAdded }: { onAdded: () => void }) {
  const { addWord } = useVocabulary();
  const [word, setWord] = useState('');
  const [definition, setDefinition] = useState('');
  const [personalExample, setPersonalExample] = useState('');
  const [keyword, setKeyword] = useState('');
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleMagicFill = async () => {
    if (!word.trim()) {
      setStatus('error');
      return;
    }

    setIsGenerating(true);
    setStatus('idle');
    try {
      const details = await getWordDetails(word.trim());
      setDefinition(details.definition);
      setPersonalExample(details.personalExample);
      setKeyword(details.keyword);
    } catch (error) {
      console.error('Magic Fill failed', error);
      setStatus('error');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!word || !definition) {
      setStatus('error');
      return;
    }

    addWord({
      word: word.trim(),
      definition: definition.trim(),
      personalExample: personalExample.trim(),
      keyword: keyword.trim(),
    });

    setStatus('success');
    setTimeout(() => {
      setStatus('idle');
      setWord('');
      setDefinition('');
      setPersonalExample('');
      setKeyword('');
      onAdded();
    }, 1500);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-2xl mx-auto bg-white p-8 rounded-3xl shadow-sm border border-zinc-100"
    >
      <header className="mb-8">
        <h2 className="text-2xl font-bold text-zinc-900">Add a New Word</h2>
        <p className="text-zinc-500 mt-2">Save words the moment you encounter them.</p>
      </header>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label htmlFor="word" className="block text-sm font-medium text-zinc-700">
              Word <span className="text-red-500">*</span>
            </label>
            <input
              id="word"
              type="text"
              value={word}
              onChange={(e) => setWord(e.target.value)}
              placeholder="e.g., Ephemeral"
              className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all text-lg font-serif"
              required
            />
            <button
              type="button"
              onClick={handleMagicFill}
              disabled={isGenerating || !word.trim()}
              className="mt-2 flex items-center gap-2 text-sm font-semibold text-emerald-600 hover:text-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isGenerating ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Sparkles className="w-4 h-4" />
              )}
              AI Magic Fill
            </button>
          </div>

          <div className="space-y-2">
            <label htmlFor="definition" className="block text-sm font-medium text-zinc-700">
              Definition (in your words) <span className="text-red-500">*</span>
            </label>
            <input
              id="definition"
              type="text"
              value={definition}
              onChange={(e) => setDefinition(e.target.value)}
              placeholder="Lasting for a very short time"
              className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="personalExample" className="block text-sm font-medium text-zinc-700">
            Personal Example (Make it stick)
          </label>
          <textarea
            id="personalExample"
            value={personalExample}
            onChange={(e) => setPersonalExample(e.target.value)}
            placeholder="My motivation to go to the gym is often ephemeral."
            className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all min-h-[100px] resize-y"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="keyword" className="block text-sm font-medium text-zinc-700">
            Keyword / Mnemonic (Optional)
          </label>
          <input
            id="keyword"
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="e.g., 'phantom' - here today, gone tomorrow"
            className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
          />
        </div>

        <div className="pt-4 flex items-center justify-between">
          <div className="flex-1">
            {status === 'success' && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center text-emerald-600 font-medium gap-2"
              >
                <CheckCircle2 className="w-5 h-5" />
                Word saved successfully!
              </motion.div>
            )}
            {status === 'error' && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center text-red-600 font-medium gap-2"
              >
                <XCircle className="w-5 h-5" />
                Please fill in the required fields.
              </motion.div>
            )}
          </div>
          <button
            type="submit"
            className="bg-zinc-900 text-white font-semibold py-3 px-8 rounded-xl shadow-sm hover:bg-zinc-800 transition-colors focus:ring-4 focus:ring-zinc-200"
          >
            Save Word
          </button>
        </div>
      </form>
    </motion.div>
  );
}
