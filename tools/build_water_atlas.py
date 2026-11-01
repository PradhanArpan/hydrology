"""Build the Water atlas layers (S01 workbench tool) into data/atlas/<layer>.json.

Run from the repository root:
    python tools/build_water_atlas.py                 # every layer that can be built
    python tools/build_water_atlas.py --layer dams    # one layer (states, basins, rainfall, dams, evaporation, soilmoisture)

Raw downloads go to the git-ignored raw/ folder. See data/README.md for the sources, licences and rebuild steps.
Every layer file carries: source, licence, years, built, plus its data. Coordinates use the same projection
constants as tools/build_india_map.py (LON0, LAT1, K, CX) so all layers line up with data/india_map.json.

Raw inputs expected in raw/ (the download commands are in data/README.md):
    Admin2.shp (+ .dbf .shx .prj .cpg)   DataMeet state boundaries
    india.geojson                          DataMeet India composite boundary
    wris_basins.geojson                    India-WRIS Common/Basin_WRP layer 0 (CWC basins)
    wris_dams.json                         India-WRIS DataDownload/Water_Resource_Project_Data layer 3 (National Register of Large Dams)
    imd/rain/*.grd                         IMD 0.25 deg daily rainfall 1991-2020 (imdlib)
    power/*.json                           NASA POWER point climatologies (fetched by the script, cached here)
"""
import argparse, datetime, json, math, os, re, sys
import numpy as np
import geopandas as gpd
from shapely.geometry import shape, mapping
from shapely.ops import unary_union

LON0, LAT1, K = 68.0, 37.6, 20.0          # same constants as build_india_map.py
CX = math.cos(math.radians(22))
RAW, OUT = "raw", "data/atlas"
BUILT = datetime.date.today().isoformat()


def P(lon, lat):
    return (round((lon - LON0) * CX * K, 1), round((LAT1 - lat) * K, 1))


def ring_d(coords):
    return "M" + "L".join(f"{x} {y}" for x, y in (P(*c[:2]) for c in coords)) + "Z"


def geom_d(g, tol):
    g = g.simplify(tol, preserve_topology=True)
    d = []
    for poly in getattr(g, "geoms", [g]):
        if poly.is_empty or poly.geom_type != "Polygon" or poly.area < 0.002:
            continue
        d.append(ring_d(poly.exterior.coords))
        d += [ring_d(r.coords) for r in poly.interiors if r.length > 0.4]
    return "".join(d)


def write(name, obj):
    os.makedirs(OUT, exist_ok=True)
    p = f"{OUT}/{name}.json"
    with open(p, "w", encoding="utf8") as f:
        json.dump(obj, f, separators=(",", ":"), ensure_ascii=False)
    print(f"{p}: {os.path.getsize(p) / 1024:.0f} KB")


def india():
    g = json.load(open(f"{RAW}/india.geojson", encoding="utf8"))["features"][0]["geometry"]
    return shape(g).buffer(0)


# ---------------------------------------------------------------- states
def build_states():
    s = gpd.read_file(f"{RAW}/Admin2.shp")
    items = [{"n": r.ST_NM, "d": geom_d(r.geometry.buffer(0), 0.02)} for r in s.itertuples()]
    items = [i for i in items if i["d"]]
    write("states", {"source": "DataMeet, India state boundaries (Admin2)", "licence": "CC BY 4.0", "years": "2011 census boundaries with later states (Telangana, Ladakh)", "built": BUILT, "states": items})


