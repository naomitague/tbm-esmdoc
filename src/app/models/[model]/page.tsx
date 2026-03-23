import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getModelBySlug, getAllModels, getAllModelContent } from '@/lib/models';
import { Navbar } from '@/components/Navbar';
import { MarkdownContent } from '@/components/MarkdownContent';
import { ModelMetadata, ContentMetadata } from '@/types';
import { Droplets, Sprout, FlaskConical, Sun, BarChart3 } from 'lucide-react';

function getTitle(item: ContentMetadata): string {
  const meta = item.metadata as any;

  if (meta.parameterName) return meta.parameterName;
  if (meta.name) return meta.name;
  if (meta.title) return meta.title;
  return meta.slug || '';
}

interface PageProps {
  params: Promise<{ model: string }>;
}

const modelIcons: Record<string, React.ElementType> = {
  water: Droplets,
  carbon: Sprout,
  nitrogen: FlaskConical,
  energy: Sun,
};

const colorClasses: Record<string, string> = {
  blue: 'bg-sky-600',
  green: 'bg-emerald-600',
  purple: 'bg-violet-600',
  orange: 'bg-amber-600',
  gray: 'bg-stone-500',
};

export async function generateStaticParams() {
  const models = getAllModels();
  return models.map(model => ({ model: model.slug }));
}

export default async function ModelPage({ params }: PageProps) {
  const { model: modelSlug } = await params;
  const modelContent = getModelBySlug(modelSlug);

  if (!modelContent) {
    notFound();
  }

  const metadata = modelContent.metadata as ModelMetadata;
  const allContent = getAllModelContent(modelSlug);
  const bgColor = metadata.color ? colorClasses[metadata.color] : 'bg-stone-500';
  const Icon = modelIcons[modelSlug] || BarChart3;

  return (
    <div className="min-h-screen bg-stone-50">
      <Navbar />

      {/* Hero */}
      <div className={`${bgColor} text-white py-12`}>
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center gap-4 mb-4">
            <Icon className="w-10 h-10" strokeWidth={1.5} />
            <div>
              <h1 className="text-4xl font-heading">{metadata.title}</h1>
              <p className="text-base mt-1 text-white/80">
                {metadata.description}
              </p>
            </div>
          </div>

          <div className="flex gap-8 mt-6 text-white/90">
            <div>
              <div className="text-2xl font-semibold">{metadata.fluxCount}</div>
              <div className="text-xs uppercase tracking-wide opacity-75">Fluxes</div>
            </div>
            <div>
              <div className="text-2xl font-semibold">{metadata.parameterCount}</div>
              <div className="text-xs uppercase tracking-wide opacity-75">Parameters</div>
            </div>
            <div>
              <div className="text-2xl font-semibold">{metadata.observationCount}</div>
              <div className="text-xs uppercase tracking-wide opacity-75">Observations</div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg border border-stone-200 p-8 wiki-content">
              <MarkdownContent content={modelContent.content} />
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-5">
            {allContent.fluxes.length > 0 && (
              <div className="bg-white rounded-lg border border-stone-200 p-5">
                <h3 className="font-heading text-base mb-3 flex items-center gap-2">
                  <span className="badge badge-flux">Flux</span>
                  Fluxes
                </h3>
                <ul className="space-y-1.5">
                  {allContent.fluxes.map(flx => (
                    <li key={flx.metadata.slug}>
                      <Link
                        href={`/models/${modelSlug}/fluxes/${flx.metadata.slug}`}
                        className="text-sm text-primary hover:underline block py-0.5"
                      >
                        {getTitle(flx)}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {allContent.parameters.length > 0 && (
              <div className="bg-white rounded-lg border border-stone-200 p-5">
                <h3 className="font-heading text-base mb-3 flex items-center gap-2">
                  <span className="badge badge-parameter">Parameter</span>
                  Parameters
                </h3>
                <ul className="space-y-1.5">
                  {allContent.parameters.slice(0, 10).map(param => (
                    <li key={param.metadata.slug}>
                      <Link
                        href={`/models/${modelSlug}/parameters/${param.metadata.slug}`}
                        className="text-sm text-primary hover:underline block py-0.5"
                      >
                        {getTitle(param)}
                      </Link>
                    </li>
                  ))}
                  {allContent.parameters.length > 10 && (
                    <li className="text-xs text-stone-400 py-0.5">
                      +{allContent.parameters.length - 10} more
                    </li>
                  )}
                </ul>
              </div>
            )}

            {allContent.observations.length > 0 && (
              <div className="bg-white rounded-lg border border-stone-200 p-5">
                <h3 className="font-heading text-base mb-3 flex items-center gap-2">
                  <span className="badge badge-observation">Output</span>
                  Observations
                </h3>
                <ul className="space-y-1.5">
                  {allContent.observations.map(obs => (
                    <li key={obs.metadata.slug}>
                      <Link
                        href={`/models/${modelSlug}/observations/${obs.metadata.slug}`}
                        className="text-sm text-primary hover:underline block py-0.5"
                      >
                        {getTitle(obs)}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
