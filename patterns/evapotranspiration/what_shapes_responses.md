---
title: "What Shapes Responses: Watershed Controls on Hydrologic Response to Vegetation Change"
topic: [evapotranspiration, streamflow, vegetation_change]
kind: relationship
model: water
parent: evapotranspiration_or_streamflow__response_to_vegetation_change
related_content:
  - label: "Water cycle response to vegetation change"
    type: relationship
    href: /wiki/evapotranspiration_or_streamflow__response_to_vegetation_change
  - label: "Watershed studies of disturbance effects on hydrology"
    type: relationship
    href: /wiki/watershed_disturbance_synthesis
  - label: "Vegetation response to water availability"
    type: relationship
    href: /wiki/vegetation_response_to_water_availability
  - label: "Evapotranspiration"
    type: flux
    href: /models/water/fluxes/process_evapotranspiration
  - label: "Root-accessible subsurface moisture"
    type: parameter
    href: /models/water/parameters/subsurface-moisture-root-accessible
  - label: "Measuring soil moisture"
    type: observation
    href: /models/water/observations/obs_soil_moisture
  - label: "Leaf Area Index"
    type: parameter
    href: /models/vegetation-som/parameters/leaf_area
controls_list:
  csv: patterns/evapotranspiration/examplepapers/hydro_controls.csv
  evidence_csv: patterns/evapotranspiration/examplepapers/hydro_controls_evidence.csv
  heading: "## The controls"
  evidence_href: "#the_evidence"
dataset_table:
  csv: patterns/evapotranspiration/examplepapers/hydro_controls_evidence.csv
  heading: "## The evidence"
  title: "One row per paper × control claim"
  row_noun: claim
  row_id_column: evidence_id
  search_placeholder: "Search study, effect or context…"
  search_columns: [study_citation, location_name, region, effect_summary, context_note, model_used, notes_flags, koppen_geiger, whittaker_biome]
  filters:
    - column: control_id
      label: Control
    - column: finding
      label: Finding
    - column: hydro_response_metric
      label: Response metric
      separator: ";"
    - column: veg_change_type
      label: Vegetation change
    - column: disturbance_class
      label: Disturbance class
    - column: method
      label: Method
    - column: koppen_geiger
      label: "Köppen class"
    - column: whittaker_biome
      label: Biome
  columns:
    - key: study_citation
      label: Study
      wrap: true
    - key: control_id
      label: Control
    - key: finding
      label: Finding
    - key: effect_summary
      label: Effect
      wrap: true
    - key: hydro_response_metric
      label: Response metric
      wrap: true
    - key: veg_change_type
      label: Vegetation change
    - key: disturbance_class
      label: Disturbance class
    - key: method
      label: Method
    - key: koppen_geiger
      label: "Köppen"
    - key: whittaker_biome
      label: Biome
      wrap: true
    - key: geo_basis
      label: "Climate basis"
    - key: claim_strength
      label: Claim
    - key: extraction_source
      label: Source type
    - key: cited_via
      label: Cited via
      wrap: true
    - key: confidence
      label: Confidence
    - key: context_note
      label: Context
      wrap: true
---

Plot to watershed scale hydrologic responses to vegetation change vary in how much, *for how long*, and *in which direction* — current working hypothesis on processes, states and drivers of what controls or shapes responses are summarized here.  How important a given control is will to vary across biomes and climates.  Evidence of the importance of different controls come from a variety of methods.  

This page collects papers that document different **controls**, each
with methods used and what a model would have to represent to capture
it. It is the bridge between the site-by-site numbers in
[Watershed studies of disturbance effects on hydrology](/wiki/watershed_disturbance_synthesis)
and the mechanisms in the
[conceptual model](/wiki/evapotranspiration_or_streamflow__response_to_vegetation_change). Papers providing **evidence** of different controls are provided below - These are tagged by Köppen–Geiger climate and Whitaker Biome class, with addition locational and method information provided.  Counts below indicate how much
attention a control has received, not how strong the effect is. 

## The controls

## The evidence

Each row is one paper making one claim about one control. A paper flagging two
controls appears twice. `claim_strength` separates controls that were actually
varied or measured (`tested`) from patterns attributed to a control after the
fact (`inferred`) and review-level generalizations (`synthesized`).

Köppen–Geiger class and Whittaker biome are **estimated from the named location**,
not derived from coordinates — `geo_basis` says which basis each row has. Twenty
rows name a specific place and carry a first-pass class; sixteen are reviews or
global syntheses spanning many climates and are marked `multiple` rather than
given a class the source does not support; one row reports no location. Treat the
estimated classes as a starting point for filtering, not as assignments of the
same standing as the coordinate-based ones in the observations table.
