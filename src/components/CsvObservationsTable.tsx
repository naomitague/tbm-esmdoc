'use client';

import { CsvRow } from '@/lib/csv';
import { isFlaggedCategory } from '@/lib/csvHistogram';
import { HistogramTableColumn } from '@/types';

interface CsvObservationsTableProps {
  rows: CsvRow[];
  column: string;
  columns?: HistogramTableColumn[];
}

function formatCellValue(row: CsvRow, col: HistogramTableColumn): string {
  const point = row[col.key] || (col.fallback_key ? row[col.fallback_key] : '') || '';
  const unit = col.unit_key ? row[col.unit_key] ?? '' : '';
  if (point) return unit ? `${point} ${unit}` : point;
  if (col.min_key || col.max_key) {
    const min = col.min_key ? row[col.min_key] ?? '' : '';
    const max = col.max_key ? row[col.max_key] ?? '' : '';
    if (min || max) return `${min || '?'}–${max || '?'}${unit ? ` ${unit}` : ''}`.trim();
  }
  return '—';
}

/** No table_columns configured — fall back to showing every column the CSV has. */
function defaultColumns(rows: CsvRow[]): HistogramTableColumn[] {
  const first = rows[0];
  if (!first) return [];
  return Object.keys(first).map(key => ({ key, label: key }));
}

export function CsvObservationsTable({ rows, column, columns }: CsvObservationsTableProps) {
  const resolvedColumns = columns && columns.length > 0 ? columns : defaultColumns(rows);

  return (
    <div className="max-h-[70vh] overflow-auto wiki-content">
      <table className="text-xs whitespace-nowrap">
        <thead>
          <tr>
            {resolvedColumns.map(col => (
              <th key={col.key}>{col.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIdx) => {
            const flagged = isFlaggedCategory(row[column] ?? '');
            return (
              <tr key={row.obs_id || row.id || rowIdx}>
                {resolvedColumns.map((col, colIdx) => (
                  <td
                    key={col.key}
                    className={[col.numeric && 'tabular-nums', col.wrap && 'whitespace-normal', col.muted && 'text-stone-500 italic']
                      .filter(Boolean)
                      .join(' ')}
                  >
                    {col.caption_key && row[col.caption_key] && (
                      <div className="text-stone-500">{row[col.caption_key]}</div>
                    )}
                    {colIdx === 0 ? (
                      <div className="font-medium text-stone-800">
                        {flagged && (
                          <span
                            className="mr-1 text-amber-600"
                            title="Data-quality flag on this classification — see notes"
                          >
                            ⚠
                          </span>
                        )}
                        {formatCellValue(row, col)}
                      </div>
                    ) : (
                      formatCellValue(row, col)
                    )}
                    {col.subtitle_key && row[col.subtitle_key] && (
                      <div className="text-stone-500">{row[col.subtitle_key]}</div>
                    )}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
