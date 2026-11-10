/** Lundi de la semaine de `date`, au format AAAA-MM-JJ (heure locale). */
export function weekStartOf(date = new Date()): string {
  const d = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const shift = (d.getDay() + 6) % 7;
  d.setDate(d.getDate() - shift);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

const LONG = new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'long' });

/** « 2026-11-09 » → « 9 novembre » */
export function formatDayMonth(isoDate: string): string {
  const [y, m, d] = isoDate.split('-').map(Number);
  return LONG.format(new Date(y, m - 1, d));
}
