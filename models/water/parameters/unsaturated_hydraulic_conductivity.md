parameter\_name: K\_s (saturated hydraulic conductivity)

aliases: Ksat, saturated conductivity, Ks

status: todo

Target ESM: RHESSys, https\://github.com/RHESSys/RHESSys.git, develop branch

# If used to create other parameters, list here

[[ra_soil]]

# Dynamically computed:  
Yes

# Select one or more from: geology physical,  geochemical, plant, landuse, snow, climate

parameter\_classification [geology physical]

# Select one: hour, day, month, year, NA

parameter\_time\_scale: NA

# Select one: mm, m, km, plant,NA

parameter\_space\_scale: mm

# Select one: abstract, physical not measurable, measurable

parameter\_realism: measurable

# Specify units (e.g., length/time,  gC/m², dimensionless)

parameter\_units: length/time

# Select one: rate, capacity, ratio, count, other

parameter\_function: rate

tags: [parameter]

# Description

The rate of water movement through unsaturated porus medium depends on moisture content and the physical structure of that mediaum

# Range



# Function in the model

K  determines the upper limit of vertical and lateral drainage unsatured parts of the soil, including downward gravity drainage rates and upward due to capiliary rise and soil evaporation


# Sources

```
# Databases
```

# Measurements
 - Pedotransfer functions estimate K_s based on texture, bulk density, and organic matter content.


# Conceptual model of parameter variation or controls on the parameter  (for physical parameters only)


### Equation

The unsaturated hydraulic conductivity is modeled using a nonlinear relationship based on Clapp and Hornberger (1978):

\[
K(\theta) = K_s \left( \frac{\theta}{\theta_s} \right)^{2b+3}
\]

Where:  
- \( K(\theta) \) = unsaturated hydraulic conductivity [mm/day]  
- \( K_s \) = saturated hydraulic conductivity [mm/day]  
- \( \theta \) = current soil moisture content [cm³/cm³]  
- \( \theta_s \) = saturated soil moisture content [cm³/cm³]  
- \( b \) = Clapp-Hornberger "b" parameter [-]

###  Parameters

| Parameter | Description                          | Units  |
| --------- | ------------------------------------ | ------ |
| `K_s      | [[saturated_hydraulic_conductivity]] | mm/day |
| `b`       | [[pore_size_index]]                  |        |


### References

Clapp, R. B., & Hornberger, G. M. (1978). Empirical equations for some soil hydraulic properties. *Water Resources Research*, 14(4), 601–604. https://doi.org/10.1029/WR014i004p00601

---


## Other References


See [[Soil Hydraulic Parameters]] for broader context and sources for soil hydraulic parameters.


Peters, Andre. "Simple consistent models for water retention and hydraulic conductivity in the complete moisture range." _Water Resources Research_ 49, no. 10 (2013): 6765-6780.