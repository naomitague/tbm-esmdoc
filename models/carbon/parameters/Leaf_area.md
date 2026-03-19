parameter_name: Leaf Area Index

aliases: LAI

status: todo  
Target ESM: RHESSys, https://github.com/RHESSys/RHESSys.git, develop branch  

tags: [parameter, vegetation, canopy, plant]  

# If used to create other parameters, list here  
# Used to calculate interception, evapotranspiration, photosynthesis

# Dynamically computed:  
Yes  

# Select one or more from: geology physical,  geochemical, plant, landuse, snow, climate  
parameter_classification [plant]  

# Select one: hour, day, month, year, NA  
parameter_time_scale: day  

# Select one: mm, m, km, plant,NA  
parameter_space_scale: plant  

# Select one: abstract, physical not measurable, measurable  
parameter_realism: measurable  

# Specify units (e.g., mm/day, gC/m², dimensionless, percent)  
parameter_units: dimensionless  

# Select one: rate, capacity, ratio, count, store, depth, other  
parameter_function: ratio  

# Description  
Leaf Area Index (LAI) is the one-sided green leaf area per unit ground surface area. It is a key parameter in modeling canopy processes such as transpiration, interception, and photosynthesis. RHESSys partitions LAI into *sunlit* and *shaded* components to account for differences in radiation interception, photosynthetic capacity, and transpiration.

# Range  
Typical values range from 0 (bare ground) to ~10 (dense tropical forest), with most natural vegetation falling within ~0.5–6.

# Conceptual or mathematical model of parameter variation or controls on the parameter  

## From leaf carbon to projected LAI

Projected LAI is calculated from the current leaf carbon pool ($cs.leaf$) and a vegetation-specific conversion factor ($LAI_{sp}$):

$$
LAI_{proj} = cs.leaf \times LAI_{sp}
$$

- $cs.leaf$: leaf carbon pool (gC/m²)  
- $LAI_{sp}$: specific leaf area index (m² leaf / gC), vegetation-type specific

## Partitioning sunlit vs shaded LAI

Sunlit and shaded LAI components are computed using solar geometry and canopy gap fraction ($GF$):

$$
LAI_{sunlit} = 2.0 \cdot \cos(\theta_{noon}) \cdot \left[1.0 - \exp\left(-0.5 \cdot (1 - GF) \cdot \frac{LAI_{proj}}{\cos(\theta_{noon})}\right)\right]
$$

$$
LAI_{shaded} = LAI_{proj} - LAI_{sunlit}
$$

- $\theta_{noon}$: solar zenith angle at noon  
- $GF$: canopy gap fraction (dimensionless)


# Function in the model  
RHESSys dynamically computes LAI each timestep based on carbon allocation. LAI influences interception, radiation attenuation, photosynthesis, and transpiration by modifying canopy radiation fluxes and gas exchange.

# Sources  
## Databases  
- MODIS LAI (MOD15A2H): https://lpdaac.usgs.gov/products/mod15a2hv061/  
- Copernicus Global Land Service: https://land.copernicus.eu/global/products/lai  

## Measurements  
- Optical instruments (e.g., LAI-2200, hemispherical photos)  
- LIDAR and UAV canopy reconstructions



## References  

Observation

Fang, H., Baret, F., Plummer, S., & Schaepman‐Strub, G. (2019). An overview of global leaf area index (LAI): Methods, products, validation, and applications. _Reviews of Geophysics_, _57_(3), 739-799.

Modeling

- Chen, J. M., et al. (1999). Derivation and validation of canopy gap fraction using multi-angle remote sensing. *Can. J. Remote Sens.*, 25(2), 132–143.

# RHESSys code  
- `update_phenology()` dynamically adjusts LAI over time  
- LAI is passed to canopy radiation and gas exchange subroutines

