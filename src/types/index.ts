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
  connections: ModelConnection[];
}

export interface ParameterMetadata {
  slug: string;
  parameterName: string;
  model?: string;
  aliases?: string[];
  tags: string[];
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
  heading: string;
  column: string;
  title: string;
}

/** Declared in a note's frontmatter (`histogram_data:`) to wire a CSV into that note's headings — see WikiPage. */
export interface HistogramDataConfig {
  csv: string;
  sections: HistogramSectionConfig[];
  table_columns?: HistogramTableColumn[];
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
