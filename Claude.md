# Project: Environmental Model Wiki (RHESSys / ESM documentation)

## What this project does
A Next.js documentation site that renders a collection of Obsidian-style
markdown notes — biophysical model documentation (fluxes, parameters,
observations), cross-cutting patterns/relationships, and a comparison
registry of Earth System Models — into a browsable, cross-linked wiki with
interactive, CSV-backed tables and charts spliced into specific sections.

## Tech stack
- Package manager: pnpm (single package; `pnpm-workspace.yaml` only sets
  build-approval flags, not a multi-package workspace)
- Language: TypeScript, Next.js 16 (App Router), React 19, Tailwind
- Key dependencies: `gray-matter` (frontmatter), `remark`/`remark-gfm`/
  `remark-math` + `rehype-katex`/`rehype-stringify` (markdown → HTML,
  client-side, in `MarkdownContent.tsx`), `mermaid` (diagrams)

## Project structure
```
models/<domain>/                  # water, carbon, nitrogen, energy
  index.md                        # model overview page
  fluxes/       process_*.md      # one per flux
    tabledata/*.csv                # per-flux ESM method-comparison tables (see esm_table below)
  parameters/   <Name>.md          # one per parameter/state var (no fixed prefix)
  observations/ obs_*.md          # one per observation/output

patterns/<topic>/                 # cross-cutting pattern & relationship pages
  examplepapers/                  # literature-synthesis CSVs + their README backing a topic's patterns
  *.md                            # kind: pattern | relationship (see Tagging protocol below)

esms/                             # shared ESM registry, joined into every esm_table
  esm_model.csv                   # one row per model (RHESSys, ORCHIDEE, CLM, ...)
  esm_model_versions.csv          # one row per model version, FKs into esm_model.csv

specificESMs/<Model>/             # narrative writeups of one specific ESM's implementation
Templates/                        # one template per content type; new notes should follow the
                                   # matching template (e.g. models/water/fluxes/*.md ~ Templates/Flux-Template.md)

src/
  app/
    wiki/[slug]/                  # renders ANY note by slug (patterns, overviews, and also
                                   # fluxes/parameters/observations reachable this way)
    models/[model]/[type]/[slug]/ # renders fluxes/parameters/observations scoped under a model
                                   # — the route the site's own navigation actually uses
  components/                     # UI, notably the CSV-driven ones (Csv*, EsmMethodTable, TrendComparisonExplorer)
  lib/
    markdown.ts                   # parses notes for the /wiki/[slug] route
    models.ts                     # SEPARATE parser for the /models/[model]/[type]/[slug] route — see gotcha below
    csv.ts, csvHistogram.ts, csvScatter.ts, csvTrend.ts, esm.ts   # CSV reading/summarizing helpers
    topics.ts, pageOutline.ts     # tagging index + in-page outline builders
  types/                          # TypeScript definitions, including the frontmatter config shapes below
```

## Obsidian-style content conventions
- **Frontmatter**: YAML, parsed with `gray-matter`. Recognized keys vary by
  note type — see "Tagging protocol" and "Interactive content protocols"
  below for the ones that drive rendering.
- **Wikilinks**: `[[Note Name]]` and `[[Note Name|Alias]]` (alias is display
  text only). Resolved to `/wiki/<slug>` from `markdown.ts`, or to
  `/models/<model>/<fluxes|parameters|observations>/<slug>` from `models.ts`
  when the target is found in that model's own subdirectories (falls back to
  `/wiki/<slug>` otherwise).
- **File naming**: fluxes are `process_*.md`, observations are `obs_*.md`,
  parameters have no fixed prefix. Slugs are the filename (lowercased,
  spaces → underscores); if two files anywhere in the vault share a bare
  slug, `markdown.ts` path-qualifies the losing one (see
  `computeUniqueSlugs`) — prefer distinct filenames over relying on that.
