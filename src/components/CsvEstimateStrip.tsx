'use client';

import { useMemo, useState } from 'react';
import { EstimatePoint, EstimateSeries } from '@/lib/csvEstimates';
import { niceTicks } from '@/lib/csvScatter';

interface CsvEstimateStripProps {
  series: EstimateSeries;
  title?: string;
  axisLabel?: string;
  axisMin?: number;
  axisMax?: number;
  unit?: string;
  note?: string;
  /** Prefix of the DOM id a click jumps to — must match the dataset table's rows. */
  anchorPrefix?: string;
}

const WIDTH = 640;
const HEIGHT = 132;
const MARGIN = { top: 46, right: 28, bottom: 34, left: 28 };
const PLOT_WIDTH = WIDTH - MARGIN.left - MARGIN.right;
const AXIS_Y = HEIGHT - MARGIN.bottom - MARGIN.top;
/** Value labels closer together than this share a column and get stacked instead. */
const LABEL_GAP = 58;

function formatValue(value: number, unit?: string): string {
  const rounded = Math.round(value * 10) / 10;
  return `${rounded}${unit ?? ''}`;
}

/**
 * A compact one-axis dot strip: every plotted row is a dot at its value on a
 * single horizontal axis, with a whisker where the row reported a range. Built
 * for the handful-of-published-estimates case, where the story is the spread
 * and the individual study belongs in a tooltip rather than on its own row.
 *
 * With `anchorPrefix` set, clicking a dot sets the location hash to that row's
 * id, which scrolls the matching `dataset_table` row into view and lights it up
 * via the `:target` rule in globals.css — no shared state between the two
 * components, which are spliced into the markdown independently.
 */
