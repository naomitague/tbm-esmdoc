'use client';

import { useMemo, useState } from 'react';
import { BarHistogram } from '@/components/BarHistogram';
import { CsvObservationsTable } from '@/components/CsvObservationsTable';
import { CsvRow } from '@/lib/csv';
import { countByCategory, countUnresolved, normalizeCategory } from '@/lib/csvHistogram';
import { describeKoppenCode } from '@/lib/koppenGeiger';
import { HistogramTableColumn } from '@/types';

const ET_TABLE_COLUMNS: HistogramTableColumn[] = [
  { key: 'location_name', label: 'Site / study', fallback_key: 'obs_id', subtitle_key: 'study_citation' },
  {
    key: 'forest_change_value_point',
    label: 'Forest change',
    unit_key: 'forest_change_unit',
    min_key: 'forest_change_value_min',
    max_key: 'forest_change_value_max',
    caption_key: 'forest_change_metric',
    numeric: true,
  },
  {
    key: 'hydro_response_value_point',
    label: 'Hydro response',
    unit_key: 'hydro_response_unit',
    min_key: 'hydro_response_value_min',
    max_key: 'hydro_response_value_max',
    caption_key: 'hydro_response_metric',
    numeric: true,
  },
  { key: 'method_analysis', label: 'Method' },
  { key: 'watershed_area_km2', label: 'Area (km²)', numeric: true },
  { key: 'notes_flags', label: 'Notes', wrap: true, muted: true },
];

interface EtObservationsExplorerProps {
  observations: CsvRow[];
}

interface Selection {
  column: string;
  label: string;
}

export function EtObservationsExplorer({ observations }: EtObservationsExplorerProps) {
  const [selection, setSelection] = useState<Selection | null>(null);

  const koppenCounts = useMemo(() => countByCategory(observations, 'koppen_geiger'), [observations]);
  const whittakerCounts = useMemo(() => countByCategory(observations, 'whittaker_biome'), [observations]);
  const koppenUnresolved = useMemo(() => countUnresolved(observations, 'koppen_geiger'), [observations]);
  const whittakerUnresolved = useMemo(() => countUnresolved(observations, 'whittaker_biome'), [observations]);

  const selectedRows = useMemo(() => {
    if (!selection) return [];
    return observations.filter(obs => normalizeCategory(obs[selection.column] ?? '') === selection.label);
  }, [observations, selection]);

  function handleSelect(column: string, label: string) {
    setSelection(prev => (prev && prev.column === column && prev.label === label ? null : { column, label }));
  }

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="space-y-6 lg:col-span-2">
        <BarHistogram
          title="Observations by Köppen–Geiger class"
          data={koppenCounts}
          unresolvedCount={koppenUnresolved}
          selectedLabel={selection?.column === 'koppen_geiger' ? selection.label : null}
          onSelect={label => handleSelect('koppen_geiger', label)}
          describe={describeKoppenCode}
        />
        <BarHistogram
          title="Observations by Whittaker biome"
          data={whittakerCounts}
          unresolvedCount={whittakerUnresolved}
          selectedLabel={selection?.column === 'whittaker_biome' ? selection.label : null}
          onSelect={label => handleSelect('whittaker_biome', label)}
        />
      </div>

      <div className="lg:col-span-1">
        <div className="sticky top-20 bg-white rounded-lg border border-stone-200 p-5">
          <h3 className="font-heading text-base mb-1">
            {selection ? selection.label : 'Select a bar'}
          </h3>
          <p className="text-xs text-stone-500 mb-4">
            {selection
              ? `${selectedRows.length} observation${selectedRows.length === 1 ? '' : 's'}`
              : 'Click a category in either histogram to list its observations here.'}
          </p>

          {selection && (
            <CsvObservationsTable rows={selectedRows} column={selection.column} columns={ET_TABLE_COLUMNS} />
          )}
        </div>
      </div>
    </div>
  );
}
