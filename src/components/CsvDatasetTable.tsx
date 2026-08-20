'use client';

import { useMemo, useState } from 'react';
import { ExternalLink } from 'lucide-react';
import { CsvRow } from '@/lib/csv';
import { DatasetTableColumn } from '@/types';

interface CsvDatasetTableProps {
  rows: CsvRow[];
  columns: DatasetTableColumn[];
  /** Column whose distinct values become the dropdown filter (e.g. `category`). */
  filterColumn?: string;
  filterLabel?: string;
  /** Columns the free-text box searches. Defaults to every displayed column. */
  searchColumns?: string[];
  searchPlaceholder?: string;
  title?: string;
  /** Noun used in the row count, e.g. "dataset" → "12 datasets". */
  rowNoun?: string;
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

export function CsvDatasetTable({
  rows,
  columns,
  filterColumn,
  filterLabel,
  searchColumns,
  searchPlaceholder,
  title,
  rowNoun = 'row',
}: CsvDatasetTableProps) {
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [query, setQuery] = useState<string>('');

  const filterValues = useMemo(() => {
    if (!filterColumn) return [];
    const seen = new Set<string>();
    rows.forEach(row => {
      const value = (row[filterColumn] ?? '').trim();
      if (value) seen.add(value);
    });
    return Array.from(seen).sort((a, b) => a.localeCompare(b));
  }, [rows, filterColumn]);

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
      if (filterColumn && selectedFilter !== 'all' && (row[filterColumn] ?? '').trim() !== selectedFilter) {
        return false;
      }
      if (!needle) return true;
      return searchKeys.some(key => (row[key] ?? '').toLowerCase().includes(needle));
    });
  }, [rows, query, filterColumn, selectedFilter, searchKeys]);

  if (rows.length === 0 || columns.length === 0) return null;

  return (
    <div className="my-6 not-prose">
      {title && <h4 className="text-sm font-heading text-stone-800 mb-3">{title}</h4>}

      <div className="flex flex-wrap items-center gap-3 mb-3">
        {filterColumn && filterValues.length > 0 && (
          <div className="flex items-center gap-2">
            <label htmlFor="dataset-table-filter" className="text-sm font-medium text-stone-600">
              {filterLabel ?? 'Category'}:
            </label>
            <select
              id="dataset-table-filter"
              value={selectedFilter}
              onChange={e => setSelectedFilter(e.target.value)}
              className="text-sm border border-stone-300 rounded-md px-2 py-1 bg-white text-stone-800 focus:outline-none focus:ring-2 focus:ring-primary/40"
            >
              <option value="all">All ({rows.length})</option>
              {filterValues.map(value => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </div>
        )}

        <input
          type="search"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder={searchPlaceholder ?? 'Search…'}
          className="text-sm border border-stone-300 rounded-md px-2 py-1 bg-white text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-primary/40 min-w-[14rem] flex-1 max-w-xs"
        />

        {(query || selectedFilter !== 'all') && (
          <button
            type="button"
            onClick={() => {
              setQuery('');
              setSelectedFilter('all');
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
        <table className="min-w-full text-xs text-left border-collapse">
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
              <tr key={`${row[columns[0].key] ?? ''}-${rowIdx}`} className="border-b border-stone-100 last:border-0 align-top">
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
