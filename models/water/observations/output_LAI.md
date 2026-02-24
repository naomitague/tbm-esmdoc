
Target ESM: RHESSys, https://github.com/RHESSys/RHESSys.git, develop branch 

#  consituent  - carbon, water, nitrogen, energy, other
output_constituent: [carbon]

#  kind - flux, store/state, count, other
output_kind: [state]

#  units
output_units: [m²/m²]

# Process links

[[Leaf area]]
# Description
Leaf Area Index (LAI) quantifies the total one-sided green leaf area per unit ground surface area. LAI can be measured at multiple spatial scales - satellite remote sensing is typically used for coarse scale (> 30m) and large spatial coverage. These all must be calibrated to transfer radiation responses into an LAI At fine scales, on the ground measurements such as hemisphere photography can be used as well as LiDar.  
# Measurements
	# Techniques, Product Evaluation, Error/Uncertainty Papers




Fang, Hongliang, Frederic Baret, Stephen Plummer, and Gabriela Schaepman‐Strub. "An overview of global leaf area index (LAI): Methods, products, validation, and applications." _Reviews of Geophysics_ 57, no. 3 (2019): 739-799.


	# Sources/Database

# Global LAI Datasets Overview

| Product | Sensor(s) / Inputs | Spatial Resolution | Temporal Resolution & Time Span | Error / Quality Metrics | Download / Access |
|--------|--------------------|---------------------|----------------------------------|--------------------------|--------------------|
| **HiQ-LAI** | Reprocessed MODIS LAI (STICA algorithm) | 5 km & 500 m | 8-day composites; 2000–2022 | RMSE ≈ 0.78; improved bias (~−0.06); much better temporal stability than raw MODIS | [ESSD](https://essd.copernicus.org/articles/16/1601/2024/) / [Zenodo DOI: 10.5281/zenodo.8296768](https://zenodo.org/record/8296768) |
| **Copernicus CLMS LAI v2** | SPOT/VEGETATION, PROBA-V | ~1 km | 10-day composites; 1999–2020 | Validated, quality flags available; no updates post-2020 | [CLMS Product Page](https://land.copernicus.eu/en/products/vegetation/leaf-area-index-v2-0-1km) |
| **HLS (Harmonized Landsat & Sentinel-2)** | Landsat + Sentinel-2 reflectance | 30 m | ~2–3 day composites; global (outside Antarctica) | Not LAI directly; requires derivation; high spatial detail | [NASA EarthData](https://www.earthdata.nasa.gov/data/projects/hls) |
| **Sentinel-2 L2A (BOA Reflectance)** | Sentinel-2 MSI bands | 10 m (some 20/60 m) | 5-day revisit; since ~2015 | Requires LAI derivation; quality depends on atmospheric correction (e.g. Sen2Cor) | [Sentinel Data Hub](https://sentinels.copernicus.eu/sentinel-data-access/sentinel-products/sentinel-2-data-products/collection-0-level-2a) |


	


	
