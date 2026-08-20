/**
 * Splitting a note's markdown at the headings the interactive-content
 * protocols (`histogram_data`, `trend_data`, `esm_table`, `dataset_table`,
 * `metric_response_data`) target, so a live React component can be spliced in
 * right after each one — the generic MarkdownContent pipeline renders static
 * HTML and can't host a component itself.
 *
 * Shared by both note routes (`/wiki/[slug]` and
 * `/models/[model]/[type]/[slug]`) so the two don't drift apart the way their
 * frontmatter parsers already have.
 */

/** One CSV-driven component to splice in after `heading`. */
export interface HeadingInjection {
  heading: string;
  node: React.ReactNode;
}

/**
 * Returns one segment per heading (each ending with that heading) plus a
 * trailing segment, or null if any heading is missing or they don't appear in
 * the given order — in which case the caller should render the note as one
 * unmodified block.
 */
export function splitAtHeadings(markdown: string, headings: string[]): string[] | null {
  const indices = headings.map(heading => markdown.indexOf(heading));
  if (indices.some(idx => idx === -1)) return null;
  for (let i = 1; i < indices.length; i++) {
    if (indices[i] < indices[i - 1]) return null;
  }

  const segments: string[] = [];
  let cursor = 0;
  headings.forEach((heading, i) => {
    const idx = indices[i];
    segments.push(markdown.slice(cursor, idx + heading.length));
    cursor = idx + heading.length;
  });
  segments.push(markdown.slice(cursor));

  return segments;
}

/**
 * Drops injections whose heading isn't in the body (a typo'd heading just
 * contributes nothing rather than blocking the others) and orders the rest by
 * where they actually fall in the document, ready for `splitAtHeadings`.
 */
export function orderInjections(markdown: string, injections: HeadingInjection[]): HeadingInjection[] {
  return injections
    .map(injection => ({ ...injection, index: markdown.indexOf(injection.heading) }))
    .filter(injection => injection.index !== -1)
    .sort((a, b) => a.index - b.index);
}
