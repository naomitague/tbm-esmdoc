'use client';

import { useMemo, useState } from 'react';
import { ExternalLink } from 'lucide-react';
import { EsmAttributeColumn, EsmModelOption, EsmTableRow } from '@/lib/esm';

interface EsmMethodTableProps {
  rows: EsmTableRow[];
  models: EsmModelOption[];
  columns: EsmAttributeColumn[];
  /** Optional caption shown above the control, e.g. the flux name. */
  caption?: string;
}

const confidenceStyles: Record<string, string> = {
  extracted: 'bg-emerald-100 text-emerald-800',
  needs_verification: 'bg-amber-100 text-amber-800',
};

/** A semicolon-delimited list column (e.g. `et_components_represented`) reads better as stacked chips. */
function renderCell(value: string) {
  if (!value) return <span className="text-stone-400">—</span>;
  if (value.includes(';')) {
    return (
      <div className="flex flex-col gap-1">
        {value
          .split(';')
          .map(part => part.trim())
          .filter(Boolean)
          .map((part, i) => (
            <span key={i} className="inline-block">
              {part}
            </span>
          ))}
      </div>
    );
  }
  return <span>{value}</span>;
}

export function EsmMethodTable({ rows, models, columns, caption }: EsmMethodTableProps) {
  const [selectedModel, setSelectedModel] = useState<string>('all');

  const visibleRows = useMemo(
    () => (selectedModel === 'all' ? rows : rows.filter(r => r.modelId === selectedModel)),
    [rows, selectedModel]
  );

  if (rows.length === 0) return null;

  return (
    <div className="my-6 not-prose">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-2">
          <label htmlFor="esm-model-filter" className="text-sm font-medium text-stone-600">
            Earth System Model:
          </label>
          <select
            id="esm-model-filter"
            value={selectedModel}
            onChange={e => setSelectedModel(e.target.value)}
            className="text-sm border border-stone-300 rounded-md px-2 py-1 bg-white text-stone-800 focus:outline-none focus:ring-2 focus:ring-primary/40"
          >
            <option value="all">All models ({models.length})</option>
            {models.map(m => (
              <option key={m.modelId} value={m.modelId}>
                {m.modelName}
              </option>
            ))}
          </select>
        </div>
        <span className="text-xs text-stone-500">
          {visibleRows.length} model version{visibleRows.length === 1 ? '' : 's'}
        </span>
      </div>

      <div className="overflow-x-auto rounded-lg border border-stone-200">
        <table className="min-w-full text-xs text-left border-collapse">
          <thead>
            <tr className="bg-stone-50 border-b border-stone-200">
              <th className="sticky left-0 z-10 bg-stone-50 px-3 py-2 font-semibold text-stone-700 align-bottom min-w-[12rem]">
                Model / version
              </th>
              {columns.map(col => (
                <th
                  key={col.key}
                  className="px-3 py-2 font-semibold text-stone-700 align-bottom whitespace-nowrap"
                >
                  {col.label}
                </th>
              ))}
              <th className="px-3 py-2 font-semibold text-stone-700 align-bottom whitespace-nowrap">
                Source
              </th>
            </tr>
          </thead>
          <tbody>
            {visibleRows.map(row => (
              <tr key={row.versionId} className="border-b border-stone-100 last:border-0 align-top">
                <th
                  scope="row"
                  className="sticky left-0 z-10 bg-white px-3 py-2 font-medium text-stone-800 align-top min-w-[12rem]"
                >
                  <div className="font-semibold text-stone-900">{row.modelName}</div>
                  {row.versionLabel && (
                    <div className="text-stone-600 font-normal">
                      {row.versionLabel}
                      {row.releaseYear ? ` (${row.releaseYear})` : ''}
                    </div>
                  )}
                  {row.modelType && (
                    <div className="text-[0.65rem] uppercase tracking-wide text-stone-400 font-normal mt-0.5">
                      {row.modelType.replace(/_/g, ' ')}
                    </div>
                  )}
                  <div className="flex flex-col gap-0.5 mt-1 font-normal">
                    {row.websiteUrl && (
                      <a
                        href={row.websiteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-primary hover:underline"
                      >
                        <ExternalLink className="w-3 h-3" strokeWidth={1.5} /> website
                      </a>
                    )}
                    {row.codeRepoUrl && (
                      <a
                        href={row.codeRepoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-primary hover:underline"
                      >
                        <ExternalLink className="w-3 h-3" strokeWidth={1.5} /> code
                      </a>
                    )}
                  </div>
                </th>

                {columns.map(col => (
                  <td key={col.key} className="px-3 py-2 text-stone-700 min-w-[10rem]">
                    {renderCell(row.attributes[col.key] ?? '')}
                  </td>
                ))}

                <td className="px-3 py-2 text-stone-600 min-w-[12rem]">
                  {row.confidence && (
                    <span
                      className={`inline-block rounded px-1.5 py-0.5 text-[0.65rem] font-medium mb-1 ${
                        confidenceStyles[row.confidence] ?? 'bg-stone-100 text-stone-600'
                      }`}
                    >
                      {row.confidence.replace(/_/g, ' ')}
                    </span>
                  )}
                  {row.extractionSource && (
                    <div className="text-stone-500 italic">{row.extractionSource}</div>
                  )}
                  {row.documentationUrl && (
                    <a
                      href={row.documentationUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-primary hover:underline mt-1"
                    >
                      <ExternalLink className="w-3 h-3" strokeWidth={1.5} /> docs
                    </a>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
