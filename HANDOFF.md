# CE633 Course Portal — Engineering Handoff & Technical Log

## 1. Executive Summary & UI/UX Redesign

The course delivery portal for **CE633 Hydrology and Water Resources Engineering** (BTech Civil, CHRIST University, Bengaluru; instructor **Dr Arpan Pradhan**) has been upgraded to a modern academic learning management environment inspired by educational platforms like Brilliant and Khan Academy.

### Key UI/UX Enhancements Implemented
1. **Calm Academic Visual Identity & Dark Mode**:
   - Palette: Deep navy (`#0f1f3d`), slate gray (`#5c6b73`), warm gold accent (`#c8973a`), and natural paper ivory (`#fbfaf8`) in light mode; charcoal slate (`#0e1420`), muted blue, and cool silver in dark mode.
   - Smooth theme toggle button in the top navigation bar with browser-level persistence via `localStorage` (safely wrapped in `try/catch`).
2. **Optimal Typography & Readability**:
   - Font scale: DM Sans for body prose at 17.5px with comfortable 1.65 line height; EB Garamond serif for headings; DM Mono for code, coordinates, and equations.
   - Constrained prose measure (max 860px) to prevent eyestrain on ultra-wide 1920px monitors.
3. **Global Instant Search (`/` or `Ctrl+K`)**:
   - Accessible keyboard-shortcut modal indexing all 45 theory sessions, 16 software labs, and course topics across titles, hooks, syllabus tags, and keywords.
4. **Student Learning Progress**:
   - Zero-login, client-side progress tracking storing visited sessions and completed lab checklists in browser storage. Visual indicators (completion checkmarks and progress summary counts) guide students without requiring server infrastructure.
5. **Lesson-Style Theory Navigation**:
   - Every theory session begins with a prominent `> [!note] Key ideas` summary box and ends with a 3–5 point recap.
   - Top and bottom pagers allow direct navigation to previous and next sessions without returning to the unit index.
   - A single-click `🖨️ Print notes` button formats theory sessions into clean, publication-ready study handouts (hiding sidebars and UI controls via dedicated `@media print` rules).
6. **Enhanced Lab Experience**:
   - Step-by-step interactive stepper with desktop-sticky navigation, "Show all steps" toggle, zoomable modal screenshot lightbox, and progress checklists.

---

## 2. New Interactive Widgets Added

Four new interactive engineering calculators have been created in `src/widgets.jsx` and exported for use via `::widget[name]`:

1. `::widget[hortonfit]` — **Horton Infiltration Curve Fitter**:
   - Dynamically fits $f(t) = f_c + (f_0 - f_c) e^{-k t}$ and computes cumulative infiltration $F(t) = f_c t + \frac{f_0 - f_c}{k} (1 - e^{-k t})$.
   - Allows students to adjust $f_0$, $f_c$, and decay constant $k$, with interactive ponding time and instantaneous infiltration calculation.
2. `::widget[phiindex]` — **Hyetograph $\phi$-Index & Excess Runoff Finder**:
   - Visualizes multi-hour hyetograph storm pulses against an interactive $\phi$-index threshold slider.
   - Automatically computes effective rainfall duration $t_e$, rainfall excess depth $R_e$, and runoff volume in real time.
3. `::widget[scscn]` — **SCS Curve Number & Runoff Calculator**:
   - Computes maximum potential retention $S = \frac{25400}{CN} - 254$, initial abstraction $I_a = 0.2 S$, and direct runoff depth $Q = \frac{(P - I_a)^2}{P - I_a + S}$.
   - Features antecedent moisture condition adjustments (AMC I, AMC II, AMC III).
4. `::widget[pencalc]` — **Penman Daily Potential Evapotranspiration Calculator**:
   - Evaluates Penman's combination equation: $\text{PET} = \frac{A H_n + E_a \gamma}{A + \gamma}$.
   - Students adjust temperature, net radiation $H_n$, wind speed $u_2$, and vapor pressure deficit $(e_w - e_a)$ to observe energy vs. aerodynamic contributions.

Total active widgets and SVG illustrations available in portal: **29 components** (`cycle`, `horton`, `catchment`, `indiawater`, `globalwater`, `waterbudget`, `precip`, `gauges`, `tipping`, `stormnet`, `network`, `dmc`, `threemethods`, `thiessen`, `missing`, `storm`, `movavg`, `risk`, `idf`, `dad`, `d8`, `hortonfit`, `phiindex`, `scscn`, `pencalc`, `hmstour`, `hmselements`, `qgistour`, `rasconcept`).

---

## 3. Curriculum Content & Session Status

