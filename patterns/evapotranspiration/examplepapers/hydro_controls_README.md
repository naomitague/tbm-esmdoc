# What Shapes Responses — controls tables

Two CSVs backing `what_shapes_responses.md` (child of the Water cycle response to vegetation change hub).

## hydro_controls.csv — vocabulary (one row per control)

| Column | Meaning |
|---|---|
| `control_id` | stable key; joins to the evidence table |
| `display_order`, `group` | page ordering; groups mirror the concept map (Climate & timing, Disturbance footprint, Vegetation Pre/Post, Topography & surface energy, Snow, Soils & subsurface) |
| `label`, `definition`, `why_it_matters` | text shown on the page |
| `concept_map_node` | node name(s) in `vegetation_hydrology_flow.svg`; `;`-separated |
| `model_link_type` | `process` · `parameter` · `structure` · `dynamics` · `scenario` · `forcing_scenario` (`;`-separated when mixed). `forcing_scenario` = about experiment design, not model coverage — do not show as a coverage gap |
| `model_representation_needed` | plain-language description of what a model must represent |
| `process_ids` | ids from `esms/process_coverage.csv`, `;`-separated. Currently `TBD` |
| `process_id_status` | `needs_mapping` · `mapped` · `needs_new_id` · `not_applicable` |

## hydro_controls_evidence.csv — one row per paper × control claim

| Column | Allowed values / meaning |
|---|---|
| `extraction_source` | `primary` (read from the paper) · `primary_review` (a review's own synthesis claim) · `secondary_via_review` (a primary study as described by a review — verify against the original) |
| `cited_via` | the review a secondary row came from |
| `koppen_geiger`, `whittaker_biome` | blank until assigned; follow the obs-table convention and flag geocoded values as lower confidence |
| `veg_change_type` | `thinning` · `wildfire` · `insect_mortality` · `drought_mortality` · `harvest_clearcut` · `type_conversion` · `multiple` |
| `disturbance_class` | `stand_replacing` · `non_stand_replacing` · `partial_removal` · `mixed` · `na` |
| `hydro_response_metric` | `water_yield` · `peak_flow` · `low_flow` · `ET` · `SWE` · `snow_disappearance` · `soil_moisture` (plus ecological: `LAI`, `NPP`, `biomass`) |
| `method` | `observation` · `simulation` · `observation_and_simulation` · `statistical_analysis` · `review` |
| `claim_strength` | `tested` (control varied or measured directly) · `inferred` (observed pattern attributed to the control) · `synthesized` (review-level pattern) · `proposed` (hypothesis/discussion only) |
| `finding` | `important` · `not_important` · `conditional` · `contested` |
| `effect_summary`, `context_note` | paraphrased, never quoted |
| `confidence` | `high` · `medium` · `low` |

Rules: one control per row (a paper flagging two controls gets two rows); record null findings as `not_important`; flag unresolved items in `notes_flags` rather than guessing.
