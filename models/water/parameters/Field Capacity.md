
parameter_name: field_capacity

aliases: $\theta$_fc, $\psi$_fc, $\psi$_field_capacity, S_fc


status: todo

Target ESM: RHESSys, https://github.com/RHESSys/RHESSys.git, develop branch 

# If used to create other parameters, list here

# Dynamically computed:  
Yes

# Select one or more from: geology physical,  geochemical, plant, landuse, snow, climate
parameter_classification [geology]

# Select one: hour, day, month, year, NA
parameter_time_scale:  NA

# Select one: mm, m, km, plant,NA
parameter_space_scale: NA

# Select one: abstract, physical not measurable, measurable
parameter_realism: measurable

# Specify units (e.g., mm/day, gC/m², dimensionless, percent)
parameter_units: percent {$\theta$} or Pa (tension, $\psi$), meters, meters^3


# Select one: rate, capacity, ratio, count, store,other
parameter_function: store


tags: [parameter]

# Description

Field capacity is the water stored in soil (or other substrate) after gravity drainage. Field capacity depends on soil texture and chemical properties that control how tightly water is held against gravity.  It is usually measured as percent water by volume of soil (VWC) or as water tension ($\theta_{fc}$, $\psi_{fc}$. In some cases, relative saturation at field capacity is used (S_{fc}) - which is the % of available pore space filled at field capacity (rather than percent by volume of soil). Texture is often used to estimate field capacity (low values 15% VWC in sandy soils to high values 55% (VWC) in clay) - however actual field capacity can reflect soil heterogeneity and complicated soil structure

# Range

10 to 50% 
-10  to -30 kPa

# Function in the model

Determines how much water remains in the soil after gravity drainage - Plant water availability depends on water stored between field capacity and wilting point

# Sources

Field capacity in many hydrologic models is often assumed to vary with depth but remain static through time.  Estimating depth varying profiles remains challenging. 
 
	# Database
see Databases in [[Soil Hydraulic Parameters]]


	# References on measuring/observing/estimating

see below on estimating

	 # From Model Calibration Database
	 # From Model Calibration Papers

# Conceptual model of parameter variation or controls on the parameter  (for physical parameters only)
	# Summary

Field capacity depends on soil texture; Soil texture is often described as classes (sand, silt, clay) but can be modelled more physically by considering the distribution of pores through a pore-size index b,  [[pore_size_index]] and  $\psi_{ae}$ [[Psi_air_entry]].   Pedotransfer functions can be used to estimate field capacity as well as other soil hydraulic properties

RHESSys uses two formulations to compute **relative saturation at field capacity (S_fc)**, which is key in determining unsaturated zone water retention.


 Clapp & Hornberger (1978)

$$
S_{fc}(z) = \left( \frac{\psi_{ae}}{(z_s - z)} \right)^{b)
$$


or 

 van Genuchten & Nielsen (1984)

$$
Sfc(z)=1−(zs−zψae)bS_{fc}(z) = 1 - \left( \frac{z_s - z}{\psi_{ae}} \right)^{b} 
$$


where

- **ψₐₑ**: [[Psi_air_entry]]
    
- **z_s**: depth to water table
    
- **z**: depth variable
    
- **b**: [[pore_size_index]]

More recent research also highlights conditions where field capacity may change at relatively short (annual-decadal)
 time scales - Most hydrologic models do not account for time-varying field capacity (although ecohydrologic models will account for changing field capacity with depth and account for variation. in plant accessible field capacity as rooting depth change)
# References

Equations used in RHESSys above

Clapp, Roger B., and George M. Hornberger. "Empirical equations for some soil hydraulic properties." _Water resources research_ 14, no. 4 (1978): 601-604.

Van Genuchten, M. Th, and D. R. Nielsen. "On describing and predicting the hydraulic properties." In _Annales Geophysicae_, vol. 3, no. 5, pp. 615-628. 1985.

See general references for [[Soil Hydraulic Parameters]]
