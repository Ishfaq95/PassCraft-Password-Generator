import { brand } from '@/assets/branding';
import { getStrengthLabel } from '@/services/password';
import type { StoredPassword } from '@/types';

function formatExportTimestamp(timestamp: number): string {
  return new Date(timestamp).toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    second: '2-digit',
  });
}

export function formatPasswordExport(
  passwords: StoredPassword[],
  exportedAt = new Date(),
): string {
  const header = [
    `${brand.name} Password Export`,
    `Exported: ${formatExportTimestamp(exportedAt.getTime())}`,
    `Total passwords: ${passwords.length}`,
    '='.repeat(40),
    '',
  ].join('\n');

  const entries = passwords.map((password, index) => {
    const lines = [
      `[${index + 1}]`,
      `Title: ${password.title?.trim() || 'Untitled'}`,
    ];

    if (password.username) {
      lines.push(`Email: ${password.username}`);
    }

    lines.push(
      `Password: ${password.password}`,
      `Created: ${formatExportTimestamp(password.createdAt)}`,
    );

    if (password.strength !== undefined) {
      lines.push(`Strength: ${getStrengthLabel(password.strength)}`);
    }

    lines.push(`Favorite: ${password.isFavorite ? 'Yes' : 'No'}`);

    if (password.length !== undefined) {
      lines.push(`Length: ${password.length}`);
    }

    return lines.join('\n');
  });

  return `${header}${entries.join('\n\n')}\n`;
}
