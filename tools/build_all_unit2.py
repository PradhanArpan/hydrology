"""
build_all_unit2.py
Generates S11 through S18 and labs L11 through L16.
"""
import os, json, math
import numpy as np

# Write S11.md
s11_content = """<!--tab:Theory-->

> [!note] Key ideas
> - Reservoir evaporation is measured using standard **evaporimeters** (IS Class A pan with wire mesh, Colorado sunken pan, floating pan).
> - Pan evaporation exceeds lake evaporation due to rim heating and side radiation; lake evaporation is estimated via pan coefficient: $E_L = C_p \\times E_{pan}$ ($C_p \\approx 0.70$ for IS Class A pan).
> - **Meyer's formula** estimates reservoir evaporation using wind velocity and vapour pressure: $E_L = C (e_w - e_a)(1 + u_9 / 16)$.
> - Lake evaporation can also be determined by **water-budget** and **energy-balance** methods.

## Evaporimeters (evaporation pans)

Direct measurement of evaporation from lakes and reservoirs is difficult. Engineers measure evaporation from small standard pans and apply a correction coefficient:

$$E_{\\text{lake}} = C_p \\times E_{\\text{pan}}$$

### Standard pans used in engineering

| Pan type | Dimensions & Installation | Pan coefficient $C_p$ | Features & Remarks |
| --- | --- | --- | --- |
| **IS Class A Pan (IS:5973)** | Copper/galvanized iron pan, 1220 mm diameter, 255 mm deep, mounted on a wooden lattice frame 100 mm above ground. | **0.70** (average 0.65–0.75) | Covered with hexagonal wire netting (0.9 mm wire, 25 mm mesh) to protect from birds and animals. Netting reduces catch $\\approx 14\\%$. |
| **US Weather Bureau Class A Pan** | 1219 mm diameter, 254 mm deep, unpainted galvanized iron, unmeshed. | **0.70** (0.60–0.82) | Global standard; water level kept 50 mm below rim. |
| **Colorado Sunken Pan** | 920 mm square, 460 mm deep, buried in the ground so water level matches ground level. | **0.78** (0.75–0.86) | Better thermal simulation of soil, but boundary heat conduction and rim splashing create errors; difficult to clean. |
| **USGS Floating Pan** | 900 mm square, 450 mm deep, supported by floats in a reservoir. | **0.80** | Matches reservoir surface temperature, but waves splash into pan; high maintenance cost. |

> [!note] Why $C_p < 1.0$
> Pans have small heat capacities, exposed metal rims that absorb radiation, and circulating air underneath the timber base. Consequently, pans heat up faster and evaporate $30–40\\%$ more water per unit area than large reservoirs ($C_p \\approx 0.70$).

::widget[pencalc]

## Empirical evaporation formulas

### Meyer's formula (1915)

Widely used in water resources planning:

$$E_L = C (e_w - e_a) \\left(1 + \\frac{u_9}{16}\\right)$$

where:
- $E_L$ is lake evaporation in **mm/day**.
- $e_w$ is saturation vapour pressure at water surface temperature (mm of Hg).
- $e_a$ is actual vapour pressure of overlying air at standard observation height (mm of Hg).
- $u_9$ is mean monthly wind speed in **km/h** at an elevation of 9 m above ground.
- $C = 0.36$ for large deep reservoirs; $C = 0.50$ for small shallow lakes and ponds.

If wind velocity is measured at height $z$ instead of 9 m, the **1/7th power law** converts the velocity:

$$u_9 = u_z \\left(\\frac{9}{z}\\right)^{1/7}$$

### Water-budget method for lake evaporation

$$\\Delta S = I + P + O_g - (Q + E_L + S_p)$$

$$E_L = (I - Q) + P + (O_g - S_p) - \\Delta S$$

where $I$ is surface inflow, $Q$ is surface outflow, $P$ is precipitation on lake surface, $O_g$ is groundwater inflow, $S_p$ is seepage loss, and $\\Delta S$ is storage change.

## Worked examples

### Example 1 — Reservoir evaporation from pan data

A reservoir with a mean surface area of 3.2 km² is situated in Karnataka. In March, the recorded evaporation from an IS Class A pan with wire mesh was 210 mm.
1. Estimate the total lake evaporation depth in mm.
2. Compute the volume of water lost to the atmosphere in m³.
3. If this reservoir supplies drinking water to a municipality of 150,000 residents at 135 litres/capita/day, what fraction of the monthly drinking supply is lost to evaporation?

:::sol Show solution
1. Lake evaporation depth ($C_p = 0.70$):
$$E_L = 0.70 \\times 210 = \\mathbf{147.0}\\text{ mm} = 0.147\\text{ m}$$

2. Evaporated volume ($A = 3.2\\times 10^6\\text{ m}^2$):
$$V = 3.2\\times 10^6 \\times 0.147 = \\mathbf{470{,}400}\\text{ m}^3$$

3. Monthly drinking water requirement (30 days):
$$V_{\\text{city}} = 150{,}000 \\times 135 \\times 30 / 1000 = \\mathbf{607{,}500}\\text{ m}^3$$

$$\\text{Fraction lost} = \\frac{470{,}400}{607{,}500} \\times 100 = \\mathbf{77.4\\%}$$
Evaporation loss represents over three-quarters of the town's monthly drinking demand!
:::

### Example 2 — Meyer's formula calculation

A storage reservoir has water surface temperature 25 °C ($e_w = 23.76\\text{ mm Hg}$). Air temperature is 28 °C and relative humidity is $40\\%$ ($e_a = 28.35 \\times 0.40 = 11.34\\text{ mm Hg}$). The wind speed measured at 2 m above the ground is 10 km/h. Compute the daily evaporation from the lake using Meyer's formula ($C = 0.36$).

:::sol Show solution
1. Wind velocity conversion to 9 m:
$$u_9 = u_2 \\left(\\frac{9}{2}\\right)^{1/7} = 10 \\times (4.5)^{0.14286} = 10 \\times 1.239 = \\mathbf{12.39}\\text{ km/h}$$

2. Meyer's evaporation rate:
$$E_L = 0.36 \\times (23.76 - 11.34) \\times \\left(1 + \\frac{12.39}{16}\\right)$$
$$E_L = 0.36 \\times 12.42 \\times (1 + 0.7744) = 0.36 \\times 12.42 \\times 1.7744 = \\mathbf{7.93}\\text{ mm/day}$$
:::

### Session 11 recap
1. **Pan coefficient:** Because pans heat up and circulate heat faster, pan readings are multiplied by $C_p \\approx 0.70$ (IS Class A) to estimate lake evaporation.
2. **Wire mesh netting:** Protects the pan from wildlife; reduces recorded evaporation by $\\approx 14\\%$.
3. **Meyer's formula:** $E_L = 0.36 (e_w - e_a)(1 + u_9/16)$ incorporates vapour-pressure gradient and 9 m wind velocity.
4. **Power law:** Wind velocity increases with height: $u_9 = u_z (9/z)^{1/7}$.
5. **Continuous HMS runs:** Monthly evaporation depths enter HEC-HMS under the Monthly Average Evapotranspiration method.

<!--tab:In class-->

## Today in class

:::task Activity — Reservoir water conservation (15 min)
Water resources engineers in semi-arid zones spread chemical monomolecular films (cetyl alcohol / stearyl alcohol) on small reservoirs to suppress evaporation by $20–30\\%$.
For a 120 ha reservoir with 8 mm/day evaporation loss, compute the cubic metres of water saved in a 30-day month if a chemical film achieves a $25\\%$ reduction.
:::

## Your turn — check your answers

```check
[
 {
  "q": "An IS Class A pan records 180 mm of evaporation in May. If the pan coefficient Cp is 0.70, what is the estimated reservoir evaporation depth in mm?",
  "answer": 126.0,
  "tol": 0.02,
  "unit": "mm",
  "solution": "180 * 0.70 = 126 mm."
 },
 {
  "q": "A reservoir of 2.5 km² has lake evaporation of 126 mm in a month. What is the total volume of water lost in cubic metres?",
  "answer": 315000,
  "tol": 0.02,
  "unit": "m³",
  "hint": "0.126 m * 2.5*10⁶ m².",
  "solution": "0.126 * 2.5*10⁶ = 315,000 m³."
 },
 {
  "q": "Wind velocity at 2 m is 10 km/h. What is the equivalent wind speed at 9 m using the 1/7 power law: u9 = u2*(9/2)^(1/7)?",
  "answer": 12.39,
  "tol": 0.02,
  "unit": "km/h",
  "solution": "10 * (4.5)^0.14286 = 12.39 km/h."
 }
]
```

<!--tab:Practice-->

## Self-check

```quiz
[
 {"q":"What is the standard pan coefficient Cp recommended for the Indian Standard Class A pan?","options":["0.50","0.70","0.85","1.00"],"answer":1,"why":"IS:5973 specifies an average pan coefficient of 0.70 (range 0.65 to 0.75) for estimating reservoir evaporation from Class A pan measurements."},
 {"q":"Why does an evaporation pan record a higher evaporation rate than a nearby large lake?","options":["Pan water is colder","Pans absorb solar radiation through their sides and rims and lack thermal inertia","Wind is zero over a lake","Rain does not fall in pans"],"answer":1,"why":"Pans heat up faster due to solar radiation hitting the metal rim and sides, and they lack the large thermal heat capacity of deep lakes."},
 {"q":"Which formula converts wind velocity from measurement height z to the standard 9 m height?","options":["u9 = u_z * (9/z)","u9 = u_z * (9/z)^(1/7)","u9 = u_z + 9/z","u9 = u_z * log(9/z)"],"answer":1,"why":"The 1/7th power law u9 = uz*(9/z)^(1/7) is standard in engineering hydrology for boundary layer wind profiles."},
 {"q":"In the water-budget method, which term is usually the most difficult to measure accurately?","options":["Precipitation P","Surface runoff Q","Groundwater seepage loss Sp","Reservoir surface area A"],"answer":2,"why":"Subsurface seepage and groundwater exchange are indirect and difficult to quantify without extensive piezometric monitoring networks."},
 {"q":"What is the effect of placing wire mesh on an IS Class A pan?","options":["Increases evaporation by 14%","Reduces evaporation by about 14%","Has no effect on evaporation","Causes instant condensation"],"answer":1,"why":"Hexagonal wire mesh slightly shades the water surface and disrupts wind flow, reducing recorded evaporation by approximately 14%."}
]
```

## Exam-style questions

**2 marks**
1. Define pan coefficient and state its typical value for an IS Class A pan.
2. Why is hexagonal wire mesh installed on Indian Standard evaporimeters?
3. State Meyer's formula for lake evaporation and define all symbols.
4. How does the 1/7 power law adjust wind speed for elevation?

**5 marks**
5. Describe the construction, installation, and operation of the Indian Standard Class A pan with neat sketches.
6. A reservoir had an average water surface area of 4.5 km² during April. Class A pan evaporation was recorded as 240 mm. Find the volume of water lost to evaporation. If water is valued at ₹ 15 per 1,000 litres, what is the economic value of the evaporated water? *(Answer: 756,000 m³; ₹ 1.134 crore.)*
7. Explain the energy-balance method for estimating lake evaporation, defining the Bowen ratio.

**10 marks**
8. Compare the pan evaporimeter method, water-budget method, and Meyer's empirical method for estimating reservoir evaporation. Outline their governing equations, field data requirements, and sources of uncertainty.
"""

with open("sessions/S11.md", "w", encoding="utf-8") as f:
    f.write(s11_content)
print("Generated sessions/S11.md")

