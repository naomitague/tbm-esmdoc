'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { Search } from 'lucide-react';
import type { RelationshipOfInterest } from '@/lib/topics';
import { formatTopic } from '@/components/TopicGroupSections';

/**
 * Model overview sidebar: searchable list of the model's top-level
 * relationship pages (see getRelationshipsOfInterest). Search matches titles
 * and topic tags.
 */
export function RelationshipsPanel({ relationships }: { relationships: RelationshipOfInterest[] }) {
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return relationships;
    return relationships.filter(
      r =>
        r.title.toLowerCase().includes(q) ||
        r.topics.some(topic => formatTopic(topic).toLowerCase().includes(q))
    );
  }, [relationships, query]);

  return (
    <div className="bg-white rounded-lg border border-stone-200 p-5">
      <div className="relative mb-3">
        <Search className="w-4 h-4 text-stone-400 absolute left-2.5 top-1/2 -translate-y-1/2" strokeWidth={1.5} />
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search relationships..."
          className="w-full pl-8 pr-3 py-1.5 text-sm border border-stone-200 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
        />
      </div>

      <h3 className="font-heading text-base mb-2">Relationships of interest</h3>
      {relationships.length === 0 ? (
        <p className="text-xs text-stone-400 italic">No relationship pages yet.</p>
      ) : filtered.length === 0 ? (
        <p className="text-xs text-stone-400 italic">No relationships match &ldquo;{query}&rdquo;</p>
      ) : (
        <ul className="space-y-3">
          {filtered.map(r => (
            <li key={r.slug}>
              <Link href={r.href} className="text-sm text-primary hover:underline">
                {r.title}
              </Link>
              {r.topics.length > 0 && (
                <div className="text-xs text-stone-500 mt-0.5">{r.topics.map(formatTopic).join(' · ')}</div>
              )}
              {r.childCount > 0 && (
                <div className="text-xs text-stone-400">
                  {r.childCount} related page{r.childCount === 1 ? '' : 's'}
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
