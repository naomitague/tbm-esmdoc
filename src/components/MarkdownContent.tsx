'use client';

import { useEffect, useRef } from 'react';
import { remark } from 'remark';
import gfm from 'remark-gfm';
import remarkMath from 'remark-math';
import remarkRehype from 'remark-rehype';
import rehypeKatex from 'rehype-katex';
import rehypeStringify from 'rehype-stringify';

interface MarkdownContentProps {
  content: string;
}

export function MarkdownContent({ content }: MarkdownContentProps) {
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function processMarkdown() {
      if (!contentRef.current) return;

      // Normalize common LaTeX delimiters used in documentation to remark-math-compatible delimiters
      const normalizedContent = content
        .replace(/\\\[\s*([\s\S]*?)\s*\\\]/g, (_, expr) => `$$${expr}$$`)
        .replace(/\\\(\s*([\s\S]*?)\s*\\\)/g, (_, expr) => `$${expr}$`);

      try {
        const processed = await remark()
          .use(gfm)
          .use(remarkMath)
          .use(remarkRehype)
          .use(rehypeKatex)
          .use(rehypeStringify)
          .process(normalizedContent);

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
