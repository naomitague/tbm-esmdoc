'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { X } from 'lucide-react';
import { MarkdownContent } from '@/components/MarkdownContent';
import { splitAtHeadings } from '@/lib/headingSplit';
import { ProcessDiagramData, ProcessPageLink } from '@/types';

/** Process boxes in the SVG — everything else (category bands, arrows) is inert. */
const BOX_SELECTOR = 'g[data-process-id], g[data-process-ids]';
const SVG_NS = 'http://www.w3.org/2000/svg';

const COVERAGE_LABELS: Record<string, string> = {
  yes: 'Represented',
  partial: 'Partial',
  no: 'Not represented',
  needs_verification: 'Needs verification',
};

const COVERAGE_BADGES: Record<string, string> = {
  yes: 'bg-emerald-100 text-emerald-800',
  partial: 'bg-sky-100 text-sky-800',
  no: 'bg-stone-200 text-stone-600',
  needs_verification: 'bg-amber-100 text-amber-800',
};

function boxProcessIds(box: Element): string[] {
  const ids = box.getAttribute('data-process-ids') ?? box.getAttribute('data-process-id') ?? '';
  return ids.split(',').map(id => id.trim()).filter(Boolean);
}

function pagesForIds(data: ProcessDiagramData, ids: string[]): ProcessPageLink[] {
  const seen = new Set<string>();
  const links: ProcessPageLink[] = [];
  ids.forEach(id =>
    (data.pages[id] ?? []).forEach(link => {
      if (seen.has(link.href)) return;
      seen.add(link.href);
      links.push(link);
    })
  );
  return links;
}

/**
 * One status for a box that bundles several processes (e.g. "Aging" =
 * porosity + density + albedo): unanimous → that status, any mix → partial.
 */
function aggregateCoverage(statuses: string[]): string | null {
  const known = statuses.filter(Boolean);
  if (known.length === 0) return null;
  return known.every(s => s === known[0]) ? known[0] : 'partial';
}

/** Element-marker letters (the small circles on plant-organ boxes) → that element's storage pool suffix. */
const MARKER_POOLS: Record<string, { suffix: string; name: string }> = {
  C: { suffix: 'c', name: 'carbon' },
  N: { suffix: 'n', name: 'nitrogen' },
  P: { suffix: 'p', name: 'phosphorus' },
  O: { suffix: 'other', name: 'other reserves' },
};

/**
 * Element markers — the small C/N/P/O circles on leaf/stem/root boxes —
 * follow the selected model's coverage of that element's storage pool in the
 * same organ (an "N" circle on a stem box follows `stem_storage_n`), so e.g.
 * P circles grey out for a model with no phosphorus cycle. Other letters
 * (W, S) are left alone. Returns how many markers the box has, plus tooltip
 * text for any that aren't fully represented.
 */
function updateElementMarkers(
  box: Element,
  ids: string[],
  data: ProcessDiagramData,
  selectedModel: string | null
): { count: number; lines: string[] } {
  const organ = ids[0]?.match(/^(leaf|stem|root)_/)?.[1];
  if (!organ) return { count: 0, lines: [] };

  let count = 0;
  const lines: string[] = [];
  box.querySelectorAll(':scope > circle').forEach(circle => {
    const label = circle.nextElementSibling;
    if (!label || label.tagName.toLowerCase() !== 'text') return;
    const letter = label.textContent?.trim() ?? '';
    const pool = MARKER_POOLS[letter];
    if (!pool) return;

    count++;
    const coverage = selectedModel
      ? data.processes[`${organ}_storage_${pool.suffix}`]?.byModel[selectedModel]?.coverage
      : undefined;
    [circle, label].forEach(el =>
      coverage ? el.setAttribute('data-marker-coverage', coverage) : el.removeAttribute('data-marker-coverage')
    );
    if (coverage && coverage !== 'yes') {
      lines.push(`${letter} (${pool.name}): ${COVERAGE_LABELS[coverage] ?? coverage}`);
    }
  });
  return { count, lines };
}

