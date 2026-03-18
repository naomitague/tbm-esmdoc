
parameter_name: $S_rmax$, $rootzone.potential_{sat}$

aliases: $S_Q$

status: todo
Target ESM: RHESSys, https://github.com/RHESSys/RHESSys.git, develop branch 

tags: [parameter]
# If used to create other parameters, list here

[[Soil Moisture - Root Accessible]]
# Dynamically computed:  
Yes
# Select one or more from: geology physical,  geochemical, plant, landuse, snow, climate
parameter_classification [geology, plant]

# Select one: hour, day, month, year, NA
parameter_time_scale:  

# Select one: mm, m, km, plant,NA
parameter_space_scale: m

# Select one: abstract, physical not measurable, measurable
parameter_realism: measurable

# Specify units (e.g., mm/day, gC/m², dimensionless, percent)
parameter_units: m, m^3

# Select one: rate, capacity, ratio, count, store,other
parameter_function: capacity




# Description

Volume or depth of water that can be stored that is accessible by roots. This will depend on both the distribution of roots and physical properties of the  [[Soil Hydraulic Parameters]] as well as sapprolite and fractured bedrock. Note that there are two ways to think about this - the maximum storage where all porosity is accessible by roots when filled; so storage capacity is the integration of porosity over the rooting distributions. Alternatively given that drainage often occurs rapidly, some models/estimates consider the integration of field capacity minus wilting point over the root distribution

# Range

0 - 1500mm of water

Stocker, Benjamin D., Shersingh Joseph Tumber-Dávila, Alexandra G. Konings, Martha C. Anderson, Christopher Hain, and Robert B. Jackson. "Global patterns of water storage in the rooting zones of vegetation." _Nature geoscience_ 16, no. 3 (2023): 250-256.




# Function in the model

influences [[Soil Moisture - Root Accessible]]


# Observations
	# Databases
	# References on measuring/observing
	 # From Model Calibration Database
	 # From Model Calibration Papers

# Equation/Model
	# Summary

For saturated storage capacity - this will simply be the integration of porosity over depth. Many models assume that porosity is constant over the rooting depth - or that porosity decays exponentially )
### Porosity Function

$$
\phi(z) = \phi_0 \cdot e^{-\lambda z}
$$

#### Integrated Storage Capacity

$$
S_{\text{rz,max}} = \int_0^{Z_r} \phi(z) \, dz = \int_0^{Z_r} \phi_0 \cdot e^{-\lambda z} \, dz = \frac{\phi_0}{\lambda} \left(1 - e^{-\lambda Z_r} \right)
$$


---

### 🔑 Parameters

| Symbol              | Description                                      | Units     |
|---------------------|--------------------------------------------------|-----------|
| `S_rz,max`          | Rootzone storage capacity (saturated)           | mm        |
| `φ₀`                | Surface porosity                                 | mm/mm     |
| `λ`                 | Porosity decay coefficient                       | mm⁻¹      |
| `Z_r`               | Rooting depth                                    | mm        |

---

### 🧠 Notes

- This equation assumes a **continuous soil profile** with porosity that **decreases exponentially** with depth due to compaction or pedogenesis.
 * * `φ₀` and `λ` parameters likely related to [[Soil Hydraulic Parameters]]


# References

Notes that root access not simply root depth

Bachofen, Christoph, Shersingh Joseph Tumber‐Dávila, D. Scott Mackay, Nate G. McDowell, Andrea Carminati, Tamir Klein, Benjamin D. Stocker, Maurizio Mencuccini, and Charlotte Grossiord. "Tree water uptake patterns across the globe." _New Phytologist_ 242, no. 5 (2024): 1891-1910.

Vereecken, Harry, Wulf Amelung, Sara L. Bauke, Heye Bogena, Nicolas Brüggemann, Carsten Montzka, Jan Vanderborght et al. "Soil hydrology in the Earth system." _Nature Reviews Earth & Environment_ 3, no. 9 (2022): 573-587.

Gao, H., Hrachowitz, M., Wang-Erlandsson, L., Fenicia, F., Xi, Q., Xia, J., Shao, W., Sun, G. and Savenije, H.H., 2024. Root zone in the Earth system. _Hydrology and Earth System Sciences_, _28_(19), pp.4477-4499.


# RHESSys code

Compute_delta_water.c