---
title: "Global vegetation change and ET"
topic: [evapotranspiration, vegetation_change]
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
  - label: "Leaf Area Index"
    type: parameter
    href: /models/vegetation-som/parameters/leaf_area
  - label: "Measuring LAI"
    type: observation
    href: /models/vegetation-som/observations/obs_lai
  - label: "Vegetation biomass"
    type: parameter
estimate_chart:
  csv: patterns/evapotranspiration/examplepapers/global_veg_greening_hydro.csv
  heading: "## Global and regional trend estimates"
  title: "Share of the observed ET trend attributed to vegetation greening"
  value_column: "Attribution Percent"
  min_column: "Attribution Percent Min"
  max_column: "Attribution Percent Max"
  label_column: Citation
  sublabel_column: "Trend Period"
  tooltip_columns: ["Attribution Method", "Trend"]
  axis_label: "% of the ET trend attributed to greening"
  axis_min: 0
  axis_max: 100
  unit: "%"
  row_id_column: "Estimate ID"
  note: "Click a point for its row in the table. Estimates reported only as a correlation (no share of the trend) are listed below but not plotted."
dataset_table:
  csv: patterns/evapotranspiration/examplepapers/global_veg_greening_hydro.csv
  heading: "## Global and regional trend estimates"
  row_id_column: "Estimate ID"
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

# Summary of Global and Regional Studies

Global and regional syntheses ask a different question than the paired-watershed
studies. Rather than a discrete, locally-imposed change in forest cover
(harvest, thinning, fire, afforestation) at a gauged catchment, these studies
estimate a broad-scale trend in a hydrologic flux — typically from remotely
sensed or model-reconstructed products — and then attribute some fraction of
that trend to gradual, diffuse vegetation change (greening, expressed as a
change in LAI). Because the vegetation "treatment" is neither controlled nor
sharply bounded in space or time, attribution rests on regression or on
simulation experiments rather than on a before/after or paired-catchment
contrast, and the reported effect is a share of a trend rather than a percent
change in response to a percent change in cover.



## Global and regional trend estimates
