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

export interface MetricOptionConfig {
  value: string;
  label: string;
  /** If set, clicking this metric navigates here instead of drilling down in place — for a metric with its own dedicated page. */
  link?: string;
  /** If true, shown for context but not clickable (e.g. already detailed elsewhere on this same page). */
  inert?: boolean;
}

/** One metric-picker within a `metric_response_data` block — see MetricResponseDataConfig. */
export interface MetricResponseSection {
  heading: string;
  /** Card title shown above the picker, e.g. "Studies by response metric". Defaults to that if omitted. */
  title?: string;
  metric_column: string;
  /** Metrics to show (with a count, even 0) regardless of whether any rows have them yet. Any row whose value isn't listed here (and isn't excluded) is folded into an automatic "Other" bucket rather than getting its own bar. */
  known_metrics?: MetricOptionConfig[];
  /** Metric values to drop from the picker entirely (e.g. already covered by a different section/page and would just be noise here). */
  exclude_metrics?: string[];
  x_column: string;
  x_label: string;
  y_column: string;
  y_label: string;
  table_columns?: HistogramTableColumn[];
}

/**
 * Declared in a note's frontmatter (`metric_response_data:`) to splice one or
 * more metric-pickers (bar counts, including known metrics with zero rows so
 * far, plus an automatic "Other" bucket for anything unrecognized) + scatter
 * plot + drill-down table in after their headings. Built for CSVs shaped like
 * `veg_hydro_response_obs.csv`, where some column holds a free-text metric
 * label per row (e.g. `hydro_response_metric`, `forest_change_metric`) — see
 * MetricResponseExplorer. Mirrors `histogram_data`'s `sections` shape: one
 * CSV, several independently-configured pickers spliced at different headings.
 */
export interface MetricResponseDataConfig {
  csv: string;
  sections: MetricResponseSection[];
}

/**
 * One manually-curated "see also" entry in a note's `related_content:`
 * frontmatter — the author names the process/observation/etc. that's
 * conceptually relevant, since that can't be inferred automatically the way
 * a `[[wikilink]]` connection can. Omitting `href` marks it as a page that
 * doesn't exist yet: shown as a muted placeholder rather than a dead link.
 */
export interface RelatedContentItem {
  label: string;
  type: 'flux' | 'parameter' | 'observation' | 'pattern' | 'relationship';
  href?: string;
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
  metricResponseData?: MetricResponseDataConfig;
  /** Author-curated "see also" list — replaces the old auto-derived Connections panel, which just showed whatever notes happened to be [[wikilinked]] and wasn't reliably meaningful. */
  relatedContent?: RelatedContentItem[];
  topic?: string[];
  kind?: 'pattern' | 'relationship';
  /** Biophysical model this pattern/relationship belongs under (e.g. "water"); drives the "back to model" link on pattern pages. */
  model?: string;
  /** Slug of a broader relationship page this one is a sub-topic of (e.g. a per-metric page under a hub page) — nests it under that parent in the topic panel's Relationships list instead of listing it as a sibling. */
  parent?: string;
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
