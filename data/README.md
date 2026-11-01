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

Built by `python tools/build_water_atlas.py` (all layers) or `--layer states|basins|rainfall|dams|evaporation|soilmoisture|raingauges`. Raw downloads live in the git-ignored `raw/` folder. Each file records `source`, `licence`, `years` and `built`, and all coordinates use the projection constants of `tools/build_india_map.py`, so the layers line up with `data/india_map.json`.

| Layer | File | Source | Licence / terms |
| --- | --- | --- | --- |
| Rivers | `india_map.json` | DataMeet India composite boundary; Natural Earth rivers | CC BY 4.0; public domain |
| States | `atlas/states.json` | DataMeet, `States/Admin2.shp` | CC BY 4.0 |
| River basins | `atlas/basins.json` | India-WRIS (CWC / NRSC), ArcGIS service `Common/Basin_WRP`, layer 0 "BasinCWC" | India-WRIS copyright policy: material may be reproduced free of charge, accurately and not in a misleading context, with the source acknowledged |
| Rainfall | `atlas/rainfall.json` | IMD Pune 0.25° gridded daily rainfall (Pai et al. 2014), 1991–2020, read from the `.GRD` files that `imdlib` downloads; annual and June–September means, averaged to 0.5° cells | IMD data for non-commercial and educational use with acknowledgement; confirm IMD's data supply policy before reusing outside the course |
| Dams and reservoirs | `atlas/dams.json` | India-WRIS (CWC / NWIC), ArcGIS service `DataDownload/Water_Resource_Project_Data`, layer 3 "DAM" (the National Register of Large Dams); the service does not state its edition | India-WRIS copyright policy (as above) |
| Rain gauges | `atlas/raingauges.json` | India-WRIS (CWC / NWIC), ArcGIS service `NWIC/rf_station`, layer 4 "Rainfall Station" (10,392 registered stations, 33 agencies; 10,387 with usable coordinates); each station's state is taken from the DataMeet boundaries; the S03 "Rain gauges across India" tool | India-WRIS copyright policy (as above) |
| Evaporation | `atlas/evaporation.json` | NASA POWER 30-year climatology (January 1991 to December 2020), parameter `EVLAND` (land evaporation, mm/day, times 365) from the MERRA-2 **reanalysis**; native cells 0.5° × 0.625°; POWER Climatology API v2.10.1 | NASA POWER data are open; NASA asks that publications cite the service, version and access date, and asks to be told of redistribution |
| Soil moisture | `atlas/soilmoisture.json` | NASA POWER, same climatology, parameter `GWETTOP` (surface soil wetness, 0 to 1 fraction of saturation, **not** m³/m³): annual mean, monsoon (June–September) and dry season (December–May) | as above |

Rebuild steps (from the repository root, with Python 3, geopandas, shapely, numpy and `imdlib`):

1. Raw files into `raw/`: DataMeet `States/Admin2.*` and `Country/india-composite.geojson` (saved as `india.geojson`); the India-WRIS basins as GeoJSON from `https://arc.indiawris.gov.in/server/rest/services/Common/Basin_WRP/MapServer/0/query?where=1=1&outFields=*&outSR=4326&maxAllowableOffset=0.01&f=geojson` (saved as `wris_basins.geojson`); the dams as JSON from `.../DataDownload/Water_Resource_Project_Data/MapServer/3/query?where=1=1&outFields=nrld_no,dm_name,state,dm_height,dm_cmp_yr,grs_stor_c,dm_type,purpose,dm_lat,dm_long,bacode,rivcode,frl&returnGeometry=true&outSR=4326&resultRecordCount=10000&f=json` (saved as `wris_dams.json`); the rainfall with `imdlib.get_data("rain", 1991, 2020, fn_format="yearwise", file_dir="raw/imd")`.
2. `python tools/build_water_atlas.py` (the evaporation and soil moisture layers fetch about 1,000 small NASA POWER point climatologies into `raw/power/`; this takes a while and needs no key)
3. `node tools/build.js` and `python tools/verify_all.py`

Notes on the dam data: every entry in the service has coordinates (6,644 plotted). A few entries list a gross storage far above the largest Indian reservoir (about 12,200 MCM), which can only be a unit slip in the register; the build treats values above 13,000 MCM as "not stated" and counts them in `capacityOutliers`. Dam type is given only as earthen/earthfill or rockfill/CFRD in the source; concrete and masonry types are not distinguished.

The workbench card pictures in `assets/img/workbench/` are screenshots of each tool: serve the site (`python -m http.server 8765`) and run `python tools/tool_shots.py`.

Evaporation and soil moisture are model (reanalysis) estimates from NASA MERRA-2 through POWER, chosen because they are keyless, small (about 1.5 MB of downloads) and cover the whole country. ISRO's EOS-04 soil moisture (Bhoonidhi) is the satellite alternative for soil moisture; it needs a Bhoonidhi login and several GB for all India, and covers only 2022 onwards.

The rain-gauge register does not include IMD's own stations (IMD is not an agency in it), and the register is not a census of all gauges in India: counts are a lower bound. Raw download for the stations: `.../NWIC/rf_station/MapServer/4/query?where=1=1&outFields=station_name,station_code,agency_name,agency_id,state_name,state_code,district_name,telemetry,station_type,station_data_type_new&returnGeometry=true&outSR=4326&resultRecordCount=10000&f=json` (saved as `raw/wris_rainstations.json`), and again with `&resultOffset=10000` (saved as `raw/wris_rainstations2.json`). The photos on the S02 forms cards are Wikimedia Commons files; their authors and licences are shown under the photos and listed in `assets/img/forms/CREDITS.md`.
