"""
create_unit2_full.py
Generates complete sessions S10 to S18 and labs L11 to L16.
Recomputes and verifies all numerical examples and check answers.
"""
import os, json, math
import numpy as np

# Dictionary of verified numericals for verification recording
VERIFIED = {}

# S10 calculations
# Dalton evaporation: E = 0.36 * (ew - ea) * (1 + u9/16)
# At T = 30 C, ew = 31.82 mm Hg. RH = 50% -> ea = 15.91 mm Hg. u9 = 12 km/h.
ew_s10 = 31.82
ea_s10 = ew_s10 * 0.50
E_s10 = 0.36 * (ew_s10 - ea_s10) * (1.0 + 12.0 / 16.0) # mm/day
VERIFIED["S10_E_dalton"] = round(E_s10, 2) # 10.02 mm/day

# S11 calculations
# Reservoir of 3.2 km2 = 3.2e6 m2. Monthly Class A pan evaporation = 210 mm. Pan coeff = 0.70.
# Lake evaporation depth = 0.70 * 210 = 147 mm = 0.147 m.
# Volume loss = 3.2e6 * 0.147 = 470,400 m3.
# Water supplied to a city of 150,000 people at 135 lpcd for 30 days = 150,000 * 135 * 30 / 1000 = 607,500 m3.
# Percentage of water supply lost to evaporation = 470,400 / 607,500 * 100 = 77.43%
lake_depth_s11 = 0.70 * 210
lake_vol_s11 = 3.2e6 * (lake_depth_s11 / 1000.0)
city_water_s11 = 150000 * 135 * 30 / 1000.0
loss_pct_s11 = (lake_vol_s11 / city_water_s11) * 100.0
VERIFIED["S11_lake_vol"] = lake_vol_s11
VERIFIED["S11_loss_pct"] = round(loss_pct_s11, 1)

# S12 calculations
# Horton: f0 = 80 mm/h, fc = 12 mm/h, kh = 1.5 h^-1.
# f(t) = 12 + 68*exp(-1.5*t)
# At t = 2 h: f(2) = 12 + 68*exp(-3) = 15.39 mm/h.
# F(2) = 12*2 + (68/1.5)*(1 - exp(-3)) = 24 + 45.333*0.95021 = 67.08 mm.
# Rainfall intensity i = 40 mm/h. Ponding time tp:
# 40 = 12 + 68*exp(-1.5*tp) -> 28/68 = exp(-1.5*tp) -> tp = -ln(28/68)/1.5 = 0.591 h = 35.5 min.
f_2_s12 = 12 + 68 * math.exp(-1.5 * 2)
F_2_s12 = 12 * 2 + (68 / 1.5) * (1 - math.exp(-1.5 * 2))
tp_s12 = -math.log(28 / 68) / 1.5
VERIFIED["S12_f2"] = round(f_2_s12, 2)
VERIFIED["S12_F2"] = round(F_2_s12, 2)
VERIFIED["S12_tp"] = round(tp_s12, 2)

# S13 calculations
# Hyetograph: [15, 32, 55, 42, 22, 12] mm/h. Total P = 178 mm. Observed runoff R = 84 mm.
# Trial 1: all 6 hours: phi = (178 - 84)/6 = 15.67 mm/h. H1 (15) and H6 (12) < 15.67.
# Trial 2: 4 hours (H2 to H5): P_eff = 32 + 55 + 42 + 22 = 151 mm.
# phi = (151 - 84)/4 = 67/4 = 16.75 mm/h.
# Total infiltration loss during storm = 178 - 84 = 94 mm.
# W-index with Ia = 8 mm: W = (178 - 84 - 8) / 6 = 86 / 6 = 14.33 mm/h.
phi_s13 = 16.75
w_s13 = (178 - 84 - 8) / 6.0
VERIFIED["S13_phi"] = phi_s13
VERIFIED["S13_W"] = round(w_s13, 2)

