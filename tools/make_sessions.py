import json, os
OUT=os.path.join(os.path.dirname(os.path.abspath(__file__)),'..','sessions.json') if not os.environ.get('OUTJSON') else os.environ['OUTJSON']
S = []
def s(unit, title, hook, refs, software, lab, co, kw=""):
    n = len(S) + 1
    S.append(dict(id=f"S{n:02d}", day=n, unit=unit, title=title, hook=hook, co=co, refs=refs,
                  software=software, lab=lab, keywords=kw, file=f"sessions/S{n:02d}.md",
                  enabled=n <= 9, ready=n <= 9, labs=[], release=""))
HMS, RAS, GIS, SH = "HEC-HMS", "HEC-RAS", "QGIS", "Spreadsheet"
# ---------------- Unit I ----------------
s(1, "Hydrology, the hydrologic cycle and the water budget",
  "What hydrology is for, how water moves, and the one equation every model obeys.",
  "T1, T2", [SH, HMS], "Water-budget problems by hand; install HEC-HMS and QGIS at home", "CO1", "continuity catchment budget")
s(1, "Precipitation: forms, types and weather systems",
  "Rain, snow, hail; frontal, cyclonic, convective, orographic — and a first look inside HEC-HMS.",
  "T1, T2", [HMS], "Open the Castro Valley sample project, run it, and map each HMS component to the hydrologic cycle", "CO1", "monsoon orographic convective")
s(1, "Measuring rainfall and designing a rain-gauge network",
  "Symons', syphon (float), tipping-bucket and weighing gauges; how many gauges a catchment needs.",
  "T1, T2", [SH, HMS], "Start the course model: create a project and enter a recording-gauge storm as a precipitation gage", "CO1", "rain gauge network optimum number Cv")
s(1, "Consistency of rainfall records: the double mass curve",
  "Spot a station whose record has drifted, and correct it.",
  "T1, T2", [SH, HMS], "Build a double mass curve in a spreadsheet; load the corrected series into HMS", "CO1", "double mass curve consistency")
s(1, "Mean areal rainfall: arithmetic, Thiessen and isohyetal",
  "Three ways to turn point rainfall into catchment rainfall — and why they disagree.",
  "T1, T2", [SH, HMS], "Gage Weights meteorologic model in HEC-HMS: arithmetic vs Thiessen weights", "CO1", "thiessen isohyetal average")
s(1, "Estimating missing rainfall data",
  "Arithmetic average, normal-ratio and regression methods for filling gaps.",
  "T1, T2", [SH, HMS], "Fill a gap in a station record, then see what the gap does to HMS precipitation", "CO1", "normal ratio missing data regression")
s(1, "Presenting rainfall data: mass curve, hyetograph, moving average",
  "Read a storm from its mass curve; smooth a 30-year record to see the trend.",
  "T1, T2", [SH, HMS], "Hyetograph and cumulative-depth plots in HMS; moving average in a spreadsheet", "CO1", "mass curve hyetograph moving average")
s(1, "Frequency analysis and intensity-duration-frequency curves",
  "Return period, probability and risk; building and using IDF curves.",
  "T1, T2", [SH, HMS], "Frequency Storm meteorologic model in HMS driven by IDF depths", "CO1", "IDF return period risk weibull DAD")
s(1, "Thiessen polygon map in QGIS and catchment delineation",
  "From station coordinates and a DEM to polygons, weights and a basin outline. PBL launch.",
  "T1, W3, W4", [GIS, HMS], "Voronoi polygons in QGIS; terrain-based subbasin delineation in HMS", "CO1", "QGIS voronoi DEM delineation PBL")
# ---------------- Unit II ----------------
s(2, "Losses from precipitation; evaporation process and factors",
  "Where rainfall goes before it becomes runoff; what drives evaporation.",
  "T1, T2", [HMS], "Find every 'loss' slot in an HMS subbasin: canopy, surface, loss method, ET", "CO2", "abstraction evaporation dalton")
s(2, "Measuring and estimating evaporation",
  "IS Class A pan, pan coefficient, Meyer's formula and reservoir evaporation.",
  "T1, T2", [SH, HMS], "Monthly Average evapotranspiration method in HMS from pan data", "CO2", "class A pan meyer formula")
