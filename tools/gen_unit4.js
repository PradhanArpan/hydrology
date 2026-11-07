const fs = require('fs');
const path = require('path');

const sessionsDir = path.join(__dirname, '..', 'sessions');

const u4 = {};

// S28: Stage measurement
u4["S28"] = `<!--tab:Theory-->

> [!note] Key ideas
> - Streamflow (discharge $Q$ in $\\text{m}^3\\text{/s}$) is the volume of water passing through a river cross-section per unit time.
> - River stage ($G$ or $h$) is the elevation of the free water surface above an established reference datum.
> - Manual gauges: vertical staff, sectional staff, inclined staff, and wire weight gauges.
> - Automatic continuous recorders: float-type stilling well gauges, pneumatic bubbler pressure gauges, ultrasonic sensors, and non-contact radar level sensors.
> - Stage data is combined with a calibrated stage-discharge rating curve to generate continuous streamflow records.

## 1. Objectives of Streamflow Measurement

Streamflow measurement (hydrometry) provides the fundamental empirical basis for water resources engineering:
1. **Flood Warning and Disaster Management:** Providing real-time stage monitoring to forecast peak stages, inundation extents, and evacuation lead times.
2. **Hydraulic Infrastructure Design:** Sizing spillways, bridges, barrages, culverts, and urban drainage networks based on design flood peaks.
3. **Water Allocation and Rights:** Managing reservoir releases, irrigation diversions, and inter-state river basin agreements.
4. **Hydrologic Model Calibration:** Tuning rainfall-runoff parameters in models like HEC-HMS and hydraulic models like HEC-RAS.

---

## 2. Measurement of River Stage

River stage is the vertical distance of the free water surface above an arbitrary or Mean Sea Level (MSL) datum:
$$\\text{Water Surface Elevation (RL)} = \\text{Datum RL} + \\text{Gauge Reading } (G)$$

\`\`\`
                         Bridge Pier / River Bank
                                |
               Staff Gauge      |
                   |===|        |
        Water      | 4 |        |
        Level ~~~~ |~~~| ~~~~~~ | ~~~~~~~~~~~~~~~~~ Free Water Surface
                   | 3 |        |
                   | 2 |        |
                   | 1 |        |
                   | 0 | <------+--- Zero of Gauge (Datum RL = 124.60 m MSL)
             ======+===+========+==== River Bed
\`\`\`

### Manual (Non-Recording) Gauges
1. **Vertical Staff Gauge:** Graduated enameled steel or ceramic plates bolted to bridge piers, retaining walls, or embedded piles. Read visually to the nearest millimeter ($1\\text{ mm}$).
2. **Sectional Staff Gauge:** When the river stage range exceeds $3\\text{--}4\\text{ meters}$ across an inclined river bank, separate staggered vertical gauges are installed across the cross-section.
3. **Inclined Staff Gauge:** Conforms directly to the slope of a stable river bank, graduated with magnified markings ($L = \\Delta h / \\sin \\theta$) for enhanced readability.
4. **Wire Weight Gauge:** Housed in a metal box on a bridge deck; a calibrated cable lowers a streamlined brass weight to the water surface; readings are taken on a geared drum counter.

### Automatic Continuous Stage Recorders
1. **Float-Type Stilling Well Recorder:** A float suspended in a vertical pipe or concrete well connected to the river via intake pipes to damp out surface wave action. Float motion drives a mechanical shaft encoder or digital data logger.
2. **Pneumatic Bubble Gauge (Bubbler):** Regulated dry nitrogen or compressed air is purged through a submerged orifice tube. The pressure required to push gas bubbles equals the hydrostatic water head ($p = \\rho g h$).
3. **Radar and Ultrasonic Non-Contact Sensors:** Mounted above the river deck looking downward; measures signal time-of-flight reflected from the water surface, unaffected by river debris or sediment burial.

---

## 3. Worked Numerical Examples

### Worked Example 28.1: Gauge Datum Conversion & Real-Time Stage

**Problem:** A river gauging station on the Cauvery basin has its gauge zero set at an arbitrary benchmark with $\\text{RL} = 124.60\\text{ m MSL}$. During a monsoon flood:
1. The staff gauge reading is observed as $3.45\\text{ m}$. Calculate the absolute water surface level (WSL) in meters above MSL.
2. If the river cross-section has a channel invert (lowest bed level) of $122.80\\text{ m MSL}$, calculate the maximum depth of flow in the river.

**Solution:**

**Step 1: Calculate Water Surface Level (WSL)**
$$\\text{WSL} = \\text{Datum RL} + G = 124.60\\text{ m} + 3.45\\text{ m} = 128.05\\text{ m MSL}$$

**Step 2: Calculate maximum flow depth ($y_{\\max}$)**
$$y_{\\max} = \\text{WSL} - \\text{Bed Level} = 128.05\\text{ m} - 122.80\\text{ m} = 5.25\\text{ m}$$

---

### Worked Example 28.2: Temperature & Density Correction for Bubbler Gauge

**Problem:** A pneumatic bubbler measures a back-pressure of $48.20\\text{ kPa}$ at the orifice. If river water temperature is $20^\\circ\\text{C}$ (density $\\rho = 998.2\\text{ kg/m}^3$, $g = 9.807\\text{ m/s}^2$):
1. Compute the water head above the orifice.
2. If the orifice is set at $\\text{RL} = 85.20\\text{ m MSL}$, find the river stage WSL.

**Solution:**
$$p = \\rho g h \\implies h = \\frac{p}{\\rho g} = \\frac{48{,}200\\text{ N/m}^2}{998.2\\text{ kg/m}^3 \\times 9.807\\text{ m/s}^2} = \\frac{48{,}200}{9789.3} = 4.924\\text{ m}$$
$$\\text{WSL} = 85.20\\text{ m} + 4.924\\text{ m} = 90.124\\text{ m MSL}$$

---

### Session 28 recap
1. Stage is elevation above a reference datum; discharge is volume per unit time.
2. Stilling wells damp out surface ripples for float gauges.
3. Bubbler gauges measure hydrostatic head via bubble back-pressure ($p = \\rho g h$).
4. Modern hydrometry relies heavily on non-contact radar level sensors connected to telemetry (India-WRIS / CWC).

<!--tab:In class-->

## In-Class Activities & Verification

### Activity 1: Datum Adjustment Check

A staff gauge has its zero at $\\text{RL} = 215.30\\text{ m MSL}$. During a cloudburst event, the stage reaches $4.70\\text{ m}$. Calculate the absolute water surface elevation in meters MSL.

\`\`\`check
WSL = 220.0 m
Tolerance: 0.1 m
Hint: WSL = 215.30 + 4.70 = 220.00 m MSL.
\`\`\`

### Activity 2: Pressure-to-Stage Calculation

A pressure transducer submerged in a reservoir measures hydrostatic pressure of $39.24\\text{ kPa}$ (take $\\rho = 1000\\text{ kg/m}^3, g = 9.81\\text{ m/s}^2$). Compute the water depth above the transducer in meters.

\`\`\`check
h = 4.0 m
Tolerance: 0.05 m
Hint: h = p / (rho * g) = 39240 / (1000 * 9.81) = 4.0 m.
\`\`\`

<!--tab:Software lab-->

## Lab Linkage: River Geometry in HEC-RAS

In **HEC-RAS**:
1. River reaches are delineated from downstream to upstream with Cross-Section Cut Lines.
2. Staff gauge locations correspond to surveyed **River Stations (RS)**.
3. Gauge zero elevations form the vertical datum for river cross-section station-elevation coordinates.

<!--tab:Practice-->

## Practice Quiz & Exam Questions

\`\`\`quiz
1. What is the primary function of a stilling well at a river gauging station?
* To eliminate wave action and turbulence for accurate float measurement
- To store flood water for chemical quality sampling
- To increase the velocity of water entering the intake pipe
- To measure sediment deposition at the bed

2. If a staff gauge zero is at RL 105.50 m MSL and the reading is 2.80 m, what is the water surface level?
* 108.30 m MSL
- 102.70 m MSL
- 105.50 m MSL
- 110.00 m MSL

3. Non-contact radar water level sensors operate on the principle of:
* Electromagnetic wave transit time reflected from the water surface
- Buoyancy force acting on a displaced cylindrical sinker
- Electrical conductivity between two immersed platinum electrodes
- Acoustic Doppler frequency shift from suspended silt particles
\`\`\`

### Examination Questions

:::exam[2-Mark Concept Questions]
1. Define **river stage** and state two types of non-recording gauges.
2. Explain why stilling wells are necessary for float-type stage recorders.
:::

:::exam[5-Mark Derivation]
Describe with a neat schematic the working principle of a pneumatic bubble gauge (bubbler) for stage measurement. State its advantages over a conventional stilling well installation in silt-laden rivers.
:::

:::exam[10-Mark Comprehensive Question]
Discuss the site selection criteria for establishing an ideal river gauging station. Explain the factors that govern section control versus channel control in natural streams.
:::

:::sol
Site selection criteria:
1. Stable channel geometry: rocky or cohesive non-erodible bed and stable banks free from shifting sand bars.
2. Straight reach: at least 4 to 5 channel widths upstream and downstream without major eddies or cross-currents.
3. Flow containment: high banks capable of confining peak historical floods without overbank bypass.
4. Freedom from backwater: situated well upstream of tributary confluences, reservoirs, or tidal estuaries.
5. Accessibility: accessible during extreme monsoon floods for current-meter gauging and telemetry maintenance.
Control mechanisms:
- Section control: a physical constriction (rapids, rock ledge, weir) that governs the stage-discharge relation at low to medium flows.
- Channel control: reach friction slope, cross-sectional area, and roughness governing stage-discharge relations at high flows.
:::
`;

