import { CsvRow } from '@/lib/csv';

export interface TrendSummary {
  count: number;
  models: string[];
  minTrend: number | null;
  maxTrend: number | null;
  periodStart: number | null;
  periodEnd: number | null;
  unit: string;
}

function toNumber(value: string | undefined): number | null {
  if (!value) return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

/** CSV unit tokens are underscore-joined machine keys (e.g. "mm_yr-2") — display with spaces instead. */
export function formatUnit(unit: string): string {
  return unit.replace(/_/g, ' ');
}

/** Overall min/max trend, full period span, and the distinct set of models across every row. */
export function summarizeTrends(rows: CsvRow[]): TrendSummary {
  const models = Array.from(new Set(rows.map(r => r.et_product).filter(Boolean))).sort((a, b) =>
    a.localeCompare(b)
  );

  let minTrend: number | null = null;
  let maxTrend: number | null = null;
  let periodStart: number | null = null;
  let periodEnd: number | null = null;

  for (const row of rows) {
    const trend = toNumber(row.trend_value);
    if (trend !== null) {
      if (minTrend === null || trend < minTrend) minTrend = trend;
      if (maxTrend === null || trend > maxTrend) maxTrend = trend;
    }

    const start = toNumber(row.period_start);
    if (start !== null && (periodStart === null || start < periodStart)) periodStart = start;

    const end = toNumber(row.period_end);
    if (end !== null && (periodEnd === null || end > periodEnd)) periodEnd = end;
  }

  return {
    count: rows.length,
    models,
    minTrend,
    maxTrend,
    periodStart,
    periodEnd,
    unit: rows[0]?.trend_unit ?? '',
  };
}

export interface TrendFilter {
  model?: string | null;
  periodStart?: number | null;
  periodEnd?: number | null;
}

/** Model match is exact; period match is overlap (row's [start, end] intersects the requested range). */
export function filterTrends(rows: CsvRow[], filter: TrendFilter): CsvRow[] {
  return rows.filter(row => {
    if (filter.model && row.et_product !== filter.model) return false;

    if (filter.periodStart != null) {
      const end = toNumber(row.period_end);
      if (end === null || end < filter.periodStart) return false;
    }

    if (filter.periodEnd != null) {
      const start = toNumber(row.period_start);
      if (start === null || start > filter.periodEnd) return false;
    }

    return true;
  });
}
