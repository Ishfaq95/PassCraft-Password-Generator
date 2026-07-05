import { useCallback, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';

import { useAppError } from '@/hooks/useAppError';
import { passwordStorageService } from '@/services/passwordStorage';
import type { StoredPassword } from '@/types';

export function usePasswordFavorites() {
  const { showError } = useAppError();
  const [favorites, setFavorites] = useState<StoredPassword[]>([]);

  const refresh = useCallback(() => {
    try {
      setFavorites(passwordStorageService.getFavorites());
    } catch (error) {
      showError(error);
    }
  }, [showError]);

  useFocusEffect(
    useCallback(() => {
      refresh();
    }, [refresh]),
  );

  const removeFavorite = useCallback(
    (id: string) => {
      try {
        const updated = passwordStorageService.removeFavorite(id);

        if (updated) {
          refresh();
        }

        return updated;
      } catch (error) {
        showError(error);
        return null;
      }
    },
    [refresh, showError],
  );

  return {
    favorites,
    refresh,
    removeFavorite,
  };
}
