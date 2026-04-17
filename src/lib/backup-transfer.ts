import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { Share } from '@capacitor/share';
import { FilePicker } from '@capawesome/capacitor-file-picker';
import type { ReviewSessionRow, WordRow } from '@/lib/supabase/mappers';
import { isNativePlatform } from '@/lib/platform';

export interface BackupPayload {
  words: WordRow[];
  reviewSessions: ReviewSessionRow[];
  exportedAt: string;
}

export function createBackupFilename(date = new Date()): string {
  const timestamp = date.toISOString().replace(/[:.]/g, '-');
  return `vocabflow-export-${timestamp}.json`;
}

export async function exportBackup(payload: BackupPayload): Promise<void> {
  const serialized = JSON.stringify(payload, null, 2);

  if (!isNativePlatform()) {
    downloadBackup(serialized, createBackupFilename(new Date(payload.exportedAt)));
    return;
  }

  const { value } = await Share.canShare();
  if (!value) {
    throw new Error('Sharing is not available on this device');
  }

  const fileName = createBackupFilename(new Date(payload.exportedAt));
  const { uri } = await Filesystem.writeFile({
    path: `exports/${fileName}`,
    data: serialized,
    directory: Directory.Temporary,
    encoding: Encoding.UTF8,
    recursive: true,
  });

  await Share.share({
    title: 'Export VocabFlow data',
    text: 'Save or share your VocabFlow backup file.',
    files: [uri],
  });
}

export async function pickImportedBackupText(): Promise<string> {
  if (!isNativePlatform()) {
    throw new Error('Native file picking is unavailable on web');
  }

  const result = await FilePicker.pickFiles({
    types: ['application/json', 'text/json'],
    limit: 1,
    readData: true,
  });

  const file = result.files[0];
  if (!file) {
    throw new Error('No file selected');
  }

  if (typeof file.data === 'string') {
    return decodeBase64Utf8(file.data);
  }

  throw new Error('Unable to read the selected file');
}

function downloadBackup(content: string, fileName: string) {
  const blob = new Blob([content], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = fileName;
  anchor.click();

  URL.revokeObjectURL(url);
}

function decodeBase64Utf8(input: string): string {
  const base64 = input.includes(',') ? input.split(',').pop() ?? '' : input;
  const binary = atob(base64);
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}
