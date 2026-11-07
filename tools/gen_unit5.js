const fs = require('fs');
const path = require('path');

const sessionsDir = path.join(__dirname, '..', 'sessions');

const u5 = {};

// S37: Groundwater and aquifers
u5["S37"] = `<!--tab:Theory-->

> [!note] Key ideas
> - Groundwater constitutes $> 98\\%$ of liquid fresh water on Earth and provides $> 60\\%$ of India's irrigated agriculture and $85\\%$ of rural drinking water.
> - Vertical zones: **Vadose zone** (unsaturated: soil water, intermediate vadose, capillary fringe) and **Phreatic zone** (saturated zone below the water table).
> - Geological formations: **Aquifer** (permeable water-bearing formation), **Aquiclude** (impermeable storage, e.g., clay), **Aquitard** (semi-pervious, e.g., sandy clay), and **Aquifuge** (impermeable and non-porous, e.g., massive granite).
> - Aquifer types: **Unconfined** (phreatic, free water table at atmospheric pressure), **Confined** (artesian, bounded above and below by impermeable strata with piezometric head), **Semi-confined** (leaky), and **Perched**.
> - Porosity equation: $n = S_y + S_r$, where $S_y$ is specific yield and $S_r$ is specific retention.

## 1. Occurrence & Vertical Distribution of Subsurface Water

Subsurface water is divided into two primary zones separated by the water table:

\`\`\`
       Ground Surface
             |
             +--- Soil Water Zone (transpiration by plant roots)
   Vadose    |
   Zone      +--- Intermediate Vadose Zone (gravitational percolation)
(Unsaturated)|
             +--- Capillary Fringe (water held under negative pore pressure)
  ~~~~~~~~~~~+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Water Table (p = 0 gauge)
   Phreatic  |
   Zone      |  Saturated Zone: Pores completely filled with water
 (Saturated) |  under positive hydrostatic pressure (p = rho * g * y)
             |
       ======+============================================================ Impermeable Bedrock
\`\`\`

---

## 2. Aquifer Classification & Properties

1. **Unconfined (Water Table) Aquifer:** Free water surface at atmospheric pressure. Recharged directly by vertical infiltration from precipitation. The water table fluctuates seasonally with recharge and pumping.
2. **Confined (Artesian) Aquifer:** Saturated formation trapped between two impermeable confining aquicludes. Water is under hydrostatic pressure. When tapped by a borehole, water rises to the **piezometric surface**. If the piezometric surface lies above ground level, a flowing artesian well results.
3. **Perched Aquifer:** A localized lens of groundwater supported by a small impermeable lens (e.g., clay lentil) within the vadose zone, situated above the regional water table.

---

## 3. Soil Moisture Constants & Aquifer Yield

Total porosity $n$ represents the void ratio relative to bulk volume:
$$n = \\frac{V_v}{V} = 1 - \\frac{\\rho_d}{\\rho_s}$$

When saturated soil is allowed to drain freely under gravity:
$$n = S_y + S_r$$

Where:
- **Specific Yield ($S_y$):** Ratio of the volume of water drained by gravity to the total volume:
  $$S_y = \\frac{V_{w,\\text{drained}}}{V}$$
- **Specific Retention ($S_r$):** Ratio of the volume of water retained against gravity by surface tension and molecular attraction to total volume:
  $$S_r = \\frac{V_{w,\\text{retained}}}{V}$$

| Soil Texture | Total Porosity ($n$) | Specific Yield ($S_y$) | Specific Retention ($S_r$) |
|---|---|---|---|
| Coarse Gravel | $0.28\\text{--}0.35$ | $0.23\\text{--}0.28$ | $0.05\\text{--}0.07$ |
| Medium Sand | $0.35\\text{--}0.42$ | $0.20\\text{--}0.28$ | $0.10\\text{--}0.15$ |
| Silt | $0.40\\text{--}0.50$ | $0.05\\text{--}0.15$ | $0.30\\text{--}0.40$ |
| Heavy Clay | $0.45\\text{--}0.55$ | $0.01\\text{--}0.05$ | $0.40\\text{--}0.50$ |

---

## 4. Worked Numerical Examples

### Worked Example 37.1: Aquifer Porosity, Specific Yield & Retention

**Problem:** An undisturbed cylindrical core sample of undisturbed alluvial sand has total volume $V = 1.20\\text{ m}^3$. Laboratory oven drying gives:
- Dry solid mass: $M_d = 1900.0\\text{ kg}$
- Average particle density of quartz solids: $\\rho_s = 2650.0\\text{ kg/m}^3$
- Gravitational drainage testing reveals a specific retention $S_r = 0.140$ ($14.0\\%$)
Calculate:
1. The total porosity $n$ of the aquifer material.
2. The specific yield $S_y$.
3. The volume of gravitational drainable water contained in a $100\\text{ m}^3$ block of this formation.

**Solution:**

**Step 1: Calculate volume of solid grains ($V_s$)**
$$V_s = \\frac{M_d}{\\rho_s} = \\frac{1900.0\\text{ kg}}{2650.0\\text{ kg/m}^3} = 0.71698\\text{ m}^3$$

**Step 2: Calculate volume of voids ($V_v$) and total porosity ($n$)**
$$V_v = V - V_s = 1.20\\text{ m}^3 - 0.71698\\text{ m}^3 = 0.48302\\text{ m}^3$$
$$n = \\frac{V_v}{V} = \\frac{0.48302}{1.20} = 0.40251 \\implies n = 40.25\\%$$

**Step 3: Calculate Specific Yield ($S_y$)**
$$S_y = n - S_r = 0.40251 - 0.14000 = 0.26251 \\implies S_y = 26.25\\%$$

**Step 4: Drainable water in $100\\text{ m}^3$ formation**
$$V_{w,\\text{drain}} = V_{\\text{bulk}} \\times S_y = 100\\text{ m}^3 \\times 0.26251 = 26.25\\text{ m}^3 = 26{,}250\\text{ liters}$$

---

### Worked Example 37.2: Regional Groundwater Storage Depletion

**Problem:** An unconfined aquifer covering an area of $A = 15.0\\text{ km}^2$ has an average specific yield $S_y = 0.2625$. During an intense summer pumping season:
- The water table drops by an average depth $\\Delta h = 2.50\\text{ m}$ across the basin.
Calculate the total volume of groundwater extracted from storage in Million Cubic Meters (MCM).

**Solution:**
$$\\text{Total Aquifer Area } A = 15.0 \\times 10^6\\text{ m}^2$$
$$\\text{Total Dewatered Formation Volume } V = A \\times \\Delta h = (15.0 \\times 10^6\\text{ m}^2) \\times 2.50\\text{ m} = 37.50 \\times 10^6\\text{ m}^3$$
$$\\text{Volume of Water Released } V_w = V \\times S_y = 37.50 \\times 10^6 \\times 0.26251 = 9.8441 \\times 10^6\\text{ m}^3 = 9.844\\text{ MCM}$$

---

### Session 37 recap
1. Water table separates unsaturated vadose zone from saturated phreatic zone.
2. Aquifer stores and yields water; aquiclude stores but does not transmit water.
3. Total porosity $n = S_y + S_r$.
4. Gravity-drainable water volume: $V_w = A \\cdot \\Delta h \\cdot S_y$.

<!--tab:In class-->

## In-Class Activities & Verification

### Activity 1: Specific Yield Calculation Check

A soil has a total porosity $n = 0.35$ ($35\\%$) and a specific retention $S_r = 0.12$ ($12\\%$). Calculate its specific yield $S_y$.

\`\`\`check
S_y = 0.23
Tolerance: 0.01
Hint: S_y = n - S_r = 0.35 - 0.12 = 0.23.
\`\`\`

### Activity 2: Basin Water Release Check

An unconfined aquifer has surface area $A = 10.0\\text{ km}^2$ and $S_y = 0.20$. If water table falls by $\\Delta h = 1.80\\text{ m}$, find the volume of water released in Million Cubic Meters (MCM).

\`\`\`check
V_w = 3.6 MCM
Tolerance: 0.1 MCM
Hint: V_w = 10.0 * 10^6 * 1.80 * 0.20 = 3,600,000 m3 = 3.6 MCM.
\`\`\`

<!--tab:Software lab-->

## Lab Linkage: Aquifer Delineation in QGIS

In **QGIS**:
1. Import regional lithological shapefiles and digital elevation models (SRTM / Bhuvan).
2. Delineate alluvium vs hard-rock granite basalt boundaries.
3. Classify recharge zones based on soil texture and lineament density.

<!--tab:Practice-->

## Practice Quiz & Exam Questions

\`\`\`quiz
1. What distinguishes an aquiclude from an aquifer?
* An aquiclude contains water but cannot transmit significant quantities (e.g. clay)
- An aquiclude is completely dry and porous
- An aquiclude transmits water faster than gravel
- An aquiclude is always located above the capillary fringe

2. The mathematical sum of specific yield (Sy) and specific retention (Sr) is equal to:
* Total porosity (n)
- Storativity (S)
- Permeability (k)
- Hydraulic conductivity (K)

3. In a confined aquifer, the imaginary surface to which water will rise in a well is called:
* The piezometric surface
- The phreatic surface
- The vadose fringe
- The capillary boundary
\`\`\`

### Examination Questions

:::exam[2-Mark Concept Questions]
1. Define **aquifer**, **aquiclude**, **aquitard**, and **aquifuge**.
2. Differentiate between unconfined and confined aquifers.
:::

:::exam[5-Mark Derivation]
Prove that the total porosity of a soil is equal to the sum of specific yield and specific retention ($n = S_y + S_r$). Explain why fine clays have high porosity but very low specific yield.
:::

:::exam[10-Mark Comprehensive]
Describe the vertical distribution of groundwater with a neat labeled sketch. Discuss the factors affecting specific yield and specific retention in alluvial and hard-rock aquifer systems of India.
:::

:::sol
Derivation of $n = S_y + S_r$:
Let total bulk volume of soil be $V$, containing void volume $V_v$.
When fully saturated, the total pore water volume $V_w = V_v$.
Upon gravity drainage:
$$V_v = V_{w,\\text{drained}} + V_{w,\\text{retained}}$$
Dividing both sides by total soil volume $V$:
$$\\frac{V_v}{V} = \\frac{V_{w,\\text{drained}}}{V} + \\frac{V_{w,\\text{retained}}}{V}$$
By definition:
$$\\text{Porosity } n = \\frac{V_v}{V}, \\quad \\text{Specific Yield } S_y = \\frac{V_{w,\\text{drained}}}{V}, \\quad \\text{Specific Retention } S_r = \\frac{V_{w,\\text{retained}}}{V}$$
$$\\implies n = S_y + S_r$$
Clay behavior:
Clay particles are colloidal plates with enormous specific surface area ($> 100\\text{ m}^2\\text{/g}$) and microscopic sub-micron pores. Strong surface electrostatic forces and capillary suction hold pore water tightly against gravitational forces. Consequently, although clay has high porosity ($45\\text{--}55\\%$), nearly all pore water is retained ($S_r > 45\\%$), leaving a negligible specific yield ($S_y \\approx 1\\text{--}5\\%$).
:::
`;

