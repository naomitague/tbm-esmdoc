import katex from 'katex';

function renderSegment(part: string, key: number) {
  const isBlock = part.startsWith('$$') && part.endsWith('$$') && part.length > 3;
  const isInline = !isBlock && part.startsWith('$') && part.endsWith('$') && part.length > 1;

  if (!isBlock && !isInline) {
    return part;
  }

  const expr = isBlock ? part.slice(2, -2) : part.slice(1, -1);

  try {
    const html = katex.renderToString(expr, {
      throwOnError: false,
      displayMode: isBlock,
    });
    return <span key={key} dangerouslySetInnerHTML={{ __html: html }} />;
  } catch {
    return part;
  }
}

/**
 * Renders plain strings (page titles, nav labels, breadcrumbs) that may contain
 * inline ($...$) or display ($$...$$) LaTeX pulled out of markdown via regex,
 * so math symbols show up outside the main MarkdownContent pipeline too.
 */
export function MathText({ text }: { text: string }) {
  if (!text || !text.includes('$')) {
    return <>{text}</>;
  }

  const parts = text.split(/(\$\$[^$]+\$\$|\$[^$]+\$)/g);

  return <>{parts.map((part, i) => renderSegment(part, i))}</>;
}
