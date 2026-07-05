export type HighlightSegment = {
  text: string;
  highlighted: boolean;
};

export type SearchablePassword = {
  password: string;
  title?: string;
  username?: string;
};

export function normalizeSearchQuery(query: string): string {
  return query.trim().toLowerCase();
}

function getSearchableFields(item: SearchablePassword): string[] {
  return [item.password, item.title ?? '', item.username ?? ''];
}

export function matchesPasswordSearch(
  item: SearchablePassword,
  query: string,
): boolean {
  const normalizedQuery = normalizeSearchQuery(query);

  if (!normalizedQuery) {
    return true;
  }

  return getSearchableFields(item).some(field =>
    field.toLowerCase().includes(normalizedQuery),
  );
}

export function filterPasswordHistory<T extends SearchablePassword>(
  items: T[],
  query: string,
): T[] {
  const normalizedQuery = normalizeSearchQuery(query);

  if (!normalizedQuery) {
    return items;
  }

  return items.filter(item => matchesPasswordSearch(item, normalizedQuery));
}

export function getHighlightSegments(
  text: string,
  query: string,
): HighlightSegment[] {
  const normalizedQuery = normalizeSearchQuery(query);

  if (!normalizedQuery) {
    return [{ text, highlighted: false }];
  }

  const lowerText = text.toLowerCase();
  const segments: HighlightSegment[] = [];
  let start = 0;
  let matchIndex = lowerText.indexOf(normalizedQuery, start);

  while (matchIndex !== -1) {
    if (matchIndex > start) {
      segments.push({
        text: text.slice(start, matchIndex),
        highlighted: false,
      });
    }

    segments.push({
      text: text.slice(matchIndex, matchIndex + normalizedQuery.length),
      highlighted: true,
    });

    start = matchIndex + normalizedQuery.length;
    matchIndex = lowerText.indexOf(normalizedQuery, start);
  }

  if (start < text.length) {
    segments.push({
      text: text.slice(start),
      highlighted: false,
    });
  }

  return segments.length > 0 ? segments : [{ text, highlighted: false }];
}
