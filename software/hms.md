## What HEC-HMS is

The **Hydrologic Modeling System (HEC-HMS)** simulates the complete rainfall–runoff process of a catchment: rain falls, part of it is lost, the rest becomes runoff, the runoff is routed down rivers and through reservoirs to an outlet. It is developed by the **Hydrologic Engineering Center (HEC)** of the US Army Corps of Engineers, is free, runs on Windows, macOS and Linux, and is one of the most widely used hydrologic models in the world — including by Indian agencies and consultants for flood studies, culvert and bridge design, reservoir operation and urban drainage.

HEC-HMS replaced the older **HEC-1** program (1968 onwards). Version 4.x adds GIS tools that delineate catchments from a DEM, gridded rainfall, continuous simulation with soil-moisture accounting, and uncertainty analysis.

> [!note] Why we use it in CE633
> Almost every topic in Units I–III is a *method* inside HEC-HMS: areal rainfall (Session 5) is a precipitation method, infiltration indices (Session 13) are loss methods, unit hydrographs (Sessions 23–27) are transform methods, Muskingum (Session 34) is a routing method. Building the model is a way of checking that you understand each method.

## How a model is organised

Every HEC-HMS simulation combines **three components** — think of them as *where*, *what weather* and *when*:

| Component | Answers | Contains |
| --- | --- | --- |
| **Basin model** | *Where?* — the physical catchment | Subbasins, reaches, junctions, reservoirs, diversions, sources, sinks, and the methods chosen for each |
| **Meteorologic model** | *What weather?* | Precipitation method (gauges, Thiessen weights, design storms), evapotranspiration, snowmelt |
| **Control specifications** | *When?* | Start date/time, end date/time, computation time step |

Data that several components share — rain-gauge records, observed flows, storage–outflow tables, DEMs — live in the **data managers** (time-series, paired data, terrain).

A **simulation run** = one basin model + one meteorologic model + one control specification. Changing just one of them and re-running is how you test scenarios: a design storm instead of an observed storm, a new land use, a detention pond.

::widget[hmselements]

## What happens inside a subbasin

For each time step HEC-HMS computes, in order:

1. **Precipitation** on the subbasin (from the meteorologic model).
2. **Canopy** interception and **surface** (depression) storage — optional.
3. **Loss** — infiltration taken from what reaches the ground. What remains is **excess precipitation**.
4. **Transform** — excess precipitation is converted to a **direct runoff hydrograph** at the subbasin outlet (unit hydrograph or kinematic wave).
5. **Baseflow** — groundwater contribution added to direct runoff.

Reaches then route the hydrograph downstream; junctions add flows together; reservoirs store and release.

| Process | Methods available (selection) | Taught in |
| --- | --- | --- |
| Precipitation | Specified hyetograph, gage weights, inverse distance, frequency storm, SCS storm, gridded | Sessions 3–8 |
| Loss | Initial and constant, deficit and constant, SCS curve number, Green and Ampt, soil-moisture accounting | Sessions 12–18 |
| Transform | User-specified unit hydrograph, SCS unit hydrograph, Snyder, Clark, kinematic wave | Sessions 23–27 |
| Baseflow | Constant monthly, recession, linear reservoir | Session 21 |
| Routing | Lag, Muskingum, Muskingum–Cunge, modified Puls, kinematic wave | Sessions 32–34 |
| Evapotranspiration | Monthly average, Hargreaves, Priestley–Taylor, Penman–Monteith | Sessions 10–15 |

## The window

::widget[hmstour]

## Typical workflow

1. Create a project (metric units) — Lab L02.
2. Build the basin model: draw elements by hand or delineate them from a DEM — L02, L10.
3. Enter time-series data (gauges, observed flow) — L03.
4. Create the meteorologic model and control specifications — L04.
5. Create a simulation run, compute, read the Message Log — L04.
6. Inspect results: graphs, summary tables, time-series tables — L04, L07.
7. Compare with observations; adjust parameters (calibration) — Units II–III.
8. Run scenarios: design storms, land-use change, storage — L08 and later.

## Strengths and limits

**Strengths:** free and well documented; covers the full rainfall–runoff chain; accepted in professional practice; transparent methods that match textbook hydrology.

**Limits:** it is a *hydrologic* model — it routes hydrographs but does not compute water levels, velocities or inundation maps (that is HEC-RAS); lumped subbasins average out spatial detail; results are only as good as the rainfall and parameters you give it. **Always check a model result against a hand calculation.**

## Learn more

- HEC-HMS **User's Manual** and **Technical Reference Manual** — online documentation on the HEC website (see [References](#/page/references)).
- Sample projects installed with the program (*Help › Install Sample Projects*) — Castro Valley and Tenk are good starting points.
