
parameter_name:  $\psi$ _wilt

aliases: $\psi$_threshold, $\psi$_wilt, $\psi$_wilting, $\psi$_close

Target ESM: RHESSys, https://github.com/RHESSys/RHESSys.git, develop branch 
# If used to create other parameters, list here


# Dynamically computed:  
No

# Select one or more from: geology physical,  geochemical, plant, landuse, snow, climate
parameter_classification [plant]

# Select one: hour, day, month, year, NA
parameter_time_scale: NA

# Select one: mm, m, km, plant,NA
parameter_space_scale: plant

# Select one: abstract, physical not measurable, measurable
parameter_realism: physical

# Specify units (e.g., mm/day, gC/m², dimensionless)
parameter_units: MPa

# Select one: rate, capacity, ratio, count, other
parameter_function: other

status: todo
tags: [parameter]

# Description
Threshold and wilting point values (in MPa) used to compute the stomatal conductance response to leaf water potential.

# Range
Typical range for psi_threshold: -0.5 to -1.5  
Typical range for psi_wilt: -1.5 to -4.0
# Function in the model
Modulates the multiplier applied to potential stomatal conductance based on current leaf water potential.
# Sources
	# Databases
- TRY Plant Trait Database (https://www.try-db.org)
- EcoHydros Database (site-specific field data)
- 
	# References on measuring observing

	 # From Model Calibration Database
	 # From Model Calibration Papers
	 Values may be tuned per plant functional type or vegetation stratum, Site-specific values often derived from hydraulic vulnerability curves or inferred from stomatal behavior studies.
	 

# Conceptual or where available mathematical model of parameter variation or controls on the parameter  (for physical parameters only)
## Summary
Stomatal conductance declines linearly from psi_threshold to psi_wilt, reaching zero below psi_wilt.

## References
- Tague, C.L., & Band, L.E. (2004)
- Sperry, John S., and David M. Love. "What plant hydraulics can tell us about responses to climate‐change droughts." _New Phytologist_ 207, no. 1 (2015): 14-27.
- Martínez‐Vilalta, Jordi, and Núria Garcia‐Forner. "Water potential regulation, stomatal behaviour and hydraulic transport under drought: deconstructing the iso/anisohydric concept." _Plant, cell & environment_ 40, no. 6 (2017): 962-976.
- Martin‐StPaul, Nicolas, Sylvain Delzon, and Hervé Cochard. "Plant resistance to drought depends on timely stomatal closure." _Ecology letters_ 20, no. 11 (2017): 1437-1447.