// S38: Darcy's law and aquifer parameters
u5["S38"] = `<!--tab:Theory-->

> [!note] Key ideas
> - **Darcy's Law (1856):** Discharge rate is directly proportional to hydraulic gradient and cross-sectional area: $Q = -K A \\frac{dh}{dl}$ or $v = K i$.
> - Hydraulic head $h = z + \\frac{p}{\\rho g}$; water flows from higher to lower hydraulic head.
> - **Discharge velocity** ($v = Q/A$) is an apparent average velocity; **seepage velocity** ($v_s = v / n_e$) is the true interstitial velocity between soil pores.
> - Validity limit: Darcy's law holds for laminar flow where Reynolds number $\\text{Re} = \\frac{v d_{10}}{\\nu} < 1\\text{ to } 10$.
> - Hydraulic conductivity $K = k \\frac{\\rho g}{\\mu}$, where $k$ is intrinsic permeability ($[L^2]$ or Darcy).

## 1. Darcy's Law & Hydraulic Head

In 1856, Henry Darcy conducted sand filter experiments in Dijon, France, establishing the governing equation for groundwater flow through saturated porous media:

$$Q = -K A \\frac{\\Delta h}{L} = K A i$$

Where:
- $Q$ = volumetric flow rate ($\\text{m}^3\\text{/day}$ or $\\text{m}^3\\text{/s}$)
- $K$ = hydraulic conductivity ($[L/T]$, e.g., $\\text{m/day}$ or $\\text{cm/s}$)
- $A$ = gross cross-sectional area perpendicular to flow ($\\text{m}^2$)
- $i = -\\frac{dh}{dl} = \\frac{\\Delta h}{L}$ = hydraulic gradient (dimensionless)

\`\`\`
          Piezometer 1                     Piezometer 2
              |--|                             |--|
              |  | h1                          |  |
              |  | ~~~~                        |  |
              |  |  |                          |  | h2
              |  |  | \Delta h = h1 - h2       |  | ~~~~
              |  |  v                          |  |  |
         +----+--+-----------------------------+--+--+----+
    Q -> |                Soil Column (Length L)     |    | -> Q
         +------------------------------------------------+
                                              Datum (z = 0)
\`\`\`

---

## 2. Discharge Velocity vs Seepage Velocity

Water only moves through interconnected pore channels, not the entire solid cross-section.
Let $A$ be gross area, $A_v$ be void area, and effective porosity $n_e = A_v / A$:

1. **Discharge (Darcian) Velocity ($v$):**
$$v = \\frac{Q}{A} = K i$$

2. **Seepage (Pore) Velocity ($v_s$):**
By continuity:
$$Q = A v = A_v v_s \\implies v_s = \\frac{A}{A_v} v = \\frac{v}{n_e}$$
Since $n_e < 1.0$, $v_s$ is always substantially greater than $v$ ($v_s \\approx 3\\text{--}5 \\times v$).

---

## 3. Hydraulic Conductivity ($K$) vs Intrinsic Permeability ($k$)

Hydraulic conductivity depends on both porous matrix geometry and permeating fluid properties:
$$K = k \\left(\\frac{\\rho g}{\\mu}\\right)$$

Where:
- $k$ = intrinsic permeability of the porous matrix ($[L^2]$, typically $\\text{m}^2$ or $\\text{cm}^2$)
- $\\rho$ = fluid mass density ($\\text{kg/m}^3$)
- $\\mu$ = fluid dynamic viscosity ($\\text{Pa}\\cdot\\text{s}$)
- $g$ = acceleration due to gravity ($9.81\\text{ m/s}^2$)

Unit of intrinsic permeability:
$$1\\text{ Darcy} = 0.987 \\times 10^{-12}\\text{ m}^2 \\approx 10^{-8}\\text{ cm}^2$$

---

## 4. Worked Numerical Examples

### Worked Example 38.1: Seepage Velocity & Contaminant Transport Time

**Problem:** A confined sand aquifer has hydraulic conductivity $K = 25.0\\text{ m/day}$ and effective porosity $n_e = 0.25$ ($25\\%$).
Two observation piezometers spaced $800\\text{ m}$ apart in the direction of regional groundwater flow record piezometric heads of $154.20\\text{ m MSL}$ and $150.20\\text{ m MSL}$.
1. Compute the hydraulic gradient $i$.
2. Compute the Darcian discharge velocity $v$.
3. Compute the actual average interstitial seepage velocity $v_s$.
4. How many days (and years) will a dissolved industrial contaminant take to migrate from piezometer 1 to piezometer 2?

**Solution:**

**Step 1: Compute hydraulic gradient**
$$i = \\frac{\\Delta h}{L} = \\frac{154.20 - 150.20}{800.0\\text{ m}} = \\frac{4.00\\text{ m}}{800.0\\text{ m}} = 0.0050$$

**Step 2: Compute discharge velocity ($v$)**
$$v = K i = 25.0\\text{ m/day} \\times 0.0050 = 0.1250\\text{ m/day}$$

**Step 3: Compute seepage velocity ($v_s$)**
$$v_s = \\frac{v}{n_e} = \\frac{0.1250\\text{ m/day}}{0.25} = 0.5000\\text{ m/day}$$

**Step 4: Travel time ($t$)**
$$t = \\frac{L}{v_s} = \\frac{800.0\\text{ m}}{0.5000\\text{ m/day}} = 1600.0\\text{ days}$$
$$t_{\\text{years}} = \\frac{1600.0}{365.25} = 4.38\\text{ years}$$

---

### Worked Example 38.2: Constant-Head Permeameter Test

**Problem:** A laboratory constant-head permeameter has an internal diameter $D = 10.0\\text{ cm}$ (area $A = 78.54\\text{ cm}^2$) and length $L = 30.0\\text{ cm}$. Under a constant head difference $\\Delta h = 45.0\\text{ cm}$, a total water volume of $120.0\\text{ cm}^3$ is collected in $5.0\\text{ minutes}$. Calculate the hydraulic conductivity $K$ in $\\text{cm/s}$ and $\\text{m/day}$.

**Solution:**
$$Q = \\frac{120.0\\text{ cm}^3}{5.0 \\times 60\\text{ s}} = \\frac{120.0}{300} = 0.400\\text{ cm}^3\\text{/s}$$
$$K = \\frac{Q L}{A \\Delta h} = \\frac{0.400 \\times 30.0}{78.54 \\times 45.0} = \\frac{12.0}{3534.3} = 0.003395\\text{ cm/s}$$
$$K = 0.003395 \\times 10^{-2}\\text{ m/s} \\times 86{,}400\\text{ s/day} = 2.933\\text{ m/day} \\approx 2.93\\text{ m/day}$$

---

### Session 38 recap
1. Darcy's law: $Q = K A i$ and $v = K i$.
2. Seepage velocity $v_s = v / n_e$ controls actual travel time.
3. Hydraulic conductivity $K = k (\\rho g / \\mu)$.
4. Darcy's law is valid only for laminar flow ($\\text{Re} < 1\\text{ to } 10$).

<!--tab:In class-->

## In-Class Activities & Verification

### Activity 1: Seepage Velocity Check

A sand aquifer has $K = 18.0\\text{ m/day}$, $i = 0.0040$, and $n_e = 0.24$. Compute the seepage velocity $v_s$ in $\\text{m/day}$.

\`\`\`check
v_s = 0.30 m/day
Tolerance: 0.02 m/day
Hint: v = 18.0 * 0.0040 = 0.072 m/day. v_s = 0.072 / 0.24 = 0.30 m/day.
\`\`\`

### Activity 2: Darcy Flux Check

A confined aquifer has thickness $b = 10\\text{ m}$, width $W = 500\\text{ m}$, $K = 20\\text{ m/day}$, and $i = 0.003$. Compute total discharge $Q$ in $\\text{m}^3\\text{/day}$.

\`\`\`check
Q = 300.0 m3/day
Tolerance: 5.0 m3/day
Hint: A = 10 * 500 = 5000 m2. Q = 20 * 5000 * 0.003 = 300 m3/day.
\`\`\`

<!--tab:Software lab-->

## Lab Linkage: Groundwater Flow Direction Mapping in QGIS

In **QGIS**:
1. Import monitored well locations with water table elevation attributes.
2. Use **TIN Interpolation** or **IDW** to create a raster water level elevation surface.
3. Compute the slope and aspect rasters to generate groundwater flow direction arrows perpendicular to water table contours.

<!--tab:Practice-->

## Practice Quiz & Exam Questions

\`\`\`quiz
1. Why is the actual seepage velocity (v_s) always greater than the discharge velocity (v)?
* Because water flows only through the interconnected pore voids, not the total cross-section
* Because gravity increases velocity inside soil grains
- Because viscosity drops to zero in small pores
- Because atmospheric pressure accelerates groundwater

2. Darcy's law ceases to be valid when:
* Flow becomes turbulent and the Reynolds number exceeds 1 to 10
- The hydraulic gradient is less than 0.001
- The aquifer is composed of fine sand
- Water temperature exceeds 20 degrees Celsius

3. The SI unit of intrinsic permeability (k) is:
* m^2
- m/s
- m^3/day
- dimensionless
\`\`\`

### Examination Questions

:::exam[2-Mark Concept Questions]
1. State Darcy's law and give the conditions under which it is valid.
2. Differentiate between discharge velocity and seepage velocity.
:::

:::exam[5-Mark Derivation]
Derive the relationship between discharge velocity $v$ and seepage velocity $v_s$ in terms of effective porosity $n_e$. Explain why contaminant plume velocity equals $v_s$ rather than $v$.
:::

:::exam[10-Mark Comprehensive]
Discuss hydraulic conductivity $K$ and intrinsic permeability $k$. Derive the expression $K = k \\frac{\\rho g}{\\mu}$ and describe the laboratory constant-head and falling-head permeameter tests.
:::

:::sol
Derivation of $v_s = v / n_e$:
Consider a porous medium prism of length $L$ and total cross-sectional area $A$.
The volume of voids within the prism is $V_v = A_v \\cdot L$, and total volume is $V = A \\cdot L$.
Effective porosity:
$$n_e = \\frac{V_v}{V} = \\frac{A_v \\cdot L}{A \\cdot L} = \\frac{A_v}{A} \\implies A_v = n_e A$$
By conservation of fluid mass (continuity equation), the total volumetric flow rate $Q$ passing through the macroscopic area $A$ must equal the rate passing through the microscopic pore area $A_v$:
$$Q = A \\cdot v = A_v \\cdot v_s$$
Substituting $A_v = n_e A$:
$$A \\cdot v = (n_e A) \\cdot v_s \\implies v_s = \\frac{v}{n_e}$$
Contaminant Transport:
Conservative dissolved contaminants travel within the fluid particles occupying pore spaces. Because fluid actually moves at interstitial pore velocity $v_s$, the physical transport and advective travel time of the plume are governed directly by $v_s$.
:::
`;

