
parameter_name: unsat_storage

aliases: θ

status: complete  
Target ESM: RHESSys, https://github.com/RHESSys/RHESSys.git, develop branch

tags: [parameter, state, hydrology, soil]

Dynamically computed: Yes  
parameter_classification: [geology physical, plant, climate]  
parameter_time_scale: day  
parameter_space_scale: mm  
parameter_realism: measurable  
parameter_units: mm  
parameter_function: store

# Description  
Represents the volume of water stored in the unsaturated soil zone above the water table but below the root zone. It reflects infiltration, drainage, and retention processes within the soil profile.

# Range  
Typically 0 to the porosity times depth of unsaturated zone, e.g., 0 – 300 mm.

# Function in the model  
Tracks soil water status influencing infiltration, percolation to groundwater, and evaporation. Important for simulating soil‑water redistribution and unsaturated zone flow.

# Sources  

# Measurements
- Databases: Field soil moisture monitoring (e.g., SCAN, Fluxnet)  
- References: Topp et al. (1980). Electromagnetic determination of soil water content: Measurements in coaxial transmission lines. *Water Resources Research*, 16(3), 574–582.  
- 
# Calibration

# Conceptual or where available mathematical model of parameter variation or controls on the parameter  (for physical parameters only)  
Varies with infiltration, soil texture, structure, and evapotranspiration. Spatially heterogeneous due to topographic and edaphic gradients.  
Reference: Rawls et al. (1982). Estimation of soil water properties. *Transactions of the ASAE*, 25(5), 1316–1320.
