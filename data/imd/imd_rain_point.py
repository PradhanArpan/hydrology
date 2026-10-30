"""
CE633 Lab L17 - real IMD rainfall for a station location and its neighbours.

Downloads IMD's 0.25-degree gridded daily rainfall (Pai et al. 2014, from 1901)
with the imdlib package, takes the grid cell at your station and five
neighbouring cells, and writes:
  daily_rain.csv      date, X, A, B, C, D, E          (mm/day, blank = missing)
  annual_rain.csv     year, X, A, B, C, D, E, missing_days_X
The annual file has the same layout as data/U1_annual_rainfall_1991_2020.csv,
so you can paste it straight into the Double mass curve tool (Session 4).

Run in Google Colab or any Python 3:
    !pip install imdlib
    !python imd_rain_point.py --lat 12.97 --lon 77.59 --start 1991 --end 2020
"""
import argparse
import imdlib as imd
import numpy as np
import pandas as pd

p = argparse.ArgumentParser()
p.add_argument("--lat", type=float, default=12.97)   # Bengaluru (Central College / City)
p.add_argument("--lon", type=float, default=77.59)
p.add_argument("--start", type=int, default=1991)
p.add_argument("--end", type=int, default=2020)
p.add_argument("--dir", default="imd_data")
a = p.parse_args()

# 1. download (one .grd file per year, about 4 MB each) and open
imd.get_data("rain", a.start, a.end, fn_format="yearwise", file_dir=a.dir)
data = imd.open_data("rain", a.start, a.end, "yearwise", a.dir)
ds = data.get_xarray()
ds = ds.where(ds["rain"] != -999.0)          # -999 = no data (sea, or missing)

# 2. the station cell and five neighbours (grid spacing 0.25 deg = about 28 km)
snap = lambda v: round(v * 4) / 4
lat0, lon0 = snap(a.lat), snap(a.lon)
d = 0.25
cells = {"X": (lat0, lon0), "A": (lat0 + d, lon0), "B": (lat0 - d, lon0),
         "C": (lat0, lon0 - d), "D": (lat0, lon0 + d), "E": (lat0 - d, lon0 + d)}
daily = pd.DataFrame({k: ds["rain"].sel(lat=la, lon=lo, method="nearest").to_series()
                      for k, (la, lo) in cells.items()})
daily.index.name = "date"
daily.round(1).to_csv("daily_rain.csv")

# 3. annual totals; a year with more than 10 missing days is left blank
yr = daily.groupby(daily.index.year)
annual = yr.sum(min_count=1).where(yr.count() >= yr.size().values[:, None] - 10)
annual["missing_days_X"] = yr["X"].apply(lambda s: int(s.isna().sum()))
annual.index.name = "year"
annual.round(0).to_csv("annual_rain.csv")

print("Cells used (lat, lon):", cells)
print(annual.head())
print("Mean annual rainfall at X: %.0f mm" % annual["X"].mean())
