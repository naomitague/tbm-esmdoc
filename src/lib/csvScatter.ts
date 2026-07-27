import { CsvRow } from '@/lib/csv';

export interface ScatterPoint {
  x: number;
  y: number;
  label: string;
  row: CsvRow;
}

interface ScatterPointsOptions {
  xColumn: string;
  yColumn: string;
  filterColumn?: string;
  filterValue?: string;
  labelColumn?: string;
  labelFallbackColumn?: string;
}

/** Pulls numeric (x, y) pairs out of a CSV for a scatter plot, optionally restricted to rows matching filterColumn === filterValue. Rows missing either value are dropped. */
export function getScatterPoints(rows: CsvRow[], options: ScatterPointsOptions): ScatterPoint[] {
  const {
    xColumn,
    yColumn,
    filterColumn,
    filterValue,
    labelColumn = 'location_name',
    labelFallbackColumn = 'obs_id',
  } = options;

  return rows
    .filter(row => !filterColumn || !filterValue || row[filterColumn] === filterValue)
    .map(row => ({
      x: parseFloat(row[xColumn]),
      y: parseFloat(row[yColumn]),
      label: row[labelColumn] || row[labelFallbackColumn] || '',
      row,
    }))
    .filter((p): p is ScatterPoint => Number.isFinite(p.x) && Number.isFinite(p.y));
}

/** "Nice" round tick values spanning [min, max], the classic d3-style step-rounding algorithm. */
export function niceTicks(min: number, max: number, count = 5): number[] {
  if (min === max) return [min];
  const span = max - min;
  const rawStep = span / count;
  const mag = Math.pow(10, Math.floor(Math.log10(rawStep)));
  const norm = rawStep / mag;
  const step = (norm >= 5 ? 10 : norm >= 2 ? 5 : norm >= 1 ? 2 : 1) * mag;
  const niceMin = Math.floor(min / step) * step;
  const niceMax = Math.ceil(max / step) * step;

  const ticks: number[] = [];
  for (let t = niceMin; t <= niceMax + step * 0.5; t += step) {
    ticks.push(Math.round(t * 1e6) / 1e6);
  }
  return ticks;
}
