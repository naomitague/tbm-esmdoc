Studies vary in how vegetation changes is estimated (or modelled) and metrics used to summarize 'vegetation' change and similarly how evapotranspiration or streamflow change change is estimated or modelled and metrics used to summarizes change (e.g annual versus monthly evapotranspiration). Studies also vary across scale.  Different approach are used to describe the relationship - from  estimates of elasticity or sensitivity to predictive models of the change in ET with change in vegetation. 



```mermaid
flowchart TB
    subgraph ET_DOMAIN["🌫️ Evapotranspiration (ET)"]
        direction TB
        subgraph ET_METRICS["Metrics"]
            direction LR
            AET[Annual ET]
            IAV[IAV]
            SEAS[Seasonality]
            WS[Water Stress]
        end
        subgraph ET_METHODS["Methods"]
            direction LR
            subgraph ET_RS["Remote Sensing"]
                direction LR
                THERM[Thermal]
                ORS[Other RS]
            end
            FLUX[Flux Tower]
            LSMET[LSM]
            TREE[Tree-scale]
        end
    end

    subgraph REL["🔗 Relationship Methods"]
        direction LR
        REG[Regression]
        subgraph ML["Machine Learning"]
            direction LR
            GB[Grad. Boost]
            RF[Random Forest]
        end
    end

    subgraph VEG_DOMAIN["🌿 Vegetation Change"]
        direction TB
        subgraph VEG_METRICS["Metrics"]
            direction LR
            SPEC[Species]
            LAIV[LAI]
            COVER[Canopy Cover]
            HEIGHT[Height]
            BIOMASS[Biomass]
        end
        subgraph VEG_METHODS["Methods"]
            direction LR
            VRS[Remote Sensing]
            MOD[Modelled]
        end
    end

    ET_METRICS --> REL
    ET_METHODS --> REL
    REL --> VEG_METRICS
    REL --> VEG_METHODS

    click AET "obsidian://open?vault=YourVaultName&file=Annual%20ET"
    click IAV "obsidian://open?vault=YourVaultName&file=Interannual%20Variability%20in%20ET"
    click SEAS "obsidian://open?vault=YourVaultName&file=ET%20Seasonality"
    click WS "obsidian://open?vault=YourVaultName&file=ET%20Under%20Water%20Stress"
    click THERM "obsidian://open?vault=YourVaultName&file=Thermal-based%20ET"
    click ORS "obsidian://open?vault=YourVaultName&file=Other%20RS%20ET%20Methods"
    click FLUX "obsidian://open?vault=YourVaultName&file=Flux%20Tower"
    click LSMET "obsidian://open?vault=YourVaultName&file=Land%20Surface%20Model"
    click TREE "obsidian://open?vault=YourVaultName&file=Tree-scale%20ET%20(Sap-flow%2C%20Isotopes)"
    click REG "obsidian://open?vault=YourVaultName&file=Regression"
    click GB "obsidian://open?vault=YourVaultName&file=Gradient%20Boosting"
    click RF "obsidian://open?vault=YourVaultName&file=Random%20Forest"
    click SPEC "obsidian://open?vault=YourVaultName&file=Species%20Composition"
    click LAIV "obsidian://open?vault=YourVaultName&file=LAI"
    click COVER "obsidian://open?vault=YourVaultName&file=Canopy%20Cover"
    click HEIGHT "obsidian://open?vault=YourVaultName&file=Vegetation%20Height"
    click MOD "obsidian://open?vault=YourVaultName&file=Modelled%20Vegetation%20Change"
    click BIOMASS "obsidian://open?vault=YourVaultName&file=Biomass"
    click VRS "obsidian://open?vault=YourVaultName&file=Remote%20Sensing%20of%20Vegetation%20Change"

    classDef etLeaf fill:#cfe8fb,stroke:#1c5d8c,color:#073656
    classDef vegLeaf fill:#dcf0d0,stroke:#2f6d1f,color:#1a3a10
    classDef relLeaf fill:#ffffff,stroke:#555555,color:#000000

    class AET,IAV,SEAS,WS,THERM,ORS,FLUX,LSMET,TREE etLeaf
    class SPEC,LAIV,COVER,HEIGHT,BIOMASS,VRS,MOD vegLeaf
    class REG,GB,RF relLeaf

    style ET_DOMAIN fill:#1c5d8c,stroke:#0d3a5c,color:#ffffff
    style VEG_DOMAIN fill:#2f6d1f,stroke:#1a3f10,color:#ffffff
    style REL fill:#9a9a9a,stroke:#555555,color:#000000

    style ET_METRICS fill:#fdf6d3,stroke:#d9c76a,color:#000000
    style ET_METHODS fill:#fdf6d3,stroke:#d9c76a,color:#000000
    style ET_RS fill:#fdf6d3,stroke:#d9c76a,color:#000000
    style VEG_METRICS fill:#fdf6d3,stroke:#d9c76a,color:#000000
    style VEG_METHODS fill:#fdf6d3,stroke:#d9c76a,color:#000000
    style ML fill:#fdf6d3,stroke:#d9c76a,color:#000000
```


