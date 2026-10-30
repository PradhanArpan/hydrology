"""
Enhance Unit 1 (S01 to S09):
- Add 'Key ideas' callout box right after <!--tab:Theory-->
- Add 'Session X recap' (3-5 items) right before <!--tab:In class-->
- Add 1-2 verified check-answer exercises in each session
"""
import re, json

ENHANCEMENTS = {
    "S01": {
        "key_ideas": """> [!note] Key ideas
> - **Hydrology** studies the occurrence, circulation, distribution, and movement of water on earth, below the surface, and in the atmosphere.
> - The **hydrologic cycle** is a globally closed system driven by solar energy and gravity, but every catchment functions as an open system.
> - The governing balance equation is the **water budget (continuity)**: $\\text{Inflow} - \\text{Outflow} = \\Delta \\text{Storage}$.
> - Fresh water constitutes only $\\approx 2.8\\%$ of global water, with over $99\\%$ locked in polar ice caps or deep aquifers.
""",
        "recap": """### Session 1 recap
1. **Engineering hydrology:** Determines design floods, reservoir capacities, spillway discharges, and drought management strategies.
2. **Hydrologic cycle:** Follows water through evaporation, transpiration, condensation, precipitation, infiltration, percolation, groundwater, and streamflow.
3. **Catchment divide:** The topographic ridgeline defines the surface watershed draining toward a single common outlet.
4. **Annual water balance:** Over an annual period with $\\Delta S \\approx 0$, precipitation balances runoff and evapotranspiration ($P = R + ET$).
5. **Standard metric conversions:** $1\\text{ mm}$ of rainfall depth over $1\\text{ km}^2$ represents exactly $1{,}000\\text{ m}^3$ of water volume.
""",
        "new_check": {
            "q": "A catchment of 180 km² receives 120 mm of rain in 12 h. The runoff volume recorded at the outlet is 5.4×10⁶ m³. Find the runoff coefficient Cr.",
            "answer": 0.25,
            "tol": 0.02,
            "unit": "",
            "hint": "Rain volume = 0.12 m × 180×10⁶ m² = 2.16×10⁷ m³. Runoff coefficient = Runoff / Rain.",
            "solution": "Cr = (5.4×10⁶) / (21.6×10⁶) = 0.25."
        }
    },
    "S02": {
        "key_ideas": """> [!note] Key ideas
> - **Precipitation** is the primary input to hydrologic models; forms include rain, drizzle, snow, sleet, hail, and glaze.
> - Condensation requires atmospheric moisture, condensation nuclei, cooling by lifting, and growth into raindrops.
> - Four primary lifting mechanisms: **frontal**, **cyclonic**, **convective** (local heating), and **orographic** (mountain barriers).
> - India receives $\\approx 75\\%$ of its annual rainfall during the **South-West Monsoon** (June–September), concentrated in heavy spells.
""",
        "recap": """### Session 2 recap
1. **Forms vs Types:** Forms describe the physical state of water reaching the ground (rain vs snow vs hail); types describe the atmospheric lifting process (convective vs orographic).
2. **Convective storms:** Localized, short-duration, high-intensity showers causing urban flash flooding (e.g. Bengaluru pre-monsoon storms).
3. **Orographic effect:** Moist air cools as it ascends the windward slope, leaving a dry rain-shadow on the leeward plateau.
4. **Temporal concentration:** Indian rainfall is intensely seasonal; large volumes fall over relatively few days, dictating the need for surface reservoirs and artificial recharge.
5. **Model representation:** In HEC-HMS, the **meteorologic model** converts gauge depths and hyetographs into subbasin rainfall.
""",
        "new_check": {
            "q": "A convective storm cell of 8 km × 6 km drops an average rainfall of 45 mm in 40 minutes over an urban area. Compute the total water volume dropped.",
            "answer": 2160000,
            "tol": 0.02,
            "unit": "m³",
            "hint": "Area = 48 km² = 4.8×10⁷ m². Volume = depth in metres × area in m².",
            "solution": "0.045 m × 48×10⁶ m² = 2,160,000 m³."
        }
    },
    "S03": {
        "key_ideas": """> [!note] Key ideas
> - Rainfall depth is measured with **non-recording gauges** (Symons' gauge, read daily at 08:30 IST) and **recording gauges** (float/syphon, tipping-bucket, weighing).
> - Recording gauges record instantaneous intensity and cumulative mass curves continuously.
> - The optimum number of rain-gauge stations is determined by spatial rainfall variability: $N = (C_v / \\epsilon)^2$.
> - WMO and IS:4987 specify minimum network density standards for plains, hilly terrain, and arid zones.
""",
        "recap": """### Session 3 recap
1. **Symons' gauge:** Standard non-recording collector with a 127 mm diameter funnel rim mounted 305 mm above ground to prevent splash.
2. **Recording gauges:** Natural syphon (float) gauges produce a continuous trace on a rotating drum; tipping-bucket gauges record pulses electronically (0.2 mm per tip).
3. **Optimum network:** Gauges are added until the coefficient of variation ($C_v$) of annual rain satisfies the allowable percentage error $\\epsilon$.
4. **IS:4987 guidelines:** 1 station per 520 km² in plains; 1 station per 260–390 km² in undulating/hilly regions; 1 station per 1,000 km² in arid zones.
5. **HMS Time-Series Data:** Gages are created in the Time-Series Data Manager before attaching them to meteorologic models.
""",
        "new_check": {
            "q": "A catchment has 6 existing gauges with annual precipitation: 920, 1150, 1340, 880, 1060, 1220 mm. For an allowable estimation error of 8%, calculate the optimum number of stations N.",
            "answer": 5,
            "tol": 0.05,
            "unit": "stations",
            "hint": "Mean P = 1095 mm, std dev = 177.1 mm, Cv = 16.17%. N = (Cv / 8)² = (16.17/8)² ≈ 4.09. Round up to the next integer = 5.",
            "solution": "Mean = 1095, s = 177.1, Cv = 16.17%. N = (16.17/8)² = 4.09 -> 5 stations."
        }
    },
    "S04": {
        "key_ideas": """> [!note] Key ideas
> - Long precipitation time-series can suffer from **inconsistency** caused by gauge relocation, ecosystem/shrub growth, or changes in instrumentation.
> - The **Double Mass Curve (DMC)** tests consistency by plotting cumulative rainfall at the test station against the cumulative average of surrounding reliable index stations.
> - A distinct change in slope identifies an inconsistency and the year it occurred.
> - Records are adjusted using the slope ratio: $P_{cx} = P_x \\times (S_a / S_b)$, where $S_a$ is the slope before the change and $S_b$ is the slope after.
""",
        "recap": """### Session 4 recap
1. **Stationarity & consistency:** Hydrologic statistics assume a station's record has not drifted due to external non-climatic influences.
2. **Index group:** Choose 5 to 10 surrounding stations whose records are known to be consistent over the same time horizon.
3. **Slope inflection:** A break in slope indicates a shift in catch efficiency (e.g. tree growth reduces wind speed, increasing catch).
4. **Correction direction:** Historical records are corrected to reflect present-day environmental conditions ($S_a / S_b$).
5. **Quality control in HMS:** HEC-HMS requires consistent, calibrated precipitation records to produce dependable runoff hydrographs.
""",
        "new_check": {
            "q": "Station X changed location in 2015. DMC slope before 2015 was 0.92; after 2015 it was 1.15. The recorded rainfall in 2018 was 1,180 mm. Find the corrected rainfall.",
            "answer": 944,
            "tol": 0.02,
            "unit": "mm",
            "hint": "P_cx = P_x × (Sa / Sb) = 1180 × (0.92 / 1.15).",
            "solution": "1180 × (0.92 / 1.15) = 1180 × 0.8 = 944 mm."
        }
    },
    "S05": {
        "key_ideas": """> [!note] Key ideas
> - Point rainfall from gauges must be converted into **mean areal precipitation** over the watershed area.
> - **Arithmetic mean:** Simple average $\\bar{P} = \\frac{1}{n} \\sum P_i$; valid only when gauges are uniformly distributed across flat terrain.
> - **Thiessen polygon method:** Area-weighted average $\\bar{P} = \\sum \\frac{A_i P_i}{A}$; assigns tributary areas via perpendicular bisectors.
> - **Isohyetal method:** Contours of equal rainfall (isohyets); integrates topography and elevation gradients; most accurate in mountainous watersheds.
""",
        "recap": """### Session 5 recap
1. **Method comparison:** Arithmetic ignores spatial spacing; Thiessen accounts for uneven gauge placement; Isohyetal accounts for orographic rain gradients.
2. **Thiessen weights:** Polygon weights remain fixed as long as the gauge network is unchanged, making it efficient for automated models.
3. **Isohyetal calculation:** Areal depth $= \\sum A_{1-2} \\times \\frac{P_1 + P_2}{2} / \\sum A_{1-2}$.
4. **Gage Weights in HEC-HMS:** In Lab L05, subbasin rainfall is assigned using Thiessen weights calculated in GIS.
5. **Errors:** Missing a high-elevation gauge in mountainous terrain leads to severe underestimation of watershed runoff volume.
""",
        "new_check": {
            "q": "A 200 km² catchment has 4 Thiessen zones: A1=40 km² (85 mm), A2=65 km² (110 mm), A3=55 km² (130 mm), A4=40 km² (75 mm). Compute the Thiessen mean areal rainfall.",
            "answer": 103.5,
            "tol": 0.02,
            "unit": "mm",
            "hint": "Sum(Ai * Pi) / Total Area = (40*85 + 65*110 + 55*130 + 40*75) / 200.",
            "solution": "(3400 + 7150 + 7150 + 3000) / 200 = 20700 / 200 = 103.5 mm."
        }
    },
    "S06": {
        "key_ideas": """> [!note] Key ideas
> - Missing precipitation records (due to instrument jam, power loss, observer absence) must be estimated before hydrological modeling.
> - **Arithmetic average rule:** Applicable if normal annual precipitation at index stations is within $\\pm 10\\%$ of the target station: $P_x = \\frac{1}{m} \\sum P_i$.
> - **Normal ratio method:** Used when index station normals differ by more than $10\\%$: $P_x = \\frac{N_x}{m} \\sum \\frac{P_i}{N_i}$.
> - Inverse distance weighting (IDW) weights nearby stations by $1 / d^2$.
""",
        "recap": """### Session 6 recap
1. **Rule of thumb:** If any index station's normal annual precipitation differs from $N_x$ by $> 10\\%$, the arithmetic mean is biased — use the Normal Ratio method.
2. **Normal ratio formula:** Scales each index station's storm depth by the ratio of long-term annual means ($N_x / N_i$).
3. **Number of index stations:** Typically 3 to 5 neighbouring stations located uniformly around the missing gauge.
4. **HEC-HMS gap handling:** Missing entries can crash simulation runs or generate zero-rainfall artifacts; gaps must be filled beforehand.
5. **Double mass curve verification:** If an entire year is missing, estimates can also be cross-checked against the DMC slope.
""",
        "new_check": {
            "q": "Station X (normal annual 800 mm) missed a storm. Stations A, B, C had storm rain of 64, 78, 52 mm and normal annuals of 960, 1040, 720 mm. Compute Px by normal ratio.",
            "answer": 57.0,
            "tol": 0.02,
            "unit": "mm",
            "hint": "Px = (800/3) * (64/960 + 78/1040 + 52/720).",
            "solution": "(800/3) * (0.0667 + 0.0750 + 0.0722) = (800/3) * 0.21389 = 57.04 mm."
        }
    },
    "S07": {
        "key_ideas": """> [!note] Key ideas
> - **Mass curve:** Plot of cumulative precipitation against time; the slope represents instantaneous rainfall intensity.
> - **Hyetograph:** Bar chart of rainfall intensity vs time interval $\\Delta t$; the fundamental input driving runoff models.
> - **Moving averages:** Smooths high-frequency annual fluctuations to reveal underlying multi-year climatic cycles and dry/wet trends.
> - Rainfall intensity ($mm/h$) is computed directly from mass curve increments: $i = \\Delta P / \\Delta t$.
""",
        "recap": """### Session 7 recap
1. **Mass curve slope:** A steep slope denotes a high-intensity cloudburst; a flat horizontal line represents dry spells without rain.
2. **Hyetograph derivation:** Discrete time derivative of the mass curve over constant sampling intervals (e.g. 15 min, 1 h).
3. **Moving average window:** A 3-year or 5-year moving average removes random noise without obscuring long-term decadal trends.
4. **HEC-HMS hyetograph export:** Results graphs plot hyetographs inverted at the top alongside the direct runoff hydrograph below.
5. **Design storms:** Hyetograph shape significantly influences peak flood discharge, time to peak, and drainage sizing.
""",
        "new_check": {
            "q": "From a storm mass curve, the cumulative rainfall at t = 2 h is 32 mm, and at t = 3 h is 74 mm. What is the average rainfall intensity during this hour?",
            "answer": 42.0,
            "tol": 0.02,
            "unit": "mm/h",
            "hint": "Intensity = Delta P / Delta t = (74 - 32) / (3 - 2).",
            "solution": "(74 - 32) / 1 = 42 mm/h."
        }
    },
    "S08": {
        "key_ideas": """> [!note] Key ideas
> - **Return period (T):** Average recurrence interval between events equalling or exceeding a given magnitude.
> - **Plotting position:** Weibull formula $T = (N+1)/m$ and exceedance probability $P = 1/T$.
> - **Hydrologic risk:** Probability of experiencing at least one exceedance event in an $n$-year design lifetime: $R_k = 1 - (1 - 1/T)^n$.
> - **IDF curves:** Intensity decreases with duration and increases with return period: $i = K T^a / (D + b)^c$.
> - **DAD curves:** For a given duration, average maximum rainfall depth decreases as catchment area increases.
""",
        "recap": """### Session 8 recap
1. **Weibull plotting:** Rank annual maxima in descending order ($m=1$ for largest); $P = m / (N+1)$.
2. **Risk vs Return Period:** Designing for a 25-year flood over a 25-year service life carries a $64\\%$ risk of exceedance ($1 - (1 - 1/25)^{25} \\approx 0.64$).
3. **IDF characteristics:** Short bursts (15–30 min) produce very high intensities; long storms (24 h) produce large total volumes at lower intensities.
4. **Frequency Storm in HMS:** Converts IDF depths into a balanced design hyetograph with peak intensity centered.
5. **DAD curves:** Used in large reservoir and spillway design to scale point storm depths to regional basin areas.
""",
        "new_check": {
            "q": "A temporary diversion cofferdam is designed for a 25-year flood over a 3-year construction period. Calculate the hydrologic risk (probability of exceedance).",
            "answer": 0.115,
            "tol": 0.03,
            "unit": "",
            "hint": "Risk = 1 - (1 - 1/T)^n = 1 - (1 - 1/25)^3 = 1 - (0.96)^3.",
            "solution": "1 - 0.96^3 = 1 - 0.8847 = 0.1153 (11.5%)."
        }
    },
    "S09": {
        "key_ideas": """> [!note] Key ideas
> - **GIS in hydrology:** Integrates spatial raster DEMs and vector gauge networks to automate hydrologic parameter extraction.
> - **Coordinate Reference Systems (CRS):** A projected CRS (e.g. UTM) with units in metres is mandatory for accurate area, slope, and distance calculations.
> - **DEM preprocessing:** Fill sinks / depressions to ensure continuous flow paths to the outlet.
> - **D8 flow routing:** Each cell directs water to the steepest downhill neighbour among 8 adjacent cells.
> - **Flow accumulation:** Counts upstream tributary cells; thresholding flow accumulation defines stream networks and basin boundaries.
""",
        "recap": """### Session 9 recap
1. **Vector vs Raster:** Gauges and boundaries are vector features; DEMs and slope maps are raster grids.
2. **Voronoi / Thiessen in QGIS:** Built via *Vector › Geometry Tools › Voronoi Polygons*, then clipped to the catchment polygon.
3. **Hydrologic conditioning:** Real DEMs have sink anomalies where flow gets trapped; sink filling ensures hydrologic connectivity.
4. **Catchment delineation:** Pinpointing an outlet cell on a stream pixel delineates all upstream contributing terrain.
5. **HEC-HMS GIS integration:** Preprocessed subbasins and stream reaches in QGIS can be directly imported into HEC-HMS basin models.
""",
        "new_check": {
            "q": "A 30 m × 30 m DEM has an outlet with flow accumulation of 65,400 cells. What is the delineated catchment area in square kilometres?",
            "answer": 58.86,
            "tol": 0.02,
            "unit": "km²",
            "hint": "Area = 65400 * (30 * 30) m² / 1,000,000.",
            "solution": "65400 * 900 / 1e6 = 58.86 km²."
        }
    }
}

