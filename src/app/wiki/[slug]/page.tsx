import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getContentBySlug, getAllSlugs, getConnectionGraph } from '@/lib/markdown';
import { Sidebar } from '@/components/Sidebar';
import { ConnectionGraph } from '@/components/ConnectionGraph';
import { MarkdownContent } from '@/components/MarkdownContent';
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
              {getTitle(content)}
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
                <MarkdownContent content={content.content} />
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
