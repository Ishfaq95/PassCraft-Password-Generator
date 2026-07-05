import {
  getPasswordDisplayTitle,
  normalizePasswordEmail,
  normalizePasswordTitle,
  validatePasswordEmail,
  validatePasswordTitle,
} from '@/utils/passwordDetails';

describe('passwordDetails', () => {
  it('normalizes title and email values', () => {
    expect(normalizePasswordTitle('  Gmail  ')).toBe('Gmail');
    expect(normalizePasswordEmail('  alex@email.com  ')).toBe('alex@email.com');
    expect(normalizePasswordEmail('   ')).toBeUndefined();
  });

  it('validates required title', () => {
    expect(validatePasswordTitle('Gmail')).toBeUndefined();
    expect(validatePasswordTitle('   ')).toBe('Title is required');
  });

  it('validates optional email format', () => {
    expect(validatePasswordEmail('')).toBeUndefined();
    expect(validatePasswordEmail('alex@email.com')).toBeUndefined();
    expect(validatePasswordEmail('not-an-email')).toBe(
      'Enter a valid email address',
    );
  });

  it('falls back to untitled label for legacy entries', () => {
    expect(getPasswordDisplayTitle()).toBe('Untitled');
    expect(getPasswordDisplayTitle('   ')).toBe('Untitled');
    expect(getPasswordDisplayTitle('Gmail')).toBe('Gmail');
  });
});
