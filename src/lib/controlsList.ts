import { readCsvRows } from '@/lib/csv';
import { ControlsListConfig } from '@/types';

export interface ControlItem {
  id: string;
  label: string;
  definition: string;
  whyItMatters: string;
  modelRepresentationNeeded: string;
  /** `;`-separated in the CSV — `process`, `parameter`, `structure`, `dynamics`, `scenario`, `forcing_scenario`. */
  modelLinkTypes: string[];
  conceptMapNodes: string[];
  processIds: string[];
  processIdStatus: string;
  /** Rows in the evidence CSV naming this control; 0 is meaningful, not missing. */
  evidenceCount: number;
}

export interface ControlGroup {
  name: string;
  controls: ControlItem[];
}

const splitList = (raw: string | undefined): string[] =>
  (raw ?? '')
    .split(';')
    .map(part => part.trim())
    .filter(Boolean);

/**
 * Reads the controls vocabulary into display groups. Column names are fixed by
 * the schema documented in `hydro_controls_README.md`.
 *
 * Group order is taken from the order groups first appear once rows are sorted
 * by `display_order` — the authored sequence, which mirrors the concept map —
 * rather than sorted alphabetically, which would scramble it.
 */
export function readControlGroups(config: ControlsListConfig): ControlGroup[] {
  const rows = readCsvRows(config.csv);
  if (rows.length === 0) return [];

  const evidenceCounts = new Map<string, number>();
  if (config.evidence_csv) {
    readCsvRows(config.evidence_csv).forEach(row => {
      const id = (row.control_id ?? '').trim();
      if (id) evidenceCounts.set(id, (evidenceCounts.get(id) ?? 0) + 1);
    });
  }

  const ordered = [...rows].sort(
    (a, b) => (parseFloat(a.display_order) || 0) - (parseFloat(b.display_order) || 0)
  );

  const groups: ControlGroup[] = [];
  const byName = new Map<string, ControlGroup>();

  ordered.forEach(row => {
    const name = (row.group ?? '').trim() || 'Other';
    let group = byName.get(name);
    if (!group) {
      group = { name, controls: [] };
      byName.set(name, group);
      groups.push(group);
    }

    group.controls.push({
      id: row.control_id,
      label: row.label || row.control_id,
      definition: row.definition ?? '',
      whyItMatters: row.why_it_matters ?? '',
      modelRepresentationNeeded: row.model_representation_needed ?? '',
      modelLinkTypes: splitList(row.model_link_type),
      conceptMapNodes: splitList(row.concept_map_node),
      processIds: splitList(row.process_ids).filter(id => id !== 'TBD'),
      processIdStatus: (row.process_id_status ?? '').trim(),
      evidenceCount: evidenceCounts.get(row.control_id) ?? 0,
    });
  });

  return groups;
}
