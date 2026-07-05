import { memo, useCallback } from 'react';

import { AnimatedListItem } from '@/components/AnimatedListItem';
import { HistoryPasswordCard } from '@/components/HistoryPasswordCard';
import type { StoredPassword } from '@/types';
import { formatCreatedAt } from '@/utils/formatCreatedAt';

export type HistoryPasswordListItemProps = {
  item: StoredPassword;
  index: number;
  highlightQuery: string;
  onFavoriteToggle: (id: string, isFavorite: boolean) => void;
  onCopy: (password: string) => void;
  onDelete?: (id: string) => void;
};

export const HistoryPasswordListItem = memo(function HistoryPasswordListItem({
  item,
  index,
  highlightQuery,
  onFavoriteToggle,
  onCopy,
  onDelete,
}: HistoryPasswordListItemProps) {
  const handleFavorite = useCallback(
    () => onFavoriteToggle(item.id, !item.isFavorite),
    [item.id, item.isFavorite, onFavoriteToggle],
  );
  const handleCopy = useCallback(
    () => onCopy(item.password),
    [item.password, onCopy],
  );
  const handleDelete = useCallback(() => {
    onDelete?.(item.id);
  }, [item.id, onDelete]);

  return (
    <AnimatedListItem index={index}>
      <HistoryPasswordCard
        title={item.title}
        email={item.username}
        password={item.password}
        highlightQuery={highlightQuery}
        createdAtLabel={formatCreatedAt(item.createdAt)}
        strength={item.strength}
        isFavorite={item.isFavorite}
        onFavoritePress={handleFavorite}
        onCopyPress={handleCopy}
        onDeletePress={onDelete ? handleDelete : undefined}
      />
    </AnimatedListItem>
  );
},
areHistoryListItemPropsEqual);

function areHistoryListItemPropsEqual(
  prev: HistoryPasswordListItemProps,
  next: HistoryPasswordListItemProps,
): boolean {
  return (
    prev.item.id === next.item.id &&
    prev.item.password === next.item.password &&
    prev.item.title === next.item.title &&
    prev.item.username === next.item.username &&
    prev.item.isFavorite === next.item.isFavorite &&
    prev.item.createdAt === next.item.createdAt &&
    prev.item.strength === next.item.strength &&
    prev.index === next.index &&
    prev.highlightQuery === next.highlightQuery &&
    prev.onFavoriteToggle === next.onFavoriteToggle &&
    prev.onCopy === next.onCopy &&
    prev.onDelete === next.onDelete
  );
}