// S39: Transmissivity and layered aquifers
u5["S39"] = `<!--tab:Theory-->

> [!note] Key ideas
> - **Transmissivity ($T$):** The rate at which water is transmitted through a unit width of the entire saturated thickness under a unit hydraulic gradient: $T = K \\cdot b$ ($[L^2/T]$, e.g., $\\text{m}^2\\text{/day}$).
> - **Storativity ($S$):** The volume of water an aquifer releases from or takes into storage per unit surface area per unit change in head.
> - Confined aquifer storativity ($S \\approx 10^{-5}\\text{--}10^{-3}$) arises from water decompression and aquifer skeleton elasticity; unconfined storativity ($S \\approx S_y = 0.1\\text{--}0.3$) is governed by gravity pore drainage.
> - **Stratified / Layered Aquifers:** Equivalent horizontal conductivity ($K_h$) governs flow parallel to bedding; equivalent vertical conductivity ($K_v$) governs leakage perpendicular to bedding.
> - Always $K_h > K_v$ ($K_h/K_v \\approx 2\\text{--}10$ in alluvium).

## 1. Transmissivity & Storativity

1. **Transmissivity ($T$):**
For an aquifer of saturated thickness $b$ and hydraulic conductivity $K$:
$$T = K \\cdot b$$
Discharge through width $W$ under gradient $i$:
$$Q = T \\cdot W \\cdot i$$

2. **Storativity / Storage Coefficient ($S$):**
$$S = \\frac{\\text{Volume of Water Released}}{\\text{Aquifer Surface Area } A \\times \\text{Head Drop } \\Delta h}$$

\`\`\`
       Confined Aquifer:                            Unconfined Aquifer:
       Piezometric Surface                          Water Table
       ~~~~~~~~~~~~~~~~~~ h1                        ~~~~~~~~~~~~~~~~~~ h1
               |                                            |
               v \Delta h                                   v \Delta h
       ------------------ h2                        ------------------ h2
       ================== Confining Bed
         Solid compression &                        Gravity pore drainage:
         water expansion:                           S ~ Sy (0.10 to 0.30)
         S = 10^-5 to 10^-3                         (100 to 1000 times larger!)
       ================== Bottom Bed
\`\`\`

---

## 2. Equivalent Hydraulic Conductivity for Layered Formations

Natural alluvial and sedimentary deposits consist of alternating horizontal layers of sand, silt, and clay.

\`\`\`
   ------------------------------------------------- Top
   Layer 1: Thickness b1, Conductivity K1       --> Flow Qh (Parallel)
   -------------------------------------------------
   Layer 2: Thickness b2, Conductivity K2       --> Flow Qh
   -------------------------------------------------
   Layer 3: Thickness b3, Conductivity K3       --> Flow Qh
   ------------------------------------------------- Bottom
                       |
                       v Flow Qv (Perpendicular)
\`\`\`

### 1. Flow Parallel to Stratification (Horizontal $K_h$)
The hydraulic gradient $i$ is identical across all layers. Total flow:
$$Q = \\sum Q_i = \\sum (K_i b_i W i) = K_h (\\sum b_i) W i$$
$$K_h = \\frac{\\sum K_i b_i}{\\sum b_i} = \\frac{T_{\\text{total}}}{b_{\\text{total}}}$$

### 2. Flow Perpendicular to Stratification (Vertical $K_v$)
The specific discharge $v$ is constant through all layers; head losses add up:
$$\\Delta h = \\sum \\Delta h_i \\implies \\frac{v \\sum b_i}{K_v} = \\sum \\left(\\frac{v b_i}{K_i}\\right)$$
$$K_v = \\frac{\\sum b_i}{\\sum \\frac{b_i}{K_i}}$$

---

## 3. Worked Numerical Examples

### Worked Example 39.1: Equivalent Hydraulic Conductivity of a 3-Layer System

**Problem:** A stratified confined aquifer consists of three horizontal layers:
- Layer 1 (coarse sand): $b_1 = 5.0\\text{ m}$, $K_1 = 12.0\\text{ m/day}$
- Layer 2 (fine gravel): $b_2 = 8.0\\text{ m}$, $K_2 = 30.0\\text{ m/day}$
- Layer 3 (silty sand): $b_3 = 7.0\\text{ m}$, $K_3 = 8.0\\text{ m/day}$
Calculate:
1. The total saturated thickness $b$.
2. The total transmissivity $T$.
3. The equivalent horizontal hydraulic conductivity $K_h$.
4. The equivalent vertical hydraulic conductivity $K_v$.
5. The anisotropy ratio $K_h / K_v$.

**Solution:**

**Step 1: Total thickness and transmissivity**
$$b = b_1 + b_2 + b_3 = 5.0 + 8.0 + 7.0 = 20.0\\text{ m}$$
$$T = K_1 b_1 + K_2 b_2 + K_3 b_3 = (12.0 \\times 5.0) + (30.0 \\times 8.0) + (8.0 \\times 7.0)$$
$$T = 60.0 + 240.0 + 56.0 = 356.0\\text{ m}^2\\text{/day}$$

**Step 2: Equivalent horizontal conductivity ($K_h$)**
$$K_h = \\frac{T}{b} = \\frac{356.0\\text{ m}^2\\text{/day}}{20.0\\text{ m}} = 17.80\\text{ m/day}$$

**Step 3: Equivalent vertical conductivity ($K_v$)**
$$\\sum \\frac{b_i}{K_i} = \\frac{5.0}{12.0} + \\frac{8.0}{30.0} + \\frac{7.0}{8.0} = 0.41667 + 0.26667 + 0.87500 = 1.55833\\text{ day}$$
$$K_v = \\frac{b}{\\sum \\frac{b_i}{K_i}} = \\frac{20.0\\text{ m}}{1.55833\\text{ day}} = 12.834\\text{ m/day} \\approx 12.83\\text{ m/day}$$

**Step 4: Anisotropy ratio**
$$\\frac{K_h}{K_v} = \\frac{17.80}{12.834} = 1.387 \\approx 1.39$$

---

### Worked Example 39.2: Water Volume Released from Confined Storage

**Problem:** A confined artesian aquifer has surface area $A = 10.0\\text{ km}^2$, thickness $b = 25.0\\text{ m}$, and storage coefficient $S = 2.50 \\times 10^{-4}$.
Heavy municipal pumping lowers the piezometric surface by $\\Delta h = 3.0\\text{ m}$ uniformly over the area.
Calculate the volume of water released from storage in $\\text{m}^3$.

**Solution:**
$$V_w = S \\times A \\times \\Delta h$$
$$V_w = (2.50 \\times 10^{-4}) \\times (10.0 \\times 10^6\\text{ m}^2) \\times 3.0\\text{ m}$$
$$V_w = 2500 \\times 3.0 = 7500.0\\text{ m}^3$$

*(Note: In contrast, an unconfined aquifer with $S_y = 0.25$ would yield $7{,}500{,}000\\text{ m}^3$, 1000 times as much!)*

---

### Session 39 recap
1. Transmissivity $T = K \\cdot b$.
2. Confined $S = 10^{-5}\\text{--}10^{-3}$; unconfined $S \\approx S_y = 0.1\\text{--}0.3$.
3. Parallel flow: $K_h = \\sum K_i b_i / \\sum b_i$ (weighted arithmetic mean).
4. Perpendicular flow: $K_v = \\sum b_i / \\sum (b_i / K_i)$ (weighted harmonic mean).

<!--tab:In class-->

## In-Class Activities & Verification

### Activity 1: Two-Layer Equivalent Horizontal Conductivity

Two layers: $b_1 = 4.0\\text{ m}, K_1 = 10.0\\text{ m/day}$; $b_2 = 6.0\\text{ m}, K_2 = 20.0\\text{ m/day}$. Compute $K_h$ in $\\text{m/day}$.

\`\`\`check
K_h = 16.0 m/day
Tolerance: 0.2 m/day
Hint: Total T = (4 * 10) + (6 * 20) = 40 + 120 = 160 m2/day. K_h = 160 / 10 = 16.0 m/day.
\`\`\`

### Activity 2: Total Transmissivity Check

For the same two-layer aquifer ($b_1 = 4\\text{ m}, K_1 = 10$; $b_2 = 6\\text{ m}, K_2 = 20$), compute total transmissivity $T$ in $\\text{m}^2\\text{/day}$.

\`\`\`check
T = 160.0 m2/day
Tolerance: 1.0 m2/day
Hint: T = 40 + 120 = 160 m2/day.
\`\`\`

<!--tab:Software lab-->

## Lab Linkage: Groundwater Baseflow Modeling in HEC-HMS

In **HEC-HMS**:
1. Open the subbasin parameters and select **Linear Reservoir Baseflow**.
2. Translate regional aquifer transmissivity and storativity into linear reservoir recession constants ($GW_1, GW_2$).
3. Run the model to verify baseflow recession slope against observed dry-weather flow records.

<!--tab:Practice-->

## Practice Quiz & Exam Questions

\`\`\`quiz
1. How does the storativity of a confined aquifer compare with the specific yield of an unconfined aquifer?
* Confined storativity is 100 to 1000 times smaller
- Confined storativity is 100 to 1000 times larger
- They are physically identical
- Confined storativity is always greater than 0.5

2. In a layered soil deposit, the equivalent horizontal conductivity Kh is always:
* Greater than the equivalent vertical conductivity Kv
- Smaller than the equivalent vertical conductivity Kv
- Equal to the equivalent vertical conductivity Kv
- Independent of layer thicknesses

3. What is the physical mechanism releasing water from storage in a confined artesian aquifer?
* Decompression of water and elastic compression of the aquifer mineral skeleton
- Gravity drainage of soil pores leaving empty air voids
- Evaporation through the confining upper layer
- Sublimation of bound crystal moisture
\`\`\`

### Examination Questions

:::exam[2-Mark Concept Questions]
1. Define **transmissivity** and give its dimensions.
2. What is meant by **anisotropy** in hydraulic conductivity?
:::

:::exam[5-Mark Derivation]
Derive the expression for equivalent horizontal hydraulic conductivity $K_h = \\frac{\\sum K_i b_i}{\\sum b_i}$ for a stratified formation consisting of $n$ horizontal layers.
:::

:::exam[10-Mark Comprehensive]
Explain the physical concepts of storativity in confined versus unconfined aquifers. Derive the expressions for both equivalent horizontal ($K_h$) and vertical ($K_v$) hydraulic conductivities of stratified aquifers and prove that $K_h \\ge K_v$.
:::

:::sol
Proof that $K_h \\ge K_v$:
For any set of positive numbers $K_i$ with weights $b_i$:
- $K_h$ is the weighted arithmetic mean of $K_i$:
  $$K_h = \\frac{\\sum b_i K_i}{\\sum b_i}$$
- $K_v$ is the weighted harmonic mean of $K_i$:
  $$\\frac{1}{K_v} = \\frac{\\sum \\frac{b_i}{K_i}}{\\sum b_i} \\implies K_v = \\frac{\\sum b_i}{\\sum \\frac{b_i}{K_i}}$$
By the Cauchy-Schwarz inequality (Arithmetic Mean - Harmonic Mean Inequality), the weighted arithmetic mean is always greater than or equal to the weighted harmonic mean:
$$K_h \\ge K_v$$
Equality holds if and only if all layers have identical conductivities ($K_1 = K_2 = \\dots = K_n$, i.e. a completely homogeneous isotropic formation). In all natural stratified deposits, $K_h > K_v$.
:::
`;

