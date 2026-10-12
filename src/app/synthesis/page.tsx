import Link from 'next/link';
import { ArrowRight, Network } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { getSynthesisIndex } from '@/lib/topics';

export const metadata = {
  title: 'Theory and Synthesis',
  description: 'The relationships and topics covered so far, and the pages that work through them.',
};

const formatTopic = (topic: string) => topic.replace(/_/g, ' ');

export default function SynthesisPage() {
  const { relationships, patterns, topics } = getSynthesisIndex();

  return (
    <div className="min-h-screen bg-stone-50">
      <Navbar />

      <main className="mx-auto max-w-5xl px-4 py-12">
        <header className="mb-8">
          <div className="mb-2 flex items-center gap-2 text-primary">
            <Network className="h-5 w-5" strokeWidth={1.5} />
            <span className="text-sm font-medium uppercase tracking-wide">Synthesis</span>
          </div>
          <h1 className="font-heading text-4xl text-stone-900">Theory and Synthesis</h1>
          <p className="mt-3 max-w-3xl text-stone-600">
            Each relationship below is a question the literature is organized around — what we
            think we know, how it was measured, and where studies agree or disagree. The pages
            nested under one are the worked syntheses for it.
          </p>
          {topics.length > 0 && (
            <div className="mt-4 flex flex-wrap items-center gap-1.5">
              <span className="mr-1 text-xs uppercase tracking-wide text-stone-500">Topics covered</span>
              {topics.map(topic => (
                <span key={topic} className="rounded-full bg-stone-200 px-2.5 py-0.5 text-xs text-stone-700">
                  {formatTopic(topic)}
                </span>
              ))}
            </div>
          )}
        </header>

        <section>
          <h2 className="mb-3 font-heading text-xl text-stone-900">Relationships</h2>
          <div className="space-y-4">
            {relationships.map(entry => (
              <article key={entry.slug} className="rounded-lg border border-stone-200 bg-white p-6">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="font-heading text-lg">
                    <Link href={entry.href} className="text-stone-900 hover:text-primary">
                      {entry.title}
                    </Link>
                  </h3>
                  {entry.model && (
                    <Link
                      href={`/models/${entry.model}`}
                      className="text-xs text-stone-500 hover:text-primary"
                    >
                      {entry.model} model
                    </Link>
                  )}
                </div>

                {entry.topics.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {entry.topics.map(topic => (
                      <span
                        key={topic}
                        className="rounded-full bg-primary-light px-2 py-0.5 text-xs text-primary"
                      >
                        {formatTopic(topic)}
                      </span>
                    ))}
                  </div>
                )}

                {entry.children.length > 0 ? (
                  <>
                    <div className="mt-4 text-xs uppercase tracking-wide text-stone-500">
                      {entry.children.length} pages under this
                    </div>
                    <ul className="mt-1.5 grid gap-x-6 gap-y-1 sm:grid-cols-2">
                      {entry.children.map(child => (
                        <li key={child.slug}>
                          <Link
                            href={child.href}
                            className="group flex items-baseline gap-1.5 py-0.5 text-sm text-primary hover:underline"
                          >
                            {child.title}
                            <ArrowRight
                              className="h-3 w-3 flex-shrink-0 opacity-0 transition-opacity group-hover:opacity-100"
                              strokeWidth={1.5}
                            />
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </>
                ) : (
                  <p className="mt-3 text-sm text-stone-500">
                    No worked syntheses under this one yet.
                  </p>
                )}
              </article>
            ))}
          </div>
        </section>

        {patterns.length > 0 && (
          <section className="mt-10">
            <h2 className="mb-1 font-heading text-xl text-stone-900">Topic pages</h2>
            <p className="mb-3 text-sm text-stone-500">
              Scoped to one topic rather than to a relationship between two.
            </p>
            <ul className="grid gap-2 sm:grid-cols-2">
              {patterns.map(entry => (
                <li key={entry.slug} className="rounded-lg border border-stone-200 bg-white p-4">
                  <Link href={entry.href} className="text-sm font-medium text-primary hover:underline">
                    {entry.title}
                  </Link>
                  {entry.topics.length > 0 && (
                    <div className="mt-1 text-xs text-stone-500">
                      {entry.topics.map(formatTopic).join(' · ')}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </section>
        )}
      </main>
    </div>
  );
}