export function CsvEstimateStrip({
  series,
  title,
  axisLabel,
  axisMin,
  axisMax,
  unit,
  note,
  anchorPrefix,
}: CsvEstimateStripProps) {
  const { points, totalRows } = series;
  const [active, setActive] = useState<number | null>(null);

  const scale = useMemo(() => {
    if (points.length === 0) return null;

    let ticks: number[];
    if (axisMin !== undefined && axisMax !== undefined) {
      ticks = niceTicks(axisMin, axisMax, 8).filter(t => t >= axisMin && t <= axisMax);
    } else {
      const values = points.flatMap(p => [p.min ?? p.value, p.max ?? p.value]);
      const pad = (Math.max(...values) - Math.min(...values)) * 0.1 || 1;
      ticks = niceTicks(Math.min(...values) - pad, Math.max(...values) + pad, 8);
    }

    const min = axisMin ?? ticks[0];
    const max = axisMax ?? ticks[ticks.length - 1];
    const span = max - min || 1;

    return { ticks, min, max, x: (v: number) => ((v - min) / span) * PLOT_WIDTH };
  }, [points, axisMin, axisMax]);

  // Two label rows, so neighbouring dots (39% / 55% / 62% on a 0–100 axis)
  // don't overprint each other.
  const labelRow = useMemo(() => {
    if (!scale) return [];
    let lastX = -Infinity;
    let lastRow = 1;
    return points.map(p => {
      const x = scale.x(p.value);
      const row = x - lastX < LABEL_GAP ? (lastRow === 0 ? 1 : 0) : 0;
      lastX = x;
      lastRow = row;
      return row;
    });
  }, [points, scale]);

  function jumpTo(point: EstimatePoint) {
    if (!anchorPrefix || !point.id) return;
    window.location.hash = `${anchorPrefix}${point.id}`;
  }

  if (!scale || points.length === 0) {
    return null;
  }

  const hovered = active === null ? null : points[active];

  return (
    <div className="my-4 bg-white rounded-lg border border-stone-200 p-5 not-prose">
      {title && <h4 className="font-heading text-base mb-1 text-stone-800">{title}</h4>}

      <div className="relative">
        <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="w-full h-auto" role="img" aria-label={title ?? axisLabel}>
          <g transform={`translate(${MARGIN.left},${MARGIN.top})`}>
            {scale.ticks.map(t => (
              <g key={t}>
                <line x1={scale.x(t)} x2={scale.x(t)} y1={AXIS_Y - 4} y2={AXIS_Y + 4} stroke="#d6d3d1" strokeWidth={1} />
                <text x={scale.x(t)} y={AXIS_Y + 18} textAnchor="middle" className="fill-stone-400 text-[10px]">
                  {formatValue(t, unit)}
                </text>
              </g>
            ))}

            <line x1={0} x2={PLOT_WIDTH} y1={AXIS_Y} y2={AXIS_Y} stroke="#a8a29e" strokeWidth={1} />

            {points.map((p, i) => {
              const isActive = active === i;
              const cx = scale.x(p.value);
              const labelY = labelRow[i] === 0 ? AXIS_Y - 16 : AXIS_Y - 34;
              const clickable = Boolean(anchorPrefix && p.id);

              return (
                <g
                  key={`${p.id ?? p.label}-${i}`}
                  tabIndex={clickable ? 0 : -1}
                  role={clickable ? 'button' : undefined}
                  aria-label={`${p.label}${p.sublabel ? `, ${p.sublabel}` : ''}: ${formatValue(p.value, unit)}`}
                  onMouseEnter={() => setActive(i)}
                  onMouseLeave={() => setActive(prev => (prev === i ? null : prev))}
                  onFocus={() => setActive(i)}
                  onBlur={() => setActive(prev => (prev === i ? null : prev))}
                  onClick={() => jumpTo(p)}
                  onKeyDown={e => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      jumpTo(p);
                    }
                  }}
                  style={{ cursor: clickable ? 'pointer' : 'default' }}
                  className="focus:outline-none"
                >
                  {p.min !== undefined && p.max !== undefined && (
                    <g stroke="#1a5632" strokeOpacity={isActive ? 0.6 : 0.35} strokeWidth={2}>
                      <line x1={scale.x(p.min)} x2={scale.x(p.max)} y1={AXIS_Y} y2={AXIS_Y} />
                      <line x1={scale.x(p.min)} x2={scale.x(p.min)} y1={AXIS_Y - 6} y2={AXIS_Y + 6} />
                      <line x1={scale.x(p.max)} x2={scale.x(p.max)} y1={AXIS_Y - 6} y2={AXIS_Y + 6} />
                    </g>
                  )}

                  <line
                    x1={cx}
                    x2={cx}
                    y1={labelY + 4}
                    y2={AXIS_Y - 7}
                    stroke="#1a5632"
                    strokeOpacity={isActive ? 0.5 : 0.2}
                    strokeWidth={1}
                  />

                  <text
                    x={cx}
                    y={labelY}
                    textAnchor="middle"
                    className={`text-[11px] ${isActive ? 'fill-primary font-semibold' : 'fill-stone-600'}`}
                  >
                    {formatValue(p.value, unit)}
                  </text>

                  {/* Oversized transparent target: a 6px dot is a hard thing to hit. */}
                  <circle cx={cx} cy={AXIS_Y} r={16} fill="transparent" />
                  <circle
                    cx={cx}
                    cy={AXIS_Y}
                    r={isActive ? 8 : 6}
                    fill="#1a5632"
                    fillOpacity={isActive ? 1 : 0.75}
                    stroke="#ffffff"
                    strokeWidth={2}
                  />
                </g>
              );
            })}

            {axisLabel && (
              <text x={PLOT_WIDTH / 2} y={AXIS_Y + 34} textAnchor="middle" className="fill-stone-500 text-[11px]">
                {axisLabel}
              </text>
            )}
          </g>
        </svg>

        {hovered && (
          <div
            className="pointer-events-none absolute top-0 z-10 w-[240px] -translate-x-1/2 rounded-md bg-stone-900 px-2.5 py-1.5 text-xs text-white shadow-lg"
            style={{
              left: `${Math.min(82, Math.max(18, ((MARGIN.left + scale.x(hovered.value)) / WIDTH) * 100))}%`,
            }}
          >
            <p className="font-medium">{hovered.label}</p>
            {hovered.sublabel && <p className="text-stone-300">{hovered.sublabel}</p>}
            <p className="text-stone-100">
              {formatValue(hovered.value, unit)}
              {hovered.min !== undefined && hovered.max !== undefined
                ? ` (${formatValue(hovered.min, unit)}–${formatValue(hovered.max, unit)})`
                : ''}
            </p>
            {hovered.details.map(detail => (
              <p key={detail.label} className="mt-0.5 text-stone-300">
                {detail.label}: {detail.value}
              </p>
            ))}
            {anchorPrefix && hovered.id && <p className="mt-1 text-stone-400">Click to see the study in the table</p>}
          </div>
        )}
      </div>

      <p className="mt-2 text-xs text-stone-400">
        {points.length} of {totalRows} estimate{totalRows === 1 ? '' : 's'} plotted
        {note ? `. ${note}` : '.'}
      </p>
    </div>
  );
}
