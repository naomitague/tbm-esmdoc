parameter_name: Leaf Water Potential (LWP)

aliases: Ψ_leaf, LWP

status: draft  
Target ESM: RHESSys, https://github.com/RHESSys/RHESSys.git, develop branch  

tags: [parameter, plant, hydrology, water_potential]

# If used to create other parameters, list here
[[process_stomatal_conductance_leaf_water_potential_response]]
# Dynamically computed:  
Yes

# Select one or more from: geology physical,  geochemical, plant, landuse, snow, climate  
parameter_classification: [plant, hydrology]

# Select one: hour, day, month, year, NA  
parameter_time_scale: hour

# Select one: mm, m, km, plant, NA  
parameter_space_scale: plant

# Select one: abstract, physical not measurable, measurable  
parameter_realism: physical 

# Specify units (e.g., mm/day, gC/m², dimensionless, percent)  
parameter_units: MPa

# Select one: rate, capacity, ratio, count, store, depth, other  
parameter_function: other

---

## Description

Leaf Water Potential (LWP, Ψ_leaf) represents the water potential within leaf tissues, influencing transpiration and plant water stress response. In many models predawn leaf water potential is assumed to be in equilibrium with water potential accessed by roots.  At sub-daily time steps however leaf water potential also depends on the rate of water flow from roots to leaf surfaces (as is therefore a function of pressure gradient between the atmosphere at the leaf surface and the pressure at roots, and resistance to flow - stem conductance). For daily time step models equilibrium between leaf and root is assumed

---

## Range

Typical values range from 0 MPa (saturated) to −2.5 MPa or lower during drought -7-9 MPA. Physiological limits vary by species. 

---

## Function in the model

RHESSys uses predawn LWP to regulate plant processes through [[process_stomatal_conductance]] 


## Conceptual or mathematical model of parameter variation or controls

It assumes a functional linkage between soil water status and plant hydration using the following equation:

### Clapp & Hornberger Form:
$\Psi_{\text{leaf}} = \min\left( \Psi_{\text{min\_spring}},\; -0.01 \cdot \text{uae} \cdot S^{-b} \right)$

### van Genuchten Form:
$\Psi_{\text{leaf}} = \min\left( \Psi_{\text{min\_spring}},\; -0.01 \cdot \text{uae} \cdot \left(S^{\frac{1}{1 - \frac{1}{b}}} - 1\right)^{\frac{1}{b}} \right)$


Where:

| Variable                            | Meaning                       | Units         |
| ----------------------------------- | ----------------------------- | ------------- |
| [[Soil Moisture - Root Accessible]] | Relative saturation (θ / θ_s) | dimensionless |
| [[b]]                               | Pore size index               | dimensionless |
| [[Psi_air_entry]]                   | Air-entry pressure            | kPa           |
| Ψ_min_spring                        | Minimum spring LWP            | MPa           |

The `−0.01` factor ensures unit compatibility for RHESSys internal scaling.

---


### From Model Calibration Papers
- Tague, C. L., & Band, L. E. (2004). *RHESSys: Regional Hydro-Ecologic Simulation System — process implementation*. *Earth Interactions*, 8(19).  
- Clapp, R. B., & Hornberger, G. M. (1978). *Empirical equations for some soil hydraulic properties*. *Water Resources Research*.  
- van Genuchten, M. T. (1980). *A closed-form equation for predicting the hydraulic conductivity of unsaturated soils*. *Soil Sci. Soc. Am. J.*

---


# Observation

