import json

def run():
    outlines = {
        "S28": {
            "title": "Streamflow measurement and measurement of stage",
            "topics": [
                "Purpose of streamflow measurement; hydrometry networks and site selection criteria",
                "Stage measurement devices: non-recording staff gauges (vertical, inclined, sectional), wire gauge",
                "Continuous automatic stage recorders: float-type, pneumatic bubble gauge, ultrasonic and non-contact radar",
                "Establishing and checking gauge datum; water stage-time hydrograph recording",
                "Indian hydrometric network: CWC hydrological stations, India-WRIS real-time data portals"
            ],
            "numericals": [
                "Datum adjustment: converting arbitrary gauge observations to Mean Sea Level (MSL)",
                "Temperature and density corrections for pneumatic bubbler pressure gauges",
                "Determining station density and optimal gauge network for a river basin"
            ],
            "activity": "Read, check, and correct raw hourly stage data from an Indian river gauging station; eliminate datum shifts.",
            "lab": "Install HEC-RAS 6.x; create a project; import terrain and inspect river station cross-section geometry.",
            "software": "HEC-RAS",
            "refs": "T1 (Ch 4), T2 (Ch 5)"
        },
        "S29": {
            "title": "Discharge by the area-velocity method",
            "topics": [
                "Concept of area-velocity method; velocity distribution in an open channel vertical",
                "Point velocity measurement: 0.6d single-point and 0.2d/0.8d two-point methods",
                "Current meters: Price type AA cup meter, Pygmy meter, horizontal axis propeller meter (Ott)",
                "Current meter rating equation: v = a + b*N; calibration in towing tanks",
                "Discharge computation methods: Mid-section method and Mean-section method (IS:1192 / ISO 748)"
            ],
            "numericals": [
                "Calculation of channel discharge from field current meter sounding data using the mid-section method",
                "Mean-section method calculation comparing discharge with mid-section results",
                "Current meter calibration equation fitting: solving calibration constants a and b from rating tank data"
            ],
            "activity": "Compute full river discharge and cross-sectional area from a tabulated 15-vertical current-meter survey.",
            "lab": "HEC-RAS: Setup river reach geometry, enter cross-section coordinates, bank stations, and Manning roughness n values.",
            "software": "HEC-RAS",
            "refs": "T1 (Ch 4), T2 (Ch 5)"
        },
        "S30": {
            "title": "Discharge by the slope-area method",
            "topics": [
                "Indirect discharge estimation principles after flood events from high-water marks (HWM)",
                "Manning's uniform flow equation and energy balance between two reach cross-sections",
                "Reach selection requirements: uniform channel, straight reach, absence of backwater, stable bed",
                "Friction slope Sf calculation; velocity head correction coefficient (alpha) and reach energy loss hf",
                "Conveyance K of compound cross-sections; expansion and contraction head losses"
            ],
            "numericals": [
                "Two-section slope-area computation of peak flood discharge from survey data and high-water marks",
                "Iteration procedure when reach velocity head is significant relative to friction slope",
                "Compound cross-section conveyance subdivision for main channel and floodplains"
            ],
            "activity": "Perform iterative slope-area computation for an ungauged flash flood reach using survey station data.",
            "lab": "HEC-RAS: Run 1D steady-flow water surface profile simulation for subcritical flow matching surveyed high-water marks.",
            "software": "HEC-RAS",
            "refs": "T1 (Ch 4), T3 (Ch 4)"
        },
        "S31": {
            "title": "Stage-discharge relation (rating curve)",
            "topics": [
                "Concept of stage-discharge relation (rating curve); control types: section control and channel control",
                "Mathematical power form of rating curve: Q = Cr * (G - a)^b, where G is gauge reading and a is stage at zero flow (PZF)",
                "Techniques for determining zero-flow stage 'a': trial and error, arithmetic plotting, running 3-point regression",
                "Logarithmic transformation and least-squares linear regression: ln Q = ln Cr + b * ln(G - a)",
                "Confidence limits and correlation coefficient requirements for valid hydrometric rating curves"
            ],
            "numericals": [
                "Determination of stage at zero flow 'a' using the arithmetic graphical method",
                "Least-squares logarithmic regression to estimate rating curve parameters Cr and exponent b",
                "Discharge prediction for design flood stage with 95% confidence interval estimation"
            ],
            "activity": "Fit a power-law rating equation to 18 field gauge-discharge pairs using log-log regression.",
            "lab": "HEC-RAS: Configure downstream rating curve boundary condition using fitted power-law parameters.",
            "software": "HEC-RAS",
            "refs": "T1 (Ch 4), T2 (Ch 5)"
        },
        "S32": {
            "title": "Shifting control, loop rating curve, backwater effects",
            "topics": [
                "Instability of rating curves: scour, silting, aquatic weed growth, shifting controls",
                "Unsteady flow effects during flood wave passage: loop rating curve (hysteresis loop)",
                "Rising limb vs falling limb velocities; surface water slope variation during flood hydrograph",
                "Jones formula and normal discharge correction for unsteady flood waves: Q/Qn = sqrt(1 + (1/(S0*c)) * (dh/dt))",
                "Backwater effects from downstream tributary confluence, reservoir operations, or tidal variations; twin-gauge method"
            ],
            "numericals": [
                "Discharge correction using the Jones formula for rapidly rising flood stages (dh/dt > 0)",
                "Twin-gauge fall-rating method: auxiliary gauge stage calculation and fall-ratio discharge correction",
                "Quantifying seasonal shift in stage-discharge rating due to riverbed scour and siltation"
            ],
            "activity": "Compute true flood peak discharge from a loop rating curve using rate of stage rise dh/dt.",
            "lab": "HEC-RAS: Model mixed-flow regime (subcritical and supercritical) and analyze hydraulic jump / backwater transitions.",
            "software": "HEC-RAS",
            "refs": "T1 (Ch 4), T2 (Ch 5)"
        },
        "S33": {
            "title": "Special discharge measurement methods: Dilution, Ultrasonic, Electromagnetic",
            "topics": [
                "Dilution gauging principles: tracer injection methods (constant-rate injection vs sudden slug injection)",
                "Tracer selection criteria: conservative, non-toxic, chemically stable, easily measurable (NaCl, Rhodamine WT, Fluorescein)",
                "Mass balance equations: Q = q * (C1 - C2) / (C2 - C0) for constant rate; Q = V1 * C1 / integral(C - C0) dt for slug",
                "Ultrasonic (Acoustic Velocity Meter / ADCP) methods: acoustic travel time and Doppler frequency shift",
                "Electromagnetic gauging in small lined channels; radar surface velocity meters and drone LSPIV (Large Scale Particle Image Velocimetry)"
            ],
            "numericals": [
                "Constant-rate salt injection dilution gauging discharge computation from electrical conductivity measurements",
                "Sudden slug injection integration to determine stream discharge in a turbulent mountain creek",
                "ADCP velocity profile integration across transect sections"
            ],
            "activity": "Calculate stream discharge from fluorometer dye concentration-time curves recorded during slug tracer injection.",
            "lab": "HEC-RAS: Compare 1D cross-sectional average velocity predictions against ADCP field velocity transect data.",
            "software": "HEC-RAS",
            "refs": "T1 (Ch 4), T3 (Ch 4)"
        },
        "S34": {
            "title": "Flood frequency analysis: Return period and plotting positions",
            "topics": [
                "Extreme hydrologic events; flood risk definition in hydraulic design (spillways, bridges, culverts)",
                "Annual Maximum Flood (AMF) series vs Partial Duration / Peak-Over-Threshold (POT) series",
                "Return period T definition: recurrence interval T = 1 / P(X >= x); exceedance probability P and non-exceedance probability q",
                "Plotting position formulas: Weibull: P = m / (N + 1); Hazen: P = (2m - 1) / (2N); California: P = m / N; Cunnane: P = (m - 0.4)/(N + 0.2)",
                "Probability plotting papers: normal, log-normal, extreme value grids"
            ],
            "numericals": [
                "Ranking an annual maximum flood series and calculating Weibull, Hazen, and Cunnane plotting positions",
                "Calculating return period and annual probability of exceedance for observed historical peaks",
                "Hydrologic risk analysis: probability of at least one exceedance of design flood during structure design life of n years: R = 1 - (1 - 1/T)^n"
            ],
            "activity": "Compute plotting positions for 35 years of gauge peaks and plot on probability scale to estimate 25-yr flood.",
            "lab": "HEC-SSP: Create a new study; import annual maximum peak flow series and examine descriptive statistical metrics.",
            "software": "HEC-SSP",
            "refs": "T1 (Ch 7), T2 (Ch 8)"
        },
        "S35": {
            "title": "Gumbel's extreme value Type I distribution",
            "topics": [
                "Theoretical basis of Gumbel (EV-I) distribution for maximum extremes; cumulative probability F(x) = exp(-exp(-y))",
                "Reduced variate y = -ln(-ln(1 - 1/T)) and reduced variate for return period T: y_T = -ln(ln(T / (T - 1)))",
                "Gumbel's frequency factor formula: x_T = x_mean + K_T * s_x",
                "Chow's general frequency equation; theoretical K_T = (y_T - y_n) / s_n where y_n and s_n are sample size coefficients",
                "Standard error of estimate S_e and confidence intervals (68% and 95% bounds) for Gumbel predictions"
            ],
            "numericals": [
                "Calculation of 50-year and 100-year peak design floods for a bridge catchment using Gumbel's method with finite sample size corrections (y_n, s_n)",
                "Determining 95% confidence bands for the 100-year estimated flood peak",
                "Reverse estimation: finding the return period of an observed unprecedented catastrophic flood"
            ],
            "activity": "Compute the 50-yr and 100-yr design discharge from 40 years of flood data using Gumbel frequency factor tables.",
            "lab": "HEC-SSP: Execute Gumbel (Extreme Value Type I) distribution fitting; extract frequency curves and confidence limits.",
            "software": "HEC-SSP",
            "refs": "T1 (Ch 7), T2 (Ch 8)"
        },
        "S36": {
            "title": "Log-Pearson Type III distribution and hydrologic design risk",
            "topics": [
                "Three-parameter distributions in flood hydrology; logarithmic transformation z = log10(x)",
                "Sample statistics in log-space: mean z_mean, standard deviation s_z, and skewness coefficient C_s",
                "Log-Pearson Type III frequency equation: log10(x_T) = z_mean + K_z * s_z, where K_z = f(C_s, T)",
                "Guidelines for flood frequency analysis: US Geological Survey Bulletin 17C / CWC guidelines",
                "Comparing Gumbel vs LP3; handling outliers (high and low outliers), regional skew coefficients"
            ],
            "numericals": [
                "Calculation of mean, standard deviation, and skewness coefficient in log10 space for annual peak flow series",
                "Log-Pearson Type III flood estimation for 25-year, 50-year, and 100-year recurrence intervals using K_z tables",
                "Comparison of design flood discharge obtained from Gumbel vs Log-Pearson Type III methods"
            ],
            "activity": "Estimate the 100-year flood discharge using Log-Pearson Type III and compare with Gumbel design peak.",
            "lab": "HEC-SSP: Run Bulletin 17C / Log-Pearson Type III analysis with regional skew weighting and low-outlier screening.",
            "software": "HEC-SSP",
            "refs": "T1 (Ch 7), T2 (Ch 8)"
        },
        # Unit 5
        "S37": {
            "title": "Groundwater occurrence, vertical distribution, and aquifer types",
            "topics": [
                "Role of groundwater in the hydrologic cycle; vertical distribution of subsurface water",
                "Zone of aeration (unsaturated zone): soil water zone, intermediate vadose zone, capillary fringe",
                "Zone of saturation (phreatic zone); water table definition and phreatic surface",
                "Aquifer classifications: unconfined (water-table), confined (artesian), semi-confined (leaky), perched aquifers; aquitard, aquiclude, aquifuge",
                "Hydrogeological properties: porosity n, specific yield S_y, specific retention S_r, and their fundamental relation: n = S_y + S_r"
            ],
            "numericals": [
                "Calculation of porosity, void ratio, and water volume stored in a saturated aquifer column",
                "Determination of specific yield and volume of drainable water released from water table decline",
                "Calculation of specific retention from gravimetric soil moisture measurement"
            ],
            "activity": "Calculate water table decline and total usable water volume released over a 50 km2 command area.",
            "lab": "QGIS: Import hydrogeological maps; delineate regional unconfined and confined aquifer boundaries.",
            "software": "QGIS",
            "refs": "T1 (Ch 9), T3 (Ch 5)"
        },
        "S38": {
            "title": "Darcy's law, hydraulic conductivity, and seepage velocity",
            "topics": [
                "Darcy's law formulation (1856): Q = -K * A * (dh/dL) = K * A * i, where i is hydraulic gradient",
                "Range of validity of Darcy's law; Reynolds number of porous media flow: Re = (rho * v * d) / mu < 1 to 10",
                "Hydraulic conductivity K: influence of fluid properties (viscosity, density) and matrix properties (grain size, packing)",
                "Intrinsic permeability k: K = k * (rho * g) / mu = k * gamma / mu; units of Darcy and cm2",
                "Discharge velocity (Darcy flux v) vs actual pore seepage velocity v_s = v / n_e (effective porosity)"
            ],
            "numericals": [
                "Application of Darcy's law to compute flow discharge through a multi-layer laboratory permeameter",
                "Computation of seepage velocity and travel time of a non-reactive solute between two monitoring wells",
                "Verification of Darcy flow validity using porous medium Reynolds number"
            ],
            "activity": "Compute groundwater seepage flow rate and contaminant travel time across an industrial aquifer section.",
            "lab": "QGIS: Create piezometric head contour maps and calculate regional hydraulic gradient vectors.",
            "software": "QGIS",
            "refs": "T1 (Ch 9), T3 (Ch 5)"
        },
        "S39": {
            "title": "Transmissibility, storativity, and equivalent conductivity of stratified aquifers",
            "topics": [
                "Aquifer transmissibility (transmissivity) T = K * b, where b is aquifer saturated thickness",
                "Storage coefficient (storativity) S: unconfined storativity (S approx S_y, 0.05 - 0.30) vs confined storativity (S = S_s * b, 10^-5 - 10^-3)",
                "Specific storage S_s: compressibility of aquifer skeleton (alpha) and water (beta): S_s = gamma * (alpha + n * beta)",
                "Flow parallel to stratification: equivalent horizontal hydraulic conductivity K_h = sum(K_i * b_i) / sum(b_i)",
                "Flow perpendicular to stratification: equivalent vertical hydraulic conductivity K_v = sum(b_i) / sum(b_i / K_i); anisotropy ratio K_h / K_v"
            ],
            "numericals": [
                "Equivalent horizontal and vertical hydraulic conductivity calculation for a 3-layer stratified aquifer system",
                "Calculation of confined aquifer storativity from matrix and fluid compressibility values",
                "Volume of groundwater released from storage per square kilometer of artesian aquifer for 3 m piezometric drop"
            ],
            "activity": "Calculate equivalent conductivity and seepage flow through an anisotropic stratified aquifer.",
            "lab": "HEC-HMS: Parameterize groundwater linear reservoir recession constants using aquifer transmissivity and storage.",
            "software": "HEC-HMS",
            "refs": "T1 (Ch 9), T3 (Ch 5)"
        },
        "S40": {
            "title": "Steady radial flow to a well in an unconfined aquifer (Dupuit-Thiem)",
            "topics": [
                "Well hydraulics: pumping well geometry, cone of depression, radius of influence R",
                "Dupuit-Forchheimer assumptions: horizontal streamlines, hydraulic gradient equal to phreatic slope",
                "Differential equation of steady radial flow: Q = 2 * pi * r * h * K * (dh/dr)",
                "Dupuit-Thiem formula for unconfined aquifer: Q = pi * K * (h2^2 - h1^2) / ln(r2 / r1)",
                "Drawdown relation: s = H - h; formulation in terms of undisturbed saturated thickness H and drawdowns s1, s2"
            ],
            "numericals": [
                "Calculation of hydraulic conductivity K from observation well measurements during a steady pumping test",
                "Estimation of steady pumping discharge from measured drawdowns in two observation wells at known radii",
                "Calculation of well drawdown and radius of influence using empirical formulas (Sichardt)"
            ],
            "activity": "Compute unconfined aquifer permeability K and well discharge from steady-state pump test data.",
            "lab": "QGIS: Map cone of depression contours and compute spatial buffer of radius of influence around drinking wells.",
            "software": "QGIS",
            "refs": "T1 (Ch 9), T2 (Ch 10)"
        },
        "S41": {
            "title": "Steady radial flow to a well in a confined aquifer (Thiem equation)",
            "topics": [
                "Confined artesian well flow conditions; constant aquifer thickness b during pumping",
                "Derivation of Thiem's formula: Q = 2 * pi * T * (s1 - s2) / ln(r2 / r1) = 2 * pi * K * b * (h2 - h1) / ln(r2 / r1)",
                "Piezometric surface profile; boundary condition at radius of influence R (s = 0, h = H)",
                "Pumping well discharge equation: Q = 2 * pi * T * s_w / ln(R / r_w)",
                "Comparison of confined vs unconfined well hydraulics and cone of depression dimensions"
            ],
            "numericals": [
                "Determination of confined aquifer transmissibility T and permeability K from steady-state pumping test data",
                "Calculation of well drawdown s_w when pumping at specified discharge rate Q",
                "Interference between two closely spaced pumping wells: additive drawdown calculation"
            ],
            "activity": "Solve for transmissibility and predict drawdown interference between two industrial supply wells.",
            "lab": "QGIS: Create raster interpolation of 3D piezometric drawdown cone from multiple pumping wells.",
            "software": "QGIS",
            "refs": "T1 (Ch 9), T2 (Ch 10)"
        },
        "S42": {
            "title": "Unsteady radial flow to a confined well: Theis non-equilibrium equation",
            "topics": [
                "Unsteady groundwater flow equation in radial coordinates: d2h/dr2 + (1/r)*dh/dr = (S/T) * (dh/dt)",
                "Theis solution (1935): s = (Q / (4 * pi * T)) * W(u), where W(u) is the Theis Well Function",
                "Dimensionless parameter u = (r^2 * S) / (4 * T * t)",
                "Well function series expansion: W(u) = -0.5772 - ln(u) + u - u^2/(2*2!) + u^3/(3*3!) - ...",
                "Type curve matching procedure: log-log matching of field data (s vs t/r2) with theoretical curve (W(u) vs 1/u)"
            ],
            "numericals": [
                "Evaluation of Well Function W(u) using series expansion for given parameter values",
                "Calculation of drawdown at a specified radius and pumping duration using known T and S values",
                "Determining T and S by manual Theis type curve matching match-point coordinates"
            ],
            "activity": "Evaluate Theis well function W(u) and predict unsteady drawdown after 12, 24, and 48 hours of continuous pumping.",
            "lab": "Python/QGIS: Implement automated Theis curve fitting and visualize transient drawdown cone evolution.",
            "software": "Python, QGIS",
            "refs": "T1 (Ch 9), T2 (Ch 10)"
        },
        "S43": {
            "title": "Cooper-Jacob straight-line approximation method",
            "topics": [
                "Cooper and Jacob simplification (1946) for small u (u <= 0.01: large pumping time t or small radial distance r)",
                "Approximation: W(u) approx -0.5772 - ln(u) = 2.303 * log10(2.25 * T * t / (r^2 * S))",
                "Drawdown equation on semi-logarithmic plot: s = (2.303 * Q / (4 * pi * T)) * log10(2.25 * T * t / (r^2 * S))",
                "Slope of straight line per log cycle: Delta s = 2.303 * Q / (4 * pi * T) => T = 2.303 * Q / (4 * pi * Delta s)",
                "Zero-drawdown intercept t0 on time axis: S = 2.25 * T * t0 / r^2; validity criteria check (u = r^2*S/(4*T*t) <= 0.01)"
            ],
            "numericals": [
                "Graphical determination of transmissibility T and storativity S from pumping test drawdown vs log(time) observations",
                "Distance-drawdown analysis at fixed time t to determine aquifer parameters",
                "Checking Cooper-Jacob validity threshold for early time data points"
            ],
            "activity": "Fit a Cooper-Jacob semi-log straight line to 24-hour pumping test data to extract T and S.",
            "lab": "Python: Write a script to fit Cooper-Jacob linear regression, compute T, S, and verify u <= 0.01 condition.",
            "software": "Python",
            "refs": "T1 (Ch 9), T2 (Ch 10)"
        },
        "S44": {
            "title": "Well losses, specific capacity, and open well recuperation test",
            "topics": [
                "Total drawdown in a pumping well: s_w = s_aquifer + s_well = B * Q + C * Q^2 (Jacob's equation)",
                "Aquifer loss coefficient B (laminar flow) vs well loss coefficient C (turbulent flow through screen and casing)",
                "Step-drawdown pumping test for evaluating well performance; well efficiency E_w = (B * Q / s_w) * 100%",
                "Specific capacity of a well: SC = Q / s_w; relation between specific capacity and transmissivity",
                "Open wells in unconfined formations; recuperation test principle: specific yield of open well K/A = (2.303 / t) * log10(s1 / s2)"
            ],
            "numericals": [
                "Determination of formation loss B and well loss C from multi-step drawdown test data",
                "Well efficiency calculation at multiple operating pumping discharges",
                "Recuperation test calculation: computing specific capacity factor (K/A) and safe yield of an open dug well"
            ],
            "activity": "Analyze a 3-step drawdown test to determine well loss coefficient C and compute efficiency at design discharge.",
            "lab": "Spreadsheet/Python: Analyze open well recuperation test data and determine safe sustainable yield.",
            "software": "Python",
            "refs": "T1 (Ch 9), T2 (Ch 10)"
        },
        "S45": {
            "title": "Managed aquifer recharge, rainwater harvesting, and groundwater management",
            "topics": [
                "Groundwater over-exploitation: falling water tables, seawater intrusion, land subsidence, fluoride and arsenic contamination",
                "Concept of safe yield and sustainable yield of groundwater basins; groundwater balance equation",
                "Managed Aquifer Recharge (MAR) methods: percolation tanks, check dams, recharge shafts, injection wells, induced recharge",
                "Roof-top and urban rainwater harvesting systems: catchment, filtration units, recharge pit design (CGWB guidelines)",
                "Groundwater legislation, Central Ground Water Authority (CGWA) guidelines, and community participatory management in India"
            ],
            "numericals": [
                "Recharge pit sizing: calculating required storage volume and filter dimensions for a 400 m2 institutional rooftop",
                "Catchment water balance: estimating annual artificial groundwater recharge potential for a sub-watershed",
                "Economic cost-benefit analysis of an artificial recharge percolation pond"
            ],
            "activity": "Size an urban rainwater harvesting recharge pit and calculate annual recharge volume based on local rainfall.",
            "lab": "QGIS: Perform Multi-Criteria Evaluation (MCE) overlay analysis to identify optimal artificial recharge zones.",
            "software": "QGIS",
            "refs": "T1 (Ch 9), T3 (Ch 5)"
        }
    }

    for sid, info in outlines.items():
        md = f"""<!--tab:Theory-->

> [!note] Session outline & syllabus guide
> Full lecture notes for this session are being prepared according to the curriculum (CO4/CO5). The structured outline below details the theory concepts, derivations, worked numerical problem types, and matching laboratory workflows.

## Theory topics

"""
        for t in info['topics']:
            md += f"- **{t.split(':')[0]}**: {':'.join(t.split(':')[1:]).strip() if ':' in t else t}\n"

        md += f"""
## Worked numerical problem types

"""
        for n in info['numericals']:
            md += f"1. {n}\n"

        md += f"""
**Textbook references:** {info['refs']}

<!--tab:In class-->

## Planned in-class activity

- **Focus:** {info['activity']}
- **Format:** Step-by-step problem breakdown with verified check-answer exercises.

<!--tab:Software lab-->

## Planned laboratory workflow

- **Task:** {info['lab']}
- **Software platform:** `{info['software']}`
- **Integration:** Results link directly with hydrologic and hydraulic models developed in earlier modules.

<!--tab:Practice-->

## Planned practice & exam preparation

- **Self-assessment:** 4–5 concept-check multiple choice questions covering core theory.
- **Examinations:** Structured 2-mark conceptual questions, 5-mark derivations, and 10-mark comprehensive design numericals with verified solutions.
"""
        with open(f"sessions/{sid}.md", "w", encoding="utf-8") as f:
            f.write(md)
        print(f"Updated sessions/{sid}.md")

if __name__ == '__main__':
    run()
