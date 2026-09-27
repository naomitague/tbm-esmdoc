import { readDiagramSvg } from './diagramSvg';
import { getAllModelContent, getAllModels } from './models';
import {
  ConceptDiagramConfig,
  ConceptDiagramData,
  ContentMetadata,
  ProcessPageLink,
} from '@/types';

/**
 * Loads a pattern/relationship page's concept diagram: the same
 * `data-process-id(s)`-tagged figures the model overviews use, but without the
 * ESM picker or coverage CSV — here the boxes are only a map of the idea, and
 * a box links out when some note claims its process(es).
 *
 * The difference from `readProcessDiagram` is scope: a concept diagram on a
 * relationship page spans models (vegetation drivers on top, hydrology
 * below), so `process_ids` are resolved against EVERY model's notes rather
 * than one model's, and `links:` in frontmatter can point a box at any page
 * (typically a sibling pattern page, which no `process_ids` frontmatter would
 * ever claim). Returns null if the SVG is missing, so the page falls back to
 * plain markdown the same way a mismatched heading does.
 */
export function readConceptDiagram(config: ConceptDiagramConfig): ConceptDiagramData | null {
  const svgMarkup = readDiagramSvg(config.svg, config.text_scale);
  if (!svgMarkup) return null;

  const pages: Record<string, ProcessPageLink[]> = {};
  const addPages = (modelSlug: string, items: ContentMetadata[], type: ProcessPageLink['type'], dir: string) => {
    items.forEach(item => {
      const meta = item.metadata as any;
      const processIds: string[] = meta.processIds || [];
      processIds.forEach(id => {
        (pages[id] ??= []).push({
          href: `/models/${modelSlug}/${dir}/${meta.slug}`,
          title: meta.title || meta.parameterName || meta.slug,
          type,
        });
      });
    });
  };

  getAllModels().forEach(model => {
    const content = getAllModelContent(model.slug);
    addPages(model.slug, content.fluxes, 'flux', 'fluxes');
    addPages(model.slug, content.parameters, 'parameter', 'parameters');
    addPages(model.slug, content.observations, 'observation', 'observations');
  });

  // Author-declared box → page links (`concept_diagram.links`), e.g. the
  // Stream / river flow box → the per-metric streamflow response pages.
  (config.links ?? []).forEach(link => {
    link.process_ids.forEach(id => {
      (pages[id] ??= []).push({
        href: link.href,
        title: link.title || link.href,
        type: link.type || 'page',
      });
    });
  });

  return {
    svgMarkup,
    heading: config.heading,
    pages,
    considerations: config.considerations ?? [],
  };
}
