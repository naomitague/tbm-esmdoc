import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

/**
 * Page chrome written as markdown rather than JSX — currently just the About
 * page. These live in `site/`, which the wiki scanner skips (see
 * `getAllMarkdownFiles`), so each one has a single URL and the prose can be
 * edited without touching a component.
 */
export interface SitePage {
  title: string;
  subtitle?: string;
  /** Exact heading the body's table sits under; everything above it is the prose column. */
  tableHeading?: string;
  prose: string;
  table: { heading: string; rows: { label: string; body: string }[] } | null;
}

/** A GFM table → rows. The delimiter row (`| --- |`) is dropped; the header row names the columns. */
function parseTable(markdown: string): { label: string; body: string }[] {
  return markdown
    .split('\n')
    .filter(line => line.trim().startsWith('|'))
    .map(line =>
      line
        .trim()
        .replace(/^\||\|$/g, '')
        .split('|')
        .map(cell => cell.trim())
    )
    .filter(cells => cells.length >= 2 && !cells.every(cell => /^:?-{2,}:?$/.test(cell)))
    .slice(1) // header row
    .map(cells => ({ label: cells[0], body: cells.slice(1).join(' ') }));
}

export function getSitePage(name: string): SitePage | null {
  const filePath = path.join(process.cwd(), 'site', `${name}.md`);
  if (!fs.existsSync(filePath)) return null;

  const { data, content } = matter(fs.readFileSync(filePath, 'utf8'));
  const tableHeading: string | undefined = data.table_heading;

  let prose = content.trim();
  let table: SitePage['table'] = null;

  if (tableHeading && content.includes(tableHeading)) {
    const index = content.indexOf(tableHeading);
    prose = content.slice(0, index).trim();
    const rows = parseTable(content.slice(index + tableHeading.length));
    table = { heading: tableHeading.replace(/^#+\s*/, ''), rows };
  }

  return {
    title: data.title || name,
    subtitle: data.subtitle,
    tableHeading,
    prose,
    table,
  };
}