// S29: Area-velocity method
u4["S29"] = `<!--tab:Theory-->

> [!note] Key ideas
> - The area-velocity method is the standard direct technique for measuring streamflow: $Q = \\sum a_i \\bar{v}_i$.
> - Velocity varies parabolically with depth: zero at bed, maximum slightly below the surface ($0.05d\\text{--}0.25d$).
> - Standard sampling depths: **single-point** method at $0.6d$ ($\\bar{v} \\approx v_{0.6}$); **two-point** method at $0.2d$ and $0.8d$ ($\\bar{v} = \\frac{v_{0.2} + v_{0.8}}{2}$).
> - Current meter equation: $v = a + b N$ (where $N$ is revolutions per second, $a$ is starting velocity, $b$ is propeller/cup pitch).
> - Discharge integration: **Mid-section method** and **Mean-section method** (IS:1192 / ISO 748).

## 1. Velocity Distribution in an Open Channel Vertical

Due to boundary shear along the bed and side banks and air drag at the free surface, velocity in an open channel vertical is non-uniform. Prandtl's boundary layer theory and logarithmic velocity distribution indicate:

$$\\frac{v(y)}{u_*} = \\frac{1}{\\kappa} \\ln\\left(\\frac{y}{y_0}\\right)$$

Empirical hydrometric rules (IS:1192):
1. The average velocity in any vertical occurs very closely at a depth of $0.6d$ from the free water surface (i.e., $0.4d$ above the river bed).
2. For depths greater than $0.6\\text{ m}$, the two-point average $\\frac{v_{0.2} + v_{0.8}}{2}$ gives superior accuracy.
3. During severe floods where deep sounding is hazardous, surface floats or surface velocity $v_s$ is measured, and mean velocity is estimated as $\\bar{v} = k \\cdot v_s$ (where $k \\approx 0.85$ to $0.90$).

\`\`\`
        Water Surface
          ~~~~+~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ y = d (v_s)
              |        .---'
              |      .'
        0.2d -|- - -o (v_0.2)
              |    /
        0.6d -|- -o (v_0.6 = mean velocity v_bar)
              |  /
        0.8d -|-o (v_0.8)
              |/
        ======+================================== Bed (v = 0)
              0      v_bar         v_max
\`\`\`

---

## 2. Current Meters

Mechanical current meters measure stream velocity via rotated elements:
1. **Vertical-Axis Cup Meter (Price Type AA):** Wheel of 6 conical cups rotating about a vertical axis. Highly robust, operates over $0.05\\text{ to } 5.0\\text{ m/s}$, but registers slight upward bias in turbulent vertical eddies.
2. **Horizontal-Axis Propeller Meter (Ott / Neyrpic):** Helical propeller rotating about a horizontal shaft aligned with streamline flow. Insensitive to vertical velocity components.

Calibration rating equation (obtained from towing tank tests):
$$v = a + b N$$
where $N = \\text{revolutions per second} = \\text{revs} / t$, $a$ is the mechanical starting friction velocity ($0.01\\text{--}0.05\\text{ m/s}$), and $b$ is the hydraulic pitch calibration constant.

---

## 3. Discharge Computation: Mid-Section vs Mean-Section

The river cross-section is subdivided into $n$ vertical strips ($n \\ge 15\\text{--}25$ such that no single strip carries $> 10\\%$ of total flow).

\`\`\`
   Station:  x_{i-1}       x_i        x_{i+1}
               |            |            |
               |            |            |
     ~~~~~~~~~~|~~~~~~~~~~~~|~~~~~~~~~~~~|~~~~~~~~~~ Water Surface
               |    b_i/2   |   b_i/2    |
               |  <-------> | <------->  |
               |            |            |
               |            | y_i        |
               |            | (Vertical) |
               +------------+------------+---------- Bed
               |<--------- W_i --------->|
\`\`\`

### Mid-Section Method (Standard Practice)
The strip width $W_i$ extends halfway to adjacent verticals:
$$W_i = \\frac{x_{i+1} - x_{i-1}}{2}$$
$$\\Delta A_i = W_i \\cdot y_i$$
$$\\Delta Q_i = \\Delta A_i \\cdot \\bar{v}_i = \\left(\\frac{x_{i+1} - x_{i-1}}{2}\\right) y_i \\bar{v}_i$$
$$Q = \\sum_{i=1}^{n} \\Delta Q_i$$

---

## 4. Worked Numerical Examples

### Worked Example 29.1: Current Meter Velocity & Segment Discharge

**Problem:** A current meter has the calibration equation $v = 0.05 + 0.35 N\\text{ (m/s)}$. At a vertical in a river sounding:
- The depth of flow is $y = 1.80\\text{ m}$.
- The meter placed at $0.6$ depth registers 40 revolutions in $50\\text{ seconds}$.
- Adjacent verticals are at distance $x_{i-1} = 12.0\\text{ m}$ and $x_{i+1} = 17.0\\text{ m}$ from the initial bank reference pin.
Compute the flow velocity and the incremental discharge $\\Delta Q_i$ contributed by this panel.

**Solution:**

**Step 1: Calculate velocity from rating equation**
$$N = \\frac{40\\text{ revs}}{50\\text{ s}} = 0.80\\text{ rev/s}$$
$$v = 0.05 + 0.35(0.80) = 0.05 + 0.28 = 0.33\\text{ m/s}$$

**Step 2: Calculate panel width $W_i$ and area $\\Delta A_i$**
$$W_i = \\frac{x_{i+1} - x_{i-1}}{2} = \\frac{17.0 - 12.0}{2} = \\frac{5.0}{2} = 2.50\\text{ m}$$
$$\\Delta A_i = W_i \\cdot y_i = 2.50\\text{ m} \\times 1.80\\text{ m} = 4.50\\text{ m}^2$$

**Step 3: Calculate incremental discharge $\\Delta Q_i$**
$$\\Delta Q_i = \\Delta A_i \\cdot v = 4.50\\text{ m}^2 \\times 0.33\\text{ m/s} = 1.485\\text{ m}^3\\text{/s}$$

---

### Worked Example 29.2: Two-Point Velocity Method Calculation

**Problem:** In a deep river vertical ($y = 4.20\\text{ m}$), current meter observations are taken at $0.2d$ and $0.8d$:
- At $0.2d$: 65 revolutions in $40\\text{ s}$
- At $0.8d$: 38 revolutions in $40\\text{ s}$
Using the rating equation $v = 0.04 + 0.32 N$, find the mean velocity in the vertical.

**Solution:**
$$N_{0.2} = \\frac{65}{40} = 1.625\\text{ rev/s} \\implies v_{0.2} = 0.04 + 0.32(1.625) = 0.04 + 0.520 = 0.560\\text{ m/s}$$
$$N_{0.8} = \\frac{38}{40} = 0.950\\text{ rev/s} \\implies v_{0.8} = 0.04 + 0.32(0.950) = 0.04 + 0.304 = 0.344\\text{ m/s}$$
$$\\bar{v} = \\frac{v_{0.2} + v_{0.8}}{2} = \\frac{0.560 + 0.344}{2} = \\frac{0.904}{2} = 0.452\\text{ m/s}$$

---

### Session 29 recap
1. Mean velocity in a vertical occurs at $0.6d$, or average of $0.2d$ and $0.8d$.
2. Current meter velocity: $v = a + b N$.
3. Mid-section method: $W_i = (x_{i+1} - x_{i-1})/2$, $Q = \\sum W_i y_i \\bar{v}_i$.
4. At least 15 to 25 verticals should be used for reliable discharge gauging.

<!--tab:In class-->

## In-Class Activities & Verification

### Activity 1: Current Meter Revolution Check

A current meter with $v = 0.06 + 0.30 N$ is placed at $0.6d$. It counts 75 revolutions in $60\\text{ seconds}$. Calculate the streamflow velocity in $\\text{m/s}$.

\`\`\`check
v = 0.435 m/s
Tolerance: 0.01 m/s
Hint: N = 75/60 = 1.25 rev/s. v = 0.06 + 0.30 * 1.25 = 0.435 m/s.
\`\`\`

### Activity 2: Mid-Section Strip Discharge

A vertical with depth $y = 2.2\\text{ m}$ and mean velocity $v = 0.65\\text{ m/s}$ is located between verticals at $x_{i-1} = 14\\text{ m}$ and $x_{i+1} = 20\\text{ m}$. Calculate the segment discharge $\\Delta Q$ in $\\text{m}^3\\text{/s}$.

\`\`\`check
Q_segment = 4.29 m3/s
Tolerance: 0.05 m3/s
Hint: W = (20 - 14)/2 = 3.0 m. Area = 3.0 * 2.2 = 6.6 m2. Q = 6.6 * 0.65 = 4.29 m3/s.
\`\`\`

<!--tab:Software lab-->

## Lab Linkage: Cross-Section Inflow in HEC-RAS

In **HEC-RAS Steady Flow Analysis**:
1. Enter the total gauged discharge $Q$ at the upstream river boundary.
2. Under **Cross Section Table Editor**, observe the velocity distribution plotted across left overbank, main channel, and right overbank.
3. Compare the computed cross-sectional mean velocity against measured current-meter data.

<!--tab:Practice-->

## Practice Quiz & Exam Questions

\`\`\`quiz
1. At what depth from the free water surface does the average velocity in a moderate stream vertical occur?
* 0.6 of the depth
- 0.2 of the depth
- 0.5 of the depth
- 0.8 of the depth

2. In the mid-section method of computing stream discharge, the effective width for vertical i is:
* (x_{i+1} - x_{i-1}) / 2
- (x_{i+1} - x_i)
- (x_i - x_{i-1})
- (x_{i+1} + x_{i-1}) / 2

3. What type of current meter rotates about a horizontal shaft aligned with streamlines?
* Propeller (Ott) current meter
- Price Type AA cup meter
- Pygmy cup meter
- Pitot tube
\`\`\`

### Examination Questions

:::exam[5-Mark Derivation]
Explain the mid-section method of computing river discharge from current-meter sounding data. Provide mathematical expressions and a cross-section sketch.
:::

:::exam[10-Mark Numerical]
A streamflow gauging survey across an alluvial river yields the following observations. The current meter rating equation is $v = 0.04 + 0.32 N\\text{ (m/s)}$:

| Distance from bank (m) | Depth (m) | Meter Depth | Revs | Time (s) |
|---|---|---|---|---|
| 0 (edge) | 0.0 | — | — | — |
| 3.0 | 1.2 | $0.6d$ | 36 | 50 |
| 6.0 | 2.0 | $0.2d$ <br> $0.8d$ | 60 <br> 40 | 50 <br> 50 |
| 9.0 | 1.8 | $0.6d$ | 45 | 50 |
| 12.0 (edge)| 0.0 | — | — | — |

Calculate the total river discharge $Q$ using the mid-section method.
:::

:::sol
1. **Vertical at $x = 3.0\\text{ m}$:**
   - $W = (6.0 - 0)/2 = 3.0\\text{ m}$. $y = 1.2\\text{ m}$. $A = 3.0 \\times 1.2 = 3.6\\text{ m}^2$.
   - $N = 36/50 = 0.72\\text{ rev/s} \\implies v = 0.04 + 0.32(0.72) = 0.2704\\text{ m/s}$.
   - $Q_1 = 3.6 \\times 0.2704 = 0.973\\text{ m}^3\\text{/s}$.
2. **Vertical at $x = 6.0\\text{ m}$:**
   - $W = (9.0 - 3.0)/2 = 3.0\\text{ m}$. $y = 2.0\\text{ m}$. $A = 3.0 \\times 2.0 = 6.0\\text{ m}^2$.
   - $N_{0.2} = 60/50 = 1.20 \\implies v_{0.2} = 0.04 + 0.32(1.2) = 0.424\\text{ m/s}$.
   - $N_{0.8} = 40/50 = 0.80 \\implies v_{0.8} = 0.04 + 0.32(0.8) = 0.296\\text{ m/s}$.
   - $\\bar{v} = (0.424 + 0.296)/2 = 0.360\\text{ m/s}$.
   - $Q_2 = 6.0 \\times 0.360 = 2.160\\text{ m}^3\\text{/s}$.
3. **Vertical at $x = 9.0\\text{ m}$:**
   - $W = (12.0 - 6.0)/2 = 3.0\\text{ m}$. $y = 1.8\\text{ m}$. $A = 3.0 \\times 1.8 = 5.4\\text{ m}^2$.
   - $N = 45/50 = 0.90 \\implies v = 0.04 + 0.32(0.9) = 0.328\\text{ m/s}$.
   - $Q_3 = 5.4 \\times 0.328 = 1.771\\text{ m}^3\\text{/s}$.
Total discharge $Q = 0.973 + 2.160 + 1.771 = 4.904\\text{ m}^3\\text{/s} \\approx 4.90\\text{ m}^3\\text{/s}$.
:::
`;

