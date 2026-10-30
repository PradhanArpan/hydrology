# Instructor guide

## Releasing sessions

Each theory session **and each lab** in `sessions.json` has an `enabled` flag (sessions are under `"sessions"`, labs under `"labs"`). Set it to `true` to release the session; students see locked sessions as "Not yet released". You can also put a date in `release` (e.g. `"release": "14 Jan"`) to show "Opens 14 Jan" on the locked card.

Edit directly on GitHub: open `sessions.json` › pencil icon › change `false` to `true` › *Commit changes*. Pages updates within a minute or two.

**Preview locked sessions:** open the portal once as `index.html?preview=1` (or add `?preview` after the `#/…` route). Preview stays on for that browser tab. Locking is a display convenience, not security — the files are in the repository.

## Editing a session

Sessions are Markdown files in `sessions/`. Conventions:

| Write this | You get |
| --- | --- |
| `<!--tab:Theory-->` | Starts a tab named *Theory* (also: In class, Software lab, Practice) |
| `$...$`, `$$...$$` | Inline and display maths (KaTeX) |
| `> [!exam] Title` then `> text` | Coloured callout. Types: `exam`, `note`, `warn`, `hms`, `ras`, `task`, `see`, `fix` |
| `:::sol Show solution` … `:::` | Collapsible worked solution |
| `::widget[name]` on its own line | An interactive tool or illustration. Available: `cycle`, `horton`, `catchment`, `indiawater`, `globalwater`, `waterbudget`, `precip`, `gauges`, `tipping`, `stormnet`, `network`, `dmc`, `threemethods`, `thiessen`, `missing`, `storm`, `movavg`, `risk`, `idf`, `dad`, `d8`, `hortonfit`, `phiindex`, `scscn`, `pencalc`, `hmstour`, `hmselements`, `qgistour`, `rasconcept` |
| ```` ```check ```` + JSON + ```` ``` ```` | Numeric answer box: `[{"q": "...", "answer": 102.8, "tol": 0.02, "unit": "mm", "hint": "...", "solution": "..."}]` (tol = relative tolerance) |
| `![Caption — Source](path)` alone on a line | Figure with caption; `:::gallery` … `:::` makes a row of thumbnails (click to enlarge) |
| `:::task Title` … `:::` | Dashed activity box (also `:::note`, `:::hms`, `:::warn`, `:::exam`) |
| ```` ```quiz ```` + JSON + ```` ``` ```` | Self-marking quiz: `[{"q": "...", "options": ["..."], "answer": 0, "why": "..."}]` |
| `<span class="menu">File › Open</span>` | Menu path styling |

Containers (`:::`) cannot be nested. Keep `$` for maths only; write currency as ₹.

## UI Features

- **Light/Dark Mode:** Toggle button in top header; persists in student's browser `localStorage`.
- **Global Search:** Press `/` or `Ctrl+K` (or click search button in header) to find any session or lab by topic, keyword, or day.
- **Progress Tracking:** Tracks visited sessions and completed labs locally with visible checkmarks.
- **Print Friendly:** Click "Print notes" button on any session page to generate clean, uncluttered handouts or PDFs.

## Course settings

The `course` block in `sessions.json` holds the instructor name (Dr Arpan Pradhan), semester, and the **Google Classroom link** (`classroom`) shown on the hub.

## Writing a lab

Labs live in `labs/Lxx.md`: an introduction, then steps marked `<!--step: Title-->`, then `<!--end-->` and a closing *Submit* box. Inside a step use `> [!see] You should see` and `> [!fix] If it does not work`. To add your own screenshots, save them in `assets/img/labs/` and reference them in the step with `![Caption — Screenshot](assets/img/labs/L03_step2.png)`.

## Datasets and figures

`tools/unit1_data.py` and `tools/unit1_figs.py` regenerate the Unit I datasets and figures. Teaching data are synthetic and marked as such.
To rebuild `assets/app.js` after editing `src/`, run `node tools/build.js` or `tools/build.sh`.

## Checklist for each new session

1. Theory: definitions, derivations, formulas, at least two worked examples with checked numbers.
2. In class: one activity with verified check answers.
3. A matching lab in `labs/` (steps written against HEC-HMS 4.x / HEC-RAS 6.x; *What to notice*; *Submit*), linked through the session's `labs` list in `sessions.json`.
4. Practice: 4–5 quiz items; 2-, 5- and 10-mark questions.
5. Set `enabled` when ready to release to students.
