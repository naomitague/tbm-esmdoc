
Spatial products remote sensing, ESM output, gridded interpolation products are often compared.  General metrics used for comparison and their strengths and weakness are provided below - Variable - specific metrics can be found in pages on that variable

For space-time data - benchmarks may be available - these typically also have errors associated with them but often selected  by experts as the 'best-available''  baseline for comparison
## Summary (single value) measures that can be compared between Products

### Spatially Aggregate measures

*  long term spatial mean (SM)
* inter-annual variation, (IAV)
* trends through time (Trend)

### Disaggregation approaches

For global scale data evaluation/comparison is often broken down into categories and then spatially aggregate measures computed for each category - some commonly used categories are:

*  [[Common Region Classifications]] (Koppen, Biome)
* Plant functional types (see table pft_reference.csv)
*  topopgraphy (elevation (Elev), slope (slp), aspect (asp)) species (species), plant functional type and other meaningful drivers

# Pixel/patch  comparison 

To compare two spatial-data sets pixel-by-pixel, there are a variety of metrics used. Some of these, such as R^2  just summarize **point** by point differences; others (arguably better) also consider whether data sets have similar **patterns**. See summary of commonly used spatial comparison metrics here:  (note if one of the data sets is the benchmark then the metric can be considered an evaluation/error metric) 

[[spatial_validation_metrics]]

# Hypothesis based comparison/evaluation

While standard measures above are commonly used for general performance evaluation when a data product is used to answer a specific research question - it is useful to evaluate how well it is likely to answer the research question.   To do so design a measure that estimate similarity between products in terms of their estimates the behavior of interest (e.g comparing a benchmark and other dataset in terms of their estimate of the the sensitivity of greenness to temperature)

