export function formatNZDateTime(
  value: string | Date | null | undefined,
) {
  if (!value) return '—';

  return new Intl.DateTimeFormat('en-NZ', {
    timeZone: 'Pacific/Auckland',
    dateStyle: 'medium',
    timeStyle: 'medium',
    hour12: false,
  }).format(new Date(value));
}

export function formatNZDate(
  value: string | Date | null | undefined,
) {
  if (!value) return '—';

  return new Intl.DateTimeFormat('en-NZ', {
    timeZone: 'Pacific/Auckland',
    dateStyle: 'long',
  }).format(new Date(value));
}