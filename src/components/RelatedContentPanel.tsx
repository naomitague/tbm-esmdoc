import Link from 'next/link';
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
