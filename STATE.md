# Heliopause / tbm-esmdoc — state snapshot

_Snapshot date: 2026-09-28. Written for a collaborator without repo access._

A Next.js 16 (App Router, React 19, TypeScript, Tailwind) site that renders a vault of
Obsidian-style markdown notes — biophysical model documentation, cross-cutting
pattern/relationship pages, and a comparison registry of Earth System Models — as a
cross-linked wiki with CSV-backed interactive tables, charts and clickable diagrams.
Package manager `pnpm`; `pnpm dev` / `pnpm build`. **No test suite exists.**

### Changes since the 2026-09-24 snapshot

All in the **controls vocabulary** (`hydro_controls.csv`, behind `/wiki/what_shapes_responses`);
no code or schema changed.

- Group **"Vegetation recovery & structure" → "Vegetation Pre/Post"** (4 controls), and two of
  its labels: "Recovery rate and growth release" → **"Post change growth"**, "Fine-scale canopy
  structure and density" → **"Pre-disturbance canopy structure and composition"**.
- **"Rain-snow regime" moved from Climate & timing into Snow.** Climate & timing is now 2
  controls, Snow 4.
- The old "Subcanopy evaporation and snowpack sublimation" control was repurposed into
  **"Soil Evaporation"** under Soils & subsurface (same `control_id`), and a new Snow control
  **"Snow melt, accumulation and sublimation"** was added.
- **`display_order` renumbered 1–18, contiguous, in group order.** It had a blank and a
  duplicate, which mattered more than it looks: `readControlGroups` sorts with
  `parseFloat(display_order) || 0` and takes group order from first appearance, so the blank row
  sorted to the very top of the page and the stale `11` pulled Soils & subsurface ahead of Snow.
- Repairs to the new Snow row: `control_id` `snow accumulation adn melt` →
  `snow_accumulation_melt` (it is the join key into the evidence CSV, so as written no evidence
  row could ever match it); `concept_map_node` and `process_ids` were comma-separated where the
  parser splits on `;` only, collapsing several values into one; `interception_throughfall` →
  `vegetation_interception_throughfall`; `snow_accumulation` and `snow_sublimation` added. All
  seven ids verified against `process_coverage.csv`.

## 1. Directory tree

```
models/            water, vegetation-som, energy, climate — one folder per model
  <model>/index.md           model overview page
  <model>/fluxes/            process_*.md        (water 5, vegetation-som 1)
  <model>/parameters/        <Name>.md           (water 7, vegetation-som 1)
  <model>/observations/      obs_*.md            (water 6, vegetation-som 1)
  water/fluxes/tabledata/    per-flux ESM method CSVs
  water/observations/tables/ reference-table CSVs
patterns/          cross-cutting pages, grouped by topic folder
  evapotranspiration/        13 notes + examplepapers/ (literature CSVs + README)
  water_limitation/          1 note (new, stub)
  surfacewater_N/            empty placeholder folder
esms/              shared ESM registry (3 CSVs) — see §2
figures/           3 diagram SVGs; boxes tagged data-process-id(s)
specificESMs/      RHESSys narrative writeups (2 notes, both thin)
Templates/         6 note templates, one per content type
model-techniques/  method notes + pft_reference.csv
src/app/           routes (§4)   src/components/  24 components
src/lib/           16 modules: parsers, CSV helpers, diagram loaders
src/types/         all frontmatter config shapes
```

## 2. ESM registry and how the tables join

Three CSVs in `esms/`, joined by two keys:

```
esm_model.csv (4 rows)            model_id  →  RHESSYS, ORCHIDEE, CLM, LPJGUESS
  model_id | display_name | model_type | website_url | notes
        ▲
        │ model_id
esm_model_versions.csv (7 rows)   version_id → CLM_4.5, CLM_5.0, CLM_ml, LPJGUESS_original,
  version_id | model_id | version_label | release_year | code_repository_url | notes
        ▲
        │ version_id
models/water/fluxes/tabledata/et_method_reference.csv (6 rows)   ← one row per model VERSION
  version_id | documentation_url | extraction_source | confidence | time_step |
  et_estimation_approach | stomatal_conductance_approach | et_components_represented | ...
```

