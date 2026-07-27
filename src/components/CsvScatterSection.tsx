'use client';

import { useMemo, useState } from 'react';
import { CsvRow } from '@/lib/csv';
import { getScatterPoints, niceTicks } from '@/lib/csvScatter';

interface CsvScatterSectionProps {
  title: string;
  rows: CsvRow[];
  xColumn: string;
  yColumn: string;
  xLabel: string;
  yLabel: string;
  filterColumn?: string;
  filterValue?: string;
}

const WIDTH = 640;
const HEIGHT = 380;
const MARGIN = { top: 16, right: 20, bottom: 48, left: 56 };
const PLOT_WIDTH = WIDTH - MARGIN.left - MARGIN.right;
const PLOT_HEIGHT = HEIGHT - MARGIN.top - MARGIN.bottom;

export function CsvScatterSection({
  title,
  rows,
  xColumn,
  yColumn,
  xLabel,
  yLabel,
  filterColumn,
  filterValue,
}: CsvScatterSectionProps) {
  const points = useMemo(
    () => getScatterPoints(rows, { xColumn, yColumn, filterColumn, filterValue }),
    [rows, xColumn, yColumn, filterColumn, filterValue]
  );
  const [hovered, setHovered] = useState<number | null>(null);

  const scales = useMemo(() => {
    if (points.length === 0) return null;

    const xs = points.map(p => p.x);
    const ys = points.map(p => p.y);
    const xPad = (Math.max(...xs) - Math.min(...xs)) * 0.08 || 1;
    const yPad = (Math.max(...ys) - Math.min(...ys)) * 0.08 || 1;
    const xTicks = niceTicks(Math.min(...xs) - xPad, Math.max(...xs) + xPad);
    const yTicks = niceTicks(Math.min(...ys) - yPad, Math.max(...ys) + yPad);
    const xMin = xTicks[0];
    const xMax = xTicks[xTicks.length - 1];
    const yMin = yTicks[0];
    const yMax = yTicks[yTicks.length - 1];

    return {
      xTicks,
      yTicks,
      xScale: (v: number) => ((v - xMin) / (xMax - xMin)) * PLOT_WIDTH,
      yScale: (v: number) => PLOT_HEIGHT - ((v - yMin) / (yMax - yMin)) * PLOT_HEIGHT,
    };
  }, [points]);

  return (
    <div className="my-4 bg-white rounded-lg border border-stone-200 p-5">
      <h3 className="font-heading text-base mb-4">{title}</h3>

      {!scales || points.length === 0 ? (
        <p className="text-sm text-stone-500">No observations with both values yet.</p>
      ) : (
        <div className="relative">
          <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="w-full h-auto" role="img" aria-label={title}>
            <g transform={`translate(${MARGIN.left},${MARGIN.top})`}>
              {scales.yTicks.map(t => (
                <g key={`y-${t}`}>
                  <line x1={0} x2={PLOT_WIDTH} y1={scales.yScale(t)} y2={scales.yScale(t)} stroke="#e7e5e4" strokeWidth={1} />
                  <text x={-8} y={scales.yScale(t)} dy="0.32em" textAnchor="end" className="fill-stone-400 text-[10px]">
                    {t}
                  </text>
                </g>
              ))}
              {scales.xTicks.map(t => (
                <g key={`x-${t}`}>
                  <line x1={scales.xScale(t)} x2={scales.xScale(t)} y1={0} y2={PLOT_HEIGHT} stroke="#e7e5e4" strokeWidth={1} />
                  <text x={scales.xScale(t)} y={PLOT_HEIGHT + 16} textAnchor="middle" className="fill-stone-400 text-[10px]">
                    {t}
                  </text>
                </g>
              ))}

              <line x1={0} x2={PLOT_WIDTH} y1={PLOT_HEIGHT} y2={PLOT_HEIGHT} stroke="#a8a29e" strokeWidth={1} />
              <line x1={0} x2={0} y1={0} y2={PLOT_HEIGHT} stroke="#a8a29e" strokeWidth={1} />

              {points.map((p, i) => {
                const isHovered = hovered === i;
                return (
                  <circle
                    key={i}
                    cx={scales.xScale(p.x)}
                    cy={scales.yScale(p.y)}
                    r={isHovered ? 7 : 5}
                    fill="#1a5632"
                    fillOpacity={isHovered ? 1 : 0.7}
                    stroke="#ffffff"
                    strokeWidth={2}
                    onMouseEnter={() => setHovered(i)}
                    onMouseLeave={() => setHovered(prev => (prev === i ? null : prev))}
                    style={{ cursor: 'pointer' }}
                  />
                );
              })}

              <text x={PLOT_WIDTH / 2} y={PLOT_HEIGHT + 38} textAnchor="middle" className="fill-stone-500 text-[11px]">
                {xLabel}
              </text>
              <text transform="rotate(-90)" x={-PLOT_HEIGHT / 2} y={-40} textAnchor="middle" className="fill-stone-500 text-[11px]">
                {yLabel}
              </text>
            </g>
          </svg>

          {hovered !== null && (
            <div className="pointer-events-none absolute top-2 right-2 max-w-[220px] bg-stone-900 text-white text-xs rounded-md px-2.5 py-1.5 shadow-lg">
              <p className="font-medium truncate">{points[hovered].label}</p>
              <p className="text-stone-300">
                {xLabel}: {points[hovered].x}% &middot; {yLabel}: {points[hovered].y}%
              </p>
            </div>
          )}
        </div>
      )}

      <p className="mt-3 text-xs text-stone-400">
        {points.length} observation{points.length === 1 ? '' : 's'} plotted.
      </p>
    </div>
  );
}
