parameter\_name: pore_size_indx

aliases: pore size distribution index, lambda, n (via van Genuchten), b

status: todo

Target ESM: RHESSys, [https://github.com/RHESSys/RHESSys.git](https://github.com/RHESSys/RHESSys.git), develop branch

# If used to create other parameters, list here

[[Field Capacity]]

# Dynamically computed:  
No

# Select one or more from: geology physical,  geochemical, plant, landuse, snow, climate

parameter\_classification [geology]

# Select one: hour, day, month, year, NA

parameter\_time\_scale: NA

# Select one: mm, m, km, plant,NA

parameter\_space\_scale: 

# Select one: abstract, physical not measurable, measurable

parameter\_realism: measurable

# Specify units (e.g., mm/day, gC/m², dimensionless)

parameter\_units: dimensionless

# Select one: rate, capacity, ratio, count, other

parameter\_function: other

tags: [parameter]

# Description

Represents the distribution of pore sizes in a soil and controls the shape of the soil water retention curve. A key parameter in both the Brooks-Corey and van Genuchten models. High values indicate a narrow range of pore sizes (e.g., sands); low values indicate a wide range (e.g., clays).

# Range

Typical values:

- Sands: \~4 to 8
- Loams: \~2 to 4
- Clays: \~0.5 to 2

# Function in the model

Used in RHESSys for defining the shape of the unsaturated water retention curve and influences both the drainage rate and water holding capacity. Determines how rapidly soils release water under decreasing matric potential.

# Sources


# Databases

See [[Soil Hydraulic Parameters]] for databases where pore_size_index is estimated from pedotransfer functions

UNSODA database provides measured values for a variety of soil types: [https://agdatacommons.nal.usda.gov/articles/dataset/UNSODA\_2\_0\_Unsaturated\_Soil\_Hydraulic\_Database\_Database\_and\_program\_for\_indirect\_methods\_of\_estimating\_unsaturated\_hydraulic\_properties/24851832](https://agdatacommons.nal.usda.gov/articles/dataset/UNSODA_2_0_Unsaturated_Soil_Hydraulic_Database_Database_and_program_for_indirect_methods_of_estimating_unsaturated_hydraulic_properties/24851832)


```
# References on measuring observing
 # From Model Calibration Database
 # From Model Calibration Papers
```

# Conceptual or where available mathematical model of parameter variation or controls on the parameter  (for physical parameters only)

```
# Summary
```

Controlled by soil texture and structure. Sandy soils with uniform large pores exhibit high b-values, while fine-textured or aggregated soils have low b-values due to a wider range of pore sizes.

```
 # References
```

Refer to  [[Soil Hydraulic Parameters]] for related parameter context and pedotransfer modeling references.

