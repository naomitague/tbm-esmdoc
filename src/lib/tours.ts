import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { convertWikiLinksToNextLinks } from './markdown';
import { Tour, TourStep, TourSummary } from '@/types';

const toursDirectory = path.join(process.cwd(), 'tours');

/** A step section starts at a `## Step …` heading; the trailing sections (What you leave with, …) start at any other `##`. */
const STEP_HEADING = /^##\s+Step\b[^\n]*$/gim;
const ANY_H2 = /^##\s+([^\n]*)$/gm;

/**
 * Pulls the labelled paragraph a tour step is written with — `**Do:** …`,
 * `**Notice:** …` — and returns its text, or undefined when the step doesn't
 * have one. Everything here is deliberately forgiving: these are hand-written
 * scripts, and a step missing a label should lose that one field rather than
 * drop out of the tour.
 */
function labelledBlock(section: string, label: string): string | undefined {
  const re = new RegExp(`^\\s*(?:>\\s*)?\\*\\*${label}:?\\*\\*:?\\s*([\\s\\S]*?)(?=\\n\\s*\\n|\\n\\s*>|$)`, 'im');
  const value = section.match(re)?.[1]?.trim();
  return value || undefined;
}

/** `> **Prototype note:** …` — an aside about what isn't built yet, shown muted on the tour page. */
function prototypeNote(section: string): string | undefined {
  const value = section
    .match(/^\s*>?\s*\*\*Prototype note:?\*\*:?\s*([\s\S]*?)(?=\n\s*\n|$)/im)?.[1]
    ?.replace(/^\s*>\s?/gm, '')
    .trim();
  return value || undefined;
}

/**
 * The step's destination: the first markdown link after its `**Page:**` label.
 * The body has already been through `convertWikiLinksToNextLinks`, so an
 * Obsidian `[[Note]]` and a plain `[label](/models/…)` both arrive here as
 * markdown links. A step with no usable link (a malformed label, or a step
 * that is pure commentary) simply has no target — the tour bar then sends the
 * reader back to the tour page rather than nowhere.
 */
function stepTarget(section: string): { href?: string; linkLabel?: string } {
  const pageLine = section.match(/^\s*(?:>\s*)?\*\*Page:?\*\*:?\s*([^\n]*)$/im)?.[1];
  const link = (pageLine ?? section).match(/\[([^\]]+)\]\(([^)]+)\)/);
  if (!link) return {};
  return { linkLabel: link[1].trim(), href: link[2].trim() };
}

function parseTourFile(filePath: string): Tour | null {
  const raw = fs.readFileSync(filePath, 'utf8');
  const { data, content } = matter(raw);
  const body = convertWikiLinksToNextLinks(content);

  // Where each step section begins; the first one also ends the intro.
  const starts: number[] = [];
  STEP_HEADING.lastIndex = 0;
  for (let m = STEP_HEADING.exec(body); m; m = STEP_HEADING.exec(body)) starts.push(m.index);

  const firstStep = starts[0] ?? body.length;

  // Where the steps stop and the closing sections (What you leave with, …) begin.
  let outroStart = body.length;
  ANY_H2.lastIndex = firstStep;
  for (let m = ANY_H2.exec(body); m; m = ANY_H2.exec(body)) {
    if (/^\s*Step\b/i.test(m[1])) continue;
    outroStart = m.index;
    break;
  }

  const steps: TourStep[] = starts.map((start, i) => {
    const end = Math.min(starts[i + 1] ?? outroStart, outroStart);
    const section = body.slice(start, end);
    const heading = section.match(/^##\s+([^\n]*)/)?.[1] ?? '';
    return {
      index: i + 1,
      // "Step 6: Look at one process up close" → "Look at one process up close"
      title: heading.replace(/^Step\s*\d+\s*[:.–-]?\s*/i, '').trim() || heading.trim(),
      ...stepTarget(section),
      do: labelledBlock(section, 'Do'),
      notice: labelledBlock(section, 'Notice'),
      note: prototypeNote(section),
      body: section.trim(),
    };
  });

  const outro = [] as Tour['outro'];
  const tail = body.slice(outroStart);
  const tailParts = tail.split(/^##\s+/m).filter(Boolean);
  tailParts.forEach(part => {
    const [heading, ...rest] = part.split('\n');
    const text = rest.join('\n').trim();
    if (heading.trim()) outro.push({ heading: heading.trim(), body: text });
  });

  const slug = path.basename(filePath, '.md').toLowerCase().replace(/\s+/g, '_');

  return {
    id: String(data.tour_id || slug),
    slug,
    title: data.title || slug,
    order: Number(data.order) || 0,
    status: data.status,
    question: data.question,
    who: data.who,
    priority: Boolean(data.priority),
    // Drop the body's own H1 — the tour page renders the title itself.
    intro: body.slice(0, firstStep).replace(/^\s*#\s+[^\n]*\n/, '').trim(),
    steps,
    outro,
  };
}

/**
 * Every tour in `tours/`, in authored order. Tours are walkthroughs of the
 * site itself — each step names a page to open, something to do there and
 * something to notice — so unlike the rest of the vault they are parsed into
 * structured steps rather than rendered as one markdown page, and they are
 * excluded from the wiki scanner (see `getAllMarkdownFiles`).
 */
export function getAllTours(): Tour[] {
  if (!fs.existsSync(toursDirectory)) return [];

  return fs
    .readdirSync(toursDirectory)
    .filter(file => file.endsWith('.md') && !file.startsWith('.'))
    .map(file => parseTourFile(path.join(toursDirectory, file)))
    .filter((tour): tour is Tour => tour !== null)
    .sort((a, b) => a.order - b.order || a.title.localeCompare(b.title));
}

export function getTourById(id: string): Tour | null {
  return getAllTours().find(tour => tour.id === id) ?? null;
}

/**
 * The tour bar renders Do/Notice as plain text (a markdown pass per step would
 * flicker on every step change), so flatten the light markup the scripts use.
 */
function plainText(markdown: string | undefined): string | undefined {
  if (!markdown) return undefined;
  return markdown
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')   // [label](/href) -> label
    .replace(/\*\*([^*]+)\*\*/g, '$1')         // **bold** -> bold
    .replace(/(?<!\w)[*_]([^*_]+)[*_](?!\w)/g, '$1')
    .replace(/\s+/g, ' ')
    .trim();
}

/** The compact shape the client needs: enough for the menu and for the tour bar to step through. */
export function getTourSummaries(): TourSummary[] {
  return getAllTours().map(tour => ({
    id: tour.id,
    title: tour.title,
    who: tour.who,
    steps: tour.steps.map(step => ({
      index: step.index,
      title: step.title,
      href: step.href,
      do: plainText(step.do),
      notice: plainText(step.notice),
    })),
  }));
}
