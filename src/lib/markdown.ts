import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import {
  ContentMetadata,
  FluxMetadata,
  ParameterMetadata,
  ObservationMetadata,
  OverviewMetadata,
  ModelConnection,
  ContentType
} from '@/types';

const contentDirectory = path.join(process.cwd());

/**
 * Extract wiki-style links like [[flux_stomatal_conductance]] from markdown
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
 * Convert wiki-style links to Next.js links
 */
export function convertWikiLinksToNextLinks(content: string): string {
  return content.replace(/\[\[([^\]]+)\]\]/g, (match, link) => {
    const slug = link.toLowerCase().replace(/\s+/g, '_');
    return `[${link}](/wiki/${slug})`;
  });
}

function getDisplayContentFromMarkdown(content: string): string {
  const headingMatch = content.match(/^\s*#+\s*#*\s*Description(?:\/Conceptual\s*model)?/im);
  if (!headingMatch) return content;
  const start = headingMatch.index ?? 0;
  return content.slice(start);
}

/**
 * Determine content type based on directory or tags
 */
function determineContentType(filePath: string, tags: string[]): ContentType {
  if (filePath.includes('/Fluxes/')) return 'flux';
  if (filePath.includes('/ParameterorState/')) return 'parameter';
  if (filePath.includes('/ObsOutput/')) return 'observation';
  if (filePath.includes('/Overviews/')) return 'overview';

  // Fallback to tags
  if (tags.includes('flux')) return 'flux';
  if (tags.includes('parameter')) return 'parameter';
  if (tags.includes('observation') || tags.includes('output')) return 'observation';
  if (tags.includes('overview')) return 'overview';

  return 'overview';
}

/**
 * Parse flux markdown file
 */
function parseFlux(fileContent: string, slug: string, frontMatter: any): FluxMetadata {
  const links = extractWikiLinks(fileContent);
  const connections: ModelConnection[] = links.map(link => ({
    source: slug,
    target: link.toLowerCase().replace(/\s+/g, '_'),
    type: 'uses' as const
  }));

  // Extract variables from the content
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

  // Extract description
  const descMatch = fileContent.match(/# Description\/Conceptual model\s*([\s\S]*?)(?=\n#|$)/);
  const description = descMatch ? descMatch[1].trim() : '';

  // Extract model name
  const modelMatch = fileContent.match(/# Model Name[^\n]*\s*([^\n]+)/);
  const modelName = modelMatch ? modelMatch[1].trim() : undefined;

  // Extract explicit name if present, then alias/title/slug fallback
  const nameMatch = fileContent.match(/^name:\s*(.+)$/im);
  const aliasMatch = fileContent.match(/alias::\s*\[([^\]]+)\]/);
  const title = frontMatter.name || (nameMatch ? nameMatch[1].trim() : undefined) || frontMatter.title || (aliasMatch ? aliasMatch[1].split(',')[0].trim() : slug.replace(/_/g, ' '));

  return {
    slug,
    title,
    aliases: frontMatter.aliases || (aliasMatch ? aliasMatch[1].split(',').map((a: string) => a.trim()) : []),
    tags: frontMatter.tags || ['flux'],
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
function parseParameter(fileContent: string, slug: string, frontMatter: any): ParameterMetadata {
  const links = extractWikiLinks(fileContent);
  const connections: ModelConnection[] = links.map(link => ({
    source: slug,
    target: link.toLowerCase().replace(/\s+/g, '_'),
    type: 'uses' as const
  }));

  // Extract metadata
  const paramNameMatch = fileContent.match(/parameter_name:\s*([^\n]+)/);
  const nameMatch = fileContent.match(/^name:\s*(.+)$/im);
  const dynamicMatch = fileContent.match(/# Dynamically computed:\s*\n(Yes|No)/i);
  const classMatch = fileContent.match(/parameter_classification\s*\[([^\]]*)\]/);
  const timeScaleMatch = fileContent.match(/parameter_time_scale:\s*([^\n]+)/);
  const spaceScaleMatch = fileContent.match(/parameter_space_scale:\s*([^\n]+)/);
  const realismMatch = fileContent.match(/parameter_realism:\s*([^\n]+)/);
  const unitsMatch = fileContent.match(/parameter_units:\s*([^\n]+)/);
  const functionMatch = fileContent.match(/parameter_function:\s*([^\n]+)/);

  // Extract description
  const descMatch = fileContent.match(/# Description\s*([\s\S]*?)(?=\n#|$)/);
  const description = descMatch ? descMatch[1].trim() : '';

  // Extract used to create
  const usedToCreateMatch = fileContent.match(/# If used to create other parameters, list here\s*([\s\S]*?)(?=\n#|$)/);
  const usedToCreate = usedToCreateMatch
    ? extractWikiLinks(usedToCreateMatch[1])
    : [];

  return {
    slug,
    parameterName: frontMatter.name || (nameMatch ? nameMatch[1].trim() : undefined) || frontMatter.title || (paramNameMatch ? paramNameMatch[1].trim() : slug),
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
function parseObservation(fileContent: string, slug: string, frontMatter: any): ObservationMetadata {
  const links = extractWikiLinks(fileContent);
  const connections: ModelConnection[] = links.map(link => ({
    source: slug,
    target: link.toLowerCase().replace(/\s+/g, '_'),
    type: 'uses' as const
  }));

  const descMatch = fileContent.match(/# Description\s*([\s\S]*?)(?=\n#|$)/);
  const description = descMatch ? descMatch[1].trim() : '';

  const nameMatch = fileContent.match(/^name:\s*(.+)$/im);
  const title = frontMatter.name || (nameMatch ? nameMatch[1].trim() : undefined) || frontMatter.title || slug.replace(/^output_/, '').replace(/_/g, ' ');

  return {
    slug,
    title,
    aliases: frontMatter.aliases || [],
    tags: frontMatter.tags || ['observation'],
    description,
    connections
  };
}

/**
 * Parse overview markdown file
 */
function parseOverview(fileContent: string, slug: string, frontMatter: any): OverviewMetadata {
  const links = extractWikiLinks(fileContent);
  const connections: ModelConnection[] = links.map(link => ({
    source: slug,
    target: link.toLowerCase().replace(/\s+/g, '_'),
    type: 'contains' as const
  }));

  const descMatch = fileContent.match(/# Description\s*([\s\S]*?)(?=\n#|$)/);
  const description = descMatch ? descMatch[1].trim() : '';
  const nameMatch = fileContent.match(/^name:\s*(.+)$/im);

  return {
    slug,
    title: frontMatter.name || (nameMatch ? nameMatch[1].trim() : undefined) || frontMatter.title || slug.replace(/_/g, ' '),
    tags: frontMatter.tags || ['overview'],
    description,
    connections
  };
}

/**
 * Get all markdown files recursively
 */
export function getAllMarkdownFiles(dir: string = contentDirectory, fileList: string[] = []): string[] {
  const files = fs.readdirSync(dir);

  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory() && !file.startsWith('.') && file !== 'node_modules' && file !== 'src') {
      getAllMarkdownFiles(filePath, fileList);
    } else if (file.endsWith('.md') && !file.startsWith('.')) {
      fileList.push(filePath);
    }
  });

  return fileList;
}

/**
 * Parse a markdown file and return structured content
 */
export function parseMarkdownFile(filePath: string): ContentMetadata | null {
  try {
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const { data: frontMatter, content } = matter(fileContent);

    // Generate slug from filename
    const slug = path.basename(filePath, '.md').toLowerCase().replace(/\s+/g, '_');

    // Determine content type
    const tags = frontMatter.tags || [];
    const contentType = determineContentType(filePath, tags);

    // Parse based on type
    let metadata: FluxMetadata | ParameterMetadata | ObservationMetadata | OverviewMetadata;
    switch (contentType) {
      case 'flux':
        metadata = parseFlux(fileContent, slug, frontMatter);
        break;
      case 'parameter':
        metadata = parseParameter(fileContent, slug, frontMatter);
        break;
      case 'observation':
        metadata = parseObservation(fileContent, slug, frontMatter);
        break;
      case 'overview':
      default:
        metadata = parseOverview(fileContent, slug, frontMatter);
        break;
    }

    // Convert wiki links to Next.js links; display starts at description section
    const displayContent = getDisplayContentFromMarkdown(content);
    const convertedContent = convertWikiLinksToNextLinks(displayContent);

    return {
      type: contentType,
      metadata,
      content: convertedContent
    };
  } catch (error) {
    console.error(`Error parsing ${filePath}:`, error);
    return null;
  }
}

/**
 * Get all content with metadata
 */
export function getAllContent(): ContentMetadata[] {
  const files = getAllMarkdownFiles();
  return files
    .map(parseMarkdownFile)
    .filter((content): content is ContentMetadata => content !== null);
}

/**
 * Get content by slug
 */
export function getContentBySlug(slug: string): ContentMetadata | null {
  const allContent = getAllContent();
  return allContent.find(content => content.metadata.slug === slug) || null;
}

/**
 * Get all slugs for static generation
 */
export function getAllSlugs(): string[] {
  const allContent = getAllContent();
  return allContent.map(content => content.metadata.slug);
}

/**
 * Build a connection graph for a specific item
 */
export function getConnectionGraph(slug: string): {
  incoming: ModelConnection[];
  outgoing: ModelConnection[];
} {
  const allContent = getAllContent();

  const getConnections = (item: ContentMetadata): ModelConnection[] => {
    if ('connections' in item.metadata) {
      return (item.metadata as { connections: ModelConnection[] }).connections;
    }
    return [];
  };

  const found = allContent.find(c => c.metadata.slug === slug);
  const outgoing = found ? getConnections(found) : [];

  const incoming = allContent
    .filter(c => getConnections(c).some(conn => conn.target === slug))
    .flatMap(c => getConnections(c).filter(conn => conn.target === slug));

  return { incoming, outgoing };
}
