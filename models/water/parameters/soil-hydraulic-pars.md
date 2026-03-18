parameter_name: soil hydraulic 

aliases: pedotransfer functions, substrate hydraulic parameters

status: todo
Target ESM: RHESSys, https://github.com/RHESSys/RHESSys.git, develop branch 


tags: [parameter family]
# Parameters Included

[[Psi_air_entry]], [[Field Capacity]], [[pore_size_index]]
# Description

Many soil and substrate hydraulic parameters are inter-related because they vary with physical structure and chemical properties of the substrate. 


# Sources
	# Databases
European Soil Data Centre, which includes soil datasets from Europe and information on the EU Soil Observatory (https://esdac.jrc.ec.europa.eu/,  -

UNSODA the UNsaturated SOil hydraulic DAtabase (UNSODA) USDA https://agdatacommons.nal.usda.gov/articles/dataset/UNSODA_2_0_Unsaturated_Soil_Hydraulic_Database_Database_and_program_for_indirect_methods_of_estimating_unsaturated_hydraulic_properties/24851832

Hydraulic Properties of European Soils (HYPRES) (Wösten et al., 1999)

SURGO and STATSGO (https://www.nrcs.usda.gov/resources/data-and-reports/description-of-statsgo2-database)

 ISRIC Soil Data Hub, which hosts soil data from around the world (https://data.isric.org/geonetwork/srv/eng/catalog.search#/home, l
 soil-related layers of the GAEZ Data Portal developed by the Food and Agriculture Organization of the United Nations (FAO) and the International Institute for Applied Systems Analysis (IIASA) (https://data.apps.fao.org,
 soil-related layers of the OpenLandMap, which shares open geographical and geoscientific data (https://openlandmap.org, 
	# References on measuring/observing
	 # From Model Calibration Database
	 # From Model Calibration Papers

# Conceptual model of parameter variation or controls on the parameter  (for physical parameters only)

Classic

- Clapp, R.B., & Hornberger, G.M. (1978). _Empirical equations for some soil hydraulic properties_. Water Resources Research, 14(4), 601–604.
    
- van Genuchten, M.T., & Nielsen, D.R. (1984). _On describing and predicting the hydraulic properties of unsaturated soils_. Annales Geophysicae.


Recent work on measuring and modeling field capacity and other soil hydraulic properties (pedotransfer functions)

Measurement
Castellini, Mirko, Simone Di Prima, David Moret-Fernández, and Laurent Lassabatere. "Rapid and accurate measurement methods for determining soil hydraulic properties: A review." _Journal of Hydrology and Hydromechanics_ 69, no. 2 (2021): 121-139.

Pedotransfer functions
Van Looy, Kris, Johan Bouma, Michael Herbst, John Koestel, Budiman Minasny, Umakant Mishra, Carsten Montzka et al. "Pedotransfer functions in Earth system science: Challenges and perspectives." _Reviews of Geophysics_ 55, no. 4 (2017): 1199-1256.

Review of measurements and estimation 
Vereecken, Harry, Wulf Amelung, Sara L. Bauke, Heye Bogena, Nicolas Brüggemann, Carsten Montzka, Jan Vanderborght et al.  2022. "Soil hydrology in the Earth system." _Nature Reviews Earth & Environment_ 3, no. 9: 573-587.


new approaches to inferring soil properties and incorporating these into models
Bonetti, S., Wei, Z., & Or, D. (2021). A framework for quantifying hydrologic effects of soil structure across scales. _Communications Earth & Environment_, _2_(1), 107.

Fatichi, Simone, Dani Or, Robert Walko, Harry Vereecken, Michael H. Young, Teamrat A. Ghezzehei, Tomislav Hengl, Stefan Kollet, Nurit Agam, and Roni Avissar. "Soil structure is an important omission in Earth System Models." _Nature communications_ 11, no. 1 (2020): 522.

Limitations - Research Frontiers

How do soil hydraulic properties change at shorter time scales

Sullivan, P.L., S.A. Billings, D. Hirmas, L. Li, X. Zhang, S. Ziegler, K. Murenbeeld, et al. 2022. “Embracing the Dynamic Nature of Soil Structure: A Paradigm Illuminating the Role of Life in Critical Zones of the Anthropocene.” _Earth-Science Reviews_ 225 (February):103873. https://doi.org/10.1016/j.earscirev.2021.103873.