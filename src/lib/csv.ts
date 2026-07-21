import fs from 'fs';
import path from 'path';

export type CsvRow = Record<string, string>;

/**
 * Minimal RFC4180 CSV parser: handles quoted fields, embedded commas/newlines,
 * and "" as an escaped quote. Literature-synthesis CSVs routinely have
 * free-text fields like `"Bosch and Hewlett, 1982"` that a naive split(',')
 * would break.
 */
export function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = '';
  let inQuotes = false;
  let i = 0;

  while (i < text.length) {
    const char = text[i];

    if (inQuotes) {
      if (char === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i += 2;
          continue;
        }
        inQuotes = false;
        i++;
        continue;
      }
      field += char;
      i++;
      continue;
    }

    if (char === '"') {
      inQuotes = true;
      i++;
    } else if (char === ',') {
      row.push(field);
      field = '';
      i++;
    } else if (char === '\r') {
      i++;
    } else if (char === '\n') {
      row.push(field);
      rows.push(row);
      row = [];
      field = '';
      i++;
    } else {
      field += char;
      i++;
    }
  }

  if (field.length > 0 || row.length > 0) {
    row.push(field);
    rows.push(row);
  }

  return rows.filter(r => !(r.length === 1 && r[0] === ''));
}

/** Reads any project CSV (path relative to the repo root) into header-keyed rows. */
export function readCsvRows(relativePath: string): CsvRow[] {
  const csvPath = path.join(process.cwd(), relativePath);
  if (!fs.existsSync(csvPath)) {
    return [];
  }

  const text = fs.readFileSync(csvPath, 'utf8');
  const [header, ...dataRows] = parseCsv(text);
  if (!header) return [];

  return dataRows.map(cols => {
    const row: CsvRow = {};
    header.forEach((key, idx) => {
      row[key] = (cols[idx] ?? '').trim();
    });
    return row;
  });
}
