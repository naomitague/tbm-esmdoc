Target ESM: RHESSys, https://github.com/RHESSys/RHESSys.git, develop branch

# Tags
process

alias:: [transpiration, plant water loss], T

# # Description/Conceptual model
Transpiration is the process by which water is transported from the soil by plant roots through vascular structure of the stem, and eventually lost to the atmosphere as vapor through stomata. It is driven by available energy, water and diffusion gradients  and regulated by plant stomatal function.  Available energy at the leaf surface varies with leaf albedo, angle and distribution and incoming radiation from the atmosphere. Water availability depends on water storage in soil and sometime groundwater and root distribution access to that storage. Diffusion gradients depend on vapor pressure deficit and windspeed.  Plant can also actively control transpiration by changing [[process_stomatal_conductance]] stomatal conductance. 

Scaling from leaf transpiration to tree to stand requires making assumptions about how energy and water availability and diffuse gradients vary through canopies. Response tend to be highly non-linear so simple averaging leads to significant errors. Most models accounts for differential radiation exposure in sunlit and shaded leaves and assume exponential (or other) declines in radiation, windspeed and other diffuse parameters, from the top of canopies to ground surface.


# Model Name (as implemented in the target ESM if there is a standard name e.g Penman monteith)
Penman-Monteith equation

# Equation as used in target ESM
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
- [[process_stomatal_conductance]]\( r_s \): surface resistance (includes stomatal conductance)
- \( \gamma \): psychrometric constant

#  References
## References for model in Target ESM
- Monteith, J.L. (1965). Evaporation and environment. Symposia of the Society for Experimental Biology, 19, 205-234.


## Alternative Model References

- Jones, H.G. (1992). Plants and Microclimate: A Quantitative Approach to Environmental Plant Physiology. Cambridge University Press.
- Mencuccini, M., Manzoni, S. and Christoffersen, B., 2019. Modelling water fluxes in plants: from tissues to biosphere. _New Phytologist_, _222_(3), pp.1207-1222.

# Limitations of process implementation used in target ESM
- Assumes steady-state conditions and daily average climate drivers.
- No explicit treatment of within canopy turbulence or feedback from leaf temperature.

# Observations

[[output_transpiration]]



# Details from target ESM model code
## Variables
### flux variable names
- transpiration_sunlit
- transpiration_shade
- transpiration

### stores/state variable names
- None (transpiration is a flux, not stored)

### parameter names

# input names

- [[process_stomatal_conductance]]
- aerodynamic resistance (function of LAI and wind speed)
- leaf_area_index
- radiation  (e.g., Rn)
- VPD, air temperature (met inputs)


## Code source file and function names in which process is updated
- `penman_monteith.c`

## Code source file in which code is called or updated variables are used directly (limit to 4 if used in multiple places)
- `canopy_stratum_daily_F.c`
-