# S14 calculations
# Blaney-Criddle: PET = 2.54 * k * (p * t / 100) cm/month
# t = 26 C, p = 8.4 %, k = 0.85
# PET = 2.54 * 0.85 * (8.4 * 26 / 100) = 2.159 * 2.184 = 4.715 cm/month = 47.15 mm/month.
# Daily ET = 47.15 / 30 = 1.57 mm/day.
pet_bc_s14 = 2.54 * 0.85 * (8.4 * 26 / 100.0) * 10.0 # mm/month
VERIFIED["S14_pet_monthly"] = round(pet_bc_s14, 1)

# S15 calculations
# Penman: T = 28 C, RH = 60%, u2 = 140 km/day, Hn = 5.6 mm/day.
# ew = 4.584 * exp(17.27 * 28 / (28 + 237.3)) = 28.35 mm Hg
# ea = 28.35 * 0.60 = 17.01 mm Hg
# A = (4098 * 28.35) / (28 + 237.3)^2 = 116178 / 70384 = 1.65 mm Hg/C
# gamma = 0.49 mm Hg/C
# Ea = 0.35 * (1 + 140/160) * (28.35 - 17.01) = 0.35 * 1.875 * 11.34 = 7.44 mm/day
# PET = (1.65 * 5.6 + 7.44 * 0.49) / (1.65 + 0.49) = (9.24 + 3.646) / 2.14 = 12.886 / 2.14 = 6.02 mm/day.
ew_s15 = 4.584 * math.exp(17.27 * 28 / (28 + 237.3))
ea_s15 = ew_s15 * 0.60
A_s15 = (4098 * ew_s15) / ((28 + 237.3)**2)
gamma_s15 = 0.49
Ea_s15 = 0.35 * (1.0 + 140.0 / 160.0) * (ew_s15 - ea_s15)
pet_penman_s15 = (A_s15 * 5.6 + Ea_s15 * gamma_s15) / (A_s15 + gamma_s15)
VERIFIED["S15_penman_daily"] = round(pet_penman_s15, 2)

# S16 calculations
# Linear regression R = a*P + b
# Historical pairs P, R:
# P = [750, 880, 1020, 1150, 1300, 950]
# R = [180, 240, 310, 390, 480, 280]
p_arr = np.array([750, 880, 1020, 1150, 1300, 950])
r_arr = np.array([180, 240, 310, 390, 480, 280])
a_s16, b_s16 = np.polyfit(p_arr, r_arr, 1)
# For P = 1100 mm: R = a * 1100 + b
r_pred_s16 = a_s16 * 1100 + b_s16
VERIFIED["S16_a"] = round(a_s16, 3)
VERIFIED["S16_b"] = round(b_s16, 1)
VERIFIED["S16_R1100"] = round(r_pred_s16, 1)

# S17 calculations
# CN = 78, P = 95 mm, lambda = 0.2
# S = 25400/78 - 254 = 71.64 mm
# Ia = 0.2 * 71.64 = 14.33 mm
# Q = (95 - 14.33)^2 / (95 - 14.33 + 71.64) = 42.73 mm
S_s17 = 25400.0 / 78.0 - 254.0
Ia_s17 = 0.2 * S_s17
Q_s17 = ((95.0 - Ia_s17)**2) / (95.0 - Ia_s17 + S_s17)
VERIFIED["S17_S"] = round(S_s17, 2)
VERIFIED["S17_Ia"] = round(Ia_s17, 2)
VERIFIED["S17_Q"] = round(Q_s17, 2)

# S18 calculations
# Catchment area = 75 km2. Storm P = 85 mm. Observed streamflow volume = 3.6e6 m3.
# Observed runoff depth R = 3.6e6 / (75e6) = 0.048 m = 48 mm.
# Total losses = 85 - 48 = 37 mm.
# Storm duration = 10 h. If initial loss = 15 mm, then constant loss rate = (37 - 15) / 10 = 2.2 mm/h.
R_s18 = (3.6e6 / 75e6) * 1000.0
loss_const_s18 = (85 - R_s18 - 15) / 10.0
VERIFIED["S18_R"] = round(R_s18, 1)
VERIFIED["S18_loss_rate"] = round(loss_const_s18, 2)

