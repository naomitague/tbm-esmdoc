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
  /** `process_coverage.csv` process_ids this note documents — makes those boxes in the model's process diagram link here. */
  processIds?: string[];
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
  datasetTable?: DatasetTableConfig;
  estimateChart?: EstimateChartConfig;
  conceptDiagram?: ConceptDiagramConfig;
  pageLinks?: PageLinksConfig;
  connections: ModelConnection[];
}

export interface ParameterMetadata {
  slug: string;
  parameterName: string;
  model?: string;
  aliases?: string[];
  tags: string[];
  topic?: string[];
  processIds?: string[];
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
  conceptDiagram?: ConceptDiagramConfig;
  pageLinks?: PageLinksConfig;
  connections: ModelConnection[];
}

export interface ObservationMetadata {
  slug: string;
  title: string;
  model?: string;
  aliases?: string[];
  tags: string[];
  topic?: string[];
  processIds?: string[];
  description: string;
  variables?: string[];
  methods?: string[];
  references?: string[];
  esmTable?: EsmTableConfig;
  datasetTable?: DatasetTableConfig;
  estimateChart?: EstimateChartConfig;
  conceptDiagram?: ConceptDiagramConfig;
  pageLinks?: PageLinksConfig;
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

/** One displayed column of a `dataset_table`. */
export interface DatasetTableColumn {
  key: string;
  label: string;
  /** `link` renders the cell value as an external link (use `link_label` for the visible text). */
  type?: 'text' | 'link';
  link_label?: string;
  /** Allow the cell to wrap instead of staying on one line — for long free-text columns. */
  wrap?: boolean;
}

/**
 * Declared in a note's frontmatter (`dataset_table:`) to splice a browsable
 * table of a plain CSV in after one heading — the whole table by default,
 * narrowed with a one-column dropdown filter (`filter_column`, e.g. product
 * category) plus a free-text search over `search_columns`. Unlike `esm_table`
 * this joins against nothing: the CSV is shown as-is, so it suits reference
 * tables like the global precipitation-products list. See CsvDatasetTable.
 */
export interface DatasetTableConfig {
  csv: string;
  heading: string;
  title?: string;
  columns: DatasetTableColumn[];
  filter_column?: string;
  filter_label?: string;
  search_columns?: string[];
  search_placeholder?: string;
  /** Noun used in the row count, e.g. "dataset" → "12 datasets". */
  row_noun?: string;
  /**
   * Column whose value becomes each row's DOM id (`#estimate-<value>`), so
   * another component on the page can link straight to a row — see
   * `estimate_chart.row_id_column`, which must name the same column.
   */
  row_id_column?: string;
}

/**
 * Declared in a note's frontmatter (`estimate_chart:`) to splice a compact
 * one-axis dot strip in after a heading — one dot per CSV row, at that row's
 * numeric value, with an optional min–max whisker. Meant for a handful of
 * published estimates of the same quantity (e.g. the share of an observed ET
 * trend attributed to greening), where the point of the figure is the spread
 * rather than any relationship between two variables.
 *
 * A row whose `value_column` is blank or non-numeric is simply not plotted —
 * that's how a qualitatively different result in the same table (a bare
 * correlation, say) stays in the table without being forced onto an axis it
 * doesn't belong on. See CsvEstimateStrip.
 */
export interface EstimateChartConfig {
  csv: string;
  heading: string;
  title?: string;
  /** Column holding the plotted number. Rows where it doesn't parse are skipped. */
  value_column: string;
  /** Optional range around the point value, drawn as a whisker. */
  min_column?: string;
  max_column?: string;
  /** Tooltip heading and sub-heading for a dot. */
  label_column: string;
  sublabel_column?: string;
  /** Further columns listed in the tooltip, in order. */
  tooltip_columns?: string[];
  axis_label?: string;
  /** Axis bounds; when omitted the axis is fitted to the data with niceTicks. */
  axis_min?: number;
  axis_max?: number;
  /** Suffix on the value labels and tooltip, e.g. "%". */
  unit?: string;
  /** Column whose value identifies the matching `dataset_table` row to jump to on click. */
  row_id_column?: string;
  /** Caption under the figure — typically why some rows aren't plotted. */
  note?: string;
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
  /** Exact heading text to splice this picker in after; omit and it leads the page, ahead of the markdown (for a note whose first content IS the picker). */
  heading?: string;
  /** Card title shown above the picker, e.g. "Studies by response metric". Defaults to that if omitted. */
  title?: string;
  metric_column: string;
  /** Metrics to show (with a count, even 0) regardless of whether any rows have them yet. Any row whose value isn't listed here (and isn't excluded) is folded into an automatic "Other" bucket rather than getting its own bar. */
  known_metrics?: MetricOptionConfig[];
  /** Metric *value* the picker opens on (e.g. `ET`), so the section leads with a plot rather than an empty picker. */
  default_metric?: string;
  /** Muted line under the plot — what a reader who only sees the opening plot would otherwise miss further down the page. */
  note?: string;
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
  datasetTable?: DatasetTableConfig;
  estimateChart?: EstimateChartConfig;
  metricResponseData?: MetricResponseDataConfig;
  conceptDiagram?: ConceptDiagramConfig;
  pageLinks?: PageLinksConfig;
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
  processDiagram?: ProcessDiagramConfig;
  /** `relationship_topics:` — relationship pages tagged with any of these topics also appear in this model's Relationships-of-interest panel, whatever their own `model`. */
  relationshipTopics?: string[];
}

/**
 * Declared in a model's `index.md` frontmatter (`process_diagram:`) to splice
 * a clickable process diagram in after `heading` — or, with `heading` omitted,
 * at the top of the overview, ahead of the markdown. `svg` boxes carry
 * `data-process-id` / `data-process-ids` attributes whose ids key into the
 * `coverage` CSV (one row per process_id × model_id), which drives the
 * per-ESM greying — see ProcessDiagram.
 */
export interface ProcessDiagramConfig {
  svg: string;
  coverage: string;
  /** Exact heading text to splice the diagram in after; omit to render it above the markdown. */
  heading?: string;
  /** Extra box → URL links beyond the model's own notes, e.g. boxes belonging to another model's diagram linking to that model's overview. */
  links?: ProcessDiagramLinkConfig[];
}

export interface ProcessDiagramLinkConfig {
  process_ids: string[];
  href: string;
  title?: string;
}

export interface ProcessCoverageEntry {
  /** yes | partial | no | needs_verification */
  coverage: string;
  note: string;
  citation: string;
}

export interface ProcessInfo {
  process: string;
  category: string;
  byModel: Record<string, ProcessCoverageEntry>;
}

export interface ProcessDiagramModel {
  modelId: string;
  displayName: string;
  shortName: string;
}

export interface ProcessPageLink {
  href: string;
  title: string;
  /** `page` is a plain author-declared destination (a pattern/relationship page, say); the rest say what kind of note was resolved. */
  type: 'flux' | 'parameter' | 'observation' | 'model' | 'page';
}

export interface ProcessDiagramData {
  svgMarkup: string;
  heading?: string;
  models: ProcessDiagramModel[];
  processes: Record<string, ProcessInfo>;
  /** Pages whose `process_ids` frontmatter names each process. */
  pages: Record<string, ProcessPageLink[]>;
}

/** One button in a `page_links` row. */
export interface PageLinkItem {
  label: string;
  href: string;
  /** Optional one-line subtitle under the label. */
  description?: string;
}

/**
 * Declared in a note's frontmatter (`page_links:`) to splice a row of
 * button-sized links to other notes in after one heading — how a hub page
 * hands off to the worked examples that live on their own pages. See
 * PageLinks.
 */
export interface PageLinksConfig {
  /**
   * Heading to splice the in-body row of buttons after. Optional: omit it
   * (with `sidebar: true`) for links that live only in the left sidebar, so
   * the frontmatter isn't pointing at a heading the body doesn't have.
   */
  heading?: string;
  items: PageLinkItem[];
  /**
   * Also repeat the links as a compact card in the left outline sidebar on
   * `/wiki/[slug]` pattern pages, so a hub page's worked examples are
   * reachable without scrolling to their heading. Only worth setting when
   * the page's "On this page" outline is short enough to leave room.
   */
  sidebar?: boolean;
  /** Heading for that sidebar card; defaults to `heading` with its `#`s stripped. */
  sidebar_title?: string;
}

/** One author-declared box → page link in a `concept_diagram` (`links:`). */
export interface ConceptDiagramLinkConfig {
  process_ids: string[];
  href: string;
  title?: string;
  type?: ProcessPageLink['type'];
}

/** One bullet in a `concept_diagram` considerations card. */
export interface ConceptConsiderationItem {
  label: string;
  /** Short explanation shown under the label. */
  note?: string;
  href?: string;
}

/** One card in the considerations column beside a `concept_diagram` (e.g. Time, Space, Analysis method). */
export interface ConceptConsideration {
  title: string;
  /** Muted qualifier after the title, e.g. "when, and over what interval". */
  subtitle?: string;
  items: ConceptConsiderationItem[];
}

/**
 * Declared in a pattern/relationship note's frontmatter (`concept_diagram:`)
 * to splice a clickable concept figure — plus an optional column of key
 * considerations beside it — in after `heading` (omit `heading` and it leads
 * the page). Same `data-process-id(s)` contract as `process_diagram`, but
 * with no ESM picker or coverage CSV: boxes link to whichever notes claim
 * their processes (resolved across every model), plus anything named in
 * `links`. See readConceptDiagram / ConceptDiagram.
 */
export interface ConceptDiagramConfig {
  svg: string;
  /** Label-size multiplier for this figure, overriding `TEXT_SCALE` — raise it only as far as the figure's tightest box allows. */
  text_scale?: number;
  /** Exact heading text to splice the figure in after; omit to render it above the markdown. */
  heading?: string;
  links?: ConceptDiagramLinkConfig[];
  considerations?: ConceptConsideration[];
}

export interface ConceptDiagramData {
  svgMarkup: string;
  heading?: string;
  /** Pages for each process id — from `process_ids` frontmatter anywhere in the vault, plus `links`. */
  pages: Record<string, ProcessPageLink[]>;
  considerations: ConceptConsideration[];
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