So a per-flux method table carries only `version_id` plus its comparison columns; model name,
type and links come from the registry at render time. Adding a version to a method CSV
**requires** matching rows in `esm_model_versions.csv` (and `esm_model.csv` if new), or the
joined row shows blank model identity. In `esm_table` the columns `version_id`,
`documentation_url`, `extraction_source`, `confidence` are treated as provenance (rendered as a
"Source" cell + confidence badge); every other column becomes a comparison column.

`esms/process_coverage.csv` (452 rows) is a separate, denser join: **113 distinct `process_id` ×
4 `model_id`**, fully crossed. `coverage` ∈ yes (272) / partial (81) / no (77) /
needs_verification (22), plus `mechanism_note`, `citation`, `extraction_source`, `category`,
`dimension`. `version_id` is blank on every row today (reserved for per-version overrides, and
the loader ignores rows that have one). `model_id` uses registry ids (`RHESSYS`, `LPJGUESS` —
not `RHESSys` / `LPJ-GUESS`). This drives the ESM picker on the model-overview diagrams.

Example row: `canopy_structure | community_composition | Canopy structure | CLM | | partial |
"Dynamic cohort/size-structured canopy only in CLM-FATES; default CLM uses prescribed PFT
canopy fractions" | Fisher et al. 2018 (FATES) | Fisher & Koven 2020 Fig 2a`

## 3. The other CSVs

| File | Rows | Shape |
|---|---|---|
| `patterns/evapotranspiration/examplepapers/veg_hydro_response_obs.csv` | **484** | one row per catchment observation; 35 cols |
| `…/veg_hydro_response_syn.csv` | 8 | one row per synthesis/meta-analysis result; 27 cols |
| `…/et_trend_comparison.csv` | 29 | one row per published ET-trend estimate; 10 cols |
| `…/global_veg_greening_hydro.csv` | 4 | global greening→hydrology attributions; 12 cols |
| `…/hydro_controls.csv` | 18 | one row per control on the disturbance→hydrology response; 12 cols |
| `…/hydro_controls_evidence.csv` | 37 | one row per published finding, tagged to a control; 23 cols |
| `models/water/observations/tables/precipitation_datasets_summary.csv` | 29 | precipitation product inventory; 19 cols |
| `model-techniques/pft_reference.csv` | 16 | PFT lookup; 8 cols. **Not wired to any page yet.** |

