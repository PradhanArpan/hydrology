# CE633 Hydrology and Water Resources Engineering — course portal

A static course portal (GitHub Pages) for CE633, Department of Civil Engineering, CHRIST (Deemed to be University), Kengeri Campus. Instructor: Dr Shibu K. Mani.

Each of the 45 sessions has four tabs:

| Tab | Purpose |
| --- | --- |
| **Theory** | Examinable notes: definitions, derivations, formulas, solved numericals. Students read it before class. |
| **In class** | A short concept exercise by hand or in a spreadsheet. |
| **Software lab** | Step-by-step HEC-HMS / HEC-RAS / QGIS lab that rebuilds the concept in software. |
| **Practice** | Self-check quiz and 2/5/10-mark exam-style questions. |

HEC-HMS is used from Session 2; one model of one catchment grows across the semester. HEC-RAS joins in Unit IV.

## Layout

```
index.html          hub: lists sessions from sessions.json, with release status
session.html        viewer: renders sessions/Sxx.md or pages/*.md (Markdown + KaTeX)
sessions.json       course info, units, pages, and the 45-session plan (enabled flags)
sessions/S01.md …   one Markdown file per session, tabs split by <!--tab:Name-->
pages/              setup, PBL and assessment pages
data/               datasets used in labs (U1_* are synthetic teaching data)
assets/             style.css, app.js, figures (img/), vendored marked + KaTeX
tools/              Python scripts that generate the datasets, figures and sessions.json
INSTRUCTOR.md       how to release sessions and edit content
```

No build step: edit Markdown or JSON, commit, and the site updates.

## Status

- Sessions 1–9 (Unit I): full content.
- Sessions 10–45: outlines; full notes are added unit by unit.