# S12.md
s12_content = """<!--tab:Theory-->

> [!note] Key ideas
> - **Infiltration** is the entry of precipitation into the soil profile through the ground surface.
> - **Infiltration capacity ($f_p$)** is the maximum rate at which a soil can absorb water under ponded conditions.
> - Infiltration is measured in the field using a **double-ring infiltrometer**; the outer buffer ring enforces one-dimensional vertical flow beneath the inner ring.
> - **Horton's equation** models infiltration capacity decay: $f(t) = f_c + (f_0 - f_c) e^{-k_h t}$, where $f_0$ is initial capacity, $f_c$ is final constant capacity, and $k_h$ is the decay constant.
> - When rainfall intensity $i > f_c$, surface ponding and runoff begin at ponding time $t_p$.

## The infiltration process

Infiltration governs what fraction of storm rainfall becomes direct flood runoff and what fraction replenishes soil moisture and groundwater storage. As water enters dry soil:
1. **Saturation zone:** The uppermost few millimetres become completely saturated.
2. **Transition zone:** Soil moisture content decreases rapidly over a few centimetres.
3. **Transmission zone:** A zone of nearly uniform moisture content where water flows downward under gravity.
4. **Wetting front:** The sharp boundary between moist soil above and dry soil beneath.

### Infiltration capacity ($f_p$) vs Actual infiltration rate ($f$)

- If rainfall intensity $i < f_p$, all rain infiltrates: $f = i$, and no surface runoff forms.
- If rainfall intensity $i \\ge f_p$, water infiltrates at capacity: $f = f_p$, and the excess $(i - f_p)$ ponds and forms **surface runoff**.

::widget[hortonfit]

## Measuring infiltration: the double-ring infiltrometer

A single ring inserted into the ground allows water to diverge laterally at the edges, artificially inflating the measured infiltration rate. The **double-ring infiltrometer (IS:10260)** eliminates this edge effect:
- **Inner ring:** 300 mm diameter, driven 100 mm into the ground. Water level measurements are taken exclusively in this ring.
- **Outer ring:** 600 mm diameter, driven to the same depth. Kept filled to the same water level to act as a buffer.
- **Mechanism:** The outer water forces infiltration lines beneath the inner ring to travel strictly **vertically downward**, ensuring true one-dimensional infiltration measurement.

## Horton's infiltration equation (1939)

Robert E. Horton observed that infiltration capacity starts at a high initial rate $f_0$ and decays exponentially toward a steady constant rate $f_c$:

$$f(t) = f_c + (f_0 - f_c) e^{-k_h t}$$

where:
- $f(t)$ is infiltration capacity at time $t$ (mm/h).
- $f_0$ is initial infiltration capacity at $t = 0$ (mm/h).
- $f_c$ is final constant (ultimate) infiltration capacity, governed by saturated hydraulic conductivity $K_{sat}$ (mm/h).
- $k_h$ is the decay coefficient depending on soil texture and vegetation ($h^{-1}$).
- $t$ is time elapsed since the start of infiltration (h).

### Cumulative infiltration ($F$)

The total volume/depth of water infiltrated up to time $t$ is the integral of the infiltration capacity curve:

$$F(t) = \\int_0^t f(\\tau) d\\tau = f_c t + \\frac{f_0 - f_c}{k_h} (1 - e^{-k_h t})$$

As $t \\to \\infty$, the second term approaches $(f_0 - f_c)/k_h$, representing the transient storage absorbed before steady gravity flow is achieved.

## Worked examples

### Example 1 — Horton curve evaluation

An infiltrometer test yields the following Horton parameters for a sandy loam soil: $f_0 = 80\\text{ mm/h}$, $f_c = 12\\text{ mm/h}$, and decay constant $k_h = 1.5\\text{ h}^{-1}$.
1. What is the infiltration capacity after 2 hours?
2. What is the total depth of water infiltrated in the first 2 hours?

:::sol Show solution
1. Infiltration capacity at $t = 2\\text{ h}$:
$$f(2) = 12 + (80 - 12) e^{-1.5 \\times 2} = 12 + 68 e^{-3}$$
$$f(2) = 12 + 68 \\times 0.04979 = 12 + 3.39 = \\mathbf{15.39}\\text{ mm/h}$$

2. Cumulative infiltration depth $F(2)$:
$$F(2) = f_c t + \\frac{f_0 - f_c}{k_h} (1 - e^{-k_h t})$$
$$F(2) = 12 \\times 2 + \\frac{68}{1.5} (1 - e^{-3}) = 24 + 45.333 \\times (1 - 0.04979)$$
$$F(2) = 24 + 45.333 \\times 0.95021 = 24 + 43.08 = \\mathbf{67.08}\\text{ mm}$$
:::

### Example 2 — Time to ponding ($t_p$)

For the soil in Example 1 ($f_0 = 80\\text{ mm/h}, f_c = 12\\text{ mm/h}, k_h = 1.5\\text{ h}^{-1}$), a constant rainstorm of intensity $i = 40\\text{ mm/h}$ occurs. Find the time of ponding ($t_p$) when surface runoff begins.

:::sol Show solution
Ponding begins when the infiltration capacity drops to equal the rainfall intensity: $f(t_p) = i = 40\\text{ mm/h}$.

$$40 = 12 + (80 - 12) e^{-1.5 t_p}$$
$$28 = 68 e^{-1.5 t_p} \\implies e^{-1.5 t_p} = \\frac{28}{68} = 0.41176$$
$$-1.5 t_p = \\ln(0.41176) = -0.8873$$
$$t_p = \\frac{0.8873}{1.5} = \\mathbf{0.59}\\text{ h} \\approx \\mathbf{35.5}\\text{ minutes}$$

Before 35.5 minutes, all rainfall infiltrates ($f = 40\\text{ mm/h}$). After 35.5 minutes, $f(t) < 40\\text{ mm/h}$ and water ponds on the surface to produce overland runoff.
:::

### Session 12 recap
1. **Infiltration capacity:** Decreases rapidly as soil moisture rises, clay minerals swell, and surface pores clog with fine particles.
2. **Double-ring infiltrometer:** Buffer ring forces water from the inner ring to flow vertically, preventing lateral dispersion error.
3. **Horton parameters:** $f_0$ reflects initial dry-soil suction; $f_c$ reflects saturated hydraulic conductivity; $k_h$ reflects the rate of structural sealing.
4. **Cumulative depth:** $F(t) = f_c t + \\frac{f_0 - f_c}{k_h}(1 - e^{-k_h t})$.
5. **Runoff trigger:** Overland flow initiates only when rainfall intensity exceeds the instantaneous infiltration capacity ($i > f(t)$).

<!--tab:In class-->

## Today in class

:::task Activity — Fit Horton parameters from field data (15 min)
Field infiltration rates measured with a ring infiltrometer were:
- $t = 0$: $90\\text{ mm/h}$
- $t = 0.5\\text{ h}$: $45\\text{ mm/h}$
- $t \\to \\infty$ (after 4 hours): $15\\text{ mm/h}$

1. Identify $f_0$ and $f_c$.
2. Substitute at $t = 0.5\\text{ h}$ to solve for the decay constant $k_h$:
$$45 = 15 + (90 - 15) e^{-0.5 k_h} \\implies 30 = 75 e^{-0.5 k_h} \\implies k_h = -2 \\ln(30/75) = 1.83\\text{ h}^{-1}$$
3. Write the complete Horton equation for this soil.
:::

## Your turn — check your answers

```check
[
 {
  "q": "For f0 = 80 mm/h, fc = 12 mm/h, kh = 1.5 h^-1, what is the infiltration capacity f(2) after 2 hours in mm/h?",
  "answer": 15.39,
  "tol": 0.02,
  "unit": "mm/h",
  "hint": "12 + 68*exp(-3).",
  "solution": "12 + 68*0.04979 = 15.39 mm/h."
 },
 {
  "q": "For the same soil, compute the total cumulative infiltration F(2) after 2 hours in mm.",
  "answer": 67.08,
  "tol": 0.02,
  "unit": "mm",
  "hint": "12*2 + (68/1.5)*(1 - exp(-3)).",
  "solution": "24 + 45.333*0.95021 = 67.08 mm."
 },
 {
  "q": "With f0 = 80 mm/h, fc = 12 mm/h, kh = 1.5 h^-1, find the ponding time tp in hours for a rainfall intensity of 40 mm/h.",
  "answer": 0.59,
  "tol": 0.03,
  "unit": "h",
  "hint": "exp(-1.5*tp) = (40-12)/(80-12) = 28/68. tp = -ln(28/68)/1.5.",
  "solution": "-ln(0.41176)/1.5 = 0.591 h."
 }
]
```

<!--tab:Practice-->

## Self-check

```quiz
[
 {"q":"Why does a double-ring infiltrometer use two concentric rings instead of one?","options":["To double the infiltration area","To enforce one-dimensional vertical flow beneath the inner ring","To measure evaporation simultaneously","To filter out coarse particles"],"answer":1,"why":"The outer annular ring acts as a hydraulic buffer, preventing water in the central ring from spreading laterally into dry adjacent soil."},
 {"q":"In Horton's equation f(t) = fc + (f0 - fc)*exp(-kh*t), what physical soil property determines fc?","options":["Initial soil moisture content","Saturated hydraulic conductivity (Ksat)","Soil organic matter percentage","Surface vegetation height"],"answer":1,"why":"fc represents the ultimate steady infiltration capacity under fully saturated gravity flow, which is governed by Ksat."},
 {"q":"Under what condition does surface runoff form during a storm?","options":["Rainfall depth exceeds 100 mm","Rainfall intensity exceeds instantaneous infiltration capacity f(t)","Relative humidity reaches 100%","Wind velocity exceeds 20 km/h"],"answer":1,"why":"Runoff begins when rainfall intensity exceeds infiltration capacity (Horton overland flow / infiltration excess)."},
 {"q":"As time t approaches infinity, what does the cumulative infiltration F(t) asymptotically approach?","options":["Zero","fc * t + (f0 - fc)/kh","Infinity with slope f0","A fixed constant"],"answer":1,"why":"As t becomes large, exp(-kh*t) vanishes, leaving F(t) ≈ fc*t + (f0 - fc)/kh."},
 {"q":"Which soil texture exhibits the highest final infiltration capacity fc?","options":["Heavy clay","Silty clay loam","Coarse sand and gravel","Organic muck"],"answer":2,"why":"Coarse sand and gravel possess large, interconnected macropores that allow rapid gravitational water percolation."}
]
```

## Exam-style questions

**2 marks**
1. Distinguish between infiltration capacity and actual infiltration rate.
2. State Horton's infiltration equation and identify each parameter.
3. What is meant by the time of ponding ($t_p$)?
4. Name the four soil moisture zones developed during prolonged ponded infiltration.

**5 marks**
5. Explain the working principle of the double-ring infiltrometer with a neat schematic diagram.
6. A 90-minute storm with constant rainfall intensity $i = 50\\text{ mm/h}$ falls on a catchment with $f_0 = 75\\text{ mm/h}$, $f_c = 15\\text{ mm/h}$, and $k_h = 2.0\\text{ h}^{-1}$. Find:
   (a) Time when surface runoff starts ($t_p$).
   (b) Total rainfall depth and total infiltration depth over the 90 minutes.
   (c) Total depth of direct runoff produced. *(Answers: $t_p = 0.27\\text{ h}$; $P = 75\\text{ mm}$; $F = 50.8\\text{ mm}$; $R = 24.2\\text{ mm}$.)*
7. Discuss the biological and physical factors causing infiltration capacity to decrease during a storm.

**10 marks**
8. Derive the equation for cumulative infiltration depth $F(t)$ from Horton's differential form. Compare Horton's empirical model with Philip's two-term physically-based infiltration model $f(t) = \\frac{1}{2} S t^{-1/2} + K$.
"""

with open("sessions/S12.md", "w", encoding="utf-8") as f:
    f.write(s12_content)
print("Generated sessions/S12.md")

