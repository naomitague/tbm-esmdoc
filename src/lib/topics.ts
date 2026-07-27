import { getAllContent } from '@/lib/markdown';
import { getAllModelContent } from '@/lib/models';
import { ContentMetadata } from '@/types';

export interface TopicLinkItem {
  slug: string;
  title: string;
  href: string;
}

export interface TopicGroup {
  topic: string;
  models: TopicLinkItem[];
  observations: TopicLinkItem[];
  patterns: TopicLinkItem[];
}

export interface TopicIndex {
  topics: TopicGroup[];
  relationships: TopicLinkItem[];
  /** flux/parameter slug -> its one topic (items are expected to carry a single `topic` tag). */
  itemTopics: Record<string, string>;
}

function getTitle(item: ContentMetadata): string {
  const meta = item.metadata as any;
  return meta.parameterName || meta.name || meta.title || meta.slug || '';
}

function getTopics(item: ContentMetadata): string[] {
  const meta = item.metadata as any;
  return Array.isArray(meta.topic) ? meta.topic : [];
}

function toLinkItem(item: ContentMetadata, href: string): TopicLinkItem {
  return { slug: item.metadata.slug, title: getTitle(item), href };
}

/**
 * Build the water model's topic index: a topic -> {models, observations,
 * patterns} breakdown, plus a separate flat list of "relationship of interest"
 * pages. Relationships are pulled out of the per-topic breakdown deliberately
 * — a relationship page (e.g. ET-vs-streamflow-vs-vegetation-change) already
 * is the destination, not a hub that fans out to other pages the way a topic
 * does, so it's browsed directly rather than surfaced as one of several
 * groups under a topic. A topic only appears in `topics` if it has at least
 * one model/observation/pattern tagged with it — topics that exist purely as
 * tags on a relationship page (e.g. "streamflow") aren't real topics on their
 * own and would otherwise show up with three empty groups.
 */
export function getTopicIndex(modelSlug: string): TopicIndex {
  const modelContent = getAllModelContent(modelSlug);
  const wikiContent = getAllContent();

  const groups = new Map<string, TopicGroup>();
  const ensure = (topic: string): TopicGroup => {
    let group = groups.get(topic);
    if (!group) {
      group = { topic, models: [], observations: [], patterns: [] };
      groups.set(topic, group);
    }
    return group;
  };

  const itemTopics: Record<string, string> = {};

  [...modelContent.fluxes, ...modelContent.parameters].forEach(item => {
    const type = item.type === 'parameter' ? 'parameters' : 'fluxes';
    const href = `/models/${modelSlug}/${type}/${item.metadata.slug}`;
    const itemTopicList = getTopics(item);
    itemTopicList.forEach(topic => ensure(topic).models.push(toLinkItem(item, href)));
    if (itemTopicList.length > 0) {
      itemTopics[item.metadata.slug] = itemTopicList[0];
    }
  });

  modelContent.observations.forEach(item => {
    const href = `/models/${modelSlug}/observations/${item.metadata.slug}`;
    getTopics(item).forEach(topic => ensure(topic).observations.push(toLinkItem(item, href)));
  });

  const relationships: TopicLinkItem[] = [];

  wikiContent
    .filter(item => item.type === 'overview' && (item.metadata as any).kind)
    .forEach(item => {
      const kind = (item.metadata as any).kind;
      const href = `/wiki/${item.metadata.slug}`;
      if (kind === 'pattern') {
        getTopics(item).forEach(topic => ensure(topic).patterns.push(toLinkItem(item, href)));
      } else if (kind === 'relationship') {
        relationships.push(toLinkItem(item, href));
      }
    });

  return {
    topics: Array.from(groups.values()).sort((a, b) => a.topic.localeCompare(b.topic)),
    relationships,
    itemTopics
  };
}
