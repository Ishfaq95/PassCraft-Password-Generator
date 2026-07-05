import { useCallback, useMemo, useState } from 'react';

import { useSnackbar } from '@/components/Snackbar';
import { useAppError } from '@/hooks/useAppError';
import { AppError } from '@/errors';
import { passwordStorageService } from '@/services/passwordStorage';

type PendingDeleteAction = { type: 'single'; id: string } | { type: 'all' };

type UsePasswordDeletionOptions = {
  onChanged?: () => void;
};

export type DeleteConfirmDialogProps = {
  visible: true;
  title: string;
  message: string;
  confirmLabel: string;
  destructive: true;
  onConfirm: () => void;
  onCancel: () => void;
};

export function usePasswordDeletion({
  onChanged,
}: UsePasswordDeletionOptions = {}) {
  const { showSnackbar } = useSnackbar();
  const { showError } = useAppError();
  const [pendingAction, setPendingAction] =
    useState<PendingDeleteAction | null>(null);

  const refresh = useCallback(() => {
    onChanged?.();
  }, [onChanged]);

  const showUndoSnackbar = useCallback(
    (message: string, restore: () => void) => {
      showSnackbar({
        message,
        actionLabel: 'Undo',
        onAction: () => {
          try {
            restore();
            refresh();
            showSnackbar({
              message: 'Deletion undone',
              duration: 2500,
            });
          } catch (error) {
            showError(AppError.storageRestore(error));
          }
        },
      });
    },
    [refresh, showError, showSnackbar],
  );

  const deletePassword = useCallback(
    (id: string) => {
      try {
        const removed = passwordStorageService.deletePassword(id);

        if (!removed) {
          showError(AppError.storageNotFound());
          return false;
        }

        refresh();
        showUndoSnackbar('Password deleted', () => {
          passwordStorageService.restorePassword(removed);
        });
        return true;
      } catch (error) {
        showError(error);
        return false;
      }
    },
    [refresh, showError, showUndoSnackbar],
  );

  const deleteAll = useCallback(() => {
    try {
      const removed = passwordStorageService.clearHistory();

      refresh();

      if (removed.length === 0) {
        showSnackbar({
          message: 'No history to delete',
          duration: 2500,
        });
        return true;
      }

      const message =
        removed.length === 1
          ? '1 password deleted'
          : `${removed.length} passwords deleted`;

      showUndoSnackbar(message, () => {
        passwordStorageService.restorePasswords(removed);
      });
      return true;
    } catch (error) {
      showError(error);
      return false;
    }
  }, [refresh, showError, showSnackbar, showUndoSnackbar]);

  const requestDeletePassword = useCallback((id: string) => {
    setPendingAction({ type: 'single', id });
  }, []);

  const requestDeleteAll = useCallback(() => {
    setPendingAction({ type: 'all' });
  }, []);

  const cancelDelete = useCallback(() => {
    setPendingAction(null);
  }, []);

  const confirmDelete = useCallback(() => {
    if (!pendingAction) {
      return;
    }

    if (pendingAction.type === 'single') {
      deletePassword(pendingAction.id);
    } else {
      deleteAll();
    }

    setPendingAction(null);
  }, [deleteAll, deletePassword, pendingAction]);

  const confirmDialogProps = useMemo<DeleteConfirmDialogProps | null>(() => {
    if (!pendingAction) {
      return null;
    }

    if (pendingAction.type === 'single') {
      return {
        visible: true,
        title: 'Delete password?',
        message: 'This password will be removed from your history.',
        confirmLabel: 'Delete',
        destructive: true,
        onConfirm: confirmDelete,
        onCancel: cancelDelete,
      };
    }

    return {
      visible: true,
      title: 'Delete all history?',
      message:
        'All non-favorite passwords will be removed from your history. Favorites will be kept.',
      confirmLabel: 'Delete all',
      destructive: true,
      onConfirm: confirmDelete,
      onCancel: cancelDelete,
    };
  }, [cancelDelete, confirmDelete, pendingAction]);

  return {
    requestDeletePassword,
    requestDeleteAll,
    confirmDialogProps,
  };
}