// S30: Slope-area method
u4["S30"] = `<!--tab:Theory-->

> [!note] Key ideas
> - The **slope-area method** is an indirect technique for calculating peak flood discharge after the flood has passed, utilizing high-water marks (HWM).
> - Based on Manning's open-channel uniform/gradually varied flow equation and the energy balance between two surveyed cross-sections.
> - Key reach criteria: uniform, straight reach (at least $4\\text{--}5$ channel widths), contracting rather than expanding, stable non-erodible bed.
> - Reach energy balance: $h_{f} = (Z_1 + Y_1 + \\alpha_1 \\frac{V_1^2}{2g}) - (Z_2 + Y_2 + \\alpha_2 \\frac{V_2^2}{2g})$.
> - Friction slope: $S_f = \\frac{h_f}{L}$, conveyance $K = \\frac{1}{n} A R^{2/3}$, discharge $Q = \\sqrt{K_1 K_2 S_f}$.

## 1. Principles of the Slope-Area Method

When extreme flash floods occur, direct current-meter gauging is often physically impossible due to dangerous floating debris, bridge submergence, or sudden event duration. After flood waters recede, survey teams identify mud marks, drift lines, and seeds lodged in trees (high-water marks) along both banks to reconstruct the peak water surface profile.

\`\`\`
       Section 1                                   Section 2
       +-------+                                   +-------+
       |   o   | <-------- HWM Elevation --------> |   o   |
       |  ~~~  |                                   |  ~~~  |
       |       | \\                                 |       |
       |       |  \\   Water Surface Fall (h_w)     |       |
       +-------+   \\-----------------------------> +-------+
         (A1)                  Reach Length L        (A2)
\`\`\`

---

## 2. Governing Energy & Flow Equations

For a selected river reach of length $L$ between Section 1 (upstream) and Section 2 (downstream):

1. **Total Energy Balance:**
$$H_1 = H_2 + h_L$$
$$(z_1 + y_1) + \\alpha_1 \\frac{V_1^2}{2g} = (z_2 + y_2) + \\alpha_2 \\frac{V_2^2}{2g} + h_f + h_e$$

Where:
- $(z_1 + y_1) = h_1$ = surveyed high-water mark elevation at Section 1
- $(z_2 + y_2) = h_2$ = surveyed high-water mark elevation at Section 2
- $h_w = h_1 - h_2$ = total fall in water surface elevation
- $h_f$ = reach energy head loss due to boundary friction
- $h_e = k \\left| \\alpha_1 \\frac{V_1^2}{2g} - \\alpha_2 \\frac{V_2^2}{2g} \\right|$ = eddy expansion/contraction loss ($k = 0.1$ for contracting reaches, $k = 0.3\\text{--}0.5$ for expanding reaches)

2. **Friction Head Loss ($h_f$):**
$$h_f = h_w + \\left(\\alpha_1 \\frac{V_1^2}{2g} - \\alpha_2 \\frac{V_2^2}{2g}\\right) - h_e$$
When velocity head differences are minor, $h_f \\approx h_w$.

3. **Conveyance ($K$):**
From Manning's equation $V = \\frac{1}{n} R^{2/3} S_f^{1/2}$:
$$Q = K \\sqrt{S_f} \\quad \\text{where } K = \\frac{1}{n} A R^{2/3}$$

For a non-uniform reach where Section 1 and Section 2 differ in area and hydraulic radius:
$$K_m = \\sqrt{K_1 K_2}$$
$$Q = K_m \\sqrt{S_f} = \\sqrt{K_1 K_2 \\cdot \\frac{h_f}{L}}$$

---

## 3. Worked Numerical Examples

### Worked Example 30.1: Peak Flood Discharge by Slope-Area Method

**Problem:** A post-flood survey on an ungauged mountain stream produces the following reach data:
- Reach length between sections: $L = 250\\text{ m}$
- High-water mark fall: $h_w = 0.45\\text{ m}$
- Section 1 (upstream): Area $A_1 = 85.0\\text{ m}^2$, wetted perimeter $P_1 = 35.4\\text{ m} \\implies R_1 = 2.40\\text{ m}$
- Section 2 (downstream): Area $A_2 = 75.0\\text{ m}^2$, wetted perimeter $P_2 = 35.7\\text{ m} \\implies R_2 = 2.10\\text{ m}$
- Channel bed Manning roughness: $n = 0.035$

Calculate the peak flood discharge $Q$ assuming uniform reach friction slope ($S_f \\approx h_w / L$).

**Solution:**

**Step 1: Compute conveyance at Section 1**
$$R_1^{2/3} = (2.40)^{0.6667} = 1.7928\\text{ m}^{2/3}$$
$$K_1 = \\frac{1}{n} A_1 R_1^{2/3} = \\frac{1}{0.035} \\times 85.0 \\times 1.7928 = 28.5714 \\times 152.388 = 4353.9\\text{ m}^3\\text{/s}$$

**Step 2: Compute conveyance at Section 2**
$$R_2^{2/3} = (2.10)^{0.6667} = 1.6399\\text{ m}^{2/3}$$
$$K_2 = \\frac{1}{n} A_2 R_2^{2/3} = \\frac{1}{0.035} \\times 75.0 \\times 1.6399 = 28.5714 \\times 122.993 = 3514.1\\text{ m}^3\\text{/s}$$

**Step 3: Mean reach conveyance $K_m$**
$$K_m = \\sqrt{K_1 \\cdot K_2} = \\sqrt{4353.9 \\times 3514.1} = \\sqrt{15{,}300{,}040} = 3911.5\\text{ m}^3\\text{/s}$$

**Step 4: Compute friction slope and discharge**
$$S_f = \\frac{h_w}{L} = \\frac{0.45\\text{ m}}{250\\text{ m}} = 0.0018$$
$$\\sqrt{S_f} = \\sqrt{0.0018} = 0.042426$$
$$Q = K_m \\sqrt{S_f} = 3911.5 \\times 0.042426 = 165.95\\text{ m}^3\\text{/s} \\approx 166.0\\text{ m}^3\\text{/s}$$

---

### Session 30 recap
1. The slope-area method estimates peak discharge indirectly from high-water marks.
2. Conveyance $K = (1/n) A R^{2/3}$; geometric mean $K_m = \\sqrt{K_1 K_2}$.
3. Discharge equation: $Q = K_m \\sqrt{h_f / L}$.
4. Contracting reaches minimize eddy energy head loss ($h_e$).

<!--tab:In class-->

## In-Class Activities & Verification

### Activity 1: Conveyance Calculation Check

A channel section has area $A = 60\\text{ m}^2$, hydraulic radius $R = 2.0\\text{ m}$, and $n = 0.030$. Compute the section conveyance $K$ in $\\text{m}^3\\text{/s}$. ($2.0^{2/3} = 1.5874$).

\`\`\`check
K = 3174.8 m3/s
Tolerance: 5.0 m3/s
Hint: K = (1/0.030) * 60 * 1.5874 = 3174.8 m3/s.
\`\`\`

### Activity 2: Peak Discharge Check

Given reach conveyance $K_m = 4000\\text{ m}^3\\text{/s}$, fall $h_f = 0.50\\text{ m}$, and reach length $L = 200\\text{ m}$. Compute the peak discharge $Q$ in $\\text{m}^3\\text{/s}$.

\`\`\`check
Q = 200.0 m3/s
Tolerance: 1.0 m3/s
Hint: Q = K_m * sqrt(h_f / L) = 4000 * sqrt(0.50 / 200) = 4000 * 0.050 = 200.0 m3/s.
\`\`\`

<!--tab:Software lab-->

## Lab Linkage: HEC-RAS Steady Flow Slope-Area Calibration

In **HEC-RAS**:
1. High-water marks are imported as observed water surface profiles.
2. In the **Steady Flow Simulation**, run trials adjusting Manning's $n$ until computed water surface elevations match surveyed marks within $\\pm 5\\text{ cm}$.

<!--tab:Practice-->

## Practice Quiz & Exam Questions

\`\`\`quiz
1. Why is a contracting reach preferred over an expanding reach in a slope-area survey?
* Contracting reaches have negligible eddy and separation energy losses
- Expanding reaches cause negative Manning roughness values
- Flow in contracting reaches is always supercritical
- High-water marks disappear in contracting reaches

2. The geometric mean conveyance for a reach with section conveyances K1 and K2 is:
* sqrt(K1 * K2)
- (K1 + K2) / 2
- 2 * K1 * K2 / (K1 + K2)
- K1 * K2 / (K1 + K2)

3. In a slope-area computation, if upstream velocity head is significantly higher than downstream velocity head, the friction head h_f is:
* Greater than the water surface fall h_w
- Smaller than the water surface fall h_w
- Equal to zero
- Independent of reach length
\`\`\`

### Examination Questions

:::exam[5-Mark Derivation]
Derive the slope-area equation $Q = \\sqrt{K_1 K_2 S_f}$ from the one-dimensional energy equation for gradually varied flow.
:::

:::exam[10-Mark Numerical]
During a flash flood, high-water marks surveyed along a uniform 300 m river reach show an upstream elevation of 145.80 m MSL and a downstream elevation of 145.20 m MSL ($h_w = 0.60$ m). The average channel cross-section has area $A = 110\\text{ m}^2$, wetted perimeter $P = 42\\text{ m}$, and Manning $n = 0.032$. Calculate the peak flood discharge $Q$.
:::

:::sol
1. Hydraulic radius $R = A / P = 110 / 42 = 2.619\\text{ m}$.
2. $R^{2/3} = (2.619)^{0.6667} = 1.9004\\text{ m}^{2/3}$.
3. Conveyance $K = \\frac{1}{n} A R^{2/3} = \\frac{1}{0.032} \\times 110 \\times 1.9004 = 31.25 \\times 209.044 = 6532.6\\text{ m}^3\\text{/s}$.
4. Reach slope $S_f = \\frac{h_w}{L} = \\frac{0.60}{300} = 0.0020$.
5. Peak discharge $Q = K \\sqrt{S_f} = 6532.6 \\times \\sqrt{0.0020} = 6532.6 \\times 0.044721 = 292.15\\text{ m}^3\\text{/s} \\approx 292.2\\text{ m}^3\\text{/s}$.
:::
`;

