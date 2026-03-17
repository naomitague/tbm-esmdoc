'use client';

import Link from 'next/link';
import { ModelConnection } from '@/types';

interface ConnectionGraphProps {
  slug: string;
  title: string;
  incoming: ModelConnection[];
  outgoing: ModelConnection[];
}

export function ConnectionGraph({ incoming, outgoing }: ConnectionGraphProps) {
  if (incoming.length === 0 && outgoing.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg border border-stone-200 p-5">
      <h2 className="text-lg font-semibold mb-3">Connections</h2>

      {outgoing.length > 0 && (
        <div className="mb-4">
          <h3 className="text-sm font-semibold mb-2">Uses</h3>
          <ul className="space-y-1">
            {outgoing.map(conn => (
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

      {incoming.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold mb-2">Used by</h3>
          <ul className="space-y-1">
            {incoming.map(conn => (
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
