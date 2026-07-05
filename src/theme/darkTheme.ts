import { animation } from './animation';
import { borderRadius } from './borderRadius';
import { darkColors } from './colors';
import { darkElevation } from './elevation';
import { spacing } from './spacing';
import type { Theme } from './types';
import { typography } from './typography';

export const darkTheme: Theme = {
  dark: true,
  colors: darkColors,
  typography,
  spacing,
  borderRadius,
  elevation: darkElevation,
  animation,
};