// S31: Rating curve
u4["S31"] = `<!--tab:Theory-->

> [!note] Key ideas
> - A stage-discharge rating curve transforms continuous river stage records ($G$) into continuous streamflow hydrographs ($Q$).
> - Standard power equation: $Q = C_r (G - a)^b$, where $G$ is stage, $a$ is stage of zero flow (SZF), and $C_r, b$ are empirical calibration constants.
> - The exponent $b$ typically ranges from $1.3\\text{ to } 1.8$ for section control and $1.6\\text{ to } 2.5$ for channel control.
> - Finding the gauge zero datum correction $a$: arithmetic plotting, running 3-point trial, or non-linear optimization.
> - Logarithmic transformation linearizes the relationship: $\\ln Q = \\ln C_r + b \\ln(G - a)$.

## 1. Physical Basis of the Stage-Discharge Relation

At any stable river cross-section, the discharge is governed by hydraulic controls:
1. **Section Control:** A localized natural rock ledge, rapids, gravel riffle, or artificial weir downstream of the gauge. Controls low-to-medium flows with a distinct critical or subcritical threshold.
2. **Channel Control:** Reach resistance, channel friction slope, and channel storage controlling high and flood stages where downstream constrictions are drowned out.

\`\`\`
       Q (m3/s)
          ^                         .---' High flows (Channel control, b ~ 2.0)
          |                       .'
          |                     .'
          |                   .'  Medium flows
          |                 .'
          |          .-----' Low flows (Section control, b ~ 1.5)
          +---------+-------------------------> G (Stage, m)
          0         a (Stage of Zero Flow)
\`\`\`

---

## 2. Mathematical Rating Formulation

The general power-law equation is:
$$Q = C_r (G - a)^b$$

Where:
- $G$ = observed river stage (m)
- $a$ = gauge reading corresponding to zero streamflow (m)
- $(G - a)$ = effective hydraulic head (m)
- $C_r$ = rating coefficient reflecting channel width and bed roughness
- $b$ = rating exponent

Taking natural logarithms on both sides:
$$\\ln Q = \\ln C_r + b \\ln(G - a)$$
Plotting $\\ln Q$ against $\\ln(G - a)$ produces a straight line of slope $b$ and intercept $\\ln C_r$.

### Determination of Zero-Flow Stage $a$
If $a$ is selected incorrectly:
- If $a$ is assumed too small $\\implies$ curve on log-log paper is concave downwards.
- If $a$ is assumed too large $\\implies$ curve on log-log paper is concave upwards.
- When $a$ is correct $\\implies$ data points align into a straight line.

---

## 3. Worked Numerical Examples

### Worked Example 31.1: Discharge Estimation from Calibrated Rating Curve

**Problem:** A gauging station on the Krishna river has a calibrated rating equation:
$$Q = 18.50 (G - 1.20)^{1.75} \\quad [Q \\text{ in } \\text{m}^3\\text{/s}, G \\text{ in m}]$$
1. Identify the stage of zero flow (SZF).
2. Calculate the discharge when the observed gauge reading is $G = 4.50\\text{ m}$.
3. What gauge reading corresponds to a flood discharge of $300\\text{ m}^3\\text{/s}$?

**Solution:**

**Step 1: Stage of zero flow**
When $Q = 0$, $G - a = 0 \\implies a = 1.20\\text{ m}$.

**Step 2: Discharge at $G = 4.50\\text{ m}$**
$$G - a = 4.50 - 1.20 = 3.30\\text{ m}$$
$$Q = 18.50 \\times (3.30)^{1.75}$$
$$\\ln(3.30) = 1.19392 \\implies (3.30)^{1.75} = e^{1.75 \\times 1.19392} = e^{2.08936} = 8.0797$$
$$Q = 18.50 \\times 8.0797 = 149.47\\text{ m}^3\\text{/s} \\approx 149.5\\text{ m}^3\\text{/s}$$

**Step 3: Stage corresponding to $Q = 300\\text{ m}^3\\text{/s}$**
$$(G - 1.20)^{1.75} = \\frac{300}{18.50} = 16.216$$
$$G - 1.20 = (16.216)^{1 / 1.75} = (16.216)^{0.5714} = 4.938\\text{ m}$$
$$G = 1.20 + 4.938 = 6.138\\text{ m} \\approx 6.14\\text{ m}$$

---

### Worked Example 31.2: Log-Log Regression for Rating Exponent

**Problem:** Gauging observations at a mountain weir station give:
- Point 1: $G_1 = 1.80\\text{ m}$, $Q_1 = 8.0\\text{ m}^3\\text{/s}$
- Point 2: $G_2 = 3.20\\text{ m}$, $Q_2 = 45.0\\text{ m}^3\\text{/s}$
Given that the crest elevation gives $a = 1.00\\text{ m}$, calculate the rating parameters $C_r$ and $b$.

**Solution:**
Effective heads: $h_1 = 1.80 - 1.00 = 0.80\\text{ m}$; $h_2 = 3.20 - 1.00 = 2.20\\text{ m}$.
$$\\frac{Q_2}{Q_1} = \\left(\\frac{h_2}{h_1}\\right)^b \\implies \\frac{45.0}{8.0} = 5.625 = \\left(\\frac{2.20}{0.80}\\right)^b = (2.75)^b$$
$$b = \\frac{\\ln(5.625)}{\\ln(2.75)} = \\frac{1.7272}{1.0116} = 1.707$$
$$C_r = \\frac{Q_1}{(h_1)^b} = \\frac{8.0}{(0.80)^{1.707}} = \\frac{8.0}{0.6830} = 11.71$$
The rating equation is $Q = 11.71 (G - 1.00)^{1.71}$.

---

### Session 31 recap
1. Rating curves convert continuous stage records to discharge.
2. Form: $Q = C_r (G - a)^b$.
3. $a$ is the stage of zero flow (SZF); $(G - a)$ is effective head.
4. Log-linearization allows parameter determination via least squares regression.

<!--tab:In class-->

## In-Class Activities & Verification

### Activity 1: Discharge Computation from Rating Curve

A rating curve is $Q = 25.0 (G - 0.80)^{1.60}$. When the river stage reaches $G = 3.80\\text{ m}$, calculate the stream discharge in $\\text{m}^3\\text{/s}$. ($3.0^{1.60} = 5.7995$).

\`\`\`check
Q = 145.0 m3/s
Tolerance: 1.0 m3/s
Hint: Effective head = 3.80 - 0.80 = 3.0 m. Q = 25.0 * (3.0)^1.60 = 25.0 * 5.7995 = 144.99 m3/s.
\`\`\`

### Activity 2: Effective Head Verification

A river station records $Q = 80.0\\text{ m}^3\\text{/s}$ with rating equation $Q = 20.0 (G - a)^{1.50}$. Find the effective head $(G - a)$ in meters. ($(80/20)^{2/3} = 4^{2/3} = 2.5198$).

\`\`\`check
h_eff = 2.52 m
Tolerance: 0.05 m
Hint: (G - a)^1.50 = 80/20 = 4.0. Effective head = 4^(1/1.5) = 4^(0.6667) = 2.52 m.
\`\`\`

<!--tab:Software lab-->

## Lab Linkage: Rating Curve Downstream Boundary in HEC-RAS

In **HEC-RAS Steady Flow Boundary Conditions**:
1. Select the most downstream river cross-section.
2. Choose **Rating Curve** as the external boundary condition.
3. Paste the stage-discharge pairs computed from the calibrated rating curve to prevent artificial backwater reflection during simulation.

<!--tab:Practice-->

## Practice Quiz & Exam Questions

\`\`\`quiz
1. What does the parameter 'a' represent in the rating equation Q = Cr(G - a)^b?
* The river stage corresponding to zero flow
- The average depth of the river channel
- The Manning roughness coefficient of the bed
- The elevation of the high-water mark

2. On a log-log plot of Q versus (G - a), if the plotted line curves downwards, it implies:
* The assumed value of 'a' is too small
- The assumed value of 'a' is too large
- The flow is supercritical
- The current meter was improperly calibrated

3. What is the typical value range of the rating exponent b for section control?
* 1.3 to 1.8
- 0.5 to 0.8
- 2.8 to 3.5
- 4.0 to 5.0
\`\`\`

### Examination Questions

:::exam[2-Mark Concept Questions]
1. State the stage-discharge rating equation and define each term.
2. What is meant by 'stage of zero flow' (SZF)?
:::

:::exam[5-Mark Derivation]
Explain how the stage of zero flow $a$ in $Q = C_r (G - a)^b$ is determined using the graphical trial-and-error method on log-log paper.
:::

:::exam[10-Mark Comprehensive Question]
Discuss section control versus channel control in open streams. Explain the factors that cause rating curves to shift over time, and describe how hydrologists adjust for seasonal shifts.
:::

:::sol
Section vs Channel Control:
- Section control occurs at low to medium stages where a physical constriction (weir, ledge, rapids) dictates critical or near-critical flow, establishing a stable, localized stage-discharge relation ($b \\approx 1.3\\text{--}1.8$).
- Channel control occurs at higher flood stages where section controls drown out, and the stage-discharge relation is governed by reach friction, bed slope, and channel cross-sectional area over a long reach ($b \\approx 1.6\\text{--}2.5$).
Causes of Rating Curve Shifts:
1. Aggradation / Scour: Monsoon bed degradation lowers the stage for a given discharge; post-flood silt deposition raises the stage.
2. Aquatic Vegetation: Summer weed growth increases Manning's $n$, producing higher stages for the same flow.
3. Dredging and Gravel Mining: Artificial lowering of bed levels.
4. Backwater Effects: Backwater from downstream dams or tributary floods causes loop rating curves.
Adjustment: Hydrologists establish seasonal shift curves or apply stage adjustments $\\Delta G$ to observed stages before reading discharge from the master rating table.
:::
`;

