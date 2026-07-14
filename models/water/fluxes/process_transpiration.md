name: transpiration
aliases: [transpiration, plant water loss]
type: flux
cycle: water
symbol: E
units: mm/day
typical_range: [0, 0.010]
tags: [flux, transpiration, hydrology,  vegetation, canopy]
Target ESM: RHESSys, [https://github.com/RHESSys/RHESSys.git](https://github.com/RHESSys/RHESSys.git), develop branch
depends_on:
	- \( \Delta \): slope of saturation vapor pressure curve
	- \( R_n \): net radiation
	- \( G \): soil heat flux (often 0 for daily timestep)
	- \( \rho_a \): air density
	- \( c_p \): specific heat of air
	- VPD: vapor pressure deficit
	- \( r_a \): aerodynamic resistance
	- [[flux_stomatal_conductance]]\( r_s \): surface resistance (includes stomatal conductance)
	- \( \gamma \): psychrometric constant

# Description/Conceptual model
Transpiration is the flux by which water is transported from the soil by plant roots through vascular structure of the stem, and eventually lost to the atmosphere as vapor through stomata. It is driven by available energy, water and diffusion gradients  and regulated by plant stomatal function.  Available energy at the leaf surface varies with leaf albedo, angle and distribution and incoming radiation from the atmosphere. Water availability depends on water storage in soil and sometime groundwater and root distribution access to that storage. Diffusion gradients depend on vapor pressure deficit and windspeed.  Plant can also actively control transpiration by changing [[flux_stomatal_conductance]] stomatal conductance. 

Scaling from leaf transpiration to tree to stand requires making assumptions about how energy and water availability and diffuse gradients vary through canopies. Response tend to be highly non-linear so simple averaging leads to significant errors. Most models accounts for differential radiation exposure in sunlit and shaded leaves and assume exponential (or other) declines in radiation, windspeed and other diffuse parameters, from the top of canopies to ground surface.


# Basic Physical Model/Theory

Penman-Monteith equation


\[ E = \frac{\Delta (R_n - G) + \rho_a c_p \text{VPD} / r_a}{\Delta + \gamma (1 + r_s/r_a)} \]

Where:
- \( E \): transpiration (mm/day)
- \( \Delta \): slope of saturation vapor pressure curve
- \( R_n \): net radiation
- \( G \): soil heat flux (often 0 for daily timestep)
- \( \rho_a \): air density
- \( c_p \): specific heat of air
- VPD: vapor pressure deficit
- \( r_a \): aerodynamic resistance
- [[flux_stomatal_conductance]]\( r_s \): surface resistance  from stomatal conductance)
- \( \gamma \): psychrometric constant

For transpiration, scaling variables in above equation from leaf to plant to stand depends on plant characteristics 

-[[flux_stomatal_conductance]]\( r_s \) depends on plant response to atmospheric conditions  and internal states - important internal states include xylem water pressure (which is impacted by root access to water as well as atmospheric humidity),  carbon assimilation and specific ecophysiology parameters that influence stomatal regulation

##  Theory References

Foundation
- Monteith, J.L. (1965). Evaporation and environment. Symposia of the Society for Experimental Biology, 19, 205-234.
- Jones, H.G. (1992). Plants and Microclimate: A Quantitative Approach to Environmental Plant Physiology. Cambridge University Press.

##  Model References


- Mencuccini, M., Manzoni, S. and Christoffersen, B., 2019. Modelling water fluxes in plants: from tissues to biosphere. _New Phytologist_, _222_(3), pp.1207-1222.



# Observations

[[output_transpiration]]




# Target ESMs

## RHESSys

### Code source file and function names in which flux is updated
- `penman_monteith.c`
### Code source file in which code is called or updated variables are used directly (limit to 4 if used in multiple places)
- `canopy_stratum_daily_F.c` (multiple places for overstory, understory)


