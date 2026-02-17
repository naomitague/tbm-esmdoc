---
title: Energy Model
model: energy
description: Energy balance and radiation processes in RHESSys
aliases: [energy balance, radiation, heat flux]
scale: [canopy, plot, patch]
---

# Energy Model Overview

Target ESM: RHESSys, https://github.com/RHESSys/RHESSys.git, develop branch

## Conceptual Overview

The energy model in RHESSys simulates the surface energy balance, radiation transfer through the canopy, and temperature dynamics that control many ecosystem processes.

## Key Processes

### Radiation Transfer
- Shortwave radiation absorption
- Longwave radiation exchange
- Canopy radiation interception
- Albedo and reflectance
- Photosynthetically active radiation (PAR)

### Energy Fluxes
- Net radiation
- Sensible heat flux
- Latent heat flux (evapotranspiration)
- Ground heat flux
- Canopy heat storage

### Temperature Dynamics
- Canopy temperature
- Soil temperature
- Snow temperature
- Surface temperature

### Snow Processes
- Snow accumulation
- Snowmelt energy balance
- Snow albedo dynamics
- Snow sublimation

## Key Parameters

- Canopy albedo
- Soil albedo
- Emissivity
- Canopy extinction coefficients
- Leaf angle distribution
- Surface roughness parameters
- Snow albedo parameters

## Key Observations/Outputs

- Net radiation
- Sensible heat flux
- Latent heat flux
- Ground heat flux
- Canopy temperature
- Soil temperature
- Snow depth and snow water equivalent

## Model Inputs

- Incoming shortwave radiation
- Incoming longwave radiation
- Air temperature
- Wind speed
- Relative humidity
- Cloud cover

## Connections to Other Models

The energy model interacts with:
- **Water Model**: Latent heat flux equals evapotranspiration; energy balance determines snowmelt
- **Carbon Model**: PAR drives photosynthesis; temperature affects respiration and growth
- **Nitrogen Model**: Temperature controls nitrogen transformation rates

## References

- Tague, C.L. and Band, L.E., 2004. RHESSys: Regional Hydro-Ecologic Simulation System.
- Running, S.W. and Coughlan, J.C., 1988. A general model of forest ecosystem processes for regional applications.
