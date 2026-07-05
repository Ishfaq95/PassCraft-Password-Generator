import { palette } from '@/theme/colors';

export const brand = {
  name: 'SecurePass',
  tagline: 'Your passwords, protected.',
  version: '1.0.0',

  colors: {
    primary: palette.blue500,
    secondary: palette.violet500,
    accent: palette.violet500,
    background: palette.slate50,
    backgroundDark: palette.slate900,
    surface: palette.white,
    surfaceDark: palette.slate800,
  },

  logo: {
    /**
     * Shield + Keyhole mark
     * A rounded shield silhouette represents protection and trust.
     * The centered keyhole cutout signals secure credential storage.
     * Primary blue (#2563EB) with violet accent edge (#7C3AED) conveys
     * modern security — inspired by 1Password, Bitwarden, and Apple Passwords.
     */
    concept:
      'Rounded shield with centered keyhole — protection meets access control.',
    mark: {
      shieldRadius: 16,
      keyholeWidth: 12,
      keyholeHeight: 18,
    },
    wordmark: {
      fontWeight: '700' as const,
      letterSpacing: -0.5,
    },
  },

  splash: {
    backgroundLight: palette.slate50,
    backgroundDark: palette.slate900,
    logoSize: 96,
    taglineOpacity: 0.7,
  },

  iconSystem: {
    family: 'Ionicons' as const,
    defaultSize: 24,
    tabSize: 24,
    actionSize: 22,
    headerSize: 24,
  },
} as const;

export type Brand = typeof brand;
