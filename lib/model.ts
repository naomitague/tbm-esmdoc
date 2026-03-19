import fs from 'fs'
import path from 'path'

type Item = {
  type: 'processes' | 'parameters' | 'observations'
  title: string
  slug: string
  excerpt: string
  filePath: string
}

function slugFromName(name: string) {
  return name
    .replace(/\.md$/i, '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9\-]/g, '')
}

export async function extractConceptualSection(modelName: string) {
  const idx = path.join(process.cwd(), 'models', modelName, 'index.md')
  try {
    const txt = await fs.promises.readFile(idx, 'utf8')
    // look for an H2 heading that mentions 'Conceptual'
    const re = /^(#{2,3})\s*(Conceptual[^\n]*)[\s\S]*?(?=^#{2,3}\s|\z)/gim
    const m = re.exec(txt)
    if (m) return m[0]
    // fallback: look for first H2 and return first section
    const re2 = /^(#{2,3}[^\n]*\n)([\s\S]*?)(?=^#{2,3}\s|\z)/gim
    const m2 = re2.exec(txt)
    if (m2) return m2[0]
    return txt
  } catch (e) {
    return null
  }
}

export async function listModelItems(modelName: string): Promise<Record<string, Item[]>> {
  const base = path.join(process.cwd(), 'models', modelName)
  const types: Array<{dir: string; key: Item['type']}> = [
    {dir: 'processes', key: 'processes'},
    {dir: 'parameters', key: 'parameters'},
    {dir: 'observations', key: 'observations'},
  ]
  const out: Record<string, Item[]> = {processes: [], parameters: [], observations: []}
  for (const t of types) {
    const dir = path.join(base, t.dir)
    try {
      const files = await fs.promises.readdir(dir)
      for (const f of files) {
        if (!/\.md$/i.test(f)) continue
        const filePath = path.join(dir, f)
        let content = ''
        try {
          content = await fs.promises.readFile(filePath, 'utf8')
        } catch (e) {
          continue
        }
        const titleMatch = content.match(/^#\s+(.+)$/m)
        const title = titleMatch ? titleMatch[1].trim() : f.replace(/\.md$/i, '')
        // excerpt: first non-empty paragraph (not a heading)
        const paraMatch = content.split(/\r?\n/).reduce((acc, line) => {
          if (acc.found) return acc
          const trimmed = line.trim()
          if (!trimmed) return acc
          if (/^#{1,6}\s/.test(trimmed)) return acc
          return {found: true, text: trimmed}
        }, {found: false, text: '' as string} as {found: boolean; text: string})
        const excerpt = paraMatch.text || ''
        out[t.key].push({type: t.key, title, slug: slugFromName(f), excerpt, filePath})
      }
      // sort by title
      out[t.key].sort((a, b) => a.title.localeCompare(b.title))
    } catch (e) {
      // ignore missing directories
    }
  }
  return out
}

export default {
  extractConceptualSection,
  listModelItems,
}
