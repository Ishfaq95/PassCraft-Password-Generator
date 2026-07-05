import { useCallback, useMemo } from 'react';
import { FlatList, Platform, StyleSheet, View } from 'react-native';

import { AnimatedScreen } from '@/components/AnimatedScreen';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { EmptyState } from '@/components/EmptyState';
import { HistoryPasswordListItem } from '@/components/HistoryPasswordListItem';
import { ScreenHeader } from '@/components/ScreenHeader';
import { SearchBar } from '@/components/SearchBar';
import { useToast } from '@/components/Toast/ToastContext';
import { AppError } from '@/errors';
import {
  usePasswordActions,
  usePasswordDeletion,
  usePasswordHistory,
  usePasswordSearch,
} from '@/hooks';
import { useAppError } from '@/hooks/useAppError';
import type { StoredPassword } from '@/types';
import { useTheme } from '@/theme';

const LIST_PERFORMANCE = {
  initialNumToRender: 10,
  maxToRenderPerBatch: 8,
  windowSize: 7,
  removeClippedSubviews: Platform.OS === 'android',
} as const;

function HistoryListSeparator() {
  const { theme } = useTheme();
  return <View style={{ height: theme.spacing.md }} />;
}

function buildHistorySubtitle(
  totalCount: number,
  resultCount: number,
  hasActiveQuery: boolean,
): string {
  if (totalCount === 0) {
    return 'No generated passwords yet';
  }

  if (hasActiveQuery) {
    return `${resultCount} of ${totalCount} password${
      totalCount === 1 ? '' : 's'
    }`;
  }

  return `${totalCount} generated password${totalCount === 1 ? '' : 's'}`;
}

export function HistoryScreen() {
  const { theme } = useTheme();
  const { showToast } = useToast();
  const { showError } = useAppError();
  const { passwords, refresh, setFavorite } = usePasswordHistory();
  const { requestDeletePassword, confirmDialogProps } = usePasswordDeletion({
    onChanged: refresh,
  });
  const { copyPassword } = usePasswordActions();
  const {
    query,
    setQuery,
    normalizedQuery,
    results,
    hasActiveQuery,
    totalCount,
    resultCount,
  } = usePasswordSearch(passwords);

  const handleDeleteRequest = useCallback(
    (id: string) => {
      const exists = passwords.some(password => password.id === id);

      if (!exists) {
        showError(AppError.storageNotFound());
        return;
      }

      requestDeletePassword(id);
    },
    [passwords, requestDeletePassword, showError],
  );

  const handleFavoriteToggle = useCallback(
    (id: string, isFavorite: boolean) => {
      const updated = setFavorite(id, isFavorite);

      if (updated) {
        showToast({
          message: isFavorite ? 'Added to favorites' : 'Removed from favorites',
          type: 'success',
        });
      }
    },
    [setFavorite, showToast],
  );

  const renderItem = useCallback(
    ({ item, index }: { item: StoredPassword; index: number }) => (
      <HistoryPasswordListItem
        item={item}
        index={index}
        highlightQuery={normalizedQuery}
        onFavoriteToggle={handleFavoriteToggle}
        onCopy={copyPassword}
        onDelete={handleDeleteRequest}
      />
    ),
    [normalizedQuery, handleFavoriteToggle, copyPassword, handleDeleteRequest],
  );

  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: {
          flex: 1,
          backgroundColor: theme.colors.background,
        },
        list: {
          padding: theme.spacing.lg,
          flexGrow: 1,
        },
        empty: {
          flex: 1,
          justifyContent: 'center',
        },
      }),
    [theme],
  );

  const subtitle = buildHistorySubtitle(
    totalCount,
    resultCount,
    hasActiveQuery,
  );

  return (
    <AnimatedScreen style={styles.container}>
      <ScreenHeader title="History" subtitle={subtitle} showBorder={false} />
      <SearchBar
        value={query}
        onChangeText={setQuery}
        placeholder="Search title, email, or password…"
      />
      <FlatList
        data={results}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        ItemSeparatorComponent={HistoryListSeparator}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        extraData={normalizedQuery}
        {...LIST_PERFORMANCE}
        ListEmptyComponent={
          <View style={styles.empty}>
            <EmptyState
              icon="time-outline"
              title={hasActiveQuery ? 'No matches found' : 'No history yet'}
              description={
                hasActiveQuery
                  ? 'Try a different search term.'
                  : 'Generated passwords will appear here automatically.'
              }
            />
          </View>
        }
        renderItem={renderItem}
      />
      {confirmDialogProps ? <ConfirmDialog {...confirmDialogProps} /> : null}
    </AnimatedScreen>
  );
}