**`veg_hydro_response_obs.csv`** — the core literature table. `obs_id | site_id |
site_match_confidence | meta_source | study_citation | location_name | lat | lon |
country_continent | koppen_geiger | whittaker_biome | climate_class_paperdefined |
forest_change_{metric,submetric,value_type,value_point,value_min,value_max,value_sd,unit} |
hydro_response_{metric,value_type,value_point,…,unit} | method_analysis |
method_forest_change_measurement | method_hydro_response_measurement | watershed_area_km2 |
precip_mm_yr | spatial_scale | notes_flags | figure_table_source`.
Currently 172 rows from Yang et al. 2023 (metric `ET`) + 312 from Zhang et al. 2017 (metric
`runoff`). 178 rows carry a cross-paper `site_id`; 260 carry a Köppen class (the Zhang rows
mostly don't — no lat/lon in that source).

Example: `yang2023_001 | Bosch and Hewlett, 1982 | "Alum Creek, #2" | Cfa |
forest_cover_change | -45.0 | ET | -9.1 | PWE`

**Two standing schema rules** (settled in earlier design sessions, don't quietly break them):
(a) quantities are stored as *value bundles* — `value_type` + `value_point` + `value_min` +
`value_max` + `value_sd` — because papers report ranges as often as points; (b) `ci_lower` /
`ci_upper` exist **only** in the synthesis table and only ever bound `value_point` in the same
row. Matched sites are never collapsed into one value: Yang and Zhang genuinely disagree on
some shared catchments, and that disagreement is data.

**`global_veg_greening_hydro.csv`** — 4 rows. Three report a share of the ET trend attributable
to greening (39 %, 62 %, 55 % [30–80]); the fourth reports only R = 0.39 and so has a blank
`Attribution Percent` and is deliberately not plotted.

**`hydro_controls.csv`** — the controls vocabulary behind `/wiki/what_shapes_responses`: what
makes the hydrologic response to a disturbance differ from place to place. `control_id |
display_order | group | label | definition | why_it_matters | concept_map_node | model_link_type
| model_representation_needed | process_ids | process_id_status | notes`. Six groups, rendered in
`display_order` (not alphabetically): **Climate & timing** (2), **Disturbance footprint** (2),
**Vegetation Pre/Post** (4), **Topography & surface energy** (1), **Snow** (4), **Soils &
subsurface** (5). `process_ids` is `;`-separated and joins `process_coverage.csv`
(`process_id_status`: mapped 14, needs_new_id 3, not_applicable 1) — note that **`;` is the only
separator the parser splits on**, so a comma-separated list silently becomes one value.
`hydro_controls_evidence.csv` joins back on `control_id`, and its row count per control is what
the page shows as that control's evidence count (0 is displayed, not hidden).

## 4. Frontend

| Route | What it is |
|---|---|
| `/` | homepage model gallery |
| `/models/<model>` | model overview; process diagram + Relationships panel if `process_diagram` declared, else plain lists |
| `/models/<model>/{fluxes,parameters,observations}/<slug>` | a note scoped under its model — **the route site navigation uses** |
| `/wiki/<slug>` | any note by slug; the *only* route for pattern/relationship pages |
| `/esms` | the ESM registry |
| `/patterns/et-observations` | a standalone CSV-browsing page (its own route, not spliced into a note) |
| `/about`, `/profile`, `/settings` | placeholder UI, no real data behind them |
| `/api/sidebar` | returns all notes as `{slug,title,type}`; its `variables` field is a hardcoded `[]` stub |

**⚠️ The single biggest gotcha:** `/wiki/[slug]` and `/models/[model]/[type]/[slug]` have **two
independent parsers** (`src/lib/markdown.ts` and `src/lib/models.ts`) with separately maintained
lists of which frontmatter fields reach the page. A new key wired into only one silently no-ops
on the other route. This has already caused one real bug.

**Interactive (client components, all CSV-backed):** `CsvHistogramSection` (click a bar →
drill-down row table), `CsvScatterSection`, `CsvDatasetTable` (dropdown filter + free-text
search), `EsmMethodTable`, `TrendComparisonExplorer` (model + year-range query panel),
`MetricResponseExplorer` (metric picker), `CsvEstimateStrip` (dot strip; click a dot → scrolls
to and highlights its table row), `ProcessDiagram` (ESM picker + clickable boxes),
`ConceptDiagram`, `EtObservationsExplorer`.
**Static (server-rendered):** `Sidebar`, `PageOutline`, `RelatedContentPanel`,
`RelationshipsPanel`, `TopicGroupSections`, `InfoBox`, `PageLinks`, `UsefulTechniques`.
`MarkdownContent` is a client component: markdown → HTML happens **in the browser**
(remark/rehype + KaTeX + mermaid), not at build time.

## 5. Vault structure — and no, there is no MDX

Note types are determined by **folder**, not frontmatter: `models/<m>/fluxes|parameters|
observations/`, `models/<m>/index.md` (overview), `patterns/<topic>/*.md` (`kind: pattern` or
`kind: relationship`). Slugs are the filename lowercased with spaces → underscores.
Wikilinks `[[Note]]` / `[[Note|Alias]]` resolve to `/wiki/<slug>`, or to the model-scoped route
when that model owns the target. Tagging: `topic: [...]` groups pages in the topic sidebar;
`kind:` distinguishes pattern from relationship; `model:` drives the back-link and which
overview lists it; `parent:` nests a sub-page under a hub.

**There are no `.mdx` files and no MDX embeds.** Interactivity is spliced in by a different
mechanism: a YAML frontmatter key names a component's config plus an **exact heading string**,
and `splitAtHeadings` (`src/lib/headingSplit.ts`, plain string match, not an AST match) renders
markdown up to that heading, inserts the React component, then renders the rest. A heading
string that doesn't match the body doesn't error — the component silently doesn't appear.
*This is the first thing to check when something "isn't showing up."*

Ten such keys exist. Current users: `histogram_data` (7 notes), `trend_data` (1),
`esm_table` (1), `dataset_table` (3), `estimate_chart` (1), `metric_response_data` (1),
`process_diagram` (2 model indexes), `concept_diagram` (1), `page_links` (1),
`controls_list` (1 — `what_shapes_responses.md`, rendering `hydro_controls.csv` grouped, with
each control's evidence count linked to the evidence table lower on the same page).

## 6. Diagrams

Three SVGs in `figures/`, all following one contract: a clickable element is a
`<g data-process-id="x">` or `<g data-process-ids="x,y,z">`. **Those attributes must survive any
regeneration of the figures**, and for the model diagrams every id must exist in
`process_coverage.csv`. Label text is scaled at load time (`diagramSvg.ts`, default ×1.15;
the concept figure uses 1.25) rather than in the SVGs, so it survives regeneration too.

- `hydrology_full_diagram.svg` — 45 boxes / 64 ids, on `/models/water`.
- `vegetation_full_diagram.svg` — 55 boxes / 69 ids, on `/models/vegetation-som`. Its small
  C/N/P/O markers grey out per element following that organ's storage-pool coverage — a
  stopgap until N and P get proper treatment.
  Both: an ESM picker shades every box yes/partial/no/needs_verification; a box exactly one note
  claims navigates there, otherwise a coverage panel opens in the sidebar.
- `vegetation_hydrology_flow.svg` — the concept map on the "Water cycle response to vegetation
  change" hub page. 12 clickable groups / 43 ids. Nodes: **drivers** Climate, Disturbance, Human
  drivers → **vegetation** Growth, Mortality/removal, Community composition, Ecophysiology →
  (large two-way arrow) → **hydrology** Snow, Evapotranspiration, Subsurface storage,
  Stream/river flow, plus a dashed "bypass (no snow)" path and a dashed feedback loop from
  subsurface storage back to climate. The two-way arrow contains two small inner arrows: a
  grey "this page" (veg → hydro) and a teal, clickable "hydro to veg" that links to the new
  vegetation-response page. No ESM picker or coverage here — a box is a map of the idea. A box
  no page claims is left as inert artwork; a box several claim opens a picker below the figure.

## 7. Half-built, stubbed, or worth knowing

- **`patterns/water_limitation/vegetation_response_to_water_availability.md` is a stub** — real
  frontmatter and Related-content panel, but the body is one "to be written" paragraph and it
  has no concept diagram or key considerations.
- **`esm_table` exists for exactly one flux** (evapotranspiration). Transpiration, soil
  evaporation and both stomatal-conductance notes need method-reference CSVs before they can be
  wired the same way. This is the stated current focus.
- **`trend_data` is not generalized**: its CSV column names are hardcoded in `csvTrend.ts` and
  `TrendComparisonExplorer.tsx`. A second, non-ET use needs those abstracted first.
- **`energy` and `climate` models are index-only** — no fluxes, parameters or observations, no
  process diagram. `/models/biogeochemistry` is deliberately unused, reserved for a future
  soil/biogeochemistry suite. `carbon` and `nitrogen` redirect to `vegetation-som` (they were
  merged); the redirects live in `next.config.ts`.
- **`patterns/surfacewater_N/` is an empty folder.** `specificESMs/RHESSys/` and several
  `model-techniques/` notes are near-empty.
- **Five evidence rows still point at `subcanopy_evaporation_sublimation`**, the control that is
  now labelled "Soil Evaporation" under Soils & subsurface. Some of that evidence is about
  snowpack sublimation and probably belongs on the new Snow control instead; re-pointing it is a
  content call NT is reviewing. Three controls currently have no evidence rows at all:
  `snow_accumulation_melt`, `disturbance_extent_position`, `post_fire_soil_change`.
- `pft_reference.csv` is written but not read by anything.
- `process_coverage.csv`'s per-version override mechanism is specified but unused and unread.
- `/about`, `/profile`, `/settings` are UI shells; `/api/sidebar`'s `variables` is a stub.
- Still open on the data side: fuzzy name/area/precip matching to extend `site_id` coverage
  beyond the 178 rows that have one; a del Campo × Yang/Zhang citation-overlap check; Köppen and
  Whittaker assignment for the Zhang rows (blocked on missing lat/lon, needs geocoding from
  watershed name and flagging as lower-confidence); and a planned generator that would emit one
  lightweight Obsidian note per observation from these CSVs, for Dataview querying.
- **`CLAUDE.md` is stale in one place**: it lists full extraction of the Yang and Zhang rows as
  outstanding, but `veg_hydro_response_obs.csv` now holds all 484 (172 + 312).
