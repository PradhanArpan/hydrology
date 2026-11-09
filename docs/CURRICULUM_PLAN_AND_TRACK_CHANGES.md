# CE633 Hydrology & Water Resources Engineering
## Comprehensive Curriculum Audit, Topical Breakdown & Track-Changes Pedagogical Enhancement Plan

**Course:** CE633 Hydrology and Water Resources Engineering  
**Programme:** BTech Civil Engineering, CHRIST (Deemed to be University), Kengeri Campus  
**Instructor:** Dr Arpan Pradhan  
**Document Purpose:** Detailed session-by-session audit of current topics, sub-topics, and delivery modalities (theory, definitions, worked examples, interactive widgets, software workbenches, check activities, quizzes, exams), accompanied by an extensive **Track-Changes Enhancement Plan** to maximize student engagement, active learning, and real-world relevance.

---

## 1. Executive Curriculum Architecture & Current Modality Distribution

The course is structured across **5 Units**, comprising **45 Lecture Sessions (`S01`–`S45`)** and **17 Applied Software Labs (`L01`–`L17`)**.

### Current Delivery Modalities Matrix

| Unit | Syllabus Scope | Primary Current Modalities | Interactive Widgets / Illos | Lab Links |
|---|---|---|---|---|
| **Unit I (S01–S09)** | Hydrology, Water Budget, Precipitation, Rain Gauges, Consistency, Mean Areal Rainfall, Missing Data, IDF Curves, DEM Delineation | Theory, Derivations, 2 Worked Examples/session, In-Class `check`, Self-Assessment `quiz`, 2/5/10m Exam questions | **25 custom SVG/React components** (`globalwater`, `indiawater`, `indiamap`, `cycle`, `waterbudget`, `gauges`, `tipping`, `dmc`, `thiessen`, `missing`, `storm`, `idf`, `dad`, `d8`, etc.) | **Labs L01–L10** (HEC-HMS setup, Castro Valley, basins, meteorology, Thiessen in QGIS) |
| **Unit II (S10–S18)** | Evaporation, Dalton's Law, Pans, Empirical formulas, Infiltration, Horton's Eq, $\phi$/W-index, ET, Penman, Blaney-Criddle, SCS-CN, Runoff Regression | Theory, Derivations, Slide Numericals, 2 Worked Examples/session, In-Class `check`, Self-Assessment `quiz`, 2/5/10m Exam questions | **6 interactive widgets** (`abstractions`, `dalton`, `pencalc`, `hortonfit`, `phiindex`, `scscn`) | **Labs L11–L16** (Horton fitting, double-ring, SCS-CN in HMS, Penman spreadsheet, event modeling) |
| **Unit III (S19–S27)** | Hydrographs, Recession Analysis, Baseflow Separation, Unit Hydrograph, Deconvolution, S-Curve, Snyder's SUH, SCS Dimensionless UH, Instantaneous UH (Nash), Muskingum Routing | Rigorous Theory, Mathematical Derivations, Slide Numericals, 2 Worked Examples/session, In-Class `check`, Self-Assessment `quiz`, 2/5/10m Exam questions | **0 interactive widgets** *(relies on KaTeX math & ASCII diagrams)* | **HMS Hydrographs & Spreadsheet convolution** |
| **Unit IV (S28–S36)** | Stage Measurement, Area-Velocity, Slope-Area, Rating Curves, Loop Hysteresis (Jones Eq), Dilution Gauging, ADCP, Flood Risk, Gumbel EV-I, Log-Pearson III, Brune Sedimentation | Rigorous Theory, Derivations, Checked Numerical Examples, In-Class `check`, Self-Assessment `quiz`, 2/5/10m Exam questions | **0 interactive widgets** *(relies on KaTeX math & ASCII diagrams)* | **HEC-RAS geometry & steady flow, HEC-SSP frequency fitting** |
| **Unit V (S37–S45)** | Aquifer Types, Soil Constants, Darcy's Law, Seepage Velocity, Layered $K_h/K_v$, Dupuit-Thiem Unconfined Wells, Thiem Confined Wells, Theis Unsteady Flow, Cooper-Jacob, Well Losses, Recuperation, RWH & MAR | Rigorous Theory, Derivations, Checked Numerical Examples, In-Class `check`, Self-Assessment `quiz`, 2/5/10m Exam questions | **0 interactive widgets** *(relies on KaTeX math & ASCII diagrams)* | **QGIS buffer zones, 3D drawdown raster, Python Cooper-Jacob, CGWB RWH sizing** |

---

## 2. Track-Changes Legend & Audit Conventions

To clearly convey audit observations and proposed innovations, each session below is reviewed using four structured dimensions:

- **`[CURRENT COVERAGE]`**: The exact topics, sub-topics, mathematical models, and delivery modalities currently implemented in the session markdown (`sessions/Sxx.md`).
- **`[CURRICULUM ALIGNMENT NOTE]`**: Flags any title-to-content discrepancies between `sessions.json` and the markdown file, ensuring syllabus integrity.
- **`[TRACK CHANGES: PROPOSED CONTENT ADDITIONS]`**: Concrete topics, modern hydrologic technologies, Indian standards (IS / CWC / CGWB), and real-world case studies to introduce.
- **`[TRACK CHANGES: LEARNER-FRIENDLY INTERACTIVE UPGRADES]`**: Specific visual simulators, interactive workbenches, gamified check exercises, and intuitive analogies to develop.

---

## 3. Unit-by-Unit Deep Dive & Track-Changes Audit

### UNIT I: Hydrology, Precipitation and Basin Characteristics (S01–S09)

#### Session S01: Hydrology and the Water Budget
- **`[CURRENT COVERAGE]`**:
  - *Topics & Sub-Topics*: Definition, engineering importance, global freshwater distribution, water resources of India (CWC 2019 reassessment, 1,999 BCM surface runoff, utilizable potential), hydrologic cycle components, catchment concept and drainage divides, catchment water balance equation ($\Delta S = P - R - E - T - G$).
  - *Delivery Modalities*: Descriptive prose, mathematical balance equations, 7 custom SVG widgets (`globalwater`, `indiawater`, `indiamap`, `cycle`, `horton`, `catchment`, `waterbudget`), 1 worked example, 1 check exercise, 3 quiz items, exam questions.
- **`[TRACK CHANGES: PROPOSED CONTENT ADDITIONS]`**:
  - **`+ [Include]` Virtual Water & Water Footprint**: Introduce concepts of blue water, green water, and grey water in civil infrastructure projects.
  - **`+ [Include]` Interstate Water Disputes Case Context**: Contextualize water budget allocations with the Cauvery River Water Disputes Tribunal (CWDT) basin sharing realities.
  - **`+ [Include]` Climate Change Impacts**: Non-stationarity of the hydrologic cycle (IPCC AR6 findings on intensifying extremes in South Asia).
- **`[TRACK CHANGES: LEARNER-FRIENDLY INTERACTIVE UPGRADES]`**:
  - **Interactive Catchment Sandbox Widget (`catchment-sandbox`)**: A 2D topography slider where students drag the catchment outlet point and observe drainage area, ridge-lines, and water budget dynamically recalculating.

---

#### Session S02: Precipitation: Forms and Types
- **`[CURRENT COVERAGE]`**:
  - *Topics & Sub-Topics*: Atmospheric moisture, condensation nuclei, forms of precipitation (drizzle, rain, sleet, snow, hail, glaze), meteorological lifting mechanisms (convective, orographic, cyclonic / frontal). Indian monsoon circulation (SW monsoon, NE monsoon, Western Disturbances).
  - *Delivery Modalities*: Conceptual prose, classifications, interactive lifting mechanism illustration (`precip`), 1 worked example (orographic rainfall gradient across Western Ghats), 1 check activity, 3 quiz items.
- **`[TRACK CHANGES: PROPOSED CONTENT ADDITIONS]`**:
  - **`+ [Include]` Indian Doppler Weather Radar (DWR) Network**: Explain how IMD's dual-polarization S-band / X-band radar network measures precipitation reflectivity ($Z\text{--}R$ relationships).
  - **`+ [Include]` Cloudburst Phenomenon & Flash Floods**: Definition of cloudburst ($> 100\text{ mm/h}$ over $20\text{--}30\text{ km}^2$) with reference to Himalayan / urban convective cloudbursts.
  - **`+ [Include]` Satellite Precipitation Estimation**: Introduce NASA GPM / IMD INSAT-3D rainfall products (crucial for ungauged Indian catchments).
- **`[TRACK CHANGES: LEARNER-FRIENDLY INTERACTIVE UPGRADES]`**:
  - **Raindrop Formation & Terminal Velocity Interactive Chart**: Interactive KaTeX-linked curve comparing raindrop diameter ($0.5\text{--}6.0\text{ mm}$) to fall velocity ($2\text{--}9\text{ m/s}$) based on Stokes vs turbulent drag.

---

#### Session S03: Rain Gauges and Networks
- **`[CURRENT COVERAGE]`**:
  - *Topics & Sub-Topics*: Point measurement of rainfall; non-recording gauges (Symons gauge, IS:5225); recording gauges (tipping bucket, weighing bucket, natural siphon / float gauge, IS:5235); radar/optical disdrometers; optimum rain gauge network design based on coefficient of variation of historical rainfall ($N = (C_v / \epsilon)^2$); WMO and IS:4987 station density norms.
  - *Delivery Modalities*: High-detail schematics, Wikimedia photo gallery (`:::photos`), 7 interactive widgets (`gauges`, `tipping`, `weighgauge`, `floatgauge`, `gaugemap`, `stormnet`, `network`), worked example on adding stations, check activity, quiz.
- **`[TRACK CHANGES: PROPOSED CONTENT ADDITIONS]`**:
  - **`+ [Include]` IoT Telemetric Automatic Weather Stations (AWS)**: Low-cost solar-powered tipping bucket AWS connected via cellular/satellite to state portals (e.g. KSNDMC telemetric network in Karnataka with 6,000+ gram panchayat gauges).
  - **`+ [Include]` Rain Gauge Exposure & Siting Errors**: Wind-induced undercatch (Koschmieder effect, Alter / Nipher wind shields).
- **`[TRACK CHANGES: LEARNER-FRIENDLY INTERACTIVE UPGRADES]`**:
  - **Rain Gauge Network Optimizer Workbench**: Map of a catchment where students place rain gauges; the tool calculates the spatial $C_v$, displays the sampling error percentage $\epsilon$, and flags under-represented elevation zones.

---

#### Session S04: Double Mass Curve (DMC)
- **`[CURRENT COVERAGE]`**:
  - *Topics & Sub-Topics*: Consistency of hydrologic records; causes of inconsistency (gauge relocation, ecosystem changes, change in exposure, observer bias); double mass curve theory and cumulative plot construction; detecting break in slope; slope ratio correction factor ($c = S_a / S_b$); correction of historical records.
  - *Delivery Modalities*: Analytical explanation, step-by-step table, 6-step interactive stepper widget (`dmc`) with "Paste your data" feature, worked example, check calculation, exam problems.
- **`[TRACK CHANGES: PROPOSED CONTENT ADDITIONS]`**:
  - **`+ [Include]` Statistical Tests for Homogeneity**: Complementing DMC with the Mann-Whitney U test, Pettitt's test, or standard normal homogeneity test (SNHT).
  - **`+ [Include]` Multi-Station Base Selection**: Criteria for selecting the 5–10 surrounding base stations to avoid correlated micro-climate shifts.
