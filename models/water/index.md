---
title: Water Model
model: water
description: Hydrological processes and water cycling in RHESSys
aliases: [hydro, hydrology]
scale: [plot, patch, stand]
---

# Water Model Overview

## Conceptual Picture of Processes

The water model in RHESSys simulates the complete hydrological cycle at the patch/plot scale, including:
- Plant water uptake and transpiration
- Soil evaporation
- Canopy interception and evaporation
- Litter evaporation
- Soil moisture dynamics
- Groundwater interactions

## Key Processes

### Evapotranspiration
- [Transpiration](water/processes/process_transpiration) - Plant water loss through stomata
- [Stomatal Conductance](water/processes/Stomatal_Conductance) - Regulation of plant water loss
- [Soil Evaporation](water/processes/Soil_Evaporation) - Direct evaporation from soil surface
- Litter Evaporation - Evaporation from litter layer
- Canopy Evaporation - Interception and evaporation from canopy

### Water Movement
- Infiltration - Water entry into soil
- Drainage - Vertical water movement
- Lateral flow - Subsurface lateral water movement
- Saturation excess runoff
- Infiltration excess runoff

## Key Parameters

- [Field Capacity](water/parameters/Field_Capacity) - Soil water holding capacity
- [Rooting Depth](water/parameters/Rooting_Depth) - Plant root extent
- [Wilting Point](water/parameters/Psi_Wilt) - Minimum plant-accessible water
- [Hydraulic Conductivity](water/parameters/saturated_hydraulic_conductivity) - Soil water transmission
- [Water Storage Capacity](water/Root_Water_Storage_Capacity) - Available water for plants

## Key Observations/Outputs

- [Transpiration](water/observations/Transpiration) - Plant water flux
- [Soil Moisture](water/observations/Soil_Moisture) - Water content in soil
- [Evapotranspiration](water/observations/ET) - Total water flux to atmosphere
- [Water Table Depth](water/observations/Water_Table_Depth) - Groundwater level

## Model Inputs

- Precipitation - Rainfall and snowfall
- Air temperature - Drives evaporative demand
- Vapor pressure deficit - Atmospheric moisture gradient
- Solar radiation - Energy for evaporation

## Connections to Other Models

The water model interacts with:
- **Carbon Model**: Water stress affects photosynthesis and plant growth
- **Nitrogen Model**: Water movement transports nutrients
- **Energy Model**: Evaporation affects surface energy balance

## References

- Tague, C.L. and Band, L.E., 2004. RHESSys: Regional Hydro-Ecologic Simulation System—An object-oriented approach to spatially distributed modeling of carbon, water, and nutrient cycling. Earth Interactions, 8(19), pp.1-42.
