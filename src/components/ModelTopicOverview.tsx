'use client';

import { useState } from 'react';
import { MarkdownContent } from '@/components/MarkdownContent';
import { RelationshipsPanel } from '@/components/RelationshipsPanel';
import { MarkdownWithDiagram, ProcessCoveragePanel, ProcessDiagram } from '@/components/ProcessDiagram';
import type { RelationshipOfInterest } from '@/lib/topics';
import { ProcessDiagramData } from '@/types';

interface ModelTopicOverviewProps {
  content: string;
  relationships: RelationshipOfInterest[];
  /** From the model index's `process_diagram` frontmatter; spliced in after its heading. */
  diagram?: ProcessDiagramData | null;
}

/**
 * Model overview layout: the process diagram and conceptual-picture content
 * (left, three of the page's four columns so the figure reads at a useful
 * size) beside a "Relationships of interest" panel (right). Clicking a
 * process-diagram box with no single page to open shows its per-ESM coverage
 * in the same sidebar, above the relationships panel.
 */
export function ModelTopicOverview({ content, relationships, diagram }: ModelTopicOverviewProps) {
  const [selectedModel, setSelectedModel] = useState<string | null>(null);
  const [selectedProcessIds, setSelectedProcessIds] = useState<string[] | null>(null);

  return (
    <>
      <div className="lg:col-span-3">
        <div className="bg-white rounded-lg border border-stone-200 p-6 wiki-content">
          {diagram ? (
            <MarkdownWithDiagram content={content} heading={diagram.heading}>
              <ProcessDiagram
                data={diagram}
                selectedModel={selectedModel}
                onSelectModel={setSelectedModel}
                selectedIds={selectedProcessIds}
                onSelectIds={setSelectedProcessIds}
              />
            </MarkdownWithDiagram>
          ) : (
            <MarkdownContent content={content} />
          )}
        </div>
      </div>

      <div className="lg:col-span-1 space-y-5">
        {diagram && selectedProcessIds && (
          <div className="lg:sticky lg:top-4 z-10">
            <ProcessCoveragePanel
              data={diagram}
              ids={selectedProcessIds}
              selectedModel={selectedModel}
              onClose={() => setSelectedProcessIds(null)}
            />
          </div>
        )}
        <RelationshipsPanel relationships={relationships} />
      </div>
    </>
  );
}
