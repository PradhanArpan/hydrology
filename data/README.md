# Course datasets

| File | Used in | Description |
| --- | --- | --- |
| `U1_storm_TG1_30min.csv` | S03, S05, S07 | 6-hour storm at recording gauge TG1, 30-minute increments (mm) and cumulative |
| `U1_stations.csv` | S03–S06, S09 | Gauges TG1–TG4: type, longitude, latitude, storm total (mm) |
| `U1_catchment.geojson` | S09 | Teaching-catchment boundary (54.85 km², WGS84) |
| `U1_annual_rainfall_1991_2020.csv` | S04, S07 | Annual rainfall (mm) at test station X and base stations A–E; X has a deliberate break in 2008 |
| `U1_annual_max_1day_1991_2020.csv` | S08 | Annual maximum 1-day rainfall (mm) at station X |

All `U1_*` files are **synthetic teaching data**, generated for practice (scripts in `tools/`). They are placed near Kengeri only so that maps look familiar; they are not observations. PBL work must use real data (IMD, India-WRIS, KSNDMC, CGWB) with source and download date cited.

## Water atlas layers (`data/atlas/`, S01 workbench "Water atlas of India")

Built by `python tools/build_water_atlas.py` (all layers) or `--layer states|basins|rainfall|dams`. Raw downloads live in the git-ignored `raw/` folder. Each file records `source`, `licence`, `years` and `built`, and all coordinates use the projection constants of `tools/build_india_map.py`, so the layers line up with `data/india_map.json`.

| Layer | File | Source | Licence / terms |
| --- | --- | --- | --- |
| Rivers | `india_map.json` | DataMeet India composite boundary; Natural Earth rivers | CC BY 4.0; public domain |
| States | `atlas/states.json` | DataMeet, `States/Admin2.shp` | CC BY 4.0 |
| River basins | `atlas/basins.json` | India-WRIS (CWC / NRSC), ArcGIS service `Common/Basin_WRP`, layer 0 "BasinCWC" | India-WRIS copyright policy: material may be reproduced free of charge, accurately and not in a misleading context, with the source acknowledged |
| Rainfall | `atlas/rainfall.json` | IMD Pune 0.25° gridded daily rainfall (Pai et al. 2014), 1991–2020, read from the `.GRD` files that `imdlib` downloads; annual and June–September means, averaged to 0.5° cells | IMD data for non-commercial and educational use with acknowledgement; confirm IMD's data supply policy before reusing outside the course |
| Dams and reservoirs | `atlas/dams.json` | India-WRIS (CWC / NWIC), ArcGIS service `DataDownload/Water_Resource_Project_Data`, layer 3 "DAM" (the National Register of Large Dams); the service does not state its edition | India-WRIS copyright policy (as above) |
| Evaporation, soil moisture | not built | Needs ERA5-Land monthly means 1991–2020 from the Copernicus Climate Data Store (free account and API key); labelled "reanalysis" when built | CC BY 4.0 (Copernicus) |

Rebuild steps (from the repository root, with Python 3, geopandas, shapely, numpy and `imdlib`):

1. Raw files into `raw/`: DataMeet `States/Admin2.*` and `Country/india-composite.geojson` (saved as `india.geojson`); the India-WRIS basins as GeoJSON from `https://arc.indiawris.gov.in/server/rest/services/Common/Basin_WRP/MapServer/0/query?where=1=1&outFields=*&outSR=4326&maxAllowableOffset=0.01&f=geojson` (saved as `wris_basins.geojson`); the dams as JSON from `.../DataDownload/Water_Resource_Project_Data/MapServer/3/query?where=1=1&outFields=nrld_no,dm_name,state,dm_height,dm_cmp_yr,grs_stor_c,dm_type,purpose,dm_lat,dm_long,bacode,rivcode,frl&returnGeometry=true&outSR=4326&resultRecordCount=10000&f=json` (saved as `wris_dams.json`); the rainfall with `imdlib.get_data("rain", 1991, 2020, fn_format="yearwise", file_dir="raw/imd")`.
2. `python tools/build_water_atlas.py`
3. `node tools/build.js` and `python tools/verify_all.py`

Notes on the dam data: every entry in the service has coordinates (6,644 plotted). A few entries list a gross storage far above the largest Indian reservoir (about 12,200 MCM), which can only be a unit slip in the register; the build treats values above 13,000 MCM as "not stated" and counts them in `capacityOutliers`. Dam type is given only as earthen/earthfill or rockfill/CFRD in the source; concrete and masonry types are not distinguished.

The workbench card pictures in `assets/img/workbench/` are screenshots of each tool: serve the site (`python -m http.server 8765`) and run `python tools/tool_shots.py`.
