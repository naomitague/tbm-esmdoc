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
- [Transpiration](tbm-RHESSys-Obs-main/models/water/processes/Transpiration.md) - Plant water loss through stomata
- [Stomatal Conductance](stomatal_Conductance.md) - Regulation of plant water loss
- [Soil Evaporation](soil_evaporation.md) - Direct evaporation from soil surface
- Litter Evaporation - Evaporation from litter layer
- Canopy Evaporation - Interception and evaporation from canopy

### Water Movement
- Infiltration - Water entry into soil
- Drainage - Vertical water movement
- Lateral flow - Subsurface lateral water movement
- Saturation excess runoff
- Infiltration excess runoff

## Key Parameters

- [Field Capacity](Field_Capacity.md) - Soil water holding capacity
- [Rooting Depth](Rooting_Depth.md) - Plant root extent
- [Wilting Point](tbm-RHESSys-Obs-main/models/water/parameters/Psi_Wilt.md) - Minimum plant-accessible water
- [Hydraulic Conductivity](parameters/saturated_hydraulic_conductivity) - Soil water transmission
- [Water Storage Capacity](Root_Water_Storage_Capacity.md) - Available water for plants

## Key Observations/Outputs

- [Transpiration](tbm-RHESSys-Obs-main/models/water/observations/Transpiration.md) - Plant water flux
- [Soil Moisture](Soil_Moisture.md) - Water content in soil
- [Evapotranspiration](ET.md) - Total water flux to atmosphere
- [Water Table Depth](Water_Table_Depth.md) - Groundwater level

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
