import type { PasswordGeneratorOptions } from '@/services/password';

export function formatDefaultLengthValue(length: number): string {
  return `${length} characters`;
}

export function formatDefaultOptionsSummary(
  options: PasswordGeneratorOptions,
): string {
  const charsets: string[] = [];

  if (options.uppercase) {
    charsets.push('A-Z');
  }

  if (options.lowercase) {
    charsets.push('a-z');
  }

  if (options.numbers) {
    charsets.push('0-9');
  }

  if (options.symbols) {
    charsets.push('!@#');
  }

  const charsetLabel = charsets.length > 0 ? charsets.join(', ') : 'None';
  const extras = options.avoidAmbiguous ? ' · No ambiguous' : '';

  return `${charsetLabel}${extras}`;
}