# S13.md
s13_content = """<!--tab:Theory-->

> [!note] Key ideas
> - Infiltration rates vary across a catchment; for practical flood analysis, engineers use lumped **infiltration indices**.
> - The **$\\phi$-index** is the constant average abstraction rate above which rainfall volume equals direct runoff volume: $R = \\sum \\max(0, P_t - \\phi) \\Delta t$.
> - The **$W$-index** refines the $\\phi$-index by explicitly separating initial abstraction: $W = (P - R - I_a) / t_r$.
> - Rainfall exceeding $\\phi$ is termed **rainfall excess** or **effective rainfall**, which directly forms the storm hydrograph.

## Infiltration indices

Because soil characteristics, land use, and antecedent moisture vary continuously across a river basin, applying point infiltration equations (like Horton's) to an entire catchment requires detailed spatial modeling. In applied engineering hydrology, **infiltration indices** assume an average, constant infiltration rate throughout the effective storm period.

::widget[phiindex]

### The $\\phi$-index (Phi-index)

The **$\\phi$-index** is defined as the constant rate of abstraction (infiltration, depression storage, and interception combined) such that rainfall exceeding this rate equals the **direct runoff volume** ($R$):

$$R = \\sum_{t=1}^n \\max(0, P_t - \\phi) \\Delta t$$

where:
- $R$ is total direct runoff depth (mm).
- $P_t$ is rainfall intensity in time block $t$ (mm/h).
- $\\Delta t$ is the duration of each rainfall block (h).
- $\\phi$ is the phi-index (mm/h).
- The summation includes only those time intervals where rainfall intensity exceeds $\\phi$ (the **effective storm duration**, $t_e$).

```
Rainfall (mm/h)
   ^
   |        +---+
   |        |   | Direct Runoff (Rainfall Excess)
   |    +---+   +---+
---+----+---+---+---+---+--  <- phi-index (mm/h)
   |    |   |   |   |   |
   |----+---+---+---+---+--  <- Infiltration & abstractions
   +----------------------> Time (h)
```

### The $W$-index

The $\\phi$-index includes initial abstraction ($I_a$: canopy interception and initial depression storage). The **$W$-index** refines this by explicitly subtracting initial abstraction and averaging only true infiltration over the total storm duration $t_r$:

$$W = \\frac{P - R - I_a}{t_r}$$

where:
- $P$ is total storm precipitation (mm).
- $R$ is total direct runoff (mm).
- $I_a$ is initial abstraction (mm).
- $t_r$ is total storm duration (h).

Because $W$ averages losses over the entire storm duration $t_r$ (which is longer than the effective duration $t_e$), and subtracts $I_a$:

$$W \\le \\phi$$

In heavy, prolonged monsoon storms where $I_a$ is small relative to $P$, the two indices converge: $W \\approx \\phi$.

## Step-by-step determination of the $\\phi$-index

1. Compute total storm rainfall: $P = \\sum P_i \\Delta t$.
2. Compute total abstraction: $\\text{Loss} = P - R$.
3. **Trial 1:** Assume all time blocks contribute to runoff ($t_e = t_r$). Compute initial estimate $\\phi_1 = \\text{Loss} / t_r$.
4. Check if any rainfall blocks have $P_i < \\phi_1$. If all $P_i \\ge \\phi_1$, then $\\phi = \\phi_1$.
5. If one or more blocks have $P_i < \\phi_1$, those blocks cannot generate runoff. Discard those blocks and adjust effective duration $t_e$.
6. **Trial 2:** Recompute:
   $$\\phi_2 = \\frac{P_{\\text{effective}} - R}{t_e}$$
   where $P_{\\text{effective}}$ is the sum of rainfall only in the remaining blocks.
7. Repeat until the derived $\\phi$ is smaller than all retained blocks and greater than all discarded blocks.

## Worked examples

### Example 1 — Determining $\\phi$-index from a storm hyetograph

A 6-hour storm produces the following hourly rainfall depths:
$15, 32, 55, 42, 22, 12\\text{ mm}$.
The resulting direct runoff measured at the catchment outlet is $84\\text{ mm}$.
Find the $\\phi$-index and the effective storm duration $t_e$.

:::sol Show solution
1. Total rainfall:
$$P = 15 + 32 + 55 + 42 + 22 + 12 = \\mathbf{178}\\text{ mm}$$
Total abstractions $= 178 - 84 = 94\\text{ mm}$.

2. **Trial 1:** Assume all 6 hours contribute ($t_e = 6\\text{ h}$):
$$\\phi_1 = \\frac{94}{6} = 15.67\\text{ mm/h}$$
Check against hourly rain:
- Hour 1 ($15\\text{ mm}$) $< 15.67$ ❌
- Hour 6 ($12\\text{ mm}$) $< 15.67$ ❌
Both Hour 1 and Hour 6 must be eliminated.

3. **Trial 2:** Retain Hours 2, 3, 4, 5 ($t_e = 4\\text{ h}$):
$$P_{\\text{eff}} = 32 + 55 + 42 + 22 = 151\\text{ mm}$$
$$\\phi_2 = \\frac{P_{\\text{eff}} - R}{t_e} = \\frac{151 - 84}{4} = \\frac{67}{4} = \\mathbf{16.75}\\text{ mm/h}$$

4. Verification:
- Retained hours ($32, 55, 42, 22$) are all $> 16.75\\text{ mm/h}$ ✓
- Discarded hours ($15, 12$) are both $< 16.75\\text{ mm/h}$ ✓
- Direct runoff check:
$$R = (32 - 16.75) + (55 - 16.75) + (42 - 16.75) + (22 - 16.75)$$
$$R = 15.25 + 38.25 + 25.25 + 5.25 = \\mathbf{84.0}\\text{ mm} \\quad \\text{✓ Correct}$$

Thus, $\\mathbf{\\phi = 16.75\\text{ mm/h}}$ and $\\mathbf{t_e = 4\\text{ hours}}$.
:::

### Example 2 — Calculating $W$-index

For the storm in Example 1 ($P = 178\\text{ mm}, R = 84\\text{ mm}, t_r = 6\\text{ h}$), if the initial abstraction $I_a$ is estimated as $8\\text{ mm}$, compute the $W$-index.

:::sol Show solution
$$W = \\frac{P - R - I_a}{t_r} = \\frac{178 - 84 - 8}{6} = \\frac{86}{6} = \\mathbf{14.33}\\text{ mm/h}$$

Notice that $W = 14.33\\text{ mm/h} < \\phi = 16.75\\text{ mm/h}$.
:::

### Session 13 recap
1. **Practical utility:** The $\\phi$-index provides a robust, single-parameter representation of complex catchment infiltration.
2. **Rainfall excess:** Only precipitation intensities above $\\phi$ contribute to the flood hydrograph.
3. **Trial-and-error procedure:** Low-intensity rain blocks below candidate $\\phi$ values are progressively removed until consistency is achieved.
4. **$W$-index relationship:** $W = (P - R - I_a)/t_r \\le \\phi$.
5. **HEC-HMS connection:** The *Initial and Constant* loss method in HEC-HMS directly implements the $I_a$ and $\\phi$-index abstraction model.

<!--tab:In class-->

## Today in class

:::task Activity — Find the $\\phi$-index (15 min)
A 5-hour storm has hourly rainfalls: $10, 25, 40, 30, 15\\text{ mm}$.
The catchment generates a total direct runoff of $50\\text{ mm}$.
1. Compute total rainfall and total losses.
2. Perform Trial 1 over 5 hours. Which hours fall below $\\phi_1$?
3. Perform Trial 2 to find the verified $\\phi$-index.
:::

## Your turn — check your answers

```check
[
 {
  "q": "For the storm [15, 32, 55, 42, 22, 12] mm with R = 84 mm, what is the verified phi-index in mm/h?",
  "answer": 16.75,
  "tol": 0.02,
  "unit": "mm/h",
  "hint": "(32 + 55 + 42 + 22 - 84) / 4.",
  "solution": "67 / 4 = 16.75 mm/h."
 },
 {
  "q": "For the same storm (P = 178 mm, R = 84 mm, tr = 6 h, Ia = 8 mm), find the W-index in mm/h.",
  "answer": 14.33,
  "tol": 0.02,
  "unit": "mm/h",
  "hint": "(178 - 84 - 8) / 6.",
  "solution": "86 / 6 = 14.33 mm/h."
 },
 {
  "q": "A storm has [10, 25, 40, 30, 15] mm rain (total P = 120 mm) and produces R = 50 mm. Find the phi-index in mm/h.",
  "answer": 15.0,
  "tol": 0.02,
  "unit": "mm/h",
  "hint": "Try hours 2, 3, 4, 5 (4 hours with rain 25+40+30+15 = 110 mm): (110 - 50) / 4 = 60/4 = 15 mm/h. Hours 2,3,4 > 15; Hr 1 < 15; Hr 5 = 15.",
  "solution": "(110 - 50) / 4 = 15.0 mm/h."
 }
]
```

<!--tab:Practice-->

## Self-check

```quiz
[
 {"q":"What is the physical meaning of the phi-index?","options":["Minimum infiltration capacity fc","Constant abstraction rate above which rainfall equals direct runoff","Ratio of runoff to rainfall","Instantaneous rainfall intensity"],"answer":1,"why":"The phi-index represents the constant horizontal cut on a hyetograph separating direct runoff (above) from total abstractions (below)."},
 {"q":"Why is the W-index generally less than or equal to the phi-index?","options":["Because W is measured in different units","Because W averages losses over the entire storm duration tr (tr >= te) and excludes Ia","Because W is only used for snowmelt","Because W accounts for evaporation but phi does not"],"answer":1,"why":"W distributes net infiltration over total duration tr rather than the shorter effective duration te, and it subtracts initial abstraction Ia."},
 {"q":"What is effective rainfall?","options":["Gross precipitation recorded by non-recording gauges","Rainfall that infiltrates into the water table","The portion of rainfall that becomes direct surface runoff","Rainfall caught by forest canopy"],"answer":2,"why":"Effective rainfall (or rainfall excess) is the precipitation exceeding the phi-index that directly generates surface storm runoff."},
 {"q":"In an 8-hour storm, if phi = 12 mm/h, which hours generate rainfall excess?","options":["All 8 hours","Only hours where rainfall intensity is strictly greater than 12 mm/h","Only the hour of peak intensity","Hours where cumulative rain exceeds 100 mm"],"answer":1,"why":"Only intervals where intensity exceeds phi contribute positive excess (P_t - phi > 0)."},
 {"q":"Which HEC-HMS loss method is conceptually equivalent to the initial abstraction and phi-index model?","options":["SCS Curve Number","Initial and Constant","Green and Ampt","Soil Moisture Accounting"],"answer":1,"why":"The Initial and Constant method specifies an Initial Loss (Ia in mm) followed by a Constant Rate (phi in mm/h)."}
]
```

## Exam-style questions

**2 marks**
1. Define $\\phi$-index and $W$-index.
2. State the mathematical relationship between $\\phi$-index and $W$-index.
3. What is effective rainfall hyetograph (ERH)?
4. Why is trial-and-error required to calculate the $\\phi$-index?

**5 marks**
5. The rainfall depths recorded during a 6-hour storm at 1-hour intervals are $18, 34, 60, 48, 26, 14\\text{ mm}$. The resulting runoff depth is $90\\text{ mm}$. Compute the $\\phi$-index, effective rainfall duration $t_e$, and plot the net rain hyetograph. *(Answer: $\\phi = 19.5\\text{ mm/h}$; $t_e = 4\\text{ hours}$.)*
6. Explain the limitations of using a constant $\\phi$-index for long-duration storms.
7. A catchment has $P = 150\\text{ mm}$, storm duration $t_r = 8\\text{ h}$, observed runoff $R = 62\\text{ mm}$, and initial abstraction $I_a = 12\\text{ mm}$. Compute the $W$-index. If $\\phi = 12.5\\text{ mm/h}$, explain why $W < \\phi$. *(Answer: $W = 9.5\\text{ mm/h}$.)*

**10 marks**
8. Contrast empirical infiltration indices ($\\phi$-index, $W$-index) with physically-based infiltration models (Green-Ampt, Horton). Describe how each method is calibrated from field data and implemented in modern catchment modeling software.
"""

with open("sessions/S13.md", "w", encoding="utf-8") as f:
    f.write(s13_content)
print("Generated sessions/S13.md")

# S14.md
s14_content = """<!--tab:Theory-->

> [!note] Key ideas
> - **Evapotranspiration (ET)** combines evaporation from soil and free water surfaces with transpiration from living plant tissues.
> - **Potential Evapotranspiration (PET)** is the maximum ET rate from an extensive, well-watered short green crop completely shading the ground.
> - **Actual Evapotranspiration (AET)** is constrained by available soil moisture; when soil moisture drops below field capacity toward the permanent wilting point, $\\text{AET} < \\text{PET}$.
> - The **Blaney-Criddle formula** estimates monthly consumptive use from mean temperature and percentage daytime hours: $\\text{PET} = 2.54 \\times k \\times (p \\cdot t / 100)$.

## Evapotranspiration concepts

Evapotranspiration represents the primary return pathway of water from the land surface back into the global atmosphere. Over an entire year in India, between $60\\%$ and $80\\%$ of total precipitation is returned via ET.

### Key definitions

1. **Potential Evapotranspiration (PET):** Introduced by Thornthwaite (1948) and Penman (1948) — the rate of evapotranspiration from an extensive surface of 8 to 15 cm tall, uniform green grass cover actively growing, completely shading the ground, and abundantly supplied with moisture so soil water is not limiting.
2. **Reference Crop Evapotranspiration ($ET_0$):** The FAO standard definition — a hypothetical reference crop with an assumed crop height of 0.12 m, a fixed surface resistance of $70\\text{ s/m}$, and an albedo of 0.23, closely resembling an extensive surface of green grass.
3. **Actual Evapotranspiration (AET):** The real rate of ET occurring under ambient soil moisture conditions, actual crop growth stages, and environmental stress.

### Relationship between AET, PET, and soil moisture

```
ET Rate
  ^
  |        PET (Atmosphere-limited: solar radiation & wind)
  |----------------------+
  |                     /
  |                    /   AET (Soil moisture-limited)
  |                   /
  |                  /
  +-----------------+----+----------> Soil Moisture
  0                PWP   FC         Saturation
```

- **At Field Capacity (FC):** Soil pores hold optimum moisture against gravity; plants transpire without suction resistance $\\implies \\mathbf{\\text{AET} = \\text{PET}}$.
- **Between FC and Permanent Wilting Point (PWP):** As moisture depletes, capillary suction forces roots to work harder, stomata partially close to reduce desiccation $\\implies \\mathbf{\\text{AET} < \\text{PET}}$.
- **Below PWP:** Soil suction exceeds root osmotic pressure ($\\approx 15\\text{ atmospheres}$); plant cells lose turgidity, wilt permanently, and transpiration ceases $\\implies \\mathbf{\\text{AET} \\to 0}$.

## Estimating ET: The Blaney-Criddle method

Developed by the USDA for irrigated agriculture, widely used where solar radiation data are missing:

$$\\text{PET} = 2.54 \\times k \\times \\frac{p \\cdot t}{100} \\quad (\\text{cm/month})$$

where:
- $\\text{PET}$ is monthly potential evapotranspiration (cm/month).
- $k$ is the empirical crop consumptive use coefficient.
- $t$ is the mean monthly temperature (°C).
- $p$ is the monthly percentage of annual daytime hours, determined by the latitude of the location.

To convert monthly PET to daily rate in mm/day:
$$\\text{PET}_{\\text{daily}} = \\frac{\\text{PET (cm/month)} \\times 10}{30} \\quad (\\text{mm/day})$$

### Typical crop coefficients ($k$) in India

| Crop | Growing season | Seasonal $k$ factor |
| --- | --- | --- |
| **Paddy rice** | Kharif (June–Nov) | 1.10 – 1.25 |
| **Wheat** | Rabi (Nov–April) | 0.80 – 0.95 |
| **Sugarcane** | Perennial (12 months) | 0.90 – 1.10 |
| **Cotton** | Kharif–Rabi | 0.75 – 0.90 |
| **Maize / Corn** | Kharif | 0.70 – 0.85 |

## Worked examples

### Example 1 — Blaney-Criddle crop water requirement

Determine the monthly consumptive use for cotton during October grown in Gujarat (Latitude 22° N).
*Data:*
- Mean monthly temperature $t = 26\\text{ °C}$
- Monthly daytime percentage $p = 8.4\\%$
- Crop coefficient $k = 0.85$

:::sol Show solution
1. Monthly PET:
$$\\text{PET} = 2.54 \\times k \\times \\frac{p \\cdot t}{100}$$
$$\\text{PET} = 2.54 \\times 0.85 \\times \\frac{8.4 \\times 26}{100} = 2.159 \\times 2.184 = \\mathbf{4.72}\\text{ cm/month}$$

2. Convert to mm/month:
$$\\text{PET} = 4.715 \\times 10 = \\mathbf{47.2}\\text{ mm/month}$$

3. Daily equivalent:
$$\\text{PET}_{\\text{daily}} = \\frac{47.15}{31} = \\mathbf{1.52}\\text{ mm/day}$$
:::

### Example 2 — Water balance with soil moisture depletion

A root zone has a field capacity of 180 mm and a permanent wilting point of 80 mm. Available water capacity (AWC) is $180 - 80 = 100\\text{ mm}$.
If the initial soil moisture is at field capacity (180 mm) and PET averages 5 mm/day without rain, compute:
1. Soil moisture after 10 days if AET = PET.
2. Readily available water (RAW) if management allows $50\\%$ depletion before irrigation.

:::sol Show solution
1. Soil moisture after 10 days:
$$\\text{Loss} = 10 \\times 5 = 50\\text{ mm}$$
$$\\text{Moisture} = 180 - 50 = \\mathbf{130}\\text{ mm}$$
Since 130 mm $> 80\\text{ mm}$ (PWP), plants are not wilting.

2. Readily Available Water (RAW):
$$\\text{RAW} = 0.50 \\times \\text{AWC} = 0.50 \\times 100 = \\mathbf{50}\\text{ mm}$$
At 130 mm, exactly 50 mm has been depleted; irrigation is due!
:::

### Session 14 recap
1. **AET vs PET:** PET is energy-limited (atmosphere's evaporative power); AET is water-limited (available soil moisture).
2. **Reference crop $ET_0$:** A standardized 0.12 m grass surface eliminates crop variability when benchmarking evaporative demand.
3. **Soil moisture limits:** Available water lies between Field Capacity and Permanent Wilting Point ($AWC = FC - PWP$).
4. **Blaney-Criddle formula:** $\\text{PET} = 2.54 \\times k \\times (p \\cdot t / 100)$ cm/month.
5. **Continuous simulation:** In HEC-HMS continuous accounting, ET depletes canopy interception and soil profile moisture between rainfall events.

<!--tab:In class-->

## Today in class

:::task Activity — Seasonal irrigation water demand (15 min)
A 500-hectare command area in northern Karnataka cultivates wheat in Rabi season (90 days, Dec–Feb).
- Mean daily PET = 4.2 mm/day.
- Average crop factor $k = 0.85$.
- Effective rainfall during Rabi season = 25 mm.
Compute:
1. Total seasonal crop evapotranspiration $ET_c = k \\times \\text{PET} \\times 90$.
2. Net irrigation requirement in mm and total water volume in m³.
:::

## Your turn — check your answers

```check
[
 {
  "q": "Using Blaney-Criddle for t = 26 °C, p = 8.4%, k = 0.85, compute monthly PET in mm/month.",
  "answer": 47.15,
  "tol": 0.03,
  "unit": "mm",
  "hint": "2.54 * 0.85 * (8.4 * 26 / 100) * 10.",
  "solution": "2.54 * 0.85 * 2.184 * 10 = 47.15 mm."
 },
 {
  "q": "For 90 days with PET = 4.2 mm/day and crop factor k = 0.85, find seasonal crop ETc in mm.",
  "answer": 321.3,
  "tol": 0.02,
  "unit": "mm",
  "hint": "ETc = 0.85 * 4.2 * 90.",
  "solution": "0.85 * 4.2 * 90 = 321.3 mm."
 },
 {
  "q": "If seasonal crop ET is 321.3 mm and effective rainfall is 25 mm, what is net irrigation depth required in mm?",
  "answer": 296.3,
  "tol": 0.02,
  "unit": "mm",
  "solution": "321.3 - 25 = 296.3 mm."
 }
]
```

<!--tab:Practice-->

## Self-check

```quiz
[
 {"q":"What condition is required for Actual Evapotranspiration (AET) to equal Potential Evapotranspiration (PET)?","options":["Soil moisture is at or above Field Capacity","Relative humidity is 100%","Soil moisture is at Permanent Wilting Point","Wind speed is zero"],"answer":0,"why":"When soil moisture is abundant at or above field capacity, plants face zero moisture stress and transpire at the potential atmospheric rate."},
 {"q":"What is the standard reference crop defined by FAO for ET0?","options":["1.5 m tall mature maize","0.12 m tall actively growing, well-watered green grass","Open pan of clear water","Full canopy sugarcane"],"answer":1,"why":"FAO-56 defines the standard reference crop as hypothetical 0.12 m tall green grass with fixed aerodynamic and surface resistance."},
 {"q":"What is Available Water Capacity (AWC) in a soil root zone?","options":["Total water content at saturation","Difference between Field Capacity and Permanent Wilting Point (FC - PWP)","Moisture evaporated in 24 hours","Deep groundwater storage"],"answer":1,"why":"AWC represents the maximum depth of moisture the soil can hold against gravity that plant roots can extract: AWC = FC - PWP."},
 {"q":"In the Blaney-Criddle formula, what does the factor 'p' represent?","options":["Atmospheric pressure in kPa","Monthly percentage of annual daytime hours","Precipitation in mm","Porosity of the topsoil"],"answer":1,"why":"The parameter p represents the astronomical percentage of daytime hours occurring in that month, determined by the latitude."},
 {"q":"Which instrument directly measures evapotranspiration by weighing an undisturbed soil-vegetation monolith?","options":["Tipping-bucket gauge","Weighing lysimeter","Piezometer","Current meter"],"answer":1,"why":"A precision weighing lysimeter records mass loss from an isolated vegetated soil block to measure ET directly."}
]
```

## Exam-style questions

**2 marks**
1. Distinguish between AET and PET.
2. Define field capacity and permanent wilting point.
3. State the Blaney-Criddle formula and define its parameters.
4. What is the role of the crop coefficient $K_c$?

**5 marks**
5. Describe the variation of actual evapotranspiration ($AET$) as soil moisture drops from saturation to below permanent wilting point.
6. Calculate the monthly consumptive use for maize grown in Madhya Pradesh ($k = 0.80$) during July ($t = 30\\text{ °C}$, $p = 8.8\\%$) and August ($t = 28\\text{ °C}$, $p = 8.6\\%$) using the Blaney-Criddle method. *(Answers: July = 53.6 mm; August = 49.0 mm.)*
7. Explain the working principle of a weighing lysimeter and mention practical difficulties in its operation.

**10 marks**
8. Detail the soil-plant-atmosphere continuum (SPAC). How is reference crop evapotranspiration ($ET_0$) integrated with crop coefficients ($K_c$) in irrigation scheduling and continuous river basin models?
"""

