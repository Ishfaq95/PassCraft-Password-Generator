import { useCallback, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';

import { useAppError } from '@/hooks/useAppError';
import { passwordStorageService } from '@/services/passwordStorage';
import type { StoredPassword } from '@/types';

export function usePasswordHistory() {
  const { showError } = useAppError();
  const [passwords, setPasswords] = useState<StoredPassword[]>([]);

  const refresh = useCallback(() => {
    try {
      setPasswords(passwordStorageService.getPasswords());
    } catch (error) {
      showError(error);
    }
  }, [showError]);

  useFocusEffect(
    useCallback(() => {
      refresh();
    }, [refresh]),
  );

  const deletePassword = useCallback(
    (id: string) => {
      try {
        const removed = passwordStorageService.deletePassword(id);

        if (removed) {
          refresh();
        }

        return removed;
      } catch (error) {
        showError(error);
        return null;
      }
    },
    [refresh, showError],
  );

  const setFavorite = useCallback(
    (id: string, isFavorite: boolean) => {
      try {
        const updated = isFavorite
          ? passwordStorageService.favoritePassword(id)
          : passwordStorageService.removeFavorite(id);

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
    passwords,
    refresh,
    deletePassword,
    setFavorite,
  };
}
