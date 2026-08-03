'use client';

import { CategoryCount } from '@/lib/csvHistogram';

interface BarHistogramProps {
  title: string;
  data: CategoryCount[];
  unresolvedCount: number;
  selectedLabel: string | null;
  onSelect: (label: string) => void;
  /** Optional per-label tooltip text, e.g. Köppen–Geiger code -> full climate name. Falls back to just the label when absent. */
  describe?: (label: string) => string | undefined;
}

export function BarHistogram({ title, data, unresolvedCount, selectedLabel, onSelect, describe }: BarHistogramProps) {
  const max = Math.max(1, ...data.map(d => d.count));

  return (
    <div className="bg-white rounded-lg border border-stone-200 p-5">
      <h3 className="font-heading text-base mb-4">{title}</h3>

      {data.length === 0 ? (
        <p className="text-sm text-stone-500">No categorized observations yet.</p>
      ) : (
        <ul className="space-y-1.5">
          {data.map(item => {
            const isSelected = item.label === selectedLabel;
            const pct = (item.count / max) * 100;

            return (
              <li key={item.label}>
                <button
                  type="button"
                  onClick={() => onSelect(item.label)}
                  aria-pressed={isSelected}
                  title={describe?.(item.label) ? `${item.label} — ${describe(item.label)}` : undefined}
                  className={`
                    group flex w-full items-center gap-3 rounded-md px-1.5 py-1 text-left
                    transition-colors duration-150 focus:outline-none focus-visible:ring-2
                    focus-visible:ring-accent
                    ${isSelected ? 'bg-primary-light' : 'hover:bg-stone-50'}
                  `}
                >
                  <span
                    className={`w-40 shrink-0 truncate text-sm ${
                      isSelected ? 'font-medium text-primary' : 'text-stone-700'
                    }`}
                  >
                    {item.flaggedCount > 0 && (
                      <span
                        className="mr-1 text-amber-600"
                        title={`${item.flaggedCount} of ${item.count} flagged for a data-quality caveat`}
                      >
                        ⚠
                      </span>
                    )}
                    {item.label}
                  </span>
                  <span className="relative h-[18px] flex-1 rounded-sm bg-stone-100">
                    <span
                      className="absolute inset-y-0 left-0 rounded-r-[4px] transition-[width,background-color] duration-150"
                      style={{
                        width: `${pct}%`,
                        backgroundColor: isSelected ? '#2563eb' : '#1a5632',
                        opacity: isSelected ? 1 : 0.85,
                      }}
                    />
                  </span>
                  <span className="w-8 shrink-0 text-right text-xs tabular-nums text-stone-500">
                    {item.count}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      )}

      {unresolvedCount > 0 && (
        <p className="mt-3 text-xs text-stone-400">
          {unresolvedCount} row{unresolvedCount === 1 ? '' : 's'} without a resolved category not shown above.
        </p>
      )}
    </div>
  );
}