function tooltipText(
  data: ProcessDiagramData,
  ids: string[],
  selectedModel: string | null,
  links: ProcessPageLink[],
  markerLines: string[] = []
): string {
  const model = data.models.find(m => m.modelId === selectedModel);
  const lines = ids.map(id => {
    const info = data.processes[id];
    if (!info) return id;
    if (!model) return info.process;
    const entry = info.byModel[model.modelId];
    if (!entry) return `${info.process}: no coverage data`;
    const label = COVERAGE_LABELS[entry.coverage] ?? entry.coverage;
    return `${info.process}: ${label}${entry.note ? ` — ${entry.note}` : ''}`;
  });
  if (model) lines.unshift(model.shortName);
  if (markerLines.length > 0) lines.push(`Elements — ${markerLines.join(' · ')}`);
  lines.push(links.length === 1 ? `Click to open "${links[0].title}"` : 'Click for model coverage');
  return lines.join('\n');
}

interface ProcessDiagramProps {
  data: ProcessDiagramData;
  selectedModel: string | null;
  onSelectModel: (modelId: string | null) => void;
  selectedIds: string[] | null;
  onSelectIds: (ids: string[]) => void;
}

/**
 * The model overview's process diagram: an inline SVG whose boxes are tagged
 * with `data-process-id(s)`. Picking an ESM marks each box with that model's
 * coverage (styled in globals.css under `.process-diagram`); clicking a box
 * opens its page when exactly one note claims it via `process_ids`, and
 * otherwise asks the parent to show the coverage panel for it.
 */
export function ProcessDiagram({ data, selectedModel, onSelectModel, selectedIds, onSelectIds }: ProcessDiagramProps) {
  const router = useRouter();
  const svgRef = useRef<HTMLDivElement>(null);
  const selectedKey = selectedIds?.join(',') ?? '';
  const [hasMarkers, setHasMarkers] = useState(false);

  useEffect(() => {
    const root = svgRef.current;
    if (!root) return;

    let markerCount = 0;
    root.querySelectorAll(BOX_SELECTOR).forEach(box => {
      const ids = boxProcessIds(box);
      const links = pagesForIds(data, ids);
      const status = selectedModel
        ? aggregateCoverage(ids.map(id => data.processes[id]?.byModel[selectedModel]?.coverage ?? ''))
        : null;

      if (status) box.setAttribute('data-coverage', status);
      else box.removeAttribute('data-coverage');
      if (ids.join(',') === selectedKey) box.setAttribute('data-selected', 'true');
      else box.removeAttribute('data-selected');
      box.setAttribute('tabindex', '0');
      box.setAttribute('role', links.length === 1 ? 'link' : 'button');

      const markers = updateElementMarkers(box, ids, data, selectedModel);
      markerCount += markers.count;

      let title = box.querySelector(':scope > title');
      if (!title) {
        title = document.createElementNS(SVG_NS, 'title');
        box.prepend(title);
      }
      title.textContent = tooltipText(data, ids, selectedModel, links, markers.lines);
    });

    setHasMarkers(markerCount > 0);
  }, [data, selectedModel, selectedKey]);

  function activate(box: Element) {
    const ids = boxProcessIds(box);
    const links = pagesForIds(data, ids);
    if (links.length === 1) {
      router.push(links[0].href);
    } else {
      onSelectIds(ids);
    }
  }

  function handleClick(e: React.MouseEvent<HTMLDivElement>) {
    const box = (e.target as Element).closest(BOX_SELECTOR);
    if (box) activate(box);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    if (e.key !== 'Enter' && e.key !== ' ') return;
    const box = (e.target as Element).closest(BOX_SELECTOR);
    if (!box) return;
    e.preventDefault();
    activate(box);
  }

  const pickerButton = (key: string, label: string, title: string, modelId: string | null) => {
    const active = selectedModel === modelId;
    return (
      <button
        key={key}
        type="button"
        title={title}
        onClick={() => onSelectModel(modelId)}
        className={`rounded-full border px-3 py-1 text-sm transition-colors ${
          active
            ? 'border-stone-800 bg-stone-800 text-white'
            : 'border-stone-300 bg-white text-stone-700 hover:border-stone-500'
        }`}
      >
        {label}
      </button>
    );
  };

  return (
    <div className="my-4">
      <div className="flex flex-wrap items-center gap-2">
        <span className="mr-1 text-xs uppercase tracking-wide text-stone-500">View as</span>
        {pickerButton('framework', 'Framework', 'Every process in the conceptual framework', null)}
        {data.models.map(m => pickerButton(m.modelId, m.shortName, m.displayName, m.modelId))}
      </div>

      <div className="mt-2 mb-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-stone-500">
        {selectedModel ? (
          <>
            <span className="flex items-center gap-1.5">
              <span className="inline-block h-3 w-5 rounded-sm border border-stone-500 bg-white" />
              Represented
            </span>
            <span className="flex items-center gap-1.5">
              <span className="inline-block h-3 w-5 rounded-sm border border-dashed border-stone-500 bg-white opacity-75" />
              Partial
            </span>
            <span className="flex items-center gap-1.5">
              <span className="inline-block h-3 w-5 rounded-sm border border-stone-300 bg-stone-100 opacity-60" />
              Not represented
            </span>
            <span className="flex items-center gap-1.5">
              <span className="inline-block h-3 w-5 rounded-sm border border-dashed border-amber-500 bg-white" />
              Needs verification
            </span>
            {hasMarkers && (
              <span>C · N · P · O circles: grey = element not tracked in that organ, faded = partial</span>
            )}
          </>
        ) : (
          <span>Pick an ESM to grey out the processes it doesn&apos;t represent. Click a box to open its page or see model coverage.</span>
        )}
      </div>

      <div
        ref={svgRef}
        className="process-diagram"
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        dangerouslySetInnerHTML={{ __html: data.svgMarkup }}
      />
    </div>
  );
}