s(2, "Infiltration: process, factors and the double-ring infiltrometer",
  "Infiltration capacity vs rate; reading an infiltrometer test.",
  "T1, T2", [SH, HMS], "Plot infiltrometer data; Initial & Constant loss in HMS", "CO2", "infiltrometer infiltration capacity")
s(2, "Horton's equation and infiltration indices",
  "Fitting Horton's curve; φ-index and W-index from a storm.",
  "T1, T2", [SH, HMS], "Compute φ-index by hand, then match it with the HMS constant-rate loss", "CO2", "horton phi index w index")
s(2, "Evapotranspiration: AET, PET and their measurement",
  "Lysimeters, field plots, and the difference between what could and what did evaporate.",
  "T1, T2", [HMS], "Hargreaves / Priestley-Taylor ET in an HMS continuous simulation", "CO2", "lysimeter PET AET")
s(2, "Penman's equation and the Blaney-Criddle formula",
  "Energy-balance and temperature-based PET; solved problems.",
  "T1, T2", [SH, HMS], "Penman PET in a spreadsheet; compare with the HMS ET method", "CO2", "penman blaney criddle")
s(2, "Runoff: catchment, components and factors affecting",
  "Surface, interflow and base flow; catchment characteristics that shape runoff.",
  "T1, T2", [HMS], "SCS Curve Number loss and catchment parameters in HMS", "CO2", "runoff components curve number")
s(2, "Rainfall-runoff relationship by simple regression",
  "Fit R = aP + b, judge the fit, use it for prediction.",
  "T1, T2", [SH, HMS], "Run several storms through HMS and regress simulated runoff on rainfall", "CO2", "regression correlation")
s(2, "Verifying losses with software: a GIS rainfall-runoff model",
  "Close the loop: analytical losses vs the HMS model of your PBL catchment. PBL Milestone 2.",
  "T1, W5, W6", [GIS, HMS], "Complete event model of the PBL catchment; compare with hand calculations", "CO2", "PBL milestone verification")
# ---------------- Unit III ----------------
s(3, "The hydrograph and its components",
  "Rising limb, crest, recession; time to peak, lag and time base.",
  "T1, R3", [HMS], "Read and annotate an HMS outflow hydrograph", "CO3", "hydrograph limb crest recession")
s(3, "Factors affecting the flood hydrograph",
  "Shape, size, slope, land use and storm movement.",
  "T1, R3", [HMS], "Sensitivity runs in HMS: area, CN, lag, storm duration", "CO3", "hydrograph shape factors")
s(3, "Base-flow separation",
  "Straight-line, fixed-base (N = 0.83 A^0.2) and variable-slope methods.",
  "T1, R3", [SH, HMS], "Recession baseflow method in HMS vs hand separation", "CO3", "base flow separation N")
s(3, "Effective rainfall hyetograph and direct runoff hydrograph",
  "ERH from φ-index; DRH volume equals effective rainfall volume.",
  "T1, R3", [SH, HMS], "Excess precipitation and direct runoff from HMS result tables", "CO3", "ERH DRH effective rainfall")
s(3, "The unit hydrograph: concept and assumptions",
  "Linearity, time invariance, and why one curve describes a catchment.",
  "T1, R3", [HMS], "User-Specified Unit Hydrograph transform in HMS", "CO3", "unit hydrograph linearity")
s(3, "Deriving a unit hydrograph from a simple storm",
  "From observed flood to D-hour UH, step by step.",
  "T1, R3", [SH, HMS], "Derive a UH in a spreadsheet; enter it in HMS and check the volume", "CO3", "derivation unit hydrograph")
s(3, "Unit hydrograph for complex storms",
  "Superposition and convolution for multi-period effective rainfall.",
  "T1, R3", [SH, HMS], "Convolution in a spreadsheet vs HMS for the same storm", "CO3", "convolution superposition")
s(3, "The S-curve and its uses",
  "Summation hydrograph: construction and equilibrium discharge.",
  "T1, R3", [SH], "Build an S-curve in a spreadsheet; check equilibrium discharge 2.778 A/D", "CO3", "s-curve summation")
s(3, "Changing unit hydrograph duration; synthetic unit hydrographs",
  "D-hour to T-hour UH by S-curve; Snyder and SCS for ungauged catchments. PBL Milestone 3 begins.",
  "T1, R3", [SH, HMS], "S-curve conversion; Snyder and SCS UH transforms in HMS", "CO3", "snyder SCS synthetic")
