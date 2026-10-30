import numpy as np, pandas as pd, json, math
from scipy.spatial import Voronoi
from shapely.geometry import Polygon, Point, MultiPoint
from shapely.ops import voronoi_diagram
OUT="./data/"
rng=np.random.default_rng(633)
# ---------- 1. stations + catchment (S05, S09) ----------
lat0, lon0 = 12.90, 77.42
kx = 111.32*math.cos(math.radians(lat0)); ky = 110.57
def ll(x,y): return (round(lon0 + x/kx,5), round(lat0 + y/ky,5))
# catchment polygon in km (local)
poly_km = [(0,0),(2.2,-0.6),(4.6,-0.2),(6.8,0.9),(8.1,2.8),(8.4,5.0),(7.3,6.9),(5.6,7.8),(3.4,7.6),(1.7,6.4),(0.4,4.6),(-0.5,2.4)]
P = Polygon(poly_km)
print("catchment area km2", round(P.area,2))
st = {"TG1":(4.0,3.6),"TG2":(1.6,1.4),"TG3":(6.9,5.9),"TG4":(9.6,0.8)}
vor = voronoi_diagram(MultiPoint([Point(v) for v in st.values()]), envelope=P.buffer(20))
areas={}
for name,(x,y) in st.items():
    cell=[g for g in vor.geoms if g.contains(Point(x,y))][0]
    areas[name]=cell.intersection(P).area
tot=sum(areas.values())
w={k:v/tot for k,v in areas.items()}
print({k:(round(a,2),round(w[k],3)) for k,a in areas.items()})
pd.DataFrame([dict(station=k, lon=ll(*v)[0], lat=ll(*v)[1], storm_total_mm=None) for k,v in st.items()]).to_csv("/tmp/x.csv")
# ---------- storm ----------
g1_inc=[2,4,7,12,18,26,14,9,6,4,2,1]
totals={"TG1":sum(g1_inc),"TG2":86,"TG3":124,"TG4":71}
print("totals",totals)
stations=pd.DataFrame([dict(station=k, type=("recording (syphon)" if k=="TG1" else "non-recording (standard)"), lon=ll(*v)[0], lat=ll(*v)[1], storm_total_mm=totals[k]) for k,v in st.items()])
stations.to_csv(OUT+"U1_stations.csv",index=False)
# catchment geojson
gj={"type":"FeatureCollection","name":"U1_teaching_catchment","crs":{"type":"name","properties":{"name":"urn:ogc:def:crs:OGC:1.3:CRS84"}},
 "features":[{"type":"Feature","properties":{"name":"CE633 teaching catchment (synthetic)"},"geometry":{"type":"Polygon","coordinates":[[list(ll(*p)) for p in poly_km+[poly_km[0]]]]}}]}
json.dump(gj,open(OUT+"U1_catchment.geojson","w"))
arith=np.mean([totals[k] for k in ["TG1","TG2","TG3"]])  # stations inside
inside={k:P.contains(Point(v)) for k,v in st.items()}
print("inside",inside)
thiessen=sum(w[k]*totals[k] for k in st)
print("arith(inside)",round(arith,2),"thiessen",round(thiessen,2))
times=pd.date_range("2000-01-01 00:30",periods=12,freq="30min")
cum=np.cumsum(g1_inc)
storm=pd.DataFrame({"end_of_interval":times.strftime("%H:%M"),"TG1_incremental_mm":g1_inc,"TG1_cumulative_mm":cum})
storm.to_csv(OUT+"U1_storm_TG1_30min.csv",index=False)
# max intensities
inc=np.array(g1_inc)
for d in [1,2,4,6,12]:
    s=max(inc[i:i+d].sum() for i in range(len(inc)-d+1))
    print(f"max {d*0.5}h depth {s} mm intensity {s/(d*0.5):.1f} mm/h")
# ---------- 2. annual rainfall 1991-2020 ----------
yrs=np.arange(1991,2021)
regional=rng.normal(900,170,len(yrs)).clip(520,1400)
base={}
for s,f in zip("ABCDE",[0.95,1.08,0.88,1.12,1.0]):
    base[s]=np.round(regional*f*rng.normal(1,0.07,len(yrs)))
X=regional*1.02*rng.normal(1,0.06,len(yrs))
X[yrs>=2008]*=1.20
X=np.round(X)
ann=pd.DataFrame({"year":yrs,"X":X.astype(int),**{f"{s}":base[s].astype(int) for s in "ABCDE"}})
ann.to_csv(OUT+"U1_annual_rainfall_1991_2020.csv",index=False)
# DMC
ann["mean_ABCDE"]=ann[list("ABCDE")].mean(axis=1)
cx=ann.X.cumsum(); cb=ann.mean_ABCDE.cumsum()
pre=ann.year<2008
Ma=np.polyfit(cb[pre],cx[pre],1)[0]
Mc=np.polyfit(cb[~pre]-cb[~pre].iloc[0],cx[~pre]-cx[~pre].iloc[0],1)[0]
print("DMC slopes before",round(Ma,3),"after",round(Mc,3),"ratio Ma/Mc",round(Ma/Mc,3))
print("mean X pre",ann.X[pre].mean().round(1),"post raw",ann.X[~pre].mean().round(1),"post corrected",(ann.X[~pre]*Ma/Mc).mean().round(1))
print(ann.describe().round(0).to_string())
# moving average stats
mean=ann.X.mean(); print("X mean",round(mean,1))
# ---------- 3. annual max 1-day ----------
beta=24; mu=82
amax=np.round(mu - beta*np.log(-np.log(rng.uniform(0.02,0.98,len(yrs)))),1)
am=pd.DataFrame({"year":yrs,"max_1day_mm":amax})
am.to_csv(OUT+"U1_annual_max_1day_1991_2020.csv",index=False)
srt=np.sort(amax)[::-1]; N=len(srt)
T=(N+1)/np.arange(1,N+1)
print("top5",srt[:5],"T",T[:5].round(2))
print("mean,sd",amax.mean().round(1),amax.std(ddof=1).round(1))
# 10-yr by interpolation of Weibull
from numpy import interp
print("P10 from plotting (interp in logT)", np.interp(np.log(10),np.log(T[::-1]),srt[::-1]).round(1))