// S40: Steady flow to unconfined wells
u5["S40"] = `<!--tab:Theory-->

> [!note] Key ideas
> - Steady radial flow to an open well in an unconfined aquifer is analyzed using the **Dupuit-Forchheimer assumptions**.
> - Dupuit assumptions: (1) Hydraulic gradient equals water table slope ($i = dh/dr$), (2) Flow is horizontal and uniform with depth, (3) Equipotential surfaces are vertical cylinders.
> - **Dupuit-Thiem Discharge Equation:**
>   $$Q = \\pi K \\frac{h_2^2 - h_1^2}{\\ln(r_2 / r_1)}$$
> - In terms of original saturated depth $H$ and radius of influence $R$:
>   $$Q = \\pi K \\frac{H^2 - h_w^2}{\\ln(R / r_w)}$$
> - Near the well face, actual water table exhibits a **seepage face** above the computed Dupuit free surface.

## 1. Radial Flow to an Unconfined Well

When a fully penetrating well is pumped at constant discharge $Q$ until equilibrium is reached:

\`\`\`
                     Radius of Influence (R)
       <------------------------------------------------>
                         Original Water Table Level
       ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ H
                      . - - - - - - .
                  . '                 ' .
                .'                       '.
              .'                           '.
             /                               \
            |   Pumping                       |
            |   Well                          |  Observation Well 2 (r2, h2)
            |   (rw, hw)                      |--|
            |   |===|                         |  | ~~~~
            |   |   |   Observation Well 1    |  |  |
            |   |   |   (r1, h1)              |  |  | h2
            |   |   |   |--|                  |  |  |
            |   |   |   |  | ~~~~             |  |  |
            |   |   |   |  |  | h1            |  |  |
       =====+===+===+===+==+==+===============+==+==+==== Impermeable Bed (z = 0)
\`\`\`

---

## 2. Derivation of the Dupuit-Thiem Equation

Consider a cylindrical shell at radial distance $r$ of height $h$ and thickness $dr$:
1. Cylindrical flow area: $A = 2 \\pi r h$
2. Hydraulic gradient: $i = \\frac{dh}{dr}$
3. Applying Darcy's law:
$$Q = K A i = K (2 \\pi r h) \\frac{dh}{dr}$$

Separating variables:
$$Q \\frac{dr}{r} = 2 \\pi K h \\, dh$$

Integrating between observation well 1 ($r = r_1, h = h_1$) and observation well 2 ($r = r_2, h = h_2$):
$$Q \\int_{r_1}^{r_2} \\frac{dr}{r} = 2 \\pi K \\int_{h_1}^{h_2} h \\, dh$$
$$Q \\ln\\left(\\frac{r_2}{r_1}\\right) = 2 \\pi K \\left[\\frac{h^2}{2}\\right]_{h_1}^{h_2} = \\pi K (h_2^2 - h_1^2)$$

Solving for discharge $Q$:
$$Q = \\frac{\\pi K (h_2^2 - h_1^2)}{\\ln(r_2 / r_1)}$$

Solving for hydraulic conductivity $K$:
$$K = \\frac{Q \\ln(r_2 / r_1)}{\\pi (h_2^2 - h_1^2)}$$

---

## 3. Worked Numerical Examples

### Worked Example 40.1: Hydraulic Conductivity from Unconfined Pumping Test

**Problem:** A pumping test was carried out in an unconfined sand aquifer of initial saturated depth $H = 25.0\\text{ m}$.
- Steady pumping discharge: $Q = 2592.0\\text{ m}^3\\text{/day}$ ($30.0\\text{ L/s}$)
- Observation well 1 at distance $r_1 = 15.0\\text{ m}$ registers a drawdown $s_1 = 3.20\\text{ m}$
- Observation well 2 at distance $r_2 = 45.0\\text{ m}$ registers a drawdown $s_2 = 1.40\\text{ m}$
Calculate:
1. Saturated depths $h_1$ and $h_2$ at the observation wells.
2. The hydraulic conductivity $K$ of the aquifer in $\\text{m/day}$.

**Solution:**

**Step 1: Compute saturated depths**
$$h_1 = H - s_1 = 25.0 - 3.20 = 21.80\\text{ m}$$
$$h_2 = H - s_2 = 25.0 - 1.40 = 23.60\\text{ m}$$

**Step 2: Compute terms for Dupuit formula**
$$h_2^2 - h_1^2 = (23.60)^2 - (21.80)^2 = 556.96 - 475.24 = 81.72\\text{ m}^2$$
$$\\ln\\left(\\frac{r_2}{r_1}\\right) = \\ln\\left(\\frac{45.0}{15.0}\\right) = \\ln(3.0) = 1.09861$$

**Step 3: Calculate hydraulic conductivity ($K$)**
$$K = \\frac{Q \\ln(r_2 / r_1)}{\\pi (h_2^2 - h_1^2)} = \\frac{2592.0 \\times 1.09861}{\\pi \\times 81.72} = \\frac{2847.60}{256.731} = 11.0917\\text{ m/day} \\approx 11.09\\text{ m/day}$$

---

### Worked Example 40.2: Well Discharge from Radius of Influence

**Problem:** An unconfined well of radius $r_w = 0.20\\text{ m}$ penetrates an aquifer of depth $H = 20.0\\text{ m}$ with $K = 15.0\\text{ m/day}$. During steady pumping, the water level in the well drops to $h_w = 16.0\\text{ m}$ (drawdown $s_w = 4.0\\text{ m}$). Assuming a radius of influence $R = 250.0\\text{ m}$, calculate the steady well discharge $Q$.

**Solution:**
$$H^2 - h_w^2 = (20.0)^2 - (16.0)^2 = 400.0 - 256.0 = 144.0\\text{ m}^2$$
$$\\ln(R / r_w) = \\ln(250.0 / 0.20) = \\ln(1250) = 7.1309$$
$$Q = \\frac{\\pi K (H^2 - h_w^2)}{\\ln(R / r_w)} = \\frac{\\pi \\times 15.0 \\times 144.0}{7.1309} = \\frac{6785.84}{7.1309} = 951.61\\text{ m}^3\\text{/day} \\approx 11.01\\text{ L/s}$$

---

### Session 40 recap
1. Dupuit assumptions treat unconfined flow as horizontal and radially symmetric.
2. Discharge: $Q = \\pi K (h_2^2 - h_1^2) / \\ln(r_2 / r_1)$.
3. Conductivity: $K = Q \\ln(r_2 / r_1) / [\\pi (h_2^2 - h_1^2)]$.
4. Seepage face occurs near the well wall where actual water table lies above Dupuit water surface.

<!--tab:In class-->

## In-Class Activities & Verification

### Activity 1: Dupuit Discharge Calculation Check

Given $K = 15.0\\text{ m/day}$, $r_1 = 15\\text{ m}, h_1 = 16.0\\text{ m}$; $r_2 = 50\\text{ m}, h_2 = 18.0\\text{ m}$. Compute $Q$ in $\\text{m}^3\\text{/day}$.
$h_2^2 - h_1^2 = 324 - 256 = 68.0\\text{ m}^2$. $\\ln(50/15) = \\ln(3.333) = 1.204$.

\`\`\`check
Q = 2657.0 m3/day
Tolerance: 10.0 m3/day
Hint: Q = pi * 15 * 68 / 1.204 = 3204.42 / 1.204 = 2661.5 m3/day.
\`\`\`

<!--tab:Software lab-->

## Lab Linkage: Wellhead Protection Zones in QGIS

In **QGIS**:
1. Take well locations and computed drawdown radii ($R$).
2. Use **Buffer (Geoprocessing Tool)** to establish 50-meter sanitary protection zones and 250-meter capture zones.
3. Overlay with land-use layers to detect contamination hazards (septic tanks, agricultural runoff).

<!--tab:Practice-->

## Practice Quiz & Exam Questions

\`\`\`quiz
1. Which of the following is NOT a Dupuit-Forchheimer assumption?
* Vertical velocity components are significantly greater than horizontal components
- Flow is horizontal and equipotential surfaces are vertical cylinders
- The hydraulic gradient equals the slope of the free water table
- Darcy's law is valid throughout the flow domain

2. In Dupuit's radial flow equation for unconfined aquifers, the discharge Q is proportional to:
* The difference between the squares of the saturated depths (h2^2 - h1^2)
- The linear difference in drawdowns (s1 - s2)
- The square root of the hydraulic conductivity (sqrt(K))
- The inverse square of the well radius (1 / rw^2)

3. What is the 'seepage face' observed at an unconfined pumping well?
* The vertical interval on the well casing above the well water level where water discharges freely through air
- The outer boundary of the radius of influence
- The impermeable base of the aquifer
- The capillary rise in an observation piezometer
\`\`\`

### Examination Questions

:::exam[5-Mark Derivation]
Derive the Dupuit-Thiem formula $Q = \\frac{\\pi K (h_2^2 - h_1^2)}{\\ln(r_2 / r_1)}$ for steady radial flow to a fully penetrating well in an unconfined aquifer. Clearly state the underlying assumptions.
:::

:::exam[10-Mark Numerical]
A 30 cm diameter tube well fully penetrates an unconfined aquifer with an initial saturated depth of 30.0 m. When pumped at a constant rate of 1800 m3/day, drawdown in two observation wells located at 20 m and 80 m from the test well are 2.5 m and 0.8 m respectively.
1. Determine the hydraulic conductivity $K$ of the aquifer.
2. If the radius of influence is estimated as $R = 300\\text{ m}$, calculate the drawdown in the pumping well.
:::

:::sol
1. Saturated depths:
   - $h_1 = 30.0 - 2.5 = 27.5\\text{ m}$
   - $h_2 = 30.0 - 0.8 = 29.2\\text{ m}$
   - $h_2^2 - h_1^2 = (29.2)^2 - (27.5)^2 = 852.64 - 756.25 = 96.39\\text{ m}^2$
   - $\\ln(r_2 / r_1) = \\ln(80 / 20) = \\ln(4) = 1.3863$
   - $K = \\frac{Q \\ln(r_2 / r_1)}{\\pi (h_2^2 - h_1^2)} = \\frac{1800 \\times 1.3863}{\\pi \\times 96.39} = \\frac{2495.34}{302.82} = 8.24\\text{ m/day}$
2. Drawdown at pumping well ($r_w = 0.15\\text{ m}$, $R = 300\\text{ m}$, $H = 30.0\\text{ m}$):
   - $Q = \\frac{\\pi K (H^2 - h_w^2)}{\\ln(R / r_w)} \\implies 1800 = \\frac{\\pi \\times 8.24 \\times (900 - h_w^2)}{\\ln(300 / 0.15)}$
   - $\\ln(2000) = 7.6009$
   - $900 - h_w^2 = \\frac{1800 \\times 7.6009}{\\pi \\times 8.24} = \\frac{13681.6}{25.887} = 528.51$
   - $h_w^2 = 900 - 528.51 = 371.49 \\implies h_w = \\sqrt{371.49} = 19.27\\text{ m}$
   - Drawdown at well: $s_w = H - h_w = 30.0 - 19.27 = 10.73\\text{ m}$.
:::
`;

// S41: Steady flow to confined wells and well construction
u5["S41"] = `<!--tab:Theory-->

> [!note] Key ideas
> - Steady radial flow to a fully penetrating well in a confined aquifer of uniform thickness $b$ is governed by the **Thiem Equilibrium Formula**:
>   $$Q = \\frac{2 \\pi K b (h_2 - h_1)}{\\ln(r_2 / r_1)} = \\frac{2 \\pi T (s_1 - s_2)}{\\ln(r_2 / r_1)}$$
> - Unlike unconfined flow, the flow thickness $b$ remains constant everywhere; drawdown is linear in head differences $(s_1 - s_2)$.
> - Well drilling methods: Rotary drilling (direct/reverse circulation), Cable tool (percussion), and DTH (Down-the-Hole) hammer for hard rock.
> - Well construction components: Well casing, well screen (slotted pipe/continuous wire wrap), artificial gravel pack, sanitary surface seal, and pump installation.

## 1. Radial Flow to a Confined Well (Thiem Equation)

Consider an artesian aquifer bounded by impermeable aquicludes at top and bottom:

\`\`\`
                     Radius of Influence (R)
       <------------------------------------------------>
                         Original Piezometric Surface
       ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ H
                      . - - - - - - .
                  . '                 ' .
                .'                       '.
       ========+===========================+============= Impermeable Upper Bed
               |   Pumping                 |
               |   Well                    |  Observation Well 2 (r2, s2)
               |   (rw, sw)                |--|
               |   |===|                   |  | ~~~~
               |   |   | Observation Well 1|  |  | Piezometric head
               |   |   | (r1, s1)          |  |  |
               |   |   | |--|              |  |  | Aquifer Thickness (b)
               |   |   | |  | ~~~~         |  |  |
       ========+===+===+=+==+==+===========+==+==+======= Impermeable Lower Bed
\`\`\`

Applying Darcy's law at a cylindrical shell of radius $r$:
$$A = 2 \\pi r b$$
$$Q = K A \\frac{dh}{dr} = 2 \\pi r b K \\frac{dh}{dr} = 2 \\pi r T \\frac{dh}{dr}$$

Separating variables and integrating from $r_1$ to $r_2$:
$$Q \\int_{r_1}^{r_2} \\frac{dr}{r} = 2 \\pi T \\int_{h_1}^{h_2} dh$$
$$Q \\ln\\left(\\frac{r_2}{r_1}\\right) = 2 \\pi T (h_2 - h_1) = 2 \\pi T (s_1 - s_2)$$

$$Q = \\frac{2 \\pi T (s_1 - s_2)}{\\ln(r_2 / r_1)} = \\frac{2 \\pi K b (s_1 - s_2)}{\\ln(r_2 / r_1)}$$

$$T = \\frac{Q \\ln(r_2 / r_1)}{2 \\pi (s_1 - s_2)}$$

---

## 2. Tube Well Construction & Design

\`\`\`
       Ground Level
       ================[ Concrete Sanitary Seal ]================
              ||                                          ||
              ||   Surface Casing                         ||
              ||                                          ||
       =======++==========================================++===== Confining Clay
              ||                                          ||
              ||   Blind Casing Pipe                      ||
              ||                                          ||
       -------++------------------------------------------++----- Saturated Aquifer
              |#|  <-- Artificial Gravel Pack             |#|
              |#| [|||||| Continuous Slot Well Screen |||||]|#|
              |#|                                         |#|
       =======++==========================================++===== Bedrock
              ||   Bail Plug / Silt Trap                  ||
       ==========================================================
\`\`\`

1. **Well Screen Slot Size:** Determined from sieve analysis of aquifer sediment. Typically set to retain $40\\text{--}50\\%$ of aquifer material (or $90\\%$ of gravel pack).
2. **Artificial Gravel Pack:** Uniformly graded silica sand/gravel placed in the annular space between borehole wall and screen to prevent fine sand ingress and reduce entry losses.
3. **Well Development:** Surging, jetting with compressed air, or overpumping to wash away drilling mud (bentonite) cake and mobilize fine sand particles adjacent to the screen.

---

## 3. Worked Numerical Examples

### Worked Example 41.1: Confined Aquifer Pumping Test (Thiem Equation)

**Problem:** A confined aquifer has a uniform thickness $b = 15.0\\text{ m}$. A fully penetrating test well is pumped at $Q = 2400.0\\text{ m}^3\\text{/day}$ ($27.78\\text{ L/s}$).
At steady state, two observation wells show:
- Well 1 at $r_1 = 20.0\\text{ m}$: Drawdown $s_1 = 2.40\\text{ m}$
- Well 2 at $r_2 = 60.0\\text{ m}$: Drawdown $s_2 = 1.10\\text{ m}$
Calculate:
1. The transmissivity $T$ of the aquifer in $\\text{m}^2\\text{/day}$.
2. The hydraulic conductivity $K$ in $\\text{m/day}$.

**Solution:**

**Step 1: Compute drawdown difference and logarithmic ratio**
$$s_1 - s_2 = 2.40 - 1.10 = 1.30\\text{ m}$$
$$\\ln\\left(\\frac{r_2}{r_1}\\right) = \\ln\\left(\\frac{60.0}{20.0}\\right) = \\ln(3.0) = 1.09861$$

**Step 2: Calculate Transmissivity ($T$)**
$$T = \\frac{Q \\ln(r_2 / r_1)}{2 \\pi (s_1 - s_2)} = \\frac{2400.0 \\times 1.09861}{2 \\pi \\times 1.30} = \\frac{2636.669}{8.16814} = 322.799\\text{ m}^2\\text{/day} \\approx 322.8\\text{ m}^2\\text{/day}$$

**Step 3: Calculate Hydraulic Conductivity ($K$)**
$$K = \\frac{T}{b} = \\frac{322.799\\text{ m}^2\\text{/day}}{15.0\\text{ m}} = 21.520\\text{ m/day} \\approx 21.52\\text{ m/day}$$

---

### Worked Example 41.2: Drawdown Prediction at an Observation Well

**Problem:** Using the aquifer parameters from Example 41.1 ($T = 322.8\\text{ m}^2\\text{/day}$), predict the steady-state drawdown $s$ at an observation point located $r = 120.0\\text{ m}$ from the test well.

**Solution:**
From Thiem equation between observation well 2 ($r_2 = 60\\text{ m}, s_2 = 1.10\\text{ m}$) and point 3 ($r_3 = 120\\text{ m}, s_3$):
$$s_2 - s_3 = \\frac{Q \\ln(r_3 / r_2)}{2 \\pi T} = \\frac{2400.0 \\times \\ln(120 / 60)}{2 \\pi \\times 322.8} = \\frac{2400.0 \\times 0.69315}{2028.2} = \\frac{1663.56}{2028.2} = 0.820\\text{ m}$$
$$s_3 = s_2 - 0.820\\text{ m} = 1.10 - 0.820 = 0.280\\text{ m}$$

---

### Session 41 recap
1. Thiem equation for confined aquifers: $Q = 2 \\pi T (s_1 - s_2) / \\ln(r_2 / r_1)$.
2. Drawdown varies logarithmically with radial distance: $s(r) \\propto \\ln(R/r)$.
3. Well development is critical to remove drilling mud and establish gravel pack bridge.
4. Down-the-Hole (DTH) hammer drilling is the standard method for peninsular Indian hard rock.

<!--tab:In class-->

## In-Class Activities & Verification

### Activity 1: Thiem Transmissivity Calculation Check

Given $Q = 1800.0\\text{ m}^3\\text{/day}$, $r_1 = 25\\text{ m}, s_1 = 3.0\\text{ m}$; $r_2 = 75\\text{ m}, s_2 = 1.5\\text{ m}$. Compute $T$ in $\\text{m}^2\\text{/day}$.
$s_1 - s_2 = 1.5\\text{ m}$. $\\ln(75/25) = \\ln(3) = 1.0986$.

\`\`\`check
T = 209.8 m2/day
Tolerance: 1.0 m2/day
Hint: T = (1800 * 1.0986) / (2 * pi * 1.5) = 1977.5 / 9.4248 = 209.82 m2/day.
\`\`\`

<!--tab:Software lab-->

## Lab Linkage: Cone of Depression 3D Surface in QGIS

In **QGIS**:
1. Use the analytical Thiem equation in the **Raster Calculator** to generate the theoretical drawdown surface around a pumping cluster:
   $$s(r) = \\frac{Q}{2 \\pi T} \\ln(R / r)$$
2. Render in **Qgis2threejs** 3D viewer to visualize the regional cone of depression and well interference effects.

<!--tab:Practice-->

## Practice Quiz & Exam Questions

\`\`\`quiz
1. In a confined aquifer under steady pumping, why does drawdown vary directly with (s1 - s2) rather than (h2^2 - h1^2)?
* Because the saturated thickness b remains constant throughout the cone of depression
- Because water is incompressible
- Because confined aquifers have no storativity
- Because flow velocity is turbulent

2. What is the primary purpose of well development after drilling and screen placement?
* To remove drilling mud and fine silt from the borehole face and stabilize the gravel pack
- To deepen the borehole by further rock fracturing
- To sterilize the borehole against bacterial contamination
- To lower the piezometric surface permanently

3. Which drilling technique is most effective for penetrating hard crystalline granites and basalts?
* Down-The-Hole (DTH) hammer drilling
- Mud rotary drilling
- Hand auger drilling
- Jetting method
\`\`\`

### Examination Questions

:::exam[5-Mark Derivation]
Derive the Thiem equation $Q = \\frac{2 \\pi T (s_1 - s_2)}{\\ln(r_2 / r_1)}$ for steady radial flow to a fully penetrating well in a confined aquifer.
:::

:::exam[10-Mark Comprehensive]
Describe with a neat cross-sectional diagram the construction of a deep tube well in an alluvial formation. Detail the design criteria for well casing, well screen slot openings, artificial gravel pack, and sanitary sealing.
:::

:::sol
Tube Well Construction Components:
1. Borehole: Drilled using direct rotary or reverse mud circulation to the target aquifer depth.
2. Casing Pipe: Plain mild steel or PVC pipes installed through topsoil and confining impermeable layers to prevent borehole collapse and seal off contaminated shallow water.
3. Well Screen: Slotted pipes or continuous wire-wrapped screens positioned exactly opposite the permeable water-bearing aquifer zones.
4. Gravel Pack: Clean, rounded silica gravel graded to $D_{50\\text{ (pack)}} = 4\\text{--}6 \\times D_{50\\text{ (aquifer)}}$ placed in the annular space between casing and borehole wall.
5. Sanitary Surface Seal: 1:2 cement-sand grout pumped into the upper 5–10 meters of annular space to block surface water infiltration.
6. Bail Plug: Solid plug with silt chamber at the bottom of the casing assembly to trap settling fine sediment.
:::
`;

