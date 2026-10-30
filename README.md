# CE633 Hydrology and Water Resources Engineering — Course Portal

A modern, static course delivery portal (GitHub Pages) for **CE633 Hydrology and Water Resources Engineering**, Department of Civil Engineering, CHRIST (Deemed to be University), Kengeri Campus, Bengaluru. Instructor: **Dr Arpan Pradhan**.

Repository: [https://github.com/PradhanArpan/hydrology](https://github.com/PradhanArpan/hydrology)  
Live Site: [https://pradhanarpan.github.io/hydrology/](https://pradhanarpan.github.io/hydrology/)

---

## Key Highlights & UI/UX Features

- **Modern Academic LMS Aesthetic**: Calm, high-contrast typography, clear hierarchy, responsive layout (optimized across 390px mobile, 1366px laptop, and 1920px desktop).
- **Light & Dark Mode**: Persistent theme toggle with seamless switching between ivory paper and dark slate palettes.
- **Global Instant Search (`/` or `Ctrl+K`)**: Rapid indexed search across all 45 sessions and 16 software labs by title, day number, keywords, and syllabus concepts.
- **Zero-Login Progress Tracking**: Browser-local storage safely tracks visited theory sessions and completed lab steps with visual progress indicators.
- **Lesson-Oriented Theory Pages**: "Key ideas" summary at the top, collapsible solutions, interactive calculation widgets, and single-click print-ready lecture notes.
- **Interactive Lab Stepper**: Step-by-step guidance with zoomable screenshots, checklists, "What you should see", and troubleshooting callouts.

---

## Course Curriculum & Release Structure

- **Unit I: Introduction & Precipitation (S01–S09, L01–L10)**: Hydrologic cycle, water budget, rain gauge networks, consistency (DMC), mean precipitation (Thiessen, Isohyetal), missing data, IDF curves, DAD, and HEC-HMS catchment delineation via QGIS DEM. *(Released & Enabled)*.
- **Unit II: Abstractions from Precipitation (S10–S18, L11–L16)**: Evaporation physics, Dalton's law, Meyer's formula, IS Class A pan, energy balance, Penman method, Blaney-Criddle, infiltration dynamics, Horton's equation, $\phi$-index, $W$-index, SCS Curve Number, and HEC-HMS loss method modeling. *(Authored full notes & ready for review; preview via `?preview=1`)*.
- **Unit III: Hydrographs & Streamflow Synthesis (S19–S27)**: Hydrograph components, baseflow separation techniques, Unit Hydrograph theory, deconvolution from complex storms, S-curve duration conversion, Snyder's synthetic UH, SCS dimensionless UH, Instantaneous Unit Hydrograph (Clark & Nash models), and flood routing (Modified Puls & Muskingum channel routing). *(Authored full notes & ready for review; preview via `?preview=1`)*.
- **Units IV & V (S28–S45)**: Streamflow measurement, stage-discharge rating curves, flood frequency analysis (Gumbel, Log-Pearson III), groundwater hydraulics (Darcy, Dupuit-Thiem, Theis, Cooper-Jacob), open well recuperation tests, and managed aquifer recharge (MAR). *(Detailed syllabus outlines listing theory topics, numerical problem types, and lab exercises)*.

---

## Interactive Widgets & Visualizations

The course portal includes 29 custom interactive widgets and SVG illustrations:
- **Precipitation & Networks**: `precip`, `gauges`, `tipping`, `stormnet`, `network`, `thiessen`, `dmc`, `missing`, `movavg`, `risk`, `idf`, `dad`, `d8`.
- **Losses & Abstractions**: `hortonfit` (interactive Horton infiltration curve fitter), `phiindex` (hyetograph $\phi$-index and runoff finder), `scscn` (SCS-CN calculator with AMC adjustment), `pencalc` (Penman daily potential evapotranspiration energy-aerodynamic calculator).
- **Physical Schematics & Tours**: `cycle`, `horton`, `catchment`, `indiawater`, `globalwater`, `waterbudget`, `threemethods`, `hmstour`, `hmselements`, `qgistour`, `rasconcept`.

---

## Directory Layout

```
index.html          the hub (loads assets/app.js and assets/style.css)
sessions.json       course info, units, theory sessions, software labs, links
sessions/Sxx.md     theory sessions (tabs: Theory, In class, Software lab, Practice)
labs/Lxx.md         software labs (step-by-step with real screenshots)
software/           quick start guides for HEC-HMS, QGIS, HEC-RAS, HEC-SSP
pages/              course pages (software setup, PBL guide, assessment, references)
data/               synthetic teaching datasets
assets/img/labs/    real software screenshots and diagrams
assets/app.js       built bundle (React 18 single-page application)
assets/style.css    custom CSS theme variables, print rules, search modal, responsive layouts
src/                React source code: app.jsx, widgets.jsx, illos.jsx, md.js, charts.jsx
tools/              build scripts (build.js, build.sh), verification suite (verify_all.py)
```

---

## Development & Verification

To make changes to UI components in `src/`:
1. Edit files in `src/`.
2. Build the bundle:
   ```bash
   node tools/build.js
   ```
3. Run the full verification test suite:
   ```bash
   python tools/verify_all.py
   ```
4. Verify all tests pass with 0 errors and commit both source and `assets/app.js`.
