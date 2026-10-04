/**
 * Where a tour step points, with the tour carried along in the query string.
 *
 * Plain module (no `'use client'`, no `fs`) because both sides need it: the
 * server-rendered tour page builds these links, and the client provider builds
 * them again when stepping. The params are only the *entry* mechanism — once
 * the reader is on the page, the tour is held in sessionStorage, so clicking an
 * ordinary link (which the steps ask them to do) doesn't end the tour.
 */
export function stepHref(href: string | undefined, tourId: string, step: number): string {
  const target = href || `/tours/${tourId}`;
  const [path, hash] = target.split('#');
  const joiner = path.includes('?') ? '&' : '?';
  return `${path}${joiner}tour=${encodeURIComponent(tourId)}&step=${step}${hash ? `#${hash}` : ''}`;
}
