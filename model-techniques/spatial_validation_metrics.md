# Spatial Validation Metrics Reference

| Metric | Tag | Pattern vs. Point | Example Use (Citation) |
|--------|-----|--------------------|--------------------------|
| Root Mean Square Error | `rmse` | Point | Standard baseline; widely used across RS/ET validation studies |
| Bias / Mean Error | `bias` | Point | Standard baseline; widely used across RS/ET validation studies |
| Pearson Correlation Coefficient | `pearson_r` | Point | Standard baseline; widely used across RS/ET validation studies |
| Taylor Diagram | `taylor_diagram` | Point | Composite of correlation, RMSE, and std-dev ratio |
| Empirical Orthogonal Function analysis | `eof` | Pattern | Used to evaluate spatial pattern agreement between a distributed hydrological model and remote-sensing-based ET (spatial pattern evaluation of a calibrated national hydrological model) |
| SPAtial EFficiency metric | `spaef` | Pattern | Composite spatial-pattern metric for calibrating/validating spatially distributed hydrological models against remote sensing latent heat/ET reference fields (Koch et al. 2018, GMD) |
| Beta diversity (mean Euclidean distance) | `beta_diversity` | Pattern | Used to quantify dissimilarity between PFT classification products (Poulter et al. 2011) |
| Moran's I | `morans_i` | Pattern | Used to quantify spatial autocorrelation and define sampling units prior to accuracy assessment of remote sensing products |
| Overall Accuracy | `overall_accuracy` | Point | Standard classification agreement metric (e.g., Landsat vs. Sentinel land cover comparison) |
| Kappa Coefficient | `kappa` | Point | Standard classification agreement metric, typically reported alongside overall accuracy |
| Dominant Land-Cover Type / Relative Bias / Average Structure Scale | `spatial_representativeness` | Pattern | Indicators quantifying how representative a point station is of surrounding pixel heterogeneity, used in LST product validation |
| Triple Collocation Analysis | `tca` | Point | Used to address footprint mismatch between coarse-resolution RS products (e.g., soil moisture) and point-based in-situ measurements |
| Footprint mismatch / CDF comparison | `footprint_mismatch` | Point | Used alongside TCA to reconcile spatial scale disparities between gridded RS products and point observations |

> Note: `rmse`, `bias`, `pearson_r`, and `taylor_diagram` are point-wise/statistical metrics rather than spatially explicit ones — included here since they're the common baseline against which spatial-pattern metrics (EOF, SPAEF, beta diversity) are contrasted.
