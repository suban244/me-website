/**
 * Kinds that happen at a point in time rather than over a span. An award has
 * no end date, but it is emphatically not "present" either, so these render
 * as a single date whenever no end is given.
 */
const POINT = new Set(['publication', 'award', 'talk']);

export type Precision = 'year' | 'month' | 'day';

function stamp(d: Date, p: Precision): string {
  if (p === 'year') return String(d.getUTCFullYear());
  if (p === 'day') {
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      timeZone: 'UTC',
    });
  }
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', timeZone: 'UTC' });
}

const month = (d: Date) => d.toLocaleDateString('en-US', { month: 'short', timeZone: 'UTC' });

/**
 * Human label for a timeline entry.
 *
 *   May 7, 2025          point event (publication, award, talk)
 *   Nov 2023             a one-off, where start and end are the same
 *   Jan – Mar 2024       same year, so the year is stated once
 *   Nov 2019 – Apr 2024  spans a year boundary
 *   Feb 2026 – present   ongoing
 *
 * Months matter: two roles are three-month stints that would otherwise both
 * collapse to a bare "2024" and read as duplicates.
 */
export function eventLabel(
  kind: string,
  start: Date,
  end: Date | null,
  precision: Precision = 'month'
): string {
  if (!end) {
    if (POINT.has(kind)) return stamp(start, precision);
    return `${stamp(start, precision)} – present`;
  }

  if (end.valueOf() === start.valueOf()) return stamp(start, precision);

  if (precision !== 'year' && start.getUTCFullYear() === end.getUTCFullYear()) {
    return `${month(start)} – ${month(end)} ${end.getUTCFullYear()}`;
  }

  return `${stamp(start, precision)} – ${stamp(end, precision)}`;
}

/** Short label for the timeline's left rail. */
export const startYear = (d: Date) => String(d.getUTCFullYear());

export const formatDate = (d: Date) =>
  d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC',
  });
