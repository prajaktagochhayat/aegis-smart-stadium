// AEGIS StadiumOS Shared Utilities

/**
 * Format date-time string consistently across platforms.
 */
export function formatDateTime(isoString: string): string {
  try {
    const date = new Date(isoString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  } catch {
    return '00:00:00';
  }
}

/**
 * Calculate crowd density score color indicator.
 */
export function getDensityColor(score: number): string {
  if (score < 30) return 'success'; // low (green)
  if (score < 60) return 'warning'; // medium (yellow)
  if (score < 85) return 'danger'; // high (orange)
  return 'critical'; // critical/emergency (red)
}

/**
 * Format a number as percentage.
 */
export function formatPercentage(value: number): string {
  return `${Math.min(100, Math.max(0, Math.round(value)))}%`;
}

/**
 * Generate a short UUID equivalent or random string for mock IDs.
 */
export function generateMockId(prefix: string = 'id'): string {
  return `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
}