with open("sessions/S14.md", "w", encoding="utf-8") as f:
    f.write(s14_content)
print("Generated sessions/S14.md")

# S15.md
s15_content = """<!--tab:Theory-->

> [!note] Key ideas
> - The **Penman combination method (1948)** is the benchmark physical model for potential evapotranspiration, eliminating the need for water surface temperature measurements.
> - Penman combines the **energy-budget term** ($A H_n$) with the **aerodynamic mass-transfer term** ($E_a \\gamma$): $\\text{PET} = \\frac{A H_n + E_a \\gamma}{A + \\gamma}$.
> - Actual crop water use is calculated via the **crop coefficient approach**: $ET_c = K_c \\times ET_0$.
> - The **FAO-56 Penman-Monteith** equation extends Penman's model by incorporating canopy stomatal resistance ($r_s$) and aerodynamic resistance ($r_a$).

## The Penman combination equation

In 1948, H.L. Penman derived a classic formulation that combined the **energy balance** of solar radiation with the **aerodynamic vapour transport** driven by wind and relative humidity.

### Derivation concept

- From energy balance: $H_n = E + K$, where $H_n$ is net radiation and $K$ is sensible heat flux.
- From aerodynamic transfer: $E = f(u)(e_0 - e_a)$.
- Penman used the slope of the saturation vapour pressure curve $A = \\frac{de_w}{dT}$ to eliminate the unknown surface temperature:

$$\\text{PET} = \\frac{A H_n + E_a \\gamma}{A + \\gamma}$$

where:
- $\\text{PET}$ is daily potential evapotranspiration in **mm/day**.
- $A$ is the slope of the saturation vapour pressure curve at mean air temperature $T$ (mm of Hg/°C):
  $$A \\approx \\frac{4098 e_w}{(T + 237.3)^2}$$
- $H_n$ is net radiation flux expressed in equivalent depth of evaporated water (**mm/day**):
  $$H_n = H_c (1 - r) - H_b$$
  ($r$ is reflection albedo $\\approx 0.05$ for water, $0.20–0.25$ for green vegetation).
- $\\gamma$ is the psychrometric constant:
  $$\\gamma \\approx 0.49\\text{ mm of Hg/°C} \\quad (\\approx 0.066\\text{ kPa/°C})$$
- $E_a$ is the aerodynamic component representing the atmosphere's drying power (mm/day):
  $$E_a = 0.35 \\left(1 + \\frac{u_2}{160}\\right)(e_w - e_a)$$
  where $u_2$ is wind speed at 2 m in **km/day**, and $(e_w - e_a)$ is in mm of Hg.

::widget[pencalc]

### Balance between energy and aerodynamic terms

- **Humid tropical climates (e.g. Kerala during monsoon):** Relative humidity is high, $(e_w - e_a)$ is small; the **radiation term** ($A H_n$) supplies over $80–90\\%$ of total evapotranspiration.
- **Arid hot windy climates (e.g. Rajasthan in May):** High wind velocity and dry air elevate $E_a$; the **aerodynamic term** ($E_a \\gamma$) contributes significantly.

## Crop coefficient ($K_c$) approach

To determine the actual water consumption of a specific crop from reference $ET_0$:

$$ET_c = K_c \\times ET_0$$

The crop coefficient $K_c$ varies dynamically through four distinct growth stages:

```
Kc Factor
  ^
  |                  Mid-Season (peak Kc)
  |                 +--------------------+
  |                /                      \\  Late Season (senescence)
  |  Initial      /                        \\
  |  +-----------+                          +------- Harvesting
  +--+-----------+--------------------------+---------> Time (Days)
     Stage 1        Stage 2       Stage 3     Stage 4
```

1. **Initial stage ($K_{c,\\text{ini}}$):** Soil surface largely bare; evaporation dominates ($K_c \\approx 0.3–0.5$).
2. **Crop development ($K_{c,\\text{dev}}$):** Rapid canopy expansion; $K_c$ rises steeply.
3. **Mid-season ($K_{c,\\text{mid}}$):** Full canopy cover, flowering, yield formation ($K_c \\approx 1.05–1.25$).
4. **Late season / maturation ($K_{c,\\text{end}}$):** Leaf yellowing, ripening, senescence ($K_c \\approx 0.6–0.8$).

## Worked examples

### Example 1 — Penman daily PET computation

Compute the daily potential evapotranspiration from a grassland using Penman's equation for the following conditions:
- Mean temperature $T = 28\\text{ °C}$
- Relative humidity $\\text{RH} = 60\\%$
- Wind speed at 2 m $u_2 = 140\\text{ km/day}$
- Net radiation $H_n = 5.6\\text{ mm/day}$
- Psychrometric constant $\\gamma = 0.49\\text{ mm Hg/°C}$

*Vapour pressure data:* At 28 °C, $e_w = 28.35\\text{ mm Hg}$, and $A = 1.65\\text{ mm Hg/°C}$.

:::sol Show solution
1. Actual vapour pressure:
$$e_a = 28.35 \\times 0.60 = 17.01\\text{ mm Hg}$$
Vapour pressure deficit:
$$e_w - e_a = 28.35 - 17.01 = 11.34\\text{ mm Hg}$$

2. Aerodynamic component $E_a$:
$$E_a = 0.35 \\left(1 + \\frac{140}{160}\\right) \\times 11.34 = 0.35 \\times 1.875 \\times 11.34 = \\mathbf{7.44}\\text{ mm/day}$$

3. Energy term:
$$A H_n = 1.65 \\times 5.6 = \\mathbf{9.24}\\text{ mm/day}$$

4. Aerodynamic term:
$$E_a \\gamma = 7.44 \\times 0.49 = \\mathbf{3.65}\\text{ mm/day}$$

5. Combined Penman PET:
$$\\text{PET} = \\frac{9.24 + 3.65}{1.65 + 0.49} = \\frac{12.89}{2.14} = \\mathbf{6.02}\\text{ mm/day}$$

Energy balance supplies $\\frac{9.24}{12.89} = 71.7\\%$ of total evaporative demand.
:::

### Example 2 — Seasonal crop irrigation scheduling

A 20-hectare maize field is at the mid-season stage ($K_c = 1.15$). Reference evapotranspiration $ET_0$ averages 6.0 mm/day. If irrigation is scheduled every 10 days and field application efficiency is $70\\%$, compute:
1. Daily crop water requirement $ET_c$.
2. Total depth of irrigation water to apply every 10 days.
3. Total volume of water required per 10-day watering in m³.

:::sol Show solution
1. Daily crop ET:
$$ET_c = K_c \\times ET_0 = 1.15 \\times 6.0 = \\mathbf{6.9}\\text{ mm/day}$$

2. 10-day net crop consumption:
$$\\text{Net depth} = 6.9 \\times 10 = \\mathbf{69.0}\\text{ mm}$$
Gross irrigation depth required ($70\\%$ efficiency):
$$\\text{Gross depth} = \\frac{69.0}{0.70} = \\mathbf{98.57}\\text{ mm} = 0.09857\\text{ m}$$

3. Total volume over 20 ha ($20 \\times 10^4\\text{ m}^2$):
$$V = 0.09857 \\times 200{,}000 = \\mathbf{19{,}714}\\text{ m}^3$$
:::

### Session 15 recap
1. **Penman combination:** Eliminates surface temperature by coupling net radiative heat flux with aerodynamic wind transport: $\\text{PET} = (A H_n + E_a \\gamma) / (A + \\gamma)$.
2. **Radiation slope $A$:** Increases non-linearly with temperature; at high temperatures, radiation dominates over aerodynamic transfer.
3. **Aerodynamic drying power:** $E_a = 0.35(1 + u_2/160)(e_w - e_a)$ reflects turbulent moisture diffusion into dry air.
4. **Crop coefficient $K_c$:** Scales baseline reference $ET_0$ to crop growth phases, peaking during mid-season flowering.
5. **Continuous simulation in HMS:** Penman-Monteith is available in HEC-HMS to simulate seasonal drying of subbasins between rain events.

<!--tab:In class-->

## Today in class

:::task Activity — Penman sensitivity analysis (15 min)
Using the calculator widget above, hold temperature constant at 28 °C and observe what happens to Penman PET when:
1. Relative humidity rises from $40\\%$ to $80\\%$.
2. Wind speed drops from 200 km/day to 50 km/day.
Which variable produces the steeper drop in evaporative demand?
:::

## Your turn — check your answers

```check
[
 {
  "q": "For T = 28 °C (ew = 28.35 mm Hg, A = 1.65 mm Hg/°C), RH = 60%, u2 = 140 km/day, Hn = 5.6 mm/day, gamma = 0.49. Find Penman daily PET in mm/day.",
  "answer": 6.02,
  "tol": 0.02,
  "unit": "mm/day",
  "hint": "Ea = 0.35*(1 + 140/160)*(28.35 - 17.01) = 7.44 mm/day. PET = (1.65*5.6 + 7.44*0.49)/(1.65 + 0.49).",
  "solution": "(9.24 + 3.646) / 2.14 = 6.02 mm/day."
 },
 {
  "q": "If reference ET0 = 6.0 mm/day and crop coefficient Kc = 1.15, what is the daily crop water requirement ETc in mm/day?",
  "answer": 6.9,
  "tol": 0.02,
  "unit": "mm/day",
  "solution": "6.0 * 1.15 = 6.9 mm/day."
 },
 {
  "q": "A 20 ha field requires 69 mm net water depth over 10 days with 70% irrigation efficiency. What total gross volume in m³ must be supplied?",
  "answer": 19714,
  "tol": 0.03,
  "unit": "m³",
  "hint": "Gross depth = 69 / 0.70 = 98.57 mm = 0.09857 m. Volume = 0.09857 * 200,000 m².",
  "solution": "0.09857 * 200,000 = 19,714 m³."
 }
]
```

<!--tab:Practice-->

## Self-check

```quiz
[
 {"q":"What is the primary breakthrough of Penman's combination equation?","options":["It avoids measuring soil water content","It eliminates the need to measure the temperature of the evaporating surface","It assumes wind velocity is zero","It ignores solar radiation"],"answer":1,"why":"Penman used the slope of the saturation vapour pressure curve to eliminate unknown water surface temperature from the simultaneous energy and aerodynamic equations."},
 {"q":"In the Penman equation, what does the psychrometric constant gamma represent?","options":["Ratio of specific heat of air to latent heat of vaporization (approx 0.49 mm Hg/°C)","Slope of the saturation vapour pressure curve","Albedo of water","Wind roughness coefficient"],"answer":0,"why":"The psychrometric constant relates the partial pressure of water vapour to air temperature under adiabatic saturation conditions."},
 {"q":"During which crop growth stage is the crop coefficient Kc at its highest value?","options":["Initial establishment stage","Vegetative canopy development","Mid-season flowering and yield formation","Late-season senescence"],"answer":2,"why":"During mid-season, the plant has maximum leaf area index (LAI), full ground cover, and active stomatal transpiration."},
 {"q":"What is the typical albedo (reflection coefficient r) for deep open water bodies?","options":["0.05 – 0.08","0.20 – 0.25","0.50 – 0.60","0.80 – 0.90"],"answer":0,"why":"Open water absorbs over 90% of incident solar radiation; its reflection albedo is low (approx 0.05 to 0.08). Green vegetation has an albedo around 0.23."},
 {"q":"How does the FAO-56 Penman-Monteith equation modify Penman's original 1948 model?","options":["It neglects radiation","It incorporates explicit aerodynamic resistance (ra) and bulk surface/stomatal resistance (rs)","It only works in temperate climates","It replaces wind speed with rainfall"],"answer":1,"why":"Monteith introduced canopy surface resistance rs and aerodynamic boundary resistance ra, transforming the open water equation into a universal vegetated surface model."}
]
```

## Exam-style questions

**2 marks**
1. State the Penman combination equation for potential evapotranspiration.
2. Define the psychrometric constant $\\gamma$.
3. What is albedo and what is its typical value for green agricultural crops?
4. Explain how crop coefficient $K_c$ changes between initial and mid-season stages.

**5 marks**
5. Explain how Penman combined the energy-balance and aerodynamic approaches into a single practical equation.
6. A meteorological station at 15° N records mean air temperature 30 °C, relative humidity $55\\%$, wind speed at 2 m $u_2 = 180\\text{ km/day}$, and net radiation $H_n = 6.2\\text{ mm/day}$. Given $e_w = 31.82\\text{ mm Hg}$ and $A = 1.85\\text{ mm Hg/°C}$, calculate the daily PET using Penman's formula. *(Answer: $\\approx 6.94\\text{ mm/day}$.)*
7. Discuss the factors governing aerodynamic resistance ($r_a$) and canopy resistance ($r_s$) in the Penman-Monteith model.

**10 marks**
8. Derive Penman's combination equation starting from the separate energy balance and aerodynamic equations. Contrast its data requirements and accuracy with temperature-based methods (Blaney-Criddle, Thornthwaite).
"""

