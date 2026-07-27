'use client';

import { useMemo, useState } from 'react';
import { CsvRow } from '@/lib/csv';
import { filterTrends, formatUnit, summarizeTrends } from '@/lib/csvTrend';

interface TrendComparisonExplorerProps {
  rows: CsvRow[];
}

function formatTrendValue(row: CsvRow): string {
  const marker = row.significance_marker || '';
  const unit = row.trend_unit ? formatUnit(row.trend_unit) : '';
  return [`${row.trend_value}${marker}`, unit].filter(Boolean).join(' ');
}

export function TrendComparisonExplorer({ rows }: TrendComparisonExplorerProps) {
  const summary = useMemo(() => summarizeTrends(rows), [rows]);
  const [model, setModel] = useState('');
  const [periodStart, setPeriodStart] = useState('');
  const [periodEnd, setPeriodEnd] = useState('');

  const filtered = useMemo(
    () =>
      filterTrends(rows, {
        model: model || null,
        periodStart: periodStart ? Number(periodStart) : null,
        periodEnd: periodEnd ? Number(periodEnd) : null,
      }),
    [rows, model, periodStart, periodEnd]
  );

  const hasFilter = Boolean(model || periodStart || periodEnd);

  return (
    <div className="my-4 space-y-4">
      <div className="bg-white rounded-lg border border-stone-200 p-5">
        <h3 className="font-heading text-base mb-4">Summary across all approaches</h3>
        <dl className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
          <div>
            <dt className="text-xs uppercase tracking-wide text-stone-400">Trend estimates</dt>
            <dd className="mt-0.5 tabular-nums">{summary.count}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wide text-stone-400">Trend range</dt>
            <dd className="mt-0.5 tabular-nums">
              {summary.minTrend ?? '—'} to {summary.maxTrend ?? '—'} {formatUnit(summary.unit)}
            </dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wide text-stone-400">Full period</dt>
            <dd className="mt-0.5 tabular-nums">
              {summary.periodStart ?? '—'}–{summary.periodEnd ?? '—'}
            </dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wide text-stone-400">Models</dt>
            <dd className="mt-0.5 tabular-nums">{summary.models.length}</dd>
          </div>
        </dl>
        <p className="mt-3 text-xs text-stone-500">{summary.models.join(', ')}</p>
      </div>

      <div className="bg-white rounded-lg border border-stone-200 p-5">
        <h3 className="font-heading text-base mb-3">Query trends</h3>
        <div className="flex flex-wrap items-end gap-3 mb-4">
          <label className="flex flex-col text-xs text-stone-500">
            Model
            <select
              value={model}
              onChange={e => setModel(e.target.value)}
              className="mt-1 border border-stone-200 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="">All models</option>
              {summary.models.map(m => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col text-xs text-stone-500">
            From year
            <input
              type="number"
              value={periodStart}
              onChange={e => setPeriodStart(e.target.value)}
              placeholder={summary.periodStart?.toString()}
              className="mt-1 w-24 border border-stone-200 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </label>
          <label className="flex flex-col text-xs text-stone-500">
            To year
            <input
              type="number"
              value={periodEnd}
              onChange={e => setPeriodEnd(e.target.value)}
              placeholder={summary.periodEnd?.toString()}
              className="mt-1 w-24 border border-stone-200 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </label>
          {hasFilter && (
            <button
              type="button"
              onClick={() => {
                setModel('');
                setPeriodStart('');
                setPeriodEnd('');
              }}
              className="text-xs text-primary hover:underline pb-1.5"
            >
              Clear
            </button>
          )}
        </div>

        <p className="text-xs text-stone-500 mb-3">
          {filtered.length} of {rows.length} trend estimates{hasFilter ? ' match the current query' : ''}
        </p>

        <div className="max-h-[60vh] overflow-auto wiki-content">
          <table className="text-xs whitespace-nowrap">
            <thead>
              <tr>
                <th>Model</th>
                <th>Category</th>
                <th>Period</th>
                <th>Trend</th>
                <th>Source</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(row => (
                <tr key={row.trend_id}>
                  <td className="font-medium text-stone-800">{row.et_product}</td>
                  <td>{row.product_category ? row.product_category.replace(/_/g, ' ') : '—'}</td>
                  <td className="tabular-nums">
                    {row.period_start}–{row.period_end}
                  </td>
                  <td className="tabular-nums">{formatTrendValue(row)}</td>
                  <td>{row.source_citation}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
