# Course datasets

| File | Used in | Description |
| --- | --- | --- |
| `U1_storm_TG1_30min.csv` | S03, S05, S07 | 6-hour storm at recording gauge TG1, 30-minute increments (mm) and cumulative |
| `U1_stations.csv` | S03–S06, S09 | Gauges TG1–TG4: type, longitude, latitude, storm total (mm) |
| `U1_catchment.geojson` | S09 | Teaching-catchment boundary (54.85 km², WGS84) |
| `U1_annual_rainfall_1991_2020.csv` | S04, S07 | Annual rainfall (mm) at test station X and base stations A–E; X has a deliberate break in 2008 |
| `U1_annual_max_1day_1991_2020.csv` | S08 | Annual maximum 1-day rainfall (mm) at station X |

All `U1_*` files are **synthetic teaching data**, generated for practice (scripts in `tools/`). They are placed near Kengeri only so that maps look familiar; they are not observations. PBL work must use real data (IMD, India-WRIS, KSNDMC, CGWB) with source and download date cited.
