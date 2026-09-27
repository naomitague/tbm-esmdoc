---
title: "Water cycle response to vegetation change"
topic: [evapotranspiration, transpiration, streamflow, vegetation_change]
kind: relationship
model: water
related_content:
  - label: "Vegetation response to water availability"
    type: relationship
    href: /wiki/vegetation_response_to_water_availability
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
  - label: "Leaf Area Index"
    type: parameter
    href: /models/vegetation-som/parameters/leaf_area
  - label: "Measuring LAI"
    type: observation
    href: /models/vegetation-som/observations/obs_lai
  - label: "Vegetation biomass"
    type: parameter
page_links:
  # sidebar-only: these live in the left panel, not spliced into the body
  sidebar: true
  sidebar_title: "Worked syntheses"
  items:
    - label: "Watershed studies of disturbance effects on hydrology"
      href: /wiki/watershed_disturbance_synthesis
    - label: "Global vegetation change and ET"
      href: /wiki/global_vegetation_change_et
concept_diagram:
  svg: figures/vegetation_hydrology_flow.svg
  text_scale: 1.25
  heading: "# Conceptual Model"
  links:
    - process_ids: [input_temperature, input_precipitation, input_radiation, input_humidity, input_wind]
      href: /models/climate
      title: "Climate Model"
      type: model
    - process_ids: [leaf_growth, stem_growth, root_growth, growth]
      href: /models/vegetation-som
      title: "Dynamic Vegetation and SOM Model"
      type: model
    - process_ids: [leaf_transpiration, leaf_interception_evaporation, soil_evaporation, litter_evaporation]
      href: /models/water/fluxes/process_evapotranspiration
      title: "Evapotranspiration"
      type: flux
    - process_ids: [leaf_transpiration, leaf_interception_evaporation, soil_evaporation, litter_evaporation]
      href: /wiki/annual_et_response_to_vegetation_change
      title: "Annual ET response to vegetation change"
    - process_ids: [leaf_interception_evaporation]
      href: /wiki/interception_loss_response_to_vegetation_change
      title: "Interception loss response to vegetation change"
    - process_ids: [soil_water_storage, soil_macropore_flow, lateral_shallow_subsurface, lateral_groundwater]
      href: /wiki/soil_moisture_change_response_to_vegetation_change
      title: "Soil moisture response to vegetation change"
    - process_ids: [soil_water_storage]
      href: /models/water/observations/obs_soil_moisture
      title: "Measuring soil moisture"
      type: observation
    - process_ids: [river_channel_flow, river_hyporheic_flow, river_large_waterbody_mixing, lateral_surface]
      href: /wiki/annual_streamflow_response_to_vegetation_change
      title: "Annual streamflow response to vegetation change"
    - process_ids: [river_channel_flow, river_hyporheic_flow, river_large_waterbody_mixing, lateral_surface]
      href: /wiki/peak_flow_response_to_vegetation_change
      title: "Peak flow response to vegetation change"
    - process_ids: [river_channel_flow, river_hyporheic_flow, river_large_waterbody_mixing, lateral_surface]
      href: /wiki/low_flow_response_to_vegetation_change
      title: "Low flow response to vegetation change"
    # the upward "hydro to veg" arrow inside the two-way arrow
    - process_ids: [veg_response_to_water]
      href: /wiki/vegetation_response_to_water_availability
      title: "Vegetation response to water availability"
  considerations:
    - title: Time
      subtitle: "when, and over what interval"
      items:
        - label: "Time since the change"
        - label: "Averaging interval"
        - label: "Climate during the record"
    - title: Space
      subtitle: "where, and at what scale"
      items:
        - label: "Where"
        - label: "Extent"
        - label: "Position in the landscape"
        - label: "Fraction of the area changed"
    - title: "Analysis method"
      subtitle: "how the relationship is established"
      items:
        - label: "Paired catchment / BACI"
        - label: "Single-catchment before/after"
        - label: "Regression and attribution across space"
        - label: "Process-model experiments"
        - label: "Metrics and effect sizes"
          href: /wiki/metrics_for_etstreamflow_responses_tovegchange
    - title: "Estimation uncertainty"
      subtitle: "how well each side is known"
      items:
        - label: "Vegetation change"
        - label: "Hydrology change"
        - label: "Observation uncertainty / error"
        - label: "Model uncertainty / error"
---

# Conceptual Model

It is well established that vegetation loss (through mortality, thinning, fuel
treatment, fire) or gain (afforestation, growth) alters the water cycle — by
changing transpiration and evaporation (through canopy interception, shading
and longwave effects on surface evaporative fluxes), by feeding back to
climate, and by changing infiltration and snowmelt.

The coupling runs both ways, which is why the main arrow in the figure
points in both directions. Water availability limits growth, triggers drought
mortality, and shifts species composition — so the hydrologic state is itself a
driver of the vegetation change that altered it. The pages collected here
follow the vegetation → hydrology direction because that is how the literature
is organized, the two are
not separable: part of what looks like a hydrologic response to vegetation
change is the water cycle acting back on the vegetation.

 Click a box to open the page documenting it; boxes with no
page yet are shown for context.

