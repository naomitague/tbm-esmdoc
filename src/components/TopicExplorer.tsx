'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { Search, ChevronLeft } from 'lucide-react';
import { TopicGroup, TopicLinkItem, TopicIndex } from '@/lib/topics';

interface TopicExplorerProps {
  index: TopicIndex;
  selectedTopic: string | null;
  onSelectTopic: (topic: string | null) => void;
  highlightedSlug?: string | null;
}

function formatTopic(topic: string): string {
  return topic.replace(/_/g, ' ');
}

function LinkList({
  items,
  emptyLabel,
  highlightedSlug,
}: {
  items: TopicLinkItem[];
  emptyLabel: string;
  highlightedSlug?: string | null;
}) {
  if (items.length === 0) {
    return <p className="text-xs text-stone-400 italic">{emptyLabel}</p>;
  }
  return (
    <ul className="space-y-1">
      {items.map(item => {
        const isHighlighted = item.slug === highlightedSlug;
        return (
          <li key={item.href}>
            <Link
              href={item.href}
              className={`text-sm hover:underline block py-0.5 px-1.5 -mx-1.5 rounded-md capitalize ${
                isHighlighted ? 'bg-primary-light text-primary font-medium' : 'text-primary'
              }`}
            >
              {formatTopic(item.title)}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

function TopicsCard({
  topics,
  selectedTopic,
  onSelectTopic,
  highlightedSlug,
}: {
  topics: TopicGroup[];
  selectedTopic: string | null;
  onSelectTopic: (topic: string | null) => void;
  highlightedSlug?: string | null;
}) {
  const [query, setQuery] = useState('');

  const filteredTopics = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return topics;
    return topics.filter(g => formatTopic(g.topic).toLowerCase().includes(q));
  }, [topics, query]);

  const selected = selectedTopic ? topics.find(g => g.topic === selectedTopic) ?? null : null;

  if (selected) {
    return (
      <div className="bg-white rounded-lg border border-stone-200 p-5">
        <button
          onClick={() => onSelectTopic(null)}
          className="flex items-center gap-1 text-xs text-stone-500 hover:text-primary mb-3"
        >
          <ChevronLeft className="w-3.5 h-3.5" strokeWidth={1.5} />
          All topics
        </button>

        <h3 className="font-heading text-base mb-4 capitalize">{formatTopic(selected.topic)}</h3>

        <div className="space-y-4">
          <div>
            <h4 className="text-xs uppercase tracking-wide text-stone-400 mb-1.5 flex items-center gap-2">
              <span className="badge badge-flux">Model</span>
              Models
            </h4>
            <LinkList items={selected.models} emptyLabel="No model pages tagged yet" highlightedSlug={highlightedSlug} />
          </div>

          <div>
            <h4 className="text-xs uppercase tracking-wide text-stone-400 mb-1.5 flex items-center gap-2">
              <span className="badge badge-observation">Obs</span>
              Observations
            </h4>
            <LinkList items={selected.observations} emptyLabel="No observation pages tagged yet" />
          </div>

          <div>
            <h4 className="text-xs uppercase tracking-wide text-stone-400 mb-1.5 flex items-center gap-2">
              <span className="badge badge-pattern">Pattern</span>
              Patterns
            </h4>
            <LinkList items={selected.patterns} emptyLabel="No patterns tagged yet" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-stone-200 p-5">
      <div className="relative mb-3">
        <Search className="w-4 h-4 text-stone-400 absolute left-2.5 top-1/2 -translate-y-1/2" strokeWidth={1.5} />
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search a topic..."
          className="w-full pl-8 pr-3 py-1.5 text-sm border border-stone-200 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
        />
      </div>

      <h3 className="font-heading text-base mb-2">Topics</h3>
      {filteredTopics.length === 0 ? (
        <p className="text-xs text-stone-400 italic">No topics match &ldquo;{query}&rdquo;</p>
      ) : (
        <ul className="space-y-0.5">
          {filteredTopics.map(g => (
            <li key={g.topic}>
              <button
                onClick={() => onSelectTopic(g.topic)}
                className="nav-item w-full text-left text-sm capitalize"
              >
                {formatTopic(g.topic)}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export function TopicExplorer({ index, selectedTopic, onSelectTopic, highlightedSlug }: TopicExplorerProps) {
  return (
    <>
      <TopicsCard
        topics={index.topics}
        selectedTopic={selectedTopic}
        onSelectTopic={onSelectTopic}
        highlightedSlug={highlightedSlug}
      />

      <div className="bg-white rounded-lg border border-stone-200 p-5">
        <h3 className="font-heading text-base mb-3 flex items-center gap-2">
          <span className="badge badge-relationship">Rel.</span>
          Relationships of interest
        </h3>
        <LinkList items={index.relationships} emptyLabel="No relationships tagged yet" />
      </div>
    </>
  );
}
