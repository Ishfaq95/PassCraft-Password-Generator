import { useMemo, useState } from 'react';

import { useDebouncedValue } from './useDebouncedValue';
import {
  filterPasswordHistory,
  normalizeSearchQuery,
} from '@/utils/passwordSearch';

type SearchablePassword = {
  password: string;
};

export function usePasswordSearch<T extends SearchablePassword>(
  items: T[],
  debounceMs = 250,
) {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebouncedValue(query, debounceMs);
  const normalizedQuery = useMemo(
    () => normalizeSearchQuery(debouncedQuery),
    [debouncedQuery],
  );

  const results = useMemo(
    () => filterPasswordHistory(items, debouncedQuery),
    [items, debouncedQuery],
  );

  const isSearching = normalizeSearchQuery(query) !== normalizedQuery;
  const hasActiveQuery = normalizedQuery.length > 0;

  return {
    query,
    setQuery,
    normalizedQuery,
    results,
    isSearching,
    hasActiveQuery,
    totalCount: items.length,
    resultCount: results.length,
  };
}
