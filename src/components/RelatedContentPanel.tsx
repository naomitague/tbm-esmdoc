import Link from 'next/link';
import { ChevronDown } from 'lucide-react';
import { RelatedContentItem } from '@/types';

const TYPE_LABELS: Record<RelatedContentItem['type'], string> = {
  flux: 'Flux',
  parameter: 'Param',
  observation: 'Obs',
  pattern: 'Pattern',
  relationship: 'Rel.',
};

/**
 * Author-curated "see also" panel, replacing the old auto-derived Connections
 * panel (which just listed whatever a note happened to [[wikilink]] — often
 * not the same as what's actually conceptually relevant). An item without
 * `href` is a page that doesn't exist yet: shown as a muted placeholder
 * rather than a link, so the gap is visible instead of silently omitted.
 */
export function RelatedContentPanel({ items, title }: { items: RelatedContentItem[]; title: string }) {
  if (items.length === 0) return null;

  return (
    <div className="bg-white rounded-lg border border-stone-200 p-5">
      <h2 className="text-lg font-semibold mb-3">{title}</h2>
      <ul className="space-y-2">
        {items.map(item => (
          <li key={item.label} className="flex items-center gap-2">
            <span className={`badge badge-lg badge-${item.type}`}>{TYPE_LABELS[item.type]}</span>
            {item.href ? (
              <Link href={item.href} className="text-sm text-primary hover:underline">
                {item.label}
              </Link>
            ) : (
              <span className="text-sm text-stone-400 italic" title="Not written yet">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

const TYPE_NAMES: Record<RelatedContentItem['type'], string> = {
  flux: 'Flux',
  parameter: 'Parameter',
  observation: 'Observation',
  pattern: 'Pattern',
  relationship: 'Relationship',
};

/**
 * The same list as a collapsed disclosure for the left outline sidebar on
 * pattern/relationship pages: kept deliberately quiet (a type-colored dot
 * rather than a filled badge, closed by default) so it doesn't compete with
 * the page's Synthesis Papers. Native <details>, so no client JS.
 */
export function RelatedContentSidebar({ items, title }: { items: RelatedContentItem[]; title: string }) {
  if (items.length === 0) return null;

  return (
    <details className="group">
      <summary className="flex cursor-pointer list-none items-center justify-between text-xs font-medium uppercase tracking-wide text-stone-400 hover:text-stone-600 [&::-webkit-details-marker]:hidden">
        <span>
          {title} <span className="normal-case tracking-normal">· {items.length}</span>
        </span>
        <ChevronDown className="h-3.5 w-3.5 transition-transform group-open:rotate-180" strokeWidth={1.5} />
      </summary>
      <ul className="mt-2 space-y-1">
        {items.map(item => (
          <li key={item.label} className="flex items-start gap-2 text-sm" title={TYPE_NAMES[item.type]}>
            <span className={`badge-${item.type} mt-[5px] h-2 w-2 flex-shrink-0 rounded-full`} aria-hidden="true" />
            <span className="sr-only">{TYPE_NAMES[item.type]}:</span>
            {item.href ? (
              <Link href={item.href} className="leading-snug text-stone-600 no-underline hover:text-primary hover:underline">
                {item.label}
              </Link>
            ) : (
              <span className="leading-snug text-stone-400 italic" title="Not written yet">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ul>
    </details>
  );
}
