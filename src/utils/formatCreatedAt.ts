const MINUTE_MS = 60_000;
const HOUR_MS = 3_600_000;
const DAY_MS = 86_400_000;

export function formatCreatedAt(timestamp: number, now = Date.now()): string {
  const diff = Math.max(0, now - timestamp);

  if (diff < MINUTE_MS) {
    return 'Just now';
  }

  const minutes = Math.floor(diff / MINUTE_MS);

  if (minutes < 60) {
    return `${minutes} min ago`;
  }

  const hours = Math.floor(diff / HOUR_MS);

  if (hours < 24) {
    return hours === 1 ? '1 hour ago' : `${hours} hours ago`;
  }

  const days = Math.floor(diff / DAY_MS);

  if (days < 7) {
    return days === 1 ? 'Yesterday' : `${days} days ago`;
  }

  return new Date(timestamp).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}
