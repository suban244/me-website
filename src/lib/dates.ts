const MONTH = { month: 'short' } as const;

const mon = (d: Date) => d.toLocaleDateString('en-US', MONTH);

/**
 * Human range for a timeline entry.
 *
 *   Feb 2026 – present      ongoing
 *   Jan – Mar 2024          same year, so the year is stated once
 *   Nov 2023 – Mar 2024     spans a year boundary
 *
 * Months matter here: two of the roles are three-month stints that would
 * otherwise both collapse to a bare "2024".
 */
export function rangeLabel(start: Date, end: Date | null): string {
  const from = `${mon(start)} ${start.getFullYear()}`;
  if (!end) return `${from} – present`;
  if (start.getFullYear() === end.getFullYear()) {
    return `${mon(start)} – ${mon(end)} ${end.getFullYear()}`;
  }
  return `${from} – ${mon(end)} ${end.getFullYear()}`;
}

/** Short label for the timeline's left rail. */
export const startYear = (d: Date) => String(d.getFullYear());

export const formatDate = (d: Date) =>
  d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
