Target ESM: RHESSys, https://github.com/RHESSys/RHESSys.git, develop branch

# constituent
output_constituent: [water]

# kind
output_kind: [flux]

# units
output_units: [mm/day]

# Description
Evapotranspiration is the flux of water from the earth surface to the atmosphere - it is the balance of energy availability, water availability and diffusion limits. Evapotranspiration include evaporation from surfaces (including litter, soil , canopy interception, water bodies), sublimation from snow and transpiration

# Process Links
[[process_transpiration]][[process_soil_evaporation]][[process_litter_evaporation]][[process_interception_evaporation]][[process_sublimation]]

# Measurements

## Techniques, Product Evaluation, Error/Uncertainty Papers

- **Eddy covariance methods** for stand-scale evapotranspiration partitioning:
  - Wilson, K. B., Baldocchi, D. D., & Hanson, P. J. (2001). Leaf area index and light extinction coefficients. _Agricultural and Forest Meteorology_, 107(1), 93–115.


- **Remote sensing** using thermal imaging to infer transpiration rates:
  - Fisher, J.B., et al. (2020). The future of evapotranspiration: Global requirements for ecosystem functioning, carbon and climate feedbacks, agricultural management, and water resources. _Water Resources Research_, 56(4), e2019WR026236.
  - Zhang, Ke, John S. Kimball, and Steven W. Running. "A review of remote sensing based actual evapotranspiration estimation." _Wiley interdisciplinary reviews: Water_ 3, no. 6 (2016): 834-853.

## Sources/Database
- FLUXNET https://fluxnet.org/

Satellite ET estimates https://www.earthdata.nasa.gov/topics/atmosphere/evapotranspiration/data-access-tools

Miralles, D.G., Bonte, O., Koppa, A. _et al._ GLEAM4: global land evaporation and soil moisture dataset at 0.1° resolution from 1980 to near present. _Sci Data_ **12**, 416 (2025). https://doi.org/10.1038/s41597-025-04610-y

# Model Output Paper Examples
## References
- Wang, Kaicun, and Robert E. Dickinson. "A review of global terrestrial evapotranspiration: Observation, modeling, climatology, and climatic variability." _Reviews of Geophysics_ 50, no. 2 (2012).

Yang, Yuting, Michael L. Roderick, Hui Guo, Diego G. Miralles, Lu Zhang, Simone Fatichi, Xiangzhong Luo et al. "Evapotranspiration on a greening Earth." _Nature Reviews Earth & Environment_ 4, no. 9 (2023): 626-641.
