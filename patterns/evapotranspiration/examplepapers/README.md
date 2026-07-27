# ET / forest-change literature — data schema

Two tables. One row shape per table, deliberately not unified into a single wide
table because the two record types answer different questions and mix badly
(see rationale below).

## Table 1 — `veg_hydro_response_obs.csv`
One row = one individual catchment/study observation (a real ΔF → ΔET or ΔF →
Δrunoff pair reported for one physical site, or one digitized point off a
forest plot).

**Primary source papers so far:** Yang et al., 2023 (raw, Table S5); Zhang et
al., 2017 (raw, Appendix A — 312 watersheds, confirmed this is genuinely
observation-level, not subgroup stats); del Campo et al., 2022 only where a
single study's value is digitized off a forest-plot figure (SM4–SM7), since no
observation-level table is provided in that paper's supplement.

### Column notes
- **`obs_id`**: unique key per row, prefixed by meta-source, e.g. `yang2023_002`.
- **`site_id` / `site_match_confidence`**: canonical physical-catchment
  identity, populated only once a cross-review match is confirmed or judged
  probable. Left blank by default — do not force a match. Values:
  `exact` (same name + area + precip agree), `probable` (name/area/precip
  consistent but not conclusively the same sub-watershed), `unconfirmed`
  (flagged as worth checking, not yet resolved). **Do not collapse rows that
  share a `site_id` into one value** — the two reviews may report genuinely
  different ΔF/ΔET numbers for what looks like the same site (different
  post-treatment window, rounding, or reviewer's choice of sub-period), and
  that disagreement is itself informative, not noise to average away.
- **`koppen_geiger` / `whittaker_biome`**: only populate when lat/lon (or a
  reliable published site description) is available. Zhang's Appendix A has
  **no lat/lon at all** — leave these blank rather than guessing from
  watershed name/region alone, and note that in `notes_flags`.
- **`forest_change_*` / `hydro_response_*` value bundles**: every reported
  quantity is stored as a bundle of `value_type` (`point` / `mean` / `median`
  / `range`), `value_point`, `value_min`, `value_max`, `value_sd`, plus a
  `_unit` field. Use `range` + min/max when a paper reports only a bin
  (e.g. thinning intensity 14–97%), `point` for a single reported number
  (the normal case for Yang/Zhang raw rows).
- **`method_analysis`**: the method-class code as used across all three
  papers — PWE, QPW, HM, EA, SH (Yang/Zhang's shared vocabulary), or
  "meta-analysis (individual study, forest plot)" for digitized del Campo
  points.
- No `ci_lower`/`ci_upper` columns in this table — confidence intervals only
  ever apply to a modeled/pooled estimate, never to a single raw observation.
  That's Table 2's job.

## Table 2 — `veg_hydro_response_syn.csv`
One row = one synthesis/meta-analysis result: a pooled effect size, a
regression/model coefficient, or a subgroup comparison — always something
derived across multiple observations, never a single raw data point.

**Primary source papers:** del Campo et al., 2022 (pooled ln(RoM) estimates,
Table 2; mixed-effects regression intercepts, Table 4; heterogeneity/model
diagnostics, Supplementary Table SM1); Zhang et al., 2017 (subgroup
mean/median/CV comparisons and regression fits, Tables 2–4, Figs. 2–7); Yang
et al., 2023 only for its one regression line (Fig. S5, ΔET vs ΔF for
forest-loss/forest-gain).

### Column notes
- **`forest_change_metric` / `forest_change_description`**: same idea as
  Table 1's `forest_change_metric`, but easy to forget in Table 2 since a
  synthesis row's identity often feels paper-implied rather than explicit
  (e.g. "this is a del Campo row so obviously it's about thinning"). Make it
  explicit anyway — `forest_change_metric` is the category
  (`thinning_intensity`, `forest_cover_change`), `forest_change_description`
  is one sentence of plain-language definition/units, populated once per
  metric and repeated across its rows.
- **`hydro_response_description` / `response_formula`**: `hydro_response_metric`
  is a bare label (`stemflow`, `runoff_sensitivity_Sf`) and isn't
  self-explanatory on its own — `Sf` and `ln(RoM)` both require the reader to
  already know the paper's notation. `hydro_response_description` gives the
  plain-language definition and direction convention (what a positive value
  means); `response_formula` gives the actual equation when the paper states
  one (Zhang's `Sf = |ΔQf(%)/ΔF(%)|`, del Campo's `ln(RoM) =
  ln(Control_mean/Thinned_mean)`). Both are metric-level constants — true for
  every row sharing that `hydro_response_metric` within a paper — distinct
  from `direction_note`, which is row-specific interpretive commentary (e.g.
  "WL sensitivity sig. higher than EL/EQ for *this* comparison"). Don't
  collapse the two: description avoids retyping the same definition on every
  row, direction_note captures what's particular to that row.
- **`model_id`**: groups every row belonging to one overarching synthesis
  result (e.g. all moderator tests for "del Campo stemflow", or "Zhang
  runoff-sensitivity in large watersheds"). This is the unit that `driver_rank`
  ranks *within*. Encode scale/subgroup splits as separate `model_id`s
  (`zhang2017_sensitivity_small` vs `_large`) rather than a shared model_id
  with a size column — Zhang's drivers genuinely swap importance between
  small and large watersheds (forest type matters in small, hydrological
  regime in large), and collapsing them would produce a false blended
  ranking.
- **`driver_rank` / `driver_importance_metric` / `driver_importance_value`**:
  rank is based on whatever quantitative importance measure the paper
  reports (R² for del Campo's regressions), highest value = rank 1, *not*
  the order drivers are discussed in prose (see `delcampo2022_throughfall_*`
  example rows — years-since-thinning outranks %BA-removed by R² despite
  being discussed second in text).
- **`driver_rank_basis`**: `author_reported` when the paper gives an explicit
  quantitative importance measure (del Campo's R²); `extractor_assigned` when
  no such measure exists and the ranking is your interpretive call from
  significance tests + discussion emphasis (all of Zhang's driver rows, since
  Zhang reports K-S/Mann-Whitney significance and Kendall's τ but never a
  "% heterogeneity explained" figure). Never blend the two without this flag
  — a reader needs to know whether a rank is the paper's own claim or your
  synthesis of it.
- **`ci_lower` / `ci_upper`**: only ever bound `value_point` in that same row.
  If a paper reports two different estimates for the same process (e.g. both
  a pooled ln(RoM) and a separate regression intercept), that's two rows
  under the same `model_id`, not one row with two CI pairs.
- **`stat_test_name` / `stat_test_value`**: packed as semicolon-joined pairs
  (e.g. `"z-value; p" / "3.39; <0.001"`) rather than separate p/R²/tau/z
  columns — kept deliberately loose since which statistics are reported
  varies by paper and method (del Campo: z, p; Zhang: R², Kendall's τ,
  Mann-Whitney Z, p).

## Cross-paper overlap (open issue, not yet resolved)
Confirmed 86 exact catchment-name matches between Yang's Table S5 (168 unique
names) and Zhang's Appendix A (309 unique names) — before fuzzy-matching
numbering/punctuation variants (e.g. "HJ Andrew #10" vs "HJ Andrews, #10"),
so true overlap is higher. Zhang has no lat/lon, so matching runs on
name + area (km²) + precip (mm/yr) + source citation surname, and needs
manual review rather than a clean automated join — sub-watershed numbering
(Fool Creek CO-1/2/3, Coweeta #1/#3/#6...) makes it easy to mismatch adjacent
but distinct experimental units. del Campo is a thinning meta-analysis (a
different intervention class than clearcut/afforestation), so overlap with
Yang/Zhang's underlying primary studies is expected to be low, not yet
checked systematically.
