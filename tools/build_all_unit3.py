import os

def run():
    # S19
    s19_md = """<!--tab:Theory-->

> [!note] Key ideas
> - A streamflow hydrograph records the temporal variation of discharge ($Q$ vs $t$) at a catchment outlet resulting from a precipitation event.
> - Key physical components: rising limb (concentration of overland and channel flow), crest segment (maximum storage state containing the peak discharge $Q_p$), and recession limb (withdrawal of water from channel, interflow, and groundwater storage).
> - Critical time scales: lag time $t_L$ (time centroid of rainfall to peak flow), time to peak $t_p$, time base $t_b$, and time of concentration $t_c$.
> - Groundwater recession follows an exponential decay: $Q_t = Q_0 K_r^t = Q_0 e^{-a t}$, enabling estimation of remaining groundwater storage: $S_t = Q_t / a$.

## 1. Anatomy of a Flood Hydrograph

A flood hydrograph is the integrated response of a drainage basin to an input of rainfall. The hydrograph reflects the complex interaction between meteorological forcing (storm intensity, duration, pattern, and movement) and catchment physiography (area, shape, slope, drainage density, soil infiltration, and channel hydraulic roughness).

```
   Discharge Q
        ^
        |                Peak Discharge Q_p
        |                      /\
        |                     /  \
        |   Rising Limb      /    \  Inflection Point P_i
        |   (Concentration) /      \
        |                  /        \  Recession Limb (Depletion)
        |    Approach     /          \
        |    Hydrograph  /            \_______
        |  ---\_________/                     \________ Baseflow
        +----------------------------------------------------> Time t
               |<-- tp -->|
               |          |<--------- tb ------------>|
```

### Morphological Components

1. **Approach Hydrograph (Baseflow prior to storm):** The pre-existing stream discharge supported purely by sustained groundwater seepage and delayed baseflow prior to the onset of direct surface runoff.
2. **Rising Limb (Concentration Curve):** Ascending portion from the initial point of rise to the peak. Its shape depends predominantly on rainfall intensity distribution and drainage network geometry.
3. **Crest Segment:** Contains the peak discharge $Q_p$. Represents the period during which maximum basin storage is engaged and overland flow velocities reach equilibrium.
4. **Recession Limb (Falling Limb):** Extends from the point of inflection $P_i$ on the falling curve down to the termination of direct runoff. The inflection point indicates the cessation of effective rainfall input over the basin; thereafter, outflow represents pure drainage from channel storage, detention storage, and groundwater release.

---

## 2. Characteristic Time Parameters

Engineers characterize hydrograph dynamics through four fundamental time scales:

1. **Time of Concentration ($t_c$):** The travel time required for water to flow from the hydrologically most remote point of the drainage basin to the gauging outlet.
2. **Time to Peak ($t_p$):** The time elapsed between the commencement of rainfall (or start of direct runoff rise) and the occurrence of peak discharge $Q_p$.
3. **Basin Lag Time ($t_L$):** The elapsed time between the centroid of effective rainfall (hyetograph center of mass) and the centroid (or peak) of the direct runoff hydrograph.
4. **Time Base ($t_b$):** The total duration of the direct runoff hydrograph, from the initial upward inflection to the point where streamflow returns to baseflow levels.

---

## 3. Mathematical Analysis of the Recession Curve

When surface runoff ceases, the depletion of storage follows a linear reservoir model:
$$S = K Q$$

Differentiating with respect to time $t$ under zero inflow ($I = 0$):
$$\frac{dS}{dt} = -Q \implies K \frac{dQ}{dt} = -Q$$

Integrating gives the classic **Barnes (1939) recession equation**:
$$Q_t = Q_0 K_r^t = Q_0 e^{-a t}$$

Where:
- $Q_0$ = initial discharge at reference time $t = 0$ ($m^3/s$)
- $Q_t$ = discharge at time $t$ ($m^3/s$)
- $K_r$ = recession constant ($< 1.0$), dimensionless per time unit
- $a = -\ln(K_r)$ = storage attenuation constant ($h^{-1}$ or $day^{-1}$)

The total storage remaining in the basin above the base level at time $t$ is:
$$S_t = \int_t^\infty Q dt = \int_t^\infty Q_t e^{-a(u-t)} du = \frac{Q_t}{a}$$

---

## 4. Worked Numerical Examples

### Worked Example 19.1: Recession Constant & Basin Storage Estimation

**Problem:** An observed flood hydrograph drops along its recession limb from an initial discharge $Q_0 = 120\text{ m}^3\text{/s}$ to $Q_{24} = 45\text{ m}^3\text{/s}$ after $24\text{ hours}$. Assuming pure exponential depletion:
1. Determine the hourly recession constant $K_r$ and the attenuation coefficient $a$.
2. Predict the streamflow discharge at $t = 48\text{ hours}$.
3. Calculate the total remaining water volume stored in the basin at $t = 48\text{ hours}$.

**Solution:**

**Step 1: Determine $K_r$ and $a$**
$$Q_{24} = Q_0 K_r^{24} \implies 45 = 120 K_r^{24}$$
$$K_r^{24} = \frac{45}{120} = 0.375 \implies K_r = (0.375)^{1/24} = 0.95995 \approx 0.960$$
$$a = -\ln(K_r) = -\ln(0.95995) = 0.04087\text{ h}^{-1}$$
In SI units (seconds):
$$a = \frac{0.04087}{3600} = 1.135 \times 10^{-5}\text{ s}^{-1}$$

**Step 2: Streamflow at $t = 48\text{ hours}$**
$$Q_{48} = Q_0 K_r^{48} = 120 \times (0.375)^2 = 16.88\text{ m}^3\text{/s}$$

**Step 3: Basin storage remaining at $t = 48\text{ hours}$**
$$S_{48} = \frac{Q_{48}}{a} = \frac{16.875\text{ m}^3\text{/s}}{1.1353 \times 10^{-5}\text{ s}^{-1}} = 1.4864 \times 10^6\text{ m}^3 = 1.486\text{ MCM}$$

---

### Worked Example 19.2: Semilogarithmic Recession Separation

**Problem:** A streamflow record during dry weather shows the following discharges: $t = 0\text{ d}$, $Q = 80\text{ m}^3\text{/s}$; $t = 5\text{ d}$, $Q = 44\text{ m}^3\text{/s}$; $t = 10\text{ d}$, $Q = 24.2\text{ m}^3\text{/s}$. Verify if a single linear reservoir represents the aquifer and find the daily recession constant $K_r$.

**Solution:**
- Interval 0 to 5 days: $K_{r,1} = (44 / 80)^{1/5} = (0.55)^{0.2} = 0.887$
- Interval 5 to 10 days: $K_{r,2} = (24.2 / 44)^{1/5} = (0.55)^{0.2} = 0.887$
Since $K_{r,1} = K_{r,2} = 0.887\text{ day}^{-1}$, a single linear reservoir accurately models the baseflow aquifer.

---

### Session 19 recap
1. A flood hydrograph combines direct runoff and baseflow.
2. The inflection point on the recession limb marks the end of overland flow input.
3. Groundwater recession follows $Q_t = Q_0 K_r^t$.
4. Remaining storage is given directly by $S_t = Q_t / a$.
5. A constant slope on a semilog plot of $\ln Q$ vs $t$ confirms linear reservoir behavior.

<!--tab:In class-->

## In-Class Activities & Verification

### Activity 1: Verify Hydrograph Recession Rate

During an unconfined catchment recession, streamflow fell from $90\text{ m}^3\text{/s}$ to $30\text{ m}^3\text{/s}$ over $18\text{ hours}$. Calculate the streamflow at $t = 36\text{ hours}$.

```check
Q_36 = 10.0 m3/s
Tolerance: 0.2 m3/s
Hint: Because 36 hours is exactly twice 18 hours, Q(36) = Q_0 * (Q_18 / Q_0)^2.
```

### Activity 2: Remaining Aquifer Storage

For the stream in Activity 1, calculate the total remaining storage $S_{36}$ in millions of cubic meters ($\text{MCM}$).
Note: $a = -\ln(30/90) / 18 = \ln(3) / 18 = 0.06103\text{ h}^{-1} = 1.695 \times 10^{-5}\text{ s}^{-1}$.

```check
S_36 = 0.59 MCM
Tolerance: 0.03 MCM
Hint: S = Q / a. 10 / (1.695e-5) = 590,000 m3 = 0.59 MCM.
```

<!--tab:Software lab-->

## Lab Linkage: HEC-HMS Hydrograph Inspection

In **HEC-HMS**, outflow hydrographs are inspected in the **Graph** and **Summary Table** tabs of the simulation run results.
1. Run a 24-hour storm simulation on your delineated subbasin.
2. Note $Q_p$, $t_p$, and the recession inflection point.
3. Export the hydrograph table to CSV and plot $\ln(Q)$ vs $t$ in Python to compute $K_r$.

<!--tab:Practice-->

## Practice Quiz & Exam Questions

```quiz
1. What does the inflection point on the recession limb of a hydrograph physically indicate?
* The cessation of direct overland runoff inflow into stream channels
- The arrival of the peak overland flow
- The moment rainfall completely stops in the headwaters
- The failure of the downstream hydraulic control structure

2. If a basin's storage is related to outflow by S = 10 Q (where Q is in m3/s and S is in m3-s), what is the storage attenuation constant 'a'?
* 0.10 s^-1
- 10.0 s^-1
- 0.01 s^-1
- 1.0 s^-1

3. The time between the centroid of rainfall excess and the peak of the direct runoff hydrograph is called:
* Basin lag time
- Time of concentration
- Recession time
- Time base

4. On a semilogarithmic plot of log(Q) versus time t, a pure linear reservoir groundwater recession plots as:
* A downward sloping straight line
- A horizontal line
- An upward concave curve
- A parabolic arc
```

### Examination Questions

:::exam[2-Mark Concept Questions]
1. Define **time of concentration** ($t_c$) and contrast it with **basin lag time** ($t_L$).
2. Explain the physical significance of the inflection point on the recession limb of a flood hydrograph.
:::

:::exam[5-Mark Derivation]
Prove that for an unconfined basin behaving as a linear reservoir ($S = K Q$), the remaining active water storage at any time $t$ on the recession limb is given by $S_t = Q_t / a$, where $a = 1/K$.
:::

:::exam[10-Mark Comprehensive Numerical]
A storm over a $380\text{ km}^2$ river basin produces a peak flood discharge of $160\text{ m}^3\text{/s}$. The recession curve from the inflection point ($Q = 80\text{ m}^3\text{/s}$ at $t = 12\text{ h}$) falls to $20\text{ m}^3\text{/s}$ at $t = 36\text{ h}$.
1. Determine the recession constant $K_r$ on an hourly basis.
2. Find the discharge at $t = 60\text{ h}$.
3. Calculate the total volume of water drained between $t = 12\text{ h}$ and $t = 60\text{ h}$.
4. Compute the ultimate storage remaining in the basin at $t = 60\text{ h}$.
:::

:::sol
1. $K_r^{24} = 20 / 80 = 0.25 \implies K_r = (0.25)^{1/24} = 0.94387\text{ h}^{-1}$.
   $a = -\ln(K_r) = 0.05776\text{ h}^{-1} = 1.6045 \times 10^{-5}\text{ s}^{-1}$.
2. $Q_{60} = 80 \times K_r^{48} = 80 \times (0.25)^2 = 5.0\text{ m}^3\text{/s}$.
3. Drained volume: $V_{12-60} = (Q_{12} - Q_{60}) / a = (80 - 5) / (1.6045 \times 10^{-5}) = 4.674 \times 10^6\text{ m}^3 = 4.674\text{ MCM}$.
4. Remaining storage: $S_{60} = Q_{60} / a = 5.0 / (1.6045 \times 10^{-5}) = 3.116 \times 10^5\text{ m}^3 = 0.312\text{ MCM}$.
:::
"""

    # S20
    s20_md = """<!--tab:Theory-->

> [!note] Key ideas
> - Baseflow separation splits the total streamflow hydrograph into Direct Runoff Hydrograph (DRH) and Baseflow (groundwater seepage).
> - Method 1: Straight-line method connects the start of direct runoff ($A$) to the point of inflection on recession ($B$).
> - Method 2: Fixed base method ($N = 0.83 A^{0.2}$, $A$ in $\text{km}^2$, $N$ in days) extends the initial baseflow to below the peak and then connects to $N$ days after the peak.
> - Method 3: Variable slope / recession curve extension projects the master recession curve backward from after storm runoff ceases.
> - The area under the DRH divided by the catchment area yields the effective rainfall (runoff depth $R$).

## 1. Principles of Baseflow Separation

Total runoff observed in a river channel during and following a precipitation event consists of two primary components:
1. **Direct Runoff ($Q_d$):** Surface runoff (overland flow) plus prompt interflow (subsurface stormflow through macro-pores).
2. **Baseflow ($Q_b$):** Delayed subsurface flow, groundwater discharge, and delayed drainage from wetlands and lakes.

To derive unit hydrographs or analyze rainfall-runoff relationships, baseflow must be subtracted from the total streamflow hydrograph:
$$Q_d(t) = Q_{total}(t) - Q_b(t)$$

---

## 2. Standard Separation Techniques

### Method 1: Straight-Line Method (Simple Chord)
- The initial rise point $A$ (where hydrograph begins to climb) is identified.
- Point $B$ on the recession limb is identified where overland runoff ceases (inflection point).
- A straight line $AB$ is drawn. All flow above $AB$ is DRH; flow below is baseflow.
- Simplest technique, widely adopted for small steep catchments.

### Method 2: Fixed Base Method (Two-Line Method)
- From point $A$, the pre-storm baseflow trend is projected horizontally or with slight slope forward to the time of peak flow (point $C$).
- From point $C$, an arbitrary line is drawn to point $B$ situated $N$ days after the hydrograph peak.
- Linsley's empirical formula for time base $N$:
$$N = 0.83 \cdot A^{0.2}$$
where $A$ is basin area in $\text{km}^2$ and $N$ is in days.

### Method 3: Variable Slope Method (Curve Extension)
- The pre-storm recession curve is extrapolated forward to the ordinate beneath the inflection point on the rising limb ($P_1$).
- The post-storm groundwater recession curve is projected backward to underneath the inflection point on the falling limb ($P_2$).
- Points $P_1$ and $P_2$ are connected with a smooth transitional curve.
- Most physically sound for alluvial basins with significant bank storage dynamics.

---

## 3. Effective Rainfall & Direct Runoff Depth

The total volume of direct surface runoff $V_d$ is obtained by integrating the DRH:
$$V_d = \int_0^{t_b} Q_d(t) dt = \Delta t \sum_{i=1}^{n} Q_{d,i}$$

The equivalent depth of direct runoff $R$ over the drainage basin of area $A$ is:
$$R = \frac{V_d}{A} = \frac{\Delta t \sum Q_{d,i}}{A}$$

When $Q$ is in $\text{m}^3\text{/s}$, $\Delta t$ in seconds, and $A$ in $\text{m}^2$, $R$ is in meters (multiply by $1000$ for $\text{mm}$ or $100$ for $\text{cm}$).

---

## 4. Worked Numerical Examples

### Worked Example 20.1: Direct Runoff Depth from Streamflow Hydrograph

**Problem:** A flood hydrograph resulting from an isolated storm on a $450\text{ km}^2$ catchment has the following coordinates sampled every $6\text{ hours}$. A constant baseflow of $15\text{ m}^3\text{/s}$ is observed:

| Time (h) | 0 | 6 | 12 | 18 | 24 | 30 | 36 | 42 | 48 |
|---|---|---|---|---|---|---|---|---|---|
| Total $Q$ ($\text{m}^3\text{/s}$) | 15 | 35 | 95 | 145 | 115 | 65 | 35 | 20 | 15 |

1. Derive the direct runoff hydrograph (DRH) ordinates.
2. Calculate total direct runoff volume in $\text{MCM}$ ($10^6\text{ m}^3$).
3. Calculate the effective rainfall depth in $\text{mm}$.

**Solution:**

**Step 1: DRH ordinates ($Q_d = Q - 15$)**
- $t = 0$: $15 - 15 = 0\text{ m}^3\text{/s}$
- $t = 6$: $35 - 15 = 20\text{ m}^3\text{/s}$
- $t = 12$: $95 - 15 = 80\text{ m}^3\text{/s}$
- $t = 18$: $145 - 15 = 130\text{ m}^3\text{/s}$ (Peak)
- $t = 24$: $115 - 15 = 100\text{ m}^3\text{/s}$
- $t = 30$: $65 - 15 = 50\text{ m}^3\text{/s}$
- $t = 36$: $35 - 15 = 20\text{ m}^3\text{/s}$
- $t = 42$: $20 - 15 = 5\text{ m}^3\text{/s}$
- $t = 48$: $15 - 15 = 0\text{ m}^3\text{/s}$

Sum of DRH ordinates $\sum Q_d = 0 + 20 + 80 + 130 + 100 + 50 + 20 + 5 + 0 = 405\text{ m}^3\text{/s}$.

**Step 2: Direct runoff volume**
$$\Delta t = 6\text{ h} = 6 \times 3600 = 21{,}600\text{ s}$$
$$V_d = \sum Q_d \times \Delta t = 405 \times 21{,}600 = 8{,}748{,}000\text{ m}^3 = 8.748\text{ MCM}$$

**Step 3: Effective rainfall depth**
$$R = \frac{V_d}{A} = \frac{8.748 \times 10^6\text{ m}^3}{450 \times 10^6\text{ m}^2} = 0.01944\text{ m} = 19.44\text{ mm} = 1.944\text{ cm}$$

---

### Worked Example 20.2: Linsley's Fixed Base Duration Calculation

**Problem:** For the $450\text{ km}^2$ catchment in Example 20.1, compute the theoretical time base duration $N$ using Linsley's formula.

**Solution:**
$$N = 0.83 \cdot A^{0.2} = 0.83 \cdot (450)^{0.2} = 0.83 \cdot 3.389 = 2.81\text{ days} = 67.5\text{ hours}$$

---

### Session 20 recap
1. Baseflow separation extracts direct runoff from total streamflow.
2. Straight-line method connects hydrograph start to the recession inflection point.
3. Fixed-base duration after peak: $N = 0.83 A^{0.2}$ days.
4. DRH integration gives direct runoff volume $V_d = \Delta t \sum Q_d$.
5. Runoff depth $R = V_d / A$.

<!--tab:In class-->

## In-Class Activities & Verification

### Activity 1: Runoff Depth from 4-hr Gauging

A $300\text{ km}^2$ basin has 4-hour DRH ordinates: $0, 15, 45, 90, 60, 30, 10, 0\text{ m}^3\text{/s}$.
Calculate the effective rainfall depth in $\text{mm}$.
Sum $= 250\text{ m}^3\text{/s}$. $\Delta t = 4 \times 3600 = 14{,}400\text{ s}$.

```check
R = 12.0 mm
Tolerance: 0.2 mm
Hint: V = 250 * 14400 = 3,600,000 m3. R = 3.6e6 / 300e6 = 0.012 m = 12.0 mm.
```

### Activity 2: Linsley Empirical Time Base

Calculate Linsley's empirical baseflow duration $N$ (in days) for a large river catchment with area $A = 3200\text{ km}^2$.

```check
N = 4.17 days
Tolerance: 0.05 days
Hint: N = 0.83 * (3200)^0.2. (3200)^0.2 = 5.0238. N = 0.83 * 5.0238 = 4.17 days.
```

<!--tab:Software lab-->

## Lab Linkage: Baseflow Methods in HEC-HMS

HEC-HMS supports four baseflow models:
1. **Constant Monthly:** Prescribed seasonal discharge.
2. **Linear Reservoir:** Outflow proportional to storage, ideal for recession matching.
3. **Exponential Recession:** Replicates Barnes equation $Q = Q_0 K^t$ with threshold ratio.
4. **Boussinesq:** Physically based non-linear porous media flow equation.

<!--tab:Practice-->

## Practice Quiz & Exam Questions

```quiz
1. Which empirical formula gives the time base N (in days) after the peak for baseflow separation?
* N = 0.83 A^0.2
- N = 2.78 A^0.5
- N = 0.208 A^0.3
- N = 1.41 A^0.4

2. If total streamflow volume is 5.0 MCM and baseflow volume is 1.5 MCM over an area of 100 km2, what is the direct runoff depth?
* 35.0 mm
- 50.0 mm
- 15.0 mm
- 3.5 mm

3. The direct runoff hydrograph (DRH) is obtained by:
* Subtracting baseflow ordinates from the total streamflow hydrograph
- Dividing the total hydrograph by the catchment area
- Multiplying the hyetograph by the phi-index
- Integrating the master recession curve

4. The variable slope method of baseflow separation is particularly suited for catchments with:
* Significant alluvial storage and bank return flow
- Impervious rocky mountainous slopes
- Small paved urban car parks
- Concrete spillway channels
```

### Examination Questions

:::exam[2-Mark Concept Questions]
1. State the difference between direct runoff and baseflow.
2. Write Linsley's formula for the time base of baseflow recession and define all terms.
:::

:::exam[5-Mark Derivation]
Explain the three standard methods of baseflow separation with the aid of neat sketches. State their relative merits and field applicability.
:::

:::exam[10-Mark Comprehensive Numerical]
A storm with 6-hour rainfall produces the following total streamflow on a $280\text{ km}^2$ catchment:

| Time (h) | 0 | 6 | 12 | 18 | 24 | 30 | 36 | 42 |
|---|---|---|---|---|---|---|---|---|
| Total $Q$ ($\text{m}^3\text{/s}$) | 20 | 50 | 120 | 180 | 130 | 70 | 35 | 20 |

Assuming a constant baseflow of $20\text{ m}^3\text{/s}$:
1. Deduce the Direct Runoff Hydrograph (DRH).
2. Compute the volume of direct runoff in cubic meters and $\text{MCM}$.
3. Calculate the effective rainfall depth in centimeters.
4. If total storm rainfall was $6.2\text{ cm}$, determine the $\phi$-index for the storm.
:::

:::sol
1. DRH ordinates ($Q - 20$): $0, 30, 100, 160, 110, 50, 15, 0\text{ m}^3\text{/s}$.
   Sum $= 465\text{ m}^3\text{/s}$.
2. Volume $V_d = 465 \times (6 \times 3600) = 465 \times 21{,}600 = 10{,}044{,}000\text{ m}^3 = 10.044\text{ MCM}$.
3. Runoff depth $R = 10{,}044{,}000 / (280 \times 10^6) = 0.03587\text{ m} = 3.59\text{ cm}$.
4. Losses $= P - R = 6.2 - 3.59 = 2.61\text{ cm}$.
   For storm duration $t_r = 6\text{ h}$ (assuming continuous rainfall excess): $\phi = 2.61 / 6 = 0.435\text{ cm/h} = 4.35\text{ mm/h}$.
:::
"""

    sessions = {
        "S19": s19_md,
        "S20": s20_md
    }

    # Generate S21 to S27
    s21_md = """<!--tab:Theory-->

> [!note] Key ideas
> - A Unit Hydrograph (UH) of duration $D$ is defined as the Direct Runoff Hydrograph resulting from $1\text{ cm}$ (or $1\text{ mm}$) of uniform rainfall excess generated uniformly over the entire watershed at an independent constant rate over duration $D$.
> - Two foundational assumptions: **Linear response (Proportionality)** — doubling excess rainfall doubles DRH ordinates; **Time invariance (Superposition)** — identical storm inputs produce identical responses regardless of when they occur.
> - To derive a $D$-hour UH from an observed storm: isolate single-peaked event, separate baseflow, integrate DRH to find runoff depth $R$ (cm), and divide all DRH ordinates by $R$: $U_i = Q_{d,i} / R$.

## 1. Concept and Definition of the Unit Hydrograph

Formulated by **Leroy K. Sherman in 1932**, the Unit Hydrograph (UH) remains the cornerstone of engineering hydrology for predicting catchment runoff from design storms.

```
   Excess Rainfall                   Direct Runoff Hydrograph (DRH)
   +-------------+                   ^
   | 1 cm excess |                   |        Peak U_p = Q_p / R
   | duration D  |    =======>       |            /\
   +-------------+                   |           /  \
                                     |          /    \
                                     |         /      \
                                     +--------+--------+--------> Time
                                              |<-- tp ->|
                                              |<------ tb ------>|
```

### Fundamental Hypotheses

1. **Linearity (Proportionality):** The ordinates of direct runoff are directly proportional to the total volume of rainfall excess. If $R\text{ cm}$ of rainfall excess occurs in duration $D$, each ordinate of the resulting DRH is $R$ times the corresponding ordinate of the $D$-hour unit hydrograph:
$$Q_d(t) = R \cdot U(t)$$
2. **Time Invariance:** The direct runoff response from a given rainfall excess is invariant with respect to time. A storm of duration $D$ occurring today produces the exact same hydrograph shape as the same storm occurring next month.
3. **Linear Superposition:** The total direct runoff response to successive blocks of rainfall excess is the algebraic sum of the direct runoff hydrographs produced by each individual block lagged appropriately in time.

---

## 2. Derivation Procedure from an Isolated Storm

To extract a $D$-hour unit hydrograph from streamflow observations:

1. **Storm Selection:** Choose an intense, isolated, uniform single-peaked storm whose effective duration is approximately $D$.
2. **Baseflow Separation:** Deduce baseflow $Q_b(t)$ from total streamflow to obtain direct runoff hydrograph ordinates:
$$Q_{d,i} = Q_{total,i} - Q_{b,i}$$
3. **Determine Runoff Depth ($R$):**
$$V_d = \Delta t \sum_{i=1}^{n} Q_{d,i}$$
$$R = \frac{V_d}{A} \times 100\text{ (in cm)}$$
4. **Compute Unit Hydrograph Ordinates ($U_i$):**
$$U_i = \frac{Q_{d,i}}{R}\text{ (m}^3\text{/s per cm)}$$
5. **Verify UH Depth:**
$$\frac{\Delta t \sum U_i}{A} = 1.0\text{ cm}$$

---

## 3. Worked Numerical Examples

### Worked Example 21.1: Derivation of a 6-hour Unit Hydrograph

**Problem:** A $250\text{ km}^2$ catchment receives an isolated 6-hour storm yielding the direct runoff hydrograph below. Derive the 6-hour unit hydrograph ordinates.

| Time (h) | 0 | 6 | 12 | 18 | 24 | 30 | 36 | 42 | 48 |
|---|---|---|---|---|---|---|---|---|---|
| DRH ($Q_d$, $\text{m}^3\text{/s}$) | 0 | 28 | 70 | 105 | 84 | 49 | 21 | 7 | 0 |

**Solution:**

**Step 1: Sum DRH ordinates**
$$\sum Q_d = 0 + 28 + 70 + 105 + 84 + 49 + 21 + 7 + 0 = 364\text{ m}^3\text{/s}$$

**Step 2: Calculate total direct runoff volume**
$$\Delta t = 6\text{ h} = 21{,}600\text{ s}$$
$$V_d = 364 \times 21{,}600 = 7{,}862{,}400\text{ m}^3$$

**Step 3: Calculate effective rainfall depth ($R$)**
$$R = \frac{7{,}862{,}400\text{ m}^3}{250 \times 10^6\text{ m}^2} = 0.03145\text{ m} = 3.145\text{ cm} \approx 3.5\text{ cm (or direct exact value)}$$
Using $R = 3.145\text{ cm}$:

**Step 4: Compute UH ordinates ($U_i = Q_{d,i} / R$)**
- $t = 0$: $0 / 3.145 = 0\text{ m}^3\text{/s}$
- $t = 6$: $28 / 3.145 = 8.90\text{ m}^3\text{/s}$
- $t = 12$: $70 / 3.145 = 22.26\text{ m}^3\text{/s}$
- $t = 18$: $105 / 3.145 = 33.39\text{ m}^3\text{/s}$
- $t = 24$: $84 / 3.145 = 26.71\text{ m}^3\text{/s}$
- $t = 30$: $49 / 3.145 = 15.58\text{ m}^3\text{/s}$
- $t = 36$: $21 / 3.145 = 6.68\text{ m}^3\text{/s}$
- $t = 42$: $7 / 3.145 = 2.23\text{ m}^3\text{/s}$
- $t = 48$: $0\text{ m}^3\text{/s}$

---

### Session 21 recap
1. A Unit Hydrograph represents the direct runoff from $1\text{ cm}$ of rainfall excess.
2. Sherman's assumptions: linearity, time invariance, and uniform areal distribution.
3. Derivation: $U_i = Q_{d,i} / R$, where $R = (\Delta t \sum Q_{d,i}) / A$.
4. Check condition: $\Delta t \sum U_i = 1\text{ cm} \times A$.

<!--tab:In class-->

## In-Class Activities & Verification

### Activity 1: Derive Peak UH Ordinate

A storm yields a direct runoff peak of $120\text{ m}^3\text{/s}$ from an effective rainfall depth of $4.0\text{ cm}$. Calculate the peak ordinate of the unit hydrograph in $\text{m}^3\text{/s}$.

```check
U_p = 30.0 m3/s
Tolerance: 0.1 m3/s
Hint: By linearity, U_p = Q_p / R = 120 / 4.0 = 30.0 m3/s.
```

<!--tab:Software lab-->

## Lab Linkage: HEC-HMS User-Specified Unit Hydrograph

In HEC-HMS Transform Methods:
1. Select **User-Specified Unit Hydrograph**.
2. Specify the duration $D$ and enter time-discharge pairs.
3. HMS automatically scales the hydrograph for any excess rainfall sequence.

<!--tab:Practice-->

## Practice Quiz & Exam Questions

```quiz
1. What rainfall excess depth does a standard Indian unit hydrograph represent?
* 1.0 cm
- 1.0 mm
- 1.0 inch
- 10.0 cm

2. If an effective rainfall of 2.5 cm produces a peak runoff of 75 m3/s, what peak runoff will 5.0 cm produce from the same storm duration?
* 150 m3/s
- 100 m3/s
- 300 m3/s
- 75 m3/s

3. Which assumption implies that direct runoff response is independent of antecedent storm dates?
* Time invariance
- Proportionality
- Constant infiltration
- Geomorphic equilibrium

4. A Unit Hydrograph is NOT applicable to catchments with:
* Substantial flood storage reservoirs or snowmelt dominance
- Rolling agricultural plains
- Homogeneous sandy soils
- Areas between 50 and 5000 km2
```

### Examination Questions

:::exam[5-Mark Derivation]
State and explain the fundamental assumptions of Unit Hydrograph theory. Discuss its practical limitations in engineering design.
:::

:::exam[10-Mark Numerical]
The ordinates of a 4-hour unit hydrograph are given below:

| Time (h) | 0 | 4 | 8 | 12 | 16 | 20 | 24 | 28 |
|---|---|---|---|---|---|---|---|---|
| UH ($\text{m}^3\text{/s}$) | 0 | 12 | 35 | 55 | 40 | 22 | 8 | 0 |

A storm produces successive 4-hour rainfall excesses of $2.0\text{ cm}$ and $3.0\text{ cm}$. Assuming a constant baseflow of $10\text{ m}^3\text{/s}$, compute the resulting peak streamflow and the time of its occurrence.
:::

:::sol
By convolution:
- Block 1 ($R_1 = 2.0\text{ cm}$ at $t = 0$): $Q_{d1} = 2.0 \times U(t)$
- Block 2 ($R_2 = 3.0\text{ cm}$ at $t = 4$): $Q_{d2} = 3.0 \times U(t-4)$
At $t = 12\text{ h}$:
$Q_{d}(12) = 2.0 \times U(12) + 3.0 \times U(8) = 2.0(55) + 3.0(35) = 110 + 105 = 215\text{ m}^3\text{/s}$.
At $t = 16\text{ h}$:
$Q_{d}(16) = 2.0 \times U(16) + 3.0 \times U(12) = 2.0(40) + 3.0(55) = 80 + 165 = 245\text{ m}^3\text{/s}$.
At $t = 20\text{ h}$:
$Q_{d}(20) = 2.0 \times U(20) + 3.0 \times U(16) = 2.0(22) + 3.0(40) = 44 + 120 = 164\text{ m}^3\text{/s}$.
Peak direct runoff $= 245\text{ m}^3\text{/s}$ at $t = 16\text{ h}$.
Total peak streamflow $= 245 + 10 = 255\text{ m}^3\text{/s}$ at $t = 16\text{ hours}$.
:::
"""

    sessions["S21"] = s21_md

    # S22
    s22_md = """<!--tab:Theory-->

> [!note] Key ideas
> - Complex storms consist of multiple consecutive time blocks of differing rainfall excess: $P_1, P_2, \dots, P_m$.
> - The discrete convolution equation predicts total direct runoff: $Q_n = \sum_{m=1}^n P_m U_{n - m + 1}$.
> - Deriving a unit hydrograph from a complex storm requires **deconvolution** (successive substitution or least-squares matrix regression: $\mathbf{U} = (\mathbf{P}^T \mathbf{P})^{-1} \mathbf{P}^T \mathbf{Q}$).

## 1. Discrete Convolution Equation

When a storm consists of $M$ consecutive rainfall excess pulses $P_1, P_2, \dots, P_M$ each of duration $D$, the direct runoff ordinate $Q_n$ at time step $n$ is given by the superposition summation:

$$Q_n = \sum_{m=1}^{\min(n, M)} P_m \cdot U_{n - m + 1}$$

Expanded row-by-row:
$$\begin{aligned}
Q_1 &= P_1 U_1 \\
Q_2 &= P_1 U_2 + P_2 U_1 \\
Q_3 &= P_1 U_3 + P_2 U_2 + P_3 U_1 \\
&\;\vdots \\
Q_n &= P_1 U_n + P_2 U_{n-1} + \dots + P_M U_{n-M+1}
\end{aligned}$$

---

## 2. Matrix Formulation and Deconvolution

In matrix notation:
$$\mathbf{Q} = \mathbf{P} \cdot \mathbf{U}$$

Where $\mathbf{P}$ is the banded Toeplitz matrix of rainfall excess pulses:
$$\begin{bmatrix} Q_1 \\ Q_2 \\ Q_3 \\ \vdots \\ Q_K \end{bmatrix} = \begin{bmatrix}
P_1 & 0 & 0 & \dots \\
P_2 & P_1 & 0 & \dots \\
P_3 & P_2 & P_1 & \dots \\
\vdots & \vdots & \vdots & \dots
\end{bmatrix} \begin{bmatrix} U_1 \\ U_2 \\ U_3 \\ \vdots \\ U_L \end{bmatrix}$$

If direct forward substitution is used, small errors in early measurements can amplify causing unrealistic oscillatory (negative) ordinates. Hence, constrained least-squares optimization is applied:
$$\min \|\mathbf{P} \mathbf{U} - \mathbf{Q}\|^2 \quad \text{subject to } U_i \ge 0$$

---

## 3. Worked Numerical Examples

### Worked Example 22.1: Hydrograph from a Two-Block Storm

**Problem:** A 3-hour unit hydrograph has ordinates: $U_1 = 10, U_2 = 25, U_3 = 18, U_4 = 6, U_5 = 0\text{ m}^3\text{/s}$. A storm has two consecutive 3-hour rainfall excesses: $P_1 = 2.0\text{ cm}$ and $P_2 = 1.5\text{ cm}$. Compute the resulting DRH ordinates.

**Solution:**
- $Q_1 = P_1 U_1 = 2.0 \times 10 = 20\text{ m}^3\text{/s}$
- $Q_2 = P_1 U_2 + P_2 U_1 = 2.0(25) + 1.5(10) = 50 + 15 = 65\text{ m}^3\text{/s}$
- $Q_3 = P_1 U_3 + P_2 U_2 = 2.0(18) + 1.5(25) = 36 + 37.5 = 73.5\text{ m}^3\text{/s}$
- $Q_4 = P_1 U_4 + P_2 U_3 = 2.0(6) + 1.5(18) = 12 + 27 = 39.0\text{ m}^3\text{/s}$
- $Q_5 = P_1(0) + P_2 U_4 = 0 + 1.5(6) = 9.0\text{ m}^3\text{/s}$
- $Q_6 = 0$

Peak direct discharge is $73.5\text{ m}^3\text{/s}$ at $t = 9\text{ hours}$.

---

### Session 22 recap
1. Multi-period storms are handled through discrete convolution.
2. If storm has $M$ pulses and UH has $L$ ordinates, DRH has $K = M + L - 1$ ordinates.
3. Deconvolution solves the inverse problem $\mathbf{U} = \mathbf{P}^{-1} \mathbf{Q}$.

<!--tab:In class-->

## In-Class Activities & Verification

### Activity 1: Solve First Three Ordinates by Forward Substitution

Given $P_1 = 2.0\text{ cm}$, $P_2 = 3.0\text{ cm}$, and observed DRH: $Q_1 = 16\text{ m}^3\text{/s}$, $Q_2 = 44\text{ m}^3\text{/s}$.
Find the second UH ordinate $U_2$.
- $Q_1 = P_1 U_1 \implies U_1 = 16 / 2 = 8.0$.
- $Q_2 = P_1 U_2 + P_2 U_1 \implies 44 = 2.0 U_2 + 3.0(8) = 2.0 U_2 + 24 \implies 2.0 U_2 = 20 \implies U_2 = 10.0$.

```check
U_2 = 10.0 m3/s
Tolerance: 0.1 m3/s
Hint: U_2 = (Q_2 - P_2 * U_1) / P_1 = (44 - 24) / 2 = 10.0 m3/s.
```

<!--tab:Software lab-->

## Lab Linkage: Python Deconvolution Script

Write a Python script using `scipy.optimize.nnls` (non-negative least squares) to deconvolve unit hydrographs from complex monsoon flood events.

<!--tab:Practice-->

## Practice Quiz & Exam Questions

```quiz
1. If a storm has 3 rainfall excess pulses and the unit hydrograph has 6 ordinates, how many ordinates will the direct runoff hydrograph possess?
* 8
- 18
- 9
- 7

2. The process of extracting unit hydrograph ordinates from a complex storm DRH is mathematically termed:
* Deconvolution
- Convolution
- Differentiation
- Extrapolation
```

:::exam[5-Mark Derivation]
Write down the discrete convolution formulation for a 3-period rainfall excess storm and explain how unconstrained deconvolution can lead to hydrologically unstable negative ordinates.
:::
"""

    sessions["S22"] = s22_md

    # S23
    s23_md = """<!--tab:Theory-->

> [!note] Key ideas
> - To convert a $D$-hour UH to a new duration $D'$:
>   - **Method of Superposition:** Valid only when $D'$ is an integer multiple of $D$ ($D' = n D$). Lag $n$ unit hydrographs by $D, 2D, \dots$ and divide the summed ordinates by $n$.
>   - **S-Curve (S-Hydrograph) Technique:** Valid for any arbitrary duration ratio $D'/D$. Represents the continuous cumulative response to an endless series of $D$-hour excess rainfall blocks of intensity $1/D\text{ cm/h}$.
> - Equilibrium discharge of the S-curve: $Q_e = 2.778 \frac{A}{D}$ ($\text{m}^3\text{/s}$, $A$ in $\text{km}^2$, $D$ in hours).
> - New $D'$-hour UH ordinates: $U_{D'}(t) = \frac{D}{D'} [S(t) - S(t - D')]$.

## 1. The Need to Change Unit Hydrograph Duration

Field storms rarely match the exact duration $D$ of an available unit hydrograph. Hydrologists must therefore transform a $D$-hour unit hydrograph into a $D'$-hour unit hydrograph.

---

## 2. Method of Superposition (Integer Multiples)

If $D' = n \cdot D$ where $n$ is an integer (e.g., converting a 2-hour UH to a 6-hour UH, $n = 3$):
1. Lag $n$ identical $D$-hour unit hydrographs successively by $D, 2D, \dots, (n-1)D$.
2. Sum the corresponding ordinates at each time step.
3. Divide each summed ordinate by $n$.

---

## 3. The S-Curve (S-Hydrograph) Technique

The S-curve is the direct runoff hydrograph produced by a continuous, infinite series of $D$-hour effective rainfalls each of depth $1\text{ cm}$ (effective intensity $i = 1/D\text{ cm/h}$).

```
   Discharge Q
        ^                           Equilibrium Discharge Q_e = 2.778 A / D
        |                        ==========================================
        |                       /
        |                      /   S-Curve: S(t) = sum of lagged D-hr UHs
        |                     /
        |                    /  S(t - D') (Lagged by D')
        |                   /  /
        |                  /  /       Delta S = S(t) - S(t - D')
        |                 /  /
        +----------------+--+---------------------------------------------> Time
                         |<D'>|
```

### Derivation Steps for New Duration $D'$
1. Construct the S-curve by cumulative summation of $D$-hour UH ordinates lagged by $D$:
$$S(t) = \sum U_D(t - k D)$$
2. Offset the S-curve by the desired new duration $D'$: $S(t - D')$.
3. Compute the difference: $\Delta S(t) = S(t) - S(t - D')$.
4. Scale by the duration ratio:
$$U_{D'}(t) = \Delta S(t) \times \frac{D}{D'} = \frac{D}{D'} [S(t) - S(t - D')]$$

---

## 4. Worked Numerical Examples

### Worked Example 23.1: Equilibrium Discharge Calculation

**Problem:** A $360\text{ km}^2$ drainage basin has a 4-hour unit hydrograph. Calculate the equilibrium discharge $Q_e$ of its S-curve.

**Solution:**
$$Q_e = 2.778 \cdot \frac{A}{D} = 2.778 \cdot \frac{360}{4} = 250.02\text{ m}^3\text{/s} \approx 250.0\text{ m}^3\text{/s}$$

---

### Session 23 recap
1. Superposition is used for integer multiples $D' = n D$.
2. S-curve method works for any duration conversion.
3. S-curve equilibrium discharge: $Q_e = 2.778 A / D$.
4. $U_{D'}(t) = (D / D') [S(t) - S(t - D')]$.

<!--tab:In class-->

## In-Class Activities & Verification

### Activity 1: Equilibrium Discharge Check

A $480\text{ km}^2$ catchment has a 6-hour unit hydrograph. Calculate its S-curve equilibrium discharge in $\text{m}^3\text{/s}$.

```check
Q_e = 222.2 m3/s
Tolerance: 0.5 m3/s
Hint: Q_e = 2.778 * 480 / 6 = 222.24 m3/s.
```

<!--tab:Software lab-->

## Lab Linkage: S-Curve Interpolation

In HEC-HMS, when a user-specified unit hydrograph has a different duration from the simulation time step $\Delta t$, HEC-HMS internally develops an S-curve and re-samples it at $\Delta t$.

<!--tab:Practice-->

## Practice Quiz & Exam Questions

```quiz
1. The S-curve method is applicable for converting unit hydrograph duration:
* For any rational duration ratio D'/D
- Only when D' is an exact integer multiple of D
- Only when D' is less than D
- Only for triangular catchments

2. The equilibrium discharge of an S-curve represents:
* Maximum steady outflow when rainfall excess rate equals runoff rate
- The storage capacity of the downstream reservoir
- The baseflow rate of the aquifer
- Peak direct runoff from a 1-hour storm
```

:::exam[5-Mark Derivation]
Explain the step-by-step procedure for deriving a $D'$-hour unit hydrograph from a given $D$-hour unit hydrograph using the S-curve technique.
:::
"""

    sessions["S23"] = s23_md

    # S24
    s24_md = """<!--tab:Theory-->

> [!note] Key ideas
> - For ungauged catchments without streamflow records, **Synthetic Unit Hydrographs (SUH)** relate hydrograph shape parameters to measurable physical basin characteristics.
> - **Snyder's Synthetic Unit Hydrograph (1938)** uses basin length $L$, centroidal length $L_{ca}$, and regional empirical coefficients $C_t$ ($1.35\text{--}1.65$) and $C_p$ ($0.56\text{--}0.69$).
> - Key formulas:
>   - Basin lag: $t_p = C_t (L \cdot L_{ca})^{0.3}$
>   - Standard storm duration: $t_r = t_p / 5.5$
>   - Adjusted lag for non-standard duration $t_R$: $t_{pR} = t_p + 0.25 (t_R - t_r)$
>   - Peak discharge: $Q_{pR} = \frac{2.78 C_p A}{t_{pR}}$ ($\text{m}^3\text{/s}$)
>   - Hydrograph widths at $50\\%$ and $75\\%$ peak: $W_{50} = \frac{5.87}{(q_{pR})^{1.08}}$, $W_{75} = \frac{W_{50}}{1.75}$.

## 1. Snyder's Synthetic Unit Hydrograph Equations

Snyder analyzed Appalachian basins in the USA, establishing relationships between catchment geometry and the three key points of a unit hydrograph (lag time, peak flow, and time base).

1. **Basin Lag Time ($t_p$):**
$$t_p = C_t (L \cdot L_{ca})^{0.3}\text{ (hours)}$$
Where:
- $L$ = stream length along main channel from basin divide to outlet ($\text{km}$)
- $L_{ca}$ = distance along main stream from outlet to point opposite basin centroid ($\text{km}$)
- $C_t$ = regional physiographic coefficient ($1.35$ to $1.65$ in Indian sub-basins)

2. **Standard Duration ($t_r$):**
$$t_r = \frac{t_p}{5.5}\text{ (hours)}$$

3. **Modified Lag for Design Duration $t_R$ ($t_R \ne t_r$):**
$$t_{pR} = t_p + \frac{1}{4} (t_R - t_r)$$

4. **Peak Discharge ($Q_{pR}$):**
$$Q_{pR} = \frac{2.78 \cdot C_p \cdot A}{t_{pR}}\text{ (m}^3\text{/s)}$$
Peak discharge per unit area:
$$q_{pR} = \frac{Q_{pR}}{A} = \frac{2.78 \cdot C_p}{t_{pR}}\text{ (m}^3\text{/s/km}^2\text{)}$$

5. **Time Base ($t_b$):**
$$t_b = 3 + 3 \left(\frac{t_{pR}}{24}\right)\text{ (days)} = 72 + 3 t_{pR}\text{ (hours for large basins)}$$
For small basins, $t_b$ is frequently taken as $3$ to $5$ times $t_{pR}$.

6. **US Army Corps Width Equations:**
$$W_{50} = \frac{5.87}{(q_{pR})^{1.08}}\text{ (hours)}$$
$$W_{75} = \frac{W_{50}}{1.75}\text{ (hours)}$$

---

## 2. Worked Numerical Examples

### Worked Example 24.1: Snyder's SUH Derivation

**Problem:** A $520\text{ km}^2$ ungauged catchment has main stream length $L = 35\text{ km}$ and centroidal distance $L_{ca} = 18\text{ km}$. Regional parameters are $C_t = 1.5$ and $C_p = 0.65$. Derive the parameters of a 4-hour synthetic unit hydrograph.

**Solution:**

**Step 1: Basin lag time $t_p$**
$$L \cdot L_{ca} = 35 \times 18 = 630\text{ km}^2$$
$$(630)^{0.3} = 6.901$$
$$t_p = 1.5 \times 6.901 = 10.35\text{ hours}$$

**Step 2: Standard duration $t_r$**
$$t_r = \frac{10.35}{5.5} = 1.88\text{ hours}$$

**Step 3: Adjusted lag for $t_R = 4.0\text{ hours}$**
$$t_{pR} = 10.35 + 0.25 (4.0 - 1.88) = 10.35 + 0.25(2.12) = 10.35 + 0.53 = 10.88\text{ hours}$$

**Step 4: Peak discharge $Q_{pR}$**
$$Q_{pR} = \frac{2.78 \cdot 0.65 \cdot 520}{10.88} = \frac{939.64}{10.88} = 86.36\text{ m}^3\text{/s}$$
$$q_{pR} = \frac{86.36}{520} = 0.1661\text{ m}^3\text{/s/km}^2$$

---

### Session 24 recap
1. Snyder's method synthesizes a UH from $L$ and $L_{ca}$.
2. Standard duration: $t_r = t_p / 5.5$.
3. Adjusted lag: $t_{pR} = t_p + 0.25(t_R - t_r)$.
4. Peak flow: $Q_{pR} = 2.78 C_p A / t_{pR}$.

<!--tab:In class-->

## In-Class Activities & Verification

### Activity 1: Snyder Basin Lag Check

For a basin with $L = 40\text{ km}$, $L_{ca} = 20\text{ km}$, and $C_t = 1.4$, calculate basin lag $t_p$ in hours.
$L \cdot L_{ca} = 800$. $(800)^{0.3} = 7.412$. $t_p = 1.4 \times 7.412 = 10.38\text{ h}$.

```check
t_p = 10.38 h
Tolerance: 0.1 h
Hint: t_p = 1.4 * (800)^0.3 = 10.38 hours.
```

<!--tab:Software lab-->

## Lab Linkage: Snyder UH in HEC-HMS

Select **Snyder Unit Hydrograph** as the Transform Method in HEC-HMS. Input the Standard Lag $t_p$ and Peaking Coefficient $C_p$.

<!--tab:Practice-->

## Practice Quiz & Exam Questions

```quiz
1. In Snyder's unit hydrograph formulation, standard duration t_r is defined as:
* t_p / 5.5
- t_p / 2.0
- 0.5 t_c
- 0.83 A^0.2

2. The dimension of the coefficient 2.78 in Snyder's metric peak flow equation accounts for:
* Unit conversion from km2-cm/h to m3/s
- Acceleration due to gravity
- Infiltration capacity
- Manning roughness
```

:::exam[10-Mark Numerical]
An ungauged catchment has an area of $420\text{ km}^2$, $L = 30\text{ km}$, and $L_{ca} = 15\text{ km}$. From nearby gauged catchments, $C_t = 1.6$ and $C_p = 0.60$. Derive the 3-hour Snyder unit hydrograph parameters ($t_p, t_r, t_{pR}, Q_{pR}, W_{50}$).
:::

:::sol
1. $t_p = 1.6 \times (30 \times 15)^{0.3} = 1.6 \times (450)^{0.3} = 1.6 \times 6.241 = 9.99\text{ h} \approx 10.0\text{ h}$.
2. $t_r = 10.0 / 5.5 = 1.82\text{ h}$.
3. $t_{pR} = 10.0 + 0.25(3.0 - 1.82) = 10.0 + 0.295 = 10.30\text{ h}$.
4. $Q_{pR} = 2.78 \times 0.60 \times 420 / 10.30 = 700.56 / 10.30 = 68.02\text{ m}^3\text{/s}$.
5. $q_{pR} = 68.02 / 420 = 0.1620\text{ m}^3\text{/s/km}^2$.
   $W_{50} = 5.87 / (0.1620)^{1.08} = 5.87 / 0.1412 = 41.57\text{ hours}$.
:::
"""

    sessions["S24"] = s24_md

    # S25
    s25_md = """<!--tab:Theory-->

> [!note] Key ideas
> - The **SCS Dimensionless Unit Hydrograph** expresses ordinate ratios $q/q_p$ as a function of time ratios $t/t_p$.
> - It is based on an equivalent triangular unit hydrograph having:
>   - Time to peak: $t_p = \frac{D}{2} + t_L = \frac{D}{2} + 0.6 t_c$
>   - Recession time: $t_r = 1.67 t_p$
>   - Total time base: $t_b = t_p + t_r = 2.67 t_p$
>   - Peak discharge: $q_p = \frac{0.208 \cdot A \cdot Q}{t_p}$ (for $Q = 1\text{ cm} = 10\text{ mm}$, $q_p = \frac{2.08 A}{t_p}$ in $\text{m}^3\text{/s}$).
> - $37.5\\%$ of total direct runoff volume occurs before the peak; $62.5\\%$ resides in the recession limb.

## 1. The SCS Dimensionless Unit Hydrograph

Developed by Victor Mockus (1957) for the USDA Soil Conservation Service (NRCS), this dimensionless hydrograph was derived from hundreds of gauged agricultural watersheds across varied topographies.

```
   Discharge Ratio q/q_p
        ^
    1.0 |                Peak (1.0, 1.0)
        |                      /\
        |                     /  \
        |                    /    \
        |   Triangular      /      \
        |   Approximation  /        \
        |                 /          \
        +----------------+------------+-------------------------> Time Ratio t/t_p
        0               1.0          2.67 (Time base t_b)
```

### Triangular Equivalence and Derivation

The total direct runoff volume under the triangular hydrograph is:
$$V = \frac{1}{2} \cdot q_p \cdot t_b$$

Setting $t_b = 2.67 t_p$:
$$V = \frac{1}{2} \cdot q_p \cdot (2.67 t_p) = 1.335 \cdot q_p \cdot t_p$$

Equating to total runoff volume $V = A \times Q$:
$$q_p = \frac{V}{1.335 t_p} = \frac{A \cdot Q}{1.335 t_p}$$

In SI engineering units ($A$ in $\text{km}^2$, $Q$ in $\text{mm}$, $t_p$ in hours, $q_p$ in $\text{m}^3\text{/s}$):
$$q_p = \frac{10^6 \text{ m}^2/\text{km}^2 \times 10^{-3}\text{ m/mm}}{1.335 \times 3600\text{ s/h}} \cdot \frac{A \cdot Q}{t_p} = 0.208 \cdot \frac{A \cdot Q}{t_p}$$

For $1\text{ cm}$ ($10\text{ mm}$) of excess rainfall:
$$q_p = \frac{2.08 \cdot A}{t_p}\text{ (m}^3\text{/s)}$$

---

## 2. Worked Numerical Examples

### Worked Example 25.1: Peak Flow by SCS Triangular Method

**Problem:** A $85\text{ km}^2$ watershed has a time of concentration $t_c = 3.0\text{ hours}$. Calculate the peak discharge of a 1-hour SCS unit hydrograph.

**Solution:**
$$t_p = \frac{D}{2} + 0.6 t_c = \frac{1.0}{2} + 0.6(3.0) = 0.5 + 1.8 = 2.3\text{ hours}$$
$$q_p = \frac{2.08 \cdot A}{t_p} = \frac{2.08 \times 85}{2.3} = \frac{176.8}{2.3} = 76.87\text{ m}^3\text{/s}$$
Time base:
$$t_b = 2.67 \times t_p = 2.67 \times 2.3 = 6.14\text{ hours}$$

---

### Session 25 recap
1. SCS dimensionless hydrograph ratios: $q/q_p$ vs $t/t_p$.
2. Peak parameter: $q_p = 2.08 A / t_p$ for $1\text{ cm}$ excess.
3. Time parameters: $t_p = D/2 + 0.6 t_c$, $t_b = 2.67 t_p$.

<!--tab:In class-->

## In-Class Activities & Verification

### Activity 1: SCS Triangular Peak Check

A $120\text{ km}^2$ catchment has $t_p = 4.0\text{ hours}$. Calculate the 1-cm unit hydrograph peak discharge $q_p$ in $\text{m}^3\text{/s}$.

```check
q_p = 62.4 m3/s
Tolerance: 0.2 m3/s
Hint: q_p = 2.08 * 120 / 4.0 = 62.4 m3/s.
```

<!--tab:Software lab-->

## Lab Linkage: SCS Unit Hydrograph in HEC-HMS

Select **SCS Unit Hydrograph** as the Transform Method. Enter the basin lag time $t_{lag} = 0.6 t_c$.

<!--tab:Practice-->

## Practice Quiz & Exam Questions

```quiz
1. In the SCS triangular unit hydrograph, the ratio of time base t_b to time to peak t_p is:
* 2.67
- 1.67
- 3.00
- 5.50

2. What percentage of total direct runoff occurs before the peak in the standard SCS dimensionless unit hydrograph?
* 37.5%
- 50.0%
- 62.5%
- 25.0%
```

:::exam[5-Mark Derivation]
Derive the peak discharge equation $q_p = 0.208 A Q / t_p$ for the SCS triangular unit hydrograph from first principles.
:::
"""

    sessions["S25"] = s25_md

    # S26
    s26_md = """<!--tab:Theory-->

> [!note] Key ideas
> - An **Instantaneous Unit Hydrograph (IUH)** is the direct runoff hydrograph resulting from $1\text{ cm}$ of rainfall excess applied instantaneously ($D \to 0$) over the watershed.
> - Acts as the watershed's impulse response function $u(t)$ in linear systems theory: $Q(t) = \int_0^t I(\tau) u(t - \tau) d\tau$.
> - **Clark's Method (1945):** Routes a time-area concentration diagram through a single linear reservoir ($S = K Q$).
> - **Nash Conceptual Model (1957):** Routes instantaneous input through a cascade of $n$ identical linear reservoirs with storage constant $K$.

## 1. Instantaneous Unit Hydrograph Concept

As rainfall duration $D \to 0$, the $D$-hour unit hydrograph approaches a limiting continuous mathematical function called the Instantaneous Unit Hydrograph, $u(t)$:

$$u(t) = \lim_{D \to 0} U_D(t) = \frac{d S(t)}{dt}$$

Where $S(t)$ is the S-curve ordinate per unit rainfall excess intensity.

---

## 2. Nash's Conceptual Cascade Model

J.E. Nash represented the watershed as a series cascade of $n$ identical linear reservoirs, each with storage constant $K$:

```
   Excess I(t) ---> [ Reservoir 1 ] ---> [ Reservoir 2 ] ---> ... ---> [ Reservoir n ] ---> Outflow Q(t)
                         S = K Q1             S = K Q2                     S = K Qn
```

The impulse response of the $n$-th reservoir yields the **Nash IUH equation**:
$$u(t) = \frac{1}{K \cdot \Gamma(n)} \left(\frac{t}{K}\right)^{n - 1} e^{-t / K}$$

Where $\Gamma(n)$ is the gamma function ($\Gamma(n) = (n - 1)!$ for integer $n$).

The statistical moments relate directly to catchment parameters:
1. **First moment (mean lag time):**
$$t_L = \mu_1 = n \cdot K$$
2. **Second central moment (variance):**
$$\sigma^2 = \mu_2 = n \cdot K^2$$

---

## 3. Worked Numerical Examples

### Worked Example 26.1: Nash IUH Parameter Estimation

**Problem:** Moments analysis of an observed storm and DRH yields a mean lag time $t_L = 12\text{ hours}$ and variance $\sigma^2 = 24\text{ hours}^2$. Determine the Nash cascade parameters $n$ and $K$.

**Solution:**
$$\mu_1 = n K = 12$$
$$\mu_2 = n K^2 = 24$$
Dividing the two equations:
$$K = \frac{\mu_2}{\mu_1} = \frac{24}{12} = 2.0\text{ hours}$$
$$n = \frac{\mu_1}{K} = \frac{12}{2.0} = 6.0$$

The catchment is represented by a cascade of 6 linear reservoirs with storage constant $K = 2.0\text{ hours}$.

---

### Session 26 recap
1. IUH is the impulse response function $u(t) = dS(t)/dt$.
2. Clark's method routes the time-area diagram through a linear reservoir.
3. Nash model: $n$ reservoirs in series, $t_L = n K$, $\sigma^2 = n K^2$.

<!--tab:In class-->

## In-Class Activities & Verification

### Activity 1: Solve Nash Parameters from Lag and Variance

Given lag time $\mu_1 = 15\text{ hours}$ and variance $\mu_2 = 45\text{ hours}^2$, find $K$.

```check
K = 3.0 h
Tolerance: 0.1 h
Hint: K = mu_2 / mu_1 = 45 / 15 = 3.0 hours.
```

<!--tab:Software lab-->

## Lab Linkage: Clark Unit Hydrograph in HEC-HMS

Select **Clark Unit Hydrograph**. Enter the Time of Concentration $T_c$ and the Storage Coefficient $R$ (equivalent to linear reservoir constant $K$).

<!--tab:Practice-->

## Practice Quiz & Exam Questions

```quiz
1. The Instantaneous Unit Hydrograph represents the derivative of which hydrologic curve?
* S-curve
- Flow duration curve
- Hyetograph
- Double mass curve

2. In the Nash cascade model with n = 4 and K = 3 hours, what is the centroid lag time of the catchment?
* 12 hours
- 7 hours
- 0.75 hours
- 36 hours
```

:::exam[5-Mark Derivation]
State the mathematical formulation of the Nash conceptual IUH model and derive the expressions relating $n$ and $K$ to the first and second moments of the hydrograph.
:::
"""

    sessions["S26"] = s26_md

    # S27
    s27_md = """<!--tab:Theory-->

> [!note] Key ideas
> - Flood routing tracks the changes in flood wave magnitude, shape, and phase as it propagates through a reservoir or river reach.
> - **Reservoir Routing (Level Pool / Modified Puls):** Storage is a unique function of outflow stage: $S = f(O)$. Governing relation:
>   $$\left(\frac{2 S_2}{\Delta t} + O_2\right) = (I_1 + I_2) + \left(\frac{2 S_1}{\Delta t} - O_1\right)$$
> - **Channel Routing (Muskingum Method):** Storage combines prism storage and wedge storage: $S = K [x I + (1 - x) O]$. Routing equation:
>   $$O_2 = C_0 I_2 + C_1 I_1 + C_2 O_1 \quad \text{where } C_0 + C_1 + C_2 = 1.0$$

## 1. Hydrologic Continuity Equation

For any river reach or reservoir, conservation of mass dictates:
$$\frac{dS}{dt} = I - O$$

Over a finite routing interval $\Delta t$:
$$\frac{I_1 + I_2}{2} - \frac{O_1 + O_2}{2} = \frac{S_2 - S_1}{\Delta t}$$

---

## 2. Channel Routing: The Muskingum Method

In natural channels, storage during flood wave passage consists of:
1. **Prism Storage ($K O$):** Volume beneath a surface parallel to channel bed.
2. **Wedge Storage ($K x [I - O]$):** Extra volume during rising limb ($I > O$) or deficit during falling limb ($I < O$).

$$S = K [x I + (1 - x) O]$$

Where:
- $K$ = reach travel time (storage parameter, hours)
- $x$ = weighting factor ($0 \le x \le 0.5$; typically $0.1$ to $0.3$ in natural streams; $x = 0$ for level reservoirs)

```
                       Inflow I
                         \
                          \ Wedge Storage: K * x * (I - O)
                           \________
                           |        \
                           |         \
                           | Prism    \  Outflow O
                           | Storage:  \
                           | K * (1-x)*O\
    -----------------------+-------------+---------------------- Bed
```

### The Muskingum Routing Coefficients

Substituting into the continuity equation yields:
$$O_2 = C_0 I_2 + C_1 I_1 + C_2 O_1$$

Where:
$$C_0 = \frac{\Delta t - 2 K x}{2 K (1 - x) + \Delta t}$$
$$C_1 = \frac{\Delta t + 2 K x}{2 K (1 - x) + \Delta t}$$
$$C_2 = \frac{2 K (1 - x) - \Delta t}{2 K (1 - x) + \Delta t}$$
$$C_0 + C_1 + C_2 = 1.0$$

Stability condition to avoid negative coefficients:
$$2 K x < \Delta t \le 2 K (1 - x)$$

---

## 3. Worked Numerical Examples

### Worked Example 27.1: Muskingum Routing Coefficients & Propagation

**Problem:** A river reach has $K = 12\text{ hours}$ and $x = 0.20$. For a routing time step $\Delta t = 6\text{ hours}$:
1. Compute the Muskingum routing coefficients $C_0, C_1, C_2$.
2. Given $I_1 = 20\text{ m}^3\text{/s}$, $I_2 = 50\text{ m}^3\text{/s}$, and $O_1 = 20\text{ m}^3\text{/s}$, find $O_2$.

**Solution:**

**Step 1: Compute coefficients**
Denominator:
$$D = 2 K (1 - x) + \Delta t = 2(12)(1 - 0.2) + 6 = 24(0.8) + 6 = 19.2 + 6 = 25.2\text{ h}$$
Numerator for $C_0$:
$$N_0 = \Delta t - 2 K x = 6 - 2(12)(0.2) = 6 - 4.8 = 1.2\text{ h}$$
$$C_0 = \frac{1.2}{25.2} = 0.0476$$

Numerator for $C_1$:
$$N_1 = \Delta t + 2 K x = 6 + 4.8 = 10.8\text{ h}$$
$$C_1 = \frac{10.8}{25.2} = 0.4286$$

Numerator for $C_2$:
$$N_2 = 2 K (1 - x) - \Delta t = 19.2 - 6 = 13.2\text{ h}$$
$$C_2 = \frac{13.2}{25.2} = 0.5238$$

Check sum:
$$C_0 + C_1 + C_2 = 0.0476 + 0.4286 + 0.5238 = 1.0000\text{ (Verified)}$$

**Step 2: Compute $O_2$**
$$O_2 = C_0 I_2 + C_1 I_1 + C_2 O_1$$
$$O_2 = (0.0476 \times 50) + (0.4286 \times 20) + (0.5238 \times 20)$$
$$O_2 = 2.38 + 8.572 + 10.476 = 21.43\text{ m}^3\text{/s}$$

---

### Session 27 recap
1. Routing calculates flood attenuation and phase lag.
2. Reservoir routing: Modified Puls ($S$ depends only on $O$).
3. Channel routing: Muskingum equation with prism and wedge storage.
4. $C_0 + C_1 + C_2 = 1.0$.

<!--tab:In class-->

## In-Class Activities & Verification

### Activity 1: Check Muskingum C2 Coefficient

For $K = 10\text{ h}$, $x = 0.2$, $\Delta t = 4\text{ h}$, compute $C_2$.
- $2 K (1 - x) = 2(10)(0.8) = 16$.
- Denom $= 16 + 4 = 20$.
- Num $= 16 - 4 = 12$.
- $C_2 = 12 / 20 = 0.60$.

```check
C_2 = 0.60
Tolerance: 0.01
Hint: C_2 = (2*K*(1-x) - dt) / (2*K*(1-x) + dt) = (16 - 4) / (16 + 4) = 0.60.
```

<!--tab:Software lab-->

## Lab Linkage: Reach Routing in HEC-HMS

In HEC-HMS Reach components:
1. Select Routing Method: **Muskingum**.
2. Enter Muskingum $K$ (hours), $x$, and number of sub-reaches.
3. Run simulation to observe downstream peak attenuation and lag.

<!--tab:Practice-->

## Practice Quiz & Exam Questions

```quiz
1. What value does the Muskingum weighting factor x take for a level pool reservoir?
* 0.0
- 0.5
- 1.0
- 0.2

2. The sum of the Muskingum routing coefficients C0 + C1 + C2 is always equal to:
* 1.0
- 0.0
- K
- Delta t
```

:::exam[10-Mark Numerical]
A flood wave with the following inflow passes through a river reach with $K = 8\text{ hours}$ and $x = 0.15$. Using $\Delta t = 4\text{ hours}$ and an initial outflow of $15\text{ m}^3\text{/s}$, route the flood through the reach for 16 hours.
:::

:::sol
$2 K (1 - x) = 2(8)(0.85) = 13.6\text{ h}$.
$2 K x = 2(8)(0.15) = 2.4\text{ h}$.
$D = 13.6 + 4 = 17.6\text{ h}$.
$C_0 = (4 - 2.4) / 17.6 = 1.6 / 17.6 = 0.0909$.
$C_1 = (4 + 2.4) / 17.6 = 6.4 / 17.6 = 0.3636$.
$C_2 = (13.6 - 4) / 17.6 = 9.6 / 17.6 = 0.5455$.
Check: $0.0909 + 0.3636 + 0.5455 = 1.0000$.
Using $O_2 = C_0 I_2 + C_1 I_1 + C_2 O_1$, outflows are sequentially calculated at 4-hour intervals, demonstrating peak attenuation and translation.
:::
"""

    sessions["S27"] = s27_md

    for sid, md in sessions.items():
        with open(f"sessions/{sid}.md", "w", encoding="utf-8") as f:
            f.write(md)
        print(f"Generated sessions/{sid}.md")

if __name__ == '__main__':
    run()
