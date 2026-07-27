import { Fragment } from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getModelContent, getAllModels, getAllModelContent } from '@/lib/models';
import { buildPageOutline } from '@/lib/pageOutline';
import { readEsmTable } from '@/lib/esm';
import { Navbar } from '@/components/Navbar';
import { MarkdownContent } from '@/components/MarkdownContent';
import { EsmMethodTable } from '@/components/EsmMethodTable';
import { PageOutline } from '@/components/PageOutline';
import { InfoBox } from '@/components/InfoBox';
import { MathText } from '@/components/MathText';
import { ChevronRight, ArrowLeft } from 'lucide-react';

/**
 * Mirror of WikiPage's heading splitter: an `esm_table` note has an interactive
 * comparison table spliced in after its configured heading. Returns null (render
 * as one block) if the heading isn't present.
 */
function splitAtHeading(markdown: string, heading: string): string[] | null {
  const idx = markdown.indexOf(heading);
  if (idx === -1) return null;
  return [markdown.slice(0, idx + heading.length), markdown.slice(idx + heading.length)];
}

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

  const esmTable = meta.esmTable;
  const esmSegments = esmTable ? splitAtHeading(content.content, esmTable.heading) : null;
  const esmData = esmSegments && esmTable ? readEsmTable(esmTable.csv, esmTable.columns) : null;

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

        <div className="grid lg:grid-cols-4 gap-6">
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
                {esmSegments && esmData ? (
                  esmSegments.map((segment, i) => (
                    <Fragment key={i}>
                      <MarkdownContent content={segment} />
                      {i === 0 && (
                        <EsmMethodTable
                          rows={esmData.rows}
                          models={esmData.models}
                          columns={esmData.columns}
                        />
                      )}
                    </Fragment>
                  ))
                ) : (
                  <MarkdownContent content={content.content} />
                )}
              </div>
            </article>
          </main>
        </div>
      </div>
    </div>
  );
}
