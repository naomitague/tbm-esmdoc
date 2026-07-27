import { readCsvRows, CsvRow } from './csv';

/**
 * Shared ESM registries. A per-flux method table (e.g.
 * `models/water/fluxes/tabledata/et_method_reference.csv`) carries only a
 * `version_id` plus flux-specific descriptive columns; the human-readable model
 * name, model type, versions, and code/website links all live here and are
 * joined in at render time so every process page tells the same story about a
 * given model without re-stating it.
 */
export const ESM_MODEL_CSV = 'esms/esm_model.csv';
export const ESM_VERSION_CSV = 'esms/esm_model_versions.csv';

/**
 * Columns that describe provenance/identity rather than the model's actual
 * representation of the flux — surfaced separately (as a source cell + a
 * confidence badge) instead of as comparison columns.
 */
const PROVENANCE_COLUMNS = new Set([
  'version_id',
  'documentation_url',
  'extraction_source',
  'confidence',
]);

export interface EsmAttributeColumn {
  key: string;
  label: string;
}

export interface EsmTableRow {
  versionId: string;
  modelId: string;
  modelName: string;
  modelType: string;
  versionLabel: string;
  releaseYear: string;
  websiteUrl: string;
  codeRepoUrl: string;
  documentationUrl: string;
  extractionSource: string;
  confidence: string;
  /** Flux-specific descriptive columns, keyed by column name. */
  attributes: Record<string, string>;
}

export interface EsmModelOption {
  modelId: string;
  modelName: string;
  modelType: string;
}

export interface EsmTableData {
  rows: EsmTableRow[];
  models: EsmModelOption[];
  columns: EsmAttributeColumn[];
}

/** `et_estimation_approach` -> `ET estimation approach` (keeps common acronyms upper-case). */
function humanizeColumnKey(key: string): string {
  const acronyms = new Set(['et', 'esm', 'lai', 'co2', 'vpd']);
  return key
    .split('_')
    .map((word, i) => {
      if (acronyms.has(word)) return word.toUpperCase();
      if (i === 0) return word.charAt(0).toUpperCase() + word.slice(1);
      return word;
    })
    .join(' ');
}

/**
 * Read a per-version method CSV and join it against the ESM model/version
 * registries. Returns the joined rows (one per method-table row), the set of
 * distinct models present (for the filter control), and the attribute columns
 * to compare — either the caller's explicit override or every non-provenance
 * column in the CSV, humanized.
 */
export function readEsmTable(
  methodCsvPath: string,
  columnOverride?: EsmAttributeColumn[]
): EsmTableData {
  const methodRows = readCsvRows(methodCsvPath);
  const modelRows = readCsvRows(ESM_MODEL_CSV);
  const versionRows = readCsvRows(ESM_VERSION_CSV);

  const modelById = new Map(modelRows.map(r => [r.model_id, r]));
  const versionById = new Map(versionRows.map(r => [r.version_id, r]));

  const header = methodRows.length > 0 ? Object.keys(methodRows[0]) : [];
  const columns: EsmAttributeColumn[] =
    columnOverride && columnOverride.length > 0
      ? columnOverride
      : header
          .filter(key => !PROVENANCE_COLUMNS.has(key))
          .map(key => ({ key, label: humanizeColumnKey(key) }));

  const rows: EsmTableRow[] = methodRows.map((m: CsvRow) => {
    const version = versionById.get(m.version_id);
    const modelId = version?.model_id ?? '';
    const model = modelId ? modelById.get(modelId) : undefined;

    const attributes: Record<string, string> = {};
    columns.forEach(col => {
      attributes[col.key] = m[col.key] ?? '';
    });

    return {
      versionId: m.version_id,
      modelId,
      modelName: model?.display_name || modelId || m.version_id,
      modelType: model?.model_type ?? '',
      versionLabel: version?.version_label ?? '',
      releaseYear: version?.release_year ?? '',
      websiteUrl: model?.website_url ?? '',
      codeRepoUrl: version?.code_repository_url ?? '',
      documentationUrl: m.documentation_url ?? '',
      extractionSource: m.extraction_source ?? '',
      confidence: m.confidence ?? '',
      attributes,
    };
  });

  // Distinct models, ordered by first appearance in the method table.
  const seen = new Set<string>();
  const models: EsmModelOption[] = [];
  rows.forEach(r => {
    if (r.modelId && !seen.has(r.modelId)) {
      seen.add(r.modelId);
      models.push({ modelId: r.modelId, modelName: r.modelName, modelType: r.modelType });
    }
  });

  return { rows, models, columns };
}

/**
 * Read the full ESM registry (every model with its versions), independent of
 * any one flux's method table — powers the standalone `/esms` list page.
 */
export interface EsmVersionInfo {
  versionId: string;
  versionLabel: string;
  releaseYear: string;
  codeRepoUrl: string;
  notes: string;
}

export interface EsmModelInfo {
  modelId: string;
  displayName: string;
  modelType: string;
  websiteUrl: string;
  notes: string;
  versions: EsmVersionInfo[];
}

export function readEsmRegistry(): EsmModelInfo[] {
  const modelRows = readCsvRows(ESM_MODEL_CSV);
  const versionRows = readCsvRows(ESM_VERSION_CSV);

  return modelRows.map(m => ({
    modelId: m.model_id,
    displayName: m.display_name,
    modelType: m.model_type,
    websiteUrl: m.website_url,
    notes: m.notes,
    versions: versionRows
      .filter(v => v.model_id === m.model_id)
      .map(v => ({
        versionId: v.version_id,
        versionLabel: v.version_label,
        releaseYear: v.release_year,
        codeRepoUrl: v.code_repository_url,
        notes: v.notes,
      })),
  }));
}