# ---------------- Unit IV ----------------
s(4, "Streamflow measurement and measurement of stage",
  "Why we measure, where, and how stage is recorded. First look at HEC-RAS.",
  "T2, T3", [RAS], "Install HEC-RAS; open an example project and read cross-sections and stage", "CO4", "staff gauge stage recorder")
s(4, "Discharge by the area-velocity method",
  "Current meters, verticals, mid-section and mean-section methods.",
  "T2, T3", [SH, RAS], "Enter a surveyed cross-section in HEC-RAS; compare its area with the hand calculation", "CO4", "current meter area velocity")
s(4, "Discharge by the slope-area method",
  "Manning's equation between two sections with high-water marks.",
  "T2, T3", [SH, RAS], "Steady-flow HEC-RAS run to match observed water levels", "CO4", "slope area manning")
s(4, "Stage-discharge relation (rating curve)",
  "Fitting Q = Cr (G − a)^β; extension and use; analysing gauged data.",
  "T2, T3, W3", [SH, RAS], "Rating curve from multiple HEC-RAS profiles; fit with India-WRIS data", "CO4", "rating curve stage discharge")
s(4, "Flood routing: hydrologic and hydraulic",
  "Storage, attenuation and lag; the routing equation.",
  "T2, T3, R5", [HMS, RAS], "Same flood routed by HMS reach vs HEC-RAS unsteady flow", "CO5", "routing attenuation storage")
s(4, "Reservoir routing: Modified Puls method",
  "Storage-indication method, step by step.",
  "T2, T3, R5", [SH, HMS], "Modified Puls in a spreadsheet; HMS Reservoir element with the same storage-outflow", "CO5", "modified puls reservoir")
s(4, "Channel routing: Muskingum method",
  "Prism and wedge storage; K, x and the routing coefficients.",
  "T2, T3, R5", [SH, HMS], "Muskingum by hand; Muskingum reach in HMS; compare", "CO5", "muskingum K x")
s(4, "Flood frequency (Gumbel) and flood forecasting",
  "Annual maxima, Gumbel's method, confidence limits, forecasting basics.",
  "T2, T3, R5", [SH, "HEC-SSP"], "Gumbel by hand; Bulletin 17C analysis in HEC-SSP", "CO4", "gumbel frequency forecasting")
s(4, "Extreme events; reservoir sedimentation and sediment yield",
  "Case studies of extreme floods; trap efficiency and reservoir life.",
  "T3, R3", [RAS, SH], "Flood inundation map in RAS Mapper; trap-efficiency calculation", "CO4", "sedimentation trap efficiency brune")
# ---------------- Unit V ----------------
s(5, "Groundwater: scope, occurrence and aquifer types",
  "Zones of saturation; confined, unconfined, perched aquifers; aquitards.",
  "T3, R7", [HMS], "Soil-moisture-accounting groundwater layers in HMS", "CO3", "aquifer confined unconfined")
s(5, "Aquifer parameters",
  "Porosity, specific yield and retention, permeability, transmissivity, storage coefficient.",
  "T3, R7", [SH], "Compute aquifer parameters from lab and field data", "CO3", "specific yield transmissivity storativity")
s(5, "Darcy's law and steady flow to a well in an unconfined aquifer",
  "Dupuit's assumptions and the unconfined-well equation.",
  "T3, R7", [SH], "Cone-of-depression calculator; well yield from CGWB data", "CO3", "darcy dupuit unconfined")
s(5, "Steady flow to a well in a confined aquifer",
  "Thiem's equation; finding T and K from pumping-test drawdowns.",
  "T3, R7", [SH], "Thiem analysis of a pumping test in a spreadsheet", "CO3", "thiem confined pumping test")
s(5, "Types of wells and methods of construction",
  "Open, tube and bore wells; drilling methods; well development.",
  "T3, R7", ["Field/Video"], "Well log and construction-sequence exercise", "CO3", "tube well drilling")
s(5, "Rainwater harvesting: small-scale and small-tank systems",
  "Traditional and modern harvesting; tank systems of Karnataka.",
  "T3, R5", [HMS], "A minor-irrigation tank as an HMS reservoir: inflow, storage, spill", "CO5", "tank harvesting small scale")
