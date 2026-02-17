import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getModelContent, getAllModels, getAllModelContent } from '@/lib/models';
import { Navbar } from '@/components/Navbar';
import { MarkdownContent } from '@/components/MarkdownContent';
import { InfoBox } from '@/components/InfoBox';
import { ChevronRight, ArrowLeft } from 'lucide-react';
import { ContentMetadata } from '@/types';

function getTitle(item: ContentMetadata): string {
  if ('parameterName' in item.metadata) return item.metadata.parameterName;
  return (item.metadata as { title: string }).title;
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

    allContent.processes.forEach(proc => {
      params.push({
        model: model.slug,
        type: 'processes',
        slug: proc.metadata.slug,
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

  if (type !== 'processes' && type !== 'parameters' && type !== 'observations') {
    notFound();
  }

  const content = getModelContent(modelSlug, type, slug);

  if (!content) {
    notFound();
  }

  const allContent = getAllModelContent(modelSlug);

  const displayTitle = 'parameterName' in content.metadata
    ? content.metadata.parameterName
    : (content.metadata as { title: string }).title;

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
          <span className="text-stone-800 font-medium">{displayTitle}</span>
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

              {allContent.processes.length > 0 && (
                <div className="mb-5">
                  <h3 className="text-xs font-medium uppercase tracking-wide text-stone-400 mb-2">
                    Processes
                  </h3>
                  <ul className="space-y-0.5">
                    {allContent.processes.map(proc => (
                      <li key={proc.metadata.slug}>
                        <Link
                          href={`/models/${modelSlug}/processes/${proc.metadata.slug}`}
                          className={`block text-sm py-1 px-2 rounded transition-colors ${
                            proc.metadata.slug === slug && type === 'processes'
                              ? 'text-primary bg-primary-light font-medium'
                              : 'text-stone-600 hover:text-primary hover:bg-stone-50'
                          }`}
                        >
                          {getTitle(proc)}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {allContent.parameters.length > 0 && (
                <div className="mb-5">
                  <h3 className="text-xs font-medium uppercase tracking-wide text-stone-400 mb-2">
                    Parameters
                  </h3>
                  <ul className="space-y-0.5">
                    {allContent.parameters.slice(0, 8).map(param => (
                      <li key={param.metadata.slug}>
                        <Link
                          href={`/models/${modelSlug}/parameters/${param.metadata.slug}`}
                          className={`block text-sm py-1 px-2 rounded transition-colors ${
                            param.metadata.slug === slug && type === 'parameters'
                              ? 'text-primary bg-primary-light font-medium'
                              : 'text-stone-600 hover:text-primary hover:bg-stone-50'
                          }`}
                        >
                          {getTitle(param)}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {allContent.observations.length > 0 && (
                <div>
                  <h3 className="text-xs font-medium uppercase tracking-wide text-stone-400 mb-2">
                    Observations
                  </h3>
                  <ul className="space-y-0.5">
                    {allContent.observations.map(obs => (
                      <li key={obs.metadata.slug}>
                        <Link
                          href={`/models/${modelSlug}/observations/${obs.metadata.slug}`}
                          className={`block text-sm py-1 px-2 rounded transition-colors ${
                            obs.metadata.slug === slug && type === 'observations'
                              ? 'text-primary bg-primary-light font-medium'
                              : 'text-stone-600 hover:text-primary hover:bg-stone-50'
                          }`}
                        >
                          {getTitle(obs)}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </aside>

          {/* Main Content */}
          <main className="lg:col-span-3">
            <article className="bg-white rounded-lg border border-stone-200 p-8">
              <h1 className="text-3xl font-heading mb-4 pb-4 border-b border-stone-200 text-stone-900">
                {displayTitle}
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
                <MarkdownContent content={content.content} />
              </div>
            </article>
          </main>
        </div>
      </div>
    </div>
  );
}