# ---------------------------------------------------------------- basins
# India-WRIS CWC basin name -> name used by BASIN19 in src/widgets.jsx (so the water-potential panel still links)
BASIN_NAME = {
    "Brahamaputra": "Brahmaputra", "Ganga": "Ganga", "Godavari": "Godavari", "Krishna": "Krishna", "Mahanadi": "Mahanadi",
    "Narmada": "Narmada", "Indus (Up to border)": "Indus", "Cauvery": "Cauvery", "Tapi": "Tapi", "Mahi": "Mahi",
    "Sabarmati": "Sabarmati", "Pennar": "Pennar", "Subernarekha": "Subarnarekha", "Barak and Others": "Barak & others",
    "Brahmani and Baitarni": "Brahmani-Baitarani",
    "East flowing rivers between Pennar and Kanyakumari": "EFR Pennar–Kanyakumari",
    "East flowing rivers between Mahanadi and Pennar": "EFR Mahanadi–Pennar",
    "West flowing rivers from Tadri to Kanyakumari": "WFR Tadri–Kanyakumari",
    "West flowing rivers from Tapi to Tadri": "WFR Tapi–Tadri",
    "West flowing rivers of Kutch and Saurashtra including Luni": "WFR Kutch & Saurashtra incl. Luni",
    "Minor rivers draining into Myanmar and Bangladesh": "Minor rivers to Myanmar & Bangladesh",
}


def build_basins():
    ind = india().buffer(0.03)
    feats = json.load(open(f"{RAW}/wris_basins.geojson", encoding="utf8"))["features"]
    items, skipped = [], []
    for f in feats:
        nm = f["properties"].get("ba_name")
        if nm not in BASIN_NAME:
            skipped.append(nm)
            continue
        g = shape(f["geometry"]).buffer(0).intersection(ind)
        d = geom_d(g, 0.02)
        if d:
            items.append({"n": BASIN_NAME[nm], "code": f["properties"]["bacode"], "d": d})
    print("basins kept:", len(items), "| skipped (not a named CWC basin):", skipped)
    write("basins", {"source": "India-WRIS (CWC / NRSC), Common/Basin_WRP, BasinCWC layer", "licence": "India-WRIS copyright policy: free reproduction with the source acknowledged, accurately and not misleadingly", "years": "CWC basin delineation as served by India-WRIS", "built": BUILT, "basins": items})


# ---------------------------------------------------------------- rainfall
def read_imd_year(y):
    """IMD yearwise rain .GRD: float32 [days, 129 lat, 135 lon], lat 6.5..38.5, lon 66.5..100.0, -999 = no data."""
    path = f"{RAW}/imd/rain/{y}.grd"
    a = np.fromfile(path, dtype=np.float32)
    nd = a.size // (129 * 135)
    a = a.reshape(nd, 129, 135)
    a[a < -900] = np.nan
    return a, nd


def build_rainfall(y0=1991, y1=2020):
    ann, jjas = [], []
    for y in range(y0, y1 + 1):
        a, nd = read_imd_year(y)
        d = np.arange(nd)
        month = np.array([(datetime.date(y, 1, 1) + datetime.timedelta(int(i))).month for i in d])
        valid = ~np.isnan(a).all(axis=0)
        ann.append(np.where(valid, np.nansum(a, axis=0), np.nan))
        jjas.append(np.where(valid, np.nansum(a[(month >= 6) & (month <= 9)], axis=0), np.nan))
    ann, jjas = np.nanmean(ann, axis=0), np.nanmean(jjas, axis=0)            # mean over the years, per 0.25 deg cell
    # 2 x 2 block mean -> 0.5 deg cells; keep a coarse cell only if at least 2 of its 4 fine cells have data
    def coarse(z):
        z = z[:128, :134]
        b = z.reshape(64, 2, 67, 2).transpose(0, 2, 1, 3).reshape(64, 67, 4)
        n = (~np.isnan(b)).sum(axis=2)
        m = np.where(n >= 2, np.nanmean(np.where(np.isnan(b), np.nan, b), axis=2), np.nan)
        return m
    ca, cj = coarse(ann), coarse(jjas)
    # mask to India (cell centre inside the composite boundary buffered by one cell)
    from shapely.geometry import Point
    ind = india().buffer(0.3)
    inside = np.zeros_like(ca, dtype=bool)
    for r in range(64):
        for c in range(67):
            lat, lon = 6.625 + r * 0.5, 66.625 + c * 0.5          # centre of the 2 x 2 block (IMD grid points are cell centres)
            inside[r, c] = ind.contains(Point(lon + 0.0, lat))
    enc = lambda z: [int(round(v)) if (ok and not np.isnan(v)) else -1 for v, ok in zip(z.ravel(), inside.ravel())]
    out = {"source": "IMD Pune, 0.25 deg gridded daily rainfall (Pai et al. 2014), read with imdlib; mean of 30 years, averaged to 0.5 deg cells",
           "licence": "IMD data, free for non-commercial and educational use with acknowledgement (confirm IMD's data supply policy before reuse outside the course)",
           "years": f"{y0}-{y1}", "built": BUILT, "unit": "mm",
           "grid": {"lon0": 66.375, "lat0": 6.375, "step": 0.5, "nx": 67, "ny": 64},
           "annual": enc(ca), "jjas": enc(cj)}
    write("rainfall", out)
    a = np.array(out["annual"]); j = np.array(out["jjas"])
    print("cells with data:", int((a >= 0).sum()), "| annual mm range", int(a[a >= 0].min()), "-", int(a[a >= 0].max()), "| JJAS share of annual (mean) %.0f%%" % (100 * j[a >= 0].mean() / a[a >= 0].mean()))


