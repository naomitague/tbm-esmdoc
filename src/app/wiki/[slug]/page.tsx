import { Fragment } from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getContentBySlug, getAllSlugs } from '@/lib/markdown';
import { readCsvRows } from '@/lib/csv';
import { buildPageOutline } from '@/lib/pageOutline';
import { Sidebar } from '@/components/Sidebar';
import { PageOutline } from '@/components/PageOutline';
import { RelatedContentPanel } from '@/components/RelatedContentPanel';
import { MarkdownContent } from '@/components/MarkdownContent';
import { CsvHistogramSection } from '@/components/CsvHistogramSection';
import { CsvScatterSection } from '@/components/CsvScatterSection';
import { TrendComparisonExplorer } from '@/components/TrendComparisonExplorer';
import { EsmMethodTable } from '@/components/EsmMethodTable';
import { MetricResponseExplorer } from '@/components/MetricResponseExplorer';
import { readEsmTable } from '@/lib/esm';
import { MathText } from '@/components/MathText';
import { InfoBox } from '@/components/InfoBox';
import { Leaf, ArrowLeft } from 'lucide-react';
import { ContentMetadata } from '@/types';

function getTitle(item: ContentMetadata): string {
  const meta = item.metadata as any;

  if (meta.parameterName) return meta.parameterName;
  if (meta.name) return meta.name;
  if (meta.title) return meta.title;
  return meta.slug || '';
}

/**
 * A note opts into inline CSV histograms by declaring `histogram_data` in its
 * frontmatter (csv path + a list of {heading, column, title} sections — see
 * HistogramDataConfig). This splits the note's markdown at each configured
 * heading, in order, so a chart can be spliced in right after it — the
 * generic MarkdownContent pipeline renders static HTML and can't host a live
 * component itself. Returns null (render the note as one block, unchanged)
 * if any configured heading isn't found in the content.
 */
function splitAtHeadings(markdown: string, headings: string[]): string[] | null {
  const indices = headings.map(heading => markdown.indexOf(heading));
  if (indices.some(idx => idx === -1)) return null;
  for (let i = 1; i < indices.length; i++) {
    if (indices[i] < indices[i - 1]) return null;
  }

  const segments: string[] = [];
  let cursor = 0;
  headings.forEach((heading, i) => {
    const idx = indices[i];
    segments.push(markdown.slice(cursor, idx + heading.length));
    cursor = idx + heading.length;
  });
  segments.push(markdown.slice(cursor));

  return segments;
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = getAllSlugs();
  return slugs.map(slug => ({ slug }));
}

