'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { rowToWord, wordToInsert, wordToUpdate, type WordRow } from '@/lib/supabase/mappers';
import type { Word, Meaning, SrsStage, UsageMap } from '@/types';
import { newWordSrsFields } from '@/lib/srs';
import { todayDateString } from '@/lib/utils';
import { emit, subscribe } from '@/lib/events';

export function useWords(filter?: { stage?: SrsStage; search?: string }) {
  const [words, setWords] = useState<Word[] | undefined>(undefined);

  useEffect(() => {
    const supabase = createClient();

    async function fetch() {
      let query = supabase
        .from('words')
        .select('*')
        .order('created_at', { ascending: false });

      if (filter?.stage) query = query.eq('srs_stage', filter.stage);
      if (filter?.search) query = query.ilike('word', `%${filter.search}%`);

      const { data } = await query;
      setWords(data ? (data as WordRow[]).map(rowToWord) : []);
    }

    fetch();
    return subscribe('words-changed', fetch);
  }, [filter?.stage, filter?.search]);

  return words;
}

export function useWord(id: string | undefined) {
  const [word, setWord] = useState<Word | null | undefined>(undefined);

  useEffect(() => {
    if (!id) return;
    const supabase = createClient();

    async function fetch() {
      const { data } = await supabase
        .from('words')
        .select('*')
        .eq('id', id)
        .single();
      setWord(data ? rowToWord(data as WordRow) : null);
    }

    fetch();
    return subscribe('words-changed', fetch);
  }, [id]);

  return word;
}

export function useDueWords() {
  const [words, setWords] = useState<Word[] | undefined>(undefined);

  useEffect(() => {
    const supabase = createClient();
    const today = todayDateString();

    async function fetch() {
      const { data } = await supabase
        .from('words')
        .select('*')
        .lte('next_review_date', today);
      setWords(data ? (data as WordRow[]).map(rowToWord) : []);
    }

    fetch();
    return subscribe('words-changed', fetch);
  }, []);

  return words;
}

export async function addWord(data: {
  word: string;
  phonetic?: string;
  meanings: Meaning[];
  example?: string;
  notes?: string;
  usageMap?: UsageMap;
}): Promise<string> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const now = new Date().toISOString();
  const srsFields = newWordSrsFields();

  const { data: row, error } = await supabase
    .from('words')
    .insert(wordToInsert({ ...data, ...srsFields }, user.id, now))
    .select('id')
    .single();

  if (error) throw error;
  emit('words-changed');
  return row.id;
}

export async function updateWord(id: string, data: Partial<Word>) {
  const supabase = createClient();
  const { error } = await supabase
    .from('words')
    .update(wordToUpdate(data))
    .eq('id', id);
  if (error) throw error;
  emit('words-changed');
}

export async function deleteWord(id: string) {
  const supabase = createClient();
  const { error } = await supabase.from('words').delete().eq('id', id);
  if (error) throw error;
  emit('words-changed');
}
