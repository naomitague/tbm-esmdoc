---
title: Water Model
model: water
description: Hydrological fluxes and water cycling
aliases: [hydro, hydrology]
scale: [plot, patch, stand]
process_diagram:
  svg: figures/hydrology_full_diagram.svg
  coverage: esms/process_coverage.csv
  links:
    - process_ids: [leaf_growth, stem_growth, root_growth, growth]
      href: /models/vegetation-som
      title: "Dynamic Vegetation and SOM Model"
# pulls in vegetation_change relationships owned by another model — the
# vegetation-side response to water availability is as much a water-model
# relationship as the hydrologic response to vegetation change.
relationship_topics: [vegetation_change]
---

## Alternative viz

- show just water fluxes
- show just water stores
- show both
- show parameters
- show first connections to other stores - e.g LAI, height
- highlight only fluxes/stores/parameters that have measurement pages
- show dependencies for any flux or store (hierarchical graphs)

## Theory / papers on relationships of interest

- user can select from left (fluxes, stores, parameters)
- user can identify
    - space (scale, location)
    - time (scale, location)
    (these are based on tags)
- [ET / streamflow response to vegetation change](/wiki/evapotranspiration_or_streamflow__response_to_vegetation_change) —
  conceptual model, response metrics, and histograms of the literature-synthesis
  catchments by Köppen–Geiger class and Whittaker biome (click a bar for the
  underlying observations)

