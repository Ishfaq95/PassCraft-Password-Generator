import { animation } from './animation';
import { borderRadius } from './borderRadius';
import { lightColors } from './colors';
import { elevation } from './elevation';
import { spacing } from './spacing';
import type { Theme } from './types';
import { typography } from './typography';

export const lightTheme: Theme = {
  dark: false,
  colors: lightColors,
  typography,
  spacing,
  borderRadius,
  elevation,
  animation,
};
