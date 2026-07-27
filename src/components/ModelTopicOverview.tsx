'use client';

import { useRef, useState } from 'react';
import { MarkdownContent } from '@/components/MarkdownContent';
import { TopicExplorer } from '@/components/TopicExplorer';
import { TopicIndex } from '@/lib/topics';

interface ModelTopicOverviewProps {
  modelSlug: string;
  content: string;
  topicIndex: TopicIndex;
}

/**
 * Ties the model overview's conceptual-picture content (left) to the Topics
 * panel (right): clicking a flux/parameter link there doesn't navigate away —
 * it selects that item's topic in the panel instead, so the reader stays on
 * the overview and just gets the topic breakdown for what they clicked.
 * Items with no `topic` tag (nothing to show in the panel) still navigate
 * normally.
 */
export function ModelTopicOverview({ modelSlug, content, topicIndex }: ModelTopicOverviewProps) {
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [highlightedSlug, setHighlightedSlug] = useState<string | null>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);

  const fluxPrefix = `/models/${modelSlug}/fluxes/`;
  const paramPrefix = `/models/${modelSlug}/parameters/`;

  function handleContentClick(e: React.MouseEvent<HTMLDivElement>) {
    const anchor = (e.target as HTMLElement).closest('a');
    if (!anchor) return;

    const href = anchor.getAttribute('href') || '';
    const slug = href.startsWith(fluxPrefix)
      ? href.slice(fluxPrefix.length)
      : href.startsWith(paramPrefix)
        ? href.slice(paramPrefix.length)
        : null;
    if (!slug) return;

    const topic = topicIndex.itemTopics[slug];
    if (!topic) return;

    e.preventDefault();
    setSelectedTopic(topic);
    setHighlightedSlug(slug);
    sidebarRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  return (
    <>
      <div className="lg:col-span-2">
        <div className="bg-white rounded-lg border border-stone-200 p-8 wiki-content" onClick={handleContentClick}>
          <MarkdownContent content={content} />
        </div>
      </div>

      <div className="lg:col-span-1 space-y-5" ref={sidebarRef}>
        <TopicExplorer
          index={topicIndex}
          selectedTopic={selectedTopic}
          onSelectTopic={topic => {
            setSelectedTopic(topic);
            setHighlightedSlug(null);
          }}
          highlightedSlug={highlightedSlug}
        />
      </div>
    </>
  );
}