// S32: Flood routing and shifting controls
u4["S32"] = `<!--tab:Theory-->

> [!note] Key ideas
> - Shifting controls occur when riverbed scour, sedimentation, or weed growth alter the physical stage-discharge relationship over time.
> - During unsteady flood wave propagation, a **loop rating curve (hysteresis)** forms: discharge on the rising limb is higher than on the falling limb for the exact same stage.
> - Surface water slope is steeper during the rising limb ($S_w > S_0$) and flatter during the falling limb ($S_w < S_0$).
> - **Jones Formula** computes true unsteady discharge from steady rating discharge: $Q = Q_n \\sqrt{1 + \\frac{1}{S_0 c} \\frac{\\partial h}{\\partial t}}$.
> - Backwater from downstream tributary inflows or reservoirs creates variable backwater loops.

## 1. Loop Rating Curves (Hysteresis)

Under steady uniform flow, the energy gradient equals the bed slope ($S_f = S_0$). However, during the passage of a flood wave:
$$\\frac{\\partial h}{\\partial x} = -\\frac{1}{c} \\frac{\\partial h}{\\partial t}$$
Where $c = \\frac{dQ}{dA} \\approx 1.3\\text{--}1.6 v$ is the flood wave celerity.

Water surface slope:
$$S_w = S_0 - \\frac{\\partial h}{\\partial x} = S_0 + \\frac{1}{c} \\frac{\\partial h}{\\partial t}$$

- **Rising Limb:** Stage is increasing ($\\frac{\\partial h}{\\partial t} > 0$) $\\implies S_w > S_0 \\implies$ velocity and discharge are higher.
- **Falling Limb:** Stage is falling ($\\frac{\\partial h}{\\partial t} < 0$) $\\implies S_w < S_0 \\implies$ velocity and discharge are lower.

\`\`\`
       Stage G
          ^                     Peak Stage
          |                         *
          |                      . ' \\
          |                    .'     \\
          |    Rising Limb   .'         \\  Falling Limb
          |   (dh/dt > 0)  .'            \\ (dh/dt < 0)
          |              .'                \\
          |             * Peak Discharge     *
          +---------------------------------------------> Q (Discharge)
\`\`\`

---

## 2. The Jones Formula for Unsteady Flood Correction

The actual unsteady discharge $Q$ is related to the normal (steady-state) rating curve discharge $Q_n$ by:

$$Q = Q_n \\sqrt{1 + \\frac{1}{S_0 c} \\frac{\\partial h}{\\partial t}}$$

Where:
- $Q_n$ = normal discharge read from the steady rating curve at observed stage $G$
- $S_0$ = longitudinal bed slope of the river reach
- $c$ = kinematic flood wave celerity (m/s)
- $\\frac{\\partial h}{\\partial t}$ = rate of change of river stage (m/s or converted from m/h)

---

## 3. Worked Numerical Examples

### Worked Example 32.1: Jones Formula Unsteady Flood Discharge

**Problem:** A gauging station on the Godavari river has a longitudinal bed slope $S_0 = 0.0010$ ($1\\text{ in } 1000$). At a stage of $G = 5.0\\text{ m}$, the steady rating curve gives $Q_n = 220.0\\text{ m}^3\\text{/s}$.
During a severe monsoon flood, the stage is observed to be rising at a rate of $0.15\\text{ m/hour}$.
Assuming an average flood wave celerity $c = 2.0\\text{ m/s}$:
1. Compute the actual unsteady discharge passing the gauging station.
2. What is the percentage difference compared to the steady rating curve?

**Solution:**

**Step 1: Convert rate of stage change to $\\text{m/s}$**
$$\\frac{\\partial h}{\\partial t} = \\frac{0.15\\text{ m}}{3600\\text{ s}} = 4.1667 \\times 10^{-5}\\text{ m/s}$$

**Step 2: Compute dimensionless unsteady correction factor**
$$\\frac{1}{S_0 c} \\frac{\\partial h}{\\partial t} = \\frac{4.1667 \\times 10^{-5}}{0.0010 \\times 2.0} = \\frac{4.1667 \\times 10^{-5}}{0.0020} = 0.020833$$

**Step 3: Calculate corrected discharge $Q$**
$$Q = Q_n \\sqrt{1 + 0.020833} = 220.0 \\times \\sqrt{1.020833} = 220.0 \\times 1.01036 = 222.28\\text{ m}^3\\text{/s} \\approx 222.3\\text{ m}^3\\text{/s}$$

**Step 4: Percentage difference**
$$\\text{Diff} = \\frac{222.3 - 220.0}{220.0} \\times 100\\% = +1.04\\%$$

---

### Worked Example 32.2: Falling Limb Discharge Correction

**Problem:** At the same station during flood recession, the stage is at $G = 5.0\\text{ m}$ ($Q_n = 220.0\\text{ m}^3\\text{/s}$), but stage is falling at $0.12\\text{ m/hour}$. Compute the actual discharge.

**Solution:**
$$\\frac{\\partial h}{\\partial t} = -\\frac{0.12}{3600} = -3.3333 \\times 10^{-5}\\text{ m/s}$$
$$\\frac{1}{S_0 c} \\frac{\\partial h}{\\partial t} = \\frac{-3.3333 \\times 10^{-5}}{0.0020} = -0.016667$$
$$Q = 220.0 \\times \\sqrt{1 - 0.016667} = 220.0 \\times \\sqrt{0.983333} = 220.0 \\times 0.99163 = 218.16\\text{ m}^3\\text{/s} \\approx 218.2\\text{ m}^3\\text{/s}$$

---

### Session 32 recap
1. Loop rating curves arise from unsteady flood wave propagation.
2. Rising limb has steeper hydraulic slope, producing higher discharge than the falling limb at the same stage.
3. Jones formula adjusts steady rating discharges for rate of change of stage $\\partial h / \\partial t$.
4. Peak discharge occurs before peak stage at any river cross-section.

<!--tab:In class-->

## In-Class Activities & Verification

### Activity 1: Jones Formula Rising Limb Check

A stream with bed slope $S_0 = 0.0012$ and wave celerity $c = 1.8\\text{ m/s}$ has steady rating discharge $Q_n = 150.0\\text{ m}^3\\text{/s}$. During a flood, stage is rising at $0.20\\text{ m/h}$ ($5.556 \\times 10^{-5}\\text{ m/s}$). Compute the actual discharge $Q$ in $\\text{m}^3\\text{/s}$.

\`\`\`check
Q = 151.9 m3/s
Tolerance: 0.2 m3/s
Hint: Correction = (5.556e-5) / (0.0012 * 1.8) = 0.02572. Q = 150 * sqrt(1 + 0.02572) = 150 * 1.01278 = 151.92 m3/s.
\`\`\`

<!--tab:Software lab-->

## Lab Linkage: Unsteady Flow Modeling in HEC-RAS

In **HEC-RAS Unsteady Flow Analysis**:
1. Apply an upstream inflow hydrograph and downstream normal depth boundary condition.
2. Run the unsteady simulation and plot the **Stage and Flow Hydrograph** at an intermediate cross-section.
3. Inspect the resulting Stage-Discharge plot to observe the computed hysteresis loop.

<!--tab:Practice-->

## Practice Quiz & Exam Questions

\`\`\`quiz
1. Why does peak discharge occur before peak stage during the passage of a flood wave?
* Because water surface slope is steeper on the rising limb than at peak stage
- Because channel roughness drops to zero at the crest
- Because river width narrows during the peak
- Because sediment deposition raises the river bed

2. In the Jones formula, if the river stage is rapidly rising (dh/dt > 0), the actual discharge is:
* Greater than the steady-state rating discharge
- Less than the steady-state rating discharge
- Equal to the steady-state rating discharge
- Zero

3. What causes a loop rating curve at a river station?
* Unsteady flow and variable water surface slope during flood wave passage
- Errors in reading the staff gauge
- Changes in water temperature between night and day
- Variations in atmospheric pressure
\`\`\`

### Examination Questions

:::exam[5-Mark Derivation]
Derive the Jones formula $Q = Q_n \\sqrt{1 + \\frac{1}{S_0 c} \\frac{\\partial h}{\\partial t}}$ by considering the variable water surface slope during unsteady flood flow.
:::

:::exam[10-Mark Comprehensive]
Explain the phenomenon of hysteresis in stage-discharge relationships. Draw neat sketches illustrating:
1. The flood hydrograph showing time of peak discharge versus time of peak stage.
2. The loop rating curve highlighting rising limb, falling limb, and steady rating curve.
:::

:::sol
1. Hysteresis Phenomenon:
During a flood, as the flood wave approaches, the water surface slope $S_w = S_0 + \\frac{1}{c} \\frac{\\partial h}{\\partial t}$ exceeds bed slope $S_0$. From Manning's formula $Q \\propto \\sqrt{S_w}$, discharge is larger for a given stage on the rising limb than on the falling limb.
2. Timing:
Peak discharge occurs when the product of area and velocity is maximized, which occurs while stage is still rising. Hence $t(Q_{\\max}) < t(G_{\\max})$.
3. Loop curve:
The loop plots stage $G$ on the y-axis vs discharge $Q$ on the x-axis. The rising limb forms the lower curve (or right-hand branch in terms of higher flow for the same stage), while the falling limb forms the upper/left branch.
:::
`;

// S33: Dilution gauging and advanced hydrometry
u4["S33"] = `<!--tab:Theory-->

> [!note] Key ideas
> - Dilution gauging is an absolute chemical method ideal for turbulent, boulder-strewn mountain rivers where area-velocity cannot be applied.
> - Methods: **Constant-rate injection** (steady plateau) and **Sudden slug injection** (integration).
> - Tracers must be conservative, non-toxic, highly soluble, and detectable at low concentrations (e.g., Sodium Chloride NaCl, Rhodamine WT).
> - Acoustic Doppler Current Profiler (ADCP) measures water velocity across multiple depth bins using the Doppler shift of backscattered acoustic pulses.
> - Electromagnetic methods measure induced electromotive force as conducting water cuts Earth's or artificial magnetic fields.

## 1. Principles of Dilution Gauging

In high-gradient mountain streams, turbulent cascades, and rocky gorges, cross-sectional boundaries are irregular, and flow velocities are too turbulent for current meters. Dilution gauging requires no cross-sectional area or stage measurement.

\`\`\`
       Injection Point (q, C1)
             |
             v
       ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Flow Q (C0)
                |                               |
                | <--- Mixing Reach Lm --->     |
                |                               v
                                          Sampling Point (Plateau Conc C2)
\`\`\`

### 1. Constant-Rate Injection Method
A tracer solution of concentration $C_1$ is continuously injected at a constant flow rate $q$. At a downstream cross-section beyond the complete mixing length $L_m$, the concentration reaches a steady equilibrium plateau $C_2$.

Conservation of mass:
$$Q C_0 + q C_1 = (Q + q) C_2$$
$$Q (C_2 - C_0) = q (C_1 - C_2)$$
$$Q = q \\left(\\frac{C_1 - C_2}{C_2 - C_0}\\right)$$

Since $C_1 \\gg C_2$ and $C_2 \\gg C_0$:
$$Q \\approx q \\frac{C_1}{C_2}$$

### 2. Sudden Slug Injection (Integration Method)
A known mass $M$ of tracer is dumped suddenly into the river. Downstream, tracer concentration $C(t)$ is integrated over time:
$$M = \\int_0^\\infty Q (C(t) - C_0) dt = Q \\int_0^\\infty (C(t) - C_0) dt$$
$$Q = \\frac{M}{\\int_0^\\infty (C(t) - C_0) dt}$$

---

## 2. Advanced Hydrometry: ADCP

The Acoustic Doppler Current Profiler (ADCP) emits high-frequency acoustic pings (300 kHz to 3 MHz) from 4 diverging transducers.
1. Sound reflects off suspended sediment and plankton moving with the water.
2. The Doppler shift $\\Delta f = 2 f_0 \\frac{v}{c} \\cos \\theta$ yields water velocity relative to the instrument.
3. Bottom tracking or GPS measures instrument movement across the river transect.
4. Total discharge is integrated across 30 to 100 vertical depth cells (bins).

---

## 3. Worked Numerical Examples

### Worked Example 33.1: Constant-Rate Injection Discharge

**Problem:** A constant-rate dilution gauging test is performed on a turbulent stream:
- Injection rate of NaCl solution: $q = 0.0020\\text{ m}^3\\text{/s}$ ($2.0\\text{ L/s}$)
- Stock tracer concentration: $C_1 = 250.0\\text{ g/L}$
- Background river salinity: $C_0 = 0.010\\text{ g/L}$
- Downstream plateau concentration: $C_2 = 0.060\\text{ g/L}$
Compute the streamflow discharge $Q$ in $\\text{m}^3\\text{/s}$.

**Solution:**
$$Q = q \\left(\\frac{C_1 - C_2}{C_2 - C_0}\\right)$$
$$C_1 - C_2 = 250.0 - 0.060 = 249.94\\text{ g/L}$$
$$C_2 - C_0 = 0.060 - 0.010 = 0.050\\text{ g/L}$$
$$Q = 0.0020 \\times \\left(\\frac{249.94}{0.050}\\right) = 0.0020 \\times 4998.8 = 9.9976\\text{ m}^3\\text{/s} \\approx 10.0\\text{ m}^3\\text{/s}$$

---

### Worked Example 33.2: Slug Injection Integration Method

**Problem:** A slug of $M = 5.0\\text{ kg}$ Rhodamine WT dye is dumped into a stream. Downstream fluorometer readings yield an area under the concentration-time curve $\\int (C - C_0) dt = 250\\text{ (mg/L)} \\cdot \\text{s}$. Compute the stream discharge.

**Solution:**
$$M = 5.0\\text{ kg} = 5{,}000{,}000\\text{ mg}$$
$$\\int (C - C_0) dt = 250\\text{ mg}\\cdot\\text{s/L} = 250 \\times 10^3\\text{ mg}\\cdot\\text{s/m}^3 = 250{,}000\\text{ mg}\\cdot\\text{s/m}^3$$
$$Q = \\frac{M}{\\int (C - C_0) dt} = \\frac{5{,}000{,}000\\text{ mg}}{250{,}000\\text{ mg}\\cdot\\text{s/m}^3} = 20.0\\text{ m}^3\\text{/s}$$

---

### Session 33 recap
1. Dilution gauging is independent of cross-sectional area and bed geometry.
2. Constant rate: $Q = q (C_1 - C_2)/(C_2 - C_0)$.
3. Slug injection: $Q = M / \\int (C - C_0) dt$.
4. ADCP uses acoustic Doppler shift across 4 beams for rapid 3D velocity profiling.

<!--tab:In class-->

## In-Class Activities & Verification

### Activity 1: Constant-Rate Dilution Check

In a dilution test, $q = 0.001\\text{ m}^3\\text{/s}$, $C_1 = 200\\text{ g/L}$, downstream plateau $C_2 = 0.05\\text{ g/L}$, background $C_0 = 0.0\\text{ g/L}$. Compute $Q$ in $\\text{m}^3\\text{/s}$.

\`\`\`check
Q = 3.999 m3/s
Tolerance: 0.01 m3/s
Hint: Q = 0.001 * (200 - 0.05) / 0.05 = 0.001 * 3999 = 3.999 m3/s.
\`\`\`

<!--tab:Software lab-->

## Lab Linkage: River Calibration with Field Data

In **HEC-RAS**:
1. Take discharges computed from dilution gauging or ADCP transects.
2. Compare them against the steady flow rating curve table to verify Manning's $n$ calibration.

<!--tab:Practice-->

## Practice Quiz & Exam Questions

\`\`\`quiz
1. In dilution gauging by constant-rate injection, what condition must be met at the sampling point?
* Complete cross-sectional mixing of the tracer
- Laminar flow conditions
- Zero background tracer concentration
- Supercritical flow velocity

2. What principle does an ADCP use to measure streamflow velocity?
* Doppler shift of acoustic sound waves reflected by moving suspended particles
- Pressure differential across an orifice plate
- Electrical resistance between two submerged copper wires
- Time of transit of electromagnetic surface waves

3. Which of the following tracers is widely used in fluorescent dilution gauging?
* Rhodamine WT
- Sodium hydroxide
- Hydrochloric acid
- Calcium carbonate
\`\`\`

### Examination Questions

:::exam[5-Mark Derivation]
Derive the discharge formula $Q = q \\frac{C_1 - C_2}{C_2 - C_0}$ for the constant-rate injection dilution method using conservation of tracer mass.
:::

:::exam[10-Mark Comprehensive]
Explain the working principle of an Acoustic Doppler Current Profiler (ADCP) for streamflow measurement. Discuss its advantages, limitations, and operational steps during boat-mounted river transects.
:::

:::sol
ADCP Principle:
1. Emits acoustic pulses along 4 beams angled at 20°–30° from the vertical.
2. Sound scatters off moving suspended particles; the frequency shift $\\Delta f$ gives velocity along each beam.
3. Coordinate transformation converts beam velocities into 3D Cartesian vectors $(u, v, w)$.
4. Instrument velocity is tracked relative to the river bed (bottom tracking) or via DGPS.
5. Discharge is computed as $Q = \\int_0^T \\int_0^d (\\vec{v} \\times \\vec{v}_b) \\cdot \\vec{k} \\, dz \\, dt$.
Advantages:
- Gauges entire cross-section in 3–5 minutes.
- Measures velocity profile continuously from water surface to bed.
- Replaces tedious sounding weights and multiple point current-meter soundings.
Limitations:
- Blanking distance near transducer head and bottom acoustic side-lobe interference (top and bottom 6% cannot be measured directly).
- Moving bed conditions in sand-bed rivers during floods require DGPS tracking.
:::
`;

