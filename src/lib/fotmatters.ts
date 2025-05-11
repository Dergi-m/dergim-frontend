export function formatLocalizedTimestamp(input: string, locale = 'tr-TR'): string {
  const date = new Date(input);

  const formattedDate = new Intl.DateTimeFormat(locale, {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit',
  }).format(date);

  const formattedTime = new Intl.DateTimeFormat(locale, {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false, // Use true for AM/PM
  }).format(date);

  return `${formattedDate} - ${formattedTime}`;
}
