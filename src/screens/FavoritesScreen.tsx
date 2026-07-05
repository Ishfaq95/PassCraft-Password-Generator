import { useCallback, useMemo } from 'react';
import { FlatList, Platform, StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';

import { AnimatedScreen } from '@/components/AnimatedScreen';
import { EmptyState } from '@/components/EmptyState';
import { HistoryPasswordListItem } from '@/components/HistoryPasswordListItem';
import { ScreenHeader } from '@/components/ScreenHeader';
import { SearchBar } from '@/components/SearchBar';
import { useToast } from '@/components/Toast/ToastContext';
import {
  usePasswordActions,
  usePasswordFavorites,
  usePasswordSearch,
} from '@/hooks';
import type { MainTabParamList } from '@/navigation/types';
import type { StoredPassword } from '@/types';
import { useTheme } from '@/theme';

const LIST_PERFORMANCE = {
  initialNumToRender: 10,
  maxToRenderPerBatch: 8,
  windowSize: 7,
  removeClippedSubviews: Platform.OS === 'android',
} as const;

function FavoritesListSeparator() {
  const { theme } = useTheme();
  return <View style={{ height: theme.spacing.md }} />;
}

export function FavoritesScreen() {
  const { theme } = useTheme();
  const navigation = useNavigation<BottomTabNavigationProp<MainTabParamList>>();
  const { showToast } = useToast();
  const { favorites, removeFavorite } = usePasswordFavorites();
  const { copyPassword } = usePasswordActions();
  const {
    query,
    setQuery,
    normalizedQuery,
    results,
    hasActiveQuery,
    totalCount,
    resultCount,
  } = usePasswordSearch(favorites);

  const handleRemoveFavorite = useCallback(
    (id: string) => {
      const updated = removeFavorite(id);

      if (updated) {
        showToast({
          message: 'Removed from favorites',
          type: 'success',
        });
      }
    },
    [removeFavorite, showToast],
  );

  const renderItem = useCallback(
    ({ item, index }: { item: StoredPassword; index: number }) => (
      <HistoryPasswordListItem
        item={item}
        index={index}
        highlightQuery={normalizedQuery}
        onFavoriteToggle={id => handleRemoveFavorite(id)}
        onCopy={copyPassword}
      />
    ),
    [normalizedQuery, handleRemoveFavorite, copyPassword],
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

  const subtitle =
    totalCount === 0
      ? 'Your starred passwords'
      : hasActiveQuery
      ? `${resultCount} of ${totalCount} favorite${totalCount === 1 ? '' : 's'}`
      : `${totalCount} saved password${totalCount === 1 ? '' : 's'}`;

  return (
    <AnimatedScreen style={styles.container}>
      <ScreenHeader title="Favorites" subtitle={subtitle} showBorder={false} />
      <SearchBar
        value={query}
        onChangeText={setQuery}
        placeholder="Search title, email, or password…"
      />
      <FlatList
        data={results}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        ItemSeparatorComponent={FavoritesListSeparator}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        extraData={normalizedQuery}
        {...LIST_PERFORMANCE}
        ListEmptyComponent={
          <View style={styles.empty}>
            <EmptyState
              icon="star-outline"
              title={hasActiveQuery ? 'No matches found' : 'No favorites yet'}
              description={
                hasActiveQuery
                  ? 'Try a different search term.'
                  : 'Star passwords from your history to access them quickly here.'
              }
              actionLabel={hasActiveQuery ? undefined : 'Browse History'}
              onActionPress={
                hasActiveQuery
                  ? undefined
                  : () =>
                      navigation.navigate('History', { screen: 'HistoryMain' })
              }
            />
          </View>
        }
        renderItem={renderItem}
      />
    </AnimatedScreen>
  );
}
