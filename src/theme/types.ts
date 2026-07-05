import type { Animation } from './animation';
import type { BorderRadius } from './borderRadius';
import type { ThemeColors } from './colors';
import type { Elevation } from './elevation';
import type { Spacing } from './spacing';
import type { Typography } from './typography';

export type ThemeMode = 'light' | 'dark' | 'system';

export type Theme = {
  dark: boolean;
  colors: ThemeColors;
  typography: Typography;
  spacing: Spacing;
  borderRadius: BorderRadius;
  elevation: Elevation;
  animation: Animation;
};
