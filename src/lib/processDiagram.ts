import { readCsvRows } from './csv';
import { readDiagramSvg } from './diagramSvg';
import { ESM_MODEL_CSV } from './esm';
import { getAllModelContent } from './models';
import {
  ContentMetadata,
  ProcessDiagramConfig,
  ProcessDiagramData,
  ProcessDiagramModel,
  ProcessInfo,
  ProcessPageLink,
} from '@/types';

/**
 * Loads everything a model overview's process diagram needs: the SVG markup
 * (boxes tagged with `data-process-id(s)`), per-model coverage from the
 * coverage CSV (`process_id` × `model_id`, model ids joined against
 * `esms/esm_model.csv` for display names), and the model's own notes that
 * claim each process via `process_ids` frontmatter (what makes a box link to
 * a page). Returns null if the SVG is missing, so the page falls back to plain
 * markdown the same way a mismatched heading does.
 */
export function readProcessDiagram(config: ProcessDiagramConfig, modelSlug: string): ProcessDiagramData | null {
  const svgMarkup = readDiagramSvg(config.svg);
  if (!svgMarkup) return null;

  const registry = new Map(readCsvRows(ESM_MODEL_CSV).map(r => [r.model_id, r]));

  const processes: Record<string, ProcessInfo> = {};
  const modelIds: string[] = [];
  readCsvRows(config.coverage).forEach(row => {
    // Version-specific rows (non-blank `version_id`) will override the
    // model-level default once the picker goes down to versions; for now the
    // diagram is model-level only.
    if (row.version_id) return;

    if (!modelIds.includes(row.model_id)) modelIds.push(row.model_id);
    const info = (processes[row.process_id] ??= {
      process: row.process,
      category: row.category,
      byModel: {},
    });
    info.byModel[row.model_id] = {
      coverage: row.coverage,
      note: row.mechanism_note,
      citation: row.citation,
    };
  });

  const models: ProcessDiagramModel[] = modelIds.map(modelId => {
    const displayName = registry.get(modelId)?.display_name || modelId;
    return { modelId, displayName, shortName: displayName.replace(/\s*\(.*$/, '') };
  });

  const pages: Record<string, ProcessPageLink[]> = {};
  const content = getAllModelContent(modelSlug);
  const addPages = (items: ContentMetadata[], type: ProcessPageLink['type'], dir: string) => {
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
  addPages(content.fluxes, 'flux', 'fluxes');
  addPages(content.parameters, 'parameter', 'parameters');
  addPages(content.observations, 'observation', 'observations');

  // Cross-model links declared on the index (`process_diagram.links`), e.g. the
  // water diagram's Growth box → the vegetation-som overview.
  (config.links ?? []).forEach(link => {
    link.process_ids.forEach(id => {
      (pages[id] ??= []).push({ href: link.href, title: link.title || link.href, type: 'model' });
    });
  });

  return { svgMarkup, heading: config.heading, models, processes, pages };
}
