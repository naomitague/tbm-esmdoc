import Link from 'next/link';
import { TopicGroup, TopicLinkItem } from '@/lib/topics';

export function formatTopic(topic: string): string {
  return topic.replace(/_/g, ' ');
}

export function TopicLinkList({
  items,
  emptyLabel,
  highlightedSlug,
}: {
  items: TopicLinkItem[];
  emptyLabel: string;
  highlightedSlug?: string | null;
}) {
  if (items.length === 0) {
    return <p className="text-xs text-stone-400 italic">{emptyLabel}</p>;
  }
  return (
    <ul className="space-y-1">
      {items.map(item => {
        const isHighlighted = item.slug === highlightedSlug;
        return (
          <li key={item.href}>
            <Link
              href={item.href}
              className={`text-sm hover:underline block py-0.5 px-1.5 -mx-1.5 rounded-md capitalize ${
                isHighlighted ? 'bg-primary-light text-primary font-medium' : 'text-primary'
              }`}
            >
              {formatTopic(item.title)}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

interface RelationshipNode extends TopicLinkItem {
  children: TopicLinkItem[];
}

/**
 * Groups relationship pages into parent + children: a page whose `parent`
 * (see TopicLinkItem.parentSlug) points at another relationship page *also
 * present in this same topic's list* nests under it; everything else — pages
 * with no parent, or whose parent isn't tagged with this topic — stays
 * top-level. That "isn't tagged with this topic" fallback matters: a child
 * page can be tagged with a narrower topic than its parent (e.g. a streamflow
 * sub-page's parent covers both evapotranspiration and streamflow), so under
 * the parent's other topic it should still surface rather than vanish.
 */
function buildRelationshipTree(items: TopicLinkItem[]): RelationshipNode[] {
  const slugsInGroup = new Set(items.map(item => item.slug));
  const childrenByParent = new Map<string, TopicLinkItem[]>();
  const roots: TopicLinkItem[] = [];

  items.forEach(item => {
    if (item.parentSlug && item.parentSlug !== item.slug && slugsInGroup.has(item.parentSlug)) {
      const siblings = childrenByParent.get(item.parentSlug) ?? [];
      siblings.push(item);
      childrenByParent.set(item.parentSlug, siblings);
    } else {
      roots.push(item);
    }
  });

  return roots.map(root => ({ ...root, children: childrenByParent.get(root.slug) ?? [] }));
}

function RelationshipList({ items, emptyLabel }: { items: TopicLinkItem[]; emptyLabel: string }) {
  if (items.length === 0) {
    return <p className="text-xs text-stone-400 italic">{emptyLabel}</p>;
  }
  const tree = buildRelationshipTree(items);
  return (
    <ul className="space-y-1.5">
      {tree.map(node => (
        <li key={node.href}>
          <Link
            href={node.href}
            className="text-sm text-primary hover:underline block py-0.5 px-1.5 -mx-1.5 rounded-md capitalize"
          >
            {formatTopic(node.title)}
          </Link>
          {node.children.length > 0 && (
            <ul className="ml-2 mt-0.5 space-y-0.5 border-l border-stone-200 pl-3">
              {node.children.map(child => (
                <li key={child.href}>
                  <Link
                    href={child.href}
                    className="text-xs text-primary/80 hover:text-primary hover:underline block py-0.5 capitalize"
                  >
                    {formatTopic(child.title)}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </li>
      ))}
    </ul>
  );
}

/**
 * The Models/Observations/Patterns/Relationships breakdown for one topic —
 * shared between the interactive topic browser on a model's overview page
 * (TopicExplorer, wrapped in its own search/select chrome) and the static
 * per-topic panel shown on a flux/parameter/observation's own detail page
 * (which already knows its one topic and just needs this list, not a picker).
 */
export function TopicGroupSections({
  group,
  highlightedSlug,
}: {
  group: TopicGroup;
  highlightedSlug?: string | null;
}) {
  return (
    <div className="space-y-4">
      <div>
        <h4 className="text-xs uppercase tracking-wide text-stone-400 mb-1.5 flex items-center gap-2">
          <span className="badge badge-lg badge-flux">Model</span>
          Models
        </h4>
        <TopicLinkList items={group.models} emptyLabel="No model pages tagged yet" highlightedSlug={highlightedSlug} />
      </div>

      <div>
        <h4 className="text-xs uppercase tracking-wide text-stone-400 mb-1.5 flex items-center gap-2">
          <span className="badge badge-lg badge-observation">Obs</span>
          Observations
        </h4>
        <TopicLinkList items={group.observations} emptyLabel="No observation pages tagged yet" />
      </div>

      <div>
        <h4 className="text-xs uppercase tracking-wide text-stone-400 mb-1.5 flex items-center gap-2">
          <span className="badge badge-lg badge-pattern">Pattern</span>
          Patterns
        </h4>
        <TopicLinkList items={group.patterns} emptyLabel="No patterns tagged yet" />
      </div>

      <div>
        <h4 className="text-xs uppercase tracking-wide text-stone-400 mb-1.5 flex items-center gap-2">
          <span className="badge badge-lg badge-relationship">Rel.</span>
          Relationships of interest
        </h4>
        <RelationshipList items={group.relationships} emptyLabel="No relationships tagged yet" />
      </div>
    </div>
  );
}