s(5, "Urban rooftop rainwater harvesting and storage sizing",
  "Runoff coefficients, demand, and sizing storage by the mass-curve method.",
  "T3, R5", [SH, HMS], "Storage sizing in a spreadsheet; rooftop catchment in HMS", "CO5", "rooftop storage rippl")
s(5, "Methods of groundwater recharge",
  "Spreading, pits, shafts, injection wells; recharge estimation.",
  "T3, R5", [SH, HMS], "Recharge pit modelled as an HMS reservoir with seepage", "CO5", "recharge pit shaft")
s(5, "PBL showcase: catchment solutions",
  "Group presentations, peer review and reflection.",
  "—", ["Field/Video"], "Present the four-milestone catchment study", "CO1–CO5", "presentation peer review")


LAB_MAP = {
 "L01": (1, "Install HEC-HMS and explore a working model", "Install HEC-HMS, open the Castro Valley sample, run it, and map every component to the hydrologic cycle.", ["HEC-HMS"], ["S01","S02"], 40),
 "L02": (1, "Start the course project: basin model, subbasin and outlet", "Create your own HEC-HMS project and draw the 54.85 km² teaching catchment as one subbasin draining to an outlet.", ["HEC-HMS"], ["S03"], 30),
 "L03": (1, "Rain gauges in HEC-HMS: the Time-Series Data Manager", "Enter the recording gauge TG1 (30-minute storm) and the three non-recording gauges TG2–TG4.", ["HEC-HMS"], ["S03","S04"], 35),
 "L04": (1, "First simulation: meteorologic model, control specs and results", "Drive the subbasin with TG1, run the model and read the result graph and summary table.", ["HEC-HMS"], ["S03"], 35),
 "L05": (1, "Gage Weights: Thiessen vs arithmetic mean in HEC-HMS", "Type Thiessen and arithmetic weights into two meteorologic models and compare the runs.", ["HEC-HMS"], ["S05"], 35),
 "L06": (1, "Missing data inside HEC-HMS", "See what a blank cell does to a run, and run the model with a gap filled by the normal-ratio method.", ["HEC-HMS"], ["S06"], 30),
 "L07": (1, "Hyetographs, cumulative curves and exporting results", "Read hyetographs and mass curves from HEC-HMS, export time-series tables to a spreadsheet.", ["HEC-HMS","Spreadsheet"], ["S07"], 30),
 "L08": (1, "A design storm: the Frequency Storm method", "Turn IDF depths into 25- and 100-year design storms and compare their floods with the observed storm.", ["HEC-HMS"], ["S08"], 40),
 "L09": (1, "QGIS: Thiessen polygons from station data", "Load gauges and a catchment, build Voronoi polygons, clip, compute areas and weights, and print a map.", ["QGIS"], ["S05","S09"], 45),
 "L10": (1, "HEC-HMS GIS: delineate a catchment from a DEM", "Download and prepare a DEM, then let HEC-HMS fill sinks, find streams and delineate subbasins for your PBL site.", ["QGIS","HEC-HMS"], ["S09"], 60),
}
labs=[]
for lid,(u,t,g,sw,ss,mins) in LAB_MAP.items():
    labs.append(dict(id=lid, unit=u, title=t, goal=g, software=sw, sessions=ss, minutes=mins, file=f"labs/{lid}.md", enabled=True, release=""))
    for sid in ss:
        next(x for x in S if x["id"]==sid)["labs"].append(lid)
course = dict(code="CE633", short="Hydrology", title="Hydrology and Water Resources Engineering",
  instructor="Dr Shibu K. Mani", email="shibuk.mani@christuniversity.in", programme="BTech Civil Engineering", semester="Even semester 2026–27",
  classroom="", department="Department of Civil Engineering, CHRIST (Deemed to be University), Kengeri Campus")
