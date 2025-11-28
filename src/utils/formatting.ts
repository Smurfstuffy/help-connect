/**
 * Formats a user's full name from first and last name
 * @param name - The user's first name
 * @param surname - The user's last name
 * @returns A formatted full name string, or 'Unknown User' if both are empty
 */
export function formatFullName(
  name: string | null | undefined,
  surname: string | null | undefined,
): string {
  const firstName = (name || '').trim();
  const lastName = (surname || '').trim();

  if (!firstName && !lastName) {
    return 'Unknown User';
  }

  return `${firstName} ${lastName}`.trim();
}

/**
 * Formats a date to a localized date string
 * @param date - The date to format (can be a Date object, ISO string, or timestamp)
 * @param locale - The locale to use (default: 'en-US')
 * @returns A formatted date string
 */
export function formatDate(
  date: Date | string | number,
  locale: string = 'en-US',
): string {
  const dateObj = typeof date === 'string' || typeof date === 'number'
    ? new Date(date)
    : date;

  if (isNaN(dateObj.getTime())) {
    return 'Invalid Date';
  }

  return dateObj.toLocaleDateString(locale);
}

/**
 * Formats a date to a relative time string (e.g., "2 hours ago", "in 3 days")
 * @param date - The date to format
 * @returns A relative time string
 */
export function formatRelativeTime(date: Date | string | number): string {
  const dateObj = typeof date === 'string' || typeof date === 'number'
    ? new Date(date)
    : date;

  if (isNaN(dateObj.getTime())) {
    return 'Invalid Date';
  }

  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000);
  const absDiff = Math.abs(diffInSeconds);

  // Less than a minute
  if (absDiff < 60) {
    return diffInSeconds >= 0 ? 'just now' : 'in a moment';
  }

  // Less than an hour
  if (absDiff < 3600) {
    const minutes = Math.floor(absDiff / 60);
    return diffInSeconds >= 0
      ? `${minutes} minute${minutes !== 1 ? 's' : ''} ago`
      : `in ${minutes} minute${minutes !== 1 ? 's' : ''}`;
  }

  // Less than a day
  if (absDiff < 86400) {
    const hours = Math.floor(absDiff / 3600);
    return diffInSeconds >= 0
      ? `${hours} hour${hours !== 1 ? 's' : ''} ago`
      : `in ${hours} hour${hours !== 1 ? 's' : ''}`;
  }

  // Less than a week
  if (absDiff < 604800) {
    const days = Math.floor(absDiff / 86400);
    return diffInSeconds >= 0
      ? `${days} day${days !== 1 ? 's' : ''} ago`
      : `in ${days} day${days !== 1 ? 's' : ''}`;
  }

  // Fallback to formatted date
  return formatDate(dateObj);
}

/**
 * Truncates a string to a specified length with an ellipsis
 * @param text - The text to truncate
 * @param maxLength - The maximum length before truncation
 * @returns The truncated string with ellipsis if needed
 */
export function truncateText(text: string, maxLength: number): string {
  if (!text || text.length <= maxLength) {
    return text;
  }

  return `${text.slice(0, maxLength)}...`;
}