- **Folder structure is significant**: `models/<domain>/{fluxes,parameters,observations}/`
  determines content type and drives both routing and which template a note
  should follow. `patterns/<topic>/` groups pattern/relationship pages by
  topic; `patterns/<topic>/examplepapers/` holds the literature-derived CSVs
  (and a `README.md` documenting that CSV's schema) that back that topic's
  interactive tables/charts.

## Commands
```bash
pnpm install       # install deps
pnpm dev           # start Next dev server at http://localhost:3000
pnpm build         # production build (also type-checks)
pnpm start         # run a production build
pnpm lint          # next lint
```
No test suite exists yet. See `QUICKSTART.md` for local setup from scratch.

## URL structure
```
/                                              # homepage (model gallery)
/models/<model>                                # model overview (water, carbon, nitrogen, energy)
/models/<model>/fluxes/<slug>                  # a flux, scoped under its model
/models/<model>/parameters/<slug>              # a parameter, scoped under its model
/models/<model>/observations/<slug>            # an observation, scoped under its model
/wiki/<slug>                                   # any note by slug — patterns/relationships live only
                                                # here; fluxes/parameters/observations are ALSO reachable
                                                # here (see the dual-parser gotcha below)
/esms                                          # the shared ESM registry (esm_model.csv + versions)
/patterns/et-observations                      # standalone example of a full CSV browsing page (not
                                                # spliced into a note — built as its own route instead)
/about, /profile, /settings                    # mostly placeholder pages
```

## Adding new content

**A flux/parameter/observation to an existing model:**
1. Create `models/<model>/{fluxes,parameters,observations}/<name>.md`, following
   the matching file in `Templates/` (`Flux-Template.md`, `Parameter-Family-Template.md`
   or `Parameter-State-Template.md`, `Observation-Output-Template.md`).
2. Fill in frontmatter, including `topic: [...]` if it should show up in that
   model's Topics panel (see Tagging protocol).
3. It's picked up automatically — no registration step, `getAllModelContent`/
   `getAllContent` scan the directories at request time.

**A new pattern or relationship page:**
1. Create `patterns/<topic>/<name>.md` (new topic → new subfolder; add an
   `examplepapers/` subfolder alongside it if it needs backing CSVs).
2. Set `kind: pattern` or `kind: relationship`, `topic: [...]`, and
   `model: <domain>` in frontmatter (see Tagging protocol).
3. Wire up `histogram_data` / `trend_data` / `esm_table` if it needs
   interactive tables/charts (see below) — remember the heading-text-must-
   match-exactly rule.

**A new model** (e.g. "soil") — three separate places need updating, only one
of which is content:
1. `mkdir -p models/soil/{fluxes,parameters,observations}` and create
   `models/soil/index.md` with `title`, `model: soil`, `description` in
   frontmatter.
2. In `src/lib/models.ts`, add `soil` to the `modelIcons` and `modelColors`
   maps in `getAllModels()` (the color name — `blue`/`green`/`purple`/
   `orange`/a new one — becomes `ModelCard.color`).
3. In `src/app/page.tsx`, add `soil` to its own separate `modelIcons` map
   (slug → actual Lucide icon component — this is what really renders on the
   homepage; `src/lib/models.ts`'s `modelIcons` strings aren't currently
   wired to anything) and, if you used a new color name in step 2, add its
   Tailwind classes to `page.tsx`'s `modelColors` map too, or it'll silently
   fall back to gray.

## Interactive content protocols

Three frontmatter keys splice a live React component into a note's rendered
markdown, positioned right after a specific heading. All three work the same
way under the hood: the target heading text is located in the raw markdown
with a plain string match (`splitAtHeadings` / `splitAtHeading` in the page
components — not an AST match), the markdown is rendered as normal up to and
including that heading, the component is inserted, and the rest of the
markdown renders after it.

**This means the heading string in frontmatter must match the heading in the
note body exactly** — same `#`-level, same text, same punctuation. A
mismatch doesn't error, it just silently falls back to plain rendering with
no visible sign anything was supposed to be there. If a table/chart "isn't
showing up," check this first.

### 1. `histogram_data` — bar histograms, scatter plots, and a shared drill-down table
```yaml
histogram_data:
  csv: patterns/<topic>/examplepapers/<file>.csv
  sections:
    - heading: "## Histogram by climate category"   # exact heading text
      column: koppen_geiger                          # CSV column to bucket rows by
      title: "Köppen–Geiger climate class"
    - type: scatter                                  # omit for a bar histogram
      heading: "## Land cover change vs. Annual ET change"
      x_column: forest_change_value_point
      y_column: hydro_response_value_point
      x_label: "Forest/land cover change (%)"
      y_label: "ET change (%)"
      filter_column: hydro_response_metric            # optional row filter
      filter_value: ET
      title: "Land cover change vs. Annual ET change"
  table_columns:            # optional: the row-level table shown when a histogram bar is clicked
    - key: location_name
      label: "Site / study"
      fallback_key: obs_id      # used when `key` is blank on a row
      subtitle_key: study_citation
      unit_key: forest_change_unit         # for numeric "value unit" cells
      min_key: forest_change_value_min     # renders "min–max unit" when the point value is blank
      max_key: forest_change_value_max
      caption_key: forest_change_metric    # small muted line above the cell value
      numeric: true              # right-align, tabular numerals
      wrap: true                 # allow wrapping (for long notes columns)
      muted: true                # de-emphasized text color
```
`sections` render in list order, each spliced after its heading — the number
and order of `sections` entries must line up with the matching headings'
order in the note body. See
`patterns/evapotranspiration/evapotranspiration or streamflow _response_to_vegetation_change.md`
for a live example combining both section types plus `table_columns`.

### 2. `trend_data` — summary + query panel over one-row-per-estimate numeric data
```yaml
trend_data:
  csv: patterns/<topic>/examplepapers/<file>.csv
  heading: "## Global ET trends by model"
```
Renders a summary card (min/max value, full period span, distinct set of
models) plus a query panel (filter by model, filter by year range). Expects
fixed CSV columns — `trend_id, et_product, product_category, period_start,
period_end, trend_value, trend_unit, significance_marker, source_citation` —
hard-coded in `csvTrend.ts`/`TrendComparisonExplorer.tsx`, not configurable
via frontmatter. A second use of this pattern (a different metric than ET
trends) would need those column names generalized first. Current example:
`patterns/evapotranspiration/evapotranspiration_pt_global.md` +
`patterns/evapotranspiration/examplepapers/et_trend_comparison.csv`.

### 3. `esm_table` — per-flux ESM method-comparison table
```yaml
esm_table:
  csv: models/<domain>/fluxes/tabledata/<file>.csv   # one row per model VERSION
  heading: "## Physically-based"
  columns:                       # optional: restrict/relabel which columns are shown
    - key: et_estimation_approach
      label: "ET estimation approach"
```
The method CSV's `version_id` column is the join key into
`esms/esm_model_versions.csv` (`version_id` → `model_id`), which in turn
joins into `esms/esm_model.csv` — so model name, type, website, and code-repo
links live once in the shared registry rather than being repeated per flux.
Columns named `version_id`, `documentation_url`, `extraction_source`, and
`confidence` in the method CSV are treated as provenance (shown as a
"Source" cell + confidence badge) rather than comparison columns; every other
column is shown as a comparison column by default. Current example:
`models/water/fluxes/process_evapotranspiration.md` +
`models/water/fluxes/tabledata/et_method_reference.csv`. When adding a new
model version to an existing method CSV, add matching rows to both
`esm_model_versions.csv` (and `esm_model.csv`, if it's a new model) —
otherwise the joined row will show blank model name/type/links.

### ⚠️ Gotcha: two parsers, one frontmatter contract
Flux/parameter/observation notes are reachable via two different routes,
each with its **own independent parser**:
- `/wiki/[slug]` → `src/lib/markdown.ts`
- `/models/[model]/[type]/[slug]` → `src/lib/models.ts` (the route the
  site's own navigation actually links to)

Both read the same markdown files but have separate `parseFlux` /
`parseParameter` / `parseObservation` functions with separately-maintained
lists of which frontmatter fields get copied into the returned metadata.
**Any frontmatter field a page component reads at render time (`esm_table`,
`topic`, a future new key, etc.) must be added to both parsers**, or the
feature works on one route and silently no-ops on the other. This has
already caused one real bug: `esm_table` was wired into `markdown.ts` but
not `models.ts`, so the ESM table rendered at `/wiki/process_evapotranspiration`
but not at `/models/water/fluxes/process_evapotranspiration` — which is the
one users actually land on by clicking through the site.

## Tagging protocol: `topic` / `kind` / `model`
- **`topic: [tag1, tag2]`** — on flux/parameter/observation notes *and* on
  pattern/relationship notes. Drives the Topics panel
  (`TopicExplorer`/`ModelTopicOverview`, via `src/lib/topics.ts`) shown on
  each model's overview page: a topic only appears there if at least one
  flux/parameter/observation/pattern actually carries it.
- **`kind: pattern | relationship`** — only on notes under `patterns/`.
  `pattern` = a topic-scoped page, grouped under its topic(s) in the Topics
  panel and given the outline-sidebar layout on `/wiki/[slug]`.
  `relationship` = a page connecting multiple topics/processes (e.g. the
  ET/streamflow/vegetation-change page) — listed separately as
  "Relationships of interest" rather than filed under one topic.
- **`model: water | carbon | nitrogen | energy`** — on pattern/relationship
  notes, drives the "← <Model> Model" back-link in the pattern-page sidebar
  on `/wiki/[slug]`.

Fluxes/parameters/observations only need `topic` (their kind is implicit
from which subfolder they live in). Pattern/relationship notes under
`patterns/**/*.md` should set all three.

## Things to be careful about
- Never write to the vault/content directories from tests or scripts — this
  repo has no test suite yet, but if one is added, point it at a fixture
  directory rather than `models/`/`patterns/`.
- Heading-string matches for the interactive content protocols above are
  exact and case-sensitive with no fuzzy fallback — see the gotcha above.
- A frontmatter change that's only wired into one of `markdown.ts` /
  `models.ts` will appear to work in ad-hoc testing (whichever route you
  happen to test) and then fail for real users on the other route.

## Current focus / in-progress work
Expanding the CSV-backed interactive content pattern (histograms, scatter
plots, trend queries, ESM method tables) beyond evapotranspiration to other
water-model fluxes, once method-reference CSVs exist for them
(`process_transpiration.md`, `process_stomatal_conductance.md`,
`process_soil_evaporation.md`, `process_stomatal_conductance_leaf_water_potential_response.md`
don't have `esm_table` frontmatter yet).

## File Data Bases structure for examplepapers under patterns

### ET / Forest-Change Literature Database — Schema & Conventions

Part of the Heliopause project. This section documents standing decisions for
the two-table dataset that underlies the vault's ET/forest-change literature
synthesis (see `patterns/evapotranspiration/examplepapers/veg_hydro_response_obs.csv`,
`patterns/evapotranspiration/examplepapers/veg_hydro_response_syn.csv`,
`patterns/evapotranspiration/examplepapers/README.md`). Decisions here were worked out in design sessions
(web Claude) and should be treated as settled unless explicitly revisited —
don't silently deviate from them when writing extraction/generation scripts.

### Two tables, not one
- `veg_hydro_response_obs.csv` — one row per individual catchment/study observation
  (a real ΔF→ΔET or ΔF→Δrunoff pair for one physical site, or a digitized
  point off a forest plot).
- `veg_hydro_response_syn.csv` — one row per synthesis/meta-analysis result (pooled effect
  size, regression coefficient, subgroup comparison) — always derived across
  multiple observations, never a single raw data point.
- Do not merge these into one wide table. The record types don't share a
  natural unit (a raw ΔET% and a pooled ln(RoM) with a CI are different kinds
  of thing), and forcing them together either invents placeholder columns
  most rows leave blank or makes `ci_lower/ci_upper` ambiguous about what
  it's bounding.

### Papers currently in the dataset
- Yang et al., 2023 (*Evapotranspiration on a greening Earth*) — mostly
  `veg_hydro_response_obs.csv` rows (Table S5, 172 catchments), plus one
  `veg_hydro_response_syn.csv` row (Fig. S5 regression line, ΔET vs ΔF).
- Zhang et al., 2017 (*J. Hydrol.*, forest change / annual runoff review) —
  **confirmed to have a full raw 312-watershed table in Appendix A** (name,
  area, precip, forest type, hydrol. regime, ΔF%, ΔQf%, method, source) —
  extracted from the supplementary docx. This means Zhang belongs mostly in
  `veg_hydro_response_obs.csv`, not synthesis — the subgroup means/CVs in the main
  paper (Figs. 5–7, Tables 2–4) are *derived from* this same Appendix A pool
  and go in `veg_hydro_response_syn.csv` referencing back to it.
- del Campo et al., 2022 (*For. Ecol. Manag.*, thinning meta-analysis) —
  almost entirely `veg_hydro_response_syn.csv` (pooled ln(RoM) effect sizes, Table 2;
  mixed-effects regression intercepts, Table 4; heterogeneity diagnostics,
  Supp. Table SM1). No observation-level numeric table exists in its
  supplement — individual-study values are only visible as forest-plot
  *images* (SM2–SM8), not machine-readable. Don't assume these can be bulk
  extracted; any observation-level del Campo row must be manually digitized
  and flagged as such (`method_analysis = "meta-analysis (individual study,
  forest plot)"`, with a `notes_flags` note on provenance).

### Key schema conventions (do not violate without discussion)

**Value bundles, not single columns.** Any reported quantity (forest-change
metric, hydro-response metric) is stored as `value_type` (`point`/`mean`/
`median`/`range`) + `value_point` + `value_min` + `value_max` + `value_sd`,
because papers report ranges (e.g. thinning intensity 14–97%) as often as
single numbers, and collapsing a range into a fake point value loses
information.

**`ci_lower`/`ci_upper` only exist in `veg_hydro_response_syn.csv`, and only ever bound
`value_point` in the *same row*.** A raw observation has no CI (it's not a
statistical estimate). If a paper reports two different estimates for one
process (e.g. a pooled ln(RoM) and a separate regression intercept), that's
two rows, not one row with two CI pairs.

**`site_id` (in `veg_hydro_response_obs.csv`) is a canonical cross-review identity,
separate from `obs_id`.** Populate only once a cross-paper match is
confirmed/probable (`site_match_confidence`: exact/probable/unconfirmed).
**Never collapse matched rows into one value** — Yang and Zhang may report
genuinely different ΔF/ΔQf numbers for what looks like the same catchment
(different post-treatment window, rounding, reviewer's choice of sub-period),
and that disagreement is informative, not noise. Confirmed so far: 86 exact
catchment-name matches between Yang's Table S5 (168 unique names) and Zhang's
Appendix A (309 unique names), before fuzzy-matching numbering/punctuation
variants — true overlap is higher. Zhang's Appendix A has **no lat/lon**, so
matching must run on name + area (km²) + precip (mm/yr) + source-citation
surname, and needs manual review, not a clean automated join (sub-watershed
numbering like "Fool Creek CO-1/2/3" or "Coweeta #1/#3/#6" is easy to
mismatch). del Campo overlap with Yang/Zhang not yet systematically checked;
expected low since thinning is a different intervention class than
clearcut/afforestation, but not zero.

**`model_id` groups `veg_hydro_response_syn.csv` rows belonging to one overarching result**
(e.g. all moderator tests for "del Campo stemflow", or "Zhang runoff-
sensitivity in large watersheds"). Encode scale/subgroup splits as *separate*
`model_id`s (`zhang2017_sensitivity_small` vs `_large`) rather than a shared
`model_id` with a size column — Zhang's drivers genuinely swap importance
between small and large watersheds (forest type matters in small,
hydrological regime in large); collapsing would produce a false blended
ranking.

**`driver_rank` ranks by quantitative importance measure, not text order.**
Rank 1 = highest `driver_importance_value` (e.g. R² for del Campo's
regressions) — see `delcampo2022_throughfall_driver_years` vs `_ba`, where
years-since-thinning (R²=23.6%) outranks %BA-removed (R²=13.9%) despite being
discussed second in the paper's prose.

**`driver_rank_basis` distinguishes `author_reported` from
`extractor_assigned`.** Use `author_reported` only when the paper gives an
explicit quantitative importance measure (del Campo's R² per moderator). Use
`extractor_assigned` when no such measure exists and the ranking is an
interpretive call from significance tests + discussion emphasis (all of
Zhang's driver rows — Zhang reports K-S/Mann-Whitney significance and
Kendall's τ but never a "% heterogeneity explained" figure). Never blend the
two without this flag visible.

**Both `forest_change_*` and `hydro_response_*` need metric-level
descriptions in `veg_hydro_response_syn.csv`**, not just bare labels — `forest_change_metric`
+ `forest_change_description`, `hydro_response_metric` +
`hydro_response_description` + `response_formula`. Bare labels like `Sf` or
`ln(RoM)` aren't self-explanatory without the paper's notation in hand.
These are metric-level constants (same description repeated across every row
sharing that metric) — kept distinct from `direction_note`, which is
row-specific interpretive commentary about that particular comparison. Don't
collapse the two.

## Open / unfinished work
- Full extraction of all 312 Zhang rows and all 172 Yang rows into
  `veg_hydro_response_obs.csv` proper (currently only worked examples exist).
- Fuzzy name/area/precip matching pass to populate more `site_id` links
  between Yang and Zhang.
- del Campo × Yang/Zhang citation-overlap check (not yet done).
- Script to generate one lightweight per-observation Obsidian note (YAML
  frontmatter: paper, biome, koppen, metric, method, value, citation) from
  these CSVs — intended as the browsable/linkable layer, queried via
  Dataview (not Bases — Bases' aggregation/crosstab support isn't mature
  enough yet for the biome × metric / method-histogram views wanted).
- Köppen–Geiger and Whittaker biome assignment for Zhang rows blocked on
  lack of lat/lon in the source table — will need a secondary geocoding step
  from watershed name + region, flagged as lower-confidence than Yang's
  coordinate-based assignments.
- `esm_table` needs method-reference CSVs for the remaining water fluxes
  (transpiration, stomatal conductance, soil evaporation) before it can be
  wired onto those pages the same way it now is for evapotranspiration.
