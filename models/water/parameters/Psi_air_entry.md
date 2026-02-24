
parameter_name: $\psi$_air_entry

aliases:, $\psi$_a, air_entry_pressure


status: todo

Target ESM: RHESSys, https://github.com/RHESSys/RHESSys.git, develop branch 
# If used to create other parameters, list here

[[Field Capacity]]

# Dynamically computed:  
No

# Select one or more from: geology physical,  geochemical, plant, landuse, snow, climate
parameter_classification [geology]

# Select one: hour, day, month, year, NA
parameter_time_scale: NA

# Select one: mm, m, km, plant,NA
parameter_space_scale: mm

# Select one: abstract, physical not measurable, measurable
parameter_realism: measurable

# Specify units (e.g., mm/day, gC/m², dimensionless)
parameter_units: Pa

# Select one: rate, capacity, ratio, count, other
parameter_function: other


tags: [parameter]

# Description

Matric potential (or suction)** at which **air first begins to enter the largest water-filled pores** during soil drying. Often based on soil texture - but actual soils / substrates may be include other structural properties and textural heterogeneity

# Range

Sands -10--20 kp
Clays -100 to -300

# Function in the model

# Sources
	# Databases
Rarely measured directly usually inferred from pedotransfer functions, there are a few databases with measurements - see [[Soil Hydraulic Parameters]] for databases with pedotransfer functions

UNSODA the UNsaturated SOil hydraulic DAtabase (UNSODA) USDA https://agdatacommons.nal.usda.gov/articles/dataset/UNSODA_2_0_Unsaturated_Soil_Hydraulic_Database_Database_and_program_for_indirect_methods_of_estimating_unsaturated_hydraulic_properties/24851832



	# References on measuring observing
	 # From Model Calibration Database
	 # From Model Calibration Papers

# Conceptual or where available mathematical model of parameter variation or controls on the parameter  (for physical parameters only)
	# Summary


 Related to capillary forces created by pore space (particularly the largest pores because they generally hold water at less tension). See Jurin'Law that relates pore radius and tension
 

	 # References

Refer to  [[Soil Hydraulic Parameters]] for related parameter context and pedotransfer modeling references.