# ---------------------------------------------------------------- dams
STATE_NAMES = {"AN": "Andaman & Nicobar", "AP": "Andhra Pradesh", "AR": "Arunachal Pradesh", "AS": "Assam", "BR": "Bihar",
               "CG": "Chhattisgarh", "GA": "Goa", "GJ": "Gujarat", "HP": "Himachal Pradesh", "HR": "Haryana", "JH": "Jharkhand",
               "JK": "Jammu & Kashmir", "KA": "Karnataka", "KL": "Kerala", "LK": "Ladakh", "MH": "Maharashtra", "ML": "Meghalaya",
               "MN": "Manipur", "MP": "Madhya Pradesh", "MZ": "Mizoram", "NL": "Nagaland", "OD": "Odisha", "PB": "Punjab",
               "RJ": "Rajasthan", "SK": "Sikkim", "TN": "Tamil Nadu", "TR": "Tripura", "TS": "Telangana", "UK": "Uttarakhand",
               "UP": "Uttar Pradesh", "WB": "West Bengal"}


def clean_type(t):
    t = re.sub(r"^[^A-Za-z]+", "", (t or "").replace("�", "")).strip().upper()
    if not t or t == "?":
        return 0, "Type not stated"
    if "ROCK" in t or "CFRD" in t:
        return 2, "Rockfill / CFRD"
    if "EARTH" in t:
        return 1, "Earthen / earthfill"
    return 3, "Other"