// S34: Flood frequency analysis principles
u4["S34"] = `<!--tab:Theory-->

> [!note] Key ideas
> - Return period ($T$ in years) is the average recurrence interval between flood events equal to or exceeding a given magnitude.
> - Exceedance probability: $P = 1/T$; non-exceedance probability: $q = 1 - P = 1 - 1/T$.
> - **Hydrologic Risk ($R$):** The probability that a flood with return period $T$ will be equaled or exceeded at least once during the design life of $n$ years:
>   $$R = 1 - (1 - P)^n = 1 - \\left(1 - \\frac{1}{T}\\right)^n$$
> - Annual Maximum Series (AMS) vs Partial Duration Series (PDS / POT).
> - Plotting positions: Weibull $P = \\frac{m}{N+1}$, Hazen $P = \\frac{m - 0.5}{N}$, Gringorten $P = \\frac{m - 0.44}{N + 0.12}$.

## 1. Return Period and Exceedance Probability

In hydraulic design (bridges, spillways, barrages, levees), structural capacity is based on flood magnitude with a specified probability of occurrence.

1. **Annual Exceedance Probability ($P$):** The probability that a flood event $X$ will equal or exceed magnitude $x_T$ in any single year:
$$P(X \\ge x_T) = P = \\frac{1}{T}$$

2. **Non-Exceedance Probability ($q$):**
$$q = P(X < x_T) = 1 - P = 1 - \\frac{1}{T}$$

3. **Hydrologic Risk ($R$):**
For an engineering structure with an expected design life of $n$ years, assuming successive annual maximum floods are statistically independent:
- Probability of no flood $\\ge x_T$ in all $n$ years $= q^n = (1 - P)^n$.
- Risk $R$ (at least one exceedance in $n$ years):
$$R = 1 - (1 - P)^n = 1 - \\left(1 - \\frac{1}{T}\\right)^n$$

4. **Hydrologic Safety / Reliability ($S_R$):**
$$S_R = 1 - R = (1 - P)^n = \\left(1 - \\frac{1}{T}\\right)^n$$

---

## 2. Plotting Positions

To plot empirical flood records of length $N$ on probability paper, observations are sorted in descending order and assigned rank $m$ ($m = 1$ for highest flood, $m = N$ for lowest).

| Formula | Expression | Characteristics |
|---|---|---|
| **Weibull** (Standard) | $P = \\frac{m}{N+1}, \\quad T = \\frac{N+1}{m}$ | Unbiased exceedance probability for all distributions |
| **California** | $P = \\frac{m}{N}$ | Biased; assigns $P=1.0$ to lowest event |
| **Hazen** | $P = \\frac{m - 0.5}{N}$ | Midpoint plotting position |
| **Gringorten** | $P = \\frac{m - 0.44}{N + 0.12}$ | Optimized for Gumbel EV-I distribution |

---

## 3. Worked Numerical Examples

### Worked Example 34.1: Hydrologic Risk Calculation for a Bridge

**Problem:** A bridge on a national highway is designed for a 50-year flood ($T = 50\\text{ years}$). The design service life of the bridge is $n = 25\\text{ years}$.
1. What is the annual exceedance probability of the design flood?
2. What is the hydrologic risk that the bridge will experience a flood equal to or greater than the design flood at least once during its service life?
3. What is the reliability of the structure?

**Solution:**

**Step 1: Annual exceedance probability**
$$P = \\frac{1}{T} = \\frac{1}{50} = 0.020\\text{ (or } 2.0\\%)$$

**Step 2: Hydrologic Risk ($R$)**
$$q = 1 - P = 1 - 0.02 = 0.98$$
$$q^n = (0.98)^{25}$$
$$\\ln(q^n) = 25 \\times \\ln(0.98) = 25 \\times (-0.02020) = -0.50507$$
$$q^n = e^{-0.50507} = 0.60346$$
$$R = 1 - q^n = 1 - 0.60346 = 0.39654 \\implies R = 39.65\\%$$

**Step 3: Reliability ($S_R$)**
$$S_R = 1 - R = 60.35\\%$$

---

### Worked Example 34.2: Selecting Design Return Period for Specified Risk

**Problem:** A culvert is to be constructed with a design life of $n = 20\\text{ years}$. The authority specifies that the risk of flood exceedance during this period must not exceed $10\\%$ ($R \\le 0.10$). Determine the required design return period $T$.

**Solution:**
$$R = 1 - \\left(1 - \\frac{1}{T}\\right)^n \\implies 0.10 = 1 - \\left(1 - \\frac{1}{T}\\right)^{20}$$
$$\\left(1 - \\frac{1}{T}\\right)^{20} = 0.90$$
$$1 - \\frac{1}{T} = (0.90)^{1/20} = (0.90)^{0.05} = 0.994747$$
$$\\frac{1}{T} = 1 - 0.994747 = 0.005253$$
$$T = \\frac{1}{0.005253} = 190.37\\text{ years} \\approx 191\\text{ years}$$
The culvert must be designed for at least a 200-year flood to keep the risk under $10\\%$.

---

### Session 34 recap
1. Return period $T = 1/P$.
2. Risk $R = 1 - (1 - 1/T)^n$.
3. Weibull plotting position: $P = m / (N + 1)$.
4. Designing for a 50-year flood over a 50-year lifespan carries a $63.6\\%$ risk of exceedance.

<!--tab:In class-->

## In-Class Activities & Verification

### Activity 1: Flood Risk Check

Calculate the risk of at least one exceedance of a 100-year flood ($T = 100$) during a 30-year period ($n = 30$). Express answer in percentage.

\`\`\`check
Risk = 26.0 %
Tolerance: 0.5 %
Hint: P = 0.01. q = 0.99. q^30 = 0.7397. Risk = 1 - 0.7397 = 0.2603 = 26.03%.
\`\`\`

### Activity 2: Weibull Plotting Position

In a 24-year annual maximum flood series ($N = 24$), the 4th highest flood ($m = 4$) has what return period in years?

\`\`\`check
T = 6.25 yr
Tolerance: 0.1 yr
Hint: T = (N + 1)/m = (24 + 1)/4 = 25/4 = 6.25 years.
\`\`\`

<!--tab:Software lab-->

## Lab Linkage: Annual Maximum Series in HEC-SSP

In **HEC-SSP (Statistical Software Package)**:
1. Create a new study and import the historical annual maximum peak flow series.
2. Select **Plotting Position** $\\rightarrow$ **Weibull**.
3. View the empirical frequency plot and examine the data scatter along the probability axis.

<!--tab:Practice-->

## Practice Quiz & Exam Questions

\`\`\`quiz
1. What is the hydrologic risk of exceedance for a structure designed for a T-year flood over a design life of exactly T years (for large T)?
* Approximately 63.2%
- Exactly 50.0%
- 100%
- 36.8%

2. According to Weibull's formula, the exceedance probability for rank m from N years of record is:
* m / (N + 1)
- m / N
- (m - 0.5) / N
- (m - 0.3) / (N + 0.4)

3. If an engineer wants to ensure 95% reliability over a 10-year design life, what maximum risk is acceptable?
* 5%
- 10%
- 50%
- 95%
\`\`\`

### Examination Questions

:::exam[2-Mark Concept Questions]
1. Define **return period** and **hydrologic risk**.
2. State the difference between an Annual Maximum Series (AMS) and a Partial Duration Series (PDS).
:::

:::exam[5-Mark Derivation]
Derive the expression for hydrologic risk $R = 1 - \\left(1 - \\frac{1}{T}\\right)^n$ starting from the binomial probability distribution. Show that as $n = T \\to \\infty$, $R \\to 1 - e^{-1} \\approx 63.2\\%$.
:::

:::exam[10-Mark Comprehensive]
Explain the principles of flood frequency analysis. Describe the various plotting position formulas (Weibull, Hazen, California, Gringorten) and discuss why Weibull's formula is preferred in engineering hydrology.
:::

:::sol
Binomial derivation:
Let event $E$ be flood exceedance with probability $P = 1/T$. In $n$ successive years, the probability of exactly $x$ exceedances is:
$$P(x) = \\binom{n}{x} P^x (1 - P)^{n - x}$$
The probability of zero exceedances in $n$ years is:
$$P(0) = (1 - P)^n = \\left(1 - \\frac{1}{T}\\right)^n$$
Therefore, the risk of at least one exceedance is:
$$R = 1 - P(0) = 1 - \\left(1 - \\frac{1}{T}\\right)^n$$
For $n = T$:
$$\\lim_{T \\to \\infty} \\left(1 - \\frac{1}{T}\\right)^T = e^{-1} \\approx 0.3679$$
$$R = 1 - e^{-1} = 1 - 0.3679 = 0.6321 = 63.21\\%$$
Plotting positions:
Weibull's formula $P = m / (N + 1)$ is preferred because the expected value of the probability of the $m$-th order statistic from any continuous uniform distribution is mathematically equal to $m / (N + 1)$, making it an unbiased estimator.
:::
`;

