

name: soil evaporation
aliases: [soil_ET, soil water loss]
type: flux
cycle: water
symbol: $E_{soil}$
units: m/day
typical_range: [0, .010]
tags: [flux, evapotranspiration, hydrology,  soil]
Target ESM: RHESSys, [https://github.com/RHESSys/RHESSys.git](https://github.com/RHESSys/RHESSys.git), develop branch
depends_on:
    - \( E_{soil} \): Soil evaporation rate (kg m\(^{-2}\) s\(^{-1}\))
	- \( R_net_soil \): Net radiation at the soil surface (W m\(^{-2}\))
	- \( G \): Ground heat flux (W m\(^{-2}\))
	- \( \rho_a \): Air density (kg m\(^{-3}\))
	- \( c_p \): Specific heat of air (J kg\(^{-1}\) K\(^{-1}\))
	- \( VPD \): Vapor pressure deficit (Pa)
	- \( r_a \): Aerodynamic resistance (s m\(^{-1}\))
	- \( r_s \): Surface (soil) resistance, function of soil moisture (s m\(^{-1}\))
	- \( \Delta \): Slope of saturation vapor pressure curve (Pa K\(^{-1}\))
	- \( \gamma \): Psychrometric constant (Pa K\(^{-1}\))
# Tags
flux, soil evaporation, E_s

# Description/Conceptual Model
Soil evaporation is computed as part of the energy balance and moisture fluxes. Energy (radiation) fluxes for soil evaporation must often account for the attenuation of radiation by canopy, litter and in some cases snow cover.  Soil moisture controls water availability for evaporatiN but soil texture (as subsurface conductivity/resistivity) can also limit evaporation rates. There is some evidence of a critical soil moisture below which evaporation cannot occur. Soil moisture is often a small component of ET, but in bare soil or recently disturbed vegetated site it can be a significant contributor.

# Model Name (as implemented in the target ESM if there is a standard name e.g Penman monteith)
Penman-Monteith (modified), with surface resistance based on soil moisture availability and using radiation input after attenuation by any overlying canopy, litter or snow layers

# Equation as used in target ESM

\[
E_{soil} = \frac{\Delta (R_n - G) + \rho_a c_p \frac{VPD}{r_a}}{\Delta + \gamma (1 + \frac{r_s}{r_a})}
\]

Where:
- \( E_{soil} \): Soil evaporation rate (kg m\(^{-2}\) s\(^{-1}\))
- \( R_net_soil \): Net radiation at the soil surface (W m\(^{-2}\))
- \( G \): Ground heat flux (W m\(^{-2}\))
- \( \rho_a \): Air density (kg m\(^{-3}\))
- \( c_p \): Specific heat of air (J kg\(^{-1}\) K\(^{-1}\))
- \( VPD \): Vapor pressure deficit (Pa)
- \( r_a \): Aerodynamic resistance (s m\(^{-1}\))
- \( r_s \): Surface (soil) resistance, function of soil moisture (s m\(^{-1}\))
- \( \Delta \): Slope of saturation vapor pressure curve (Pa K\(^{-1}\))
- \( \gamma \): Psychrometric constant (Pa K\(^{-1}\))

# Literature References

- Monteith, J.L. (1965). Evaporation and environment. Symposia of the Society for Experimental Biology, 19, 205-234.
- 
## Alternative Model References

More detailed model of soil evaporation and role of texture
Lehmann, Peter, Olivier Merlin, Pierre Gentine, and Dani Or. "Soil texture effects on surface resistance to bare‐soil evaporation." _Geophysical Research Letters_ 45, no. 19 (2018): 10-398.

Or, Dani, Peter Lehmann, Ebrahim Shahraeeni, and Nima Shokri. "Advances in soil evaporation physics—A review." Vadose Zone Journal 12, no. 4 (2013): vzj2012-0163.

# Limitations of flux implementation used in target ESM
- Assumes uniform soil moisture in the topsoil layer for estimating surface resistance.
- Neglects sub-grid variability in soil texture and shading effects.
- Surface resistance function may not capture soil crusting or compaction effects that limit evaporation.

# Observations
- [[output_soil_evaporation]]



## Code source file and function names in which flux is updated
- `compute_potential_evaporation.c`: `compute_soil_evaporation()`

## Code source file in which code is called (limit to 4 if used in multiple places)
- `daily_patch.c`
- `compute_N_scaling.c`
- `output_patch.c`
- `compute_C_gain.c`