def build_dams():
    feats = json.load(open(f"{RAW}/wris_dams.json", encoding="utf8"))["features"]
    ind = india().buffer(0.3)
    from shapely.geometry import Point
    rows, lacking = [], 0
    for f in feats:
        a, g = f["attributes"], f.get("geometry") or {}
        lon, lat = g.get("x"), g.get("y")
        if lon is None or lat is None or not (66 < lon < 100 and 5 < lat < 38):
            lacking += 1
            continue
        t, _ = clean_type(a.get("dm_type"))
        rows.append((a.get("dm_name") or "", a.get("state") or "", a.get("rivcode") or "", a.get("bacode") or "", t,
                     a.get("dm_height"), a.get("grs_stor_c"), a.get("dm_cmp_yr") or 0, lon, lat, a.get("nrld_no") or ""))
    # The register has unit slips in gross storage (e.g. a small dam listed at 125,639 MCM). The largest Indian reservoir
    # (Indira Sagar) holds about 12,200 MCM, so anything above MAX_CAP_MCM cannot be right and is treated as "not stated".
    MAX_CAP_MCM = 13000
    outliers = [(r[0], r[1], r[6]) for r in rows if r[6] is not None and r[6] > MAX_CAP_MCM]
    rows = [r[:6] + ((r[6] if (r[6] is not None and r[6] <= MAX_CAP_MCM) else None),) + r[7:] for r in rows]
    print("capacity above", MAX_CAP_MCM, "MCM treated as not stated:", outliers)
    rows.sort(key=lambda r: -(r[6] or 0))                      # biggest first, so small dams draw on top
    states = sorted({r[1] for r in rows}); basins = sorted({r[3] for r in rows}); rivers = sorted({r[2] for r in rows})
    si, bi, ri = ({v: i for i, v in enumerate(l)} for l in (states, basins, rivers))
    cap = [r[6] if r[6] is not None else -1 for r in rows]
    print("dams plotted:", len(rows), "| without coordinates:", lacking, "| without capacity:", sum(1 for c in cap if c < 0))
    out = {"source": "India-WRIS (CWC / NWIC), Water Resource Project Data, DAM layer = National Register of Large Dams (NRLD)",
           "licence": "India-WRIS copyright policy: free reproduction with the source acknowledged, accurately and not misleadingly",
           "years": "register as served by India-WRIS; completion years 1800s-2020s; edition not stated by the service", "built": BUILT,
           "unit": "capacity in million m3 (MCM), height in m",
           "types": ["Type not stated", "Earthen / earthfill", "Rockfill / CFRD", "Other"],
           "states": states, "basins": basins, "rivers": rivers,
           "total": len(feats), "plotted": len(rows), "noCoordinates": lacking, "capacityOutliers": len(outliers), "maxCapacityMCM": MAX_CAP_MCM,
           "stateNames": STATE_NAMES,
           "id": [r[10] for r in rows], "name": [r[0] for r in rows],
           "x": [P(r[8], r[9])[0] for r in rows], "y": [P(r[8], r[9])[1] for r in rows],
           "st": [si[r[1]] for r in rows], "ba": [bi[r[3]] for r in rows], "rv": [ri[r[2]] for r in rows],
           "ty": [r[4] for r in rows], "h": [r[5] if r[5] is not None else -1 for r in rows], "cap": cap, "yr": [r[7] for r in rows]}
    write("dams", out)



# ---------------------------------------------------------------- evaporation and soil wetness (NASA POWER, MERRA-2 reanalysis)
POWER_URL = ("https://power.larc.nasa.gov/api/temporal/climatology/point?parameters=EVLAND,GWETTOP&community=AG"
             "&longitude={lon}&latitude={lat}&format=JSON&start=1991&end=2020")
MERRA_DLAT, MERRA_DLON = 0.5, 0.625              # native MERRA-2 grid; cell centres at lat -90 + 0.5 i, lon -180 + 0.625 j
MONTHS = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"]


def power_grid():
    """Rows/cols of MERRA-2 cells whose centre lies in India (buffered by 0.3 deg)."""
    from shapely.geometry import Point
    ind = india().buffer(0.3)
    lat_i = [i for i in range(round((5.5 + 90) / MERRA_DLAT), round((38 + 90) / MERRA_DLAT) + 1)]
    lon_j = [j for j in range(round((66 + 180) / MERRA_DLON), round((98.5 + 180) / MERRA_DLON) + 1)]
    return lat_i, lon_j, ind, Point


def fetch_power():
    import requests, concurrent.futures as cf, time
    os.makedirs(f"{RAW}/power", exist_ok=True)
    lat_i, lon_j, ind, Point = power_grid()
    todo = []
    for i in lat_i:
        for j in lon_j:
            lat, lon = -90 + MERRA_DLAT * i, -180 + MERRA_DLON * j
            if ind.contains(Point(lon, lat)):
                todo.append((i, j, lat, lon))

    def get(t):
        i, j, lat, lon = t
        f = f"{RAW}/power/{i}_{j}.json"
        if os.path.exists(f):
            return t, json.load(open(f))
        for attempt in range(5):
            try:
                r = requests.get(POWER_URL.format(lat=lat, lon=lon), timeout=60)
                if r.status_code == 200:
                    d = r.json()
                    json.dump({"parameter": d["properties"]["parameter"], "header": d["header"]}, open(f, "w"))
                    return t, json.load(open(f))
            except Exception:
                pass
            time.sleep(2 + attempt * 3)
        return t, None

    out = {}
    with cf.ThreadPoolExecutor(4) as ex:
        for n, (t, d) in enumerate(ex.map(get, todo), 1):
            out[(t[0], t[1])] = d
            if n % 200 == 0:
                print("  POWER points", n, "of", len(todo), flush=True)
    missing = [k for k, v in out.items() if v is None]
    print("POWER points:", len(todo), "| failed:", len(missing))
    return lat_i, lon_j, out


