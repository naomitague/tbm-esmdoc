---
title: "Measuring Precipitation (P)"
topic: [precipitation]
dataset_table:
  csv: models/water/observations/tables/precipitation_datasets_summary.csv
  heading: "# Global Products Table"
  title: "Global precipitation products"
  filter_column: category
  filter_label: "Product category"
  search_columns: [dataset, category]
  search_placeholder: "Search dataset or category…"
  row_noun: product
  columns:
    - key: dataset
      label: Dataset
    - key: category
      label: Category
    - key: resolution
      label: Resolution
      wrap: true
    - key: frequency
      label: Frequency
    - key: coverage
      label: Coverage
    - key: period
      label: Period
    - key: reference
      label: Reference
      wrap: true
    - key: website
      label: Website
      type: link
      link_label: site
    - key: file_format
      label: "File format"
---

# constituent
obs_constituent: [water]

# kind
obs_kind: [flux]

# units
obs_units: [mm/day]

# Description
Precipitation is the flux of water from the atmosphere to the land surface. Precipitaiton includes both rain and snowfall

# Process Links

## Techniques, Product Evaluation, Error/Uncertainty Papers

# Point / Local



Point measures that essential gage amount of rain that fall include accumulation gauges, tipping-bucket gauges, weighing gauges, and optical gages
Potential sources of error with these instruments include wind, evaporation, wetting, splashing, site location, instrument error, spatiotemporal variation in drop-size distribution, and frozen versus liquid precipitation impact their accuracy (Michelson, 2004;
(Strangeways, 2006; Tapiador et al., 2012).

Radar and Disdrometers capture the 3-dimensional structure of precipitation and use that to estimate rainfall

Disdrometers, 

Weather radar - captures the 3-dimensional structure of precipitaiton
# Spatial

Spatial rainfall products included gridded interpolated rain gauge data, satellite based and climate model approaches

A variety of products exists that interpolate rain gauge data - these products use climatological theory and statistical analysis, and a variety of supporting datasets (such as topographic information, and distance to water bodies, prevailing wind directions) to support interpolation - 



# Satellite based

Three categories: 
- visible/IR (VIS/IR) sensors on geostationary (GEO) and low Earth orbit (LEO) satellites, 
- passive MW (PMW) sensors on LEO satellites, and active MW sensors on LEO satel- lites

# Physically Based Models 

see [[process_precipitation]]

# Reanalysis 

Reanalysis combined physics based daynmaical models with observations


# Sources DataBases


# Global 
Sun, Q., Miao, C., Duan, Q., Ashouri, H.,
Sorooshian, S., & Hsu, K.-L. (2018). A
review of global precipitation data sets:
Data sources, estimation, and inter-
comparisons. Reviews of Geophysics, 56,
79–107. https://doi.org/10.1002/
2017RG000574

For error at a global time scale - GLCC (an extensive gridded interpolation product) is. often used as a standard - note however GLCC is integrated into several resanalysis products - thus higher performance measure would be expected

To get a sense of how uncertainty in global precipiation, we can compare estimates across products - at different spatial scales (extents)

Global - global precip pattern


Regional (probably link somewhere)
## Sources/Database

