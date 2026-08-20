---
title: "Water cycle response to vegetation change"
topic: [evapotranspiration, transpiration, streamflow, vegetation_change]
kind: relationship
model: water
related_content:
  - label: "Evapotranspiration"
    type: flux
    href: /models/water/fluxes/process_evapotranspiration
  - label: "Streamflow"
    type: flux
  - label: "Measuring Evapotranspiration (ET)"
    type: observation
    href: /models/water/observations/obs_et
  - label: "Streamflow observations"
    type: observation
  - label: "Vegetation biomass"
    type: parameter
metric_response_data:
  csv: patterns/evapotranspiration/examplepapers/veg_hydro_response_obs.csv
  sections:
    - heading: "## Studies by response metric"
      title: "Studies by response metric"
      metric_column: hydro_response_metric
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
dataset_table:
  csv: patterns/evapotranspiration/examplepapers/global_veg_greening_hydro.csv
  heading: "## Global and regional trend estimates"
  title: "Reported global/regional vegetation-change effects on the water cycle"
  filter_column: "Hydrologic Response"
  filter_label: "Hydrologic response"
  search_columns: ["Citation", "Hydrologic Response", "Attribution", "Attribution Method", "Vegetation Metric", "ET Estimation Basis"]
  search_placeholder: "Search study, response, or attribution…"
  row_noun: estimate
  columns:
    - key: Citation
      label: Study
    - key: "Hydrologic Response"
      label: "Hydrologic response"
    - key: Trend
      label: Trend
    - key: "Trend Period"
      label: Period
    - key: "Vegetation Metric"
      label: "Vegetation metric"
      wrap: true
    - key: Attribution
      label: "Attribution to vegetation"
      wrap: true
    - key: "Attribution Method"
      label: "Attribution method"
      wrap: true
    - key: "ET Estimation Basis"
      label: "ET estimation basis"
      wrap: true
---

# Conceptual Model


It is well established that vegetation loss (through mortality, thinning, fuel treatment, fire) or gain (afforestation, growth)  impacts the water cycle - through by altering transpiration and evaporation (through canopy interception and shading and longwave impacts on surface evaporative fluxes), feedbacks to climate, changing infiltration and snowmelt.

```mermaid
flowchart TD
  HUB["Veg–hydro relationship"]

  VEG["Vegetation"]
  VEG_CM["Change metric<br/>%cover, %biomass, structural Δ"]
  VEG_M["Method<br/>Remote sensing, written plans"]

  HYD["Hydrology"]
  HYD_RM["Response metric<br/>Streamflow, ET, interception,<br/>groundwater, soil moisture, snowpack"]
  HYD_TS["Time-scale<br/>Annual, seasonal,<br/>peaks/lows, variability"]
  HYD_M["Method<br/>Model, RS, instrumented"]

  REL["Relationship"]

  SPC["Space"]
  SPC_REG["Region"]
  SPC_BIO["Biome"]
  SPC_ATT["Attributes<br/>Topography, species,<br/>disturbance type"]

  TIME["Time"]
  TIME_DUR["Duration<br/>Short-term (1 yr),<br/>recovery, long-term"]

  AM["Analysis method"]
  AM_LSM["LSM"]
  AM_EMP["Empirical"]
  AM_EMPT["Empirical type<br/>Paired, before/after"]

  HUB --> VEG
  HUB --> REL
  HUB --> HYD

  VEG --> VEG_CM --> VEG_M
  HYD --> HYD_RM --> HYD_TS --> HYD_M

  REL --> SPC
  REL --> TIME
  REL --> AM

  SPC --> SPC_REG --> SPC_ATT
  SPC --> SPC_BIO --> SPC_ATT
  TIME --> TIME_DUR
  AM --> AM_LSM
  AM --> AM_EMP --> AM_EMPT

  classDef hub fill:#F1EFE8,stroke:#5F5E5A,color:#2C2C2A;
  classDef veg fill:#EAF3DE,stroke:#3B6D11,color:#27500A;
  classDef hyd fill:#E6F1FB,stroke:#185FA5,color:#0C447C;
  classDef rel fill:#F1EFE8,stroke:#5F5E5A,color:#2C2C2A;
  classDef spc fill:#FAEEDA,stroke:#854F0B,color:#633806;
  classDef time fill:#FBEAF0,stroke:#993556,color:#72243E;
  classDef anal fill:#FAECE7,stroke:#993C1D,color:#712B13;

  class HUB hub;
  class VEG,VEG_CM,VEG_M veg;
  class HYD,HYD_RM,HYD_TS,HYD_M hyd;
  class REL rel;
  class SPC,SPC_REG,SPC_BIO,SPC_ATT spc;
  class TIME,TIME_DUR time;
  class AM,AM_LSM,AM_EMP,AM_EMPT anal;
```




# Methods used to quantify relationship

Below are some summaries of available studies organized by different categries - click on metric to see available studies and for some metrics summaries of relationship between vegetation change and hydrologic response



## Studies by response metric

## Studies by vegetation change metric

# Summary of Watershed Studies

## Histogram by climate category



## Histogram by biome

# Summary of Global and Regional Studies

Global and regional syntheses ask a different question than the paired-watershed
studies above. Rather than a discrete, locally-imposed change in forest cover
(harvest, thinning, fire, afforestation) at a gauged catchment, these studies
estimate a broad-scale trend in a hydrologic flux — typically from remotely
sensed or model-reconstructed products — and then attribute some fraction of
that trend to gradual, diffuse vegetation change (greening, expressed as a
change in LAI). Because the vegetation "treatment" is neither controlled nor
sharply bounded in space or time, attribution rests on regression or on
simulation experiments rather than on a before/after or paired-catchment
contrast, and the reported effect is a share of a trend rather than a percent
change in response to a percent change in cover.

The estimates below therefore aren't directly comparable to the watershed
numbers: they differ in the vegetation metric (LAI vs. % cover/basal area), in
how the hydrologic response is measured (multi-product ensembles or coupled
model output vs. gauged streamflow), and in what "attribution" means.

## Global and regional trend estimates
