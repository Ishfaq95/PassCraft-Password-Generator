import { useTheme } from '@/theme';

export function useStackScreenOptions() {
  const { theme } = useTheme();

  return {
    headerShown: false,
    animation: 'fade_from_bottom' as const,
    animationDuration: theme.animation.duration.normal,
  };
}
