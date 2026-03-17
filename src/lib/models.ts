import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import {
  ContentMetadata,
  ModelMetadata,
  ProcessMetadata,
  ParameterMetadata,
  ObservationMetadata,
  ModelConnection,
  ContentType,
  ModelCard
} from '@/types';

const modelsDirectory = path.join(process.cwd(), 'models');

/**
 * Extract wiki-style links like [[process_stomatal_conductance]] from markdown
 */
export function extractWikiLinks(content: string): string[] {
  const linkRegex = /\[\[([^\]]+)\]\]/g;
  const links: string[] = [];
  let match;

  while ((match = linkRegex.exec(content)) !== null) {
    links.push(match[1]);
  }

  return links;
}

/**
 * Convert wiki-style links to Next.js links with model context
 */
export function convertWikiLinksToNextLinks(content: string, modelSlug: string): string {
  return content.replace(/\[\[([^\]]+)\]\]/g, (match, link) => {
    const slug = link.toLowerCase().replace(/\s+/g, '_');
    // Try to determine if it's a process, parameter, or observation
    if (link.toLowerCase().startsWith('process_')) {
      return `[${link}](/models/${modelSlug}/processes/${slug.replace('process_', '')})`;
    } else if (link.toLowerCase().startsWith('output_')) {
      return `[${link}](/models/${modelSlug}/observations/${slug.replace('output_', '')})`;
    } else if (link.toLowerCase().startsWith('parameter_')) {
      return `[${link}](/models/${modelSlug}/parameters/${slug.replace('parameter_', '')})`;
    }
    // Default: link within same model context
    return `[${link}](/models/${modelSlug}/${slug})`;
  });
}

/**
 * Get all models
 */
export function getAllModels(): ModelCard[] {
  if (!fs.existsSync(modelsDirectory)) {
    return [];
  }

  const modelDirs = fs.readdirSync(modelsDirectory)
    .filter(name => {
      const fullPath = path.join(modelsDirectory, name);
      return fs.statSync(fullPath).isDirectory();
    });

  const modelIcons: Record<string, string> = {
    water: 'droplets',
    carbon: 'sprout',
    nitrogen: 'flask-conical',
    energy: 'sun'
  };

  const modelColors: Record<string, string> = {
    water: 'blue',
    carbon: 'green',
    nitrogen: 'purple',
    energy: 'orange'
  };

  return modelDirs.map(modelDir => {
    const indexPath = path.join(modelsDirectory, modelDir, 'index.md');
    let title = modelDir.charAt(0).toUpperCase() + modelDir.slice(1);
    let description = `${title} model documentation`;

    if (fs.existsSync(indexPath)) {
      const fileContent = fs.readFileSync(indexPath, 'utf8');
      const { data, content } = matter(fileContent);
      title = data.title || title;
      description = data.description || description;
    }

    // Count processes, parameters, observations
    const processCount = countFiles(path.join(modelsDirectory, modelDir, 'processes'));
    const parameterCount = countFiles(path.join(modelsDirectory, modelDir, 'parameters'));
    const observationCount = countFiles(path.join(modelsDirectory, modelDir, 'observations'));

    return {
      slug: modelDir,
      title,
      description,
      icon: modelIcons[modelDir] || '📊',
      color: modelColors[modelDir] || 'gray',
      processCount,
      parameterCount,
      observationCount
    };
  });
}

function countFiles(dir: string): number {
  if (!fs.existsSync(dir)) return 0;
  return fs.readdirSync(dir).filter(f => f.endsWith('.md')).length;
}

/**
 * Get model by slug
 */
export function getModelBySlug(slug: string): ContentMetadata | null {
  const modelPath = path.join(modelsDirectory, slug, 'index.md');

  if (!fs.existsSync(modelPath)) {
    return null;
  }

  const fileContent = fs.readFileSync(modelPath, 'utf8');
  const { data, content } = matter(fileContent);

  const metadata: ModelMetadata = {
    slug,
    title: data.title || slug,
    model: data.model || slug,
    description: data.description || '',
    aliases: data.aliases || [],
    scale: data.scale || [],
    processCount: countFiles(path.join(modelsDirectory, slug, 'processes')),
    parameterCount: countFiles(path.join(modelsDirectory, slug, 'parameters')),
    observationCount: countFiles(path.join(modelsDirectory, slug, 'observations'))
  };

  return {
    type: 'model',
    metadata,
    content: convertWikiLinksToNextLinks(content, slug),
    model: slug
  };
}

