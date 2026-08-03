---
title: "Peak streamflow response to vegetation change"
topic: [streamflow, vegetation_change]
kind: relationship
model: water
parent: evapotranspiration_or_streamflow__response_to_vegetation_change
histogram_data:
  csv: patterns/evapotranspiration/examplepapers/veg_hydro_response_obs.csv
  sections:
    - type: scatter
      heading: "## Land cover change vs. Peak streamflow change"
      x_column: forest_change_value_point
      y_column: hydro_response_value_point
      x_label: "Forest/land cover change (%)"
      y_label: "Peak streamflow change (%)"
      filter_column: hydro_response_metric
      filter_value: peak_flow
      title: "Land cover change vs. Peak streamflow change"
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

Vegetation loss or gain can change the magnitude and timing of peak
streamflow events — less canopy interception and lower transpiration-driven
soil moisture deficits ahead of storms can mean more, and faster, runoff
reaching the channel during high-flow events; the reverse holds for
vegetation gain. This page collects studies quantifying that relationship,
alongside [[evapotranspiration or streamflow _response_to_vegetation_change|
the main annual ET/streamflow page]].

# Watershed studies

## Land cover change vs. Peak streamflow change

# Find Studies
