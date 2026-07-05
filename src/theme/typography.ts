import { Platform, type TextStyle } from 'react-native';

export const fontFamily = {
  regular: Platform.select({
    ios: 'System',
    android: 'sans-serif',
    default: 'System',
  }),
  medium: Platform.select({
    ios: 'System',
    android: 'sans-serif-medium',
    default: 'System',
  }),
  semibold: Platform.select({
    ios: 'System',
    android: 'sans-serif-medium',
    default: 'System',
  }),
  bold: Platform.select({
    ios: 'System',
    android: 'sans-serif-bold',
    default: 'System',
  }),
  mono: Platform.select({
    ios: 'Menlo',
    android: 'monospace',
    default: 'monospace',
  }),
} as const;

export const fontWeight = {
  regular: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
} as const;

export const fontSize = {
  xs: 11,
  sm: 12,
  md: 14,
  lg: 16,
  xl: 18,
  '2xl': 20,
  '3xl': 24,
  '4xl': 28,
  '5xl': 32,
  '6xl': 40,
} as const;

export const lineHeight = {
  tight: 1.2,
  snug: 1.35,
  normal: 1.5,
  relaxed: 1.625,
} as const;

export const letterSpacing = {
  tighter: -0.5,
  tight: -0.25,
  normal: 0,
  wide: 0.25,
  wider: 0.5,
} as const;

const scale = (
  size: number,
  lh: number,
): Pick<TextStyle, 'fontSize' | 'lineHeight'> => ({
  fontSize: size,
  lineHeight: Math.round(size * lh),
});

export const typography = {
  displayLarge: {
    ...scale(fontSize['6xl'], lineHeight.tight),
    fontFamily: fontFamily.bold,
    fontWeight: fontWeight.bold,
    letterSpacing: letterSpacing.tighter,
  },
  displayMedium: {
    ...scale(fontSize['5xl'], lineHeight.tight),
    fontFamily: fontFamily.bold,
    fontWeight: fontWeight.bold,
    letterSpacing: letterSpacing.tighter,
  },
  displaySmall: {
    ...scale(fontSize['4xl'], lineHeight.tight),
    fontFamily: fontFamily.semibold,
    fontWeight: fontWeight.semibold,
    letterSpacing: letterSpacing.tight,
  },
  headlineLarge: {
    ...scale(fontSize['3xl'], lineHeight.snug),
    fontFamily: fontFamily.semibold,
    fontWeight: fontWeight.semibold,
    letterSpacing: letterSpacing.tight,
  },
  headlineMedium: {
    ...scale(fontSize['2xl'], lineHeight.snug),
    fontFamily: fontFamily.semibold,
    fontWeight: fontWeight.semibold,
    letterSpacing: letterSpacing.normal,
  },
  headlineSmall: {
    ...scale(fontSize.xl, lineHeight.snug),
    fontFamily: fontFamily.semibold,
    fontWeight: fontWeight.semibold,
    letterSpacing: letterSpacing.normal,
  },
  titleLarge: {
    ...scale(fontSize.lg, lineHeight.normal),
    fontFamily: fontFamily.medium,
    fontWeight: fontWeight.medium,
    letterSpacing: letterSpacing.normal,
  },
  titleMedium: {
    ...scale(fontSize.md, lineHeight.normal),
    fontFamily: fontFamily.medium,
    fontWeight: fontWeight.medium,
    letterSpacing: letterSpacing.wide,
  },
  titleSmall: {
    ...scale(fontSize.sm, lineHeight.normal),
    fontFamily: fontFamily.medium,
    fontWeight: fontWeight.medium,
    letterSpacing: letterSpacing.wide,
  },
  bodyLarge: {
    ...scale(fontSize.lg, lineHeight.relaxed),
    fontFamily: fontFamily.regular,
    fontWeight: fontWeight.regular,
    letterSpacing: letterSpacing.normal,
  },
  bodyMedium: {
    ...scale(fontSize.md, lineHeight.relaxed),
    fontFamily: fontFamily.regular,
    fontWeight: fontWeight.regular,
    letterSpacing: letterSpacing.normal,
  },
  bodySmall: {
    ...scale(fontSize.sm, lineHeight.relaxed),
    fontFamily: fontFamily.regular,
    fontWeight: fontWeight.regular,
    letterSpacing: letterSpacing.normal,
  },
  labelLarge: {
    ...scale(fontSize.md, lineHeight.normal),
    fontFamily: fontFamily.medium,
    fontWeight: fontWeight.medium,
    letterSpacing: letterSpacing.wide,
  },
  labelMedium: {
    ...scale(fontSize.sm, lineHeight.normal),
    fontFamily: fontFamily.medium,
    fontWeight: fontWeight.medium,
    letterSpacing: letterSpacing.wider,
  },
  labelSmall: {
    ...scale(fontSize.xs, lineHeight.normal),
    fontFamily: fontFamily.medium,
    fontWeight: fontWeight.medium,
    letterSpacing: letterSpacing.wider,
  },
  mono: {
    ...scale(fontSize.md, lineHeight.normal),
    fontFamily: fontFamily.mono,
    fontWeight: fontWeight.regular,
    letterSpacing: letterSpacing.normal,
  },
  monoSmall: {
    ...scale(fontSize.sm, lineHeight.normal),
    fontFamily: fontFamily.mono,
    fontWeight: fontWeight.regular,
    letterSpacing: letterSpacing.normal,
  },
} as const satisfies Record<string, TextStyle>;

export type Typography = typeof typography;