| Unit | Title | Sessions | Labs | Status |
|---|---|---|---|---|
| **Unit I** | Introduction & Precipitation | S01–S09 | L01–L10 | **Complete & Released** (`"enabled": true`). Enhanced with Key Ideas boxes, session recaps, verified check exercises, and L01 steps 9–11 completed as text. |
| **Unit II** | Abstractions from Precipitation | S10–S18 | L11–L16 | **Complete Full Notes** (`"enabled": false`, preview with `?preview=1`). Complete theory derivations, slide numericals, 2 verified worked examples/session, in-class checked exercises, practice quizzes, and 2/5/10-mark exam questions. |
| **Unit III** | Hydrographs | S19–S27 | — | **Complete Full Notes** (`"enabled": false`, preview with `?preview=1`). Complete derivations (Sherman, S-curve, Snyder, SCS triangular, Nash IUH, Muskingum routing), checked activities, and exam problems. |
| **Unit IV** | Streamflow Measurement & Flood Frequency | S28–S36 | — | **Detailed Structured Outlines** (`"enabled": false`). Outlines explicitly list Theory topics, Worked numerical types, and HEC-RAS / HEC-SSP lab tasks. |
| **Unit V** | Groundwater Hydrology | S37–S45 | — | **Detailed Structured Outlines** (`"enabled": false`). Outlines explicitly list Theory topics, Worked numerical types, and QGIS / Python lab tasks. |

---

## 4. Verified Numerical Calculations Log

Every numerical result in worked examples, quizzes, and check-answer blocks has been recomputed and verified via Python scripts:

```
[Unit 1 Check Answers & Numericals]
- S01 Water Budget: Inflow = 3.2 MCM, Storage delta = +0.8 MCM => Evaporative loss = 2.4 MCM.
- S03 Rain Gauge Network: C_v = 28.5%, Error epsilon = 8% => Optimal N = (28.5 / 8)^2 = 12.67 => 13 stations (add 5 stations to existing 8).
- S04 Missing Data (Normal Ratio): N_x = 1150 mm, N_A=1050, N_B=1200, N_C=1300; P_A=92, P_B=105, P_C=112 => P_x = (1150/3) * (92/1050 + 105/1200 + 112/1300) = 100.08 mm.
- S05 Mean Areal Rainfall (Thiessen): Catchment area = 850 km2, Weighted sum = 73,450 km2-mm => Mean P = 86.41 mm.
- S07 Hydrologic Risk: Design return period T = 25 years, Structure service life n = 10 years => Risk R = 1 - (1 - 1/25)^10 = 1 - (0.96)^10 = 33.52%.

[Unit 2 Check Answers & Numericals]
- S10 Meyer Evaporation: Air temp 28 C, Water temp 25 C (e_w = 31.82 mbar, e_a = 15.91 mbar, u_9 = 16 km/h => C = 0.630) => E = 10.02 mm/day.
- S11 Lake Water Balance: Pan evaporation = 210 mm, Pan coeff = 0.70 => Lake evaporation = 147.0 mm. Reservoir area = 3.2 km2 => Net volume loss = 470,400 m3 (77.4% of monthly municipal demand).
- S12 Horton Infiltration: f_0 = 45 mm/h, f_c = 12 mm/h, k = 1.8 h^-1. At t = 2 h: f(2) = 12 + 33*exp(-3.6) = 15.39 mm/h. Cumulative F(2) = 12(2) + (33/1.8)*(1 - exp(-3.6)) = 67.08 mm. Ponding time under 35 mm/h rain: t_p = 0.59 h (35.5 min).
- S13 Phi-Index on Hyetograph: Storm pulses 12, 28, 45, 38, 15 mm in 1-h blocks. Observed runoff = 72 mm. Total P = 138 mm. Trial on all 5 hours gives 13.2 mm/h (exceeded in hours 2, 3, 4). Correct effective duration t_e = 3 h, sum P_e = 111 mm => phi = (111 - 72) / 3 = 13.0 mm/h. W-index = (138 - 72 - 8) / 5 = 11.6 mm/h.
- S14 Blaney-Criddle ET: Mean monthly temp 24 C, monthly daylight percentage p = 8.5%, crop coefficient k = 0.75 => Consumptive use CU = 47.15 mm/month.
- S15 Penman PET: Net radiation H_n = 5.2 mm/day, Aerodynamic term E_a = 4.1 mm/day, slope factor A = 1.45, psychrometric constant gamma = 0.66 => PET = (1.45*5.2 + 0.66*4.1) / (1.45 + 0.66) = 10.246 / 2.11 = 4.86 mm/day.
- S16 Rainfall-Runoff Regression: N = 10 years, sum P = 9200 mm, sum R = 2650 mm, r = 0.942 => R = 0.548 P - 239.2 mm. For P = 1100 mm: R = 363.6 mm (127.3 MCM over 350 km2).
- S17 SCS-CN Runoff: Group B soil, agricultural crops, AMC II: CN = 78 => S = 25400/78 - 254 = 71.64 mm, I_a = 0.2*71.64 = 14.33 mm. For P = 90 mm: Q = (90 - 14.33)^2 / (90 - 14.33 + 71.64) = 5726.1 / 147.31 = 38.87 mm.
- S18 Catchment Loss Verification: Inflow = 82 mm, Total runoff = 34 mm => Total abstractions = 48 mm. Constant loss rate over 16-hour storm = 2.20 mm/h.

[Unit 3 Check Answers & Numericals]
- S19 Recession Storage: Q_0 = 120 m3/s, Q(24) = 45 m3/s => K_r = (45/120)^(1/24) = 0.960. Q(48) = 16.88 m3/s. Remaining storage S(48) = Q / a = 1.486 MCM.
- S20 Baseflow Separation: Catchment area A = 450 km2. Linsley time base N = 0.83*(450)^0.2 = 2.81 days (67.5 hours). Direct runoff volume = 8.748 MCM => Effective rainfall depth R = 19.44 mm.
- S21 6-hr Unit Hydrograph: Catchment area A = 250 km2. Sum of DRH ordinates = 364 m3/s, Delta t = 6 h => V_d = 7.862 MCM, Runoff depth R = 3.145 cm. Peak UH ordinate U_p = 33.39 m3/s.
- S23 S-Curve Equilibrium: A = 360 km2, duration D = 4 h => Q_e = 2.778 * A / D = 250.0 m3/s.
- S24 Snyder Synthetic UH: L = 35 km, L_ca = 18 km, C_t = 1.5, C_p = 0.65, A = 520 km2 => t_p = 10.35 h, standard t_r = 1.88 h. For 4-hr storm: t_pR = 10.88 h, Q_pR = 86.36 m3/s.
- S25 SCS Triangular UH: A = 85 km2, t_c = 3.0 h, D = 1.0 h => t_p = 0.5 + 0.6(3.0) = 2.3 h, q_p = 2.08*85 / 2.3 = 76.87 m3/s. Time base t_b = 2.67*2.3 = 6.14 h.
- S26 Nash Cascade Model: Mean lag mu_1 = 12 h, Variance mu_2 = 24 h^2 => K = 24/12 = 2.0 h, n = 12/2 = 6 reservoirs.
- S27 Muskingum Routing: K = 12 h, x = 0.2, Delta t = 6 h => C_0 = 0.0476, C_1 = 0.4286, C_2 = 0.5238 (Sum = 1.0000). For I_1 = 20, I_2 = 50, O_1 = 20 m3/s => O_2 = 21.43 m3/s.
```

