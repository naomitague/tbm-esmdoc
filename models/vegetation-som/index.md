---
title: Dynamic Vegetation and SOM Model
model: vegetation-som
description: Carbon, nitrogen and nutrient cycling in vegetation and soils
aliases: [carbon cycle, photosynthesis, NPP, nitrogen cycle, nutrient cycling]
scale: [plant, plot, patch]
process_diagram:
  svg: figures/vegetation_full_diagram.svg
  coverage: esms/process_coverage.csv
  links:
    # the blue (water-dimension) boxes → the water model overview
    - process_ids: [leaf_transpiration, leaf_interception_evaporation, leaf_stomatal_conductance, stem_xylem_transport, root_water_uptake, root_xylem_transport]
      href: /models/water
      title: "Water Model"
relationship_topics: [vegetation_change]
---

## Alternative viz

- show just carbon fluxes
- show just carbon stores
- show both
- show parameters
- show first connections to other stores - e.g LAI, height
- highlight only fluxes/stores/parameters that have measurement pages

## Dependencies and Details

- show dependencies for any flux or store (hierarchical graphs)

## Theory / papers on what are key controls or how patterns are organized

- user can select from left (fluxes, stores, parameters)
- user can identify
    - space (scale, location)
    - time (scale, location)
    (these are based on tags)

## References

search references database (or find by alternative models, current model), or find ones that occur frequently (cover many fluxes, etc)

## Dependencies and Details

- show dependencies for any flux or store (hierarchical graphs)

## Theory / papers on what are key controls or how patterns are organized

- user can select from left (fluxes, stores, parameters)
- user can identify
    - space (scale, location)
    - time (scale, location)
    (these are based on tags)

## References

search references database (or find by alternative models, current model), or find ones that occur frequently (cover many fluxes, etc)
