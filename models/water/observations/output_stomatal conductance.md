

Target ESM: RHESSys, https://github.com/RHESSys/RHESSys.git, develop branch 


#  consituent  - carbon, water, nitrogen, energy, other
output_constituent: [carbon, water]

#  kind - flux, store/state, count, other
output_kind: [flux]

#  units
output_kind: [m/s,]

# Description

Stomatal conductance is the rate of  water and carbon exchange between the leaf and surrounding air through small pores in the leaf called stomates. The exchange is a diffusive process and thus varies with gradients (in water, O2 and CO2) and energy. However, the stomates  can open and close to  regulate this rate.


# Process Links

[[process_stomatal_conductance]]

# Measurements


	 # Techniques, Product Evaluation, Error/Uncertainty Papers

Stomatal conductance cannot be measured directly but is inferred from a variety of approaches perhaps most directly through porometers, 
	 Jaume Flexas, Christine Scoffoni, Jorge Gago, Lawren Sack, Leaf mesophyll conductance and leaf hydraulic conductance: an introduction to their measurement and coordination, _Journal of Experimental Botany_, Volume 64, Issue 13, October 2013, Pages 3965–3981, [https://doi.org/10.1093/jxb/ert319](https://doi.org/10.1093/jxb/ert319)

or inferred via gas-exchange and stable isotopes
	 Siegwolf, Rolf TW, Marco M. Lehmann, Gregory R. Goldsmith, Olga V. Churakova, Cathleen Mirande‐Ney, Galina Timoveeva, Rosmarie B. Weigt, and Matthias Saurer. "Updating the dual C and O isotope—Gas‐exchange model: A concept to understand plant responses to the environment and its implications for tree rings." _Plant, Cell & Environment_ 46, no. 9 (2023): 2606-2627.
	 
or leaf temperature or thermal imagery (assuming cooling related to transpiration and water conducance)

Farella, Martha M., Joshua B. Fisher, Wenzhe Jiao, Kesondra B. Key, and Mallory L. Barnes. "Thermal remote sensing for plant ecology from leaf to globe." _Journal of Ecology_ 110, no. 9 (2022): 1996-2014.
Still, Christopher, Rebecca Powell, Donald Aubrecht, Youngil Kim, Brent Helliker, Dar Roberts, Andrew D. Richardson, and Michael Goulden. "Thermal imaging in plant and ecosystem ecology: applications and challenges." _Ecosphere_ 10, no. 6 (2019): e02768.

or fluorescence (using estimates of photosynthesis to back out  CO2 conductance)
	
Swoczyna, Tatiana, Hazem M. Kalaji, Filippo Bussotti, Jacek Mojski, and Martina Pollastrini. "Environmental stress-what can we learn from chlorophyll a fluorescence analysis in woody plants? A review." _Frontiers in Plant Science_ 13 (2022): 1048582.

	 # Sources/Database
	 # Sources papers
	
	
# Model Output Paper Examples
	References

	
Franks, Peter J., Gordon B. Bonan, Joseph A. Berry, Danica L. Lombardozzi, N. Michele Holbrook, Nicholas Herold, and Keith W. Oleson. "Comparing optimal and empirical stomatal conductance models for application in Earth system models." _Global change biology_ 24, no. 12 (2018): 5708-5723.