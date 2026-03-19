
Target ESM: RHESSys, https://github.com/RHESSys/RHESSys.git, develop branch 

# Tags
process

# Description/Conceptual Model

Carbon allocation reflect how net assimilated carbon is transferred into structural carbon (leaves, stems, branches, roots) or stored as non-structural carbohydrate. 

Nitrogen allocation is often stochometiriclly linked with carbon allocation - and nutrient availability can influence allcoation strategies
# Model Name (as implemented in the target ESM if there is a standard name e.g Penman monteith)
# Equation as used in target ESM



# Carbon Allocation Strategies in RHESSys

RHESSys supports multiple carbon allocation strategies that determine how net available carbon is partitioned into leaves, roots, and stems. The four main strategies include:

---

## 1. Fixed Proportion Allocation

### Description
Carbon is allocated using fixed fractions regardless of canopy or resource status.

### Equations

```math
C_{avail} = GPP - R_{veg}
```

```math
C_{leaf} = f_{leaf} \cdot C_{avail}
```

```math
C_{stem} = f_{stem} \cdot C_{avail}
```

```math
C_{root} = f_{root} \cdot C_{avail}
```

With constraint:

```math
f_{leaf} + f_{stem} + f_{root} = 1
```

### Key Parameters

- `GPP` — gross primary production (g C m⁻² d⁻¹)
- `R_veg` — vegetation respiration (g C m⁻² d⁻¹)
- `f_leaf`, `f_stem`, `f_root` — fixed fractions for allocation

---

## 2. Dickinson (LAI-Based) Allocation

### Description
Allocation varies with LAI. As LAI increases, less carbon goes to leaves and more to stems/roots.

### Equations

```math
C_{avail} = GPP - R_{veg}
```

```math
f_{leaf}(LAI) = f_{leaf,min} + (f_{leaf,max} - f_{leaf,min}) \cdot \exp(-k_{LAI} \cdot LAI)
```

```math
f_{root}(LAI) = f_{root,min} + (f_{root,max} - f_{root,min}) \cdot \exp(-k_{LAI,root} \cdot LAI)
```

```math
f_{stem} = 1 - f_{leaf}(LAI) - f_{root}(LAI)
```

```math
C_{leaf} = f_{leaf}(LAI) \cdot C_{avail}
```

```math
C_{root} = f_{root}(LAI) \cdot C_{avail}
```

```math
C_{stem} = f_{stem} \cdot C_{avail}
```

### Key Parameters

- `LAI` — leaf area index (m²/m²)
- `f_leaf,min`, `f_leaf,max`, `k_LAI`
- `f_root,min`, `f_root,max`, `k_LAI,root`

---

## 3. Dynamic (Resource Availability) Allocation

### Description
Allocation shifts dynamically based on water and nitrogen availability.

### Equations

```math
C_{avail} = GPP - R_{veg}
```

```math
W_{avail} = \frac{actual\ water\ uptake}{potential\ water\ uptake}
```

```math
N_{avail} = \frac{actual\ nitrogen\ uptake}{potential\ nitrogen\ uptake}
```

```math
f_{root} = f_{root,base} + \alpha_W(1 - W_{avail}) + \alpha_N(1 - N_{avail})
```

```math
f_{leaf} = f_{leaf,base} \cdot \frac{W_{avai_
```



#  References
## References for model in Target ESM
## Alternative Model References
Hartmann, Henrik, Michael Bahn, Mariah Carbone, and Andrew D. Richardson. "Plant carbon allocation in a changing world–challenges and progress: introduction to a Virtual Issue on carbon allocation.” _New Phytologist_ 227, no. 4 (2020): 981-988.

Trugman, Anna T., and Leander DL Anderegg. "Source vs sink limitations on tree growth: from physiological mechanisms to evolutionary constraints and terrestrial carbon cycle implications." _New Phytologist_ 245, no. 3 (2025): 966-981.

Issues with which model to use
Babst, F., Friend, A. D., Karamihalaki, M., Wei, J., Von Arx, G., Papale, D., & Peters, R. L. (2021). Modeling ambitions outpace observations of forest carbon allocation. _Trends in Plant Science_, _26_(3), 210-219.
# Limitations of process implementation used in target ESM

# Observations



# Details  from target ESM model code
##  Variables
### flux variable names
### stores/state variable names

### parameters 

###inputs

## Code source file and function names in which process is updated
## Code source file in which code is called updated variables are used directly (limit to 4 if used in multiple places)






