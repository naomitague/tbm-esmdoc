'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { TourSummary } from '@/types';
import { stepHref } from '@/lib/tourLinks';
import { TourBar } from '@/components/TourBar';

/**
 * How the active tour travels with the reader.
 *
 * A tour's steps send the reader onto the real pages and tell them to click
 * things there ("Click **Water Model**"), so the tour can't live in the URL
 * alone — the first in-page link would drop the query string and the tour
 * would vanish mid-walkthrough. The URL is therefore only the entry point
 * (`?tour=…&step=…`, which makes every step linkable and shareable) while
 * sessionStorage is what keeps the tour active across ordinary navigation.
 */
const STORAGE_KEY = 'tour.active';

export interface ActiveTour {
  tourId: string;
  step: number;
}

interface TourContextValue {
  tours: TourSummary[];
  active: ActiveTour | null;
  /** The tour being walked, resolved from `active`. */
  activeTour: TourSummary | null;
  start: (tourId: string, step?: number) => void;
  goTo: (step: number) => void;
  exit: () => void;
}

const TourContext = createContext<TourContextValue>({
  tours: [],
  active: null,
  activeTour: null,
  start: () => {},
  goTo: () => {},
  exit: () => {},
});

export function useTours() {
  return useContext(TourContext);
}

export function TourProvider({ tours, children }: { tours: TourSummary[]; children: React.ReactNode }) {
  const [active, setActive] = useState<ActiveTour | null>(null);
  const router = useRouter();

  // Restore a tour the reader is part-way through. Runs once, after mount, so
  // nothing here can affect the server-rendered HTML.
  useEffect(() => {
    try {
      const stored = sessionStorage.getItem(STORAGE_KEY);
      if (stored) setActive(JSON.parse(stored) as ActiveTour);
    } catch {
      // Private browsing or blocked storage: the tour just won't persist.
    }
  }, []);

  const persist = useCallback((next: ActiveTour | null) => {
    setActive(next);
    try {
      if (next) sessionStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      else sessionStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ignore — the in-memory state still drives this page view.
    }
  }, []);

  const activeTour = useMemo(
    () => (active ? tours.find(tour => tour.id === active.tourId) ?? null : null),
    [tours, active]
  );

  const start = useCallback(
    (tourId: string, step = 1) => {
      const tour = tours.find(t => t.id === tourId);
      if (!tour) return;
      const target = tour.steps.find(s => s.index === step) ?? tour.steps[0];
      persist({ tourId, step: target?.index ?? 1 });
      router.push(stepHref(target?.href, tourId, target?.index ?? 1));
    },
    [tours, persist, router]
  );

  const goTo = useCallback(
    (step: number) => {
      if (!active || !activeTour) return;
      const target = activeTour.steps.find(s => s.index === step);
      if (!target) return;
      persist({ tourId: active.tourId, step });
      router.push(stepHref(target.href, active.tourId, step));
    },
    [active, activeTour, persist, router]
  );

  const exit = useCallback(() => {
    persist(null);
    // Drop ?tour/&step so a reload (or a shared link) doesn't restart it.
    const url = new URL(window.location.href);
    if (url.searchParams.has('tour') || url.searchParams.has('step')) {
      url.searchParams.delete('tour');
      url.searchParams.delete('step');
      router.replace(`${url.pathname}${url.search}${url.hash}`);
    }
  }, [persist, router]);

  const value = useMemo(
    () => ({ tours, active, activeTour, start, goTo, exit }),
    [tours, active, activeTour, start, goTo, exit]
  );

  return (
    <TourContext.Provider value={value}>
      {children}
      {/* useSearchParams must sit inside Suspense: this provider wraps every
          route from the root layout, and an unguarded read would opt the whole
          site out of static rendering. */}
      <Suspense fallback={null}>
        <TourUrlSync onSync={persist} />
      </Suspense>
      {activeTour && <TourBar />}
    </TourContext.Provider>
  );
}

/**
 * Entering (or jumping within) a tour by URL: `?tour=reviewer&step=3`, which
 * is what the tour page's own links carry. Ordinary navigation afterwards
 * drops those params, and that's fine — sessionStorage holds the tour.
 */
function TourUrlSync({ onSync }: { onSync: (active: ActiveTour) => void }) {
  const searchParams = useSearchParams();
  const tourId = searchParams.get('tour');
  const step = Number(searchParams.get('step'));

  useEffect(() => {
    if (!tourId || !Number.isFinite(step) || step < 1) return;
    onSync({ tourId, step });
  }, [tourId, step, onSync]);

  return null;
}