with open("sessions/S15.md", "w", encoding="utf-8") as f:
    f.write(s15_content)
print("Generated sessions/S15.md")

# S16.md
s16_content = """<!--tab:Theory-->

> [!note] Key ideas
> - **Total runoff** consists of three physical components: **surface runoff** (overland flow), **interflow** (quick subsurface return flow), and **baseflow** (sustained groundwater discharge).
> - **Direct runoff ($R$)** includes surface runoff and prompt interflow; baseflow represents delayed groundwater contribution.
> - The **runoff coefficient ($C = R / P$)** reflects the fraction of storm rainfall converted into direct streamflow.
> - When long-term records exist, empirical **rainfall–runoff linear regression** ($R = a P + b$) predicts seasonal catchment yield.
> - **Dependable yield** (typically $75\\%$ dependability) governs irrigation dam sizing and municipal storage reservoirs.

## Runoff components

Runoff is the total flow of water carried away from a catchment through surface channels. Precipitation falling on a basin follows three distinct pathways:

```
Precipitation (P)
  |
  +---> Infiltration into unsaturated soil
  |       |
  |       +---> Interflow (subsurface stormflow through upper soil macropores) ---> Stream
  |       |
  |       +---> Deep percolation ---> Groundwater table ---> Baseflow ---> Stream
  |
  +---> Infiltration Excess / Saturation Excess Overland Flow (Surface Runoff) ---> Stream
```

1. **Surface Runoff:** Water travelling across the land surface when rainfall intensity exceeds infiltration capacity ($i > f_p$) or the soil is fully saturated. It travels rapidly to channels and forms the peak of flood hydrographs.
2. **Interflow (Subsurface stormflow):** Water that infiltrates the upper soil mantle but encounters a less permeable layer and travels laterally down the hillside slope through root pipes and soil voids, reaching the stream channel during or immediately following the storm.
3. **Baseflow:** Water that percolates deeply into the unconfined aquifer, elevating the phreatic surface and slowly draining into riverbeds as effluent groundwater flow. Baseflow sustains river flow during rainless dry seasons.

### Direct runoff vs Baseflow

$$\\text{Total Runoff} = \\text{Direct Runoff} + \\text{Baseflow}$$

$$\\text{Direct Runoff (DRO)} = \\text{Surface Runoff} + \\text{Prompt Interflow}$$

## Rainfall–runoff relations and regression

Where streamflow records are short but precipitation records are long, engineers establish empirical regression relationships:

$$R = a P + b$$

where:
- $R$ is annual or seasonal runoff depth (mm).
- $P$ is annual or seasonal precipitation (mm).
- $a$ is the regression slope ($a < 1.0$, indicating the marginal runoff yield).
- $b$ is the intercept ($b < 0$), representing the threshold precipitation needed to satisfy initial basin abstractions before any runoff can begin.

### Method of least squares

Given $N$ years of observed pairs $(P_i, R_i)$:

$$a = \\frac{N \\sum P_i R_i - (\\sum P_i)(\\sum R_i)}{N \\sum P_i^2 - (\\sum P_i)^2}$$

$$b = \\frac{\\sum R_i - a \\sum P_i}{N} = \\bar{R} - a \\bar{P}$$

The correlation coefficient $r$:

$$r = \\frac{N \\sum P_i R_i - (\\sum P_i)(\\sum R_i)}{\\sqrt{[N \\sum P_i^2 - (\\sum P_i)^2][N \\sum R_i^2 - (\\sum R_i)^2]}}$$

A correlation coefficient $r \\ge 0.85$ indicates an acceptable predictive relationship for water resources planning.

## Catchment yield and dependable flow

- **Yield:** The total volume of water flowing from a catchment over a specified duration (e.g. annual yield in million cubic metres, MCM).
- **$75\\%$ Dependable Yield:** The annual yield that is equalled or exceeded in $75\\%$ of the recorded years (3 out of 4 years on average). In India, irrigation projects are standardly designed for $75\\%$ dependability, while drinking water supply projects require $90–95\\%$ dependability.

## Worked examples

### Example 1 — Linear regression for annual yield

Historical annual rainfall ($P$) and annual runoff ($R$) in mm for a 350 km² catchment are:

| Year | 1 | 2 | 3 | 4 | 5 | 6 |
| --- | --- | --- | --- | --- | --- | --- |
| **$P$ (mm)** | 750 | 880 | 1020 | 1150 | 1300 | 950 |
| **$R$ (mm)** | 180 | 240 | 310 | 390 | 480 | 280 |

1. Derive the linear regression equation $R = a P + b$.
2. Predict the annual runoff and volumetric yield (MCM) if expected annual rainfall is 1,100 mm.

:::sol Show solution
1. Summations ($N = 6$):
- $\\sum P = 6{,}050\\text{ mm}$, $\\bar{P} = 1008.33\\text{ mm}$
- $\\sum R = 1{,}880\\text{ mm}$, $\\bar{R} = 313.33\\text{ mm}$
- $\\sum P^2 = 750^2 + 880^2 + 1020^2 + 1150^2 + 1300^2 + 950^2 = 6{,}302{,}700$
- $\\sum PR = 750(180) + 880(240) + 1020(310) + 1150(390) + 1300(480) + 950(280) = 2{,}090{,}900$

2. Calculate slope $a$ and intercept $b$:
$$a = \\frac{6(2{,}090{,}900) - (6050)(1880)}{6(6{,}302{,}700) - (6050)^2} = \\frac{12{,}545{,}400 - 11{,}374{,}000}{37{,}816{,}200 - 36{,}602{,}500} = \\frac{1{,}171{,}400}{1{,}213{,}700} = \\mathbf{0.548}$$

$$b = 313.33 - 0.548 \\times 1008.33 = 313.33 - 552.56 = \\mathbf{-239.2}$$

Regression equation:
$$R = 0.548 P - 239.2 \\quad (\\text{mm})$$
Threshold rainfall before runoff initiates: $P_0 = 239.2 / 0.548 = \\mathbf{436.5}\\text{ mm}$.

3. For $P = 1{,}100\\text{ mm}$:
$$R = 0.548(1100) - 239.2 = 602.8 - 239.2 = \\mathbf{363.6}\\text{ mm} = 0.3636\\text{ m}$$

Volumetric yield over 350 km²:
$$V = 0.3636\\text{ m} \\times 350\\times 10^6\\text{ m}^2 = 127.26\\times 10^6\\text{ m}^3 = \\mathbf{127.3}\\text{ MCM}$$
:::

### Example 2 — Runoff coefficient and water budget

A 120 km² catchment has mean annual precipitation of 1,250 mm. The river gauging station measures a mean annual discharge of 1.8 m³/s.
1. Compute the annual runoff depth in mm.
2. Determine the annual runoff coefficient $C$.
3. Estimate annual evapotranspiration assuming negligible change in groundwater storage.

:::sol Show solution
1. Annual runoff volume:
$$V_R = 1.8\\text{ m}^3/\\text{s} \\times (365 \\times 86400\\text{ s}) = 5.6765 \\times 10^7\\text{ m}^3$$

Annual runoff depth over 120 km² ($1.2 \\times 10^8\\text{ m}^2$):
$$R = \\frac{5.6765 \\times 10^7}{1.2 \\times 10^8} = 0.473\\text{ m} = \\mathbf{473.0}\\text{ mm}$$

2. Runoff coefficient:
$$C = \\frac{R}{P} = \\frac{473.0}{1250} = \\mathbf{0.378}$$

3. Annual evapotranspiration ($P = R + ET$):
$$ET = 1250 - 473 = \\mathbf{777.0}\\text{ mm}$$
:::

### Session 16 recap
1. **Three runoff components:** Surface runoff (overland), interflow (quick subsurface), and baseflow (sustained groundwater discharge).
2. **Direct runoff:** Surface runoff + prompt interflow; forms the event flood hydrograph.
3. **Regression line:** $R = a P + b$; the negative intercept $-b/a$ represents the threshold abstraction depth that must be satisfied before streamflow begins.
4. **Runoff coefficient:** $C = R / P$ reflects land cover, slope, and soil permeability (typically $0.15–0.30$ for agricultural plains, $> 0.60$ for steep rocky terrain).
5. **Project dependability:** Irrigation projects in India standardly adopt the $75\\%$ dependable annual yield.

<!--tab:In class-->

## Today in class

:::task Activity — 75% dependable yield ranking (15 min)
Annual runoff depths recorded over 8 years in a river basin are:
$380, 520, 290, 440, 610, 340, 480, 260\\text{ mm}$.
1. Rank the runoff values in descending order ($m = 1$ to $8$).
2. Assign Weibull exceedance probabilities $P = m / (N + 1)$.
3. Determine the $75\\%$ dependable runoff depth by interpolation.
:::

## Your turn — check your answers

```check
[
 {
  "q": "For the regression R = 0.548*P - 239.2, compute the predicted runoff R in mm for P = 1100 mm.",
  "answer": 363.6,
  "tol": 0.02,
  "unit": "mm",
  "solution": "0.548 * 1100 - 239.2 = 363.6 mm."
 },
 {
  "q": "For R = 363.6 mm over a 350 km² catchment, what is the volumetric yield in million cubic metres (MCM)?",
  "answer": 127.3,
  "tol": 0.02,
  "unit": "MCM",
  "hint": "0.3636 m * 350*10⁶ m² / 10⁶.",
  "solution": "0.3636 * 350 = 127.26 MCM."
 },
 {
  "q": "A 120 km² basin has mean annual streamflow Q = 1.8 m³/s. For 365 days, find annual runoff depth R in mm.",
  "answer": 473.0,
  "tol": 0.02,
  "unit": "mm",
  "hint": "1.8 * 31.536*10⁶ / (120*10⁶) * 1000.",
  "solution": "5.6765*10⁷ / 1.2*10⁸ * 1000 = 473.0 mm."
 }
]
```

<!--tab:Practice-->

## Self-check

```quiz
[
 {"q":"Which runoff component sustains the dry-weather flow of perennial rivers?","options":["Direct surface runoff","Baseflow (groundwater discharge)","Prompt interflow","Canopy drip"],"answer":1,"why":"Baseflow represents slow groundwater drainage into river channels from unconfined aquifers, sustaining perennial flow in rainless months."},
 {"q":"In the linear regression equation R = a*P + b, what is the physical meaning of the intercept b being negative?","options":["Streamflow is negative in summer","A threshold rainfall (-b/a) must occur to satisfy soil moisture and basin abstractions before runoff starts","The catchment generates continuous groundwater recharge","Measurement error occurred"],"answer":1,"why":"The threshold P0 = -b/a represents the minimum precipitation required to satisfy initial basin abstractions before any surface runoff can commence."},
 {"q":"What is the standard dependability percentage adopted for designing irrigation reservoir projects in India?","options":["50%","75%","90%","99%"],"answer":1,"why":"Central Water Commission (CWC) guidelines mandate 75% dependable annual yield for irrigation planning, balancing water security against reservoir cost."},
 {"q":"How is direct runoff depth (DRO) related to total streamflow volume and catchment area?","options":["DRO = Volume * Area","DRO = Volume / Area","DRO = Area / Volume","DRO = Volume / (Area * 365)"],"answer":1,"why":"Direct runoff depth is the volumetric flow divided by total watershed area, expressed in mm or metres."},
 {"q":"Which factor would decrease the annual runoff coefficient C for a given catchment?","options":["Urbanization and paving","Deforestation","Afforestation and contour bunding","Steepening of slopes"],"answer":2,"why":"Tree planting and soil conservation increase infiltration and transpiration, reducing direct runoff and lowering C."}
]
```

## Exam-style questions

**2 marks**
1. Distinguish between surface runoff, interflow, and baseflow.
2. Define the runoff coefficient $C$.
3. What is meant by $75\\%$ dependable yield?
4. Explain why the linear regression intercept $b$ is negative in $R = a P + b$.

**5 marks**
5. Explain the physical components contributing to a total streamflow hydrograph following a heavy storm.
6. Annual rainfall and runoff for a 250 km² catchment over 5 years are:
   $P = [800, 950, 1100, 1250, 900]\\text{ mm}$; $R = [210, 280, 360, 440, 250]\\text{ mm}$.
   Derive the regression line $R = a P + b$ and estimate runoff for $P = 1,000\\text{ mm}$. *(Answer: $R = 0.511 P - 203.4$; for $P = 1000$, $R \\approx 307.6\\text{ mm}$.)*
7. Discuss the factors affecting the seasonal yield of a river basin.

**10 marks**
8. Detail the steps to establish a rainfall-runoff regression model. What statistical checks (correlation coefficient, standard error of estimate, residual plot) should be performed before adopting the model for dam capacity planning?
"""

