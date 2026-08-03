import { CsvRow } from '@/lib/csv';

export interface MetricOption {
  value: string;
  label: string;
  /** If set, selecting this metric navigates to `${link}?metric=${value}` instead of drilling down in place — for metrics whose detail lives on another page. */
  link?: string;
  /** If true, this metric is shown for context (e.g. it's already detailed elsewhere on the same page) but isn't clickable. */
  inert?: boolean;
}

export interface MetricCount extends MetricOption {
  count: number;
}

export const OTHER_METRIC_VALUE = '__other__';

/**
 * Counts rows per value of `metricColumn`, excluding `excludeMetrics` (values
 * with their own dedicated page elsewhere). `knownMetrics` are guaranteed to
 * appear even with a count of 0 — unlike `countByCategory`, this deliberately
 * surfaces "we track this but have no studies yet" rather than omitting it,
 * since the point of this picker is partly to show coverage gaps.
 *
 * Any row whose value isn't in `knownMetrics` and isn't excluded is folded
 * into a single trailing "Other" bucket rather than getting its own bar —
 * an unrecognized value showing up as a raw, un-prettified label is more
 * confusing than useful, and a schema-drift signal belongs in one place
 * (the Other count going non-zero), not scattered across ad hoc bars.
 */
export function getMetricCounts(
  rows: CsvRow[],
  metricColumn: string,
  knownMetrics: MetricOption[],
  excludeMetrics: string[] = []
): MetricCount[] {
  const excludeSet = new Set(excludeMetrics);
  const knownValues = new Set(knownMetrics.map(m => m.value));
  const counts = new Map<string, number>();
  let otherCount = 0;

  rows.forEach(row => {
    const raw = row[metricColumn];
    if (!raw || excludeSet.has(raw)) return;
    if (knownValues.has(raw)) {
      counts.set(raw, (counts.get(raw) ?? 0) + 1);
    } else {
      otherCount += 1;
    }
  });

  const knownByValue = new Map(knownMetrics.map(m => [m.value, m]));
  knownMetrics.forEach(m => {
    if (!counts.has(m.value)) counts.set(m.value, 0);
  });

  const result: MetricCount[] = Array.from(counts.entries()).map(([value, count]) => {
    const known = knownByValue.get(value);
    return {
      value,
      label: known?.label ?? value.replace(/_/g, ' '),
      link: known?.link,
      inert: known?.inert,
      count,
    };
  });

  result.push({ value: OTHER_METRIC_VALUE, label: 'Other', count: otherCount });

  return result.sort((a, b) => b.count - a.count || a.label.localeCompare(b.label));
}

/** Rows belonging to a metric bucket — handles the synthetic "Other" bucket, whose rows aren't matched by a single value. */
export function rowsForMetric(rows: CsvRow[], metricColumn: string, metric: MetricCount, knownMetrics: MetricOption[], excludeMetrics: string[] = []): CsvRow[] {
  if (metric.value !== OTHER_METRIC_VALUE) {
    return rows.filter(row => row[metricColumn] === metric.value);
  }
  const excludeSet = new Set(excludeMetrics);
  const knownValues = new Set(knownMetrics.map(m => m.value));
  return rows.filter(row => {
    const raw = row[metricColumn];
    return raw && !excludeSet.has(raw) && !knownValues.has(raw);
  });
}
