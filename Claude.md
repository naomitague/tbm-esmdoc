# Project: Obsidian Vault Interface

# What this project does
A pnpm-based interface for reading/writing an Obsidian vault programmatically —
parsing markdown notes, frontmatter, wikilinks, and vault structure.

## Tech stack
- Package manager: pnpm (workspace — fill in if using `pnpm-workspace.yaml` with multiple packages)
- Language: <!-- TypeScript / JavaScript? -->
- Key dependencies: <!-- e.g. gray-matter for frontmatter, remark for markdown parsing -->

## Project structure
<!-- Fill in your actual layout, e.g.: -->
```
models/ # biophysical categories

model-techniques/ # application of models

figures/ # graphics for interface

Templates/ # templates for creating model pages
 
src/
	app/ # pages and routs 
	components/ # reusable UI components
	lib/  # utility functions
	tyoes/ # typscript definitions

```

The Templates create the style for the Models. For example,
all of the md in model/water/fluxes should be structured based on Templates/Flux-Template.md

## Obsidian vault conventions this code relies on
- Frontmatter format: <!-- YAML? any custom fields Claude should know about -->
- Wikilink syntax: `[[Note Name]]` and `[[Note Name|Alias]]` <!-- adjust if you support block refs, embeds, etc -->
- File naming: <!-- any conventions, e.g. notes may contain spaces, special chars -->
- Folder structure significance: <!-- do folders mean anything (tags, categories) or are they just organization? -->

## Commands
```bash
pnpm install       # install deps
pnpm dev           # <!-- fill in -->
pnpm test          # <!-- fill in -->
pnpm build         # <!-- fill in -->
```

## Conventions / style
- <!-- e.g. prefer functional style, error handling pattern, testing framework used -->

## Things to be careful about
- Never write to the vault directly during tests — use a fixture/mock vault directory
- <!-- any other gotchas, e.g. large vaults, symlinks, .obsidian config folder to ignore -->

## Current focus / in-progress work


## File Data Bases strucutre for examplepapers under patterns


### ET / Forest-Change Literature Database — Schema & Conventions

Part of the Heliopause project. This section documents standing decisions for
the two-table dataset that underlies the vault's ET/forest-change literature
synthesis (see `schema/observations.csv`, `schema/synthesis.csv`,
`schema/README.md`). Decisions here were worked out in design sessions
(web Claude) and should be treated as settled unless explicitly revisited —
don't silently deviate from them when writing extraction/generation scripts.

### Two tables, not one
- `observations.csv` — one row per individual catchment/study observation
  (a real ΔF→ΔET or ΔF→Δrunoff pair for one physical site, or a digitized
  point off a forest plot).
- `synthesis.csv` — one row per synthesis/meta-analysis result (pooled effect
  size, regression coefficient, subgroup comparison) — always derived across
  multiple observations, never a single raw data point.
- Do not merge these into one wide table. The record types don't share a
  natural unit (a raw ΔET% and a pooled ln(RoM) with a CI are different kinds
  of thing), and forcing them together either invents placeholder columns
  most rows leave blank or makes `ci_lower/ci_upper` ambiguous about what
  it's bounding.

### Papers currently in the dataset
- Yang et al., 2023 (*Evapotranspiration on a greening Earth*) — mostly
  `observations.csv` rows (Table S5, 172 catchments), plus one
  `synthesis.csv` row (Fig. S5 regression line, ΔET vs ΔF).
- Zhang et al., 2017 (*J. Hydrol.*, forest change / annual runoff review) —
  **confirmed to have a full raw 312-watershed table in Appendix A** (name,
  area, precip, forest type, hydrol. regime, ΔF%, ΔQf%, method, source) —
  extracted from the supplementary docx. This means Zhang belongs mostly in
  `observations.csv`, not synthesis — the subgroup means/CVs in the main
  paper (Figs. 5–7, Tables 2–4) are *derived from* this same Appendix A pool
  and go in `synthesis.csv` referencing back to it.
- del Campo et al., 2022 (*For. Ecol. Manag.*, thinning meta-analysis) —
  almost entirely `synthesis.csv` (pooled ln(RoM) effect sizes, Table 2;
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

**`ci_lower`/`ci_upper` only exist in `synthesis.csv`, and only ever bound
`value_point` in the *same row*.** A raw observation has no CI (it's not a
statistical estimate). If a paper reports two different estimates for one
process (e.g. a pooled ln(RoM) and a separate regression intercept), that's
two rows, not one row with two CI pairs.

**`site_id` (in `observations.csv`) is a canonical cross-review identity,
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

**`model_id` groups `synthesis.csv` rows belonging to one overarching result**
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
descriptions in `synthesis.csv`**, not just bare labels — `forest_change_metric`
+ `forest_change_description`, `hydro_response_metric` +
`hydro_response_description` + `response_formula`. Bare labels like `Sf` or
`ln(RoM)` aren't self-explanatory without the paper's notation in hand.
These are metric-level constants (same description repeated across every row
sharing that metric) — kept distinct from `direction_note`, which is
row-specific interpretive commentary about that particular comparison. Don't
collapse the two.

## Open / unfinished work
- Full extraction of all 312 Zhang rows and all 172 Yang rows into
  `observations.csv` proper (currently only worked examples exist).
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