- **`[TRACK CHANGES: LEARNER-FRIENDLY INTERACTIVE UPGRADES]`**:
  - **Interactive Fault-Injector Sandbox**: Let students inject simulated gauge relocation errors (e.g. $+25\%$ from year 2015) and watch the break point auto-detect on the cumulative chart.

---

#### Session S05: Mean Areal Rainfall
- **`[CURRENT COVERAGE]`**:
  - *Topics & Sub-Topics*: Spatial integration of point rainfall; Arithmetic mean method; Thiessen polygon method (areal weighting $w_i = A_i/A$); Isohyetal method (linear interpolation of contours, planimetering inter-isohyetal areas).
  - *Delivery Modalities*: Comparative methodology, interactive method visualizer (`threemethods`), interactive geometric Thiessen polygon construction tool (`thiessen`), worked numericals, check activities, quiz.
- **`[TRACK CHANGES: PROPOSED CONTENT ADDITIONS]`**:
  - **`+ [Include]` Hypsometric & PRISM Interpolation**: Orographic elevation adjustment in mountain catchments ($P(z) = a + b z$).
  - **`+ [Include]` Inverse Distance Weighting (IDW) & Kriging**: Transitioning classical Thiessen polygons to modern GIS spatial interpolation algorithms.
- **`[TRACK CHANGES: LEARNER-FRIENDLY INTERACTIVE UPGRADES]`**:
  - **Point-and-Drag Thiessen Explorer**: An interactive polygon canvas where dragging an inland station dynamically morphs the Voronoi cell boundaries and recalculates catchment average rainfall in real time.

---

#### Session S06: Missing Rainfall Data Estimation
- **`[CURRENT COVERAGE]`**:
  - *Topics & Sub-Topics*: Data discontinuities in historical series; Arithmetic Average method (when normal annual rainfalls differ by $< 10\%$); Normal Ratio Method (NRM: $P_x = \frac{N_x}{m} \sum \frac{P_i}{N_i}$); Reciprocal distance squared (Inverse Distance Method).
  - *Delivery Modalities*: Mathematical derivations, interactive missing-data calculator widget (`missing`), worked numericals, check activities, exam questions.
- **`[TRACK CHANGES: PROPOSED CONTENT ADDITIONS]`**:
  - **`+ [Include]` Linear Regression & Machine Learning Imputation**: Bivariate linear regression ($P_x = a + b P_y$), Multiple Linear Regression (MLR), and Random Forest imputation of missing sensor data.
  - **`+ [Include]` IMD Gridded Reanalysis Fallback**: Using IMD $0.25^\circ \times 0.25^\circ$ gridded datasets (`imdlib`) to substitute long gap periods in Indian catchments.
- **`[TRACK CHANGES: LEARNER-FRIENDLY INTERACTIVE UPGRADES]`**:
  - **Method Selector Decision-Tree Widget**: An interactive flow diagram where students input normal annual rainfall values ($N_A, N_B, N_C, N_x$), and the widget highlights whether Arithmetic Average or Normal Ratio is legally permissible under IS guidelines.

---

#### Session S07: Presentation of Rainfall Data (Hyetographs & Mass Curves)
- **`[CURRENT COVERAGE]`**:
  - *Topics & Sub-Topics*: Chronological rainfall presentation; Mass curve of rainfall (cumulative depth vs time, slope equals intensity); Hyetograph (bar chart of rainfall intensity vs time); Moving average smoothing for secular trends.
  - *Delivery Modalities*: Conceptual definitions, interactive storm hyetograph generator (`storm`), interactive moving average smoother (`movavg`), worked examples, check activities.
- **`[TRACK CHANGES: PROPOSED CONTENT ADDITIONS]`**:
  - **`+ [Include]` Synthetic Design Hyetographs**: Alternating Block Method (USGS / NRCS design hyetograph) for sizing storm sewers.
  - **`+ [Include]` Chicago Design Storm**: Intensity distribution for urban drainage modeling.
- **`[TRACK CHANGES: LEARNER-FRIENDLY INTERACTIVE UPGRADES]`**:
  - **Dual-Pane Mass Curve $\leftrightarrow$ Hyetograph Converter**: A side-by-side interactive widget where students edit bars on the hyetograph and instantly see the cumulative mass curve slope respond, demonstrating that $i = \Delta P / \Delta t$.

---

#### Session S08: Intensity-Duration-Frequency (IDF) & DAD Curves
- **`[CURRENT COVERAGE]`**:
  - *Topics & Sub-Topics*: Rainfall extremes; Return period ($T$) and risk ($R$); Empirical plotting positions (Weibull); IDF curve equation ($i = \frac{K T^m}{(D + a)^n}$); Depth-Area-Duration (DAD) analysis; maximum depth-area curves for various storm durations.
  - *Delivery Modalities*: Mathematical formulations, 3 interactive widgets (`risk`, `idf`, `dad`), worked numericals, check calculations, quiz.