export default async function WikiPage({ params }: PageProps) {
  const { slug } = await params;
  const content = getContentBySlug(slug);

  if (!content) {
    notFound();
  }

  // A note can combine more than one CSV-driven feature (e.g. histogram_data
  // AND metric_response_data on the same page) — each config contributes one
  // or more {heading, node} injection points, which are then ordered by
  // where their heading actually falls in the document and spliced in with
  // a single splitAtHeadings pass. A config whose heading isn't found in the
  // body just contributes nothing, rather than blocking the others.
  const injections: { heading: string; node: React.ReactNode }[] = [];

  const histogramData = 'histogramData' in content.metadata ? content.metadata.histogramData : undefined;
  if (histogramData) {
    const csvRows = readCsvRows(histogramData.csv);
    histogramData.sections.forEach(section => {
      injections.push({
        heading: section.heading,
        node:
          section.type === 'scatter' ? (
            <CsvScatterSection
              title={section.title}
              xColumn={section.x_column}
              yColumn={section.y_column}
              xLabel={section.x_label}
              yLabel={section.y_label}
              filterColumn={section.filter_column}
              filterValue={section.filter_value}
              rows={csvRows}
            />
          ) : (
            <CsvHistogramSection
              title={section.title}
              column={section.column}
              rows={csvRows}
              tableColumns={histogramData.table_columns}
            />
          ),
      });
    });
  }

  const trendData = 'trendData' in content.metadata ? content.metadata.trendData : undefined;
  if (trendData) {
    injections.push({ heading: trendData.heading, node: <TrendComparisonExplorer rows={readCsvRows(trendData.csv)} /> });
  }

  const esmTable = 'esmTable' in content.metadata ? content.metadata.esmTable : undefined;
  if (esmTable) {
    const esmData = readEsmTable(esmTable.csv, esmTable.columns);
    injections.push({
      heading: esmTable.heading,
      node: <EsmMethodTable rows={esmData.rows} models={esmData.models} columns={esmData.columns} />,
    });
  }

  const metricResponseData = 'metricResponseData' in content.metadata ? content.metadata.metricResponseData : undefined;
  if (metricResponseData) {
    const metricRows = readCsvRows(metricResponseData.csv);
    metricResponseData.sections.forEach(section => {
      injections.push({
        heading: section.heading,
        node: (
          <MetricResponseExplorer
            title={section.title}
            rows={metricRows}
            metricColumn={section.metric_column}
            knownMetrics={section.known_metrics ?? []}
            excludeMetrics={section.exclude_metrics ?? []}
            xColumn={section.x_column}
            xLabel={section.x_label}
            yColumn={section.y_column}
            yLabel={section.y_label}
            tableColumns={section.table_columns}
          />
        ),
      });
    });
  }

  const orderedInjections = injections
    .map(injection => ({ ...injection, index: content.content.indexOf(injection.heading) }))
    .filter(injection => injection.index !== -1)
    .sort((a, b) => a.index - b.index);

  const contentSegments =
    orderedInjections.length > 0
      ? splitAtHeadings(content.content, orderedInjections.map(injection => injection.heading))
      : null;

  const kind = 'kind' in content.metadata ? content.metadata.kind : undefined;
  const isPattern = kind === 'pattern' || kind === 'relationship';
  const outline = isPattern ? buildPageOutline(content.content) : [];
  const backModel = 'model' in content.metadata ? content.metadata.model : undefined;
  const relatedContent = 'relatedContent' in content.metadata ? content.metadata.relatedContent ?? [] : [];

  return (
    <div className="min-h-screen bg-white">
      <header className="bg-white border-b border-stone-200 sticky top-0 z-10">
        <div className="max-w-screen-2xl mx-auto px-4 py-3">
          <Link href="/" className="inline-flex items-center gap-2 text-primary hover:underline">
            <Leaf className="w-5 h-5" strokeWidth={1.5} />
            <span className="text-lg font-heading">ESM Model and Obs</span>
          </Link>
        </div>
      </header>

      <div className="flex max-w-screen-2xl mx-auto">
        {!isPattern && <Sidebar currentSlug={slug} contentType={content.type} />}
        {isPattern && (outline.length > 0 || backModel) && (
          <aside className="hidden lg:block w-64 flex-shrink-0 px-4 py-6">
            <div className="bg-white rounded-lg border border-stone-200 p-4 sticky top-16">
              {backModel && (
                <Link
                  href={`/models/${backModel}`}
                  className="flex items-center gap-1.5 text-primary text-sm font-medium mb-4 pb-3 border-b border-stone-100"
                >
                  <ArrowLeft className="w-3.5 h-3.5" strokeWidth={1.5} />
                  {backModel.charAt(0).toUpperCase() + backModel.slice(1)} Model
                </Link>
              )}
              <PageOutline outline={outline} />
            </div>
          </aside>
        )}

        <main className="flex-1 min-w-0 px-8 py-6">
          <article className="wiki-content max-w-7xl">
            <h1 className="text-3xl font-heading border-b-2 border-primary pb-2 mb-4 text-stone-900">
              <MathText text={getTitle(content)} />
            </h1>

            <div className="flex gap-2 mb-4">
              <span className={`badge badge-${content.type}`}>
                {content.type}
              </span>
              {('tags' in content.metadata ? content.metadata.tags : []).map(tag => (
                <span key={tag} className="badge bg-stone-400">
                  {tag}
                </span>
              ))}
            </div>

            <div className="flex flex-col lg:flex-row gap-6">
              <div className="flex-1 min-w-0">
                <InfoBox content={content} />
                {contentSegments ? (
                  contentSegments.map((segment, i) => (
                    <Fragment key={i}>
                      <MarkdownContent content={segment} />
                      {orderedInjections[i] && orderedInjections[i].node}
                    </Fragment>
                  ))
                ) : (
                  <MarkdownContent content={content.content} />
                )}
              </div>

              {relatedContent.length > 0 && (
                <aside className="lg:w-80 flex-shrink-0">
                  <RelatedContentPanel items={relatedContent} title="Related content" />
                </aside>
              )}
            </div>
          </article>
        </main>
      </div>
    </div>
  );
}
