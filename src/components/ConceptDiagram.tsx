'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { X } from 'lucide-react';
import { ConceptConsideration, ConceptDiagramData, ProcessPageLink } from '@/types';

/** Process boxes in the SVG — everything else (arrows, band labels) is inert. */
const BOX_SELECTOR = 'g[data-process-id], g[data-process-ids]';
const SVG_NS = 'http://www.w3.org/2000/svg';

const TYPE_LABELS: Record<ProcessPageLink['type'], string> = {
  flux: 'flux',
  parameter: 'parameter',
  observation: 'observation',
  model: 'model',
  page: '',
};

function boxProcessIds(box: Element): string[] {
  const ids = box.getAttribute('data-process-ids') ?? box.getAttribute('data-process-id') ?? '';
  return ids.split(',').map(id => id.trim()).filter(Boolean);
}

function pagesForIds(data: ConceptDiagramData, ids: string[]): ProcessPageLink[] {
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

/** A box's own label, straight off the figure — the concept diagram has no coverage CSV to name its processes from. */
function boxLabel(box: Element): string {
  return box.querySelector(':scope > text')?.textContent?.trim() ?? boxProcessIds(box).join(', ');
}

interface SelectedBox {
  key: string;
  label: string;
  links: ProcessPageLink[];
}

/**
 * A concept figure on a pattern/relationship page: the same
 * `data-process-id(s)`-tagged SVG the model overviews use, minus the ESM
 * picker and coverage shading. A box whose process(es) exactly one page claims
 * navigates there on click; a box several pages claim opens a small picker
 * below the figure; a box nothing claims is left as plain, inert artwork.
 *
 * `considerations` renders beside the figure — the questions a reader has to
 * settle before two studies of the same relationship are comparable at all.
 */
export function ConceptDiagram({ data }: { data: ConceptDiagramData }) {
  const router = useRouter();
  const svgRef = useRef<HTMLDivElement>(null);
  const [selected, setSelected] = useState<SelectedBox | null>(null);

  useEffect(() => {
    const root = svgRef.current;
    if (!root) return;

    root.querySelectorAll(BOX_SELECTOR).forEach(box => {
      const ids = boxProcessIds(box);
      const links = pagesForIds(data, ids);

      if (links.length === 0) {
        // Nothing documents this box yet: leave it on the figure, but not as
        // an affordance that goes nowhere.
        box.setAttribute('data-inert', 'true');
        box.removeAttribute('tabindex');
        box.removeAttribute('role');
      } else {
        box.removeAttribute('data-inert');
        box.setAttribute('tabindex', '0');
        box.setAttribute('role', links.length === 1 ? 'link' : 'button');
      }
      if (ids.join(',') === selected?.key) box.setAttribute('data-selected', 'true');
      else box.removeAttribute('data-selected');

      let title = box.querySelector(':scope > title');
      if (!title) {
        title = document.createElementNS(SVG_NS, 'title');
        box.prepend(title);
      }
      title.textContent =
        links.length === 0
          ? `${boxLabel(box)} — no page yet`
          : links.length === 1
            ? `Open "${links[0].title}"`
            : `${boxLabel(box)} — ${links.length} related pages`;
    });
  }, [data, selected]);

  function activate(box: Element) {
    const ids = boxProcessIds(box);
    const links = pagesForIds(data, ids);
    if (links.length === 0) return;
    if (links.length === 1) {
      router.push(links[0].href);
      return;
    }
    setSelected({ key: ids.join(','), label: boxLabel(box), links });
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

  // The figure's labels scale with it, so it takes the remaining width and the
  // considerations sit in a fixed-width column beside it.
  return (
    <div className="my-4 flex flex-col gap-6 lg:flex-row">
      <div className="min-w-0 flex-1">
        <p className="mb-2 text-xs text-stone-500">
          Click a box to open the page documenting it — boxes without a page yet are shown for context.
        </p>
        <div
          ref={svgRef}
          className="process-diagram"
          onClick={handleClick}
          onKeyDown={handleKeyDown}
          dangerouslySetInnerHTML={{ __html: data.svgMarkup }}
        />

        {selected && (
          <div className="mt-3 rounded-lg border border-stone-200 bg-white p-4 text-sm">
            <div className="mb-2 flex items-start justify-between gap-2">
              <h3 className="font-heading text-base">{selected.label}</h3>
              <button
                type="button"
                onClick={() => setSelected(null)}
                aria-label="Close"
                className="text-stone-400 hover:text-stone-700"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="space-y-1">
              {selected.links.map(link => (
                <Link key={link.href} href={link.href} className="flex items-baseline gap-2 py-0.5 hover:underline">
                  <span className="text-primary">{link.title}</span>
                  {TYPE_LABELS[link.type] && (
                    <span className="text-xs text-stone-400">{TYPE_LABELS[link.type]}</span>
                  )}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {data.considerations.length > 0 && (
        <div className="flex-shrink-0 space-y-3 lg:w-56 xl:w-64">
          <div className="text-xs uppercase tracking-wide text-stone-500">Key considerations</div>
          {data.considerations.map(consideration => (
            <ConsiderationCard key={consideration.title} consideration={consideration} />
          ))}
        </div>
      )}
    </div>
  );
}

function ConsiderationCard({ consideration }: { consideration: ConceptConsideration }) {
  return (
    <div className="rounded-lg border border-stone-200 bg-white p-4">
      <h3 className="font-heading text-base text-stone-900">
        {consideration.title}
        {consideration.subtitle && (
          <span className="ml-2 text-xs font-normal text-stone-500">{consideration.subtitle}</span>
        )}
      </h3>
      <ul className="mt-2 space-y-1.5 text-sm">
        {consideration.items.map(item => (
          <li key={item.label}>
            {/* A bare label is a list entry; one carrying a note reads as its heading. */}
            <div className={item.note ? 'font-medium text-stone-800' : 'text-stone-700'}>
              {item.href ? (
                <Link href={item.href} className="text-primary hover:underline">
                  {item.label}
                </Link>
              ) : (
                item.label
              )}
            </div>
            {item.note && <div className="text-stone-600">{item.note}</div>}
          </li>
        ))}
      </ul>
    </div>
  );
}
