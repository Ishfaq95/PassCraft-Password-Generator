export const palette = {
  blue500: '#2563EB',
  blue400: '#3B82F6',
  blue600: '#1D4ED8',
  blue100: '#DBEAFE',
  blue900: '#1E3A5F',

  violet500: '#7C3AED',
  violet400: '#8B5CF6',
  violet100: '#EDE9FE',
  violet900: '#4C1D95',

  green500: '#16A34A',
  green400: '#22C55E',
  green100: '#DCFCE7',
  green900: '#14532D',

  amber500: '#F59E0B',
  amber400: '#FBBF24',
  amber100: '#FEF3C7',
  amber900: '#78350F',

  red500: '#DC2626',
  red400: '#EF4444',
  red100: '#FEE2E2',
  red900: '#7F1D1D',

  slate50: '#F8FAFC',
  slate100: '#F1F5F9',
  slate200: '#E2E8F0',
  slate300: '#CBD5E1',
  slate400: '#94A3B8',
  slate500: '#64748B',
  slate600: '#475569',
  slate700: '#334155',
  slate800: '#1E293B',
  slate900: '#0F172A',
  slate950: '#020617',

  white: '#FFFFFF',
  black: '#000000',
  transparent: 'transparent',
} as const;

export const lightColors = {
  primary: palette.blue500,
  primaryHover: palette.blue600,
  primaryMuted: palette.blue100,
  onPrimary: palette.white,

  secondary: palette.violet500,
  secondaryHover: palette.violet400,
  secondaryMuted: palette.violet100,
  onSecondary: palette.white,

  success: palette.green500,
  successMuted: palette.green100,
  onSuccess: palette.white,

  warning: palette.amber500,
  warningMuted: palette.amber100,
  onWarning: palette.slate900,

  error: palette.red500,
  errorMuted: palette.red100,
  onError: palette.white,

  background: palette.slate50,
  backgroundSecondary: palette.slate100,
  surface: palette.white,
  surfaceElevated: palette.white,
  surfaceVariant: palette.slate100,

  text: palette.slate900,
  textSecondary: palette.slate600,
  textTertiary: palette.slate400,
  textDisabled: palette.slate300,
  textInverse: palette.white,

  border: palette.slate200,
  borderStrong: palette.slate300,
  divider: palette.slate200,

  overlay: 'rgba(15, 23, 42, 0.48)',
  scrim: 'rgba(15, 23, 42, 0.32)',
  focusRing: palette.blue500,

  icon: palette.slate600,
  iconSecondary: palette.slate400,
  iconDisabled: palette.slate300,
} as const;

export const darkColors = {
  primary: palette.blue400,
  primaryHover: palette.blue500,
  primaryMuted: palette.blue900,
  onPrimary: palette.white,

  secondary: palette.violet400,
  secondaryHover: palette.violet500,
  secondaryMuted: palette.violet900,
  onSecondary: palette.white,

  success: palette.green400,
  successMuted: palette.green900,
  onSuccess: palette.white,

  warning: palette.amber400,
  warningMuted: palette.amber900,
  onWarning: palette.slate900,

  error: palette.red400,
  errorMuted: palette.red900,
  onError: palette.white,

  background: palette.slate900,
  backgroundSecondary: palette.slate800,
  surface: palette.slate800,
  surfaceElevated: palette.slate700,
  surfaceVariant: palette.slate700,

  text: palette.slate50,
  textSecondary: palette.slate400,
  textTertiary: palette.slate500,
  textDisabled: palette.slate600,
  textInverse: palette.slate900,

  border: palette.slate700,
  borderStrong: palette.slate600,
  divider: palette.slate700,

  overlay: 'rgba(2, 6, 23, 0.64)',
  scrim: 'rgba(2, 6, 23, 0.48)',
  focusRing: palette.blue400,

  icon: palette.slate400,
  iconSecondary: palette.slate500,
  iconDisabled: palette.slate600,
} as const;

export type ThemeColors = {
  [K in keyof typeof lightColors]: string;
};