/**
 * Parse process markdown file
 */
function parseProcess(fileContent: string, slug: string, modelSlug: string, frontMatter: any): ProcessMetadata {
  const links = extractWikiLinks(fileContent);
  const connections: ModelConnection[] = links.map(link => ({
    source: slug,
    target: link.toLowerCase().replace(/\s+/g, '_'),
    type: 'uses' as const
  }));

  const fluxVarMatch = fileContent.match(/### flux variable names\s*([\s\S]*?)(?=###|##|$)/);
  const stateVarMatch = fileContent.match(/### stores\/state variable names\s*([\s\S]*?)(?=###|##|$)/);
  const paramMatch = fileContent.match(/### parameter(?:s)? names?\s*([\s\S]*?)(?=###|##|$)/);
  const inputMatch = fileContent.match(/###?\s*input(?:s)? names?\s*([\s\S]*?)(?=###|##|$)/);

  const extractListItems = (text: string | undefined): string[] => {
    if (!text) return [];
    return text
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.startsWith('-'))
      .map(line => line.replace(/^-\s*/, '').trim())
      .filter(Boolean);
  };

  // Accept either "# Description/Conceptual model" or "## Description/Conceptual model" headings
  const descMatch = fileContent.match(/^(?:#|##)\s*Description\/Conceptual model\s*([\s\S]*?)(?=\n#|$)/m);
  const description = descMatch ? descMatch[1].trim() : frontMatter.description || '';

  const modelMatch = fileContent.match(/# Model Name[^\n]*\s*([^\n]+)/);
  const modelName = modelMatch ? modelMatch[1].trim() : undefined;

  const aliasMatch = fileContent.match(/alias::\s*\[([^\]]+)\]/);
  const title = frontMatter.title || (aliasMatch ? aliasMatch[1].split(',')[0].trim() : slug.replace(/_/g, ' '));

  return {
    slug,
    title,
    model: modelSlug,
    aliases: frontMatter.aliases || (aliasMatch ? aliasMatch[1].split(',').map((a: string) => a.trim()) : []),
    tags: frontMatter.tags || ['process'],
    description,
    modelName,
    variables: {
      flux: extractListItems(fluxVarMatch?.[1]),
      state: extractListItems(stateVarMatch?.[1]),
      parameters: extractListItems(paramMatch?.[1]),
      inputs: extractListItems(inputMatch?.[1])
    },
    connections
  };
}

/**
 * Parse parameter markdown file
 */
function parseParameter(fileContent: string, slug: string, modelSlug: string, frontMatter: any): ParameterMetadata {
  const links = extractWikiLinks(fileContent);
  const connections: ModelConnection[] = links.map(link => ({
    source: slug,
    target: link.toLowerCase().replace(/\s+/g, '_'),
    type: 'uses' as const
  }));

  const paramNameMatch = fileContent.match(/parameter_name:\s*([^\n]+)/);
  const dynamicMatch = fileContent.match(/# Dynamically computed:\s*\n(Yes|No)/i);
  const classMatch = fileContent.match(/parameter_classification\s*\[([^\]]*)\]/);
  const timeScaleMatch = fileContent.match(/parameter_time_scale:\s*([^\n]+)/);
  const spaceScaleMatch = fileContent.match(/parameter_space_scale:\s*([^\n]+)/);
  const realismMatch = fileContent.match(/parameter_realism:\s*([^\n]+)/);
  const unitsMatch = fileContent.match(/parameter_units:\s*([^\n]+)/);
  const functionMatch = fileContent.match(/parameter_function:\s*([^\n]+)/);

  const descMatch = fileContent.match(/# Description\s*([\s\S]*?)(?=\n#|$)/);
  const description = descMatch ? descMatch[1].trim() : frontMatter.description || '';

  const usedToCreateMatch = fileContent.match(/# If used to create other parameters, list here\s*([\s\S]*?)(?=\n#|$)/);
  const usedToCreate = usedToCreateMatch ? extractWikiLinks(usedToCreateMatch[1]) : [];

  return {
    slug,
    parameterName: frontMatter.title || (paramNameMatch ? paramNameMatch[1].trim() : slug),
    model: modelSlug,
    aliases: frontMatter.aliases || [],
    tags: frontMatter.tags || ['parameter'],
    status: frontMatter.status,
    dynamicallyComputed: dynamicMatch ? dynamicMatch[1].toLowerCase() === 'yes' : false,
    classification: classMatch ? classMatch[1].split(',').map(c => c.trim()).filter(Boolean) : [],
    timeScale: timeScaleMatch ? timeScaleMatch[1].trim() : undefined,
    spaceScale: spaceScaleMatch ? spaceScaleMatch[1].trim() : undefined,
    realism: realismMatch ? realismMatch[1].trim() : undefined,
    units: unitsMatch ? unitsMatch[1].trim() : undefined,
    function: functionMatch ? functionMatch[1].trim() : undefined,
    description,
    usedToCreate,
    connections
  };
}

/**
 * Parse observation markdown file
 */
function parseObservation(fileContent: string, slug: string, modelSlug: string, frontMatter: any): ObservationMetadata {
  const links = extractWikiLinks(fileContent);
  const connections: ModelConnection[] = links.map(link => ({
    source: slug,
    target: link.toLowerCase().replace(/\s+/g, '_'),
    type: 'uses' as const
  }));

  const descMatch = fileContent.match(/# Description\s*([\s\S]*?)(?=\n#|$)/);
  const description = descMatch ? descMatch[1].trim() : frontMatter.description || '';

  const title = frontMatter.title || slug.replace(/^output_/, '').replace(/_/g, ' ');

  return {
    slug,
    title,
    model: modelSlug,
    aliases: frontMatter.aliases || [],
    tags: frontMatter.tags || ['observation'],
    description,
    connections
  };
}

/**
 * Get content from model subdirectory (processes, parameters, observations)
 */
export function getModelContent(
  modelSlug: string,
  contentType: 'processes' | 'parameters' | 'observations',
  slug: string
): ContentMetadata | null {
  const filePath = path.join(modelsDirectory, modelSlug, contentType, `${slug}.md`);

  if (!fs.existsSync(filePath)) {
    return null;
  }

  const fileContent = fs.readFileSync(filePath, 'utf8');
  const { data: frontMatter, content } = matter(fileContent);

  let metadata;
  let type: ContentType;

  if (contentType === 'processes') {
    metadata = parseProcess(fileContent, slug, modelSlug, frontMatter);
    type = 'process';
  } else if (contentType === 'parameters') {
    metadata = parseParameter(fileContent, slug, modelSlug, frontMatter);
    type = 'parameter';
  } else {
    metadata = parseObservation(fileContent, slug, modelSlug, frontMatter);
    type = 'observation';
  }

  return {
    type,
    metadata,
    content: convertWikiLinksToNextLinks(content, modelSlug),
    model: modelSlug
  };
}

/**
 * Get all content for a specific model
 */
export function getAllModelContent(modelSlug: string): {
  processes: ContentMetadata[];
  parameters: ContentMetadata[];
  observations: ContentMetadata[];
} {
  const result = {
    processes: [] as ContentMetadata[],
    parameters: [] as ContentMetadata[],
    observations: [] as ContentMetadata[]
  };

  const processesDir = path.join(modelsDirectory, modelSlug, 'processes');
  const parametersDir = path.join(modelsDirectory, modelSlug, 'parameters');
  const observationsDir = path.join(modelsDirectory, modelSlug, 'observations');

  if (fs.existsSync(processesDir)) {
    const files = fs.readdirSync(processesDir).filter(f => f.endsWith('.md'));
    result.processes = files
      .map(f => getModelContent(modelSlug, 'processes', f.replace('.md', '')))
      .filter((c): c is ContentMetadata => c !== null);
  }

  if (fs.existsSync(parametersDir)) {
    const files = fs.readdirSync(parametersDir).filter(f => f.endsWith('.md'));
    result.parameters = files
      .map(f => getModelContent(modelSlug, 'parameters', f.replace('.md', '')))
      .filter((c): c is ContentMetadata => c !== null);
  }

  if (fs.existsSync(observationsDir)) {
    const files = fs.readdirSync(observationsDir).filter(f => f.endsWith('.md'));
    result.observations = files
      .map(f => getModelContent(modelSlug, 'observations', f.replace('.md', '')))
      .filter((c): c is ContentMetadata => c !== null);
  }

  return result;
}
