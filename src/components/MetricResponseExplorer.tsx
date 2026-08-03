'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
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
  xColumn,
  xLabel,
  yColumn,
  yLabel,
  tableColumns,
}: MetricResponseExplorerProps) {
  const router = useRouter();

  const counts = useMemo(
    () => getMetricCounts(rows, metricColumn, knownMetrics, excludeMetrics),
    [rows, metricColumn, knownMetrics, excludeMetrics]
  );
  const [selectedLabel, setSelectedLabel] = useState<string | null>(null);

  const selected = counts.find(c => c.label === selectedLabel) ?? null;

  const selectedRows = useMemo(() => {
    if (!selected) return [];
    return rowsForMetric(rows, metricColumn, selected, knownMetrics, excludeMetrics);
  }, [rows, metricColumn, selected, knownMetrics, excludeMetrics]);

  const barData = counts.map(c => ({
    label: c.link ? `${c.label} ↗` : c.label,
    count: c.count,
    flaggedCount: 0,
  }));
  const labelToMetric = new Map(barData.map((b, i) => [b.label, counts[i]]));

  function handleSelect(clickedLabel: string) {
    const metric = labelToMetric.get(clickedLabel);
    if (!metric || metric.inert) return;
    if (metric.link) {
      router.push(metric.link);
      return;
    }
    setSelectedLabel(prev => (prev === metric.label ? null : metric.label));
  }

  return (
    <div className="my-4 space-y-4">
      <BarHistogram
        title={title}
        data={barData}
        unresolvedCount={0}
        selectedLabel={selectedLabel}
        onSelect={handleSelect}
      />

      {selected && !selected.link && selected.count === 0 && (
        <div className="bg-white rounded-lg border border-stone-200 p-4">
          <p className="text-sm text-stone-500">
            No studies logged yet for <strong className="text-stone-700">{selected.label}</strong>.
            This metric is tracked in the schema (<code>{metricColumn}</code>) — once a study
            reporting it is extracted, it will appear here automatically.
          </p>
        </div>
      )}

      {selected && !selected.link && selected.count > 0 && (
        <>
          <CsvScatterSection
            title={`Forest/land cover change vs. ${selected.label}`}
            rows={selectedRows}
            xColumn={xColumn}
            yColumn={yColumn}
            xLabel={xLabel}
            yLabel={yLabel}
          />
          <div className="bg-white rounded-lg border border-stone-200 p-4">
            <p className="text-xs text-stone-500 mb-3">
              {selectedRows.length} observation{selectedRows.length === 1 ? '' : 's'} for {selected.label}
            </p>
            <CsvObservationsTable rows={selectedRows} column={metricColumn} columns={tableColumns} />
          </div>
        </>
      )}
    </div>
  );
}
