'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowDown } from 'lucide-react';
import { BarHistogram } from '@/components/BarHistogram';
import { CsvScatterSection } from '@/components/CsvScatterSection';
import { CsvObservationsTable } from '@/components/CsvObservationsTable';
import { CsvRow } from '@/lib/csv';
import { getMetricCounts, rowsForMetric, MetricOption } from '@/lib/csvMetricResponse';
import { HistogramTableColumn } from '@/types';

interface MetricResponseExplorerProps {
  title?: string;
  rows: CsvRow[];
  metricColumn: string;
  knownMetrics: MetricOption[];
  excludeMetrics?: string[];
  /** Metric *value* to open on, e.g. `ET` — so the panel leads with a plot instead of an empty picker. */
  defaultMetric?: string;
  /** Muted line under the plot — for a section that opens on one metric, saying what is further down the page. */
  note?: string;
  xColumn: string;
  xLabel: string;
  yColumn: string;
  yLabel: string;
  tableColumns?: HistogramTableColumn[];
}

export function MetricResponseExplorer({
  title = 'Studies by response metric',
  rows,
  metricColumn,
  knownMetrics,
  excludeMetrics = [],
  defaultMetric,
  note,
  xColumn,
  xLabel,
  yColumn,
  yLabel,
  tableColumns,
}: MetricResponseExplorerProps) {
  const counts = useMemo(
    () => getMetricCounts(rows, metricColumn, knownMetrics, excludeMetrics),
    [rows, metricColumn, knownMetrics, excludeMetrics]
  );
  const [selectedLabel, setSelectedLabel] = useState<string | null>(
    () => counts.find(c => c.value === defaultMetric)?.label ?? null
  );

  const selected = counts.find(c => c.label === selectedLabel) ?? null;

  const selectedRows = useMemo(() => {
    if (!selected) return [];
    return rowsForMetric(rows, metricColumn, selected, knownMetrics, excludeMetrics);
  }, [rows, metricColumn, selected, knownMetrics, excludeMetrics]);

  const barData = counts.map(c => ({ label: c.label, count: c.count, flaggedCount: 0 }));
  const labelToMetric = new Map(barData.map((b, i) => [b.label, counts[i]]));

  // Every metric drills down in place, including those with a page of their
  // own: the panel opens on one, so a click that navigated away instead would
  // be inconsistent with the view the reader already has. The dedicated page
  // is offered alongside the results instead.
  function handleSelect(clickedLabel: string) {
    const metric = labelToMetric.get(clickedLabel);
    if (!metric || metric.inert) return;
    setSelectedLabel(prev => (prev === metric.label ? null : metric.label));
  }

  const fullPageLink = selected?.link ? (
    <Link href={selected.link} className="text-xs text-primary hover:underline">
      Full {selected.label} page →
    </Link>
  ) : null;

  return (
    <div className="my-4 space-y-4">
      {note && (
        <p className="flex items-start gap-1.5 text-xs text-stone-500">
          <ArrowDown className="mt-0.5 h-3.5 w-3.5 flex-shrink-0" strokeWidth={1.5} />
          {note}
        </p>
      )}

      {/* Plot first, then the picker: the section opens on a metric, so the
          reader meets its plot before the list of other metrics to switch to. */}
      {selected && selected.count > 0 && (
        <CsvScatterSection
          title={`Forest/land cover change vs. ${selected.label}`}
          rows={selectedRows}
          xColumn={xColumn}
          yColumn={yColumn}
          xLabel={xLabel}
          yLabel={yLabel}
        />
      )}

      <BarHistogram
        title={title}
        data={barData}
        unresolvedCount={0}
        selectedLabel={selectedLabel}
        onSelect={handleSelect}
      />

      {selected && selected.count === 0 && (
        <div className="bg-white rounded-lg border border-stone-200 p-4">
          <p className="text-sm text-stone-500">
            No studies logged yet for <strong className="text-stone-700">{selected.label}</strong>.
            This metric is tracked in the schema (<code>{metricColumn}</code>) — once a study
            reporting it is extracted, it will appear here automatically.
          </p>
          {fullPageLink && <div className="mt-2">{fullPageLink}</div>}
        </div>
      )}

      {selected && selected.count > 0 && (
        <div className="bg-white rounded-lg border border-stone-200 p-4">
          <div className="mb-3 flex items-baseline justify-between gap-3">
            <p className="text-xs text-stone-500">
              {selectedRows.length} observation{selectedRows.length === 1 ? '' : 's'} for {selected.label}
            </p>
            {fullPageLink}
          </div>
          <CsvObservationsTable rows={selectedRows} column={metricColumn} columns={tableColumns} />
        </div>
      )}
    </div>
  );
}
