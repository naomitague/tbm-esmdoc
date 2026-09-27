# Project: Environmental ESM literature - Heliopause ideas

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
models/<domain>/                  # water, vegetation-som, energy, climate
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
  process_coverage.csv            # process_id × model_id coverage (yes/partial/no/needs_verification)
                                   # — drives the model-overview process diagrams (see process_diagram)
figures/                          # model-overview diagram SVGs (boxes tagged data-process-id(s))

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
/models/<model>                                # model overview (water, vegetation-som, energy, climate)
/models/carbon/*, /models/nitrogen/*           # redirect to /models/vegetation-som/* (next.config.ts) —
                                                # carbon + nitrogen were merged into the "Dynamic
                                                # Vegetation and SOM Model". /models/biogeochemistry is
                                                # intentionally unused/unredirected: reserved for a future
                                                # biogeochemistry / soil-development model suite.
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
2. Fill in frontmatter, including `topic: [...]` so it's grouped with related
   pages in its own page's topic sidebar, and `process_ids: [...]` if it
   documents a box in the model's process diagram (see Tagging protocol and
   `process_diagram`).
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
2. In `src/lib/models.ts`, add `soil` to the `modelOrder` list (homepage
   card order; unlisted models sort last) and the `modelIcons` and `modelColors`
   maps in `getAllModels()` (the color name — `blue`/`green`/`purple`/
   `orange`/a new one — becomes `ModelCard.color`).
3. In `src/app/page.tsx`, add `soil` to its own separate `modelIcons` map
   (slug → actual Lucide icon component — this is what really renders on the
   homepage; `src/lib/models.ts`'s `modelIcons` strings aren't currently
   wired to anything) and, if you used a new color name in step 2, add its
   Tailwind classes to `page.tsx`'s `modelColors` map too, or it'll silently
   fall back to gray.

## Interactive content protocols

Several frontmatter keys splice a live React component into a note's rendered
markdown, positioned right after a specific heading. They all work the same
way under the hood: the target heading text is located in the raw markdown
with a plain string match (`splitAtHeadings` in `src/lib/headingSplit.ts`,
shared by both page routes — not an AST match), the markdown is rendered as
normal up to and including that heading, the component is inserted, and the
rest of the markdown renders after it. A note may combine several of these
keys; `orderInjections` sorts them by where their headings actually fall in
the body.

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
`patterns/evapotranspiration/watershed_disturbance_synthesis.md` for two bar
sections plus `table_columns`, and
`patterns/evapotranspiration/annual_et_response_to_vegetation_change.md` for a
scatter section.

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

### 4. `dataset_table` — browsable reference table over a plain CSV
```yaml
dataset_table:
  csv: models/water/observations/tables/precipitation_datasets_summary.csv
  heading: "# Global Products Table"     # exact heading text
  title: "Global precipitation products" # optional caption above the controls
  filter_column: category                # optional dropdown, built from that column's distinct values
  filter_label: "Product category"
  search_columns: [dataset, category]    # free-text search targets; defaults to every shown column
  search_placeholder: "Search dataset or category…"
  row_noun: product                      # "12 products" in the row count
  columns:                               # required: which CSV columns to show, in order
    - key: dataset
      label: Dataset                     # first column is the sticky row header
    - key: reference
      label: Reference
      wrap: true                         # let long text wrap instead of one line
    - key: website
      label: Website
      type: link                         # render the cell value as an external link
      link_label: site                   # visible text (defaults to the raw URL)
```
Unlike `esm_table` this joins against nothing — the CSV renders as-is, so it
suits flat reference tables (product/dataset inventories) rather than
per-model-version comparisons. The whole table shows by default; the dropdown
and search box only narrow it, and a "Show all" button clears both. Columns
not listed in `columns` are simply not displayed (and not searched, unless
named in `search_columns`). `row_id_column: <column>` additionally gives each
row a DOM id, which is what an `estimate_chart` on the same page links its dots
to (see below). Current example:
`models/water/observations/obs_precip.md` +
`models/water/observations/tables/precipitation_datasets_summary.csv`.

### 5. `estimate_chart` — compact dot strip over a handful of published estimates
```yaml
estimate_chart:
  csv: patterns/<topic>/examplepapers/<file>.csv
  heading: "## Global and regional trend estimates"   # exact heading text
  title: "Share of the observed ET trend attributed to vegetation greening"
  value_column: "Attribution Percent"       # the plotted number
  min_column: "Attribution Percent Min"     # optional; both bounds needed to draw a whisker
  max_column: "Attribution Percent Max"
  label_column: Citation                    # tooltip heading
  sublabel_column: "Trend Period"
  tooltip_columns: ["Attribution Method", "Trend"]
  axis_label: "% of the ET trend attributed to greening"
  axis_min: 0                               # omit both bounds to fit the axis to the data
  axis_max: 100
  unit: "%"
  row_id_column: "Estimate ID"              # click target — see below
  note: "…why some rows aren't plotted."
```
One dot per CSV row on a single horizontal axis, with a whisker where the row
reported a range — for the case where a few papers estimate the *same*
quantity and the point of the figure is the spread, not a relationship between
two variables. **A row whose `value_column` doesn't parse as a number is
silently not plotted** — that's deliberate, and is how a qualitatively
different result in the same table (a bare correlation among
percentages-of-trend, say) stays in the table without being forced onto an
axis it doesn't belong on; the caption reports "N of M estimates plotted".
Numbers live in their own numeric columns, so the table can keep showing the
paper's own free-text phrasing in a separate column.

Setting `row_id_column` on **both** `estimate_chart` and the page's
`dataset_table` (naming the same column) makes each dot clickable: the strip
sets the location hash to `#estimate-<id>`, which scrolls that table row into
view and highlights it via the `.dataset-table tr:target` rule in
`globals.css`. The two components share no state — if the table is filtered so
the row isn't rendered, the click simply does nothing.

Both can (and here do) target the **same heading**: `splitAtHeadings` resolves
both to that heading's index and `orderInjections` sorts stably, so they render
back-to-back in the order the route pushes them — the `estimate_chart`
injection is pushed *above* the `dataset_table` one in both page components, so
the figure leads the table it summarizes. Current example:
`patterns/evapotranspiration/global_vegetation_change_et.md` +
`patterns/evapotranspiration/examplepapers/global_veg_greening_hydro.csv`.

### 6. `process_diagram` — clickable, ESM-aware process diagram (model overviews)
```yaml
# in models/<domain>/index.md
process_diagram:
  svg: figures/hydrology_full_diagram.svg
  coverage: esms/process_coverage.csv
  heading: "## Some heading"   # OPTIONAL — omit and the diagram leads the page
```
Same heading-splice rule as above (but `heading` is optional here: with none
declared the diagram renders above the markdown, which is what water and
vegetation-som do — the hero already names the model, so the figure needs no
heading of its own), on a model's `index.md` (read by
`getModelBySlug` in `models.ts`; loaded by `src/lib/processDiagram.ts`,
rendered by `src/components/ProcessDiagram.tsx`). The SVG is inlined; its
process boxes are `<g data-process-id="x">` or `<g data-process-ids="x,y,z">`
— **those attributes are the contract**: if the figure is regenerated they
must survive, and every id must exist in the coverage CSV.
- **Picker**: "Framework" (all boxes normal) or one ESM, which marks each
  box `yes`/`partial`/`no`/`needs_verification` (styled in `globals.css`
  under `.process-diagram`). A multi-id box takes the unanimous status of its
  processes, or `partial` if they're mixed.
- **Element markers**: the small C/N/P/O circles on leaf/stem/root boxes in
  `vegetation_full_diagram.svg` grey out (or fade, for `partial`) per circle,
  following the selected model's coverage of that element's storage pool in
  the same organ — an "N" circle on a stem box follows `stem_storage_n`.
  W and S circles aren't touched. A stopgap until N/P get their own
  treatment; see `updateElementMarkers` in `ProcessDiagram.tsx`.
- **Click**: if exactly one note claims a box's process(es) it navigates
  there; otherwise the per-model coverage panel (status, `mechanism_note`,
  `citation`, links to any claiming pages) opens in the sidebar, above the
  Relationships-of-interest panel.
- **Label size**: the exported figures' text is sized for a full-page figure
  and scales down with the SVG, so `readProcessDiagram` multiplies every
  `font-size` by `TEXT_SCALE` (1.15) as it reads the markup — done there, not
  in the SVGs, so it survives a figure being regenerated. The tightest box has
  ~25% horizontal slack, so keep the factor under 1.2. The other half of
  legibility is column width: the diagram layout uses a wider page container
  and a 4-column grid (figure 3, sidebar 1) in `src/app/models/[model]/page.tsx`.
- **Layout**: any model whose `index.md` declares `process_diagram` gets the
  diagram + Relationships layout (currently water → `hydrology_full_diagram.svg`,
  vegetation-som → `vegetation_full_diagram.svg`); models without one keep the plain
  flux/parameter/observation lists.
- **Cross-model links**: `process_diagram.links: [{process_ids: [...], href,
  title}]` on a model index adds links for boxes whose page lives in another
  model (loaded alongside the `process_ids` pages; a box with exactly one link
  navigates). Currently water's Growth box → `/models/vegetation-som`, and
  the vegetation diagram's six blue water-dimension boxes → `/models/water`.
- **Linking notes to boxes**: add `process_ids: [leaf_transpiration, ...]`
  to a flux/parameter/observation note's frontmatter (wired into both
  parsers). Current examples: `process_transpiration.md`,
  `process_soil_evaporation.md`, `obs_precip.md`, `subsurface-moisture-*.md`,
  and vegetation-som's `process_carbon_allocation.md` (leaf/stem/root
  "Growth / allocation" boxes — a model with photosynthesis and growth is
  necessarily doing allocation, so growth and allocation share one box).
- **`esms/process_coverage.csv`**: one row per `process_id` × `model_id`
  (`model_id` joins `esms/esm_model.csv`, same ids as the registry — e.g.
  `RHESSYS`, `LPJGUESS`, not `RHESSys`/`LPJ-GUESS`). `version_id` is blank
  (= applies to every version of that model); rows with a `version_id` are
  reserved for per-version overrides and currently ignored by the loader.

### 7. `concept_diagram` — clickable concept figure + key considerations (pattern/relationship pages)
```yaml
# in patterns/<topic>/<name>.md
concept_diagram:
  svg: figures/vegetation_hydrology_flow.svg
  heading: "# Conceptual Model"     # OPTIONAL — omit and the figure leads the page
  text_scale: 1.25                  # OPTIONAL — label-size multiplier, default 1.15
  links:                            # box → page, beyond what `process_ids` frontmatter claims
    - process_ids: [river_channel_flow, lateral_surface]
      href: /wiki/annual_streamflow_response_to_vegetation_change
      title: "Annual streamflow response to vegetation change"
      type: flux                    # optional: flux|parameter|observation|model|page (default page)
  considerations:                   # column of cards rendered beside the figure
    - title: Time
      subtitle: "when, and over what interval"
      items:                        # `label` alone is a plain list entry;
        - label: "Time since the change"
        - label: "Averaging interval"
          note: "optional — a label with a note renders as its heading"
          href: /wiki/some_page      # optional
```
The same `data-process-id(s)` SVG contract as `process_diagram`, minus the ESM
picker and the coverage CSV: here a box is a map of the idea, not a coverage
claim. Differences from `process_diagram`:
- `process_ids` are resolved against **every** model's notes (a relationship
  figure spans vegetation drivers and hydrology responses), not one model's.
- A box exactly one page claims navigates there; a box several pages claim
  opens a picker below the figure; a box nothing claims is left as inert
  artwork (`data-inert="true"`, styled in `globals.css`).
- `links:` is how sibling pattern/relationship pages get onto the figure — no
  `process_ids` frontmatter would ever claim them.
Loaded by `src/lib/conceptDiagram.ts`, rendered by
`src/components/ConceptDiagram.tsx`; both routes read it (see the gotcha
below). Current example:
`patterns/evapotranspiration/evapotranspiration or streamflow _response_to_vegetation_change.md`
+ `figures/vegetation_hydrology_flow.svg`. Both figure loaders share
`src/lib/diagramSvg.ts` (strips the content-credential blob, drops the fixed
pixel size, scales label text — both `font-size="…"` attributes and
`font-size:` rules in a figure's `<style>` block, since the figures use both).
`text_scale` raises the default 1.15 for one figure; the ceiling is that
figure's tightest box, and overflowing text just runs over the box stroke with
no warning, so check the longest label before raising it.

### 8. `page_links` — a row of buttons to other notes
```yaml
page_links:
  heading: "## Worked syntheses"      # exact heading text
  sidebar: true                       # optional: also repeat as a card in the
  sidebar_title: "Worked syntheses"   #   left outline sidebar (/wiki pattern
                                      #   pages only; defaults to `heading`
                                      #   minus its #s). Only worth it when the
                                      #   page's "On this page" list is short.
  items:
    - label: "Watershed studies of disturbance effects on hydrology"
      href: /wiki/watershed_disturbance_synthesis
      description: "optional one-line subtitle"
```
Same splice rule as the rest. How a hub page hands off to the worked examples
that live on their own pages, rather than carrying every table itself —
prominent enough to read as the way onward, unlike a markdown link in a
paragraph. Rendered by `src/components/PageLinks.tsx`. Current example: the
water-cycle/vegetation-change hub page, which links to
`watershed_disturbance_synthesis.md` and `global_vegetation_change_et.md`
(both `parent:` that hub, so they nest under it rather than appearing as
siblings in the model's Relationships panel).

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
  pattern/relationship notes. Drives the topic sidebar on
  `/models/<model>/<type>/<slug>` pages (`getTopicIndex` in
  `src/lib/topics.ts` + `TopicGroupSections`): the other fluxes/parameters/
  observations/patterns/relationships sharing that page's topic.
- **`kind: pattern | relationship`** — only on notes under `patterns/`.
  `pattern` = a topic-scoped page, grouped under its topic(s) in that topic
  sidebar and given the outline-sidebar layout on `/wiki/[slug]`.
  `relationship` = a page connecting multiple topics/processes (e.g. the
  ET/streamflow/vegetation-change page). On model overview pages with a
  `process_diagram` (water, vegetation-som), the "Relationships of interest" panel
  (`RelationshipsPanel`, via `getRelationshipsOfInterest`) lists every
  relationship with **no `parent`** and either `model: <that model>` or a
  `topic` listed in that model's `index.md` `relationship_topics: [...]`
  (vegetation-som sets `[vegetation_change]`, so the water-owned "Water
  cycle response to vegetation change" page appears there too). A new
  hub-level relationship page shows up automatically; sub-pages that set
  `parent: <hub slug>` are only counted under their hub.
- **`model: water | vegetation-som | energy | climate`** — on pattern/relationship
  notes, drives the "← <Model> Model" back-link in the pattern-page sidebar
  on `/wiki/[slug]`, and which overview's Relationships panel a relationship
  appears in.

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