// S42: Unsteady flow to confined wells (Theis equation)
u5["S42"] = `<!--tab:Theory-->

> [!note] Key ideas
> - Pumping tests rarely reach true steady state; unsteady flow is governed by the **Theis (1935) Non-Equilibrium Equation**.
> - Governing partial differential equation: $\\frac{\\partial^2 s}{\\partial r^2} + \\frac{1}{r} \\frac{\\partial s}{\\partial r} = \\frac{S}{T} \\frac{\\partial s}{\\partial t}$.
> - Theis solution:
>   $$s = \\frac{Q}{4 \\pi T} W(u) \\quad \\text{where } u = \\frac{r^2 S}{4 T t}$$
> - $W(u)$ is the **Well Function** (exponential integral $E_1(u)$):
>   $$W(u) = -0.5772 - \\ln(u) + u - \\frac{u^2}{2 \\cdot 2!} + \\frac{u^3}{3 \\cdot 3!} - \\dots$$
> - Aquifer parameters $T$ and $S$ are determined using **Theis Type-Curve Matching**.

## 1. Theis Non-Equilibrium Formulation

In 1935, C.V. Theis introduced the analogy between heat conduction (Fourier's law) and unsteady groundwater flow.
Assumptions:
1. Aquifer is confined, homogeneous, isotropic, of uniform thickness $b$, and infinite aerial extent.
2. Well has negligible casing storage and fully penetrates the aquifer.
3. Water removed from storage is discharged instantaneously with decline in head.

\`\`\`
       Drawdown s (m)
          ^
          |                             Curve of Drawdown vs Time
          |                           .---------------------------
          |                        .'
          |                     .'
          |                  .'
          |               .'
          |             .
          +------------+---------------------------------------------> Time t
          0
\`\`\`

The solution relates drawdown $s$ at distance $r$ and time $t$ to constant discharge $Q$:
$$s = \\frac{Q}{4 \\pi T} W(u)$$

Where the dimensionless parameter $u$ is:
$$u = \\frac{r^2 S}{4 T t}$$

---

## 2. The Well Function $W(u)$

Values of $W(u)$ for representative values of $u$:
| $u$ | $W(u)$ | Approximated by $-\\ln(u) - 0.5772$ |
|---|---|---|
| 0.1 | 1.8229 | 1.7254 |
| 0.05 | 2.4679 | 2.4185 |
| 0.01 | 4.0379 | 4.0279 |
| 0.005 | 4.7261 | 4.7211 |
| 0.001 | 6.3315 | 6.3305 |
| 0.0001 | 8.6332 | 8.6331 |

When $u \\le 0.01$, higher-order terms become negligible and $W(u) \\approx -\\ln(u) - 0.5772$.

---

## 3. Worked Numerical Examples

### Worked Example 42.1: Drawdown Prediction by Theis Equation

**Problem:** A confined artesian aquifer has calibrated hydraulic parameters:
- Transmissivity: $T = 450.0\\text{ m}^2\\text{/day}$
- Storativity: $S = 3.0 \\times 10^{-4}$
A new well is pumped at a constant rate of $Q = 1500.0\\text{ m}^3\\text{/day}$ ($17.36\\text{ L/s}$).
Calculate the theoretical drawdown in an observation well located at distance $r = 100.0\\text{ m}$ after:
1. $t = 1.50\\text{ days}$ of continuous pumping.

**Solution:**

**Step 1: Compute dimensionless argument $u$**
$$u = \\frac{r^2 S}{4 T t} = \\frac{(100.0\\text{ m})^2 \\times (3.0 \\times 10^{-4})}{4 \\times 450.0\\text{ m}^2\\text{/day} \\times 1.50\\text{ days}}$$
$$u = \\frac{10{,}000 \\times 3.0 \\times 10^{-4}}{2700.0} = \\frac{3.0}{2700.0} = 0.0011111$$

**Step 2: Compute Well Function $W(u)$**
Since $u = 0.0011111 < 0.01$, we use the series truncation:
$$W(u) \\approx -\\ln(u) - 0.57721566$$
$$\\ln(0.0011111) = -6.80239$$
$$W(u) = 6.80239 - 0.57722 = 6.22517$$

**Step 3: Calculate Drawdown ($s$)**
$$s = \\frac{Q}{4 \\pi T} W(u) = \\frac{1500.0\\text{ m}^3\\text{/day}}{4 \\pi \\times 450.0\\text{ m}^2\\text{/day}} \\times 6.22517$$
$$s = \\frac{1500.0}{5654.87} \\times 6.22517 = 0.265258 \\times 6.22517 = 1.6513\\text{ m} \\approx 1.65\\text{ m}$$

---

### Worked Example 42.2: Time Required to Achieve a Specified Drawdown

**Problem:** For the same well and observation point ($r = 100\\text{ m}$, $T = 450\\text{ m}^2\\text{/day}$, $S = 3.0 \\times 10^{-4}$), calculate the pumping duration required to produce a drawdown of $s = 1.00\\text{ m}$.

**Solution:**
$$s = \\frac{Q}{4 \\pi T} W(u) \\implies 1.00 = 0.265258 \\times W(u) \\implies W(u) = \\frac{1.00}{0.265258} = 3.7699$$
Using $W(u) \\approx -\\ln(u) - 0.5772$:
$$-\\ln(u) = 3.7699 + 0.5772 = 4.3471 \\implies \\ln(u) = -4.3471$$
$$u = e^{-4.3471} = 0.01294$$
Since $u = \\frac{r^2 S}{4 T t}$:
$$t = \\frac{r^2 S}{4 T u} = \\frac{(100)^2 \\times (3.0 \\times 10^{-4})}{4 \\times 450 \\times 0.01294} = \\frac{3.0}{23.299} = 0.12876\\text{ days} = 3.09\\text{ hours}$$

---

### Session 42 recap
1. Theis equation models unsteady non-equilibrium radial flow.
2. $s = \\frac{Q}{4 \\pi T} W(u)$ where $u = r^2 S / (4 T t)$.
3. For $u \\le 0.01$, $W(u) \\approx -\\ln(u) - 0.5772$.
4. Log-log curve matching of field $s$ vs $r^2/t$ against type curve $W(u)$ vs $u$ yields $T$ and $S$.

<!--tab:In class-->

## In-Class Activities & Verification

### Activity 1: Argument u Calculation Check

Given $r = 80\\text{ m}$, $S = 2.0 \\times 10^{-4}$, $T = 400.0\\text{ m}^2\\text{/day}$, and $t = 2.0\\text{ days}$. Compute the dimensionless argument $u$.

\`\`\`check
u = 0.0004
Tolerance: 0.00005
Hint: u = (80^2 * 2e-4) / (4 * 400 * 2) = (6400 * 2e-4) / 3200 = 1.28 / 3200 = 0.00040.
\`\`\`

### Activity 2: Well Function Check

For $u = 0.00040$, compute $W(u)$ using the logarithmic approximation $W(u) = -\\ln(u) - 0.5772$.

\`\`\`check
W_u = 7.247
Tolerance: 0.02
Hint: ln(0.0004) = -7.8240. W(u) = 7.8240 - 0.5772 = 7.2468.
\`\`\`

<!--tab:Software lab-->

## Lab Linkage: Theis Curve Matching in Python / Spreadsheet

In **Python**:
1. Load observed pumping test time-drawdown data from a CSV file.
2. Generate theoretical Theis type curve values using \`scipy.special.exp1(u)\`.
3. Overlay the log-log field data plot over the type curve to determine the match point coordinates $[W(u), u, s, t]$ and solve for $T$ and $S$.

<!--tab:Practice-->

## Practice Quiz & Exam Questions

\`\`\`quiz
1. What physical phenomenon does the Theis equation account for that the Thiem equation ignores?
* The transient release of water from aquifer storage over time
- Flow turbulence in the well screen
- Density variations due to water temperature
- Barometric pressure fluctuations

2. When is the logarithmic approximation W(u) = -ln(u) - 0.5772 valid?
* When u is less than or equal to 0.01 (small r or large t)
- When u is greater than 10.0
- Only when the aquifer is unconfined
- Only during the first five seconds of pumping

3. In the Theis equation, the dimensionless parameter u is inversely proportional to:
* Pumping duration t
- Radial distance squared r^2
- Aquifer storativity S
- Well screen length
\`\`\`

### Examination Questions

:::exam[5-Mark Derivation]
State the assumptions of the Theis non-equilibrium theory and write the governing differential equation. Explain the significance of the Well Function $W(u)$ and its series expansion.
:::

:::exam[10-Mark Comprehensive]
Explain the step-by-step graphical procedure of Theis Type-Curve Matching for determining the transmissivity $T$ and storage coefficient $S$ from pumping test data.
:::

:::sol
Theis Type-Curve Matching Procedure:
1. Construct Type Curve: Plot $W(u)$ versus $1/u$ (or $u$) on log-log graph paper using standard mathematical tables of the exponential integral.
2. Prepare Field Data Plot: On transparent log-log tracing paper having the exact same scale, plot observed drawdown $s$ on the vertical axis versus elapsed time $t$ on the horizontal axis.
3. Curve Superposition: Overlay the transparent field data plot on the master type curve. Keeping the coordinate axes strictly parallel, translate the sheet until the observed field data points coincide closely with the type curve.
4. Select Match Point: Pick an arbitrary convenient match point anywhere on the aligned sheets (often chosen at $W(u) = 1.0$ and $1/u = 10$ or $u = 0.1$ for arithmetic ease).
5. Read Coordinates: Record the four corresponding values:
   - $[W(u), u]$ from the type curve grid
   - $[s, t]$ from the field data grid
6. Calculate Transmissivity:
   $$T = \\frac{Q}{4 \\pi s} W(u)$$
7. Calculate Storativity:
   $$S = \\frac{4 T t u}{r^2}$$
:::
`;