interface ProcessCoveragePanelProps {
  data: ProcessDiagramData;
  ids: string[];
  selectedModel: string | null;
  onClose: () => void;
}

/** Per-model coverage (status, mechanism note, citation) for one diagram box, plus links to any pages claiming it. */
export function ProcessCoveragePanel({ data, ids, selectedModel, onClose }: ProcessCoveragePanelProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const idsKey = ids.join(',');

  useEffect(() => {
    panelRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, [idsKey]);

  const processes = ids.flatMap(id => (data.processes[id] ? [{ id, info: data.processes[id] }] : []));
  const links = pagesForIds(data, ids);

  return (
    <div ref={panelRef} className="max-h-[85vh] overflow-y-auto rounded-lg border border-stone-200 bg-white p-5 text-sm">
      <div className="mb-3 flex items-start justify-between gap-2">
        <h3 className="font-heading text-base">{processes.map(p => p.info.process).join(' · ') || idsKey}</h3>
        <button type="button" onClick={onClose} aria-label="Close" className="text-stone-400 hover:text-stone-700">
          <X className="h-4 w-4" />
        </button>
      </div>

      {links.length > 0 && (
        <div className="mb-4">
          <div className="mb-1 text-xs uppercase tracking-wide text-stone-500">Pages</div>
          {links.map(link => (
            <Link key={link.href} href={link.href} className="block py-0.5 text-primary hover:underline">
              {link.title}
            </Link>
          ))}
        </div>
      )}

      {processes.map(({ id, info }) => (
        <div key={id} className="mb-4 last:mb-0">
          {processes.length > 1 && <div className="mb-1 font-medium text-stone-800">{info.process}</div>}
          <div className="space-y-2">
            {data.models.map(m => {
              const entry = info.byModel[m.modelId];
              if (!entry) return null;
              return (
                <div
                  key={m.modelId}
                  className={`rounded-md p-2 ${m.modelId === selectedModel ? 'bg-stone-100 ring-1 ring-stone-300' : ''}`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-medium text-stone-800" title={m.displayName}>{m.shortName}</span>
                    <span className={`rounded-full px-2 py-0.5 text-xs ${COVERAGE_BADGES[entry.coverage] ?? 'bg-stone-100 text-stone-600'}`}>
                      {COVERAGE_LABELS[entry.coverage] ?? entry.coverage}
                    </span>
                  </div>
                  {entry.note && <div className="mt-1 text-xs text-stone-600">{entry.note}</div>}
                  {entry.citation && <div className="mt-0.5 text-[11px] text-stone-400">{entry.citation}</div>}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * Renders `content` with `children` spliced in right after `heading` (same
 * exact-string rule as the other interactive-content protocols); if the
 * heading isn't found, renders the markdown alone. With no `heading` declared
 * at all the diagram leads the page, ahead of the markdown — an overview whose
 * hero already names the model doesn't need a heading to introduce its figure.
 */
export function MarkdownWithDiagram({
  content,
  heading,
  children,
}: {
  content: string;
  heading?: string;
  children: React.ReactNode;
}) {
  if (!heading) {
    return (
      <>
        {children}
        <MarkdownContent content={content} />
      </>
    );
  }

  const segments = splitAtHeadings(content, [heading]);
  if (!segments) return <MarkdownContent content={content} />;

  return (
    <>
      <MarkdownContent content={segments[0]} />
      {children}
      <MarkdownContent content={segments[1]} />
    </>
  );
}
