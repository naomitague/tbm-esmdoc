'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ResolvedSynthesisLink, SYNTHESIS_SCALES } from '@/types';

/** Short ladder labels — the sidebar is too narrow for "region/continent". */
const SCALE_LABELS: Record<string, string> = {
  plant: 'Plant',
  stand: 'Stand',
  hillslope: 'Hillslope',
  watershed: 'Watershed',
  'region/continent': 'Region',
  global: 'Global',
};

const SCALE_TITLES: Record<string, string> = { ...SCALE_LABELS, 'region/continent': 'Region / continent' };

function covers(link: ResolvedSynthesisLink, scale: number): boolean {
  return link.scaleRange !== null && link.scaleRange[0] <= scale && scale <= link.scaleRange[1];
}

function rangeText(range: [number, number] | null): string {
  if (!range) return 'Scale not set';
  const [low, high] = range.map(i => SCALE_TITLES[SYNTHESIS_SCALES[i]]);
  return low === high ? low : `${low} – ${high}`;
}

/**
 * A relationship hub's synthesis pages (`synthesis_links:`) beside a vertical
 * scale ladder, global at the top, plant at the bottom. Each step on the
 * ladder has one of three looks: greyed out (no synthesis page at that scale
 * yet), available, or selected. Selecting a step highlights the pages that
 * work at that scale and dims the rest; hovering a page previews its range on
 * the ladder. Meant to make "synthesis depends on scale" visible at a glance.
 */
export function SynthesisScaleLinks({ title, links }: { title: string; links: ResolvedSynthesisLink[] }) {
  const [selected, setSelected] = useState<number | null>(null);
  const [hovered, setHovered] = useState<ResolvedSynthesisLink | null>(null);

  if (links.length === 0) return null;

  // Global at the top: larger scales read as "up".
  const ladder = SYNTHESIS_SCALES.map((scale, index) => ({ scale, index })).reverse();

  return (
    <div className="-mx-2 rounded-md bg-primary-50 px-2 py-2.5">
      <h3 className="text-xs font-semibold uppercase tracking-wide text-primary mb-2">{title}</h3>
      <div className="flex gap-3">
        <div role="group" aria-label="Spatial scale" className="relative flex-shrink-0 self-start">
          {/* The ladder's rail, running between the first and last dot centers. */}
          <div className="absolute left-[5px] top-3 bottom-3 w-0.5 bg-stone-200" aria-hidden="true" />
          <ul className="relative">
            {ladder.map(({ scale, index }) => {
              const available = links.some(link => covers(link, index));
              const isSelected = selected === index;
              const isPreviewed = hovered !== null && covers(hovered, index);
              const dot = isSelected
                ? 'border-primary bg-primary'
                : available
                  ? 'border-primary bg-primary-light'
                  : 'border-stone-200 bg-white';
              const label = isSelected
                ? 'text-primary font-medium'
                : available
                  ? 'text-stone-700'
                  : 'text-stone-300';

              return (
                <li key={scale}>
                  <button
                    type="button"
                    disabled={!available}
                    aria-pressed={isSelected}
                    title={
                      available
                        ? `${SCALE_TITLES[scale]}: highlight syntheses at this scale`
                        : `${SCALE_TITLES[scale]}: no synthesis pages at this scale yet`
                    }
                    onClick={() => setSelected(isSelected ? null : index)}
                    className="group flex items-center gap-2 py-1 text-xs disabled:cursor-default"
                  >
                    <span
                      className={`h-3 w-3 flex-shrink-0 rounded-full border-2 transition-colors ${dot} ${
                        isPreviewed ? 'ring-2 ring-primary/30' : ''
                      } ${available && !isSelected ? 'group-hover:bg-primary/40' : ''}`}
                    />
                    <span className={`transition-colors ${label}`}>{SCALE_LABELS[scale]}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        <ul className="min-w-0 flex-1 space-y-1.5">
          {links.map(link => {
            const match = selected !== null && covers(link, selected);
            const dimmed = selected !== null && !match;
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onMouseEnter={() => setHovered(link)}
                  onMouseLeave={() => setHovered(null)}
                  onFocus={() => setHovered(link)}
                  onBlur={() => setHovered(null)}
                  className={`block rounded border px-2 py-1.5 text-sm no-underline transition-all hover:border-primary hover:bg-primary-light hover:text-primary ${
                    match ? 'border-primary bg-primary-light text-primary' : 'border-stone-200 bg-white text-stone-700'
                  } ${dimmed ? 'opacity-40' : ''}`}
                >
                  <span className="block leading-snug">{link.label}</span>
                  <span className="mt-0.5 block text-xs text-stone-500">{rangeText(link.scaleRange)}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
      <p className="mt-2 text-[11px] leading-snug text-stone-500">
        Pick a scale to highlight its syntheses. Grey scales have none yet.
      </p>
    </div>
  );
}
