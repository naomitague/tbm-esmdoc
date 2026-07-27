export interface ModelConnection {
  source: string;
  target: string;
  type: 'uses' | 'produces' | 'affects' | 'contains';
}

export interface FluxMetadata {
  slug: string;
  title: string;
  model?: string;
  aliases?: string[];
  tags: string[];
  topic?: string[];
  description: string;
  modelName?: string;
  equation?: string;
  references?: string[];
  fluxType?: string;
  cycle?: string;
  symbol?: string;
  units?: string;
  typicalRange?: string;
  targetESM?: string;
  dependsOn?: string[];
  variables: {
    flux: string[];
    state: string[];
    parameters: string[];
    inputs: string[];
  };
  codeFiles?: string[];
  observations?: string[];
  esmTable?: EsmTableConfig;
  connections: ModelConnection[];
}

export interface ParameterMetadata {
  slug: string;
  parameterName: string;
  model?: string;
  aliases?: string[];
  tags: string[];
  topic?: string[];
  status?: string;
  dynamicallyComputed: boolean;
  classification: string[];
  timeScale?: string;
  spaceScale?: string;
  realism?: string;
  units?: string;
  function?: string;
  description: string;
  range?: string;
  sources?: string[];
  usedToCreate?: string[];
  connections: ModelConnection[];
}

export interface ObservationMetadata {
  slug: string;
  title: string;
  model?: string;
  aliases?: string[];
  tags: string[];
  topic?: string[];
  description: string;
  variables?: string[];
  methods?: string[];
  references?: string[];
  connections: ModelConnection[];
}

export interface HistogramTableColumn {
  key: string;
  label: string;
  fallback_key?: string;
  unit_key?: string;
  min_key?: string;
  max_key?: string;
  caption_key?: string;
  subtitle_key?: string;
  numeric?: boolean;
  wrap?: boolean;
  muted?: boolean;
}

export interface HistogramSectionConfig {
  type?: 'histogram';
  heading: string;
  column: string;
  title: string;
}

/** A `histogram_data` section rendered as an x/y scatter instead of a bar histogram — same CSV, plotted rather than counted. */
export interface ScatterSectionConfig {
  type: 'scatter';
  heading: string;
  x_column: string;
  y_column: string;
  x_label: string;
  y_label: string;
  filter_column?: string;
  filter_value?: string;
  title: string;
}

export type HistogramDataSection = HistogramSectionConfig | ScatterSectionConfig;

/** Declared in a note's frontmatter (`histogram_data:`) to wire a CSV into that note's headings — see WikiPage. */
export interface HistogramDataConfig {
  csv: string;
  sections: HistogramDataSection[];
  table_columns?: HistogramTableColumn[];
}

/** Declared in a note's frontmatter (`trend_data:`) to wire a numeric-trend CSV in after one heading — see WikiPage. */
export interface TrendDataConfig {
  csv: string;
  heading: string;
}

/**
 * Declared in a note's frontmatter (`esm_table:`) to splice an interactive
 * ESM method-comparison table in after one heading (e.g. `## Physically-based`
 * in a flux/process note). `csv` points at a per-version method table under
 * `models/.../tabledata/` keyed by `version_id`; that table is joined against
 * the shared ESM registries (`esms/esm_model.csv`, `esms/esm_model_versions.csv`)
 * at render time — see readEsmTable and WikiPage.
 */
export interface EsmTableConfig {
  csv: string;
  heading: string;
  /** Optional column override: which method columns to show, in order, with labels. Defaults to every non-provenance column, humanized. */
  columns?: { key: string; label: string }[];
}

export interface OverviewMetadata {
  slug: string;
  title: string;
  tags: string[];
  description: string;
  relatedFluxes?: string[];
  relatedParameters?: string[];
  connections: ModelConnection[];
  histogramData?: HistogramDataConfig;
  trendData?: TrendDataConfig;
  esmTable?: EsmTableConfig;
  topic?: string[];
  kind?: 'pattern' | 'relationship';
}

export interface ModelMetadata {
  slug: string;
  title: string;
  model: string; // water, carbon, nitrogen, energy
  description: string;
  aliases?: string[];
  scale?: string[];
  icon?: string;
  color?: string;
  fluxCount?: number;
  parameterCount?: number;
  observationCount?: number;
}

export type ContentType = 'model' | 'flux' | 'parameter' | 'observation' | 'overview';

export interface ContentMetadata {
  type: ContentType;
  metadata: ModelMetadata | FluxMetadata | ParameterMetadata | ObservationMetadata | OverviewMetadata;
  content: string;
  model?: string; // Parent model for nested content
}

export interface NavigationItem {
  title: string;
  slug: string;
  type: ContentType;
  model?: string;
}

export interface TableOfContents {
  id: string;
  text: string;
  level: number;
}

export interface ModelCard {
  slug: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  fluxCount: number;
  parameterCount: number;
  observationCount: number;
}
