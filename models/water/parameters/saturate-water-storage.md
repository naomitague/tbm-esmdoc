
parameter_name: sat_deficit

aliases: sat_deficit, sat_deficit_z, water_table_depth, groundwater

status: complete  
Target ESM: RHESSys, https://github.com/RHESSys/RHESSys.git, develop branch

tags: [parameter, state, hydrology]

Dynamically computed: Yes  
parameter_classification: [geology physical, climate]  
parameter_time_scale: day  
parameter_space_scale: m  
parameter_realism: measurable  
parameter_units: m  
parameter_function: store

# Description  
Represents the vertical distance between the current water table and the soil surface. It quantifies the saturation deficit in the soil profile. Saturation deficit can be translated into depth to water table by integrating over a porosity profile. 

Spatial gradients in saturation deficit (or depth to the water table) are commonly used in hydrologic models to define lateral saturated flow [[Qsat]] magnitude and direction

Modeling water table dynamics is often the domain of groundwater modeling which provide 3-d hydrogeologic representations of groundwater storage and flux over space and time

# Range  
0 to 10s of meters depending on climate, geology and topography

# Function in the model  
Used to compute saturated zone extent and runoff production via saturation excess. Influences capillary rise and water availability to deep roots. Drives the partitioning between saturated and unsaturated flow.


# Sources
[[output_water_table_depth]]
# Conceptual or where available mathematical model of parameter variation or controls on the parameter  (for physical parameters only)  

## Saturation Deficit Calculation

The **saturation deficit** represents the net change in saturated zone water content, expressed as the water needed to fill the saturated zone to field capacity. Inputs reduce the deficit (negative sign), while outputs increase it (positive sign).

### Equation

$${\text{sat\_deficit}} = -Q_{in} + Q_{out} - \text{unsat\_drainage} + \text{cap\_rise}  - \text{sat\_infiltration}$$

### Variables and Descriptions

| Variable                   | Units         | Description                                                                                                                           |
| -------------------------- | ------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| $Q_{in}$                   | mm or m³/time | Inflow to the saturated zone from upslope locations                                                                                   |
| $Q_{out}$                  | mm or m³/time | Outflow from the saturated zone to downslope locations or to stream for streamside  locations                                         |
| $\text{unsat\_drainage}$   | mm or m³/time | Water draining from the unsaturated zone into the saturated zone                                                                      |
| $\text{cap\_rise}$         | mm or m³/time | Capillary rise from the saturated zone into the unsaturated zone                                                                      |
| $\text{sat\_infiltration}$ | mm or m³/time | Direct infiltration entering the saturated zone when water table is at the surface                                                    |





## Other approaches

Explicit Groundwater modeling

Gleeson, T., Wagener, T., Döll, P., Zipper, S. C., West, C., Wada, Y., Taylor, R., Scanlon, B., Rosolem, R., Rahman, S., Oshinlaja, N., Maxwell, R., Lo, M.-H., Kim, H., Hill, M., Hartmann, A., Fogg, G., Famiglietti, J. S., Ducharne, A., de Graaf, I., Cuthbert, M., Condon, L., Bresciani, E., and Bierkens, M. F. P.: GMD perspective: The quest to improve the evaluation of groundwater representation in continental- to global-scale models, Geosci. Model Dev., 14, 7545–7571, https://doi.org/10.5194/gmd-14-7545-2021, 2021.

Condon, L. E., Kollet, S., Bierkens, M. F., Fogg, G. E., Maxwell, R. M., Hill, M. C., ... & Abesser, C. (2021). Global groundwater modeling and monitoring: Opportunities and challenges. _Water Resources Research_, _57_(12), e2020WR029500.