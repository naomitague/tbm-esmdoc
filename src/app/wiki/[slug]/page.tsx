import { Fragment } from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getContentBySlug, getAllSlugs, getConnectionGraph } from '@/lib/markdown';
import { readCsvRows } from '@/lib/csv';
import { Sidebar } from '@/components/Sidebar';
import { ConnectionGraph } from '@/components/ConnectionGraph';
import { MarkdownContent } from '@/components/MarkdownContent';
import { CsvHistogramSection } from '@/components/CsvHistogramSection';
import { MathText } from '@/components/MathText';
import { InfoBox } from '@/components/InfoBox';
import { Leaf } from 'lucide-react';
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

  const connections = getConnectionGraph(slug);
  const histogramData = 'histogramData' in content.metadata ? content.metadata.histogramData : undefined;
  const histogramSegments = histogramData
    ? splitAtHeadings(content.content, histogramData.sections.map(section => section.heading))
    : null;
  const csvRows = histogramSegments && histogramData ? readCsvRows(histogramData.csv) : null;

  return (
    <div className="min-h-screen bg-white">
      <header className="bg-white border-b border-stone-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <Link href="/" className="inline-flex items-center gap-2 text-primary hover:underline">
            <Leaf className="w-5 h-5" strokeWidth={1.5} />
            <span className="text-lg font-heading">RHESSys Docs</span>
          </Link>
        </div>
      </header>

      <div className="flex max-w-7xl mx-auto">
        <Sidebar currentSlug={slug} contentType={content.type} />

        <main className="flex-1 px-8 py-6">
          <article className="wiki-content max-w-4xl">
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
              <div className="flex-1">
                <InfoBox content={content} />
                {histogramSegments && histogramData && csvRows ? (
                  histogramSegments.map((segment, i) => (
                    <Fragment key={i}>
                      <MarkdownContent content={segment} />
                      {i < histogramData.sections.length && (
                        <CsvHistogramSection
                          title={histogramData.sections[i].title}
                          column={histogramData.sections[i].column}
                          rows={csvRows}
                          tableColumns={histogramData.table_columns}
                        />
                      )}
                    </Fragment>
                  ))
                ) : (
                  <MarkdownContent content={content.content} />
                )}
              </div>

              {(connections.incoming.length > 0 || connections.outgoing.length > 0) && (
                <aside className="lg:w-80 flex-shrink-0">
                  <ConnectionGraph
                    slug={slug}
                    title={getTitle(content)}
                    incoming={connections.incoming}
                    outgoing={connections.outgoing}
                  />
                </aside>
              )}
            </div>
          </article>
        </main>
      </div>
    </div>
  );
}
