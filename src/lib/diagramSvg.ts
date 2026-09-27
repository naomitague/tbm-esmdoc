import fs from 'fs';
import path from 'path';

/**
 * Label text in the exported figures is sized for a full-page figure; inside a
 * page column it scales down with the SVG and lands too small to read
 * comfortably, so every `font-size` is bumped by this factor as the markup is
 * read. Applied here rather than in the SVGs so it survives a figure being
 * regenerated. How far it can go is per-figure — the ceiling is that figure's
 * tightest box, and text that overflows its box just runs over the stroke with
 * no warning. The default suits the full model diagrams, whose tightest box
 * (hydrology's "Impervious surface, constructed drainage") has ~25% slack; a
 * figure with more room can raise it (see `concept_diagram.text_scale`).
 */
export const TEXT_SCALE = 1.15;

const scaled = (size: string, textScale: number) => Math.round(Number(size) * textScale * 100) / 100;

/**
 * Reads one of the `figures/*.svg` diagrams into inline-able markup, shared by
 * the model-overview process diagram and the concept diagrams on pattern
 * pages: strips the content-credential blob, drops the fixed pixel size so the
 * figure scales to its column, and scales the label text. Returns null if the
 * file is missing, so a page falls back to plain markdown the same way a
 * mismatched heading does.
 */
export function readDiagramSvg(relativePath: string, textScale: number = TEXT_SCALE): string | null {
  const svgPath = path.join(process.cwd(), relativePath);
  if (!fs.existsSync(svgPath)) return null;

  return fs
    .readFileSync(svgPath, 'utf8')
    // Content-credential blob (several KB of base64) — no use to the browser.
    .replace(/<metadata>[\s\S]*?<\/metadata>/g, '')
    .replace(/<svg\b([^>]*)>/, (_match, attrs: string) =>
      `<svg${attrs.replace(/\s(?:width|height|xmlns:c2pa)="[^"]*"/g, '')}>`
    )
    .replace(/font-size="([\d.]+)"/g, (_match, size: string) =>
      `font-size="${scaled(size, textScale)}"`
    )
    // Figures that size their labels through a <style> block of classes rather
    // than per-element attributes (vegetation_hydrology_flow.svg) — both forms
    // are in use, so both have to be scaled or the bump silently misses most
    // of the text.
    .replace(/font-size:\s*([\d.]+)px/g, (_match, size: string) =>
      `font-size: ${scaled(size, textScale)}px`
    );
}
