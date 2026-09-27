import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { PageLinksConfig } from '@/types';

/**
 * A row of button-sized links to other notes, spliced in after a heading
 * (`page_links:` frontmatter). For a hub page whose worked examples live on
 * their own pages: prominent enough to read as the way onward, unlike a
 * markdown link buried in a paragraph.
 */
export function PageLinks({ items }: { items: PageLinksConfig['items'] }) {
  if (items.length === 0) return null;

  return (
    <div className="my-4 grid gap-3 sm:grid-cols-2">
      {items.map(item => (
        <Link
          key={item.href}
          href={item.href}
          className="group flex items-center justify-between gap-3 rounded-lg border border-stone-300 bg-white px-4 py-3 no-underline transition-colors hover:border-primary hover:bg-primary-light"
        >
          <span>
            <span className="block font-medium text-stone-900">{item.label}</span>
            {item.description && <span className="mt-0.5 block text-xs text-stone-500">{item.description}</span>}
          </span>
          <ArrowRight className="h-4 w-4 flex-shrink-0 text-stone-400 transition-colors group-hover:text-primary" strokeWidth={1.5} />
        </Link>
      ))}
    </div>
  );
}

/**
 * The same links as a compact card for the left outline sidebar
 * (`page_links.sidebar: true`) — a hub page's worked examples shouldn't
 * require scrolling down to their heading to be found.
 */
export function PageLinksSidebar({ items, title }: { items: PageLinksConfig['items']; title: string }) {
  if (items.length === 0) return null;

  return (
    <div>
      <h3 className="text-xs font-medium uppercase tracking-wide text-stone-400 mb-2">{title}</h3>
      <ul className="space-y-1.5">
        {items.map(item => (
          <li key={item.href}>
            <Link
              href={item.href}
              className="group flex items-start gap-2 rounded border border-stone-200 px-2 py-1.5 text-sm text-stone-700 no-underline transition-colors hover:border-primary hover:bg-primary-light hover:text-primary"
            >
              <ArrowRight
                className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-stone-400 transition-colors group-hover:text-primary"
                strokeWidth={1.5}
              />
              <span>
                <span className="block leading-snug">{item.label}</span>
                {item.description && <span className="mt-0.5 block text-xs text-stone-500">{item.description}</span>}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
