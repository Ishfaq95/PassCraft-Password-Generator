import { useMemo } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';

import {
  PasswordCard,
  type PasswordCardProps,
} from '@/components/PasswordCard';
import { useTheme } from '@/theme';

import type { PasswordListItem } from './mockData';

export type PasswordListProps = {
  data: PasswordListItem[];
  showFavoriteAction?: boolean;
};

function PasswordListItemCard({
  item,
  showFavoriteAction,
}: {
  item: PasswordListItem;
  showFavoriteAction?: boolean;
}) {
  const cardProps: PasswordCardProps = {
    title: item.title,
    username: item.username,
    password: item.password,
    website: item.website,
    strength: item.strength,
    isFavorite: item.isFavorite,
    onPress: () => undefined,
    onCopyPress: () => undefined,
  };

  if (showFavoriteAction) {
    cardProps.onFavoritePress = () => undefined;
  }

  return <PasswordCard {...cardProps} />;
}

function PasswordListSeparator() {
  const { theme } = useTheme();
  return <View style={{ height: theme.spacing.md }} />;
}

export function PasswordList({
  data,
  showFavoriteAction = true,
}: PasswordListProps) {
  const { theme } = useTheme();

  const styles = useMemo(
    () =>
      StyleSheet.create({
        list: {
          padding: theme.spacing.lg,
        },
      }),
    [theme],
  );

  return (
    <FlatList
      data={data}
      keyExtractor={item => item.id}
      contentContainerStyle={styles.list}
      ItemSeparatorComponent={PasswordListSeparator}
      renderItem={({ item }) => (
        <PasswordListItemCard
          item={item}
          showFavoriteAction={showFavoriteAction}
        />
      )}
      showsVerticalScrollIndicator={false}
    />
  );
}
