import json

def run():
    with open('sessions.json', 'r', encoding='utf-8') as f:
        data = json.load(f)

    # 1. Add L11-L16 to labs
    labs_to_add = [
        {
            "id": "L11",
            "unit": 2,
            "title": "HEC-HMS Loss Methods: Initial and Constant / Deficit and Constant",
            "goal": "Configure and compare initial and constant loss parameters against a 24-hour design storm in HEC-HMS.",
            "software": ["HEC-HMS"],
            "sessions": ["S10", "S12"],
            "minutes": 50,
            "file": "labs/L11.md",
            "enabled": False,
            "release": ""
        },
        {
            "id": "L12",
            "unit": 2,
            "title": "HEC-HMS SCS Curve Number: Parameter Estimation and Subbasin Loss",
            "goal": "Assign composite curve numbers and initial abstraction to subbasins in HEC-HMS and simulate excess runoff.",
            "software": ["HEC-HMS"],
            "sessions": ["S17"],
            "minutes": 55,
            "file": "labs/L12.md",
            "enabled": False,
            "release": ""
        },
        {
            "id": "L13",
            "unit": 2,
            "title": "HEC-HMS Evapotranspiration: Monthly Average and Gridded ET",
            "goal": "Implement meteorological models with monthly evaporation rates and observe the effect on catchment water balance.",
            "software": ["HEC-HMS"],
            "sessions": ["S14", "S15"],
            "minutes": 45,
            "file": "labs/L13.md",
            "enabled": False,
            "release": ""
        },
        {
            "id": "L14",
            "unit": 2,
            "title": "Continuous Simulation: Soil Moisture Accounting (SMA) Model Setup",
            "goal": "Configure the HEC-HMS 12-parameter Soil Moisture Accounting loss method across multi-month monsoon records.",
            "software": ["HEC-HMS"],
            "sessions": ["S12", "S18"],
            "minutes": 60,
            "file": "labs/L14.md",
            "enabled": False,
            "release": ""
        },
        {
            "id": "L15",
            "unit": 2,
            "title": "Model Calibration and Loss Parameter Verification with Observed Hydrographs",
            "goal": "Calibrate loss rates and initial abstraction by minimizing error against observed streamflow gauge hydrographs.",
            "software": ["HEC-HMS"],
            "sessions": ["S13", "S18"],
            "minutes": 50,
            "file": "labs/L15.md",
            "enabled": False,
            "release": ""
        },
        {
            "id": "L16",
            "unit": 2,
            "title": "GIS-Based Rainfall-Runoff Modeling: Catchment Losses with QGIS and HEC-HMS",
            "goal": "Derive spatially distributed land use and soil curve numbers in QGIS and export directly to an HEC-HMS basin model.",
            "software": ["QGIS", "HEC-HMS"],
            "sessions": ["S16", "S17"],
            "minutes": 60,
            "file": "labs/L16.md",
            "enabled": False,
            "release": ""
        }
    ]

    existing_lab_ids = {l['id'] for l in data['labs']}
    for lab in labs_to_add:
        if lab['id'] not in existing_lab_ids:
            data['labs'].append(lab)

    # 2. Update S10-S18 in sessions
    s_lab_map = {
        "S10": ["L11"],
        "S11": ["L13"],
        "S12": ["L11", "L14"],
        "S13": ["L15"],
        "S14": ["L13"],
        "S15": ["L13"],
        "S16": ["L16"],
        "S17": ["L12", "L16"],
        "S18": ["L14", "L15"]
    }

    for s in data['sessions']:
        sid = s['id']
        if sid in s_lab_map:
            s['labs'] = s_lab_map[sid]
            s['ready'] = True
            # Keep enabled: false per rule 4E

    # 3. Enhance outlines for Units 4 & 5 in sessions.json
    unit4_details = {
        "S28": {
            "hook": "Theory: Hydrometry & stage measurement (staff, wire, radar). Numericals: Staff gauge datum conversion & bubble gauge calibration. Lab: Install HEC-RAS & explore river geometry.",
            "lab": "HEC-RAS: Setup 1D river reach geometry and cross-section stations."
        },
        "S29": {
            "hook": "Theory: Area-velocity method, current meter rating v = a + bN. Numericals: Mid-section and mean-section method discharge computation. Lab: Enter surveyed river geometry into HEC-RAS.",
            "lab": "HEC-RAS: Cross-section input, Manning's n roughness assignment."
        },
        "S30": {
            "hook": "Theory: Slope-area indirect discharge measurement, Manning's formula. Numericals: High-water mark reach slope & peak discharge calculation. Lab: Steady-flow simulation in HEC-RAS.",
            "lab": "HEC-RAS: Steady-flow analysis matching observed flood levels."
        },
        "S31": {
            "hook": "Theory: Stage-discharge rating curve Q = Cr(G - a)^b, controls. Numericals: Log-log regression to determine rating curve parameters Cr and b. Lab: Define downstream rating curve boundary.",
            "lab": "HEC-RAS: Rating curve downstream boundary condition setup."
        },
        "S32": {
            "hook": "Theory: Shifting controls, loop rating curves, backwater & unsteady flow. Numericals: Jones formula discharge correction for unsteady flood wave. Lab: Mixed flow regime modeling.",
            "lab": "HEC-RAS: Subcritical, supercritical, and mixed flow regime profiles."
        },
        "S33": {
            "hook": "Theory: Dilution gauging, chemical tracers, ultrasonic & electromagnetic methods. Numericals: Constant-rate tracer injection mass balance equation. Lab: River calibration with tracer flow data.",
            "lab": "HEC-RAS: Compare 1D hydraulic profile with field-measured flows."
        },
        "S34": {
            "hook": "Theory: Flood frequency analysis, return period T, plotting positions (Weibull, Hazen). Numericals: Return period & exceedance probability calculation. Lab: Extract annual maximum series.",
            "lab": "HEC-SSP: Setup annual maximum flood series for frequency analysis."
        },
        "S35": {
            "hook": "Theory: Gumbel's extreme value Type I distribution, frequency factor K_T. Numericals: 50-year and 100-year peak design flood estimation by Gumbel's method. Lab: Gumbel fitting in HEC-SSP.",
            "lab": "HEC-SSP: Fit Gumbel distribution to observed annual peak flows."
        },
        "S36": {
            "hook": "Theory: Log-Pearson Type III distribution, flood risk, safety margin. Numericals: Hydrologic risk and probability of at least one failure in n years. Lab: LP3 fitting and confidence limits.",
            "lab": "HEC-SSP: Fit Log-Pearson Type III distribution with 95% confidence bounds."
        }
    }

    unit5_details = {
        "S37": {
            "hook": "Theory: Groundwater occurrence, vertical zones, aquifer types (confined, unconfined, leaky). Numericals: Porosity, specific yield, and specific retention. Lab: QGIS aquifer layer mapping.",
            "lab": "QGIS: Delineate regional hydrogeological units and recharge zones."
        },
        "S38": {
            "hook": "Theory: Darcy's law, range of validity, hydraulic conductivity K, intrinsic permeability. Numericals: Darcy flux, discharge velocity, and seepage velocity calculation. Lab: Hydraulic gradient map in QGIS.",
            "lab": "QGIS: Interpolate groundwater elevation contours from well observations."
        },
        "S39": {
            "hook": "Theory: Transmissibility T = Kb, storativity S, specific capacity of wells. Numericals: Transmissibility & storage coefficient estimation from aquifer test. Lab: Baseflow parameter estimation.",
            "lab": "HEC-HMS: Set linear reservoir baseflow parameters from hydrogeology."
        },
        "S40": {
            "hook": "Theory: Steady radial flow to well in unconfined aquifer (Dupuit-Thiem). Numericals: Well discharge and hydraulic conductivity from observation wells. Lab: Wellhead protection zone buffer.",
            "lab": "QGIS: Buffer calculation for wellhead sanitary protection zones."
        },
        "S41": {
            "hook": "Theory: Steady radial flow to well in confined aquifer (Thiem equation). Numericals: Confined aquifer discharge and drawdown cone computation. Lab: Drawdown cone 3D surface.",
            "lab": "QGIS: Create raster surface of regional drawdown cone."
        },
        "S42": {
            "hook": "Theory: Unsteady radial flow to confined well (Theis non-equilibrium equation). Numericals: Well function W(u) calculation and drawdown prediction. Lab: Aquifer test curve matching in Python.",
            "lab": "Python/QGIS: Type curve matching for Theis non-equilibrium equation."
        },
        "S43": {
            "hook": "Theory: Cooper-Jacob straight-line approximation method, limits of validity (u < 0.01). Numericals: Graphical determination of T and S from semilog time-drawdown data. Lab: Automated Cooper-Jacob fitting.",
            "lab": "Python: Fit Cooper-Jacob straight-line regression to pump test data."
        },
        "S44": {
            "hook": "Theory: Well losses, aquifer losses, well efficiency, recuperation test. Numericals: Specific capacity and recuperation constant computation for open well. Lab: Safe yield analysis.",
            "lab": "Spreadsheet/Python: Open well recuperation test analysis."
        },
        "S45": {
            "hook": "Theory: Managed aquifer recharge (MAR), rainwater harvesting, groundwater quality. Numericals: Artificial recharge trench capacity & catchment recharge volume. Lab: Groundwater balance map.",
            "lab": "QGIS: Multi-criteria spatial decision analysis for recharge site suitability."
        }
    }

    for s in data['sessions']:
        sid = s['id']
        if sid in unit4_details:
            s['hook'] = unit4_details[sid]['hook']
            s['lab'] = unit4_details[sid]['lab']
        elif sid in unit5_details:
            s['hook'] = unit5_details[sid]['hook']
            s['lab'] = unit5_details[sid]['lab']

    with open('sessions.json', 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
    print("sessions.json updated successfully!")

if __name__ == '__main__':
    run()