// S35: Gumbel's extreme value distribution
u4["S35"] = `<!--tab:Theory-->

> [!note] Key ideas
> - Gumbel's Extreme Value Type I (EV-I) distribution is the most widely applied frequency distribution for annual maximum floods in India and worldwide (IS:5477).
> - Cumulative distribution function: $F(x) = \\exp\\left[-\\exp(-y)\\right]$.
> - Reduced variate: $y_T = -\\ln\\left[-\\ln\\left(1 - \\frac{1}{T}\\right)\\right]$.
> - Frequency equation: $x_T = \\bar{x} + K_T s_x$.
> - For finite sample size $N$, the frequency factor is $K_T = \\frac{y_T - \\bar{y}_n}{s_n}$, where $\\bar{y}_n$ and $s_n$ are reduced mean and standard deviation.

## 1. Gumbel Extreme Value Type I Formulation

According to Fisher-Tippett asymptotic theory, the largest values of independent and identically distributed random variables converge to the Extreme Value Type I (Gumbel) distribution:

$$P(X < x) = F(x) = e^{-e^{-y}}$$
$$P(X \\ge x_T) = \\frac{1}{T} = 1 - e^{-e^{-y_T}}$$

Solving for the reduced variate $y_T$:
$$y_T = -\\ln\\left[\\ln\\left(\\frac{T}{T - 1}\\right)\\right] = -\\ln\\left[-\\ln\\left(1 - \\frac{1}{T}\\right)\\right]$$

For large $T$ ($T \\ge 20$):
$$\\ln\\left(\\frac{T}{T - 1}\\right) = \\ln\\left(1 + \\frac{1}{T - 1}\\right) \\approx \\frac{1}{T} \\implies y_T \\approx \\ln(T)$$

---

## 2. Finite Sample Correction: Frequency Factor $K_T$

For an observed sample of size $N$ with mean $\\bar{x}$ and sample standard deviation $s_x = \\sqrt{\\frac{\\sum (x_i - \\bar{x})^2}{N - 1}}$:

$$x_T = \\bar{x} + K_T s_x$$

Where:
$$K_T = \\frac{y_T - \\bar{y}_n}{s_n}$$

Values of Gumbel parameters for typical sample sizes:
| $N$ | $\\bar{y}_n$ | $s_n$ |
|---|---|---|
| 20 | 0.5236 | 1.0628 |
| 25 | 0.5309 | 1.0915 |
| 30 | 0.5362 | 1.1124 |
| 40 | 0.5436 | 1.1413 |
| 50 | 0.5485 | 1.1607 |
| 100 | 0.5600 | 1.2065 |
| $\\infty$ | 0.5772 | 1.2825 |

---

## 3. Worked Numerical Examples

### Worked Example 35.1: 100-Year Flood Estimation by Gumbel's Method

**Problem:** A 30-year annual peak flow record ($N = 30$) on the Narmada river gives:
- Mean annual peak flow: $\\bar{x} = 420.0\\text{ m}^3\\text{/s}$
- Standard deviation: $s_x = 115.0\\text{ m}^3\\text{/s}$
From Gumbel tables for $N = 30$: $\\bar{y}_n = 0.5362$ and $s_n = 1.1124$.
1. Compute the 100-year design peak flood $x_{100}$.
2. Compute the 50-year peak flood $x_{50}$.

**Solution:**

**Step 1: Compute reduced variate for $T = 100$**
$$y_{100} = -\\ln\\left[-\\ln\\left(1 - \\frac{1}{100}\\right)\\right] = -\\ln[-\\ln(0.99)]$$
$$\\ln(0.99) = -0.01005033 \\implies -\\ln(0.01005033) = 4.60015$$
$$y_{100} = 4.60015$$

**Step 2: Compute frequency factor $K_{100}$**
$$K_{100} = \\frac{y_{100} - \\bar{y}_n}{s_n} = \\frac{4.60015 - 0.5362}{1.1124} = \\frac{4.06395}{1.1124} = 3.6533$$

**Step 3: Calculate $x_{100}$**
$$x_{100} = \\bar{x} + K_{100} s_x = 420.0 + (3.6533 \\times 115.0) = 420.0 + 420.13 = 840.13\\text{ m}^3\\text{/s} \\approx 840.1\\text{ m}^3\\text{/s}$$

**Step 4: Compute $x_{50}$**
$$y_{50} = -\\ln[-\\ln(0.98)] = -\\ln[0.0202027] = 3.90194$$
$$K_{50} = \\frac{3.90194 - 0.5362}{1.1124} = \\frac{3.36574}{1.1124} = 3.0256$$
$$x_{50} = 420.0 + (3.0256 \\times 115.0) = 420.0 + 347.95 = 767.95\\text{ m}^3\\text{/s} \\approx 768.0\\text{ m}^3\\text{/s}$$

---

### Worked Example 35.2: Finding Return Period for an Observed Flood

**Problem:** At the same station, an extreme flood of $750.0\\text{ m}^3\\text{/s}$ was recorded. Determine its return period $T$ using Gumbel's method.

**Solution:**
$$x_T = \\bar{x} + K_T s_x \\implies 750.0 = 420.0 + K_T (115.0)$$
$$K_T = \\frac{750.0 - 420.0}{115.0} = \\frac{330.0}{115.0} = 2.86957$$
$$y_T = \\bar{y}_n + K_T s_n = 0.5362 + (2.86957 \\times 1.1124) = 0.5362 + 3.1921 = 3.7283$$
Since $y_T = -\\ln[-\\ln(1 - 1/T)]$:
$$-\\ln(1 - 1/T) = e^{-3.7283} = 0.024034$$
$$\\ln(1 - 1/T) = -0.024034 \\implies 1 - \\frac{1}{T} = e^{-0.024034} = 0.97625$$
$$\\frac{1}{T} = 1 - 0.97625 = 0.02375 \\implies T = \\frac{1}{0.02375} = 42.1\\text{ years}$$

---

### Session 35 recap
1. Gumbel EV-I frequency equation: $x_T = \\bar{x} + K_T s_x$.
2. Frequency factor $K_T = (y_T - \\bar{y}_n) / s_n$.
3. Reduced variate $y_T = -\\ln[-\\ln(1 - 1/T)]$.
4. Standard method recommended by Central Water Commission (CWC) for flood frequency.

<!--tab:In class-->

## In-Class Activities & Verification

### Activity 1: Frequency Factor Check

For $N = 30$, $\\bar{y}_n = 0.5362, s_n = 1.1124$. Given $y_{50} = 3.9019$, compute $K_{50}$.

\`\`\`check
K_50 = 3.026
Tolerance: 0.01
Hint: K_50 = (3.9019 - 0.5362) / 1.1124 = 3.3657 / 1.1124 = 3.0256.
\`\`\`

### Activity 2: Gumbel Design Flood Check

Given $\\bar{x} = 500\\text{ m}^3\\text{/s}$, $s_x = 120\\text{ m}^3\\text{/s}$, and $K_T = 3.50$. Compute $x_T$ in $\\text{m}^3\\text{/s}$.

\`\`\`check
x_T = 920.0 m3/s
Tolerance: 1.0 m3/s
Hint: x_T = 500 + 3.50 * 120 = 500 + 420 = 920.0 m3/s.
\`\`\`

<!--tab:Software lab-->

## Lab Linkage: Gumbel Fitting in HEC-SSP

In **HEC-SSP**:
1. Select **General Frequency Analysis**.
2. Set analytical distribution to **Gumbel (Extreme Value Type I)**.
3. Compare the computed 50-year and 100-year quantiles against manual calculations.

<!--tab:Practice-->

## Practice Quiz & Exam Questions

\`\`\`quiz
1. In Gumbel's method, what happens to the reduced variate y_T as return period T increases?
* It increases logarithmically: y_T ~ ln(T)
- It approaches zero
- It decreases exponentially
- It remains constant at 0.5772

2. The reduced mean y_bar_n for an infinitely large sample size (N -> inf) equals:
* 0.5772 (Euler-Mascheroni constant)
- 1.0000
- 0.5000
- 1.2825

3. What is the standard Gumbel frequency equation for estimating design flood x_T?
* x_T = x_bar + K_T * s_x
- x_T = x_bar * (1 + K_T)
- x_T = K_T * s_x / x_bar
- x_T = x_bar - K_T * s_x
\`\`\`

### Examination Questions

:::exam[5-Mark Derivation]
State Gumbel's Extreme Value Type I cumulative distribution function. Derive the expression for the reduced variate $y_T = -\\ln\\left[-\\ln\\left(1 - \\frac{1}{T}\\right)\\right]$.
:::

:::exam[10-Mark Numerical]
An annual maximum series of flood discharges at a bridge site over 40 years gives $\\bar{x} = 650\\text{ m}^3\\text{/s}$ and $s_x = 180\\text{ m}^3\\text{/s}$.
For $N = 40$, take $\\bar{y}_n = 0.5436$ and $s_n = 1.1413$.
1. Compute the design flood for a 100-year return period ($y_{100} = 4.6001$).
2. Compute the design flood for a 200-year return period ($y_{200} = 5.2958$).
3. If a flood of $1200\\text{ m}^3\\text{/s}$ occurred, find its return period.
:::

:::sol
1. **100-year flood:**
   - $K_{100} = \\frac{4.6001 - 0.5436}{1.1413} = \\frac{4.0565}{1.1413} = 3.5543$
   - $x_{100} = 650 + 3.5543(180) = 650 + 639.77 = 1289.8\\text{ m}^3\\text{/s}$
2. **200-year flood:**
   - $K_{200} = \\frac{5.2958 - 0.5436}{1.1413} = \\frac{4.7522}{1.1413} = 4.1639$
   - $x_{200} = 650 + 4.1639(180) = 650 + 749.50 = 1399.5\\text{ m}^3\\text{/s}$
3. **Return period of $1200\\text{ m}^3\\text{/s}$:**
   - $K = \\frac{1200 - 650}{180} = \\frac{550}{180} = 3.0556$
   - $y = 0.5436 + 3.0556(1.1413) = 0.5436 + 3.4873 = 4.0309$
   - $-\\ln(1 - 1/T) = e^{-4.0309} = 0.017758$
   - $1/T = 1 - e^{-0.017758} \\approx 0.01760 \\implies T = 56.8\\text{ years}$.
:::
`;

