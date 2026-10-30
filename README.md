# CE633 Hydrology and Water Resources Engineering — course portal

A static course portal (GitHub Pages) for CE633, Department of Civil Engineering, CHRIST (Deemed to be University), Kengeri Campus. Instructor: Dr Shibu K. Mani.

The hub (`index.html`) is a small React app styled after the CE541E08 hub: a navy sidebar with units, the lab track and course pages; unit tables with release status; and session pages.

**Theory sessions** (`sessions/S01.md` … `S45.md`) have three tabs — *Theory* (notes, drawn illustrations, solved numericals and interactive tools), *In class* (a short concept exercise) and *Practice* (self-check quiz, exam-style questions).

**Software lab track** (`labs/L01.md` …) runs in parallel: each lab is a stepper — one step at a time, with "You should see" and "If it does not work" boxes, progress saved in the browser. L01–L10 cover Unit I (HEC-HMS and QGIS).

## Layout

```
index.html          the hub (loads assets/app.js)
sessions.json       course info, units, pages, quick links, theory sessions and labs (enabled flags)
sessions/Sxx.md     theory sessions; tabs split by <!--tab:Name-->
labs/Lxx.md         software labs; steps split by <!--step: Title--> … <!--end-->
pages/              setup, PBL and assessment pages
data/               lab datasets (U1_* are synthetic teaching data)
software/           introductions to HEC-HMS, QGIS, HEC-RAS, HEC-SSP
assets/img/labs/    lab schematics
assets/app.js       built bundle (React) — rebuilt from src/ with tools/build.sh
src/                React source: app.jsx (shell and views), widgets.jsx (tools), illos.jsx (SVG illustrations), charts.jsx, md.js
tools/              data, figure and sessions.json generators; build.sh
```

Content edits (Markdown, JSON) need no build step. Only changes to `src/` need `tools/build.sh` (Node.js).

## Status

- Unit I: Sessions 1–9 complete (slide content, 25 interactive tools and illustrations, self-checking exercises) and labs L01–L10.
- Software introductions (HEC-HMS, QGIS, HEC-RAS, HEC-SSP) and a references page.
- Sessions 10–45: outlines; labs for Units II–V to follow.
