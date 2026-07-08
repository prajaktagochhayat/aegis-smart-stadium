import { describe, it, expect } from 'vitest';
import { formatDateTime } from '@aegis/utils';

describe('Sanity Test Suite', () => {
  it('should successfully run a basic test and assert truthiness', () => {
    expect(true).toBe(true);
  });

  it('should correctly import and use @aegis/utils', () => {
    const isoString = '2026-07-07T12:00:00Z';
    const result = formatDateTime(isoString);
    expect(result).toBeDefined();
    expect(typeof result).toBe('string');
  });
});
