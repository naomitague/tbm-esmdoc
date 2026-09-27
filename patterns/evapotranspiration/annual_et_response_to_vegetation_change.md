---
title: "Annual ET response to vegetation change"
topic: [evapotranspiration, vegetation_change]
kind: relationship
model: water
related_content:
  - label: "Water cycle response to vegetation change"
    type: relationship
    href: /wiki/evapotranspiration_or_streamflow__response_to_vegetation_change
  - label: "Evapotranspiration"
    type: flux
    href: /models/water/fluxes/process_evapotranspiration
  - label: "Measuring Evapotranspiration (ET)"
    type: observation
    href: /models/water/observations/obs_et
  - label: "Transpiration"
    type: flux
    href: /models/water/fluxes/process_transpiration
  - label: "Measuring transpiration"
    type: observation
    href: /models/water/observations/obs_transpiration
  - label: "Leaf Area Index"
    type: parameter
    href: /models/vegetation-som/parameters/leaf_area
  - label: "Measuring LAI"
    type: observation
    href: /models/vegetation-som/observations/obs_lai
  - label: "Vegetation biomass"
    type: parameter
parent: evapotranspiration_or_streamflow__response_to_vegetation_change
histogram_data:
  csv: patterns/evapotranspiration/examplepapers/veg_hydro_response_obs.csv
  sections:
    - type: scatter
      heading: "## Land cover change vs. Annual ET change"
      x_column: forest_change_value_point
      y_column: hydro_response_value_point
      x_label: "Forest/land cover change (%)"
      y_label: "ET change (%)"
      filter_column: hydro_response_metric
      filter_value: ET
      title: "Land cover change vs. Annual ET change"
  table_columns:
    - key: location_name
      label: "Site / study"
      fallback_key: obs_id
      subtitle_key: study_citation
    - key: forest_change_value_point
      label: "Forest change"
      unit_key: forest_change_unit
      min_key: forest_change_value_min
      max_key: forest_change_value_max
      caption_key: forest_change_metric
      numeric: true
    - key: hydro_response_value_point
      label: "Hydro response"
      unit_key: hydro_response_unit
      min_key: hydro_response_value_min
      max_key: hydro_response_value_max
      caption_key: hydro_response_metric
      numeric: true
    - key: method_analysis
      label: Method
    - key: watershed_area_km2
      label: "Area (km²)"
      numeric: true
    - key: notes_flags
      label: Notes
      wrap: true
      muted: true
---

# Conceptual Model

Annual evapotranspiration is the most commonly reported hydrologic response
to vegetation change — it directly reflects the balance of transpiration
demand (rooting depth, leaf area, stomatal control) against reduced canopy
interception and shading after vegetation loss, or the reverse after
afforestation. This page collects studies quantifying that relationship,
alongside
[[evapotranspiration or streamflow _response_to_vegetation_change|
the main water cycle response page]].

# Watershed studies

## Land cover change vs. Annual ET change

# Find Studies
