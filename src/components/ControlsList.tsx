import { ControlGroup } from '@/lib/controlsList';

/**
 * The controls vocabulary as a grouped reading list (`controls_list:`
 * frontmatter): groups in authored order, each control's prose in full, with
 * its model-link types and evidence count alongside. Server-rendered — there's
 * nothing to interact with here; the filtering lives in the evidence table
 * further down the page.
 *
 * A control with no evidence rows says so rather than being dropped: the gap is
 * part of what the page reports.
 */

const LINK_TYPE_STYLES: Record<string, string> = {
  process: 'border-emerald-700/40 text-emerald-800 bg-emerald-50',
  parameter: 'border-blue-700/40 text-blue-800 bg-blue-50',
  structure: 'border-purple-700/40 text-purple-800 bg-purple-50',
  dynamics: 'border-orange-700/40 text-orange-800 bg-orange-50',
  scenario: 'border-stone-400 text-stone-700 bg-stone-100',
  forcing_scenario: 'border-stone-400 text-stone-600 bg-stone-50 italic',
};

const LINK_TYPE_TITLES: Record<string, string> = {
  process: 'A process the model must simulate',
  parameter: 'A parameter the model must carry',
  structure: 'A question about how the model is discretized',
  dynamics: 'Requires prognostic, time-evolving vegetation',
  scenario: 'Set by how the experiment is configured',
  forcing_scenario: 'About experiment design, not model coverage',
};

function LinkTypeBadge({ type }: { type: string }) {
  return (
    <span
      title={LINK_TYPE_TITLES[type] ?? type}
      className={`rounded border px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide ${
        LINK_TYPE_STYLES[type] ?? 'border-stone-300 text-stone-600 bg-stone-50'
      }`}
    >
      {type.replace(/_/g, ' ')}
    </span>
  );
}

/** Stable anchor for a group heading, so the summary above can jump to it. */
function groupId(name: string): string {
  return `controls-${name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}`;
}

export function ControlsList({ groups, evidenceHref }: { groups: ControlGroup[]; evidenceHref?: string }) {
  if (groups.length === 0) return null;

  const total = groups.reduce((sum, group) => sum + group.controls.length, 0);

  return (
    <div className="my-5 not-prose">
      <p className="mb-3 text-xs text-stone-500">
        {total} controls in {groups.length} groups. Badges say what a model would have to represent to capture the
        control; counts link to the studies behind it.
      </p>

      {/* The full list runs long, so it opens with its own contents: the groups
          in reading order, each jumping to its section. */}
      <nav aria-label="Control groups" className="mb-7 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {groups.map(group => {
          const studies = group.controls.reduce((sum, control) => sum + control.evidenceCount, 0);
          return (
            <a
              key={group.name}
              href={`#${groupId(group.name)}`}
              className="group flex items-baseline justify-between gap-3 rounded border border-stone-200 bg-white px-3 py-2 no-underline transition-colors hover:border-primary hover:bg-primary-light"
            >
              <span className="text-sm font-medium text-stone-800 group-hover:text-primary">{group.name}</span>
              <span className="whitespace-nowrap text-[11px] text-stone-500">
                {group.controls.length} · {studies} stud{studies === 1 ? 'y' : 'ies'}
              </span>
            </a>
          );
        })}
      </nav>

      <div className="space-y-7">
        {groups.map(group => (
          <section key={group.name} id={groupId(group.name)} className="scroll-mt-20">
            <h3 className="mb-3 border-b border-stone-200 pb-1.5 font-heading text-lg text-stone-900">
              {group.name}
            </h3>

            <div className="space-y-4">
              {group.controls.map(control => (
                <article key={control.id} className="border-l-2 border-stone-200 pl-4">
                  <div className="flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
                    <h4 className="font-medium text-stone-900">{control.label}</h4>
                    {control.modelLinkTypes.map(type => (
                      <LinkTypeBadge key={type} type={type} />
                    ))}
                  </div>

                  <p className="mt-1 text-sm text-stone-700">{control.definition}</p>

                  {control.whyItMatters && (
                    <p className="mt-1.5 text-sm text-stone-600">
                      <span className="font-medium text-stone-700">Why it matters — </span>
                      {control.whyItMatters}
                    </p>
                  )}

                  {control.modelRepresentationNeeded && (
                    <p className="mt-1.5 text-xs text-stone-500">
                      <span className="font-medium">A model needs: </span>
                      {control.modelRepresentationNeeded}
                    </p>
                  )}

                  <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
                    {control.evidenceCount > 0 ? (
                      evidenceHref ? (
                        <a href={evidenceHref} className="text-primary hover:underline">
                          {control.evidenceCount} stud{control.evidenceCount === 1 ? 'y' : 'ies'}
                        </a>
                      ) : (
                        <span className="text-stone-600">
                          {control.evidenceCount} stud{control.evidenceCount === 1 ? 'y' : 'ies'}
                        </span>
                      )
                    ) : (
                      <span className="text-stone-400 italic">No evidence rows yet</span>
                    )}

                    {control.conceptMapNodes.length > 0 && (
                      <span className="text-stone-400">
                        Concept map: {control.conceptMapNodes.join(', ')}
                      </span>
                    )}

                    {control.processIdStatus === 'needs_new_id' && (
                      <span className="text-amber-700" title="No registry id captures this yet — see the model-link section">
                        needs a new process id
                      </span>
                    )}
                  </div>

                  {control.processIds.length > 0 && (
                    <p className="mt-1 font-mono text-[10.5px] leading-relaxed text-stone-400">
                      {control.processIds.join(' · ')}
                    </p>
                  )}
                </article>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