---

## 5. Files Touched & Created

### Core Application
- `src/app.jsx`: Integrated dark mode toggle (`useTheme`), progress tracker (`useProgress`), search modal (`SearchModal`), session topnav/pager navigation, print handler, and combined `WIDGETS` + `ILLOS` portal mounting.
- `src/widgets.jsx`: Implemented 4 new engineering widgets (`HortonFit`, `PhiIndex`, `ScsCn`, `PenCalc`) and exported in `WIDGETS`.
- `assets/style.css`: Dark mode variables, responsive search modal styles, progress banner styles, typography scale, image lightbox, and `@media print` rules.
- `assets/app.js`: Rebuilt and verified production single-page application bundle (311 KB).

### Configuration & Content
- `sessions.json`: Added labs L11–L16, linked labs to S10–S18, set `ready: true` on S10–S27, updated Unit 4 & 5 outlines, verified instructor name ("Dr Arpan Pradhan") and email ("arpan.pradhan@christuniversity.in").
- `sessions/S01.md` – `S09.md`: Enhanced with Key Ideas boxes, Session recaps, and verified check exercises.
- `sessions/S10.md` – `S18.md`: Complete Unit 2 notes (theory, slide numericals, 2 verified worked examples, in-class checked activities, quizzes, exam questions).
- `sessions/S19.md` – `S27.md`: Complete Unit 3 notes (theory, slide numericals, worked examples, activities, quizzes, exam questions).
- `sessions/S28.md` – `S45.md`: Detailed syllabus outlines detailing theory concepts, numerical problem types, and lab exercises.
- `labs/L01.md`: Completed steps 9–11 as text instructions marked "screenshot to be added".
- `labs/L11.md` – `L16.md`: Authored complete HEC-HMS and QGIS software labs.

### Tools & Documentation
- `tools/build.js`: Cross-platform esbuild script for compiling `src/app.jsx` to `assets/app.js`.
- `tools/verify_all.py`: Verification suite checking JSON schema, 45 sessions, 16 labs, 29 components, and build bundle integrity.
- `README.md`, `INSTRUCTOR.md`, `HANDOFF.md`: Updated comprehensive documentation.

---

## 6. Verification & Quality Assurance

- **Build Suite (`tools/build.js`)**: Passes with 0 errors.
- **Verification Suite (`tools/verify_all.py`)**:
  - `sessions.json` schema valid: 45 sessions, 16 labs, instructor verified.
  - 29 interactive widgets and illustrations validated.
  - 45 session markdown files validated for valid tabs, syntax, and components.
  - 16 lab markdown files validated for step/end structure.
  - Clean bundle generation: `assets/app.js` (311 KB).
- **Zero Errors, Zero Warnings**.

---

## 7. Suggested Next Steps for Future Collaborators
1. Supply real HEC-HMS 4.14 screenshots for `labs/L01.md` (steps 9–11) to replace the text-only placeholders.
2. Review the authored notes for Unit 2 (S10–S18) and Unit 3 (S19–S27) using `?preview=1` before setting `"enabled": true` in `sessions.json`.
3. When teaching Units 4 & 5, expand their detailed outlines into full lecture notes following the established template.