// S43: Cooper-Jacob method and rooftop harvesting
u5["S43"] = `<!--tab:Theory-->

> [!note] Key ideas
> - The **Cooper-Jacob (1946) Straight-Line Method** is an elegant simplification of the Theis equation for small $u$ ($u \\le 0.01$, i.e. large $t$ or small $r$).
> - Governing straight-line semi-log equation:
>   $$s = \\frac{2.303 Q}{4 \\pi T} \\log_{10}\\left(\\frac{2.25 T t}{r^2 S}\\right)$$
> - A semi-log plot of drawdown $s$ against $\\log_{10}(t)$ forms a straight line with slope per log cycle $\\Delta s$:
>   $$T = \\frac{2.303 Q}{4 \\pi \\Delta s}$$
> - Zero-drawdown intercept on the time axis ($t_0$) determines storativity:
>   $$S = \\frac{2.25 T t_0}{r^2}$$

## 1. Cooper-Jacob Straight-Line Approximation

When pumping duration $t$ becomes reasonably large, the argument $u = \\frac{r^2 S}{4 T t}$ becomes very small ($u \\le 0.01$). Truncating the Theis series after the logarithmic term:
$$W(u) \\approx -\\ln(u) - 0.5772 = \\ln\\left(\\frac{1}{u}\\right) - \\ln(e^{0.5772}) = \\ln\\left(\\frac{1}{1.781 u}\\right) = \\ln\\left(\\frac{0.5615}{u}\\right)$$

Substituting $u = \\frac{r^2 S}{4 T t}$:
$$W(u) \\approx \\ln\\left(\\frac{0.5615 \\times 4 T t}{r^2 S}\\right) = \\ln\\left(\\frac{2.246 T t}{r^2 S}\\right) \\approx \\ln\\left(\\frac{2.25 T t}{r^2 S}\\right)$$

Converting to base-10 logarithm:
$$s = \\frac{Q}{4 \\pi T} \\ln\\left(\\frac{2.25 T t}{r^2 S}\\right) = \\frac{2.303 Q}{4 \\pi T} \\log_{10}\\left(\\frac{2.25 T t}{r^2 S}\\right)$$

\`\`\`
       Drawdown s (m)
          ^
          |                                  Slope = \Delta s (per log cycle)
          |                                    /
          |                                  /
          |                                /
          |                              /
          |                            /
          |                          /
       0 -+-------------------------+----------------------------> log10(t)
                                    t0 (Zero-drawdown intercept)
\`\`\`

---

## 2. Graphical Determination of $T$ and $S$

1. **Drawdown per log cycle ($\\Delta s$):**
Between any two times $t_1$ and $t_2$ spaced one full decade apart ($t_2 / t_1 = 10$, $\\log_{10}(10) = 1$):
$$\\Delta s = s_2 - s_1 = \\frac{2.303 Q}{4 \\pi T} \\implies T = \\frac{2.303 Q}{4 \\pi \\Delta s}$$

2. **Time axis intercept ($t_0$):**
Extending the straight line to zero drawdown ($s = 0$):
$$\\log_{10}\\left(\\frac{2.25 T t_0}{r^2 S}\\right) = 0 \\implies \\frac{2.25 T t_0}{r^2 S} = 1.0$$
$$S = \\frac{2.25 T t_0}{r^2}$$

---

## 3. Worked Numerical Examples

### Worked Example 43.1: Aquifer Parameters by Cooper-Jacob Method

**Problem:** A pumping test in a confined aquifer at constant rate $Q = 1800.0\\text{ m}^3\\text{/day}$ ($20.83\\text{ L/s}$) provides drawdown data at an observation well $r = 50.0\\text{ m}$.
A semi-log plot of drawdown $s$ against elapsed time $t$ shows a straight line with:
- Drawdown difference per log cycle of time: $\\Delta s = 1.15\\text{ m}$
- Zero-drawdown intercept on the time axis: $t_0 = 12.0\\text{ minutes} = 0.008333\\text{ day}$
Calculate:
1. The aquifer transmissivity $T$ in $\\text{m}^2\\text{/day}$.
2. The storage coefficient $S$.
3. Check whether the Cooper-Jacob criterion ($u \\le 0.01$) is satisfied after $t = 120\\text{ minutes}$ ($0.0833\\text{ day}$).

**Solution:**

**Step 1: Compute Transmissivity ($T$)**
$$T = \\frac{2.303 Q}{4 \\pi \\Delta s} = \\frac{2.303 \\times 1800.0\\text{ m}^3\\text{/day}}{4 \\pi \\times 1.15\\text{ m}} = \\frac{4145.40}{14.4513} = 286.853\\text{ m}^2\\text{/day} \\approx 286.9\\text{ m}^2\\text{/day}$$

**Step 2: Compute Storage Coefficient ($S$)**
$$S = \\frac{2.25 T t_0}{r^2} = \\frac{2.25 \\times 286.853\\text{ m}^2\\text{/day} \\times 0.008333\\text{ day}}{(50.0\\text{ m})^2}$$
$$S = \\frac{5.3784}{2500.0} = 0.0021513 \\approx 2.15 \\times 10^{-3}$$

**Step 3: Check validity condition ($u \\le 0.01$) at $t = 0.08333\\text{ day}$**
$$u = \\frac{r^2 S}{4 T t} = \\frac{2500.0 \\times 0.0021513}{4 \\times 286.853 \\times 0.08333} = \\frac{5.3783}{95.617} = 0.056$$
For $u \\le 0.01$:
$$t \\ge \\frac{r^2 S}{4 T \\times 0.01} = \\frac{5.3783}{11.474} = 0.4687\\text{ days} = 11.25\\text{ hours}$$
*(Points for $t > 11.25\\text{ hours}$ strictly satisfy $u \\le 0.01$).*

---

### Worked Example 43.2: Distance-Drawdown Analysis

**Problem:** At $t = 240\\text{ minutes}$, simultaneous drawdowns measured in two observation wells at $r_1 = 30\\text{ m}$ and $r_2 = 120\\text{ m}$ yield a drawdown difference per log cycle of distance $\\Delta s_r = 2.40\\text{ m}$. Given $Q = 2000\\text{ m}^3\\text{/day}$, compute $T$.

**Solution:**
In distance-drawdown semi-log plots:
$$T = \\frac{2.303 Q}{2 \\pi \\Delta s_r} = \\frac{2.303 \\times 2000}{2 \\pi \\times 2.40} = \\frac{4606.0}{15.0796} = 305.45\\text{ m}^2\\text{/day} \\approx 305.5\\text{ m}^2\\text{/day}$$

---

### Session 43 recap
1. Cooper-Jacob linearizes Theis for $u \\le 0.01$.
2. Transmissivity: $T = 2.303 Q / (4 \\pi \\Delta s)$.
3. Storativity: $S = 2.25 T t_0 / r^2$.
4. Eliminates the subjectivity of graphical type-curve curve matching.

<!--tab:In class-->

## In-Class Activities & Verification

### Activity 1: Cooper-Jacob Transmissivity Check

Given $Q = 1200.0\\text{ m}^3\\text{/day}$ and $\\Delta s = 0.95\\text{ m}$ per log cycle. Compute $T$ in $\\text{m}^2\\text{/day}$.

\`\`\`check
T = 231.5 m2/day
Tolerance: 1.0 m2/day
Hint: T = (2.303 * 1200) / (4 * pi * 0.95) = 2763.6 / 11.938 = 231.49 m2/day.
\`\`\`

### Activity 2: Storativity Check

Given $T = 231.5\\text{ m}^2\\text{/day}$, $t_0 = 0.0050\\text{ day}$, and $r = 40.0\\text{ m}$. Compute storativity $S$.

\`\`\`check
S = 0.00163
Tolerance: 0.0001
Hint: S = (2.25 * 231.5 * 0.005) / 40^2 = 2.6044 / 1600 = 0.001628.
\`\`\`

<!--tab:Software lab-->

## Lab Linkage: Automated Pumping Test Analysis in Python

In **Python**:
1. Filter time-drawdown data to retain points where $u \\le 0.01$.
2. Perform linear regression on $s$ vs $\\log_{10}(t)$ using \`scipy.stats.linregress\`.
3. Extract slope $\\Delta s$ and intercept $t_0$, and compute confidence intervals for $T$ and $S$.

<!--tab:Practice-->

## Practice Quiz & Exam Questions

\`\`\`quiz
1. What threshold must the dimensionless parameter u satisfy for the Cooper-Jacob straight-line method to be valid within 5% error?
* u <= 0.01
- u >= 1.0
- u between 10 and 100
- u = 0.5772

2. On a Cooper-Jacob semi-log plot of drawdown versus time, the storativity S is calculated from:
* The zero-drawdown time intercept t0
- The slope of the line Delta s
- The maximum recorded drawdown
- The well casing diameter

3. If pumping rate Q is doubled while keeping aquifer parameters constant, the slope Delta s per log cycle will:
* Double
- Halve
- Remain unchanged
- Quadruple
\`\`\`

### Examination Questions

:::exam[5-Mark Derivation]
Derive the Cooper-Jacob equations $T = \\frac{2.303 Q}{4 \\pi \\Delta s}$ and $S = \\frac{2.25 T t_0}{r^2}$ starting from the Theis non-equilibrium formula.
:::

:::exam[10-Mark Numerical]
A well in a confined aquifer was pumped at a constant rate of 2200 m3/day. Time-drawdown data recorded at an observation well 60 m away yielded the following values on the straight-line portion of a semi-log plot:
- At $t = 10\\text{ min}$: $s = 0.82\\text{ m}$
- At $t = 100\\text{ min}$: $s = 1.95\\text{ m}$
1. Calculate the drawdown per log cycle $\\Delta s$.
2. Determine the transmissivity $T$.
3. Find the zero-drawdown intercept $t_0$ and compute the storage coefficient $S$.
:::

:::sol
1. Slope per log cycle:
   Because $t_2 / t_1 = 100 / 10 = 10$ (exactly one log cycle):
   $$\\Delta s = s_{100} - s_{10} = 1.95 - 0.82 = 1.13\\text{ m}$$
2. Transmissivity ($T$):
   $$T = \\frac{2.303 Q}{4 \\pi \\Delta s} = \\frac{2.303 \\times 2200}{4 \\pi \\times 1.13} = \\frac{5066.6}{14.200} = 356.8\\text{ m}^2\\text{/day}$$
3. Zero-drawdown intercept ($t_0$):
   Using the equation of the straight line $s = \\Delta s \\log_{10}(t / t_0)$:
   $$0.82 = 1.13 \\log_{10}\\left(\\frac{10}{t_0}\\right) \\implies \\log_{10}\\left(\\frac{10}{t_0}\\right) = \\frac{0.82}{1.13} = 0.7257$$
   $$\\frac{10}{t_0} = 10^{0.7257} = 5.317 \\implies t_0 = \\frac{10}{5.317} = 1.881\\text{ min} = 0.001306\\text{ day}$$
   Storativity:
   $$S = \\frac{2.25 T t_0}{r^2} = \\frac{2.25 \\times 356.8 \\times 0.001306}{(60)^2} = \\frac{1.0485}{3600} = 2.91 \\times 10^{-4}$$
:::
`;

