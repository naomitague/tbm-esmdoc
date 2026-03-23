
parameter_name:  Rd

aliases:

status: todo
Target ESM: RHESSys, https://github.com/RHESSys/RHESSys.git, develop branch 

tags: [parameter]
# If used to create other parameters, list here
[[Root water storage capacity]]


# Dynamically computed:  
Yes
# Select one or more from: geology physical,  geochemical, plant, landuse, snow, climate
parameter_classification [plant]

# Select one: hour, day, month, year, NA
parameter_time_scale: NA

# Select one: mm, m, km, plant,NA
parameter_space_scale:  m

# Select one: abstract, physical not measurable, measurable
parameter_realism:  measurable

# Specify units (e.g., mm/day, gC/m², dimensionless, percent)
parameter_units:  m

# Select one: rate, capacity, ratio, count, store, depth, other
parameter_function: depth




# Description

Rooting depth is the depth to which plant roots extend. It is often used to estimate water availability for the plant. A limitation of this approach is that it assumes that plants will have access over the entire profile defined by the depth. See discussion in [[Root water storage capacity]] and [[Soil Moisture - Root Accessible]].   Rooting depth also changes with time as plants grow, and can vary across species.  In carbon cycling models, rooting depth is a function of [[Root Carbon]]. 
# Range

# Function in the model

Defines [[Root water storage capacity]]

# Sources
	# Databases
	# References on measuring/observing
Schenk, H. Jochen, and Robert B. Jackson. "Rooting depths, lateral root spreads and below-ground/above-ground allometries of plants in water-limited ecosystems." _Journal of Ecology_ (2002): 480-494.

	 # From Model Calibration Database
	 # From Model Calibration Papers

# Conceptual or where available mathematical model of parameter variation or controls on the parameter  (for physical parameters only

Many models assume that rooting depth is fixed and does not valry through time (but does vary with species of plant functional type)

Dynamic rooting depth models can be linked with carbon


## 🌱 Root Depth Estimation from Root Carbon
For **trees**:
$$
z_{root} = \frac{3.0 \cdot \left( \frac{2.0 \cdot C_{root}}{\rho_{stem}} \right)^{rgd}}{rdp}
$$
For **non-trees**:

$$
z_{root} = \frac{3.0 \cdot \left( 2.0 \cdot C_{root} \right)^{rgd}}{rdp} 
$$

With post-fluxing constraints:

$$
z_{root}=min⁡(z_{root},z_{max_{root}},z_{soil})
$$

Uses uses direction and distribution of roots (that might vary by species) to translate ca
### 🔧 Parameters

| Parameter | Units  | Description                                        |
| --------- | ------ | -------------------------------------------------- |
| `C_root`  | kgC/m² | Root carbon                                        |
| `ρ_stem`  | kgC/m² | Stem density (used only for trees)                 |
| `rgd`       | –      | Root growth direction exponent                     |
| `rdp`  | –      | Root distribution parameter                        |
| `z_max_root`   | m      | Maximum allowed root depth                         |
| `z_soil`  | m      | Soil depth                                         |
| `ε`       | m      | Small numerical buffer (typically 0.0001 m)        |
| `z_root`  | m      | Final root depth used for soil moisture extraction |

### ⚙️ Notes

- The multiplier **2.0** represents a fixed **biomass-to-carbon ratio**.
- For **trees**, root depth is scaled by the inverse of stem density to reflect allocation dynamics.

# Alternate way to effectively determine where roots are

Other approach partition a root carbon into a specific root surface area per carbon and then scale root water uptake from a given soil layer  by area of roots in each soil layer -


- Allocation favors shallower, wetter layers.

The weighting factor \( w_i \) is used to determine how root carbon is distributed across soil layers, favoring **shallower** and **wetter** layers 

$$
w_i = \left(1 - \frac{z_i}{Z_{max}}\right) \cdot \frac{\theta_i - \theta_{wilt}}{\theta_{ref} - \theta_{wilt}}
$$

**Where:**
- \( w_i \): Weighting factor for layer *i* (dimensionless)  
- \( z_i \): Depth to the center of soil layer *i* \([m]\)  
- \( Z_{max} \): Maximum rooting depth \([m]\)  
- \( \theta_i \): Volumetric soil moisture in layer *i* \([m^3\, m^{-3}]\)  
- \( \theta_{wilt} \): Wilting point soil moisture \([m^3\, m^{-3}]\)  
- \( \theta_{ref} \): Reference soil moisture (near field capacity) \([m^3\, m^{-3}]\)

**Principles:**
1. Shallower layers receive more allocation:
2. Wetter layers receive more allocation


## 📚 References


### Root depth / carbon relationships

#### Current Model
Arora, Vivek K., and George J. Boer. "A representation of variable root distribution in dynamic vegetation models." _Earth Interactions_ 7, no. 6 (2003): 1-19.
#### Alternatives
Niu, Guo‐Yue, Yuan‐Hao Fang, Li‐Ling Chang, Jiming Jin, Hua Yuan, and Xubin Zeng. "Enhancing the Noah‐MP ecosystem response to droughts with an explicit representation of plant water storage supplied by dynamic root water uptake." _Journal of Advances in Modeling Earth Systems_ 12, no. 11 (2020): e2020MS002062.
### Current related reviews
Tumber‐Dávila, S. J., Schenk, H. J., Du, E., & Jackson, R. B. (2022). Plant sizes and shapes above and belowground and their interactions with climate. _New Phytologist_, _235_(3), 1032-1056.

Gao, Hongkai, Markus Hrachowitz, Lan Wang-Erlandsson, Fabrizio Fenicia, Qiaojuan Xi, Jianyang Xia, Wei Shao, Ge Sun, and Hubert HG Savenije. "Root zone in the Earth system." _Hydrology and Earth System Sciences_ 28, no. 19 (2024): 4477-4499.


# RHESSys Code

cn/update_rooting_depth