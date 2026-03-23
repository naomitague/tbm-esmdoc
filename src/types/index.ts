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

export interface OverviewMetadata {
  slug: string;
  title: string;
  tags: string[];
  description: string;
  relatedFluxes?: string[];
  relatedParameters?: string[];
  connections: ModelConnection[];
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