// S44: Well losses, specific capacity & recuperation test
u5["S44"] = `<!--tab:Theory-->

> [!note] Key ideas
> - Total drawdown inside a pumping well ($s_w$) exceeds theoretical aquifer drawdown due to well entry losses: **Jacob's Well Equation**:
>   $$s_w = s_a + s_w' = B Q + C Q^2$$
>   where $B Q$ is laminar aquifer loss and $C Q^2$ is turbulent well loss.
> - **Well Efficiency:** $\\eta_w = \\frac{B Q}{B Q + C Q^2} \\times 100\\%$.
> - **Specific Capacity ($Q / s_w$):** Measure of well productivity ($[L^2/T]$, e.g., $\\text{m}^3\\text{/h per meter}$).
> - **Open Well Recuperation Test:** Used across hard-rock areas in India to find specific capacity factor ($K/A$) and safe yield:
>   $$\\frac{K}{A} = \\frac{2.303}{t} \\log_{10}\\left(\\frac{s_1}{s_2}\\right)$$

## 1. Well Losses & Step-Drawdown Testing

Total drawdown in a pumped well consists of two distinct components:

\`\`\`
       Drawdown Head
          ^
          |                 Turbulent Well Loss (C * Q^2)
          |                [Screen friction, gravel pack entrance]
          |               +---------------------------------------
          |              /
          |             /   Laminar Aquifer Loss (B * Q)
          |            /   [Radial Darcy flow through aquifer formation]
          |           /
          |          /
          +---------+---------------------------------------------> Discharge Q
          0
\`\`\`

1. **Aquifer Loss ($s_a = B Q$):** Laminar Darcian flow resistance within the aquifer formation ($B = B_1 + B_2(t)$).
2. **Well Loss ($s_w' = C Q^2$):** Non-linear turbulent head losses through the disturbed zone, gravel pack, screen slots, and inside the pump suction pipe.

Total drawdown:
$$s_w = B Q + C Q^2$$

Dividing by discharge $Q$:
$$\\frac{s_w}{Q} = B + C Q$$
Plotting specific drawdown $s_w / Q$ against $Q$ from a **Step-Drawdown Test** yields a straight line with slope $C$ and intercept $B$.

---

## 2. Open Well Recuperation Test

Open dug wells in peninsular India (weathered granite, basalt, gneiss) cannot be tested by continuous steady pumping because their discharge is small and unsteady. A recuperation test is performed:

\`\`\`
          Static Water Level
          ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ 0
                   |
                   | Depression Head s1 (at end of pumping)
                   v ~~~~~~~~~~~~~~~~~~~~~~~~ (Pumping stopped, t = 0)
                   |
                   | Rising water level during recovery
                   v ~~~~~~~~~~~~~~~~~~~~~~~~ Depression Head s2 (at time t)
                   |
          =========+===================================== Well Bottom
\`\`\`

Let well cross-sectional area be $A$. In incremental time $dt$, water recovers by $ds$:
$$Q \\, dt = -A \\, ds$$
Since seepage inflow is proportional to depression head $s$: $Q = C' s = K s$:
$$K s \\, dt = -A \\, ds \\implies \\frac{K}{A} dt = -\\frac{ds}{s}$$

Integrating from $s_1$ at $t = 0$ to $s_2$ at time $t$:
$$\\frac{K}{A} t = \\ln\\left(\\frac{s_1}{s_2}\\right) = 2.303 \\log_{10}\\left(\\frac{s_1}{s_2}\\right)$$

$$\\frac{K}{A} = \\frac{2.303}{t} \\log_{10}\\left(\\frac{s_1}{s_2}\\right) \\quad [\\text{unit: hour}^{-1}]$$

Specific capacity of well:
$$C' = \\left(\\frac{K}{A}\\right) A \\quad [\\text{m}^3\\text{/hour per meter of head}]$$

Safe working yield:
$$Q_{\\text{safe}} = C' \\cdot H_d$$
where $H_d$ is the allowable working depression head (typically $1.5\\text{--}2.5\\text{ m}$).

---

## 3. Worked Numerical Examples

### Worked Example 44.1: Open Well Recuperation Test & Safe Yield

**Problem:** An open dug well in a weathered granite basin near Bengaluru has an internal diameter $D = 3.50\\text{ m}$.
During a recuperation test:
- The well is pumped down to create an initial depression head $s_1 = 2.80\\text{ m}$.
- Pumping is stopped, and after $t = 1.50\\text{ hours}$, the water level rises such that the depression head is $s_2 = 1.20\\text{ m}$.
Calculate:
1. The specific capacity factor $(K/A)$ in $\\text{hour}^{-1}$.
2. The specific capacity of the well $C'$ in $\\text{m}^3\\text{/hour per meter depression}$.
3. The safe yield of the well if the permanent allowable depression head is $H_d = 2.00\\text{ m}$.

**Solution:**

**Step 1: Cross-sectional area of well ($A$)**
$$A = \\frac{\\pi}{4} D^2 = \\frac{\\pi}{4} (3.50\\text{ m})^2 = 9.6211\\text{ m}^2$$

**Step 2: Specific capacity factor ($K/A$)**
$$\\frac{s_1}{s_2} = \\frac{2.80}{1.20} = 2.3333$$
$$\\log_{10}(2.3333) = 0.36798$$
$$\\frac{K}{A} = \\frac{2.303}{1.50\\text{ h}} \\times 0.36798 = 1.53533 \\times 0.36798 = 0.56498\\text{ h}^{-1} \\approx 0.565\\text{ h}^{-1}$$

**Step 3: Specific capacity ($C'$)**
$$C' = \\left(\\frac{K}{A}\\right) \\times A = 0.56498\\text{ h}^{-1} \\times 9.6211\\text{ m}^2 = 5.4357\\text{ m}^3\\text{/h per meter depression}$$

**Step 4: Safe Yield ($Q$)**
$$Q_{\\text{safe}} = C' \\times H_d = 5.4357\\text{ m}^3\\text{/h/m} \\times 2.00\\text{ m} = 10.871\\text{ m}^3\\text{/hour} = 3.02\\text{ L/s}$$

---

### Worked Example 44.2: Well Efficiency from Step-Drawdown Test

**Problem:** A tube well yields the following step-drawdown results:
- Step 1: $Q_1 = 1000\\text{ m}^3\\text{/day}$, $s_{w1} = 2.50\\text{ m}$ $\\implies s_{w1}/Q_1 = 0.00250\\text{ day/m}^2$
- Step 2: $Q_2 = 2000\\text{ m}^3\\text{/day}$, $s_{w2} = 6.00\\text{ m}$ $\\implies s_{w2}/Q_2 = 0.00300\\text{ day/m}^2$
1. Determine the aquifer loss coefficient $B$ and well loss coefficient $C$.
2. Compute well efficiency at $Q = 2000\\text{ m}^3\\text{/day}$.

**Solution:**
$$C = \\frac{(s_{w2}/Q_2) - (s_{w1}/Q_1)}{Q_2 - Q_1} = \\frac{0.00300 - 0.00250}{2000 - 1000} = \\frac{0.00050}{1000} = 5.0 \\times 10^{-7}\\text{ day}^2\\text{/m}^5$$
$$B = \\frac{s_{w1}}{Q_1} - C Q_1 = 0.00250 - (5.0 \\times 10^{-7} \\times 1000) = 0.00250 - 0.00050 = 0.00200\\text{ day/m}^2$$
At $Q = 2000\\text{ m}^3\\text{/day}$:
$$\\text{Aquifer loss } = B Q = 0.00200 \\times 2000 = 4.00\\text{ m}$$
$$\\text{Well loss } = C Q^2 = 5.0 \\times 10^{-7} \\times (2000)^2 = 2.00\\text{ m}$$
$$\\text{Total drawdown } s_w = 4.00 + 2.00 = 6.00\\text{ m}$$
$$\\text{Well Efficiency } \\eta_w = \\frac{B Q}{s_w} \\times 100\\% = \\frac{4.00}{6.00} \\times 100\\% = 66.67\\%$$

---

### Session 44 recap
1. Total drawdown: $s_w = B Q + C Q^2$.
2. Well efficiency: $\\eta_w = B Q / (B Q + C Q^2)$.
3. Recuperation test: $(K/A) = \\frac{2.303}{t} \\log_{10}(s_1 / s_2)$.
4. Safe yield: $Q = (K/A) \\cdot A \\cdot H_d$.

<!--tab:In class-->

## In-Class Activities & Verification

### Activity 1: Recuperation Factor Check

In a recuperation test, $s_1 = 3.0\\text{ m}$, $s_2 = 1.5\\text{ m}$, and $t = 2.0\\text{ hours}$. Compute $K/A$ in $\\text{hour}^{-1}$. ($\log_{10}(2) = 0.30103$).

\`\`\`check
K_A = 0.347 h-1
Tolerance: 0.01 h-1
Hint: K/A = (2.303 / 2.0) * 0.30103 = 1.1515 * 0.30103 = 0.3466 h-1.
\`\`\`

### Activity 2: Safe Yield Check

For an open well with $K/A = 0.3466\\text{ h}^{-1}$, area $A = 12.0\\text{ m}^2$, and working depression head $H_d = 2.5\\text{ m}$. Compute safe yield $Q$ in $\\text{m}^3\\text{/h}$.

\`\`\`check
Q = 10.40 m3/h
Tolerance: 0.2 m3/h
Hint: Q = 0.3466 * 12.0 * 2.5 = 10.398 m3/h.
\`\`\`

<!--tab:Software lab-->

## Lab Linkage: Step-Drawdown Analysis in Spreadsheets

In **Spreadsheet**:
1. Enter discharge steps $Q_i$ and corresponding measured drawdowns $s_{wi}$.
2. Compute specific drawdown $s_w / Q$ and create an XY scatter plot.
3. Fit a linear trendline to extract coefficients $B$ (intercept) and $C$ (slope), and evaluate well efficiency across pumping ranges.

<!--tab:Practice-->

## Practice Quiz & Exam Questions

\`\`\`quiz
1. In Jacob's well drawdown equation sw = BQ + CQ^2, what does the term CQ^2 represent?
* Non-linear turbulent head losses near the well screen and gravel pack
- Linear laminar formation loss in the undisturbed aquifer
- Atmospheric evaporation loss from the well casing
- Head gain due to artificial recharge

2. An open well recuperation test is particularly well suited for:
* Low-yield dug wells in hard-rock formations
* Deep artesian tube wells yielding over 100 L/s
- Offshore coastal barrier island aquifers
- Laboratory sand permeameter columns

3. If well efficiency is 75%, it implies that:
* 75% of the total drawdown is due to laminar aquifer formation loss
- The pump runs at 75% mechanical efficiency
- 25% of the pumped water is lost to leakage
- Discharge is 75% of maximum capacity
\`\`\`

### Examination Questions

:::exam[5-Mark Derivation]
Derive the recuperation test formula $\\frac{K}{A} = \\frac{2.303}{t} \\log_{10}\\left(\\frac{s_1}{s_2}\\right)$ for an open well from first principles.
:::

:::exam[10-Mark Comprehensive]
Explain the causes of well losses in tube wells. Describe how a step-drawdown test is conducted and analyzed to separate aquifer loss from well loss and evaluate well efficiency.
:::

:::sol
Causes of Well Loss:
1. Friction and head loss through the continuous wire-wrap or slotted pipe screen openings.
2. Turbulence and tortuous pore flow through the artificial gravel pack.
3. Compaction and mud infiltration in the damaged borehole wall zone ("skin effect").
4. Axial velocity head loss and friction inside the well casing above the screen.
Step-Drawdown Test Procedure:
1. The well is pumped at 4 to 6 increasing discharge steps ($Q_1 < Q_2 < Q_3 < Q_4$), each running for an equal duration (typically 60–120 minutes) until incremental drawdown stabilizes.
2. For each step, total drawdown $s_w$ is recorded.
3. Compute specific drawdown $s_w / Q$ for each step.
4. Plot $s_w / Q$ against $Q$ on arithmetic graph paper.
5. Fit the straight line $s_w / Q = B + C Q$:
   - Slope of the line yields well loss coefficient $C$.
   - Y-intercept yields aquifer formation loss coefficient $B$.
6. Calculate well efficiency: $\\eta_w = \\frac{B Q}{B Q + C Q^2} \\times 100\\%$.
:::
`;

