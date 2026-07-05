import {
  filterPasswordHistory,
  getHighlightSegments,
  matchesPasswordSearch,
  normalizeSearchQuery,
} from '@/utils/passwordSearch';

describe('passwordSearch', () => {
  const items = [
    {
      id: '1',
      password: 'Tr9#kL2$mNx@7pQw',
      title: 'Gmail',
      username: 'alex@email.com',
    },
    {
      id: '2',
      password: 'Hw5!vB8@nKp#3xLz',
      title: 'Netflix',
    },
    { id: '3', password: 'abc123', title: 'Work VPN' },
  ];

  it('normalizes search queries', () => {
    expect(normalizeSearchQuery('  AbC  ')).toBe('abc');
  });

  it('filters password history by password, title, and email', () => {
    expect(filterPasswordHistory(items, '')).toHaveLength(3);
    expect(filterPasswordHistory(items, 'kL2')).toHaveLength(1);
    expect(filterPasswordHistory(items, 'gmail')).toHaveLength(1);
    expect(filterPasswordHistory(items, 'alex@email.com')).toHaveLength(1);
    expect(filterPasswordHistory(items, 'netflix')).toHaveLength(1);
    expect(filterPasswordHistory(items, 'missing')).toHaveLength(0);
  });

  it('matches password search case-insensitively', () => {
    expect(matchesPasswordSearch(items[0], 'kl2')).toBe(true);
    expect(matchesPasswordSearch(items[0], 'gmail')).toBe(true);
    expect(matchesPasswordSearch(items[0], 'alex')).toBe(true);
    expect(matchesPasswordSearch(items[0], 'ZZZ')).toBe(false);
  });

  it('builds highlight segments for all matches', () => {
    expect(getHighlightSegments('abcabc', 'ab')).toEqual([
      { text: 'ab', highlighted: true },
      { text: 'c', highlighted: false },
      { text: 'ab', highlighted: true },
      { text: 'c', highlighted: false },
    ]);
  });

  it('returns plain text when query is empty', () => {
    expect(getHighlightSegments('password', '')).toEqual([
      { text: 'password', highlighted: false },
    ]);
  });
});