- **`[TRACK CHANGES: PROPOSED CONTENT ADDITIONS]`**:
  - **`+ [Include]` Indian CWC / IMD Regional IDF Relations**: Standard empirical formulas published by Central Water Commission for different sub-zones of India (e.g., CWC Zone 3(a) Southern Penninsular).
  - **`+ [Include]` Probable Maximum Precipitation (PMP)**: Statistical method (Hershfield's $PMP = \bar{X}_n + K_m S_n$) and meteorological moisture maximization.
- **`[TRACK CHANGES: LEARNER-FRIENDLY INTERACTIVE UPGRADES]`**:
  - **Interactive IDF Curve Generator**: Slider for storm duration ($5\text{ min to } 24\text{ h}$) and return period ($2\text{ to } 100\text{ years}$); outputs design rainfall intensity and calculates peak discharge via Rational Method ($Q = \frac{1}{360} C I A$).

---

#### Session S09: Catchment Delineation & Thiessen in QGIS
- **`[CURRENT COVERAGE]`**:
  - *Topics & Sub-Topics*: GIS hydrologic modeling; Digital Elevation Models (DEM: SRTM, CartoDEM, TanDEM-X); D8 flow direction algorithm; flow accumulation; stream network raster thresholding; vector Voronoi polygons.
  - *Delivery Modalities*: Workflow steps, interactive D8 direction grid visualizer (`d8`), worked examples, check calculation, QGIS software lab linkage (Lab L09/L10).
- **`[TRACK CHANGES: PROPOSED CONTENT ADDITIONS]`**:
  - **`+ [Include]` Sinks / Depressions Pre-Processing**: Planchon & Darboux fill algorithms, hydrological conditioning, and burn-in of existing river vectors.
  - **`+ [Include]` Web-GIS Portals**: ISRO Bhuvan CartoDEM download, India-WRIS watershed atlas boundary extraction.
- **`[TRACK CHANGES: LEARNER-FRIENDLY INTERACTIVE UPGRADES]`**:
  - **Interactive D8 Matrix Puzzle**: A $4 \times 4$ elevation grid game where students click the steepest downslope direction for each cell and watch streams automatically delineate.

---

### UNIT II: Abstractions from Precipitation (S10–S18)

#### Session S10: Losses & Evaporation Physics
- **`[CURRENT COVERAGE]`**:
  - *Topics & Sub-Topics*: The abstraction hierarchy; Interception loss (vegetative canopy storage, Horton's empirical formula); Depression storage; Evaporation physics; Dalton's law of evaporation ($E = C (e_w - e_a)$); factors influencing evaporation (vapor pressure gradient, temperature, wind speed, water surface area, salinity, water depth).
  - *Delivery Modalities*: Physical theory, 2 custom interactive widgets (`abstractions`, `dalton`), worked numericals, check calculation, exam questions.
- **`[TRACK CHANGES: PROPOSED CONTENT ADDITIONS]`**:
  - **`+ [Include]` Water-Saving Evaporation Retardants**: Monomolecular chemical films (cetyl alcohol, stearyl alcohol), floating solar panels, and shade balls on reservoirs.
  - **`+ [Include]` Salinity Effect on Vapor Pressure**: Raoult's law correction ($e_{ws} = e_w (1 - 0.00053 S)$) for coastal water bodies and estuaries.
- **`[TRACK CHANGES: LEARNER-FRIENDLY INTERACTIVE UPGRADES]`**:
  - **Dalton Evaporation Sandbox**: Sliders for air temperature, water temperature, relative humidity, and wind speed showing instantaneous millimeter/day evaporation rate and water surface energy exchange.

---

#### Session S11: Evaporimeters & Empirical Evaporation Formulas
- **`[CURRENT COVERAGE]`**:
  - *Topics & Sub-Topics*: Measurement of evaporation; IS Class A pan (IS:5973) with wire mesh cover; USWB Class A pan; Colorado sunken pan; Pan coefficient ($C_p \approx 0.70\text{--}0.80$); Lake evaporation water balance; Empirical formulas: Meyer's formula, Rohwer's formula.
  - *Delivery Modalities*: Equipment drawings, Wikimedia field photo (`:::photos`), interactive Penman/Pan widget (`pencalc`), 2 worked numerical examples (lake water budget with pan evaporation), check calculations, quiz.
- **`[TRACK CHANGES: PROPOSED CONTENT ADDITIONS]`**:
  - **`+ [Include]` Energy Balance Method (Bowen Ratio)**: Thermodynamic energy balance equation ($Q_N = Q_H + Q_E + Q_G + Q_v$) and sensible vs latent heat partitioning.
  - **`+ [Include]` Eddy Covariance Towers**: Modern flux towers measuring high-frequency 3D wind velocity and water vapor fluctuations.
- **`[TRACK CHANGES: LEARNER-FRIENDLY INTERACTIVE UPGRADES]`**:
  - **Pan-to-Lake Scale Interactive Workbench**: Visual comparison of thermal lag in shallow pans vs deep reservoirs (seasonal heat storage $Q_\theta$).

---

#### Session S12: Infiltration Dynamics & Horton's Equation
- **`[CURRENT COVERAGE]`**:
  - *Topics & Sub-Topics*: Infiltration mechanics; Infiltration capacity ($f_p$) vs actual infiltration rate ($f$); Double-ring infiltrometer operation; Horton's infiltration equation ($f(t) = f_c + (f_0 - f_c) e^{-k t}$); Cumulative infiltration ($F(t) = f_c t + \frac{f_0 - f_c}{k}(1 - e^{-k t})$); Determination of parameters ($f_0, f_c, k$) from field test data.
  - *Delivery Modalities*: Theoretical derivations, custom interactive widget (`hortonfit`), 2 worked numerical examples (ponding time, cumulative depth), check activities, exam problems.
- **`[TRACK CHANGES: PROPOSED CONTENT ADDITIONS]`**:
  - **`+ [Include]` Green-Ampt Infiltration Model**: Physics-based model based on Darcy's law and wetting front suction head ($\Delta \theta, \psi, K$).
  - **`+ [Include]` Soil Crust & Hydrophobic Soils**: Impact of forest fires, compaction, and urban topsoil sealing on initial infiltration $f_0$.
- **`[TRACK CHANGES: LEARNER-FRIENDLY INTERACTIVE UPGRADES]`**:
  - **Wetting Front Depth Animator**: Visual cross-section of soil column showing suction pressure gradient and wetting front penetration over time as Horton decay progresses.

---

#### Session S13: Infiltration Indices ($\phi$-Index & $W$-Index)
- **`[CURRENT COVERAGE]`**:
  - *Topics & Sub-Topics*: Constant average infiltration loss models; $\phi$-index definition ($\phi = \frac{P - R}{t_e}$); Effective rainfall duration ($t_e$); Iterative step-by-step determination of $\phi$-index across multi-hour hyetograph pulses; $W$-index ($W = \frac{P - R - I_a}{t_r}$).
  - *Delivery Modalities*: Methodology, custom interactive widget (`phiindex`), 2 worked examples (multi-pulse hyetograph iterations), check calculations, exam problems.
- **`[TRACK CHANGES: PROPOSED CONTENT ADDITIONS]`**:
  - **`+ [Include]` Seasonal & AMC Variation of $\phi$-Index**: Changes in $\phi$-index before and after monsoon saturation in Indian agricultural catchments.
  - **`+ [Include]` Basin Scale vs Plot Scale $\phi$-Index**: Spatial heterogeneity and scale dependency when scaling infiltrometer data to whole river basins.
- **`[TRACK CHANGES: LEARNER-FRIENDLY INTERACTIVE UPGRADES]`**:
  - **Interactive Hyetograph Water-Level Slider**: Students drag the horizontal $\phi$-index line across a 6-hour bar chart; effective bars above the line automatically highlight in blue, excluded bars in gray, with instant calculation of total runoff volume.

---

#### Session S14: Evapotranspiration & Blaney-Criddle Method
- **`[CURRENT COVERAGE]`**:
  - *Topics & Sub-Topics*: Evapotranspiration concepts; Potential Evapotranspiration (PET) vs Actual Evapotranspiration (AET); Reference crop evapotranspiration ($ET_0$); Lysimeters; Blaney-Criddle empirical formula ($CU = k \cdot f$ where $f = \frac{p(0.46 T_c + 8.13)}{100}$ or T1 °F version); Crop consumptive use.
  - *Delivery Modalities*: Agronomic hydrology theory, mathematical formulation, 2 worked examples (monthly crop water requirements for cotton/wheat), check calculations, exam questions.
- **`[CURRICULUM ALIGNMENT NOTE]`**:
  - Currently S14 does not feature a dedicated interactive widget.
- **`[TRACK CHANGES: PROPOSED CONTENT ADDITIONS]`**:
  - **`+ [Include]` FAO-56 Penman-Monteith Single Crop Coefficient**: Crop growth stages (initial, crop development, mid-season, late season) and $K_c$ curve.
  - **`+ [Include]` Modern Irrigation Water Management**: Crop Water Requirement (CWR) vs Net Irrigation Requirement (NIR) for drip and sprinkler scheduling.
- **`[TRACK CHANGES: LEARNER-FRIENDLY INTERACTIVE UPGRADES]`**:
  - **`+ [NEW WIDGET]` Crop Water Demand Calculator (`cropet-calc`)**: Select crop type (Rice, Wheat, Sugarcane, Cotton) and Indian agro-climatic zone to generate monthly consumptive use and irrigation calendar.

---

#### Session S15: Penman Equation & Crop Coefficients
- **`[CURRENT COVERAGE]`**:
  - *Topics & Sub-Topics*: The Penman combination equation; Energy balance term ($H_n$) and aerodynamic vapor transfer term ($E_a$); Slope of saturation vapor pressure curve ($\Delta$ or $A$); Psychrometric constant ($\gamma$); Weighting equation $\text{PET} = \frac{A H_n + E_a \gamma}{A + \gamma}$; Crop coefficient ($K_c$) approach ($AET = K_c \cdot PET$).
  - *Delivery Modalities*: Theoretical thermodynamic derivation, interactive engineering calculator widget (`pencalc`), 2 worked numerical examples, check calculations, exam questions.
- **`[TRACK CHANGES: PROPOSED CONTENT ADDITIONS]`**:
  - **`+ [Include]` FAO-56 Penman-Monteith Modification**: Surface aerodynamic resistance ($r_a$) and canopy bulk stomatal resistance ($r_s$) formulation.
  - **`+ [Include]` Satellite ET Products**: Remote sensing based ET estimation (MODIS / Landsat SEBAL / METRIC algorithms).
- **`[TRACK CHANGES: LEARNER-FRIENDLY INTERACTIVE UPGRADES]`**:
  - **Energy vs Aerodynamic Ratio Slider in `pencalc`**: Dynamic bar showing percentage contribution of solar radiation vs wind vapor pressure deficit across different seasons (e.g. humid calm monsoon vs hot dry windy summer).

---

#### Session S16: Runoff & Catchment Water Yield
- **`[CURRENT COVERAGE]`**:
  - *Topics & Sub-Topics*: Runoff components: surface runoff, interflow (subsurface stormflow), baseflow; Perennial, intermittent, and ephemeral streams; Catchment water yield; Flow duration curves (FDC); 75% dependable flow ($Q_{75}$) for irrigation planning; Bivariate rainfall-runoff regression ($R = a P + b$).
  - *Delivery Modalities*: Flow taxonomy, linear regression derivation, worked examples (catchment yield over 350 km$^2$), check calculations, quiz.
- **`[CURRICULUM ALIGNMENT NOTE]`**:
  - S16 lacks an interactive widget.
- **`[TRACK CHANGES: PROPOSED CONTENT ADDITIONS]`**:
  - **`+ [Include]` Flow Duration Curve (FDC) Analysis**: Constructing FDC from daily flow data; assessing environmental flows ($Q_{90}, Q_{95}$) for river ecological health.
  - **`+ [Include]` Inglis & De Souza / Barlow's Empirical Formulas**: Traditional Indian regional runoff formulas used for Maharashtra and Northern Indian catchments.
- **`[TRACK CHANGES: LEARNER-FRIENDLY INTERACTIVE UPGRADES]`**:
  - **`+ [NEW WIDGET]` Flow Duration Curve Analyzer (`fdc-explorer`)**: Interactive curve showing discharge exceedance probabilities ($Q_{10}, Q_{50}, Q_{75}, Q_{90}$) with toggle for perennial vs ephemeral stream regimes.

---

#### Session S17: SCS Curve Number Method
- **`[CURRENT COVERAGE]`**:
  - *Topics & Sub-Topics*: The NRCS / SCS Curve Number method; Maximum potential retention ($S = \frac{25400}{CN} - 254$); Initial abstraction ($I_a = 0.2 S$); Rainfall-runoff equation ($Q = \frac{(P - I_a)^2}{P - I_a + S}$); Hydrologic Soil Groups (A, B, C, D); Antecedent Moisture Conditions (AMC I, AMC II, AMC III) conversion formulas; Composite curve number calculation.
  - *Delivery Modalities*: Methodological derivations, custom interactive calculator widget (`scscn`), 2 worked examples (composite CN and storm runoff), check calculations, exam questions.
- **`[TRACK CHANGES: PROPOSED CONTENT ADDITIONS]`**:
  - **`+ [Include]` Modified Initial Abstraction Ratio**: Recent studies adopting $I_a = 0.05 S$ for Indian conditions to avoid underestimating small storm runoff.
  - **`+ [Include]` Slope-Adjusted Curve Numbers**: Huang's formula adjusting standard CN for steep hilly terrain ($> 5\%$ slope).
- **`[TRACK CHANGES: LEARNER-FRIENDLY INTERACTIVE UPGRADES]`**:
  - **Land-Use & Soil Matrix Visualizer**: Drag a pie-chart of land-uses (forest, residential, agriculture) and soil types (A, B, C, D) to generate the weighted composite CN and watch the resulting runoff hydrograph respond.

---

#### Session S18: Verifying Losses with Software & PBL Milestone 2
- **`[CURRENT COVERAGE]`**:
  - *Topics & Sub-Topics*: Comparative evaluation of loss methods in HEC-HMS (Deficit and Constant, Initial and Constant, SCS-CN, Green and Ampt); Model calibration against observed gauge hydrographs; GIS parameter extraction; PBL Milestone 2 integration.
  - *Delivery Modalities*: Analytical comparison tables, parameter extraction checklists, worked example, check calculation, HEC-HMS lab connection (Labs L14, L15, L16).
- **`[TRACK CHANGES: PROPOSED CONTENT ADDITIONS]`**:
  - **`+ [Include]` Automated Optimization & Objective Functions in HEC-HMS**: Sum of squared residuals, Nash-Sutcliffe Efficiency (NSE), and Percent Bias (PBIAS).
  - **`+ [Include]` Sensitivity Analysis**: Identifying whether model runoff volume is more sensitive to Curve Number, Initial Abstraction, or Subbasin Area.
- **`[TRACK CHANGES: LEARNER-FRIENDLY INTERACTIVE UPGRADES]`**:
  - **`+ [NEW WIDGET]` Goodness-of-Fit Dashboard (`nse-evaluator`)**: Compare simulated vs observed hydrograph points with dynamic calculation of Nash-Sutcliffe Efficiency ($NSE$), $R^2$, and peak timing error.

---

### UNIT III: Hydrographs and Streamflow Synthesis (S19–S27)

#### Session S19: The Hydrograph & Recession Analysis
- **`[CURRENT COVERAGE]`**:
  - *Topics & Sub-Topics*: Anatomy of a flood hydrograph: approach segment, rising limb (concentration curve), crest segment with peak discharge ($Q_p$), recession limb (falling limb); Time to peak ($t_p$), lag time ($t_L$), time base ($t_b$); Mathematical analysis of groundwater recession curve ($Q_t = Q_0 K_r^t$); Storage-discharge relationship ($S = K Q$).
  - *Delivery Modalities*: Mathematical derivations, semi-log recession slope plotting, 2 worked numerical examples (recession constant $K_r = 0.960$, remaining storage $1.486\text{ MCM}$), 2 check calculations, quiz, exam problems.
- **`[CURRICULUM ALIGNMENT NOTE]`**:
  - High mathematical rigor; currently zero interactive widgets.
- **`[TRACK CHANGES: PROPOSED CONTENT ADDITIONS]`**:
  - **`+ [Include]` Master Recession Curve (MRC) Construction**: Stripping method and matching strip method for compiling multi-year dry season hydrograph segments.
  - **`+ [Include]` Hydrograph Separation in Hard-Rock Hardpan**: Quickflow vs slow fracture springflow in peninsular basalt/granite regimes.
- **`[TRACK CHANGES: LEARNER-FRIENDLY INTERACTIVE UPGRADES]`**:
  - **`+ [NEW WIDGET]` Hydrograph Anatomy Explorer (`hydro-anatomy`)**: An interactive hydrograph where hovering over crest, rising limb, inflection point, and inflection points highlights their physical hydrologic causes (surface detention vs channel storage vs baseflow).

---

#### Session S20: Factors Affecting Hydrographs & Baseflow Separation
- **`[CURRENT COVERAGE]`**:
  - *Topics & Sub-Topics*: Physiographic factors (catchment shape: fan-shaped vs fern-shaped; drainage density; stream slope; land use); Hydro-meteorologic factors (storm direction, intensity, duration); Baseflow separation methods: Straight-line method, Fixed base method ($N = 0.83 A^{0.2}$), Variable slope method; Direct Runoff Hydrograph (DRH) construction.
  - *Delivery Modalities*: Conceptual diagrams, Linsley equation, 2 worked examples (catchment $450\text{ km}^2$, $N = 2.81\text{ days}$, DRH volume $8.748\text{ MCM}$), 2 check calculations, quiz, exam questions.
- **`[CURRICULUM ALIGNMENT NOTE]`**:
  - In `sessions.json`, S20 is titled *"Factors affecting hydrographs"*, but S20.md also incorporates the baseflow separation techniques that are titled under S21 in the syllabus table. The sequence is smooth, but aligning titles in `sessions.json` will prevent student confusion.
- **`[TRACK CHANGES: PROPOSED CONTENT ADDITIONS]`**:
  - **`+ [Include]` Recursive Digital Filter Separation (Eckhardt Filter)**: Automated two-parameter filter algorithm used in modern hydrologic models.
  - **`+ [Include]` Storm Movement Vector Effect**: Visual comparison of flood peaks produced when a storm tracks downstream (flashy high peak) vs upstream (attenuated lower peak).
- **`[TRACK CHANGES: LEARNER-FRIENDLY INTERACTIVE UPGRADES]`**:
  - **`+ [NEW WIDGET]` Interactive Baseflow Separator (`baseflow-tool`)**: Interactive chart allowing students to toggle between Straight Line, Fixed Base ($N$), and Variable Slope methods, with instant calculation of Direct Runoff Volume ($V_d$) and effective runoff depth ($R$).

---

#### Session S21: Unit Hydrograph Concept & Single-Storm Derivation
- **`[CURRENT COVERAGE]`**:
  - *Topics & Sub-Topics*: Sherman's Unit Hydrograph (1932) definition ($1.0\text{ cm}$ of direct runoff uniformly distributed over catchment at constant rate for duration $D$); Underlying postulates: Linear Response (proportionality) and Time Invariance; Assumptions and limitations; Derivation steps from an isolated single storm; DRH ordinate extraction; Volume integration ($R = \frac{\sum Q \Delta t}{A}$); Unit Hydrograph ordinates ($U_i = Q_{di} / R$).
  - *Delivery Modalities*: Rigorous derivations, step-by-step tabular calculation, 2 worked examples ($A = 250\text{ km}^2, R = 3.145\text{ cm}, U_p = 33.39\text{ m}^3\text{/s}$), check activity, quiz, exam questions.
- **`[TRACK CHANGES: PROPOSED CONTENT ADDITIONS]`**:
  - **`+ [Include]` Nonlinearity at Extreme Flood Peaks**: Limitations of Sherman's linearity when overbank floodplain storage dramatically increases resistance at extreme discharges.
  - **`+ [Include]` Catchment Area Limits for Unit Hydrographs**: Why standard UH theory is restricted to catchments between $20\text{ km}^2$ and $5000\text{ km}^2$.
- **`[TRACK CHANGES: LEARNER-FRIENDLY INTERACTIVE UPGRADES]`**:
  - **`+ [NEW WIDGET]` Unit Hydrograph Multiplier Sandbox (`uh-multiplier`)**: Slider for excess rainfall depth ($R = 1, 2, 3.5\text{ cm}$); demonstrates that ordinates scale linearly while time base ($t_b$) remains strictly invariant.

---

#### Session S22: Discrete Convolution & Complex Storm Hydrographs
- **`[CURRENT COVERAGE]`**:
  - *Topics & Sub-Topics*: Superposition and convolution of multi-period effective rainfall ($P_{m}$); Discrete convolution equation ($Q_n = \sum_{m=1}^{n} P_m U_{n-m+1}$); Hydrograph deconvolution (forward substitution); Matrix formulation for extracting Unit Hydrograph ordinates from complex observed floods.
  - *Delivery Modalities*: Mathematical matrices, summation tables, 2 worked numerical examples (3-pulse convolution and reverse deconvolution), check activities, exam questions.
- **`[TRACK CHANGES: PROPOSED CONTENT ADDITIONS]`**:
  - **`+ [Include]` Ill-Conditioned Deconvolution & Oscillation**: Why raw matrix inversion frequently produces unstable oscillating or negative UH ordinates; smoothing techniques (least squares optimization).
  - **`+ [Include]` Rainfall Duration Compatibility**: Ensuring storm hyetograph intervals $\Delta t$ match UH duration $D$.
- **`[TRACK CHANGES: LEARNER-FRIENDLY INTERACTIVE UPGRADES]`**:
  - **`+ [NEW WIDGET]` Interactive Convolution Machine (`convolution-matrix`)**: Students drag 3 successive rainfall excess bars ($R_1, R_2, R_3$); the widget animates individual lagged component DRHs and sums them into the composite flood hydrograph in real time.

---

#### Session S23: Duration Conversion & The S-Curve Method
- **`[CURRENT COVERAGE]`**:
  - *Topics & Sub-Topics*: Changing UH duration; Superposition method (for integer multiples $T = n D$); S-curve (summation hydrograph) concept: continuous discharge generated by infinite series of $D$-hour storms producing $1\text{ cm}$ excess every $D$ hours; Equilibrium discharge formula ($Q_e = 2.778 \frac{A}{D}$); Constructing S-curve by lagging; Deriving $T$-hour UH from S-curve: $U_T = \frac{D}{T}(S_t - S_{t-T})$.
  - *Delivery Modalities*: Mathematical derivations, graphical summation tables, 2 worked numerical examples ($A = 360\text{ km}^2, D = 4\text{ h}, Q_e = 250\text{ m}^3\text{/s}$), check activities, exam problems.
- **`[TRACK CHANGES: PROPOSED CONTENT ADDITIONS]`**:
  - **`+ [Include]` S-Curve Smoothing & Oscillations**: Addressing oscillations near equilibrium discharge $Q_e$ due to minor errors in original UH ordinates.
  - **`+ [Include]` Continuous vs Discontinuous Hydrologic Transformation**: Transitioning from discrete S-curve steps to continuous Laplace transform representation.
- **`[TRACK CHANGES: LEARNER-FRIENDLY INTERACTIVE UPGRADES]`**:
  - **`+ [NEW WIDGET]` S-Curve Generator & Shifter (`scurve-builder`)**: An interactive visual builder showing staggered UH blocks stacking upward until plateauing at $Q_e = 2.778 A/D$, with a second slider to lag the S-curve by $T$ hours and output the new $T$-hour UH.

---

#### Session S24: Snyder's Synthetic Unit Hydrograph
- **`[CURRENT COVERAGE]`**:
  - *Topics & Sub-Topics*: Synthetic unit hydrographs for ungauged catchments; Basin physiographic parameters: mainstream length ($L$), distance to centroid ($L_{ca}$); Snyder's empirical equations: standard basin lag ($t_p = C_t (L L_{ca})^{0.3}$); standard storm duration ($t_r = t_p / 5.5$); adjusted basin lag ($t_{pR} = t_p + 0.25 (t_R - t_r)$); peak discharge ($Q_{pR} = \frac{2.78 C_p A}{t_{pR}}$); time base ($t_b = 3 + 3 \frac{t_{pR}}{24}$ or $t_b = 5 t_{pR}$); W50 and W75 hydrograph widths.
  - *Delivery Modalities*: Empirical formula derivations, CWC regional calibration constants ($C_t, C_p$), 2 worked examples ($L = 35\text{ km}, L_{ca} = 18\text{ km}, Q_{pR} = 86.36\text{ m}^3\text{/s}$), check calculation, exam questions.
- **`[TRACK CHANGES: PROPOSED CONTENT ADDITIONS]`**:
  - **`+ [Include]` CWC Flood Estimation Reports**: How Central Water Commission divides India into 26 hydrometeorological sub-zones with distinct Snyder regression coefficients.
  - **`+ [Include]` Comparison of USACE vs Indian Standard Coefficients**: Sizing parameters tailored for steep Western Ghats vs flat alluvial Gangetic catchments.
- **`[TRACK CHANGES: LEARNER-FRIENDLY INTERACTIVE UPGRADES]`**:
  - **`+ [NEW WIDGET]` Snyder Basin Calculator (`snyder-synth`)**: Input catchment area, $L$, and $L_{ca}$; sliders for $C_t$ ($1.0\text{--}2.2$) and $C_p$ ($0.4\text{--}0.8$); automatically renders the full synthetic hydrograph along with $W_{50}$ and $W_{75}$ clearance widths.

---

#### Session S25: SCS Dimensionless & Triangular Unit Hydrographs
- **`[CURRENT COVERAGE]`**:
  - *Topics & Sub-Topics*: NRCS / SCS Dimensionless Unit Hydrograph; Time of concentration ($t_c$); Kirpich formula ($t_c = 0.01947 L^{0.77} S^{-0.385}$); Peak time ($t_p = \frac{D}{2} + 0.6 t_c$); Peak discharge equation ($q_p = \frac{2.08 A}{t_p}$); Triangular UH approximation: rising limb $t_p$, recession limb $1.67 t_p$, total time base $t_b = 2.67 t_p$; Mass distribution (37.5% volume under rising limb, 62.5% under recession).
  - *Delivery Modalities*: Dimensionless coordinate table ($t/t_p$ vs $q/q_p$), triangular geometry derivation, 2 worked examples ($A = 85\text{ km}^2, t_c = 3.0\text{ h}, q_p = 76.87\text{ m}^3\text{/s}$), check activities, exam problems.
- **`[TRACK CHANGES: PROPOSED CONTENT ADDITIONS]`**:
  - **`+ [Include]` NRCS Peak Rate Factor (PRF)**: Varying PRF from 484 (standard, 2.08 metric) down to 300 (flat wetlands) or up to 600 (steep urban hills).
  - **`+ [Include]` Overland Sheet Flow vs Channelized Travel Time**: Segmented velocity method for calculating time of concentration ($t_c = t_{\text{sheet}} + t_{\text{shallow}} + t_{\text{channel}}$).
- **`[TRACK CHANGES: LEARNER-FRIENDLY INTERACTIVE UPGRADES]`**:
  - **Dimensionless-to-Dimensional Morphing Tool**: Switch between the dimensionless ratios ($t/t_p, q/q_p$) and dimensional curves ($t\text{ (hours)}, Q\text{ (m}^3\text{/s)}$) as catchment parameters are altered.

---

#### Session S26: Instantaneous Unit Hydrograph (IUH) & Nash Cascade
- **`[CURRENT COVERAGE]`**:
  - *Topics & Sub-Topics*: Concept of Instantaneous Unit Hydrograph ($D \to 0$); Relation between IUH and S-curve ($u(t) = \frac{dS}{dt}$); Clark's model (time-area diagram and linear reservoir routing); Nash's Conceptual Model (cascade of $n$ linear reservoirs with storage parameter $K$); Mathematical formulation of Gamma distribution ($u(t) = \frac{1}{K \Gamma(n)} (t/K)^{n-1} e^{-t/K}$); Method of moments for parameter estimation ($n, K$).
  - *Delivery Modalities*: Differential equations, Gamma function properties, 2 worked numerical examples ($n = 6, K = 2.0\text{ h}$, moment matching), check calculations, quiz, exam problems.
- **`[TRACK CHANGES: PROPOSED CONTENT ADDITIONS]`**:
  - **`+ [Include]` Geomorphological Instantaneous Unit Hydrograph (GIUH)**: Linking Horton-Strahler stream order ratios ($R_B, R_L, R_A$) to the probability distribution of path travel times.
  - **`+ [Include]` Distributed Routing in HEC-HMS**: ModClark method utilizing radar gridded rainfall cells.
- **`[TRACK CHANGES: LEARNER-FRIENDLY INTERACTIVE UPGRADES]`**:
  - **`+ [NEW WIDGET]` Nash Reservoir Cascade Simulator (`nash-cascade`)**: Sliders for reservoir count $n$ ($1\text{ to } 10$) and storage parameter $K$; visual animation of water flowing through successive beakers/tanks, illustrating peak attenuation and positive skewness.

---

#### Session S27: Flood Routing & The Muskingum Method
- **`[CURRENT COVERAGE]`**:
  - *Topics & Sub-Topics*: Flood wave propagation, attenuation, and lag; Hydrologic continuity equation ($\frac{dS}{dt} = I - O$); Reservoir routing: Modified Puls method ($S = f(O)$); Channel routing: Muskingum method; Prism storage ($K O$) vs wedge storage ($K x [I - O]$); Storage equation $S = K [x I + (1-x)O]$; Routing coefficients: $C_0, C_1, C_2$ with $C_0 + C_1 + C_2 = 1.0$; Stability criteria ($2 K x < \Delta t \le 2 K (1-x)$).
  - *Delivery Modalities*: Continuity discretization, stability derivations, 2 worked numerical examples ($K = 12\text{ h}, x = 0.2, \Delta t = 6\text{ h}, O_2 = 21.43\text{ m}^3\text{/s}$), check calculations, exam problems.
- **`[CURRICULUM ALIGNMENT NOTE]`**:
  - In `sessions.json`, S27 is titled *"Synthetic unit hydrographs"*, but the content is the complete, high-quality chapter on **Hydrologic Flood Routing (Muskingum)**. Updating the title in `sessions.json` will make this clear to learners.
- **`[TRACK CHANGES: PROPOSED CONTENT ADDITIONS]`**:
  - **`+ [Include]` Muskingum-Cunge Method**: Physically-based estimation of $K$ and $x$ from reach length, bed slope, channel width, and Manning roughness ($K = \Delta x / c$).
  - **`+ [Include]` Reservoir Spillway Flood Routing**: Sizing emergency spillways for dam safety under Probable Maximum Flood (PMF).
- **`[TRACK CHANGES: LEARNER-FRIENDLY INTERACTIVE UPGRADES]`**:
  - **`+ [NEW WIDGET]` Muskingum River Reach Simulator (`muskingum-route`)**: An interactive wave-attenuation animator; students adjust storage time $K$ and weighting factor $x$; watch the inflow hydrograph pass through the channel reach, illustrating peak damping and translation lag.

---

### UNIT IV: Streamflow Measurement, Rating & Flood Frequency (S28–S36)

#### Session S28: River Stage Measurement & Hydrometry Networks
- **`[CURRENT COVERAGE]`**:
  - *Topics & Sub-Topics*: Objectives of hydrometry; Gauge zero datum (MSL benchmark); Non-recording gauges: vertical staff, sectional staff, inclined staff, wire weight gauge; Continuous recorders: float-type stilling well gauge, pneumatic bubbler pressure transducer ($p = \rho g h$), non-contact radar level sensors; CWC telemetric station network in India.
  - *Delivery Modalities*: Structural cross-sections, pressure equations, 2 worked examples (datum conversion, bubbler temperature/density correction), 2 check activities, quiz, exam problems.
- **`[TRACK CHANGES: PROPOSED CONTENT ADDITIONS]`**:
  - **`+ [Include]` Satellite Radar Altimetry**: Spaceborne water level tracking of major Indian rivers (Sentinel-3, SWOT - Surface Water and Ocean Topography mission).
  - **`+ [Include]` Stilling Well Intake Pipe Lag**: Head loss in stilling well intake pipes during rapid monsoon flood rises.
- **`[TRACK CHANGES: LEARNER-FRIENDLY INTERACTIVE UPGRADES]`**:
  - **`+ [NEW WIDGET]` Stilling Well vs Bubbler Simulator (`gauge-mechanics`)**: Interactive cutaway of a riverbank showing how a stilling well intake pipe damps surface waves, alongside a bubbler purging gas bubbles against varying hydrostatic heads.

---

#### Session S29: Area-Velocity Method & Current Meters
- **`[CURRENT COVERAGE]`**:
  - *Topics & Sub-Topics*: Open-channel velocity distribution: boundary layer drag, maximum velocity at $0.05\text{--}0.25d$, mean velocity at $0.6d$, two-point average $\frac{v_{0.2} + v_{0.8}}{2}$; Current meters: vertical-axis cup meter (Price Type AA) vs horizontal-axis propeller meter (Ott / Neyrpic); Meter calibration equation ($v = a + b N$); Discharge integration: Mid-section method ($W_i = \frac{x_{i+1} - x_{i-1}}{2}$) vs Mean-section method (IS:1192).
  - *Delivery Modalities*: Velocity profile diagrams, soundings integration formulas, 2 worked examples ($v = 0.05 + 0.35 N$, two-point profile averaging), 2 check activities, quiz, comprehensive 10-mark sounding numerical.
- **`[TRACK CHANGES: PROPOSED CONTENT ADDITIONS]`**:
  - **`+ [Include]` Sounding Weight & Cable Drift Correction**: Columbus weights and air-line / wet-line depth corrections (Poulter method) during raging flood flows.
  - **`+ [Include]` Surface Float Method**: Surface velocity floats and surface-to-mean coefficient ($k \approx 0.85\text{--}0.89$).
- **`[TRACK CHANGES: LEARNER-FRIENDLY INTERACTIVE UPGRADES]`**:
  - **`+ [NEW WIDGET]` Cross-Section Velocity Contour Sounder (`velocity-profiler`)**: Interactive cross-section where students click at different depths ($0.2d, 0.6d, 0.8d$) to take virtual current-meter readings and compute the total river discharge.

---

#### Session S30: Slope-Area Method for Peak Flood Estimation
- **`[CURRENT COVERAGE]`**:
  - *Topics & Sub-Topics*: Post-flood indirect peak discharge measurement; Identification of High-Water Marks (HWM: drift lines, mud lines, seed lines); Reach selection criteria (straight, contracting, stable bed); Energy equation with friction head loss ($h_f$) and eddy loss ($h_e$); Manning's equation and section conveyance ($K = \frac{1}{n} A R^{2/3}$); Geometric mean conveyance ($K_m = \sqrt{K_1 K_2}$); Discharge equation ($Q = K_m \sqrt{S_f} = K_m \sqrt{h_f / L}$).
  - *Delivery Modalities*: 1D GVF energy balance derivations, hydraulic radius calculations, 2 worked examples (mountain stream survey $Q = 166.0\text{ m}^3\text{/s}$), 2 check activities, quiz, 10-mark exam problem.
- **`[TRACK CHANGES: PROPOSED CONTENT ADDITIONS]`**:
  - **`+ [Include]` Multiple-Section Slope-Area Analysis**: 3-section slope-area surveys (USGS / IS standards) to isolate expansion vs contraction reaches.
  - **`+ [Include]` Manning's $n$ Verification with Cowan's Method**: Base material plus adjustments for surface irregularities, cross-section variations, obstructions, and vegetation ($n = (n_0 + n_1 + n_2 + n_3 + n_4) m_5$).
- **`[TRACK CHANGES: LEARNER-FRIENDLY INTERACTIVE UPGRADES]`**:
  - **`+ [NEW WIDGET]` Slope-Area Post-Flood Forensic Workbench (`slope-area-calc`)**: 3D river reach profile where students adjust high-water marks and Manning's $n$, observing how energy grade line ($EGL$) slope and contraction losses affect the estimated peak flood.

---

#### Session S31: Stage-Discharge Rating Curves
- **`[CURRENT COVERAGE]`**:
  - *Topics & Sub-Topics*: Hydraulic controls: section control (weirs, rapids, riffles) vs channel control (reach friction); Standard power rating equation: $Q = C_r (G - a)^b$; Physical meaning of stage of zero flow ($a$); Graphical determination of $a$ on arithmetic and log-log paper; Log-log linear regression ($\ln Q = \ln C_r + b \ln(G - a)$); Exponent ranges ($b \approx 1.3\text{--}1.8$ for section, $1.6\text{--}2.5$ for channel).
  - *Delivery Modalities*: Control schematics, log-log transformations, 2 worked examples (Krishna river station $Q = 149.5\text{ m}^3\text{/s}$), 2 check activities, quiz, exam problems.
- **`[TRACK CHANGES: PROPOSED CONTENT ADDITIONS]`**:
  - **`+ [Include]` Segmented / Compound Rating Curves**: Multi-stage rating curves with different equations for low-flow trench, in-bank main channel, and overbank floodplain flow.
  - **`+ [Include]` Rating Curve Extrapolation Risks**: Physical pitfalls of extrapolating empirical curves beyond the highest gauged flood stage.
- **`[TRACK CHANGES: LEARNER-FRIENDLY INTERACTIVE UPGRADES]`**:
  - **`+ [NEW WIDGET]` Rating Curve Fitter Sandbox (`rating-curve-lab`)**: Interactive log-log plot with a slider for zero-flow stage $a$; students watch points bend from concave to straight to convex, discovering the exact true zero-flow stage.

---

#### Session S32: Shifting Controls, Backwater & Loop Rating Curves
- **`[CURRENT COVERAGE]`**:
  - *Topics & Sub-Topics*: Non-permanent controls; Causes of shifts: bed aggradation (silt deposition), degradation (scour), aquatic weed growth, dredging; Backwater effects from downstream dams or tributary confluences; Unsteady flood wave propagation and **Loop Rating Curves (Hysteresis)**: higher discharge on rising limb ($S_w > S_0$) than falling limb ($S_w < S_0$); **Jones formula** for unsteady discharge correction ($Q = Q_n \sqrt{1 + \frac{1}{S_0 c} \frac{\partial h}{\partial t}}$).
  - *Delivery Modalities*: Kinematic wave theory, hysteresis loop graphs, 2 worked examples (Godavari flood correction $Q_n = 220\text{ m}^3\text{/s} \to Q = 222.3\text{ m}^3\text{/s}$ on rising limb, $218.2\text{ m}^3\text{/s}$ on falling limb), check activity, quiz, exam problems.
- **`[TRACK CHANGES: PROPOSED CONTENT ADDITIONS]`**:
  - **`+ [Include]` Twin-Gauge Fall Rating Curves**: Using auxiliary downstream stage gauges to compute fall ($F = G_1 - G_2$) and correct for variable backwater ($Q / Q_0 = (F / F_0)^m$).
  - **`+ [Include]` Tidal River Hydrometry**: Reversal of flow and acoustic index velocity methods in estuarine gauging stations.
- **`[TRACK CHANGES: LEARNER-FRIENDLY INTERACTIVE UPGRADES]`**:
  - **`+ [NEW WIDGET]` Flood Loop Hysteresis Animator (`loop-rating`)**: Interactive animation plotting stage hydrograph side-by-side with the loop rating curve; a moving dot illustrates why peak discharge occurs *before* peak stage.

---

#### Session S33: Dilution Gauging & Advanced Hydrometry (ADCP)
- **`[CURRENT COVERAGE]`**:
  - *Topics & Sub-Topics*: Dilution gauging for turbulent mountain torrents where cross-sections cannot be sounded; Tracer requirements (conservative, non-toxic, detectable); Constant-rate injection method ($Q = q \frac{C_1 - C_2}{C_2 - C_0}$); Sudden slug injection / integration method ($Q = \frac{M}{\int (C - C_0) dt}$); Complete mixing length ($L_m$); Acoustic Doppler Current Profiler (ADCP) principles: Doppler frequency shift ($\Delta f = 2 f_0 \frac{v}{c} \cos \theta$), 4-beam geometry, bottom tracking, transect integration.
  - *Delivery Modalities*: Tracer mass balance equations, ADCP acoustic beam diagrams, 2 worked examples (constant injection $Q = 10.0\text{ m}^3\text{/s}$, slug injection $Q = 20.0\text{ m}^3\text{/s}$), check calculation, quiz, exam questions.
- **`[TRACK CHANGES: PROPOSED CONTENT ADDITIONS]`**:
  - **`+ [Include]` Moving-Bed Correction in ADCP Gauging**: Loop test and stationary moving-bed test when heavy sand-bed load moves during floods (GPS / RTK integration).
  - **`+ [Include]` Surface Velocity Radar (SVR) & Drone Large-Scale Particle Image Velocimetry (LS-PIV)**: Modern non-contact flood gauging using camera drones and AI optical flow.
- **`[TRACK CHANGES: LEARNER-FRIENDLY INTERACTIVE UPGRADES]`**:
  - **`+ [NEW WIDGET]` Tracer Breakthrough Curve Visualizer (`tracer-dilution`)**: Interactive slug injection graph displaying the bell-shaped concentration-time curve downstream; students calculate the integrated area under the curve to find stream discharge.

---

#### Session S34: Flood Frequency Analysis Principles & Risk
- **`[CURRENT COVERAGE]`**:
  - *Topics & Sub-Topics*: Statistical approach to flood hydrology; Return period ($T$) and annual exceedance probability ($P = 1/T$); Non-exceedance probability ($q = 1 - 1/T$); Binomial probability model for **Hydrologic Risk ($R$)** over design service life $n$ years ($R = 1 - (1 - 1/T)^n$); Annual Maximum Series (AMS) vs Partial Duration Series (PDS / Peak-Over-Threshold); Plotting positions: Weibull ($P = \frac{m}{N+1}$), Hazen ($P = \frac{m - 0.5}{N}$), California ($P = \frac{m}{N}$), Gringorten.
  - *Delivery Modalities*: Binomial derivations, limiting risk as $n = T \to \infty$ ($R \to 63.2\%$), 2 worked examples (bridge design life $n = 25\text{ yr}, T = 50\text{ yr} \to R = 39.65\%$; culvert design $R \le 10\% \to T \ge 191\text{ yr}$), 2 check activities, quiz, exam problems.
- **`[TRACK CHANGES: PROPOSED CONTENT ADDITIONS]`**:
  - **`+ [Include]` Outlier Detection in Flood Records**: Grubbs-Beck test and Multiple Grubbs-Beck Test (MGBT) for identifying low outliers and historical high outliers.
  - **`+ [Include]` Non-Stationarity under Anthropogenic Climate Change**: Time-varying return periods ($T(t)$) in urbanizing Indian catchments.
- **`[TRACK CHANGES: LEARNER-FRIENDLY INTERACTIVE UPGRADES]`**:
  - **`+ [NEW WIDGET]` Hydrologic Risk & Reliability Matrix (`risk-matrix`)**: 2D interactive heatmap with sliders for structure design life ($5\text{ to } 100\text{ years}$) and design return period ($10\text{ to } 500\text{ years}$); dynamic color coding from green (safe) to deep red (high failure risk).

---

#### Session S35: Gumbel's Extreme Value Distribution (EV-I)
- **`[CURRENT COVERAGE]`**:
  - *Topics & Sub-Topics*: Fisher-Tippett extreme value theory; Gumbel Extreme Value Type I (EV-I) cumulative distribution ($F(x) = \exp(-\exp(-y))$); Reduced variate ($y_T = -\ln[-\ln(1 - 1/T)] \approx \ln(T)$); Sample statistics ($\bar{x}, s_x$); Frequency equation ($x_T = \bar{x} + K_T s_x$); Finite sample correction ($K_T = \frac{y_T - \bar{y}_n}{s_n}$); Tabular values of reduced mean $\bar{y}_n$ and reduced standard deviation $s_n$; Return period determination for observed floods.
  - *Delivery Modalities*: Mathematical derivations, Gumbel parameter tables, 2 worked examples (Narmada river $N = 30, \bar{x} = 420\text{ m}^3\text{/s}, s_x = 115\text{ m}^3\text{/s} \to x_{100} = 840.1\text{ m}^3\text{/s}, x_{50} = 768.0\text{ m}^3\text{/s}$; return period of observed $750\text{ m}^3\text{/s} \to T = 42.1\text{ yr}$), 2 check activities, quiz, exam problems.
- **`[TRACK CHANGES: PROPOSED CONTENT ADDITIONS]`**:
  - **`+ [Include]` Standard Error and Confidence Limits**: Gumbel confidence intervals ($x_T \pm 1.96 \cdot S_e$ where $S_e = \frac{b s_x}{\sqrt{N}}$) for engineering safety factors.
  - **`+ [Include]` Indian Standards IS:5477 Application**: Recommended return periods for minor, medium, and major hydraulic structures in India.
- **`[TRACK CHANGES: LEARNER-FRIENDLY INTERACTIVE UPGRADES]`**:
  - **`+ [NEW WIDGET]` Gumbel Probability Paper Simulator (`gumbel-bench`)**: Plots annual flood peaks on standard Gumbel probability graph paper; students can view the fitted regression line, confidence bands, and read design flood quantiles for any return period.

---

#### Session S36: Log-Pearson Type III Distribution & Reservoir Sedimentation
- **`[CURRENT COVERAGE]`**:
  - *Topics & Sub-Topics*: Modeling skewed flood data; Log-Pearson Type III (LP3 / Bulletin 17C); Logarithmic transformation ($z = \log_{10} x$); Parameters: mean ($\bar{z}$), standard deviation ($s_z$), skewness coefficient ($C_s$); Frequency factor $K_z = f(T, C_s)$; Quantile calculation ($\log_{10}(x_T) = \bar{z} + K_z s_z$); Reservoir sedimentation: Trap efficiency ($\eta$); **Brune's empirical curve** based on Capacity-to-Inflow ratio ($C/I$); Annual storage loss and useful reservoir life.
  - *Delivery Modalities*: 3-parameter statistical formulas, Brune trap efficiency graphs, 2 worked examples (LP3 flood $x_{50} = 1100\text{ m}^3\text{/s}$; reservoir $C = 30\text{ MCM}, I = 120\text{ MCM}, C/I = 0.25, \eta = 93\%, \text{life} = 52\text{ yr}$), 2 check activities, quiz, exam questions.
- **`[TRACK CHANGES: PROPOSED CONTENT ADDITIONS]`**:
  - **`+ [Include]` Generalized Regional Skewness in India**: Combining station skew with regional skew map published by CWC.
  - **`+ [Include]` Reservoir Silt Sluicing & Desiltation**: Hydro-suction, bottom outlet flushing during peak sediment inflows, and dredging economics.
- **`[TRACK CHANGES: LEARNER-FRIENDLY INTERACTIVE UPGRADES]`**:
  - **`+ [NEW WIDGET]` Brune Reservoir Life Simulator (`reservoir-silt`)**: Interactive slider for reservoir capacity $C$ and annual inflow $I$; dynamically plots trap efficiency $\eta$ along Brune's curve and calculates the projected year when dead storage will be completely filled.

---

### UNIT V: Groundwater Hydrology, Wells & Rainwater Harvesting (S37–S45)

#### Session S37: Groundwater Hydrology & Aquifer Types
- **`[CURRENT COVERAGE]`**:
  - *Topics & Sub-Topics*: Occurrence of subsurface water; Vadose zone (soil water, intermediate vadose, capillary fringe); Phreatic (saturated) zone; Water table (phreatic surface); Aquifer classifications: unconfined, confined (artesian), semi-confined (leaky), perched; Rock classifications: aquifer, aquiclude (clay), aquitard (sandy clay), aquifuge (massive granite); Soil moisture constants: porosity ($n$), specific yield ($S_y$), specific retention ($S_r$); Fundamental relation $n = S_y + S_r$; Gravity-drainable storage release ($V_w = A \Delta h S_y$).
  - *Delivery Modalities*: Detailed vertical distribution cross-sections, tabular porosity/yield comparisons, 2 worked examples (sand core porosity $n = 40.25\%, S_y = 26.25\%$; regional basin water release $9.844\text{ MCM}$), 2 check activities, quiz, exam problems.
- **`[TRACK CHANGES: PROPOSED CONTENT ADDITIONS]`**:
  - **`+ [Include]` Hydrogeology of India**: Alluvial Indo-Gangetic basin vs Hard-Rock Peninsular shield (Deccan Traps basalt, crystalline granites) — India's two contrasting hydrogeological provinces.
  - **`+ [Include]` Groundwater Over-exploitation & Dynamic Resource Assessment**: CGWB categorization of assessment units into Safe, Semi-Critical, Critical, and Over-Exploited.
- **`[TRACK CHANGES: LEARNER-FRIENDLY INTERACTIVE UPGRADES]`**:
  - **`+ [NEW WIDGET]` Subsurface Water Column Interactive Cross-Section (`vadose-phreatic`)**: Cutaway diagram showing pore pressure variation from negative suction head in the capillary fringe to positive hydrostatic head below the water table.

---

#### Session S38: Aquifer Parameters, Darcy's Law & Seepage Velocity
- **`[CURRENT COVERAGE]`**:
  - *Topics & Sub-Topics*: Henry Darcy's 1856 experiments; Darcy's law ($Q = -K A \frac{dh}{dl} = K A i$); Hydraulic head ($h = z + \frac{p}{\rho g}$); Validity range: laminar flow ($\text{Re} = \frac{v d_{10}}{\nu} < 1\text{ to } 10$); Discharge (Darcian) velocity ($v = Q/A$) vs actual interstitial Seepage velocity ($v_s = v / n_e$); Hydraulic conductivity ($K$) vs Intrinsic permeability ($k = K \frac{\mu}{\rho g}$, units: Darcy / $\text{m}^2$); Constant-head and falling-head permeameters.
  - *Delivery Modalities*: Darcian column schematics, velocity continuity derivation, 2 worked examples ($K = 25\text{ m/day}, i = 0.005, v_s = 0.50\text{ m/day}$, contaminant travel time $1600\text{ days}$; permeameter test $K = 2.93\text{ m/day}$), 2 check activities, quiz, exam problems.
- **`[TRACK CHANGES: PROPOSED CONTENT ADDITIONS]`**:
  - **`+ [Include]` Hazen's & Kozeny-Carman Equations**: Empirical estimation of hydraulic conductivity from grain size distribution ($K = C d_{10}^2$).
  - **`+ [Include]` Temperature Correction for Hydraulic Conductivity**: Standardizing field $K$ measurements to $20^\circ\text{C}$ ($K_{20} = K_T \frac{\mu_T}{\mu_{20}}$).
- **`[TRACK CHANGES: LEARNER-FRIENDLY INTERACTIVE UPGRADES]`**:
  - **`+ [NEW WIDGET]` Virtual Darcy Permeameter (`darcy-tube`)**: Interactive digital permeameter where students change soil type (gravel, sand, silt) and manometer head difference, observing flow velocity and dye particle transit time in real time.

---

#### Session S39: Transmissivity & Layered Aquifers
- **`[CURRENT COVERAGE]`**:
  - *Topics & Sub-Topics*: Transmissivity ($T = K \cdot b$); Storativity / storage coefficient ($S$); Physical mechanism of storativity in confined aquifers ($S = \rho g b (\alpha + n \beta) \approx 10^{-5}\text{--}10^{-3}$) vs unconfined aquifers ($S \approx S_y = 0.1\text{--}0.3$); Stratified formations: Equivalent horizontal conductivity ($K_h = \frac{\sum K_i b_i}{\sum b_i}$) for flow parallel to bedding; Equivalent vertical conductivity ($K_v = \frac{\sum b_i}{\sum b_i/K_i}$) for flow perpendicular to bedding; Anisotropy ratio ($K_h / K_v \ge 1$).
  - *Delivery Modalities*: Layered strata diagrams, Cauchy-Schwarz proof, 2 worked examples (3-layer aquifer $b = 20\text{ m}, T = 356\text{ m}^2\text{/day}, K_h = 17.80\text{ m/day}, K_v = 12.83\text{ m/day}$; confined elastic release $7500\text{ m}^3$), 2 check activities, quiz, exam questions.
- **`[CURRICULUM ALIGNMENT NOTE]`**:
  - In `sessions.json`, S39 is titled *"Darcy's law and unconfined wells"*, but the content covers **Transmissivity, Storativity, and Layered Anisotropic Aquifers**. Renaming the title to reflect layered aquifers will provide better clarity.
- **`[TRACK CHANGES: PROPOSED CONTENT ADDITIONS]`**:
  - **`+ [Include]` Land Subsidence due to Groundwater Overpumping**: Skeletal consolidation of confining clay aquitards during piezometric head decline (Terzaghi effective stress principle $\sigma' = \sigma - u$).
  - **`+ [Include]` Three-Dimensional Anisotropy Tensor**: Tensor representation of hydraulic conductivity for fractured media.
- **`[TRACK CHANGES: LEARNER-FRIENDLY INTERACTIVE UPGRADES]`**:
  - **`+ [NEW WIDGET]` Layered Aquifer Conductivity Blender (`layered-strata`)**: Adjust thicknesses ($b_1, b_2, b_3$) and conductivities ($K_1, K_2, K_3$) of three layers; instantly computes and displays $K_h$, $K_v$, and the visual streamline refraction angle across layer interfaces.

---

#### Session S40: Steady Radial Flow to Unconfined Wells (Dupuit-Thiem)
- **`[CURRENT COVERAGE]`**:
  - *Topics & Sub-Topics*: Radial flow to a fully penetrating gravity well; Dupuit-Forchheimer assumptions (horizontal flow lines, vertical equipotential cylinders, hydraulic gradient equals water table slope $i = dh/dr$); Derivation of **Dupuit-Thiem Equation**:
    $$Q = \pi K \frac{h_2^2 - h_1^2}{\ln(r_2 / r_1)}$$
    In terms of original saturated thickness $H$ and radius of influence $R$:
    $$Q = \pi K \frac{H^2 - h_w^2}{\ln(R / r_w)}$$
    Seepage face phenomenon near the well casing.
  - *Delivery Modalities*: Radial flow geometry, integration steps, 2 worked examples (pumping test $Q = 2592\text{ m}^3\text{/day}, h_1 = 21.8\text{ m}, h_2 = 23.6\text{ m} \to K = 11.09\text{ m/day}$; well drawdown prediction $s_w = 4.0\text{ m}$), check calculation, quiz, 10-mark exam problem.
- **`[CURRICULUM ALIGNMENT NOTE]`**:
  - In `sessions.json`, S40 is titled *"Flow to a confined well"*, but the file covers **Unconfined Radial Flow (Dupuit-Thiem)**. Updating the title in `sessions.json` will ensure alignment.
- **`[TRACK CHANGES: PROPOSED CONTENT ADDITIONS]`**:
  - **`+ [Include]` Empirical Formulas for Radius of Influence ($R$)**: Sichardt's formula ($R = 3000 s_w \sqrt{K}$) and Weber's formula.
  - **`+ [Include]` Partially Penetrating Gravity Wells**: Kozeny's correction factor for wells that do not penetrate the full aquifer depth.
- **`[TRACK CHANGES: LEARNER-FRIENDLY INTERACTIVE UPGRADES]`**:
  - **`+ [NEW WIDGET]` Unconfined Cone of Depression Simulator (`dupuit-cone`)**: Interactive 3D/2D cone of depression where students vary pumping discharge $Q$ and hydraulic conductivity $K$, observing how the water table depression and seepage face develop.

---

#### Session S41: Steady Radial Flow to Confined Wells (Thiem) & Well Construction
- **`[CURRENT COVERAGE]`**:
  - *Topics & Sub-Topics*: Radial flow in confined aquifers of constant thickness $b$; Derivation of **Thiem Equilibrium Formula**:
    $$Q = \frac{2 \pi T (s_1 - s_2)}{\ln(r_2 / r_1)} = \frac{2 \pi K b (s_1 - s_2)}{\ln(r_2 / r_1)}$$
    Linear dependence on drawdown differences $(s_1 - s_2)$; Tube well construction: drilling methods (direct rotary, reverse rotary, cable-tool percussion, Down-The-Hole DTH hammer for hard rock); Construction components: casing pipe, continuous wire-wrap well screen, slot sizing criteria ($D_{50}$), artificial gravel pack sizing ($4\text{--}6 \times D_{50}$), sanitary cement grout surface seal, well development (surging, air-jetting, overpumping).
  - *Delivery Modalities*: Confined flow derivations, borehole construction schematics, 2 worked examples (pumping test $Q = 2400\text{ m}^3\text{/day}, s_1 - s_2 = 1.30\text{ m} \to T = 322.8\text{ m}^2\text{/day}, K = 21.52\text{ m/day}$; drawdown at $r = 120\text{ m} \to s = 0.28\text{ m}$), check activity, quiz, comprehensive exam questions.
- **`[CURRICULUM ALIGNMENT NOTE]`**:
  - In `sessions.json`, S41 is titled *"Wells and construction"*, matching the tube well drilling and construction content.
- **`[TRACK CHANGES: PROPOSED CONTENT ADDITIONS]`**:
  - **`+ [Include]` Well Interference & Superposition**: Drawdown compounding when multiple tube wells pump within overlapping radii of influence ($s_{\text{total}} = s_1 + s_2 + \dots$).
  - **`+ [Include]` Borewell Failures in Hard Rock**: Siltation, casing shearing in fractured zones, encrustation by calcium carbonate, and iron bio-fouling.
- **`[TRACK CHANGES: LEARNER-FRIENDLY INTERACTIVE UPGRADES]`**:
  - **`+ [NEW WIDGET]` Well Interference Simulator (`well-interference`)**: Place two or three pumping wells on a map grid; the widget computes overlapping cones of depression and shows increased drawdown at each wellhead.

---

#### Session S42: Unsteady Radial Flow to Confined Wells (Theis Equation)
- **`[CURRENT COVERAGE]`**:
  - *Topics & Sub-Topics*: Transient drawdown under non-equilibrium pumping; Theis (1935) heat-conduction analogy; Governing partial differential equation ($\frac{\partial^2 s}{\partial r^2} + \frac{1}{r} \frac{\partial s}{\partial r} = \frac{S}{T} \frac{\partial s}{\partial t}$); Theis analytical solution:
    $$s = \frac{Q}{4 \pi T} W(u) \quad \text{where } u = \frac{r^2 S}{4 T t}$$
    Well Function $W(u)$ (exponential integral $E_1(u)$); Series expansion; Logarithmic approximation ($W(u) \approx -\ln(u) - 0.5772$ for $u \le 0.01$); Principles of Theis Log-Log Type-Curve Matching.
  - *Delivery Modalities*: Partial differential formulation, $W(u)$ lookup table, 2 worked examples ($T = 450\text{ m}^2\text{/day}, S = 3.0 \times 10^{-4}, r = 100\text{ m}, t = 1.5\text{ days} \to u = 0.00111, W(u) = 6.225 \to s = 1.65\text{ m}$; duration required for $1\text{ m}$ drawdown $\to t = 3.09\text{ h}$), 2 check activities, quiz, exam problems.
- **`[CURRICULUM ALIGNMENT NOTE]`**:
  - In `sessions.json`, S42 is titled *"Small-scale rainwater harvesting"*, but S42.md delivers the complete chapter on the **Theis Non-Equilibrium Equation**. Updating the title in `sessions.json` will accurately reflect this foundational groundwater topic.
- **`[TRACK CHANGES: PROPOSED CONTENT ADDITIONS]`**:
  - **`+ [Include]` Aquifer Boundaries & Image Well Theory**: Impermeable barrier boundary (drawdown doubles) vs constant-head recharge boundary (river recharge, drawdown stabilizes) using virtual image wells.
  - **`+ [Include]` Semi-Confined / Leaky Aquifers (Hantush-Jacob)**: Leakage through aquitard ($W(u, r/B)$).
- **`[TRACK CHANGES: LEARNER-FRIENDLY INTERACTIVE UPGRADES]`**:
  - **`+ [NEW WIDGET]` Interactive Theis Type-Curve Matcher (`theis-matcher`)**: A digital light-table where students drag a field time-drawdown curve over the master $W(u)$ vs $1/u$ type curve to find the match point and automatically compute $T$ and $S$.

---

#### Session S43: Cooper-Jacob Method & Pumping Test Analysis
- **`[CURRENT COVERAGE]`**:
  - *Topics & Sub-Topics*: Cooper-Jacob (1946) straight-line approximation of the Theis equation for small $u$ ($u \le 0.01$):
    $$s = \frac{2.303 Q}{4 \pi T} \log_{10}\left(\frac{2.25 T t}{r^2 S}\right)$$
    Semi-log plotting: Drawdown per log cycle ($\Delta s$); Formula for Transmissivity ($T = \frac{2.303 Q}{4 \pi \Delta s}$); Zero-drawdown time axis intercept ($t_0$); Formula for Storativity ($S = \frac{2.25 T t_0}{r^2}$); Distance-drawdown Cooper-Jacob analysis for multiple observation wells ($\Delta s_r$); Limits of validity test.
  - *Delivery Modalities*: Semi-log mathematical derivations, graphical interpretation, 2 worked examples ($Q = 1800\text{ m}^3\text{/day}, \Delta s = 1.15\text{ m}, t_0 = 12\text{ min} \to T = 286.9\text{ m}^2\text{/day}, S = 0.00215$; distance-drawdown analysis $T = 305.5\text{ m}^2\text{/day}$), 2 check activities, quiz, 10-mark exam problem.
- **`[CURRICULUM ALIGNMENT NOTE]`**:
  - In `sessions.json`, S43 is titled *"Rooftop harvesting"*, but the file delivers the **Cooper-Jacob Method & Aquifer Parameter Analysis**. Renaming the title in `sessions.json` will ensure alignment.
- **`[TRACK CHANGES: PROPOSED CONTENT ADDITIONS]`**:
  - **`+ [Include]` Recovery Test Analysis (Theis Recovery)**: Plotting residual drawdown $s'$ against $\log_{10}(t / t')$ after the pump stops; calculating $T$ free of well loss and pumping rate fluctuations.
  - **`+ [Include]` Identifying Boundary Effects on Semi-Log Plots**: Upward break in slope indicating impermeable rock barrier; downward flattening indicating river recharge.
- **`[TRACK CHANGES: LEARNER-FRIENDLY INTERACTIVE UPGRADES]`**:
  - **`+ [NEW WIDGET]` Cooper-Jacob Semi-Log Regression Tool (`cooper-jacob-fit`)**: Interactive semi-log scatter plot where students drag a trendline through points to read $\Delta s$ and $t_0$, with real-time feedback on whether the $u \le 0.01$ validity check passes.

---

#### Session S44: Well Losses, Specific Capacity & Open Well Recuperation
- **`[CURRENT COVERAGE]`**:
  - *Topics & Sub-Topics*: Total drawdown inside a pumping well ($s_w$); Aquifer loss ($B Q$, laminar Darcy flow) vs Well loss ($C Q^2$, turbulent screen/gravel entry flow); Jacob's well equation ($s_w = B Q + C Q^2$); Specific drawdown ($s_w / Q = B + C Q$); Step-drawdown test; Well efficiency ($\eta_w = \frac{B Q}{s_w} \times 100\%$); Specific capacity ($Q / s_w$); **Open Well Recuperation Test** in hard-rock aquifers:
    $$\frac{K}{A} = \frac{2.303}{t} \log_{10}\left(\frac{s_1}{s_2}\right)$$
    Specific capacity factor ($K/A$ in $\text{h}^{-1}$); Safe yield ($Q = (K/A) \cdot A \cdot H_d$).
  - *Delivery Modalities*: Well loss mechanics, recuperation derivations, 2 worked examples (open well $D = 3.5\text{ m}, s_1 = 2.8\text{ m}, s_2 = 1.2\text{ m}, t = 1.5\text{ h} \to K/A = 0.565\text{ h}^{-1}, C' = 5.436\text{ m}^3\text{/h/m}, Q_{\text{safe}} = 10.87\text{ m}^3\text{/h}$; step-drawdown test $B = 0.002, C = 5 \times 10^{-7}, \eta_w = 66.7\%$), 2 check activities, quiz, exam questions.
- **`[CURRICULUM ALIGNMENT NOTE]`**:
  - In `sessions.json`, S44 is titled *"Groundwater recharge"*, but the file delivers **Well Losses, Specific Capacity, and Open Well Recuperation Tests**.
- **`[TRACK CHANGES: PROPOSED CONTENT ADDITIONS]`**:
  - **`+ [Include]` Rorabaugh's Well Loss Equation**: Generalizing well loss to $C Q^n$ where $n \approx 2.5\text{--}3.5$ for high-velocity turbulent gravel packs.
  - **`+ [Include]` Borewell Rejuvenation Techniques**: High-pressure hydro-fracturing to open clogged fissures in granitic hard rock.
- **`[TRACK CHANGES: LEARNER-FRIENDLY INTERACTIVE UPGRADES]`**:
  - **`+ [NEW WIDGET]` Step-Drawdown & Well Efficiency Analyzer (`well-efficiency`)**: Input step-drawdown points ($Q_i, s_{wi}$); the widget fits $B$ and $C$, displaying a stacked bar chart of laminar aquifer loss vs turbulent well loss across pumping rates.

---

#### Session S45: Rainwater Harvesting & Managed Aquifer Recharge (MAR)
- **`[CURRENT COVERAGE]`**:
  - *Topics & Sub-Topics*: Urban hydrology and declining groundwater tables; Rainwater Harvesting (RWH) principles; Catchment surfaces and runoff coefficients ($C$): GI sheets ($0.90$), RCC roofs ($0.85$), paved driveways ($0.60$), lawns ($0.15$); Annual harvest potential equation ($V = C \cdot P \cdot A$); First-flush diverter sizing ($1.0\text{--}2.0\text{ mm}$); Storage tank sizing methods: dry-period demand vs 24-h design storm volume; **Managed Aquifer Recharge (MAR)** structures (CGWB guidelines): recharge pits, recharge trenches, injection shafts, dug well recharge; Multi-criteria spatial GIS analysis for campus recharge suitability; PBL Showcase integration.
  - *Delivery Modalities*: Layout schematics, CGWB structural guidelines, 2 worked examples (CHRIST Kengeri campus building $A = 450\text{ m}^2, P = 920\text{ mm}, C = 0.85 \to \text{Annual } V = 351.9\text{ m}^3$ ($351{,}900\text{ L}$), tank volume $15{,}000\text{ L}$; recharge trench sizing $L = 1008\text{ m}$), 2 check activities, quiz, 10-mark design exam problem.
- **`[TRACK CHANGES: PROPOSED CONTENT ADDITIONS]`**:
  - **`+ [Include]` Urban Stormwater Best Management Practices (LID-BMPs)**: Permeable pavements, bioswales, rain gardens, green roofs, and retention detention ponds.
  - **`+ [Include]` Bengaluru Lake System (Kere Network)**: The historical interconnected cascade lake system of Bengaluru (e.g. Vrishabhavathi, Bellandur, Madivala cascades) as decentralized flood retention and groundwater recharge infrastructure.
  - **`+ [Include]` Water Quality & Recharge Safeguards**: Preventing urban runoff pollution (heavy metals, oil/grease, nitrates) from entering pristine drinking aquifers.
- **`[TRACK CHANGES: LEARNER-FRIENDLY INTERACTIVE UPGRADES]`**:
  - **`+ [NEW WIDGET]` Rooftop RWH & Tank Sizing Workbench (`rwh-designer`)**: Interactive campus building designer where students enter roof area, choose roofing material, set rainfall depth, and view daily supply vs demand curves with optimal storage sump capacity.

---

## 4. Synthesis of Proposed New Interactive Widgets (Roadmap)

To bring Units 3, 4, and 5 to the same high level of interactivity as Units 1 and 2, the following **10 new interactive React/SVG components** are proposed:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                      PROPOSED INTERACTIVE WIDGET ROADMAP                     │
├─────────┬───────────────────────────┬─────────┬─────────────────────────────┤
│ Unit    │ Widget Name               │ Session │ Core Interactive Capability │
├─────────┼───────────────────────────┼─────────┼─────────────────────────────┤
│ Unit 2  │ cropet-calc               │ S14     │ Crop water demand & monthly │
│         │                           │         │ irrigation calendar builder │
│ Unit 2  │ fdc-explorer              │ S16     │ Flow Duration Curve with    │
│         │                           │         │ Q75 & environmental flows   │
│ Unit 3  │ hydro-anatomy             │ S19     │ Clickable flood hydrograph  │
│         │                           │         │ with physical recession law │
│ Unit 3  │ baseflow-tool             │ S20     │ Interactive baseflow line   │
│         │                           │         │ separation & DRH volume     │
│ Unit 3  │ convolution-matrix        │ S22     │ Multi-pulse storm DRH       │
│         │                           │         │ convolution animator        │
│ Unit 3  │ snyder-synth              │ S24     │ Synthetic Unit Hydrograph   │
│         │                           │         │ generator (W50, W75 widths) │
│ Unit 4  │ rating-curve-lab          │ S31     │ Log-log rating curve with   │
│         │                           │         │ zero-flow stage 'a' slider  │
│ Unit 4  │ gumbel-bench              │ S35     │ Extreme value probability   │
│         │                           │         │ paper regression & quantiles│
│ Unit 5  │ darcy-tube                │ S38     │ Virtual sand permeameter    │
│         │                           │         │ with head & seepage velocity│
│ Unit 5  │ rwh-designer              │ S45     │ Campus rooftop RWH sizing   │
│         │                           │         │ and tank mass-curve balance │
└─────────┴───────────────────────────┴─────────┴─────────────────────────────┘
```

---

## 5. Summary of Recommended Syllabus & Title Alignments

In `sessions.json`, several session titles and hooks can be fine-tuned to mirror the exact lecture markdown content:

1. **`S20`**: Change title from `"Factors affecting hydrographs"` to **`"Hydrograph Factors & Baseflow Separation"`**.
2. **`S21`**: Change title from `"Base-flow separation"` to **`"Unit Hydrograph Concept & Derivation"`**.
3. **`S22`**: Change title from `"Effective rainfall and DRH"` to **`"Discrete Convolution & Complex Storms"`**.
4. **`S23`**: Change title from `"Unit hydrograph concept"` to **`"Duration Alteration & The S-Curve"`**.
5. **`S24`**: Change title from `"Deriving a unit hydrograph"` to **`"Snyder's Synthetic Unit Hydrograph"`**.
6. **`S25`**: Change title from `"Unit hydrograph, complex storms"` to **`"SCS Dimensionless & Triangular UH"`**.
7. **`S26`**: Change title from `"The S-curve"` to **`"Instantaneous UH & Nash Cascade Model"`**.
8. **`S27`**: Change title from `"Synthetic unit hydrographs"` to **`"Flood Routing & Muskingum Method"`**.
9. **`S39`**: Change title from `"Darcy's law and unconfined wells"` to **`"Transmissivity, Storativity & Layered Aquifers"`**.
10. **`S40`**: Change title from `"Flow to a confined well"` to **`"Steady Radial Flow: Unconfined Wells (Dupuit)"`**.
11. **`S41`**: Change title from `"Wells and construction"` to **`"Confined Well Flow (Thiem) & Well Construction"`**.
12. **`S42`**: Change title from `"Small-scale rainwater harvesting"` to **`"Unsteady Radial Flow (Theis Equation)"`**.
13. **`S43`**: Change title from `"Rooftop harvesting"` to **`"Cooper-Jacob Method & Aquifer Testing"`**.
14. **`S44`**: Change title from `"Groundwater recharge"` to **`"Well Losses & Open Well Recuperation"`**.
15. **`S45`**: Change title from `"PBL showcase"` to **`"Rainwater Harvesting, MAR & PBL Showcase"`**.

---

## 6. Implementation Prioritization

To implement these enhancements efficiently, work can proceed in three sequential tiers:

- **Tier 1 (Immediate - High Impact, Zero Overhead)**:
  - Update `sessions.json` titles and hooks as listed in Section 5 so student navigation matches file contents.
  - Embed the proposed modern content additions (Doppler radar, Indian CWC guidelines, Bengaluru lake cascade, and CGWB criteria) into existing session theory tabs.
- **Tier 2 (Interactive Widgets for Units 3, 4, 5)**:
  - Implement `rating-curve-lab` (S31) and `baseflow-tool` (S20) in `src/widgets.jsx` to give students interactive tools for these fundamental topics.
  - Implement `convolution-matrix` (S22) and `gumbel-bench` (S35).
- **Tier 3 (Simulation Workbenches & Full PBL Milestone Integration)**:
  - Implement `darcy-tube` (S38) and `rwh-designer` (S45).
  - Add real-world dataset links for Bengaluru rainfall, Cauvery flows, and Karnataka groundwater well levels.