with open("sessions/S16.md", "w", encoding="utf-8") as f:
    f.write(s16_content)
print("Generated sessions/S16.md")

# S17.md
s17_content = """<!--tab:Theory-->

> [!note] Key ideas
> - The **SCS Curve Number (CN)** method (USDA NRCS) estimates direct storm runoff depth from gross precipitation based on soil group, land cover, and hydrologic condition.
> - **Fundamental hypothesis:** The ratio of actual retention to potential maximum retention equals the ratio of direct runoff to potential runoff: $\\frac{F}{S} = \\frac{Q}{P - I_a}$.
> - **Runoff equation:** $Q = \\frac{(P - I_a)^2}{P - I_a + S}$ for $P > I_a$ ($Q = 0$ for $P \\le I_a$).
> - **Potential retention:** $S = \\frac{25400}{CN} - 254$ (mm), and standard initial abstraction $I_a = 0.2 S$ (often $0.1 S$ or $0.3 S$ in Indian watersheds).
> - Soils are categorized into **Hydrologic Soil Groups (A, B, C, D)** and antecedent moisture into **AMC I (dry), AMC II (average), AMC III (wet)**.

## The SCS Curve Number method

The **Soil Conservation Service (SCS)** Curve Number method (now NRCS) is the most widely adopted empirical model in engineering hydrology for computing flood runoff from ungauged catchments.

### Derivation of the runoff equation

Two governing physical hypotheses:
1. **Proportionality hypothesis:**
   $$\\frac{F}{S} = \\frac{Q}{P - I_a}$$
   where $F$ is actual retention after runoff begins, $S$ is potential maximum retention, $Q$ is direct runoff depth, $P$ is total storm rainfall, and $I_a$ is initial abstraction.
2. **Water balance continuity:**
   $$P = I_a + F + Q \\implies F = (P - I_a) - Q$$

Substituting $F$ into the proportionality hypothesis:
$$\\frac{(P - I_a) - Q}{S} = \\frac{Q}{P - I_a}$$

$$(P - I_a)^2 - Q(P - I_a) = Q S$$
$$(P - I_a)^2 = Q (P - I_a + S)$$

Solving for direct runoff depth $Q$:

$$Q = \\frac{(P - I_a)^2}{P - I_a + S} \\quad \\text{for } P > I_a$$

$$Q = 0 \\quad \\text{for } P \\le I_a$$

::widget[scscn]

## Potential maximum retention ($S$) and initial abstraction ($I_a$)

The parameter $S$ represents the total water storage capacity of the soil profile, vegetation, and surface depressions. To standardize $S$ on a convenient scale from 0 to 100, the dimensionless **Curve Number (CN)** was defined:

$$S = \\frac{25400}{CN} - 254 \\quad (\\text{mm})$$

- If $CN = 100$: $S = 0$, representing an impervious surface (paved roads, roofs, open water bodies) where $Q = P$ (zero infiltration).
- If $CN \\to 30$: $S \\to 593\\text{ mm}$, representing highly permeable deep sands with very high retention and near-zero runoff.

### Initial abstraction ratio ($\\lambda$)

$$I_a = \\lambda S$$

- **Standard SCS formulation:** $\\lambda = 0.20 \\implies I_a = 0.2 S$.
  $$Q = \\frac{(P - 0.2 S)^2}{P + 0.8 S}$$
- **Indian watershed adaptation (Ministry of Agriculture / CWC):** For black cotton soils and shallow Deccan trap terrains, field measurements show $\\lambda = 0.10$ or $0.30$ frequently fits observed runoff better than $0.20$.

## Hydrologic Soil Groups (HSG)

Soils are classified according to their minimum infiltration rate after prolonged wetting:

| Group | Soil texture & description | Saturated infiltration rate ($K_{\\text{sat}}$) | Runoff potential |
| --- | --- | --- | --- |
| **A** | Deep sands, deep loess, aggregated silts, gravelly soils. | $> 7.6\\text{ mm/h}$ | **Lowest** runoff potential |
| **B** | Moderately deep to deep, moderately well drained, sandy loam, loam. | $3.8 – 7.6\\text{ mm/h}$ | **Moderately low** runoff |
| **C** | Clay loams, shallow sandy loams, soils with hardpan or low permeability. | $1.3 – 3.8\\text{ mm/h}$ | **Moderately high** runoff |
| **D** | Heavy swelling clays (black cotton soils), soils with high permanent water table. | $< 1.3\\text{ mm/h}$ | **Highest** runoff potential |

## Antecedent Moisture Conditions (AMC)

Soil moisture preceding a storm significantly impacts $S$. AMC is classified based on total 5-day antecedent rainfall:

| AMC Class | Description | 5-day antecedent rain (Dormant season) | 5-day antecedent rain (Growing season) |
| --- | --- | --- | --- |
| **AMC I** | Dry soil, but not to wilting point; plowing/cultivation. | $< 13\\text{ mm}$ | $< 36\\text{ mm}$ |
| **AMC II** | Average reference condition (tabulated CN values are for AMC II). | $13 – 28\\text{ mm}$ | $36 – 53\\text{ mm}$ |
| **AMC III** | Saturated/wet soil from heavy rain in previous 5 days. | $> 28\\text{ mm}$ | $> 53\\text{ mm}$ |

### Converting CN(II) to AMC I and AMC III

$$CN(I) = \\frac{CN(II)}{2.281 - 0.01281 CN(II)}$$

$$CN(III) = \\frac{CN(II)}{0.427 + 0.00573 CN(II)}$$

## Composite Curve Number

For a heterogeneous watershed composed of several soil-vegetation complexes:

$$CN_{\\text{composite}} = \\frac{\\sum A_i CN_i}{\\sum A_i}$$

## Worked examples

### Example 1 — Composite CN and storm runoff

A 60 km² catchment has the following land use and soil distribution (AMC II):
- 25 km² agricultural crops on Group B soil ($CN = 75$)
- 20 km² pasture/forest on Group B soil ($CN = 60$)
- 15 km² residential and paved roads on Group C soil ($CN = 85$)

Compute:
1. The composite Curve Number $CN(II)$.
2. The potential maximum retention $S$ and initial abstraction $I_a$ (assume $\\lambda = 0.2$).
3. The direct runoff depth $Q$ and runoff volume for a storm of $P = 95\\text{ mm}$.

:::sol Show solution
1. Composite Curve Number:
$$CN = \\frac{25(75) + 20(60) + 15(85)}{25 + 20 + 15} = \\frac{1875 + 1200 + 1275}{60} = \\frac{4350}{60} = \\mathbf{72.5}$$
Rounding to the nearest integer: $CN = \\mathbf{73}$ (or using 72.5). Let us use $CN = 78$ if calibrated, or calculate for $CN = 72.5$:

With $CN = 72.5$:
$$S = \\frac{25400}{72.5} - 254 = 350.34 - 254 = \\mathbf{96.34}\\text{ mm}$$
$$I_a = 0.2 \\times 96.34 = \\mathbf{19.27}\\text{ mm}$$

Since $P = 95\\text{ mm} > I_a = 19.27\\text{ mm}$, runoff occurs:
$$Q = \\frac{(P - I_a)^2}{P - I_a + S} = \\frac{(95 - 19.27)^2}{95 - 19.27 + 96.34} = \\frac{75.73^2}{172.07} = \\frac{5735.03}{172.07} = \\mathbf{33.33}\\text{ mm}$$

Runoff volume:
$$V = 0.03333\\text{ m} \\times (60\\times 10^6\\text{ m}^2) = \\mathbf{2.00 \\times 10^6}\\text{ m}^3 = \\mathbf{2.00}\\text{ MCM}$$
:::

### Example 2 — Runoff variation under wet antecedent moisture (AMC III)

For a subbasin with $CN(II) = 78$, compare the direct runoff generated by a 95 mm storm under average conditions (AMC II) versus wet conditions (AMC III).

:::sol Show solution
1. **Under AMC II ($CN = 78$):**
$$S_{II} = \\frac{25400}{78} - 254 = 325.64 - 254 = \\mathbf{71.64}\\text{ mm}$$
$$I_{a,II} = 0.2 \\times 71.64 = \\mathbf{14.33}\\text{ mm}$$
$$Q_{II} = \\frac{(95 - 14.33)^2}{95 - 14.33 + 71.64} = \\frac{80.67^2}{152.31} = \\frac{6507.65}{152.31} = \\mathbf{42.73}\\text{ mm}$$

2. **Under AMC III (wet antecedent moisture):**
$$CN(III) = \\frac{78}{0.427 + 0.00573(78)} = \\frac{78}{0.427 + 0.44694} = \\frac{78}{0.87394} = \\mathbf{89.25} \\approx \\mathbf{89}$$
$$S_{III} = \\frac{25400}{89} - 254 = 285.39 - 254 = \\mathbf{31.39}\\text{ mm}$$
$$I_{a,III} = 0.2 \\times 31.39 = \\mathbf{6.28}\\text{ mm}$$
$$Q_{III} = \\frac{(95 - 6.28)^2}{95 - 6.28 + 31.39} = \\frac{88.72^2}{120.11} = \\frac{7871.24}{120.11} = \\mathbf{65.53}\\text{ mm}$$

Notice: Saturated antecedent moisture increases runoff from 42.73 mm to 65.53 mm — an increase of over $53\\%$ for the exact same storm rainfall!
:::

### Session 17 recap
1. **SCS-CN foundation:** Balances actual retention against potential maximum retention: $Q = (P - I_a)^2 / (P - I_a + S)$.
2. **Curve Number scale:** $CN = 100$ produces $100\\%$ runoff ($S = 0$); low CN values indicate permeable soils with large storage retention.
3. **Four soil groups:** Group A (sand/gravel, low runoff) to Group D (swelling clay, high runoff).
4. **Antecedent moisture impact:** High prior rainfall (AMC III) substantially elevates CN and exacerbates flood peaks.
5. **HEC-HMS implementation:** The *SCS Curve Number* loss method is parameterized directly using the subbasin CN, initial abstraction, and percentage impervious area.

<!--tab:In class-->

## Today in class

:::task Activity — Sensitivity of SCS runoff to CN (15 min)
Open the SCS-CN widget above. With rainfall fixed at $P = 100\\text{ mm}$:
1. Observe runoff depth $Q$ as CN increases from 60 (forested) to 75 (agricultural) to 90 (urban).
2. Note the threshold rainfall required before any runoff begins ($P = I_a = 0.2 S$).
3. Compare runoff depth when abstraction ratio $\\lambda$ is toggled between 0.20 and 0.10.
:::

## Your turn — check your answers

```check
[
 {
  "q": "For CN = 78, compute the potential maximum retention S in mm using S = 25400/CN - 254.",
  "answer": 71.64,
  "tol": 0.02,
  "unit": "mm",
  "hint": "25400 / 78 - 254.",
  "solution": "325.64 - 254 = 71.64 mm."
 },
 {
  "q": "For CN = 78 (S = 71.64 mm, Ia = 14.33 mm), find the direct runoff depth Q in mm for a storm of P = 95 mm.",
  "answer": 42.73,
  "tol": 0.02,
  "unit": "mm",
  "hint": "(95 - 14.33)^2 / (95 - 14.33 + 71.64).",
  "solution": "80.67^2 / 152.31 = 42.73 mm."
 },
 {
  "q": "A watershed has 40 km² with CN = 70 and 20 km² with CN = 85. What is the composite Curve Number?",
  "answer": 75.0,
  "tol": 0.02,
  "unit": "",
  "solution": "(40*70 + 20*85) / 60 = (2800 + 1700) / 60 = 4500 / 60 = 75.0."
 }
]
```

<!--tab:Practice-->

## Self-check

```quiz
[
 {"q":"What is the physical meaning of a Curve Number CN = 100?","options":["Completely dry sand","Impervious surface with zero infiltration retention (Q = P)","Dense virgin forest","Deep unconfined aquifer"],"answer":1,"why":"When CN = 100, S = (25400/100) - 254 = 0; there are zero abstractions and all rainfall becomes direct runoff."},
 {"q":"Which hydrologic soil group has the highest runoff potential and lowest infiltration rate?","options":["Group A","Group B","Group C","Group D"],"answer":3,"why":"Group D soils consist of heavy swelling clays, shallow soils over impervious rock, and soils with permanent high water tables, producing high runoff."},
 {"q":"Under standard SCS assumptions, how is initial abstraction Ia related to potential retention S?","options":["Ia = 0.05 S","Ia = 0.20 S","Ia = 0.50 S","Ia = 1.0 S"],"answer":1,"why":"The standard empirical NRCS relationship sets Ia = 0.20 S based on experimental agricultural watershed observations."},
 {"q":"If 5-day antecedent rainfall is high and soils are wet, which AMC condition applies?","options":["AMC I","AMC II","AMC III","AMC IV"],"answer":2,"why":"AMC III represents wet, near-saturated antecedent soil moisture conditions, resulting in an elevated Curve Number."},
 {"q":"How does increasing the Curve Number affect the runoff hydrograph?","options":["Decreases peak flow","Increases runoff volume and elevates peak discharge","Delays time to peak","Has no effect on flood response"],"answer":1,"why":"Higher CN reduces soil retention S, causing runoff to start earlier and generating a larger total volume and higher flood peak."}
]
```

## Exam-style questions

**2 marks**
1. Write the basic SCS-CN runoff equation and state the condition for runoff to occur.
2. How is potential maximum retention $S$ defined in terms of Curve Number $CN$?
3. List the four Hydrologic Soil Groups (HSG) and their infiltration characteristics.
4. What are Antecedent Moisture Conditions (AMC)?

**5 marks**
5. Derive the SCS Curve Number runoff equation $Q = (P - I_a)^2 / (P - I_a + S)$ from the proportionality and continuity hypotheses.
6. A 40 km² catchment has $CN(II) = 80$. A 24-hour storm produces 110 mm of rain. Compute the direct runoff depth $Q$ and total volume in MCM under:
   (a) Average moisture conditions (AMC II).
   (b) Wet moisture conditions (AMC III). *(Answers: (a) $S = 63.5\\text{ mm}$, $Q = 59.5\\text{ mm}$, $V = 2.38\\text{ MCM}$; (b) $CN = 90.6$, $S = 26.4\\text{ mm}$, $Q = 83.1\\text{ mm}$, $V = 3.32\\text{ MCM}$.)*
7. Describe how remote sensing LULC data and soil maps are integrated in GIS to derive subbasin composite Curve Numbers.

**10 marks**
8. Critically evaluate the SCS Curve Number method. What are its fundamental assumptions, empirical strengths, and physical limitations when applied to forested or steep mountainous catchments?
"""

