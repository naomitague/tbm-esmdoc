---
title: "Watershed studies of disturbance effects on hydrology"
topic: [evapotranspiration, streamflow, vegetation_change]
kind: relationship
model: water
parent: evapotranspiration_or_streamflow__response_to_vegetation_change
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
  - label: "Streamflow"
    type: flux
  - label: "Streamflow observations"
    type: observation
  - label: "Measuring soil moisture"
    type: observation
    href: /models/water/observations/obs_soil_moisture
  - label: "Root-accessible subsurface moisture"
    type: parameter
    href: /models/water/parameters/subsurface-moisture-root-accessible
  - label: "Leaf Area Index"
    type: parameter
    href: /models/vegetation-som/parameters/leaf_area
  - label: "Measuring LAI"
    type: observation
    href: /models/vegetation-som/observations/obs_lai
  - label: "Vegetation biomass"
    type: parameter
metric_response_data:
  csv: patterns/evapotranspiration/examplepapers/veg_hydro_response_obs.csv
  sections:
    - title: "Pick a response metric"
      metric_column: hydro_response_metric
      default_metric: ET
      note: >-
        Scroll down to pick a different response metric, to see the vegetation-change
        metrics studies report, and to see how the studies are distributed by climate
        category and biome.
      known_metrics:
        - value: ET
          label: "Annual ET"
          link: /wiki/annual_et_response_to_vegetation_change
        - value: runoff
          label: "Annual streamflow"
          link: /wiki/annual_streamflow_response_to_vegetation_change
        - value: peak_flow
          label: "Peak streamflow"
          link: /wiki/peak_flow_response_to_vegetation_change
        - value: low_flow
          label: "Low flows"
          link: /wiki/low_flow_response_to_vegetation_change
        - value: interception_loss
          label: "Interception loss"
          link: /wiki/interception_loss_response_to_vegetation_change
        - value: soil_moisture_change
          label: "Soil moisture change"
          link: /wiki/soil_moisture_change_response_to_vegetation_change
      x_column: forest_change_value_point
      x_label: "Forest/land cover change (%)"
      y_column: hydro_response_value_point
      y_label: "Hydrologic response (%)"
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
    - heading: "## Studies by vegetation change metric"
      title: "Studies by vegetation change metric"
      metric_column: forest_change_metric
      known_metrics:
        - value: forest_cover_change
          label: "% Forest/land cover change"
        - value: LAI_change
          label: "Change in LAI"
        - value: biomass_change
          label: "Change in biomass"
      x_column: forest_change_value_point
      x_label: "Forest/land cover change (%)"
      y_column: hydro_response_value_point
      y_label: "Hydrologic response (%)"
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
histogram_data:
  csv: patterns/evapotranspiration/examplepapers/veg_hydro_response_obs.csv
  sections:
    - heading: "## Histogram by climate category"
      column: koppen_geiger
      title: "Köppen–Geiger climate class"
    - heading: "## Histogram by biome"
      column: whittaker_biome
      title: "Whittaker biome"
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

## Studies by vegetation change metric

# Summary of Watershed Studies

Each row behind these histograms is one catchment observation — a discrete,
locally-imposed change in forest cover (harvest, thinning, fire, afforestation)
at a gauged watershed, paired with the hydrologic response reported for it.
Click a bar to see the studies it holds.

## Histogram by climate category

## Histogram by biome
