
Target ESM: RHESSys, [https://github.com/RHESSys/RHESSys.git](https://github.com/RHESSys/RHESSys.git), develop branch

# Tags

process, evapotranspiration, hydrology vegetation,canopy, soil, litter

# Description/Conceptual Model

Evapotranspiration (ET) represents the combined loss of water to the atmosphere through plant transpiration and evaporation from soil, litter, and canopy surfaces. 
Evapotranspiration rates depend on water availability, energy availability and diffusion gradients    

# Model Name (as implemented in the target ESM if there is a standard name e.g Penman monteith)

ET flux components are calculated individually 

# Equation as used in target ESM

**ET = T_overstory + T_understory + E_canopy_overstory + E_canopy_understory + E_litter + E_soil**

Where:

- T_overstory = Overstory transpiration
    
- T_understory = Understory transpiration
    
- E_canopy_overstory = Overstory canopy evaporation
    
- E_canopy_understory = Understory canopy evaporation
    
- E_litter = Litter evaporation
    
- E_soil = Soil evaporation
    

# References

## References for model in Target ESM

- Tague, C. & Band, L. (2004). RHESSys: Regional Hydro-Ecologic Simulation System—An Object-Oriented Approach to Spatially Distributed Modeling of Carbon, Water, and Nutrient Cycling. _Earth Interactions_, 8(19), 1-42. [https://doi.org/10.1175/1087-3562(2004)8](https://doi.org/10.1175/1087-3562\(2004\)8)<1:RRHSSO>2.0.CO;2
    

## Alternative Model References



- Monteith, J. L. (1965). Evaporation and environment. _Symposia of the Society for Experimental Biology_, 19, 205-234.
    
Wang, Kaicun, and Robert E. Dickinson. "A review of global terrestrial evapotranspiration: Observation, modeling, climatology, and climatic variability." _Reviews of Geophysics_ 50, no. 2 (2012).

Simpler estimates of evapotranspiration that make assumptions about aerodynamic, stomatal conductance terms, and lump different contributions (e.g from soil, litter, canopy) - 
Reviewed

McMahon, T. A., B. L. Finlayson, and M. C. Peel. "Historical developments of models for estimating evaporation using standard meteorological data." _Wiley Interdisciplinary Reviews: Water_ 3, no. 6 (2016): 788-818.


# Limitations of process implementation used in target ESM

challenging to parameterize.

# Observations

[[output_et]]
    

# Details from target ESM model code

## Variables

### flux variab