// S36: Log-Pearson Type III distribution and reservoir sedimentation
u4["S36"] = `<!--tab:Theory-->

> [!note] Key ideas
> - Log-Pearson Type III (LP3) is a 3-parameter distribution recommended for flood frequency analysis when data exhibits significant skewness (USGS Bulletin 17C / CWC guidelines).
> - Variate transformation: $z = \\log_{10}(x)$; parameters: mean $\\bar{z}$, standard deviation $s_z$, and skewness coefficient $C_s$.
> - Frequency equation: $\\log_{10}(x_T) = \\bar{z} + K_z s_z \\implies x_T = 10^{\\log_{10}(x_T)}$.
> - Reservoir sedimentation reduces useful storage capacity over time; trap efficiency $\\eta$ is estimated using **Brune's curve** based on capacity-inflow ratio ($C/I$).
> - Life of a reservoir is determined by the time required for sediment to fill the dead storage volume.

## 1. Log-Pearson Type III Distribution

When hydrologic flood data is heavily skewed (as is common in semi-arid and monsoon basins), two-parameter distributions like Gumbel can substantially underestimate extreme flood quantiles.

The Log-Pearson Type III distribution fits the logarithms of peak discharges ($z = \\log_{10} x$):
1. **Sample Mean of Logs:**
$$\\bar{z} = \\frac{\\sum z_i}{N}$$

2. **Sample Standard Deviation of Logs:**
$$s_z = \\sqrt{\\frac{\\sum (z_i - \\bar{z})^2}{N - 1}}$$

3. **Coefficient of Skewness ($C_s$):**
$$C_s = \\frac{N \\sum (z_i - \\bar{z})^3}{(N - 1)(N - 2) s_z^3}$$

The design flood is given by:
$$\\log_{10}(x_T) = \\bar{z} + K_z s_z$$
$$x_T = 10^{\\bar{z} + K_z s_z}$$

Where $K_z = f(T, C_s)$ is read from standard Pearson Type III frequency factor tables (when $C_s = 0$, $K_z$ equals the standard normal variate $z$).

---

## 2. Reservoir Sedimentation & Trap Efficiency

Rivers carry suspended sediment and bed load into reservoirs. The sudden reduction in velocity causes sediment deposition.

\`\`\`
       Reservoir Inflow                     Spillway
       + Sediment Load = S_in               Release (S_out)
       ===================+               +==================
                          |               |
                          |  Reservoir    |
                          |  Water Pool   |
                          |               |
                          +---------------+--- Dead Storage Level
                          | Deposited Silt|
                          +---------------+--- Reservoir Bed
\`\`\`

1. **Trap Efficiency ($\\eta$):** The percentage of incoming sediment trapped in the reservoir:
$$\\eta = \\frac{\\text{Sediment Trapped}}{\\text{Sediment Inflow}} \\times 100\\%$$

2. **Brune's Empirical Curve:** Relates $\\eta$ to the Capacity-Inflow ratio ($C/I$):
- If $C/I > 0.1$, trap efficiency $\\eta > 85\\%$.
- If $C/I > 0.5$, trap efficiency $\\eta > 95\\%$.
- For small check dams ($C/I < 0.01$), $\\eta < 40\\%$.

3. **Annual Capacity Loss:**
$$\\Delta C_{\\text{annual}} = \\frac{\\text{Annual Inflow of Sediment (tonnes)} \\times \\eta}{\\text{Dry Unit Weight of Deposited Silt } (\\gamma_{\\text{sed}})}$$

---

## 3. Worked Numerical Examples

### Worked Example 36.1: Log-Pearson Type III Flood Quantile

**Problem:** A 40-year streamflow record analyzed in logarithmic space gives:
- Mean of $\\log_{10} Q$: $\\bar{z} = 2.623$
- Standard deviation of $\\log_{10} Q$: $s_z = 0.185$
- Skewness coefficient: $C_s = +0.40$
From the Pearson Type III frequency table, for $C_s = +0.40$ and $T = 50\\text{ years}$, $K_z = 2.261$.
Compute the 50-year peak flood discharge $x_{50}$.

**Solution:**

**Step 1: Compute logarithmic quantile**
$$\\log_{10}(x_{50}) = \\bar{z} + K_z s_z = 2.623 + (2.261 \\times 0.185) = 2.623 + 0.41828 = 3.04128$$

**Step 2: Antilog to find discharge**
$$x_{50} = 10^{3.04128} = 1099.7\\text{ m}^3\\text{/s} \\approx 1100\\text{ m}^3\\text{/s}$$

---

### Worked Example 36.2: Reservoir Sedimentation & Useful Life

**Problem:** A proposed reservoir has an initial storage capacity of $30.0\\text{ MCM}$ ($30 \\times 10^6\\text{ m}^3$). The mean annual river inflow is $120.0\\text{ MCM}$.
- Capacity-Inflow ratio $C/I = 30 / 120 = 0.25$. From Brune's curve, trap efficiency $\\eta = 93\\%$.
- Annual sediment inflow is $150{,}000\\text{ tonnes/year}$.
- The average dry unit weight of settled sediment is $\\gamma_{\\text{sed}} = 1.20\\text{ tonnes/m}^3$.
- The dead storage is $20\\%$ of the gross capacity ($6.0\\text{ MCM}$).
Calculate the annual loss of storage and the time required to fill the dead storage.

**Solution:**

**Step 1: Annual sediment trapped**
$$\\text{Trapped mass} = 150{,}000 \\times 0.93 = 139{,}500\\text{ tonnes/year}$$

**Step 2: Annual volume of sediment deposit**
$$\\Delta V = \\frac{139{,}500\\text{ tonnes}}{1.20\\text{ tonnes/m}^3} = 116{,}250\\text{ m}^3\\text{/year} = 0.11625\\text{ MCM/year}$$

**Step 3: Time to fill dead storage ($6.0\\text{ MCM}$)**
$$\\text{Time} = \\frac{6.0\\text{ MCM}}{0.11625\\text{ MCM/year}} = 51.6\\text{ years} \\approx 52\\text{ years}$$

---

### Session 36 recap
1. LP3 handles skewed flood data using $\\log_{10}(x)$ transformations.
2. Quantile formula: $\\log_{10}(x_T) = \\bar{z} + K_z s_z$.
3. Brune's trap efficiency $\\eta$ depends on capacity-inflow ratio ($C/I$).
4. Reservoir life is constrained by the rate at which sediment fills dead storage.

<!--tab:In class-->

## In-Class Activities & Verification

### Activity 1: LP3 Flood Peak Check

Given $\\bar{z} = 3.00$, $s_z = 0.20$, and $K_z = 2.0$. Compute the peak flood discharge $x_T$ in $\\text{m}^3\\text{/s}$. ($10^{3.40} = 2511.9$).

\`\`\`check
x_T = 2511.9 m3/s
Tolerance: 5.0 m3/s
Hint: log10(x_T) = 3.00 + 2.0 * 0.20 = 3.40. x_T = 10^(3.40) = 2511.89 m3/s.
\`\`\`

### Activity 2: Sediment Volume Check

A reservoir traps $180{,}000\\text{ tonnes}$ of sediment per year. If settled density is $1.25\\text{ tonnes/m}^3$, compute annual volume lost in $\\text{m}^3$.

\`\`\`check
V_sed = 144000 m3
Tolerance: 100 m3
Hint: V = 180000 / 1.25 = 144,000 m3.
\`\`\`

<!--tab:Software lab-->

## Lab Linkage: LP3 Analysis in HEC-SSP

In **HEC-SSP**:
1. Select **Bulletin 17C / Log-Pearson Type III Analysis**.
2. Enable systematic record fitting and inspect station skew vs generalized regional skew.
3. Observe the upper and lower $95\\%$ confidence limit curves around the fitted LP3 frequency line.

<!--tab:Practice-->

## Practice Quiz & Exam Questions

\`\`\`quiz
1. Why is the Log-Pearson Type III distribution favored over the two-parameter Gumbel distribution for flood frequency analysis?
* It incorporates a third parameter (skewness coefficient) to model asymmetric flood records
- It eliminates the need for statistical standard deviation
- It always predicts lower flood peaks than any other method
- It requires only two years of observed data

2. Brune's trap efficiency curves correlate reservoir sediment retention directly with:
* Capacity-to-inflow ratio (C/I)
- Reservoir water temperature
- Dam crest elevation above MSL
- Froude number of the spillway jet

3. When the skewness coefficient Cs in the Log-Pearson Type III distribution equals zero, the distribution simplifies to:
* The Log-Normal distribution
- The Uniform distribution
- The Exponential distribution
- The Poisson distribution
\`\`\`

### Examination Questions

:::exam[2-Mark Concept Questions]
1. Define **trap efficiency** of a reservoir.
2. What are the three parameters of the Log-Pearson Type III distribution?
:::

:::exam[5-Mark Conceptual]
Explain Brune's method for determining the trap efficiency of a reservoir. Describe how trap efficiency changes over the operational lifespan of a reservoir.
:::

:::exam[10-Mark Comprehensive]
Explain the step-by-step procedure for performing flood frequency analysis using the Log-Pearson Type III method according to USGS Bulletin 17C / CWC guidelines.
:::

:::sol
Step-by-step LP3 Procedure:
1. Data compilation: Assemble the annual maximum flood series $X_1, X_2, \\dots, X_N$ for $N$ consecutive years.
2. Logarithmic transformation: Convert each peak flow $X_i$ to base-10 logarithm: $z_i = \\log_{10} X_i$.
3. Compute sample statistics:
   - Mean of logs: $\\bar{z} = \\frac{1}{N} \\sum z_i$
   - Standard deviation of logs: $s_z = \\sqrt{\\frac{\\sum (z_i - \\bar{z})^2}{N - 1}}$
   - Station skewness coefficient: $C_s = \\frac{N \\sum (z_i - \\bar{z})^3}{(N - 1)(N - 2) s_z^3}$
4. Weighted skewness: Combine station skew with regional generalized skew to reduce sample uncertainty.
5. Determine frequency factor $K_z$: Lookup $K_z$ from Pearson Type III tables for the desired return period $T$ and weighted skew $C_s$.
6. Calculate logarithmic quantile: $\\log_{10}(x_T) = \\bar{z} + K_z s_z$.
7. Antilog: Compute flood magnitude $x_T = 10^{\\log_{10}(x_T)}$.
8. Confidence intervals: Evaluate standard error and construct $95\\%$ confidence bounds.
:::
`;

// Write out all Unit 4 sessions
for (const [id, content] of Object.entries(u4)) {
  const filePath = path.join(sessionsDir, id + '.md');
  fs.writeFileSync(filePath, content.trim() + '\n', 'utf8');
  console.log('Written ' + id + '.md (' + content.length + ' chars)');
}
console.log('Unit 4 generation complete.');
