import { describe, expect, it, vi, afterEach } from 'vitest';
import { createBackupFilename } from '../backup-transfer';

describe('createBackupFilename', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('creates a stable timestamped json filename', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-04-01T10:11:12.345Z'));

    expect(createBackupFilename()).toBe('vocabflow-export-2026-04-01T10-11-12-345Z.json');
  });

  it('accepts an explicit date', () => {
    expect(createBackupFilename(new Date('2025-01-15T03:04:05.006Z'))).toBe(
      'vocabflow-export-2025-01-15T03-04-05-006Z.json'
    );
  });
});
