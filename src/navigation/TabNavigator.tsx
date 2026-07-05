import { useMemo } from 'react';
import { Platform, StyleSheet } from 'react-native';
import {
  createBottomTabNavigator,
  type BottomTabNavigationOptions,
} from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { appIconAccessibility } from '@/assets/icons';
import { useTheme } from '@/theme';

import {
  FavoritesStack,
  GenerateStack,
  HistoryStack,
  SettingsStack,
} from './stacks';
import { TabBarIcon } from './TabBarIcon';
import type { MainTabParamList } from './types';

const Tab = createBottomTabNavigator<MainTabParamList>();

function createTabIcon(
  name: Parameters<typeof TabBarIcon>[0]['name'],
  highlighted = false,
) {
  return function TabIcon({
    focused,
  }: {
    focused: boolean;
    color: string;
    size: number;
  }) {
    return (
      <TabBarIcon name={name} focused={focused} highlighted={highlighted} />
    );
  };
}

export function TabNavigator() {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();

  const tabBarStyle = useMemo(
    () =>
      StyleSheet.create({
        bar: {
          backgroundColor: theme.colors.surface,
          borderTopColor: theme.colors.divider,
          borderTopWidth: StyleSheet.hairlineWidth,
          height: Platform.select({
            ios: 56 + insets.bottom,
            android: 64 + insets.bottom,
            default: 64 + insets.bottom,
          }),
          paddingTop: theme.spacing.xs,
          paddingBottom: Math.max(insets.bottom, theme.spacing.xs),
          ...theme.elevation.sm,
        },
        label: {
          ...theme.typography.labelSmall,
          marginTop: theme.spacing['2xs'],
        },
        generateLabel: {
          ...theme.typography.labelSmall,
          color: theme.colors.primary,
          fontWeight: '600',
          marginTop: theme.spacing['2xs'],
        },
      }),
    [theme, insets.bottom],
  );

  const screenOptions = useMemo<BottomTabNavigationOptions>(
    () => ({
      headerShown: false,
      tabBarActiveTintColor: theme.colors.primary,
      tabBarInactiveTintColor: theme.colors.iconSecondary,
      tabBarStyle: tabBarStyle.bar,
      tabBarLabelStyle: tabBarStyle.label,
    }),
    [theme.colors.primary, theme.colors.iconSecondary, tabBarStyle],
  );

  return (
    <Tab.Navigator initialRouteName="Generate" screenOptions={screenOptions}>
      <Tab.Screen
        name="Generate"
        component={GenerateStack}
        options={{
          tabBarLabel: 'Generate',
          tabBarAccessibilityLabel: appIconAccessibility.Generate,
          tabBarIcon: createTabIcon('Generate', true),
          tabBarLabelStyle: tabBarStyle.generateLabel,
        }}
      />
      <Tab.Screen
        name="History"
        component={HistoryStack}
        options={{
          tabBarLabel: 'History',
          tabBarAccessibilityLabel: appIconAccessibility.History,
          tabBarIcon: createTabIcon('History'),
        }}
      />
      <Tab.Screen
        name="Favorites"
        component={FavoritesStack}
        options={{
          tabBarLabel: 'Favorites',
          tabBarAccessibilityLabel: appIconAccessibility.Favorites,
          tabBarIcon: createTabIcon('Favorites'),
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsStack}
        options={{
          tabBarLabel: 'Settings',
          tabBarAccessibilityLabel: appIconAccessibility.Settings,
          tabBarIcon: createTabIcon('Settings'),
        }}
      />
    </Tab.Navigator>
  );
}