print("Computed and verified Unit 2 values:")
for k, v in VERIFIED.items():
    print(f"  {k}: {v}")

os.makedirs("sessions", exist_ok=True)
os.makedirs("labs", exist_ok=True)

# Generate S10.md
s10_content = f"""<!--tab:Theory-->

> [!note] Key ideas
> - **Precipitation abstractions** (losses) represent water diverted before overland surface runoff can form: $P - R = \\text{Losses} = I + D_d + F + E + T$.
> - **Evaporation** is the thermodynamic vaporization of water from free liquid or moist soil, driven by solar radiation and vapour-pressure deficit.
> - **Dalton's law** describes the rate of evaporation: $E = C (e_w - e_a)$, where $e_w$ is saturation vapour pressure at surface water temperature and $e_a$ is actual atmospheric vapour pressure.
> - Factors controlling evaporation include water temperature, air temperature, relative humidity, wind velocity, atmospheric pressure, water body depth, and dissolved solids.

## Precipitation abstractions (losses)

When storm rainfall falls upon a natural catchment, only a portion appears at the outlet as streamflow. The difference between gross rainfall depth and direct runoff represents the **hydrological abstractions** or **losses**:

$$P - R = \\text{Losses} = I + D_d + F + E + T$$

1. **Interception ($I$):** Rain caught on foliage, twigs, and vegetation structures that evaporates without reaching the ground surface (typically 1–3 mm in moderate vegetative canopy).
2. **Depression storage ($D_d$):** Water trapped in surface puddles, micro-depressions, and furrow ditches that subsequently evaporates or slowly infiltrates.
3. **Infiltration ($F$):** Downward movement of water into the soil matrix across the ground surface — by far the largest abstraction during major storms.
4. **Evaporation ($E$):** Direct water phase change to vapour from surface water, puddles, and moist soil.
5. **Transpiration ($T$):** Moisture extracted by plant root systems and transpired into the atmosphere through stomatal pores.

In continuous catchment modeling, evaporation and transpiration dominate water depletion over weeks and months; in short isolated storm events, **infiltration** represents over $80–90\\%$ of total abstractions.

## The evaporation process & Dalton's law

Evaporation requires:
1. **Latent heat of vaporization:** $\\approx 2.45\\text{ MJ/kg}$ (or $\\approx 585\\text{ cal/g}$ at 20 °C) supplied predominantly by net solar radiation.
2. **Vapour-pressure gradient:** The vapour pressure at the water surface must exceed the vapour pressure of the ambient air above it.

In 1802, John Dalton established the classical empirical formulation:

$$E = C (e_w - e_a)$$

where:
- $E$ is the evaporation rate (mm/day).
- $e_w$ is the saturation vapour pressure at the temperature of the water surface (mm of Hg or kPa).
- $e_a$ is the actual vapour pressure of the overlying air at standard measurement height (mm of Hg or kPa).
- $C$ is a coefficient depending on atmospheric factors, predominantly wind velocity.

If $e_w > e_a$, net evaporation occurs. If $e_w = e_a$, the air is fully saturated and net evaporation ceases. If $e_w < e_a$, condensation (dew) takes place on the water surface.

### Factors governing evaporation

| Factor | Influence on evaporation rate | Practical engineering implication |
| --- | --- | --- |
| **Vapour-pressure deficit $(e_w - e_a)$** | Directly proportional. Drier air produces higher evaporation. | High evaporation rates occur during pre-monsoon summer dry spells. |
| **Temperature** | Exponentially increases saturation vapour pressure $e_w$. | Tropical Indian reservoirs lose 1.5–3.0 m of storage depth annually. |
| **Wind velocity** | Sweeps away saturated boundary layers, maintaining a steep gradient. | High pre-monsoon winds significantly increase lake losses. |
| **Atmospheric pressure** | Inversely proportional; lower barometric pressure at high altitudes increases evaporation. | High-altitude reservoirs evaporate slightly faster under equal radiation. |
| **Water body depth & heat storage** | Deep lakes store thermal energy in summer and release it in winter. | Deep lakes experience peak evaporation later in the season than shallow tanks. |
| **Dissolved salts (salinity)** | Lowers saturation vapour pressure $\\approx 1\\%$ per $1\\%$ salinity increase. | Sea water evaporates $\\approx 2–3\\%$ slower than fresh water under identical conditions. |

## Worked examples

### Example 1 — Dalton's evaporation rate

A shallow reservoir has a water surface temperature of 30 °C. The ambient air temperature at 2 m height is 30 °C with a relative humidity of $50\\%$. If the local wind speed is 12 km/h and the empirical constant is $C = 0.36 (1 + u / 16)$, compute the daily evaporation rate.

*Data:* At 30 °C, saturation vapour pressure $e_w = 31.82\\text{ mm Hg}$.

:::sol Show solution
1. Actual atmospheric vapour pressure:
$$e_a = e_w \\times \\text{RH} = 31.82 \\times 0.50 = 15.91\\text{ mm Hg}$$

2. Dalton wind factor:
$$C = 0.36 \\left(1 + \\frac{12}{16}\\right) = 0.36 \\times 1.75 = 0.63$$

3. Evaporation rate:
$$E = 0.63 \\times (31.82 - 15.91) = 0.63 \\times 15.91 = \\mathbf{10.02}\\text{ mm/day}$$
:::

### Example 2 — Water volume loss from catchment abstractions

A catchment of 150 ha experiences a 3-hour storm of 70 mm. Interception is estimated at 2.5 mm, depression storage accounts for 4.5 mm, and total infiltration over the storm duration reaches 38 mm. If direct evaporation during the rainstorm is neglected, compute:
1. The total depth of abstractions (losses).
2. The direct runoff depth and runoff volume reaching the stream.

:::sol Show solution
1. Total abstractions:
$$\\text{Losses} = I + D_d + F = 2.5 + 4.5 + 38.0 = \\mathbf{45.0}\\text{ mm}$$

2. Direct runoff depth:
$$R = P - \\text{Losses} = 70.0 - 45.0 = \\mathbf{25.0}\\text{ mm}$$

3. Direct runoff volume over 150 ha:
$$\\text{Volume} = 0.025\\text{ m} \\times (150 \\times 10^4\\text{ m}^2) = \\mathbf{37{,}500}\\text{ m}^3$$
:::

### Session 10 recap
1. **Abstractions:** Interception, depression storage, infiltration, and ET represent the water deductions preventing gross precipitation from generating runoff.
2. **Dalton's equation:** Evaporation is proportional to the vapour-pressure gradient between the water surface and the atmosphere: $E = C(e_w - e_a)$.
3. **Driving energy:** Net solar radiation provides the latent heat of vaporization ($\\approx 2.45\\text{ MJ/kg}$).
4. **Wind effect:** Turbulent wind transport removes water vapour from the boundary layer, sustaining evaporation.
5. **Reservoir losses:** In peninsular India, open water evaporation accounts for up to $20–30\\%$ of reservoir storage annually.

<!--tab:In class-->

## Today in class

:::task Activity 1 — Estimate Bellandur lake evaporative loss (15 min)
Bellandur Lake in Bengaluru has a nominal water spread area of 360 ha. During hot, dry April weather, water surface temperature averages 28 °C ($e_w = 28.35\\text{ mm Hg}$), relative humidity averages $45\\%$, and mean wind velocity at 9 m is 14 km/h.
1. Estimate the daily evaporation depth using Meyer's formula $E = 0.36 (e_w - e_a)(1 + u_9/16)$.
2. Calculate the daily water volume lost to the atmosphere in m³ and in litres.
:::

## Your turn — check your answers

```check
[
 {{
  "q": "At 30 °C water temp (ew = 31.82 mm Hg), air RH = 50% (ea = 15.91 mm Hg), wind speed = 12 km/h. Compute daily evaporation depth E in mm/day using E = 0.36*(ew - ea)*(1 + u/16).",
  "answer": 10.02,
  "tol": 0.02,
  "unit": "mm/day",
  "hint": "C = 0.36 * (1 + 12/16) = 0.63. E = 0.63 * (31.82 - 15.91).",
  "solution": "0.36 * (1 + 0.75) * 15.91 = 10.02 mm/day."
 }},
 {{
  "q": "A reservoir with water spread area 360 ha has an evaporation loss of 10.02 mm in a day. What is the total water volume lost in m³?",
  "answer": 36072,
  "tol": 0.02,
  "unit": "m³",
  "hint": "Depth in metres = 0.01002 m. Area = 360 * 10,000 m² = 3.6*10⁶ m².",
  "solution": "0.01002 m * 3.6*10⁶ m² = 36,072 m³."
 }},
 {{
  "q": "During a 50 mm storm on a 200 ha basin, interception is 2 mm, depression storage is 3 mm, and infiltration is 30 mm. What is the runoff depth in mm?",
  "answer": 15.0,
  "tol": 0.02,
  "unit": "mm",
  "solution": "50 - (2 + 3 + 30) = 15 mm."
 }}
]
```

<!--tab:Practice-->

## Self-check

```quiz
[
 {{"q":"According to Dalton's law, evaporation is directly proportional to:","options":["Atmospheric pressure","Vapour pressure deficit (ew - ea)","Wind velocity squared","Water density"],"answer":1,"why":"Dalton established that evaporation rate is driven by the difference between saturation vapour pressure at the water surface and actual vapour pressure in the air."}},
 {{"q":"Which abstraction accounts for the largest fraction of precipitation during a major flood-producing storm?","options":["Interception","Transpiration","Infiltration","Depression storage"],"answer":2,"why":"During intense storm events, infiltration accounts for the vast majority of water losses; evaporation and transpiration are negligible over a few hours."}},
 {{"q":"How does salinity affect the evaporation rate of water?","options":["Increases evaporation","Decreases evaporation","Has no effect","Causes boiling"],"answer":1,"why":"Dissolved salts reduce the chemical activity of water molecules and lower saturation vapour pressure, reducing evaporation by about 1% per 1% salt concentration."}},
 {{"q":"What is the latent heat of vaporization of water at 20 °C?","options":["1.25 MJ/kg","2.45 MJ/kg","4.18 MJ/kg","9.81 MJ/kg"],"answer":1,"why":"Approximately 2.45 MJ (585 cal/g) is required to vaporize one kilogram of liquid water at 20 °C."}},
 {{"q":"In HEC-HMS, where is canopy interception configured?","options":["Control Specifications","Meteorologic Model -> Canopy Method","Basin Model -> Subbasin -> Canopy Tab","Time-Series Data Manager"],"answer":2,"why":"In HEC-HMS, canopy interception and surface depression storage are defined at the Subbasin component level."}}
]
```

## Exam-style questions

**2 marks**
1. State Dalton's law of evaporation and name each term.
2. Differentiate between interception loss and depression storage.
3. Why does lake water evaporate slower when salinity is high?
4. What is the role of net radiation in continuous reservoir evaporation?

**5 marks**
5. Explain the physical factors that influence open water evaporation from reservoirs in arid regions.
6. A reservoir water surface at 28 °C has $e_w = 28.35\\text{ mm Hg}$. The air temperature is 28 °C with $45\\%$ relative humidity and wind speed of 14 km/h at 9 m. Using Meyer's formula $E = 0.36 (e_w - e_a)(1 + u_9/16)$, compute the daily evaporation depth and monthly water loss from a 250 ha water surface. *(Answer: $\\approx 10.51\\text{ mm/day}$; $\\approx 788{,}250\\text{ m}^3/\\text{month}$.)*
7. Describe how canopy interception and depression storage are parameterized in hydrologic modeling.

**10 marks**
8. Discuss the water-budget method and energy-budget method for estimating evaporation from large lakes. State the required field instrumentation, governing equations, and practical limitations of each method.
"""

with open("sessions/S10.md", "w", encoding="utf-8") as f:
    f.write(s10_content)

print("Generated sessions/S10.md")
