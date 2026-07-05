import { formatCreatedAt } from '@/utils/formatCreatedAt';

describe('formatCreatedAt', () => {
  const now = new Date('2026-07-05T12:00:00Z').getTime();

  it('formats recent timestamps', () => {
    expect(formatCreatedAt(now - 30_000, now)).toBe('Just now');
    expect(formatCreatedAt(now - 5 * 60_000, now)).toBe('5 min ago');
    expect(formatCreatedAt(now - 2 * 3_600_000, now)).toBe('2 hours ago');
    expect(formatCreatedAt(now - 26 * 3_600_000, now)).toBe('Yesterday');
  });
});