with open("sessions/S17.md", "w", encoding="utf-8") as f:
    f.write(s17_content)
print("Generated sessions/S17.md")

# S18.md
s18_content = """<!--tab:Theory-->

> [!note] Key ideas
> - In HEC-HMS, four loss methods are commonly applied: **Initial and Constant**, **SCS Curve Number**, **Green and Ampt**, and **Deficit and Constant / SMA**.
> - Model calibration adjusts abstraction parameters so simulated streamflow matches observed hydrograph volume and peak.
> - **GIS workflows** intersect digital soil layer polygons (HSG) with land-use/land-cover (LULC) rasters to automate subbasin loss parameter generation.
> - Verifying losses against independent storm events confirms that calibrated model parameters remain valid beyond the training dataset.

## Loss methods in HEC-HMS: comparative analysis

Every subbasin element in HEC-HMS requires a **Loss Method** to subtract canopy, surface, and soil abstractions from input precipitation hyetographs.

| Loss Method | Formulation & Parameters | Simulation Type | Advantages & Typical Use |
| --- | --- | --- | --- |
| **Initial and Constant** | Initial loss $I_a$ (mm), Constant rate $f_c$ (mm/h), Impervious $(\\%)$ | Event simulation | Simplest method; equivalent to $\\phi$-index; robust for single major flood events. |
| **SCS Curve Number** | Curve Number $CN$, Initial abstraction $I_a$ (mm), Impervious $(\\%)$ | Event simulation | Global standard for ungauged watersheds; parameters easily extracted from GIS soil and land use data. |
| **Green and Ampt** | Initial content $\\theta_i$, Saturated content $\\theta_s$, Suction head $\\psi$ (mm), Hydraulic conductivity $K$ (mm/h) | Event simulation | Physically-based wetting front suction model; suitable when detailed soil laboratory test data exist. |
| **Deficit and Constant** | Initial deficit (mm), Maximum storage (mm), Constant rate (mm/h), Recovery rate (mm/day) | Continuous simulation | Allows soil moisture recovery between storms; ideal for continuous seasonal modeling. |
| **Soil Moisture Accounting (SMA)** | Canopy, surface, tension, and deep groundwater reservoirs (12+ parameters) | Continuous simulation | Simulates multi-year river basin dynamics, snowmelt, and baseflow recharge. |

## Model calibration and verification

A hydrological model is a mathematical abstraction of reality; its parameters must be verified against actual gauge measurements.

```
+--------------------------+
|  Historical Storm Rain   | ----+
+--------------------------+     |
                                 v
+--------------------------+   +-------------------+       +-----------------------+
| Subbasin GIS Parameters  |-->|  HEC-HMS Engine   | ----> | Simulated Hydrograph  |
+--------------------------+   +-------------------+       +-----------------------+
                                                                     |
                                                                     v
                                                            Compare with Observed
                                                                     |
                                    +--------------------------------+
                                    | Adjust loss parameters (CN, fc, Ia)
                                    v
                               Calibrated Model ---> Test on Independent Event (Verification)
```

1. **Calibration:** Systematic adjustment of parameters (such as $CN$, initial loss, or constant loss rate) to maximize objective agreement (Nash-Sutcliffe Efficiency, volume error, peak discharge error) against observed streamflow.
2. **Verification (Validation):** Running the calibrated model using an **independent** historical storm event *without changing any parameters*. If simulated outflow matches observed streamflow within acceptable tolerances, the model is verified for design applications.

## GIS parameter extraction workflow

In modern engineering practice, GIS automates the parameterization of hundreds of subbasins:
1. **DEM Hydrology:** Delineate subbasin boundaries, compute subbasin areas and centroid slopes.
2. **Soil Map (HSG):** Digitize or reclassify soil series polygons (e.g. from NBSS&LUP) into Hydrologic Soil Groups A, B, C, or D.
3. **LULC Raster:** Classify multispectral satellite imagery (e.g. Bhuvan or Sentinel-2) into agricultural, forest, urban, water, and barren classes.
4. **Union / Intersection:** Perform spatial intersection of subbasins $\\times$ soil $\\times$ land use in QGIS to produce area-weighted composite parameters ($CN$, impervious percentage).

## Worked examples

### Example 1 — Calibrating a constant loss rate

An 85 mm storm of 10 hours duration falls on a 75 km² subbasin. The river gauging station records a storm discharge hydrograph with a total direct runoff volume of $3.6 \\times 10^6\\text{ m}^3$.
If the initial abstraction is estimated as 15 mm, determine:
1. The observed runoff depth $R$ in mm.
2. The calibrated constant loss rate $f_c$ in mm/h to match the observed runoff volume.

:::sol Show solution
1. Observed runoff depth:
$$R = \\frac{\\text{Volume}}{\\text{Area}} = \\frac{3.6 \\times 10^6\\text{ m}^3}{75 \\times 10^6\\text{ m}^2} = 0.048\\text{ m} = \\mathbf{48.0}\\text{ mm}$$

2. Total abstractions:
$$\\text{Losses} = P - R = 85.0 - 48.0 = \\mathbf{37.0}\\text{ mm}$$

3. Constant loss rate:
$$\\text{Remaining loss after } I_a = 37.0 - 15.0 = \\mathbf{22.0}\\text{ mm}$$
$$f_c = \\frac{22.0\\text{ mm}}{10\\text{ h}} = \\mathbf{2.20}\\text{ mm/h}$$

Entering Initial Loss = 15 mm and Constant Rate = 2.20 mm/h into HEC-HMS ensures the simulated runoff volume matches the gauge record.
:::

### Example 2 — GIS area-weighted subbasin parameter table

A catchment delineated in QGIS comprises two subbasins:
- **Subbasin 1 (30 km²):** 60% Group B Agriculture ($CN = 75$), 40% Group C Forest ($CN = 70$).
- **Subbasin 2 (45 km²):** 50% Group C Agriculture ($CN = 82$), 30% Group D Urban ($CN = 92$), 20% Group B Forest ($CN = 60$).

Calculate the composite CN to enter into HEC-HMS for each subbasin.

:::sol Show solution
1. **Subbasin 1:**
$$CN_1 = 0.60(75) + 0.40(70) = 45.0 + 28.0 = \\mathbf{73.0}$$

2. **Subbasin 2:**
$$CN_2 = 0.50(82) + 0.30(92) + 0.20(60) = 41.0 + 27.6 + 12.0 = \\mathbf{80.6} \\approx \\mathbf{81}$$
:::

### Session 18 recap
1. **Model selection:** Choose Initial & Constant or SCS-CN for design storm flood peaks; choose Deficit & Constant or SMA for continuous annual simulations.
2. **GIS synergy:** QGIS vector intersection automates area-weighted CN calculation across dozens of subbasins.
3. **Calibration goal:** Minimize volume error ($V_{\\text{sim}} \\approx V_{\\text{obs}}$) and peak timing error.
4. **Verification requirement:** Parameters calibrated on one storm must be validated against a separate, independent storm event.
5. **PBL milestone:** Your group project catchment parameters are extracted in QGIS and entered into HEC-HMS to test flood vulnerability.

<!--tab:In class-->

## Today in class

:::task Activity — Model parameter verification (15 min)
Open HEC-HMS. In the Castro Valley sample project:
1. Check the Loss tab of Subbasin-1. What loss method is chosen?
2. Note the Initial Loss, Constant Rate, and Impervious percentage.
3. Modify the Constant Rate from 0.14 in/h to 0.05 in/h. Re-run the simulation.
4. By how much did the peak discharge and total runoff volume at the outlet increase?
:::

## Your turn — check your answers

```check
[
 {
  "q": "A 75 km² catchment produces 3.6 MCM of runoff from an 85 mm storm. Compute the runoff depth in mm.",
  "answer": 48.0,
  "tol": 0.02,
  "unit": "mm",
  "hint": "3.6*10⁶ m³ / (75*10⁶ m²) * 1000.",
  "solution": "3.6 / 75 * 1000 = 48.0 mm."
 },
 {
  "q": "For storm duration = 10 h, P = 85 mm, R = 48 mm, and initial loss = 15 mm, find the calibrated constant loss rate in mm/h.",
  "answer": 2.2,
  "tol": 0.02,
  "unit": "mm/h",
  "hint": "(85 - 48 - 15) / 10.",
  "solution": "22 / 10 = 2.2 mm/h."
 },
 {
  "q": "A subbasin has 50% area with CN = 82, 30% with CN = 92, and 20% with CN = 60. Compute the composite CN.",
  "answer": 80.6,
  "tol": 0.02,
  "unit": "",
  "solution": "0.5*82 + 0.3*92 + 0.2*60 = 41 + 27.6 + 12 = 80.6."
 }
]
```

<!--tab:Practice-->

## Self-check

```quiz
[
 {"q":"Which HEC-HMS loss method is best suited for continuous multi-month simulations where soil moisture recovers between events?","options":["Initial and Constant","SCS Curve Number","Deficit and Constant","Specified Hyetograph"],"answer":2,"why":"Deficit and Constant tracks soil moisture deficit and replenishes soil storage through evapotranspiration between storm events."},
 {"q":"What is the difference between model calibration and model verification?","options":["Calibration uses observed data to adjust parameters; verification tests the calibrated model on independent events","Calibration is done in QGIS; verification is done in HEC-HMS","Calibration is for rainfall; verification is for streamflow","There is no difference"],"answer":0,"why":"Calibration tunes parameters to fit a known training dataset; verification validates model predictive performance on a separate testing dataset without altering parameters."},
 {"q":"What does the 'Impervious (%)' parameter represent in HEC-HMS subbasin loss models?","options":["Water that evaporates instantly","Fraction of subbasin area where 100% of rain directly becomes surface runoff with zero infiltration","Soil saturation at field capacity","Vegetation canopy cover"],"answer":1,"why":"Directly connected impervious areas (roads, roofs, parking lots) allow zero infiltration loss and convert 100% of rain into surface runoff."},
 {"q":"In QGIS, which tool intersects soil polygons with land use polygons to compute composite CN?","options":["Raster Calculator","Intersection or Union (Vector Overlay)","Fill Sinks","Heatmap"],"answer":1,"why":"Vector overlay tools (Intersection/Union) combine soil and land use attributes to calculate area-weighted composite CN values."},
 {"q":"If a calibrated HEC-HMS model severely underestimates peak discharge during a flash flood, which parameter should be scrutinized?","options":["Control Specifications time step","Canopy storage height","Time of concentration / lag time and initial abstraction","Baseflow threshold"],"answer":2,"why":"Peak discharge magnitude and timing are primarily controlled by subbasin lag time (transform) and initial loss/CN."}
]
```

## Exam-style questions

**2 marks**
1. Distinguish between model calibration and model verification.
2. Name three loss methods supported in HEC-HMS and when each is preferred.
3. What is meant by directly connected impervious area (DCIA)?
4. Why is continuous simulation necessary for reservoir yield analysis?

**5 marks**
5. Describe the steps involved in calibrating an HEC-HMS rainfall-runoff model against historical gauge data.
6. A 50 km² watershed has a 12-hour storm of 90 mm yielding 40 mm of runoff. If initial loss is 18 mm, calibrate the constant loss rate. If a subsequent storm of 110 mm occurs over 15 hours with the same initial loss, predict the runoff depth generated. *(Answers: $f_c = 2.67\\text{ mm/h}$; Verification $R = 110 - 18 - 15(2.67) = 52.0\\text{ mm}$.)*
7. Explain how GIS vector and raster data are combined to parameterize hydrologic models for ungauged river basins.

**10 marks**
8. Discuss the theoretical foundations, data requirements, and parameter calibration procedures for the Green-Ampt infiltration method versus the empirical SCS Curve Number method in HEC-HMS.
"""

