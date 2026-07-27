export interface OutlineLink {
  title: string;
  href: string;
}

export interface OutlineHeading {
  id: string;
  text: string;
  level: number;
  links: OutlineLink[];
}

const HEADING_RE = /^(#{1,6})\s+(.+)$/;
const LINK_RE = /\[([^\]]+)\]\(([^)]+)\)/g;
const FENCE_RE = /^```/;

/** Matches the heading id MarkdownContent assigns at render time (from the rendered heading's textContent), so `#id` anchors resolve. */
function headingId(text: string): string {
  return text.toLowerCase().replace(/\s+/g, '_');
}

/**
 * Builds an in-page outline from a note's post-processed markdown (wikilinks
 * already converted to real hrefs): every heading, for a jump-to-section
 * index, with the internal (/models/... or /wiki/...) links that appear
 * under it nested alongside — so the sidebar shows only pages this specific
 * document actually references, grouped by the section they're mentioned
 * in, rather than every flux/parameter/observation in the model. External
 * citation links are excluded; they're not vault pages to navigate to.
 */
export function buildPageOutline(content: string): OutlineHeading[] {
  const lines = content.split('\n');
  const headings: OutlineHeading[] = [];
  let current: OutlineHeading | null = null;
  let seenHrefs = new Set<string>();
  let inFence = false;

  for (const line of lines) {
    if (FENCE_RE.test(line)) {
      inFence = !inFence;
      continue;
    }
    if (inFence) continue;

    const headingMatch = line.match(HEADING_RE);
    if (headingMatch) {
      const text = headingMatch[2].trim();
      current = { id: headingId(text), text, level: headingMatch[1].length, links: [] };
      headings.push(current);
      seenHrefs = new Set();
      continue;
    }

    if (!current) continue;

    LINK_RE.lastIndex = 0;
    let linkMatch: RegExpExecArray | null;
    while ((linkMatch = LINK_RE.exec(line)) !== null) {
      const [, title, href] = linkMatch;
      if (!href.startsWith('/models/') && !href.startsWith('/wiki/')) continue;
      if (seenHrefs.has(href)) continue;
      seenHrefs.add(href);
      current.links.push({ title, href });
    }
  }

  return headings;
}
