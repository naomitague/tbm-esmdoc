'use client';

import { useMemo, useState } from 'react';
import { BarHistogram } from '@/components/BarHistogram';
import { CsvObservationsTable } from '@/components/CsvObservationsTable';
import { CsvRow } from '@/lib/csv';
import { countByCategory, countUnresolved, normalizeCategory } from '@/lib/csvHistogram';
import { describeKoppenCode } from '@/lib/koppenGeiger';
import { HistogramTableColumn } from '@/types';

interface CsvHistogramSectionProps {
  title: string;
  column: string;
  rows: CsvRow[];
  tableColumns?: HistogramTableColumn[];
}

export function CsvHistogramSection({ title, column, rows, tableColumns }: CsvHistogramSectionProps) {
  const [selectedLabel, setSelectedLabel] = useState<string | null>(null);

  const counts = useMemo(() => countByCategory(rows, column), [rows, column]);
  const unresolvedCount = useMemo(() => countUnresolved(rows, column), [rows, column]);

  const selectedRows = useMemo(() => {
    if (!selectedLabel) return [];
    return rows.filter(row => normalizeCategory(row[column] ?? '') === selectedLabel);
  }, [rows, column, selectedLabel]);

  return (
    <div className="my-4">
      <BarHistogram
        title={title}
        data={counts}
        unresolvedCount={unresolvedCount}
        selectedLabel={selectedLabel}
        onSelect={label => setSelectedLabel(prev => (prev === label ? null : label))}
        describe={column === 'koppen_geiger' ? describeKoppenCode : undefined}
      />
      {selectedLabel && (
        <div className="mt-3 bg-white rounded-lg border border-stone-200 p-4">
          <p className="text-xs text-stone-500 mb-3">
            {selectedRows.length} observation{selectedRows.length === 1 ? '' : 's'} in {selectedLabel}
          </p>
          <CsvObservationsTable rows={selectedRows} column={column} columns={tableColumns} />
        </div>
      )}
    </div>
  );
}
