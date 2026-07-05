import { useMemo } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { IconButton } from './IconButton';
import { Input } from './Input';
import { useTheme } from '@/theme';

export type SearchBarProps = {
  placeholder?: string;
  value?: string;
  onChangeText?: (text: string) => void;
  clearable?: boolean;
  style?: StyleProp<ViewStyle>;
};

export function SearchBar({
  placeholder = 'Search passwords…',
  value = '',
  onChangeText,
  clearable = true,
  style,
}: SearchBarProps) {
  const { theme } = useTheme();

  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: {
          paddingHorizontal: theme.spacing.lg,
          paddingVertical: theme.spacing.sm,
          backgroundColor: theme.colors.background,
        },
        row: {
          flexDirection: 'row',
          alignItems: 'center',
          gap: theme.spacing.xs,
        },
        input: {
          flex: 1,
        },
      }),
    [theme],
  );

  const showClear = clearable && Boolean(onChangeText) && value.length > 0;

  return (
    <View style={[styles.container, style]}>
      <View style={styles.row}>
        <View style={styles.input}>
          <Input
            value={value}
            onChangeText={onChangeText}
            placeholder={placeholder}
            leftIcon="search-outline"
            accessibilityLabel="Search passwords"
            editable={Boolean(onChangeText)}
            autoCorrect={false}
            autoCapitalize="none"
            returnKeyType="search"
          />
        </View>
        {showClear ? (
          <IconButton
            icon="close-circle-outline"
            variant="ghost"
            size="sm"
            accessibilityLabel="Clear search"
            onPress={() => onChangeText?.('')}
          />
        ) : null}
      </View>
    </View>
  );
}