def power_layer(name, value_fn, unit, source, extra):
    lat_i, lon_j, pts = fetch_power()
    hdr = next(v for v in pts.values() if v)["header"]
    arrs = {k: [] for k in extra["series"]}
    flat = {k: [] for k in extra["series"]}
    for i in lat_i:                                    # south to north
        for j in lon_j:
            d = pts.get((i, j))
            vals = value_fn(d["parameter"]) if d else None
            for k in extra["series"]:
                v = None if vals is None else vals[k]
                flat[k].append(-1 if v is None or v < 0 else round(v, extra["round"]))
    out = {"source": source, "licence": "NASA POWER data are open; NASA asks that publications cite the service, version and access date, and notifies of redistribution (see data/README.md)",
           "years": hdr.get("range", "1991-2020"), "built": BUILT, "unit": unit, "api": hdr.get("api", {}), "dataSource": hdr.get("sources"),
           "grid": {"lon0": round(-180 + MERRA_DLON * (lon_j[0] - 0.5), 4), "lat0": -90 + MERRA_DLAT * (lat_i[0] - 0.5), "dlon": MERRA_DLON, "dlat": MERRA_DLAT, "nx": len(lon_j), "ny": len(lat_i)}}
    out.update(flat)
    write(name, out)
    for k, v in flat.items():
        a = np.array(v); a = a[a >= 0]
        print(f"  {k}: {len(a)} cells with data, range {a.min():g} - {a.max():g}, mean {a.mean():.3g}")


def build_evaporation():
    # EVLAND is land evaporation in mm/day; annual total = mean daily value x 365
    power_layer("evaporation", lambda p: {"annual": (p["EVLAND"]["ANN"] * 365 if p["EVLAND"]["ANN"] > -900 else None)}, "mm per year",
                "NASA POWER 30-year climatology, parameter EVLAND (Evaporation Land) from the MERRA-2 reanalysis (reanalysis, not a measurement); about 0.5 x 0.625 degree cells",
                {"series": ["annual"], "round": 0})


def build_soilmoisture():
    # GWETTOP is surface soil wetness, a 0-1 fraction of saturation (not volumetric m3/m3)
    def f(p):
        g = p["GWETTOP"]
        if g["ANN"] < -900:
            return {"annual": None, "monsoon": None, "dry": None}
        mean = lambda ms: sum(g[m] for m in ms) / len(ms)
        return {"annual": g["ANN"], "monsoon": mean(["JUN", "JUL", "AUG", "SEP"]), "dry": mean(["DEC", "JAN", "FEB", "MAR", "APR", "MAY"])}
    power_layer("soilmoisture", f, "fraction of saturation (0-1)",
                "NASA POWER 30-year climatology, parameter GWETTOP (Surface Soil Wetness) from the MERRA-2 reanalysis (reanalysis, not a measurement); about 0.5 x 0.625 degree cells",
                {"series": ["annual", "monsoon", "dry"], "round": 3})


LAYERS = {"states": build_states, "basins": build_basins, "rainfall": build_rainfall, "dams": build_dams, "evaporation": build_evaporation, "soilmoisture": build_soilmoisture}

if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    ap.add_argument("--layer", choices=list(LAYERS))
    a = ap.parse_args()
    for name in ([a.layer] if a.layer else LAYERS):
        LAYERS[name]()
