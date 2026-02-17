'use client';

import { useEffect, useRef } from 'react';
import { remark } from 'remark';
import html from 'remark-html';
import gfm from 'remark-gfm';

interface MarkdownContentProps {
  content: string;
}

export function MarkdownContent({ content }: MarkdownContentProps) {
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function processMarkdown() {
      if (!contentRef.current) return;

      try {
        const processed = await remark()
          .use(gfm)
          .use(html, { sanitize: false })
          .process(content);

        let htmlString = processed.toString();

        // Clean up any leftover markdown heading symbols that weren't processed
        // This handles edge cases where headings use non-standard formatting
        htmlString = htmlString.replace(
          /^(#{1,6})\s+(.+)$/gm,
          (match, hashes, text) => {
            const level = hashes.length;
            return `<h${level}>${text.trim()}</h${level}>`;
          }
        );

        contentRef.current.innerHTML = htmlString;

        // Add IDs to headings for navigation
        const headings = contentRef.current.querySelectorAll('h1, h2, h3, h4, h5, h6');
        headings.forEach(heading => {
          const id = heading.textContent?.toLowerCase().replace(/\s+/g, '_') || '';
          heading.id = id;
        });
      } catch (error) {
        console.error('Error processing markdown:', error);
        contentRef.current.textContent = content;
      }
    }

    processMarkdown();
  }, [content]);

  return <div ref={contentRef} className="wiki-content" />;
}
