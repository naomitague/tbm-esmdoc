
parameter_name: rz_storage

aliases: θ₋root

status: complete  
Target ESM: RHESSys, https://github.com/RHESSys/RHESSys.git, develop branch

tags: [parameter, state, soil, plant]

Dynamically computed: Yes  
parameter_classification: [geology physical]  
parameter_time_scale:  
parameter_space_scale: mm  
parameter_realism: measurable  
parameter_units: m or m^3
parameter_function: store

# Description  
Represents the amount of water stored within the soil that is accessible to plant roots. Root accessible moisture depends on the balance of water input (infiltration or lateral drainage), output ([[process_soil_evaporation]], [[process_transpiration]]) and storage capacity [[root storage capacity]]- storage capacity depends on both  physical properties of the soil  (see [[Soil Hydraulic Parameters]]) but also the distribution of roots.  In many locations this water is primarily water stored as [[Field Capacity]] after gravity drainage has occurred. However when water tables are close to the surface this storage may also included [[Saturated Water Storage]]rated water
# Range  

Because of the multiple controls on root accessible soil moisture its range is wide
[0 to 1500mm ]

# Function in the model  
Used to determine plant water availability for transpiration. 
# Sources  
. see [[output_soil_moisture]]


# Conceptual or where available mathematical model of parameter variation or controls on the parameter  (for physical parameters only)ls  


## Root zone Moisture Balance Equation

The change in root zone soil moisture ($rz\\_storage$) over time can be expressed as:

$$
\Delta_{rz_storage} = I - E_s - T - D + S
$$

Where:

- $\Delta_{rz_storage}$ = Change in root zone soil water storage (mm/day)  
- $I$ = Infiltration into the root zone (mm/day)  
- $E_s$ = Soil evaporation from the root zone (mm/day)  [[output_soil_evaporation]]
- $T$ = Transpiration (mm/day)  [[process_transpiration]]
- $D$ = Drainage to the unsaturated or saturated zone drainage occurs until [[Field Capacity]] is reached
- S = any saturated water that enters the rooting zone from below

**Constraint:**

Where $rz\\_capacity$ is the maximum root zone water holding capacity determined by soil properties and rooting depth [[Root water storage capacity]]


Note that estimating the value of *S* depends on lateral flow and rooting depths relative to water table deptsh