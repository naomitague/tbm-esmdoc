import Link from 'next/link';
import { Compass } from 'lucide-react';

/**
 * Method guides that apply to pattern pages generally, rather than to one
 * variable — shown as a small box at the top of the right-hand column on
 * every `kind: pattern` note (see src/app/wiki/[slug]/page.tsx).
 *
 * These are ordinary vault notes under model-techniques/, so `href` is just
 * their /wiki slug (filename lowercased, spaces → underscores). Add an entry
 * here to surface another technique note on all pattern pages.
 */
const TECHNIQUE_LINKS: { label: string; href: string; blurb: string }[] = [
  {
    label: 'Space-Time Pattern Comparison',
    href: '/wiki/space-time_pattern_comparison',
    blurb: 'Aggregate measures & disaggregation approaches',
  },
  {
    label: 'Spatial Validation Metrics',
    href: '/wiki/spatial_validation_metrics',
    blurb: 'Point vs. pattern comparison metrics',
  },
];

export function UsefulTechniques() {
  return (
    <div className="bg-stone-50 rounded-lg border border-stone-200 p-4">
      <h2 className="flex items-center gap-1.5 text-sm font-semibold text-stone-700 mb-2.5">
        <Compass className="w-4 h-4 text-primary" strokeWidth={1.5} />
        Useful Techniques
      </h2>
      <ul className="space-y-2.5">
        {TECHNIQUE_LINKS.map(link => (
          <li key={link.href}>
            <Link href={link.href} className="text-sm text-primary hover:underline">
              {link.label}
            </Link>
            <p className="text-xs text-stone-500 mt-0.5">{link.blurb}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