for sid, data in ENHANCEMENTS.items():
    fpath = f"sessions/{sid}.md"
    with open(fpath, "r", encoding="utf-8") as f:
        content = f.read()

    # 1. Add Key ideas if not present
    if "> [!note] Key ideas" not in content:
        key_block = data["key_ideas"]
        content = re.sub(
            r"(<!--\s*tab:Theory\s*-->\s*\n\s*)",
            lambda m: m.group(1) + key_block + "\n",
            content,
            count=1
        )

    # 2. Add Recap if not present
    recap_pat = re.compile(r"###\s*Session\s*\d+\s*recap", re.IGNORECASE)
    if not recap_pat.search(content):
        recap_block = data["recap"]
        # Insert right before <!--tab:In class-->
        content = re.sub(
            r"(\n\s*<!--\s*tab:In class\s*-->)",
            lambda m: "\n" + recap_block + m.group(1),
            content,
            count=1
        )

    # 3. Add new check question if present
    chk_m = re.search(r"```check\s*\n(.*?)\n```", content, re.DOTALL)
    if chk_m:
        raw_json = chk_m.group(1).strip()
        try:
            items = json.loads(raw_json)
            # check if new_check question already present
            existing_qs = [it.get("q", "") for it in items]
            if data["new_check"]["q"] not in existing_qs:
                items.append(data["new_check"])
                new_json = json.dumps(items, indent=1)
                content = content[:chk_m.start()] + "```check\n" + new_json + "\n```" + content[chk_m.end():]
        except Exception as e:
            print(f"Error parsing check in {sid}: {e}")

    with open(fpath, "w", encoding="utf-8") as f:
        f.write(content)

print("Unit 1 sessions S01-S09 enhanced successfully!")
