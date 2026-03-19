# Tags
process, stomatal conductance, leaf water potential, RHESSys, LWP


# Description/Conceptual model

Stomatal conductance in RHESSys is influenced by leaf water potential (LWP) through a curve-based multiplier on potential conductance. This represents the physiological decline in stomatal conductance as water stress increases (i.e., as LWP becomes more negative).

# Model Name (as implemented in the target ESM if there is a standard name e.g Penman monteith)

`leaf_conductance_LWP_curve`

# Equation as used in target ESM

The stomatal conductance multiplier due to LWP is modeled has to options depending on curve selected 

Option 0

$$
m_{LWP} =
\begin{cases}
1 & \text{if } \Psi \geq \Psi_{\text{threshold}} \\
\frac{\Psi - \Psi_{\text{wilting}}}{\Psi_{\text{threshold}} - \Psi_{\text{wilting}}} & \text{if } \Psi_{\text{wilting}} < \Psi < \Psi_{\text{threshold}} \\
0 & \text{if } \Psi \leq \Psi_{\text{wilting}}
\end{cases}
\]
$$

Where:

$\Psi$: Current leaf water potential
$\Psi_{\text{threshold}}$: Value above which stomata are fully open
$\Psi_{\text{wilting}}$: Permanent wilting point

Option for curves greater than 0, this is for data-driven curves only parameters would need to be locally calibrated

if
       $\Psi_{\text{predawn}} < \Psi_{\text{threshold}}$, then:

$$
\begin{aligned}
\text{estimate} &= \text{slp} \cdot (LWP_{\text{predawn}} - LWP_{\text{threshold}}) + \text{intercpt} \\
m_{LWP} &= \left(\text{estimate}\right)^{\text{curve}} \\
m_{LWP} &= \max(m_{LWP},\ 0) \\
m_{LWP} &= \min(m_{LWP},\ 1)
\end{aligned}
$$

			else:

$$
m_{LWP} = 1
$$

Where:

$\Psi$: Current leaf water potential  
$\Psi_{\text{threshold}}$: Value above which stomata are fully open 
$intercept$: used for calibrated lwp-conductance curves
$slp$: used for calibrated lwp-conductance curves
$curve$ if 0 then option 0 is used otherwise it is used to detemine form (linear, binomial of lwp sensitivity)


$m_{LWP}$  Multiplies on conductance due to water potential



# Literature References
## References for model in Target ESM

- Tague, C.L., & Band, L.E. (2004). RHESSys: Regional Hydro-Ecologic Simulation System—An object-oriented approach to spatially distributed modeling of carbon, water, and nutrient cycling. *Earth Interactions*, 8(19), 1–42.
- Damour, Gaëlle, Thierry Simonneau, Hervé Cochard, and Laurent Urban. "An overview of models of stomatal conductance at the leaf level." _Plant, cell & environment_ 33, no. 9 (2010): 1419-1438.

## Alternative Model References

- Sperry, J.S., Hacke, U.G., Oren, R., & Comstock, J.P. (2002). Water deficits and hydraulic limits to leaf water supply. *Plant, Cell & Environment*, 25(2), 251–263.
- Damour, Gaëlle, Thierry Simonneau, Hervé Cochard, and Laurent Urban. "An overview of models of stomatal conductance at the leaf level." _Plant, cell & environment_ 33, no. 9 (2010): 1419-1438

# Limitations of process implementation used in target ESM

- Assumes a fixed linear decline between threshold and wilting potentials; does not account .
- Requires calibration for species of key parameters

# Observations

not observable directly but calibrated from observations of [[process_stomatal_conductance]], #stomatal_conductance





# Details from target ESM model code
## Variables
### flux names
- gs (stomatal conductance, as modulated by LWP multiplier)

### stores/state variable names
- leaf_water_potential (inferred or estimated from soil water status and transpiration)
- LWP_predawn, psi_predawn


### multipliers
	. m_LWP


## parameters
- `psi_threshold`  
- `psi_wilting
- psi_open

# inputs


## Code source file and function names in which process is updated
- `leaf_conductance_LWP_curve  
  → Function: `leaf_conductance_LWP_curve(...)`

## Code source file in which function called updated variables are used directly (limit to 4 if used in multiple places)
- compute_vascular_stratum_conductance
