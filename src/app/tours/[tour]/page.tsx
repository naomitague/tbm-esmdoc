import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowRight, Map } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { MarkdownContent } from '@/components/MarkdownContent';
import { getAllTours, getTourById } from '@/lib/tours';
import { stepHref } from '@/lib/tourLinks';

interface PageProps {
  params: Promise<{ tour: string }>;
}

export async function generateStaticParams() {
  return getAllTours().map(tour => ({ tour: tour.id }));
}

/** The heading and the `**Page:**` line are rendered as the card's own chrome, so drop them from the prose. */
function stepProse(body: string): string {
  return body
    .replace(/^##[^\n]*\n/, '')
    .replace(/^\s*(?:>\s*)?\*\*Page:?\*\*:?[^\n]*\n?/im, '')
    .trim();
}

export default async function TourPage({ params }: PageProps) {
  const { tour: tourId } = await params;
  const tour = getTourById(tourId);

  if (!tour) {
    notFound();
  }

  const firstStep = tour.steps[0];

  return (
    <div className="min-h-screen bg-stone-50">
      <Navbar />

      <main className="mx-auto max-w-4xl px-4 py-10">
        <Link
          href="/tours"
          className="mb-5 inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
        >
          <ArrowLeft className="h-3.5 w-3.5" strokeWidth={1.5} />
          All tours
        </Link>

        <header className="rounded-lg border border-stone-200 bg-white p-6">
          <div className="mb-2 flex items-center gap-2 text-xs uppercase tracking-wide text-stone-500">
            <Map className="h-4 w-4 text-primary" strokeWidth={1.5} />
            {tour.steps.length} steps
            {tour.status && <span className="rounded-full bg-stone-100 px-2 py-0.5">{tour.status}</span>}
          </div>
          <h1 className="font-heading text-3xl text-stone-900">{tour.title}</h1>
          {tour.question && <p className="mt-3 text-stone-700 italic">“{tour.question}”</p>}
          {tour.who && <p className="mt-2 text-sm text-stone-500">{tour.who}</p>}

          {firstStep && (
            <Link
              href={stepHref(firstStep.href, tour.id, firstStep.index)}
              className="mt-5 inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-dark"
            >
              Start tour
              <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
            </Link>
          )}
          <p className="mt-2 text-xs text-stone-500">
            A tour bar follows you from page to page — use it to step forward, go back, or leave the
            tour.
          </p>
        </header>

        <ol className="mt-6 space-y-4">
          {tour.steps.map(step => {
            const prose = stepProse(step.body);
            return (
              <li key={step.index} className="rounded-lg border border-stone-200 bg-white p-5">
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-primary-light text-sm font-medium text-primary">
                    {step.index}
                  </span>
                  <div className="min-w-0 flex-1">
                    <h2 className="font-heading text-lg text-stone-900">{step.title}</h2>

                    {step.href && (
                      <Link
                        href={stepHref(step.href, tour.id, step.index)}
                        className="mt-1 inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
                      >
                        {step.linkLabel || step.href}
                        <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.5} />
                      </Link>
                    )}

                    {prose && (
                      <div className="wiki-content mt-2 text-sm">
                        <MarkdownContent content={prose} />
                      </div>
                    )}
                  </div>
                </div>
              </li>
            );
          })}
        </ol>

        {/* "Notes for us" is a note to the authors, not to the reader. */}
        {tour.outro
          .filter(section => section.heading.toLowerCase() !== 'notes for us')
          .map(section => (
          <section key={section.heading} className="mt-6 rounded-lg border border-stone-200 bg-white p-5">
            <h2
              id={section.heading.toLowerCase().replace(/\s+/g, '_')}
              className="font-heading text-lg text-stone-900"
            >
              {section.heading}
            </h2>
            {section.body && (
              <div className="wiki-content mt-1 text-sm">
                <MarkdownContent content={section.body} />
              </div>
            )}
          </section>
          ))}
      </main>
    </div>
  );
}
