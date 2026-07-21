---
histogram_data:
  csv: patterns/evapotranspiration/examplepapers/observations.csv
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

# Conceptual Model



It is well established that vegetation loss (through mortality, thinning, fuel treatment, fire) or gain (afforestation, growth)  impacts the water cycle - through by altering transpiration and evaporation (through canopy interception and shading and longwave impacts on surface evaporative fluxes), feedbacks to climate, changing infiltration and snowmelt.




# Methods used to quantify relationship

[[Metrics_for_ETstreamflow_responses_tovegchange]]

# Summary global scale statistics

# Watershed studies

## Histogram by climate category



## Histogram by biome



## Locate a study


# Interactions/Dependencies
    * watershed size
    * aridity
    * snow-vs-rain
    * aspect
    * riparian-upland
    * forest type
    * disturbance type

# Find Studies
