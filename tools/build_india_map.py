"""Build data/india_map.json for the India rivers map (Session 1).

Sources (download first, into the folder given as argv[1]):
  india.geojson    DataMeet India composite boundary, CC BY 4.0
                   https://raw.githubusercontent.com/datameet/maps/master/Country/india-composite.geojson
  rivers10.geojson Natural Earth 1:10m rivers and lake centrelines, public domain
                   https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_10m_rivers_lake_centerlines.geojson
"""
import json, math, sys
from shapely.geometry import shape, mapping, LineString, MultiLineString
from shapely.ops import unary_union

src = sys.argv[1]
LON0, LAT1, K = 68.0, 37.6, 20.0
CX = math.cos(math.radians(22))
P = lambda lon, lat: (round((lon - LON0) * CX * K, 1), round((LAT1 - lat) * K, 1))

india = shape(json.load(open(f"{src}/india.geojson"))["features"][0]["geometry"]).buffer(0)
india_s = india.simplify(0.025, preserve_topology=True)
clip = india.buffer(0.08)

def ring_path(coords):
    pts = [P(x, y) for x, y in coords]
    return "M" + "L".join(f"{x} {y}" for x, y in pts) + "Z"

outline = []
for poly in getattr(india, "geoms", [india]):
    if poly.area < 0.00003: continue                      # keep small islands (Lakshadweep, Andaman & Nicobar)
    ps = poly.simplify(0.025, preserve_topology=True)
    if ps.is_empty or ps.area < poly.area * 0.3: ps = poly.simplify(0.002, preserve_topology=True)
    outline.append(ring_path(ps.exterior.coords))

# Natural Earth river name -> CWC basin
BASIN = {
 "Ganges": "Ganga", "Yamuna": "Ganga", "Ghäghara": "Ganga", "Gandak": "Ganga", "Son": "Ganga", "Chambal": "Ganga",
 "Betwa": "Ganga", "Banas": "Ganga", "Parbati": "Ganga", "Sapt": "Ganga",
 "Brahmaputra": "Brahmaputra", "Dihang": "Brahmaputra", "Luhit": "Brahmaputra", "Tista": "Brahmaputra", "Mamas": "Brahmaputra",
 "Balak": "Barak & others",
 "Indus": "Indus", "Sutlej": "Indus", "Beas": "Indus", "Ravi": "Indus", "Chenab": "Indus", "Jhelum": "Indus",
 "Godävari": "Godavari", "Wainganga": "Godavari", "Indravati": "Godavari",
 "Krishna": "Krishna", "Bhima": "Krishna", "Tungabhadra": "Krishna",
 "Cauvery": "Cauvery", "Kolidam": "Cauvery",
 "Mahäna Nadï": "Mahanadi", "Tel": "Mahanadi",
 "Brahmani": "Brahmani-Baitarani", "Sankh": "Brahmani-Baitarani",
 "Narmada": "Narmada", "Tapi": "Tapi", "Mahi": "Mahi", "Penner": "Pennar",
 "Palar": "EFR Pennar–Kanyakumari",
}
DISPLAY = {"Ganges": "Ganga", "Ghäghara": "Ghaghara", "Godävari": "Godavari", "Mahäna Nadï": "Mahanadi", "Balak": "Barak",
           "Mamas": "Manas", "Sapt": "Kosi (Sapt Kosi)", "Penner": "Pennar", "Dihang": "Siang (Dihang)", "Kolidam": "Kollidam"}
# unnamed Natural Earth lines identified by location
UNNAMED = [((85.2, 23.3), "Subarnarekha", "Subarnarekha"), ((77.8, 13.1), "Ponnaiyar", "EFR Pennar–Kanyakumari"),
           ((93.8, 26.7), "Subansiri", "Brahmaputra")]

rivers = []
for f in json.load(open(f"{src}/rivers10.geojson"))["features"]:
    g = shape(f["geometry"]); n = f["properties"].get("name"); rank = f["properties"].get("scalerank") or 9
    if not g.intersects(clip): continue
    if n is None:
        c0 = (g.geoms[0] if hasattr(g, "geoms") else g).coords[0]
        hit = [u for u in UNNAMED if abs(c0[0] - u[0][0]) < 0.15 and abs(c0[1] - u[0][1]) < 0.15]
        if not hit: continue
        name, basin = hit[0][1], hit[0][2]
    else:
        if n not in BASIN: continue
        name, basin = DISPLAY.get(n, n), BASIN[n]
    gi = g.intersection(clip).simplify(0.01)
    lines = getattr(gi, "geoms", [gi])
    d = "".join("M" + "L".join(f"{x} {y}" for x, y in (P(*c) for c in ln.coords)) for ln in lines if isinstance(ln, LineString) and len(ln.coords) > 1)
    if d: rivers.append({"n": name, "b": basin, "r": rank, "d": d})

w = round((97.5 - LON0) * CX * K); h = round((LAT1 - 6.5) * K)
cities = [["New Delhi", 77.21, 28.61], ["Mumbai", 72.88, 19.08], ["Kolkata", 88.36, 22.57], ["Chennai", 80.27, 13.08],
          ["Bengaluru", 77.59, 12.97], ["Hyderabad", 78.49, 17.39], ["Guwahati", 91.74, 26.14], ["Bhopal", 77.41, 23.26]]
out = {"w": w, "h": h, "outline": outline, "rivers": rivers,
       "cities": [[n, *P(lo, la)] for n, lo, la in cities],
       "credit": "Boundary: DataMeet India (CC BY 4.0). Rivers: Natural Earth (public domain)."}
json.dump(out, open(sys.argv[2], "w"), separators=(",", ":"), ensure_ascii=False)
print(len(outline), "outline rings;", len(rivers), "rivers;", w, "x", h)
