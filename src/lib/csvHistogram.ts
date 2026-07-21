import { CsvRow } from '@/lib/csv';

export interface CategoryCount {
  label: string;
  count: number;
  flaggedCount: number;
}

const FLAG_SUFFIX = /\s*\(flagged\s*[-—–]\s*see note\)\s*$/i;

/**
 * Some hand-curated CSVs carry a data-quality caveat appended directly onto a
 * category value (e.g. "BWk (flagged — see note)") rather than only in a
 * notes column. That's the same category as a plain "BWk" for grouping
 * purposes — the caveat itself stays visible per-row in the table — so strip
 * it before counting/matching. A no-op for CSVs that don't use this
 * convention.
 */
export function normalizeCategory(value: string): string {
  return value.replace(FLAG_SUFFIX, '').trim();
}

export function isFlaggedCategory(value: string): boolean {
  return FLAG_SUFFIX.test(value);
}

/** Counts rows per category for a given column, blanks excluded (see countUnresolved for those). */
export function countByCategory(rows: CsvRow[], column: string): CategoryCount[] {
  const counts = new Map<string, { count: number; flaggedCount: number }>();

  for (const row of rows) {
    const raw = row[column];
    if (!raw) continue;
    const label = normalizeCategory(raw);
    const entry = counts.get(label) ?? { count: 0, flaggedCount: 0 };
    entry.count += 1;
    if (isFlaggedCategory(raw)) entry.flaggedCount += 1;
    counts.set(label, entry);
  }

  return Array.from(counts.entries())
    .map(([label, { count, flaggedCount }]) => ({ label, count, flaggedCount }))
    .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label));
}

export function countUnresolved(rows: CsvRow[], column: string): number {
  return rows.filter(row => !row[column]).length;
}