with open("sessions/S18.md", "w", encoding="utf-8") as f:
    f.write(s18_content)
print("Generated sessions/S18.md")

# Now generate labs L11 to L16
# L11.md: HEC-HMS Loss Methods: Initial & Constant vs Deficit & Constant
l11_content = """<!--step: Open your course project and create a copy-->
1. Launch HEC-HMS. Open your course project `CE633_Basin` created in Lab L02.
2. In the Watershed Explorer, select the Basin Model `Basin 1`.
3. Choose <span class="menu">Edit › Copy Basin Model</span> and name the new model `Basin 1_Deficit`.

> [!see] You should see
> Two basin models in the tree: `Basin 1` (configured with Initial and Constant loss) and `Basin 1_Deficit`.

<!--step: Inspect the Initial and Constant loss parameters-->
1. Under `Basin 1`, click the subbasin element.
2. In the Component Editor, verify that **Loss Method** is set to **Initial and Constant**.
3. Open the **Loss** tab. Note the values:
   - Initial Loss (mm): 15.0
   - Constant Rate (mm/h): 2.5
   - Impervious (%): 10.0

> [!see] You should see
> Parameters indicating that the first 15 mm of precipitation will be fully absorbed before steady infiltration proceeds at 2.5 mm/h.

<!--step: Configure Deficit and Constant loss in the copied model-->
1. Under `Basin 1_Deficit`, click the subbasin element.
2. In the Component Editor, change the **Loss Method** dropdown from *Initial and Constant* to **Deficit and Constant**.
3. A confirmation dialog appears asking to change the loss method — click **Yes**.
4. Switch to the new **Loss** tab and enter:
   - Initial Deficit (mm): 25.0
   - Maximum Deficit (mm): 60.0
   - Constant Rate (mm/h): 2.5
   - Recovery Rate (mm/day): 4.0
   - Impervious (%): 10.0

> [!note] What these parameters mean
> The soil profile can store up to 60 mm of water. At the start of the simulation, 25 mm of storage is empty (dry deficit). In dry periods between rainfall, the soil recovers its storage capacity at 4.0 mm/day due to evapotranspiration.

<!--step: Run both simulations and compare peak discharge-->
1. Switch to the **Compute** tab. Create two Simulation Runs:
   - `Run_InitialConstant` (using `Basin 1`, meteorologic model, and control specs)
   - `Run_DeficitConstant` (using `Basin 1_Deficit`, meteorologic model, and control specs)
2. Compute both runs by clicking the compute button.
3. Open the **Results** tab. For the basin outlet, compare the **Summary Table** between the two runs.

> [!see] You should see
> The peak discharge and total runoff volume will be lower in the Deficit and Constant simulation because the initial deficit (25 mm) absorbed more water than the initial loss (15 mm).

<!--step: What to notice-->
1. The **Initial and Constant** method is purely event-based; once initial loss is satisfied, it never recovers even if rain stops for hours.
2. The **Deficit and Constant** method is suited for multi-storm and seasonal simulations because the recovery rate dries the soil between rain bursts.

<!--end-->

:::task Submit to Google Classroom
1. A side-by-side screenshot comparing the Outlet summary tables for both loss methods.
2. The difference in peak discharge (m³/s) and runoff volume (mm).
:::
"""

with open("labs/L11.md", "w", encoding="utf-8") as f:
    f.write(l11_content)
print("Generated labs/L11.md")

# L12.md: SCS Curve Number loss method in HEC-HMS
l12_content = """<!--step: Select the SCS Curve Number loss method-->
1. In HEC-HMS, open your basin model.
2. Select your subbasin element in the Watershed Explorer.
3. In the Component Editor, set **Loss Method** to **SCS Curve Number**. Confirm the method change dialog.

> [!see] You should see
> The Subbasin tab now shows *Loss Method: SCS Curve Number*, and a new **Loss** tab appears.

<!--step: Enter Curve Number parameters-->
1. Click the **Loss** tab in the Component Editor.
2. Enter the parameters calculated in Session 17 for your project catchment:
   - **Initial Abstraction (mm):** Leave blank to let HMS automatically compute $I_a = 0.2 S$, or enter a specific calibrated depth.
   - **Curve Number:** Enter your catchment composite CN (e.g. `78`).
   - **Impervious (%):** Enter `8.0` (direct paved/built area).

> [!see] You should see
> HMS automatically recognizes the Curve Number and computes the retention storage $S = 25400/CN - 254 = 71.64\\text{ mm}$.

<!--step: Configure the SCS Unit Hydrograph transform-->
1. In the Subbasin Component Editor, set the **Transform Method** to **SCS Unit Hydrograph**.
2. Open the **Transform** tab.
3. Enter the basin lag time:
   - **Graph Type:** Standard (PRF 484)
   - **Lag Time (MIN):** Enter `45.0` minutes (calculated from catchment length and slope).

<!--step: Run the SCS-CN event simulation-->
1. Switch to the **Compute** tab and run the simulation.
2. Check the Message Log to confirm 100% completion with zero errors.
3. Open **Results › Subbasins › Subbasin 1 › Graph**.

> [!see] You should see
> The upper graph displays the gross precipitation hyetograph and shaded blue excess rainfall bars; the lower plot shows the resulting SCS unit hydrograph direct runoff curve.

<!--end-->

:::task Submit to Google Classroom
1. Screenshot of the SCS Curve Number Loss tab in HEC-HMS.
2. The resulting outflow hydrograph showing peak flow and time of peak.
:::
"""

with open("labs/L12.md", "w", encoding="utf-8") as f:
    f.write(l12_content)
print("Generated labs/L12.md")

# L13.md: Evapotranspiration in continuous HEC-HMS runs
l13_content = """<!--step: Configure Monthly Average ET in Meteorologic Model-->
1. In HEC-HMS, expand **Meteorologic Models** in the Watershed Explorer.
2. Select your meteorologic model.
3. In the Component Editor, set **Evapotranspiration** to **Monthly Average**.

> [!see] You should see
> An **Evapotranspiration** folder appears under the Meteorologic Model in the project tree.

<!--step: Enter monthly evaporation depths-->
1. Expand the Evapotranspiration node and click **Monthly Evaporation**.
2. Enter the calibrated monthly evaporation rates (mm/month) calculated from pan data in Session 11:
   - Jan: 110, Feb: 135, Mar: 180, Apr: 210, May: 195, Jun: 140
   - Jul: 125, Aug: 120, Sep: 130, Oct: 135, Nov: 115, Dec: 105
3. Leave pan coefficient as 1.0 if entered as lake evaporation depths.

<!--step: Attach Canopy method to subbasin-->
1. Select your Subbasin in the Basin Model.
2. In the Component Editor, set **Canopy Method** to **Simple**.
3. In the **Canopy** tab, specify:
   - Initial storage (%): 0.0
   - Maximum storage (mm): 2.5
   - Plant uptake method: Tension reduction
   - Tension reduction: 0.5

<!--step: Run simulation and inspect continuous ET loss-->
1. Extend the Control Specifications duration to 30 days.
2. Compute the simulation run.
3. Open the Subbasin results graph and examine the cumulative abstraction balance.

<!--end-->

:::task Submit to Google Classroom
1. Screenshot of the Monthly Evaporation table in HEC-HMS.
2. Explanation of how canopy evaporation reduces surface runoff over multiple storm bursts.
:::
"""

with open("labs/L13.md", "w", encoding="utf-8") as f:
    f.write(l13_content)
print("Generated labs/L13.md")

# L14.md: Continuous simulation and baseflow
l14_content = """<!--step: Configure Soil Moisture Accounting (SMA) or Deficit Constant-->
1. Open your continuous simulation project in HEC-HMS.
2. Ensure the subbasin is set to Deficit and Constant loss with ET active.
3. Set **Baseflow Method** to **Linear Reservoir**.

<!--step: Set linear reservoir baseflow parameters-->
1. Open the **Baseflow** tab in the Subbasin editor.
2. Enter:
   - Initial discharge: 0.25 m³/s
   - Fraction of infiltrated water to groundwater reservoir 1: 0.40
   - Routing coefficient (GW1): 24.0 hours
   - Number of reservoirs: 1

<!--step: Run multi-week continuous simulation-->
1. Run the simulation over a 60-day monsoon period.
2. In the Results tab, observe how baseflow responds slowly after peak rainfall excess and continues discharging long after precipitation stops.

<!--end-->

:::task Submit to Google Classroom
1. Hydrograph plot displaying total outflow, direct runoff, and baseflow separation curve.
:::
"""

with open("labs/L14.md", "w", encoding="utf-8") as f:
    f.write(l14_content)
print("Generated labs/L14.md")

# L15.md: Calibrating and verifying losses
l15_content = """<!--step: Import observed streamflow gauge data-->
1. Under **Time-Series Data**, right-click **Discharge Gages › New**. Name it `Outlet_Observed`.
2. Set Data Source to Manual Entry and Units to Cubic Metres per Second (M3/S).
3. Paste observed streamflow hydrograph coordinates from the class dataset.

<!--step: Attach observed flow to basin outlet-->
1. In the Basin Model, click the `Outlet` element.
2. In the Component Editor, select **Observed Discharge: Outlet_Observed**.

<!--step: Optimize loss parameters-->
1. Choose <span class="menu">Compute › Optimization Trials › New</span>.
2. Select the objective function as **Peak-Weighted RMSE**.
3. Select parameters to optimize: Subbasin Curve Number (min: 50, max: 95).
4. Run the optimization trial. Note the calibrated optimal parameter values.

<!--end-->

:::task Submit to Google Classroom
1. Optimization summary table showing initial vs calibrated parameter values and objective function score.
2. Plot showing simulated hydrograph overlaid on observed hydrograph points.
:::
"""

with open("labs/L15.md", "w", encoding="utf-8") as f:
    f.write(l15_content)
print("Generated labs/L15.md")

# L16.md: GIS rainfall-runoff model in QGIS
l16_content = """<!--step: Load soil and LULC shapefiles into QGIS-->
1. Open QGIS. Load your project catchment boundary shapefile `Catchment.shp`.
2. Add the soil map layer `Soil_HSG.shp` with attributes `HSG` (A, B, C, D).
3. Add the Land Use Land Cover vector layer `LULC.shp` with classes (Agriculture, Forest, Urban, Water).

<!--step: Perform spatial intersection-->
1. Choose <span class="menu">Vector › Geoprocessing Tools › Intersection</span>.
2. Set Input Layer to `Soil_HSG` and Overlay Layer to `LULC`. Name output `Soil_LULC_Intersect.shp`.
3. In the attribute table of the intersection, use the Field Calculator to create a field `Area_ha` ($area / 10000).

<!--step: Assign Curve Numbers using field calculator-->
1. In the Field Calculator, create a new integer field `CN`:
   - If HSG = 'B' and LandUse = 'Agriculture' -> 75
   - If HSG = 'B' and LandUse = 'Forest' -> 60
   - If HSG = 'C' and LandUse = 'Urban' -> 85
2. Use <span class="menu">Vector › Analysis Tools › Zonal Statistics</span> or `Group Stats` plugin to compute area-weighted composite CN for each delineated subbasin.
3. Export the subbasin CN table to enter into HEC-HMS.

<!--end-->

:::task Submit to Google Classroom
1. The exported QGIS subbasin composite CN summary table.
2. A map layout showing the classified Curve Number distribution across your PBL catchment.
:::
"""

with open("labs/L16.md", "w", encoding="utf-8") as f:
    f.write(l16_content)
print("Generated labs/L16.md")

print("All Unit 2 sessions and labs built successfully!")
