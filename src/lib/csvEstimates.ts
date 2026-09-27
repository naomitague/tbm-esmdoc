import { CsvRow } from '@/lib/csv';
import { EstimateChartConfig } from '@/types';

/** One plotted estimate — a CSV row whose value column held a usable number. */
export interface EstimatePoint {
  /** Value of the config's `row_id_column`, if any — the anchor a click jumps to. */
  id?: string;
  label: string;
  sublabel?: string;
  value: number;
  min?: number;
  max?: number;
  /** `tooltip_columns`, in the order the note declared them, minus blanks. */
  details: { label: string; value: string }[];
}

export interface EstimateSeries {
  points: EstimatePoint[];
  /** Rows in the CSV, plotted or not — so the caption can say "3 of 4 estimates". */
  totalRows: number;
}

function toNumber(raw: string | undefined): number | undefined {
  if (!raw) return undefined;
  const value = parseFloat(raw);
  return Number.isFinite(value) ? value : undefined;
}

/**
 * Pulls the plottable rows out of a CSV for an `estimate_chart`. A row whose
 * `value_column` is blank or non-numeric is dropped rather than coerced —
 * that's the documented way a result reported in incomparable units (a bare
 * correlation among percentages-of-trend, say) stays in the table without
 * appearing on the axis.
 */
export function getEstimateSeries(rows: CsvRow[], config: EstimateChartConfig): EstimateSeries {
  const points: EstimatePoint[] = [];

  rows.forEach(row => {
    const value = toNumber(row[config.value_column]);
    if (value === undefined) return;

    const min = config.min_column ? toNumber(row[config.min_column]) : undefined;
    const max = config.max_column ? toNumber(row[config.max_column]) : undefined;

    points.push({
      id: config.row_id_column ? row[config.row_id_column] || undefined : undefined,
      label: row[config.label_column] ?? '',
      sublabel: config.sublabel_column ? row[config.sublabel_column] || undefined : undefined,
      value,
      // A one-sided range would draw a whisker running off to the dot itself;
      // only honour a complete pair.
      min: min !== undefined && max !== undefined ? min : undefined,
      max: min !== undefined && max !== undefined ? max : undefined,
      details: (config.tooltip_columns ?? [])
        .map(key => ({ label: key, value: (row[key] ?? '').trim() }))
        .filter(detail => detail.value.length > 0),
    });
  });

  return { points: points.sort((a, b) => a.value - b.value), totalRows: rows.length };
}
