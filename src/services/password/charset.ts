export const CHARSET_UPPERCASE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
export const CHARSET_LOWERCASE = 'abcdefghijklmnopqrstuvwxyz';
export const CHARSET_NUMBERS = '0123456789';
export const CHARSET_SYMBOLS = '!@#$%^&*()_+-=[]{}|;:,.<>?';
export const CHARSET_AMBIGUOUS = '0O1lI|';

export type CharsetKey = 'uppercase' | 'lowercase' | 'numbers' | 'symbols';

export const CHARSET_BY_KEY: Record<CharsetKey, string> = {
  uppercase: CHARSET_UPPERCASE,
  lowercase: CHARSET_LOWERCASE,
  numbers: CHARSET_NUMBERS,
  symbols: CHARSET_SYMBOLS,
};

export function stripAmbiguousCharacters(charset: string): string {
  const ambiguous = new Set(CHARSET_AMBIGUOUS.split(''));
  return [...charset].filter(char => !ambiguous.has(char)).join('');
}

export function buildCharacterPool(options: {
  uppercase: boolean;
  lowercase: boolean;
  numbers: boolean;
  symbols: boolean;
  avoidAmbiguous: boolean;
}): { pool: string; pools: string[] } {
  const pools: string[] = [];

  if (options.uppercase) {
    pools.push(
      options.avoidAmbiguous
        ? stripAmbiguousCharacters(CHARSET_UPPERCASE)
        : CHARSET_UPPERCASE,
    );
  }
  if (options.lowercase) {
    pools.push(
      options.avoidAmbiguous
        ? stripAmbiguousCharacters(CHARSET_LOWERCASE)
        : CHARSET_LOWERCASE,
    );
  }
  if (options.numbers) {
    pools.push(
      options.avoidAmbiguous
        ? stripAmbiguousCharacters(CHARSET_NUMBERS)
        : CHARSET_NUMBERS,
    );
  }
  if (options.symbols) {
    pools.push(
      options.avoidAmbiguous
        ? stripAmbiguousCharacters(CHARSET_SYMBOLS)
        : CHARSET_SYMBOLS,
    );
  }

  const uniqueChars = [...new Set(pools.join('').split(''))];

  return {
    pool: uniqueChars.join(''),
    pools,
  };
}