units = [
 dict(n=1, roman="I", short="Precipitation", title="Introduction to Hydrology and Precipitation", co="CO1", hours=9,
      syllabus="Definition and importance of hydrology; hydrologic cycle. Precipitation: forms and types; Symons' and syphon rain gauges; optimum number of rain-gauge stations; consistency (double mass curve); mean rainfall (arithmetic, Thiessen, isohyetal); missing data (arithmetic, normal ratio, regression); presentation (moving average, mass curve, hyetograph, IDF curves); Thiessen polygon map from meteorological data."),
 dict(n=2, roman="II", short="Losses & runoff", title="Components of Precipitation (Losses and Runoff)", co="CO2", hours=9,
      syllabus="Evaporation (IS Class A pan, empirical formulae); infiltration (double-ring infiltrometer, Horton's equation, indices); runoff, catchment, water budget, rainfall-runoff regression; evapotranspiration (AET, PET, Penman, Blaney-Criddle); verification of losses with software; GIS rainfall-runoff model."),
 dict(n=3, roman="III", short="Hydrographs", title="Hydrographs", co="CO3", hours=9,
      syllabus="Hydrograph definition and components; unit hydrograph and its derivation from simple storm hydrographs; base-flow separation; S-curve and its uses."),
 dict(n=4, roman="IV", short="Streamflow & routing", title="Stream Flow Measurement and Flood Routing", co="CO4, CO5", hours=9,
      syllabus="Measurement of stage; discharge by area-velocity and slope-area methods; stage-discharge relation; streamflow with software. Hydrological flood routing: reservoir and channel routing; flood frequency and forecasting; extreme events."),
 dict(n=5, roman="V", short="Groundwater & RWH", title="Ground Water Hydrology and Rainwater Harvesting", co="CO3, CO5", hours=9,
      syllabus="Scope of groundwater hydrology; aquifer parameters; steady radial flow to wells in confined and unconfined aquifers; types of wells and construction. Rainwater harvesting: small-scale and small-tank, urban harvesting, groundwater recharge."),
]
pages = [
 dict(id="setup", ni="⚙", title="Software setup", hook="Install HEC-HMS and QGIS before the first lab.", file="pages/setup.md"),
 dict(id="pbl", ni="P", title="Project (PBL)", hook="One real catchment, four milestones, one driving question.", file="pages/pbl.md"),
 dict(id="assessment", ni="A", title="Assessment", hook="CIA components, AI-use log, data citation.", file="pages/assessment.md"),
 dict(id="references", ni="R", title="References", hook="Textbooks, software manuals, standards and data sources used in this portal.", file="pages/references.md"),
]
software = [
 dict(id="hms", ni="H", title="About HEC-HMS", when="FROM SESSION 2 · LABS L01–L08", hook="The rainfall–runoff model at the centre of the course: what it is, how a model is organised, what happens in a subbasin.", color="#2d6a4f", file="software/hms.md"),
 dict(id="qgis", ni="Q", title="About QGIS", when="SESSIONS 5, 9 · LABS L09–L10", hook="The GIS for gauges, polygons, DEMs and maps: vector vs raster, coordinate systems, the tools we use.", color="#5a3e8c", file="software/qgis.md"),
 dict(id="ras", ni="R", title="About HEC-RAS", when="UNIT IV", hook="River hydraulics: water levels, velocities and flood extents from discharge.", color="#8a4b12", file="software/ras.md"),
 dict(id="ssp", ni="S", title="About HEC-SSP", when="SESSION 35", hook="Flood-frequency analysis (Bulletin 17C, log-Pearson III) with confidence limits.", color="#1a5f7a", file="software/ssp.md"),
]
links = [
 ["HEC-HMS download","https://www.hec.usace.army.mil/software/hec-hms/downloads.aspx","#57cc99"],
 ["HEC-RAS download","https://www.hec.usace.army.mil/software/hec-ras/download.aspx","#e0a46a"],
 ["QGIS","https://qgis.org/download/","#b9a2e6"],
 ["India-WRIS","https://indiawris.gov.in/","#4cc9f0"],
 ["IMD Pune data","https://www.imdpune.gov.in/","#c8973a"],
 ["KSNDMC","https://www.ksndmc.org/","#c8973a"],
 ["Bhuvan (DEM)","https://bhuvan.nrsc.gov.in/","#f4a261"],
 ["GitHub repo","https://github.com/PradhanArpan/hydrology","#57cc99"],
 ["Google Classroom","https://classroom.google.com","#4cc9f0"],
]
json.dump(dict(course=course, units=units, pages=pages, software=software, links=links, labs=labs, sessions=S), open(OUT,"w"), indent=1, ensure_ascii=False)
print(len(S), len(labs))
