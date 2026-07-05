import { useCallback, useMemo, useRef, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';

import {
  appSettingsService,
  DEFAULT_GENERATOR_OPTIONS,
} from '@/services/appSettings';
import {
  generatePasswordWithCrypto,
  PASSWORD_LENGTH_MAX,
  PASSWORD_LENGTH_MIN,
  type GeneratedPassword,
  type PasswordGeneratorOptions,
} from '@/services/password';
import { getFriendlyErrorMessage } from '@/errors';

export { DEFAULT_GENERATOR_OPTIONS };

function hasEnabledCharset(options: PasswordGeneratorOptions): boolean {
  return (
    options.uppercase || options.lowercase || options.numbers || options.symbols
  );
}

export function usePasswordGenerator() {
  const [options, setOptions] = useState<PasswordGeneratorOptions>(() =>
    appSettingsService.getDefaultGeneratorOptions(),
  );
  const [result, setResult] = useState<GeneratedPassword | null>(null);
  const [error, setError] = useState<string | null>(null);
  const defaultsRevisionRef = useRef(appSettingsService.getDefaultsRevision());

  const isValid = useMemo(() => hasEnabledCharset(options), [options]);

  const applyStoredDefaults = useCallback(() => {
    const revision = appSettingsService.getDefaultsRevision();

    if (revision !== defaultsRevisionRef.current) {
      defaultsRevisionRef.current = revision;
      setOptions(appSettingsService.getDefaultGeneratorOptions());
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      applyStoredDefaults();
    }, [applyStoredDefaults]),
  );

  const generate = useCallback(() => {
    if (!hasEnabledCharset(options)) {
      const message = 'Enable at least one character type.';
      setError(message);
      setResult(null);
      return { result: null, error: message };
    }

    try {
      const generated = generatePasswordWithCrypto(options);
      setResult(generated);
      setError(null);
      return { result: generated, error: null };
    } catch (err) {
      const message = getFriendlyErrorMessage(err);
      setError(message);
      setResult(null);
      return { result: null, error: message };
    }
  }, [options]);

  const updateOptions = useCallback(
    (patch: Partial<PasswordGeneratorOptions>) => {
      setOptions(current => {
        const next = { ...current, ...patch };

        if (typeof next.length === 'number') {
          next.length = Math.min(
            PASSWORD_LENGTH_MAX,
            Math.max(PASSWORD_LENGTH_MIN, Math.round(next.length)),
          );
        }

        return next;
      });
    },
    [],
  );

  return {
    options,
    result,
    password: result?.password ?? '',
    error,
    isValid,
    generate,
    updateOptions,
    setOptions,
  };
}
