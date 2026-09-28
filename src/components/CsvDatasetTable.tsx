'use client';

import { useMemo, useState } from 'react';
import { ExternalLink } from 'lucide-react';
import { CsvRow } from '@/lib/csv';
import { DatasetTableColumn, DatasetTableFilter } from '@/types';

interface CsvDatasetTableProps {
  rows: CsvRow[];
  columns: DatasetTableColumn[];
  /** Dropdown filters, in order. Takes precedence over `filterColumn`. */
  filters?: DatasetTableFilter[];
  /** Single-dropdown shorthand, kept for notes that already declare it. */
  filterColumn?: string;
  filterLabel?: string;
  /** Columns the free-text box searches. Defaults to every displayed column. */
  searchColumns?: string[];
  searchPlaceholder?: string;
  title?: string;
  /** Noun used in the row count, e.g. "dataset" → "12 datasets". */
  rowNoun?: string;
  /** Column whose value ids each row, so a figure elsewhere on the page can link to it. */
  rowIdColumn?: string;
  /** Prefix for those ids — must match what the linking component uses. */
  rowIdPrefix?: string;
}

function renderCell(row: CsvRow, col: DatasetTableColumn) {
  const value = (row[col.key] ?? '').trim();
  if (!value) return <span className="text-stone-400">—</span>;

  if (col.type === 'link') {
    return (
      <a
        href={value}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1 text-primary hover:underline break-all"
        title={value}
      >
        <ExternalLink className="w-3 h-3 shrink-0" strokeWidth={1.5} />
        {col.link_label ?? value}
      </a>
    );
  }

  return <span>{value}</span>;
}

/** A cell may hold several values at once ("water_yield; ET") — see DatasetTableFilter.separator. */
function cellValues(raw: string, separator?: string): string[] {
  const value = (raw ?? '').trim();
  if (!value) return [];
  if (!separator) return [value];
  return value.split(separator).map(part => part.trim()).filter(Boolean);
}

export function CsvDatasetTable({
  rows,
  columns,
  filters,
  filterColumn,
  filterLabel,
  searchColumns,
  searchPlaceholder,
  title,
  rowNoun = 'row',
  rowIdColumn,
  rowIdPrefix = 'estimate-',
}: CsvDatasetTableProps) {
  // One selection per filter column, keyed by column name; 'all' means no
  // constraint. The single-column shorthand is normalized into the same shape
  // so there's only one code path below.
  const activeFilters = useMemo<DatasetTableFilter[]>(() => {
    if (filters && filters.length > 0) return filters;
    return filterColumn ? [{ column: filterColumn, label: filterLabel }] : [];
  }, [filters, filterColumn, filterLabel]);

  const [selected, setSelected] = useState<Record<string, string>>({});
  const [query, setQuery] = useState<string>('');

  const filterOptions = useMemo(() => {
    return activeFilters.map(filter => {
      const seen = new Set<string>();
      rows.forEach(row => {
        cellValues(row[filter.column] ?? '', filter.separator).forEach(value => seen.add(value));
      });
      return { filter, values: Array.from(seen).sort((a, b) => a.localeCompare(b)) };
    });
  }, [rows, activeFilters]);

  // Search across whichever columns the note named, falling back to every
  // column actually on screen — searching hidden columns would surface rows
  // with no visible reason for matching.
  const searchKeys = useMemo(
    () => (searchColumns && searchColumns.length > 0 ? searchColumns : columns.map(col => col.key)),
    [searchColumns, columns]
  );

  const visibleRows = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return rows.filter(row => {
      const passesFilters = activeFilters.every(filter => {
        const chosen = selected[filter.column];
        if (!chosen || chosen === 'all') return true;
        return cellValues(row[filter.column] ?? '', filter.separator).includes(chosen);
      });
      if (!passesFilters) return false;
      if (!needle) return true;
      return searchKeys.some(key => (row[key] ?? '').toLowerCase().includes(needle));
    });
  }, [rows, query, activeFilters, selected, searchKeys]);

  const anyFilterActive = Object.values(selected).some(value => value && value !== 'all');

  if (rows.length === 0 || columns.length === 0) return null;

  return (
    <div className="my-6 not-prose">
      {title && <h4 className="text-sm font-heading text-stone-800 mb-3">{title}</h4>}

      <div className="flex flex-wrap items-center gap-3 mb-3">
        {filterOptions.map(({ filter, values }) =>
          values.length === 0 ? null : (
            <div key={filter.column} className="flex items-center gap-2">
              <label
                htmlFor={`dataset-filter-${filter.column}`}
                className="text-sm font-medium text-stone-600"
              >
                {filter.label ?? filter.column}:
              </label>
              <select
                id={`dataset-filter-${filter.column}`}
                value={selected[filter.column] ?? 'all'}
                onChange={e =>
                  setSelected(prev => ({ ...prev, [filter.column]: e.target.value }))
                }
                className="text-sm border border-stone-300 rounded-md px-2 py-1 bg-white text-stone-800 focus:outline-none focus:ring-2 focus:ring-primary/40"
              >
                <option value="all">All</option>
                {values.map(value => (
                  <option key={value} value={value}>
                    {value}
                  </option>
                ))}
              </select>
            </div>
          )
        )}

        <input
          type="search"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder={searchPlaceholder ?? 'Search…'}
          className="text-sm border border-stone-300 rounded-md px-2 py-1 bg-white text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-primary/40 min-w-[14rem] flex-1 max-w-xs"
        />

        {(query || anyFilterActive) && (
          <button
            type="button"
            onClick={() => {
              setQuery('');
              setSelected({});
            }}
            className="text-xs text-stone-500 hover:text-primary underline"
          >
            Show all
          </button>
        )}

        <span className="text-xs text-stone-500 ml-auto">
          {visibleRows.length} {rowNoun}
          {visibleRows.length === 1 ? '' : 's'}
          {visibleRows.length !== rows.length ? ` of ${rows.length}` : ''}
        </span>
      </div>

      <div className="overflow-x-auto rounded-lg border border-stone-200">
        <table className="dataset-table min-w-full text-xs text-left border-collapse">
          <thead>
            <tr className="bg-stone-50 border-b border-stone-200">
              {columns.map((col, i) => (
                <th
                  key={col.key}
                  className={`px-3 py-2 font-semibold text-stone-700 align-bottom whitespace-nowrap ${
                    i === 0 ? 'sticky left-0 z-10 bg-stone-50' : ''
                  }`}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {visibleRows.map((row, rowIdx) => (
              <tr
                key={`${row[columns[0].key] ?? ''}-${rowIdx}`}
                id={rowIdColumn && row[rowIdColumn] ? `${rowIdPrefix}${row[rowIdColumn]}` : undefined}
                className="border-b border-stone-100 last:border-0 align-top"
              >
                {columns.map((col, i) =>
                  i === 0 ? (
                    <th
                      key={col.key}
                      scope="row"
                      className="sticky left-0 z-10 bg-white px-3 py-2 font-semibold text-stone-900 align-top whitespace-nowrap"
                    >
                      {renderCell(row, col)}
                    </th>
                  ) : (
                    <td
                      key={col.key}
                      className={`px-3 py-2 text-stone-700 align-top ${
                        col.wrap ? 'min-w-[12rem]' : 'whitespace-nowrap'
                      }`}
                    >
                      {renderCell(row, col)}
                    </td>
                  )
                )}
              </tr>
            ))}
            {visibleRows.length === 0 && (
              <tr>
                <td colSpan={columns.length} className="px-3 py-6 text-center text-stone-500">
                  No rows match that search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
