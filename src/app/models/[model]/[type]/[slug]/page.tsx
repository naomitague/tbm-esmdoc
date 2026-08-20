import { Fragment } from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getModelContent, getAllModels, getAllModelContent } from '@/lib/models';
import { buildPageOutline } from '@/lib/pageOutline';
import { readEsmTable } from '@/lib/esm';
import { readCsvRows } from '@/lib/csv';
import { HeadingInjection, orderInjections, splitAtHeadings } from '@/lib/headingSplit';
import { getTopicIndex } from '@/lib/topics';
import { Navbar } from '@/components/Navbar';
import { MarkdownContent } from '@/components/MarkdownContent';
import { EsmMethodTable } from '@/components/EsmMethodTable';
import { CsvDatasetTable } from '@/components/CsvDatasetTable';
import { PageOutline } from '@/components/PageOutline';
import { TopicGroupSections, formatTopic } from '@/components/TopicGroupSections';
import { InfoBox } from '@/components/InfoBox';
import { MathText } from '@/components/MathText';
import { ChevronRight, ArrowLeft } from 'lucide-react';

interface PageProps {
  params: Promise<{
    model: string;
    type: string;
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const models = getAllModels();
  const params: { model: string; type: string; slug: string }[] = [];

  for (const model of models) {
    const allContent = getAllModelContent(model.slug);

    allContent.fluxes.forEach(flux => {
      params.push({
        model: model.slug,
        type: 'fluxes',
        slug: flux.metadata.slug,
      });
    });

    allContent.parameters.forEach(param => {
      params.push({
        model: model.slug,
        type: 'parameters',
        slug: param.metadata.slug,
      });
    });

    allContent.observations.forEach(obs => {
      params.push({
        model: model.slug,
        type: 'observations',
        slug: obs.metadata.slug,
      });
    });
  }

  return params;
}

export default async function ContentPage({ params }: PageProps) {
  const { model: modelSlug, type, slug } = await params;

  if (type !== 'fluxes' && type !== 'parameters' && type !== 'observations') {
    notFound();
  }

  const content = getModelContent(modelSlug, type, slug);

  if (!content) {
    notFound();
  }

  const outline = buildPageOutline(content.content);

  const meta = content.metadata as any;
  const displayTitle = meta.parameterName || meta.name || meta.title || meta.slug || '';

  // Same injection model as WikiPage: each CSV-driven frontmatter config
  // contributes a component spliced in after its heading, ordered by where
  // that heading falls in the body. A config whose heading isn't found just
  // contributes nothing rather than blocking the others.
  const injections: HeadingInjection[] = [];

  const esmTable = meta.esmTable;
  if (esmTable) {
    const esmData = readEsmTable(esmTable.csv, esmTable.columns);
    injections.push({
      heading: esmTable.heading,
      node: <EsmMethodTable rows={esmData.rows} models={esmData.models} columns={esmData.columns} />,
    });
  }

  const datasetTable = meta.datasetTable;
  if (datasetTable) {
    injections.push({
      heading: datasetTable.heading,
      node: (
        <CsvDatasetTable
          rows={readCsvRows(datasetTable.csv)}
          columns={datasetTable.columns}
          filterColumn={datasetTable.filter_column}
          filterLabel={datasetTable.filter_label}
          searchColumns={datasetTable.search_columns}
          searchPlaceholder={datasetTable.search_placeholder}
          title={datasetTable.title}
          rowNoun={datasetTable.row_noun}
        />
      ),
    });
  }

  const orderedInjections = orderInjections(content.content, injections);
  const contentSegments =
    orderedInjections.length > 0
      ? splitAtHeadings(content.content, orderedInjections.map(injection => injection.heading))
      : null;

  // A flux/parameter/observation's own topic tag doubles as a "see also" hub:
  // the same Models/Observations/Patterns/Relationships breakdown a reader
  // gets by clicking this topic on the model overview page, without leaving
  // this page. Only the item's first topic is used — consistent with how
  // clicking through from the overview page already treats topic as a
  // single primary grouping, not a multi-select.
  const itemTopic: string | undefined = Array.isArray(meta.topic) ? meta.topic[0] : undefined;
  const topicGroup = itemTopic ? getTopicIndex(modelSlug).topics.find(g => g.topic === itemTopic) ?? null : null;

  return (
    <div className="min-h-screen bg-stone-50">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Breadcrumb */}
        <nav className="mb-5 flex items-center gap-1.5 text-sm text-stone-500">
          <Link href="/" className="hover:text-primary transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" strokeWidth={1.5} />
          <Link href={`/models/${modelSlug}`} className="hover:text-primary transition-colors capitalize">
            {modelSlug}
          </Link>
          <ChevronRight className="w-3.5 h-3.5" strokeWidth={1.5} />
          <Link href={`/models/${modelSlug}#${type}`} className="hover:text-primary transition-colors capitalize">
            {type}
          </Link>
          <ChevronRight className="w-3.5 h-3.5" strokeWidth={1.5} />
          <span className="text-stone-800 font-medium"><MathText text={displayTitle} /></span>
        </nav>

        <div className="grid lg:grid-cols-5 gap-6">
          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <div className="bg-white rounded-lg border border-stone-200 p-4 sticky top-16">
              <Link
                href={`/models/${modelSlug}`}
                className="flex items-center gap-1.5 text-primary text-sm font-medium mb-4 pb-3 border-b border-stone-100"
              >
                <ArrowLeft className="w-3.5 h-3.5" strokeWidth={1.5} />
                {modelSlug.charAt(0).toUpperCase() + modelSlug.slice(1)} Model
              </Link>

              <PageOutline outline={outline} />
            </div>
          </aside>

          {/* Main Content */}
          <main className="lg:col-span-3">
            <article className="bg-white rounded-lg border border-stone-200 p-8">
              <h1 className="text-3xl font-heading mb-4 pb-4 border-b border-stone-200 text-stone-900">
                <MathText text={displayTitle} />
              </h1>

              <div className="flex gap-2 mb-6">
                <span className={`badge badge-${content.type}`}>
                  {content.type}
                </span>
                {('tags' in content.metadata ? content.metadata.tags : [])?.map(tag => (
                  <span key={tag} className="badge bg-stone-400">
                    {tag}
                  </span>
                ))}
              </div>

              <InfoBox content={content} />

              <div className="wiki-content">
                {contentSegments ? (
                  contentSegments.map((segment, i) => (
                    <Fragment key={i}>
                      <MarkdownContent content={segment} />
                      {orderedInjections[i]?.node}
                    </Fragment>
                  ))
                ) : (
                  <MarkdownContent content={content.content} />
                )}
              </div>
            </article>
          </main>

          {/* Topic panel */}
          {topicGroup && (
            <aside className="lg:col-span-1">
              <div className="bg-white rounded-lg border border-stone-200 p-4 sticky top-16">
                <Link
                  href={`/models/${modelSlug}`}
                  className="flex items-center gap-1.5 text-primary text-sm font-medium mb-4 pb-3 border-b border-stone-100"
                >
                  <ArrowLeft className="w-3.5 h-3.5" strokeWidth={1.5} />
                  {modelSlug.charAt(0).toUpperCase() + modelSlug.slice(1)} Model
                </Link>

                <h3 className="font-heading text-base mb-4 capitalize">{formatTopic(topicGroup.topic)}</h3>

                <TopicGroupSections group={topicGroup} highlightedSlug={slug} />
              </div>
            </aside>
          )}
        </div>
      </div>
    </div>
  );
}
