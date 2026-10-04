import Link from 'next/link';
import { ArrowRight, Map } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { getAllTours } from '@/lib/tours';

export const metadata = {
  title: 'Tours',
  description: 'Guided walkthroughs of the site, one per kind of reader.',
};

export default function ToursIndexPage() {
  const tours = getAllTours();

  return (
    <div className="min-h-screen bg-stone-50">
      <Navbar />

      <main className="mx-auto max-w-4xl px-4 py-12">
        <div className="mb-8">
          <div className="mb-2 flex items-center gap-2 text-primary">
            <Map className="h-5 w-5" strokeWidth={1.5} />
            <span className="text-sm font-medium uppercase tracking-wide">Tours</span>
          </div>
          <h1 className="font-heading text-4xl text-stone-900">Guided walkthroughs</h1>
          <p className="mt-3 max-w-2xl text-stone-600">
            Each tour follows one reader with one question, step by step through the pages that
            answer it. A tour bar stays with you as you go, so you can read the real pages without
            losing your place.
          </p>
        </div>

        <div className="space-y-4">
          {tours.map(tour => {
            const first = tour.steps[0];
            return (
              <article key={tour.id} className="rounded-lg border border-stone-200 bg-white p-6">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h2 className="font-heading text-xl text-stone-900">
                    <Link href={`/tours/${tour.id}`} className="hover:text-primary">
                      {tour.title}
                    </Link>
                  </h2>
                  <div className="flex items-center gap-2 text-xs text-stone-500">
                    <span>{tour.steps.length} steps</span>
                    {tour.status && (
                      <span className="rounded-full bg-stone-100 px-2 py-0.5 uppercase tracking-wide">
                        {tour.status}
                      </span>
                    )}
                  </div>
                </div>

                {tour.question && <p className="mt-3 text-stone-700 italic">“{tour.question}”</p>}
                {tour.who && <p className="mt-2 text-sm text-stone-500">{tour.who}</p>}

                <div className="mt-4 flex flex-wrap items-center gap-3">
                  <Link
                    href={`/tours/${tour.id}`}
                    className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-primary-dark"
                  >
                    Open tour
                    <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
                  </Link>
                  {first && (
                    <span className="text-sm text-stone-500">
                      Starts at <span className="text-stone-700">{first.title}</span>
                    </span>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </main>
    </div>
  );
}
