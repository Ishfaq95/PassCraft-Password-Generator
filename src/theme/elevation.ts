import { Platform, type ViewStyle } from 'react-native';

import { palette } from './colors';

type ElevationLevel = {
  elevation: number;
  shadowColor: string;
  shadowOffset: ViewStyle['shadowOffset'];
  shadowOpacity: number;
  shadowRadius: number;
};

const createElevation = (
  elevation: number,
  shadowOpacity: number,
  shadowRadius: number,
  shadowOffsetY: number,
): ElevationLevel => ({
  elevation: Platform.OS === 'android' ? elevation : 0,
  shadowColor: palette.slate900,
  shadowOffset: { width: 0, height: shadowOffsetY },
  shadowOpacity: Platform.OS === 'ios' ? shadowOpacity : 0,
  shadowRadius,
});

export const elevation = {
  none: createElevation(0, 0, 0, 0),
  xs: createElevation(1, 0.04, 2, 1),
  sm: createElevation(2, 0.06, 4, 2),
  md: createElevation(4, 0.08, 8, 4),
  lg: createElevation(8, 0.1, 16, 8),
  xl: createElevation(12, 0.12, 24, 12),
  '2xl': createElevation(16, 0.14, 32, 16),
} as const;

export const darkElevation = {
  none: createElevation(0, 0, 0, 0),
  xs: createElevation(1, 0.2, 3, 1),
  sm: createElevation(2, 0.24, 6, 2),
  md: createElevation(4, 0.28, 10, 4),
  lg: createElevation(8, 0.32, 18, 8),
  xl: createElevation(12, 0.36, 28, 12),
  '2xl': createElevation(16, 0.4, 36, 16),
} as const;

export type Elevation = Record<keyof typeof elevation, ElevationLevel>;
