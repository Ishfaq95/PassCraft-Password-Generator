import { useMemo, type ReactNode } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { SectionHeader } from './SectionHeader';
import { useTheme } from '@/theme';

export type SettingsGroupProps = {
  title: string;
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
};

export function SettingsGroup({ title, children, style }: SettingsGroupProps) {
  const { theme } = useTheme();

  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: {
          gap: theme.spacing.xs,
        },
        card: {
          backgroundColor: theme.colors.surface,
          borderRadius: theme.borderRadius.lg,
          overflow: 'hidden',
          borderWidth: 1,
          borderColor: theme.colors.border,
          ...theme.elevation.xs,
        },
      }),
    [theme],
  );

  return (
    <View style={[styles.container, style]}>
      <SectionHeader title={title} />
      <View style={styles.card}>{children}</View>
    </View>
  );
}
