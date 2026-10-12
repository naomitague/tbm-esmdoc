import { getAllContent } from '@/lib/markdown';
import { ResolvedSynthesisLink, SYNTHESIS_SCALES, SynthesisLinksConfig } from '@/types';

/** Ladder index for a scale tag, or null for blank / `TBD` / an unknown value. */
function scaleIndex(value: unknown): number | null {
  if (typeof value !== 'string') return null;
  const index = (SYNTHESIS_SCALES as readonly string[]).indexOf(value.trim().toLowerCase());
  return index >= 0 ? index : null;
}

/**
 * Resolve each `synthesis_links` item's scale range: the item's own
 * `min_scale`/`max_scale` if set, else the target page's frontmatter (for
 * `/wiki/<slug>` hrefs). A `TBD` bound collapses onto the known one, so
 * `TBD → watershed` lights up watershed alone rather than guessing downward.
 */
export function resolveSynthesisLinks(config: SynthesisLinksConfig): ResolvedSynthesisLink[] {
  const pages = new Map(getAllContent().map(content => [content.metadata.slug, content.metadata as any]));

  return config.items.map(item => {
    const slug = item.href.match(/^\/wiki\/([^/?#]+)/)?.[1];
    const page = slug ? pages.get(decodeURIComponent(slug)) : undefined;
    const min = scaleIndex(item.min_scale ?? page?.min_scale);
    const max = scaleIndex(item.max_scale ?? page?.max_scale);
    const low = min ?? max;
    const high = max ?? min;

    return {
      label: item.label,
      href: item.href,
      description: item.description,
      scaleRange: low === null || high === null ? null : [Math.min(low, high), Math.max(low, high)],
    };
  });
}