// S45: Rainwater harvesting, MAR & PBL showcase
u5["S45"] = `<!--tab:Theory-->

> [!note] Key ideas
> - **Rainwater Harvesting (RWH):** The direct collection, filtration, and storage of rainwater from rooftops, paved surfaces, or natural catchments for productive reuse or artificial groundwater recharge.
> - Harvest potential equation: $V = C \\cdot P \\cdot A$, where $C$ is runoff coefficient, $P$ is annual rainfall, and $A$ is catchment surface area.
> - **First-Flush Diverter:** Discards the initial $1.0\\text{--}2.0\\text{ mm}$ of rainfall containing accumulated roof dust, bird droppings, and atmospheric pollutants.
> - Storage tank sizing methods: Dry-period demand method and Cumulative mass-curve (Rippl) method.
> - **Managed Aquifer Recharge (MAR):** Artificial recharge via recharge pits, recharge trenches, permeable pavements, dug well recharge, and injection shafts (Central Ground Water Board - CGWB guidelines).

## 1. Principles of Rainwater Harvesting

With rapid urbanization, natural soil infiltration is replaced by impermeable concrete surfaces, causing flash flooding, reduced baseflow, and plummeting groundwater tables. Rainwater harvesting restores natural hydrology.

\`\`\`
       Roof Catchment Area A (m2)
       ~~~~~~~~~~~~~~~~~~~~~~~~~ [ Runoff Coeff C ]
                  |
                  | Gutters & Downspouts
                  v
       [ First Flush Diverter ] ---> Washoff Discard (Initial 1-2 mm)
                  |
                  v
       [ Sand-Gravel Filter ]
                  |
         +--------+------------------+
         |                           |
         v                           v
   [ Storage Tank ]        [ Artificial Recharge Shaft ]
   (Drinking / Flushing)   (Replenishing Aquifer)
\`\`\`

---

## 2. Catchment Types & Runoff Coefficients

| Catchment Surface | Runoff Coefficient ($C$) | Characteristics |
|---|---|---|
| Galvanized Iron (GI) Sheets | $0.85\\text{--}0.95$ | Smooth, impermeable, low initial absorption |
| RCC Flat Roof Slab | $0.80\\text{--}0.85$ | Standard urban building roof |
| Clay Tiled Roof | $0.75\\text{--}0.85$ | Moderate absorption by porous tiles |
| Paved Driveways / Paver Blocks | $0.50\\text{--}0.70$ | Joint seepage and surface depression storage |
| Lawns / Open Soil Gardens | $0.10\\text{--}0.25$ | High infiltration and vegetative interception |

---

## 3. Storage Tank Sizing & Mass Curve Method

1. **Annual Water Harvesting Potential:**
$$V_{\\text{annual}} = C \\times P \\times A$$
Where $P$ is annual rainfall depth (m) and $A$ is catchment footprint area ($\\text{m}^2$).

2. **First Flush Volume:**
$$V_{\\text{flush}} = d_{\\text{flush}} \\times A \\quad (d_{\\text{flush}} = 0.001\\text{ to } 0.002\\text{ m})$$

3. **Design Storm Tank Volume:**
For a 24-hour design storm of intensity $P_{\\text{design}}$:
$$V_{\\text{tank}} = C \\times (P_{\\text{design}} - d_{\\text{flush}}) \\times A$$

---

## 4. Managed Aquifer Recharge (MAR) Structures

1. **Recharge Pits:** Excavated pits ($1.5\\text{ to } 3.0\\text{ m}$ diameter, $2\\text{ to } 3\\text{ m}$ deep) filled with boulders at the bottom, gravel in the middle, and coarse sand at the top for rooftops $< 100\\text{ m}^2$.
2. **Recharge Trenches:** Linear trenches ($0.5\\text{--}1.0\\text{ m}$ wide, $1.5\\text{--}2.0\\text{ m}$ deep) along plot boundaries for rooftops $100\\text{ to } 500\\text{ m}^2$.
3. **Recharge Shafts:** Boreholes drilled through impermeable clay layers into unsaturated underlying sandy aquifers, backfilled with gravel.
4. **Dug Well Recharge:** Filtered runoff directed into existing defunct open wells.

---

## 5. Worked Numerical Examples

### Worked Example 45.1: Rooftop Harvesting System for CHRIST Campus Building

**Problem:** An academic block at CHRIST University Kengeri Campus has an RCC flat roof area $A = 450.0\\text{ m}^2$.
- Local annual rainfall in Bengaluru: $P = 920.0\\text{ mm} = 0.920\\text{ m}$
- Runoff coefficient for RCC roof: $C = 0.85$
- First-flush depth discarded: $d_{\\text{flush}} = 1.50\\text{ mm}$
Calculate:
1. The annual total rainwater harvest potential in cubic meters and liters.
2. The storage tank capacity required to capture a 24-hour design storm of $P_{\\text{storm}} = 40.0\\text{ mm}$.

**Solution:**

**Step 1: Annual harvest volume**
$$V_{\\text{annual}} = C \\times P \\times A = 0.85 \\times 0.920\\text{ m} \\times 450.0\\text{ m}^2 = 351.90\\text{ m}^3$$
$$\\text{In Liters} = 351.90 \\times 1000 = 351{,}900\\text{ liters}$$

**Step 2: Effective storm runoff depth after first flush**
$$P_{\\text{eff}} = P_{\\text{storm}} - d_{\\text{flush}} = 40.0\\text{ mm} - 1.5\\text{ mm} = 38.5\\text{ mm} = 0.0385\\text{ m}$$

**Step 3: Required storage tank volume**
$$V_{\\text{tank}} = C \\times P_{\\text{eff}} \\times A = 0.85 \\times 0.0385\\text{ m} \\times 450.0\\text{ m}^2 = 14.726\\text{ m}^3 \\approx 15.0\\text{ m}^3$$
A standard $15{,}000\\text{ liter}$ storage tank is recommended.

---

### Worked Example 45.2: Artificial Recharge Trench Design

**Problem:** A campus parking apron has paved area $A = 1200.0\\text{ m}^2$ ($C = 0.70$). Peak storm rainfall intensity is $i = 30.0\\text{ mm/hour}$ ($0.030\\text{ m/h}$).
An artificial recharge trench has width $W = 1.0\\text{ m}$ and soil infiltration rate at trench bottom $f = 25.0\\text{ mm/hour}$ ($0.025\\text{ m/h}$).
Calculate:
1. The peak inflow rate into the trench in $\\text{m}^3\\text{/h}$.
2. The required length $L$ of the trench if all peak storm runoff is to infiltrate without overtopping.

**Solution:**
$$Q_{\\text{in}} = C \\times i \\times A = 0.70 \\times 0.030\\text{ m/h} \\times 1200.0\\text{ m}^2 = 25.20\\text{ m}^3\\text{/hour}$$
Recharge capacity:
$$Q_{\\text{recharge}} = f \\times (W \\cdot L) = 0.025 \\times (1.0 \\times L) = 0.025 L$$
Setting $Q_{\\text{recharge}} = Q_{\\text{in}}$:
$$0.025 L = 25.20 \\implies L = \\frac{25.20}{0.025} = 1008.0\\text{ m}$$
*(In practice, a combination of temporary detention storage within gravel trench voids and smaller length is implemented).*

---

### Session 45 recap
1. Harvest volume: $V = C \\cdot P \\cdot A$.
2. First flush diverter ($1\\text{--}2\\text{ mm}$) protects water quality.
3. Storage tanks sized by demand during dry periods or design storm volume.
4. Managed aquifer recharge reverses groundwater depletion in urban watersheds.

<!--tab:In class-->

## In-Class Activities & Verification

### Activity 1: Annual Rainwater Harvesting Potential

A building roof has area $A = 600.0\\text{ m}^2$, annual rainfall $P = 1100.0\\text{ mm}$ ($1.10\\text{ m}$), and $C = 0.80$. Compute total annual harvested volume in $\\text{m}^3$.

\`\`\`check
V = 528.0 m3
Tolerance: 2.0 m3
Hint: V = 0.80 * 1.10 * 600 = 528.0 m3 (528,000 liters).
\`\`\`

### Activity 2: First-Flush Volume Check

For the same roof ($A = 600\\text{ m}^2$), calculate the first-flush water volume diverted for $d_{\\text{flush}} = 1.5\\text{ mm}$ in liters.

\`\`\`check
V_flush = 900.0 L
Tolerance: 10.0 L
Hint: V_flush = 0.0015 m * 600 m2 = 0.90 m3 = 900.0 Liters.
\`\`\`

<!--tab:Software lab-->

## Lab Linkage: Multi-Criteria Spatial Analysis in QGIS

In **QGIS**:
1. Overlay geological lineaments, soil drainage classes, land use, and slope.
2. Use **Raster Calculator** to perform Weighted Linear Combination (WLC) multi-criteria evaluation for rainwater harvesting and aquifer recharge site suitability across the river basin.
3. Generate the final PBL Milestone 4 showcase map.

<!--tab:Practice-->

## Practice Quiz & Exam Questions

\`\`\`quiz
1. What is the essential function of a first-flush diverter in a rainwater harvesting system?
* To discard the initial contaminated runoff containing roof grime, dust, and bird droppings
- To divert excess water during extreme cloudbursts
- To increase the water pressure entering the storage tank
- To measure rainfall intensity automatically

2. Which rooftop material offers the highest runoff coefficient?
* Galvanized iron (GI) metal sheet (C ~ 0.90)
- Grass garden green roof (C ~ 0.20)
- Gravel ballasted membrane (C ~ 0.60)
- Unbaked clay tile roof (C ~ 0.70)

3. What is the typical filter media arrangement in an artificial groundwater recharge pit (from bottom to top)?
* Boulders at bottom, gravel in middle, coarse sand at top
* Fine sand at bottom, large boulders at top
- Only charcoal throughout
- Plain concrete block
\`\`\`

### Examination Questions

:::exam[2-Mark Concept Questions]
1. State the formula for rainwater harvesting potential and define all terms.
2. Explain the purpose of a first-flush device.
:::

:::exam[5-Mark Conceptual]
Discuss the various methods of artificial recharge to groundwater recommended by the Central Ground Water Board (CGWB) for urban and rural catchments.
:::

:::exam[10-Mark Comprehensive]
Design a complete rooftop rainwater harvesting and artificial recharge system for a modern residential community covering a plot of 2000 m2 with 800 m2 roof area. Include component layout, filter media sizing, storage tank capacity, and recharge trench dimensions.
:::

:::sol
Design Steps:
1. Hydrologic Assessment:
   - Roof area $A = 800\\text{ m}^2$, $C = 0.85$.
   - Annual rainfall $P = 900\\text{ mm} = 0.90\\text{ m}$.
   - Annual harvest potential $V = 0.85 \\times 0.90 \\times 800 = 612\\text{ m}^3 = 612{,}000\\text{ L}$.
2. First-Flush Sizing:
   - First flush depth $= 1.5\\text{ mm} \\implies V_{\\text{flush}} = 0.0015 \\times 800 = 1.20\\text{ m}^3 = 1200\\text{ L}$.
   - Installed via a vertical PVC pipe chamber with a floating ball shut-off valve.
3. Filtration Unit:
   - Dual-chamber slow sand filter sized for peak inflow of $25\\text{ m}^3\\text{/h}$.
   - Graded layers: $0.3\\text{ m}$ fine sand ($d_{10} = 0.3\\text{ mm}$), $0.2\\text{ m}$ gravel ($5\\text{--}10\\text{ mm}$), $0.2\\text{ m}$ pebbles ($20\\text{--}40\\text{ mm}$).
4. Storage Tank:
   - Sized for a 24-h design storm of $35\\text{ mm}$ minus first flush ($33.5\\text{ mm}$):
   - $V_{\\text{tank}} = 0.85 \\times 0.0335 \\times 800 = 22.78\\text{ m}^3 \\approx 25{,}000\\text{ L}$ underground RCC sump.
5. Recharge Trench (Overflow Management):
   - Tank overflow connects to a recharge trench $1.0\\text{ m}$ wide, $1.5\\text{ m}$ deep, $15\\text{ m}$ long, backfilled with clean gravel to recharge the shallow weathered aquifer.
:::
`;

// Write out all Unit 5 sessions
for (const [id, content] of Object.entries(u5)) {
  const filePath = path.join(sessionsDir, id + '.md');
  fs.writeFileSync(filePath, content.trim() + '\n', 'utf8');
  console.log('Written ' + id + '.md (' + content.length + ' chars)');
}
console.log('Unit 5 generation complete.');
