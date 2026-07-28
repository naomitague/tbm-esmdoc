'use client';

import Link from 'next/link';
import { ModelConnection } from '@/types';

interface ConnectionGraphProps {
  slug: string;
  title: string;
  incoming: ModelConnection[];
  outgoing: ModelConnection[];
}

/** A note can wikilink the same target more than once (e.g. overstory and understory transpiration both link to process_transpiration) — that's the same edge, so collapse repeats rather than rendering/keying duplicates. */
function dedupeConnections<T extends { type: string }>(connections: T[], keyOf: (conn: T) => string): T[] {
  const seen = new Set<string>();
  const result: T[] = [];
  for (const conn of connections) {
    const key = keyOf(conn);
    if (seen.has(key)) continue;
    seen.add(key);
    result.push(conn);
  }
  return result;
}

export function ConnectionGraph({ incoming, outgoing }: ConnectionGraphProps) {
  if (incoming.length === 0 && outgoing.length === 0) {
    return null;
  }

  const dedupedOutgoing = dedupeConnections(outgoing, conn => `${conn.target}-${conn.type}`);
  const dedupedIncoming = dedupeConnections(incoming, conn => `${conn.source}-${conn.type}`);

  return (
    <div className="bg-white rounded-lg border border-stone-200 p-5">
      <h2 className="text-lg font-semibold mb-3">Connections</h2>

      {dedupedOutgoing.length > 0 && (
        <div className="mb-4">
          <h3 className="text-sm font-semibold mb-2">Uses</h3>
          <ul className="space-y-1">
            {dedupedOutgoing.map(conn => (
              <li key={`${conn.target}-${conn.type}`}>
                <Link
                  href={`/wiki/${conn.target}`}
                  className="text-sm text-primary hover:underline"
                >
                  {conn.target.replace(/_/g, ' ')}
                </Link>
                <span className="text-xs text-stone-400 ml-2">({conn.type})</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {dedupedIncoming.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold mb-2">Used by</h3>
          <ul className="space-y-1">
            {dedupedIncoming.map(conn => (
              <li key={`${conn.source}-${conn.type}`}>
                <Link
                  href={`/wiki/${conn.source}`}
                  className="text-sm text-primary hover:underline"
                >
                  {conn.source.replace(/_/g, ' ')}
                </Link>
                <span className="text-xs text-stone-400 ml-2">({conn.type})</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
