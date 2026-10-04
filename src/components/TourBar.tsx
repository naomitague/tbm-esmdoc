'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { ArrowLeft, ArrowRight, ChevronDown, ChevronUp, Map, X } from 'lucide-react';
import { useTours } from '@/components/TourProvider';

/**
 * The tour bar: pinned to the bottom of the viewport for as long as a tour is
 * active, on every route — including `/wiki/[slug]`, which renders its own
 * header and no Navbar. It carries the current step's instructions while the
 * reader is on the real page the step is about, which is the whole point: the
 * tours ask you to go and look at things, so the tour has to come along.
 */
export function TourBar() {
  const { activeTour, active, goTo, exit } = useTours();
  const [expanded, setExpanded] = useState(true);

  // Marks the page while the bar is up, so fixed page furniture (the wiki
  // sidebar's floating button) can move clear of it.
  useEffect(() => {
    document.body.classList.add('tour-active');
    return () => document.body.classList.remove('tour-active');
  }, []);

  if (!activeTour || !active) return null;

  const total = activeTour.steps.length;
  const step = activeTour.steps.find(s => s.index === active.step) ?? activeTour.steps[0];
  if (!step) return null;

  const hasPrev = step.index > 1;
  const hasNext = step.index < total;

  return (
    // The spacer keeps the bar from covering the end of a long page.
    <>
      <div aria-hidden className={expanded ? 'h-44 sm:h-32' : 'h-14'} />

      <div className="fixed inset-x-0 bottom-0 z-[60] border-t border-stone-300 bg-white shadow-[0_-2px_12px_rgba(0,0,0,0.06)]">
        <div className="mx-auto max-w-7xl px-4 py-2.5">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-stone-500">
                <Link
                  href={`/tours/${activeTour.id}`}
                  className="inline-flex items-center gap-1.5 font-medium text-primary hover:underline"
                >
                  <Map className="h-3.5 w-3.5" strokeWidth={1.5} />
                  {activeTour.title}
                </Link>
                <span aria-hidden>·</span>
                <span>
                  Step {step.index} of {total}
                </span>
              </div>

              <div className="mt-0.5 truncate font-medium text-stone-900">{step.title}</div>

              {expanded && (
                <div className="mt-1 space-y-1 text-sm">
                  {step.do && (
                    <p className="text-stone-700">
                      <span className="font-medium text-stone-900">Do: </span>
                      {step.do}
                    </p>
                  )}
                  {step.notice && (
                    <p className="text-stone-600">
                      <span className="font-medium text-stone-900">Notice: </span>
                      {step.notice}
                    </p>
                  )}
                </div>
              )}
            </div>

            <div className="flex flex-shrink-0 items-center gap-1.5">
              <button
                type="button"
                onClick={() => setExpanded(v => !v)}
                aria-label={expanded ? 'Collapse tour instructions' : 'Expand tour instructions'}
                className="rounded-md p-1.5 text-stone-400 hover:bg-stone-100 hover:text-stone-700"
              >
                {expanded ? <ChevronDown className="h-4 w-4" strokeWidth={1.5} /> : <ChevronUp className="h-4 w-4" strokeWidth={1.5} />}
              </button>
              <button
                type="button"
                onClick={exit}
                aria-label="Exit tour"
                className="rounded-md p-1.5 text-stone-400 hover:bg-stone-100 hover:text-stone-700"
              >
                <X className="h-4 w-4" strokeWidth={1.5} />
              </button>
            </div>
          </div>

          <div className="mt-2 flex items-center justify-between gap-3">
            <div className="flex items-center gap-1.5" aria-hidden>
              {activeTour.steps.map(s => (
                <span
                  key={s.index}
                  className={`h-1.5 rounded-full transition-all ${
                    s.index === step.index ? 'w-5 bg-primary' : 'w-1.5 bg-stone-300'
                  }`}
                />
              ))}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => goTo(step.index - 1)}
                disabled={!hasPrev}
                className="inline-flex items-center gap-1.5 rounded-md border border-stone-300 px-2.5 py-1.5 text-sm font-medium text-stone-700 transition-colors hover:bg-stone-100 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ArrowLeft className="h-4 w-4" strokeWidth={1.5} />
                Prev
              </button>
              {hasNext ? (
                <button
                  type="button"
                  onClick={() => goTo(step.index + 1)}
                  className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-primary-dark"
                >
                  Next
                  <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
                </button>
              ) : (
                <Link
                  href={`/tours/${activeTour.id}#what_you_leave_with`}
                  className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-primary-dark"
                >
                  Finish
                  <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
