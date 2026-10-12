import { getAllContent } from '@/lib/markdown';
import { getAllModelContent } from '@/lib/models';
import { ContentMetadata } from '@/types';

export interface TopicLinkItem {
  slug: string;
  title: string;
  href: string;
  /** For relationship items: slug of a broader relationship page this one nests under, if any — see TopicGroupSections. */
  parentSlug?: string;
}

export interface TopicGroup {
  topic: string;
  models: TopicLinkItem[];
  observations: TopicLinkItem[];
  patterns: TopicLinkItem[];
  relationships: TopicLinkItem[];
}

export interface TopicIndex {
  topics: TopicGroup[];
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
 * patterns, relationships} breakdown. Relationships are filed under every
 * topic they're tagged with, same as patterns — a relationship page like
 * "peak streamflow response to vegetation change" is tagged `[streamflow,
 * vegetation_change]`, not `evapotranspiration`, so it should only surface
 * under those topics, not under every topic a *different* relationship page
 * happens to touch. A topic only appears in `topics` if it has at least one
 * model/observation/pattern/relationship tagged with it.
 */
export function getTopicIndex(modelSlug: string): TopicIndex {
  const modelContent = getAllModelContent(modelSlug);
  const wikiContent = getAllContent();

  const groups = new Map<string, TopicGroup>();
  const ensure = (topic: string): TopicGroup => {
    let group = groups.get(topic);
    if (!group) {
      group = { topic, models: [], observations: [], patterns: [], relationships: [] };
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

  wikiContent
    .filter(item => item.type === 'overview' && (item.metadata as any).kind)
    .forEach(item => {
      const kind = (item.metadata as any).kind;
      const href = `/wiki/${item.metadata.slug}`;
      if (kind === 'pattern') {
        getTopics(item).forEach(topic => ensure(topic).patterns.push(toLinkItem(item, href)));
      } else if (kind === 'relationship') {
        const parentSlug = (item.metadata as any).parent;
        getTopics(item).forEach(topic => ensure(topic).relationships.push({ ...toLinkItem(item, href), parentSlug }));
      }
    });

  return {
    topics: Array.from(groups.values()).sort((a, b) => a.topic.localeCompare(b.topic)),
    itemTopics
  };
}

export interface RelationshipOfInterest {
  slug: string;
  title: string;
  href: string;
  topics: string[];
  /** How many narrower relationship pages nest under this one via their `parent`. */
  childCount: number;
}

/**
 * Top-level relationship pages for a model overview's "Relationships of
 * interest" panel: `kind: relationship`, no `parent`, and either `model:
 * <modelSlug>` or tagged with one of `extraTopics` (the model index's
 * `relationship_topics`, e.g. vegetation-som pulls in `vegetation_change` pages that
 * live under water). Sub-topic pages (e.g. per-metric pages under a hub page)
 * are reached from their hub rather than listed alongside it.
 */
export function getRelationshipsOfInterest(modelSlug: string, extraTopics: string[] = []): RelationshipOfInterest[] {
  const relationships = getAllContent().filter(
    item => item.type === 'overview' && (item.metadata as any).kind === 'relationship'
  );

  return relationships
    .filter(item => !(item.metadata as any).parent)
    .filter(
      item =>
        (item.metadata as any).model === modelSlug ||
        getTopics(item).some(topic => extraTopics.includes(topic))
    )
    .map(item => ({
      slug: item.metadata.slug,
      title: getTitle(item),
      href: `/wiki/${item.metadata.slug}`,
      topics: getTopics(item),
      childCount: relationships.filter(r => (r.metadata as any).parent === item.metadata.slug).length,
    }))
    .sort((a, b) => a.title.localeCompare(b.title));
}

export interface SynthesisEntry {
  slug: string;
  title: string;
  href: string;
  topics: string[];
  model?: string;
  description?: string;
  /** Narrower pages that set `parent: <this slug>` — the worked examples under a hub. */
  children: TopicLinkItem[];
}

export interface SynthesisIndex {
  /** `kind: relationship` hubs (no `parent`), across every model. */
  relationships: SynthesisEntry[];
  /** `kind: pattern` pages — topic-scoped, not relationship hubs. */
  patterns: SynthesisEntry[];
  /** Every topic tag in use across the two lists. */
  topics: string[];
}

/**
 * The whole vault's synthesis layer, for `/synthesis`: the relationship hubs
 * each with the narrower pages nested under it, plus the topic-scoped pattern
 * pages. Unlike `getRelationshipsOfInterest`, this isn't scoped to one model —
 * the point of the page is to show every topic the site covers.
 */
export function getSynthesisIndex(): SynthesisIndex {
  const all = getAllContent().filter(item => item.type === 'overview');
  const kindOf = (item: ContentMetadata) => (item.metadata as any).kind;

  const toEntry = (item: ContentMetadata): SynthesisEntry => {
    const meta = item.metadata as any;
    return {
      slug: item.metadata.slug,
      title: getTitle(item),
      href: `/wiki/${item.metadata.slug}`,
      topics: getTopics(item),
      model: meta.model,
      description: meta.description || undefined,
      children: all
        .filter(child => (child.metadata as any).parent === item.metadata.slug)
        .map(child => toLinkItem(child, `/wiki/${child.metadata.slug}`))
        .sort((a, b) => a.title.localeCompare(b.title)),
    };
  };

  const relationships = all
    .filter(item => kindOf(item) === 'relationship' && !(item.metadata as any).parent)
    .map(toEntry)
    .sort((a, b) => b.children.length - a.children.length || a.title.localeCompare(b.title));

  const patterns = all
    .filter(item => kindOf(item) === 'pattern' && !(item.metadata as any).parent)
    .map(toEntry)
    .sort((a, b) => a.title.localeCompare(b.title));

  const topics = Array.from(
    new Set([...relationships, ...patterns].flatMap(entry => entry.topics))
  ).sort();

  return { relationships, patterns, topics };
}
