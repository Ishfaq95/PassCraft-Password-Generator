const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const UNTITLED_PASSWORD_LABEL = 'Untitled';

export function normalizePasswordTitle(title: string): string {
  return title.trim();
}

export function normalizePasswordEmail(email: string): string | undefined {
  const trimmed = email.trim();
  return trimmed || undefined;
}

export function validatePasswordTitle(title: string): string | undefined {
  if (!normalizePasswordTitle(title)) {
    return 'Title is required';
  }

  return undefined;
}

export function validatePasswordEmail(email: string): string | undefined {
  const trimmed = email.trim();

  if (!trimmed) {
    return undefined;
  }

  if (!EMAIL_PATTERN.test(trimmed)) {
    return 'Enter a valid email address';
  }

  return undefined;
}

export function getPasswordDisplayTitle(title?: string): string {
  const normalized = title ? normalizePasswordTitle(title) : '';
  return normalized || UNTITLED_PASSWORD_LABEL;
}
