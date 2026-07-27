import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { readEsmRegistry } from '@/lib/esm';
import { Boxes, ExternalLink } from 'lucide-react';

export const metadata = {
  title: 'Earth System Models',
};

export default function EsmListPage() {
  const models = readEsmRegistry();

  return (
    <div className="min-h-screen bg-stone-50">
      <Navbar />

      <div className="bg-primary text-white py-12">
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex items-center gap-4 mb-2">
            <Boxes className="w-10 h-10" strokeWidth={1.5} />
            <div>
              <h1 className="text-4xl font-heading">Earth System Models</h1>
              <p className="text-base mt-1 text-white/80">
                Models and versions referenced across the process documentation
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        <p className="text-sm text-stone-600 mb-6 max-w-3xl">
          {models.length} Earth System Models tracked in this vault. Process pages (e.g.{' '}
          <Link href="/wiki/process_evapotranspiration" className="text-primary hover:underline">
            evapotranspiration
          </Link>
          ) reference these models and versions by ID to describe how each represents a given
          flux. Per-model detail pages are planned.
        </p>

        <div className="space-y-4">
          {models.map(model => (
            <div key={model.modelId} className="bg-white rounded-lg border border-stone-200 p-5">
              <div className="flex flex-wrap items-baseline justify-between gap-2 mb-1">
                <h2 className="text-xl font-heading text-stone-900">{model.displayName}</h2>
                <span className="text-[0.65rem] uppercase tracking-wide text-stone-400">
                  {model.modelType.replace(/_/g, ' ')}
                </span>
              </div>

              {model.websiteUrl && (
                <a
                  href={model.websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-sm text-primary hover:underline mb-2"
                >
                  <ExternalLink className="w-3.5 h-3.5" strokeWidth={1.5} />
                  {model.websiteUrl.replace(/^https?:\/\//, '').replace(/\/$/, '')}
                </a>
              )}

              {model.notes && <p className="text-sm text-stone-600 mb-3">{model.notes}</p>}

              {model.versions.length > 0 && (
                <div className="border-t border-stone-100 pt-3">
                  <div className="text-xs font-medium text-stone-500 uppercase tracking-wide mb-2">
                    Versions ({model.versions.length})
                  </div>
                  <ul className="space-y-2">
                    {model.versions.map(v => (
                      <li key={v.versionId} className="text-sm">
                        <div className="flex flex-wrap items-baseline gap-2">
                          <span className="font-medium text-stone-800">{v.versionLabel}</span>
                          {v.releaseYear && (
                            <span className="text-stone-400 text-xs">{v.releaseYear}</span>
                          )}
                          {v.codeRepoUrl && (
                            <a
                              href={v.codeRepoUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
                            >
                              <ExternalLink className="w-3 h-3" strokeWidth={1.5} /> code
                            </a>
                          )}
                        </div>
                        {v.notes && <p className="text-xs text-stone-500 mt-0.5">{v.notes}</p>}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
