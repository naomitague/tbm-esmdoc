---
title: "Soil moisture change response to vegetation change"
topic: [evapotranspiration, vegetation_change]
kind: relationship
model: water
parent: evapotranspiration_or_streamflow__response_to_vegetation_change
histogram_data:
  csv: patterns/evapotranspiration/examplepapers/veg_hydro_response_obs.csv
  sections:
    - type: scatter
      heading: "## Land cover change vs. Soil moisture change"
      x_column: forest_change_value_point
      y_column: hydro_response_value_point
      x_label: "Forest/land cover change (%)"
      y_label: "Soil moisture change (%)"
      filter_column: hydro_response_metric
      filter_value: soil_moisture_change
      title: "Land cover change vs. Soil moisture change"
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

Root-zone soil moisture responds to vegetation change through the balance
of transpiration demand (root density, rooting depth, leaf area) against
reduced canopy interception and shading — vegetation loss typically raises
soil moisture by cutting transpiration draw-down, though the direction and
magnitude vary with climate and disturbance type. This page collects
studies quantifying that relationship, alongside
[[evapotranspiration or streamflow _response_to_vegetation_change|
the main annual ET/streamflow page]].

# Watershed studies

## Land cover change vs. Soil moisture change

# Find Studies
