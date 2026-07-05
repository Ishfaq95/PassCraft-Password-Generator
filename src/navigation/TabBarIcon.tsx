import { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';

import { AppIcon, appIconAccessibility, type AppIconKey } from '@/assets/icons';
import { brand } from '@/assets/branding';
import { useTheme } from '@/theme';

type TabBarIconProps = {
  name: AppIconKey;
  focused: boolean;
  highlighted?: boolean;
};

export function TabBarIcon({
  name,
  focused,
  highlighted = false,
}: TabBarIconProps) {
  const { theme } = useTheme();

  const styles = useMemo(
    () =>
      StyleSheet.create({
        highlightedContainer: {
          width: 52,
          height: 52,
          borderRadius: theme.borderRadius.full,
          backgroundColor: theme.colors.primary,
          alignItems: 'center',
          justifyContent: 'center',
          marginTop: -theme.spacing.lg,
          ...theme.elevation.lg,
        },
        defaultContainer: {
          alignItems: 'center',
          justifyContent: 'center',
          width: 32,
          height: 32,
        },
      }),
    [theme],
  );

  if (highlighted) {
    return (
      <View
        style={styles.highlightedContainer}
        accessibilityLabel={appIconAccessibility[name]}
      >
        <AppIcon
          name={name}
          variant="filled"
          size={brand.iconSystem.tabSize}
          color={theme.colors.onPrimary}
        />
      </View>
    );
  }

  return (
    <View style={styles.defaultContainer}>
      <AppIcon
        name={name}
        variant={focused ? 'filled' : 'outline'}
        size={brand.iconSystem.tabSize}
        color={focused ? theme.colors.primary : theme.colors.iconSecondary}
      />
    </View>
  );
}
