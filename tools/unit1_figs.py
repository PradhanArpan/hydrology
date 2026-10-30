import numpy as np, pandas as pd, json, math, matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
from matplotlib.patches import FancyBboxPatch
from shapely.geometry import Polygon, Point, MultiPoint
from shapely.ops import voronoi_diagram
IMG="./assets/img/"; D="./data/"
A="#0f5c7a"; A2="#8a4b12"; G="#2f6f3e"; GR="#7b8796"
plt.rcParams.update({"font.family":"DejaVu Sans","font.size":10,"axes.spines.top":False,"axes.spines.right":False,"axes.edgecolor":"#555","axes.titleweight":"bold","axes.titlesize":11})
def save(f,name):
    f.savefig(IMG+name,bbox_inches="tight",facecolor="white"); f.savefig("/tmp/"+name.replace(".svg",".png"),bbox_inches="tight",facecolor="white",dpi=80); plt.close(f)

# 1. Horton engineering representation (flow chart)
f,ax=plt.subplots(figsize=(8.6,5.4)); ax.set_xlim(0,100); ax.set_ylim(0,64); ax.axis("off")
def box(x,y,t,w=20,h=6,c=A):
    ax.add_patch(FancyBboxPatch((x-w/2,y-h/2),w,h,boxstyle="round,pad=0.4,rounding_size=1.2",fc="white",ec=c,lw=1.4))
    ax.text(x,y,t,ha="center",va="center",fontsize=9,color="#1d2733")
def arr(x1,y1,x2,y2,c="#555",rad=0):
    ax.annotate("",xy=(x2,y2),xytext=(x1,y1),arrowprops=dict(arrowstyle="-|>",color=c,lw=1.1,connectionstyle=f"arc3,rad={rad}"))
box(50,60,"Precipitation (P)",w=24)
box(14,49,"Interception",w=18); box(50,49,"Reaches ground",w=20); box(86,49,"Evaporation /\ntranspiration (E, T)",w=22,h=8,c=A2)
box(30,37,"Depression\nstorage",w=17,h=8); box(70,37,"Overland flow",w=18)
box(30,24,"Infiltration",w=17); box(70,24,"Surface runoff\nto streams",w=20,h=8)
box(14,11,"Soil moisture",w=17); box(43,11,"Interflow",w=15); box(70,11,"Groundwater\n(base flow)",w=18,h=8)
box(92,17,"Stream flow\nat outlet (R)",w=15,h=8,c=G)
arr(46,57,18,52); arr(50,57,50,52); arr(61,49,74.5,49,A2); arr(16,52.6,76,52.6,A2,-0.08)
arr(45,46,33,41); arr(55,46,67,40); arr(30,33,30,27); arr(70,34,70,28)
arr(27,21,16,14); arr(33,21,41,14); arr(35,21,64,13); arr(79,24,86,19); arr(79,11,86,15); arr(50,11,85,15)
arr(38.5,38,76,45,A2,0.15)
ax.text(50,1,"Simplified engineering representation of the hydrologic cycle for a catchment (after Horton)",ha="center",fontsize=8.5,color=GR)
save(f,"u1_cycle_flow.svg")

# 2. storm mass curve + hyetograph
s=pd.read_csv(D+"U1_storm_TG1_30min.csv")
t=np.arange(0.5,6.01,0.5)
f,(a1,a2)=plt.subplots(1,2,figsize=(9.2,3.4))
a1.bar(t-0.25,s.TG1_incremental_mm/0.5,width=0.48,color=A)
a1.set_xlabel("Time from start (h)"); a1.set_ylabel("Intensity (mm/h)"); a1.set_title("Hyetograph (30-min bars)")
a2.plot(np.r_[0,t],np.r_[0,s.TG1_cumulative_mm],"-o",color=A2,ms=4)
a2.set_xlabel("Time from start (h)"); a2.set_ylabel("Cumulative rainfall (mm)"); a2.set_title("Mass curve")
a2.annotate("steepest slope =\npeak intensity",xy=(2.75,58),xytext=(3.4,25),arrowprops=dict(arrowstyle="->",color="#555"),fontsize=9)
f.tight_layout(); save(f,"u1_storm.svg")

# 3. DMC
ann=pd.read_csv(D+"U1_annual_rainfall_1991_2020.csv")
ann["m"]=ann[list("ABCDE")].mean(axis=1)
cx=ann.X.cumsum()/1000; cb=ann.m.cumsum()/1000
f,ax=plt.subplots(figsize=(6,4.2))
pre=ann.year<2008
ax.plot(cb[pre],cx[pre],"o",color=A,ms=4,label="1991–2007")
ax.plot(cb[~pre],cx[~pre],"s",color=A2,ms=4,label="2008–2020")
k1=np.polyfit(cb[pre],cx[pre],1); xx=np.linspace(0,cb.iloc[-1],10)
ax.plot(xx,np.polyval(k1,xx),"--",color=A,lw=1)
i0=pre.sum()
ax.annotate("break ≈ 2008\n(gauge relocated)",xy=(cb.iloc[i0-1],cx.iloc[i0-1]),xytext=(cb.iloc[i0-1]-8,cx.iloc[i0-1]+7),arrowprops=dict(arrowstyle="->"),fontsize=9)
ax.set_xlabel("Cumulative mean annual rainfall, stations A–E (m)"); ax.set_ylabel("Cumulative annual rainfall, station X (m)")
ax.set_title("Double mass curve — station X"); ax.legend(frameon=False)
save(f,"u1_dmc.svg")

# moving average
f,ax=plt.subplots(figsize=(7.6,3.2))
ax.bar(ann.year,ann.A,color="#c9dbe3",label="Annual rainfall, station A")
ax.plot(ann.year,ann.A.rolling(3,center=True).mean(),color=A,lw=2,label="3-year moving average")
ax.plot(ann.year,ann.A.rolling(5,center=True).mean(),color=A2,lw=2,label="5-year moving average")
ax.axhline(ann.A.mean(),color=GR,ls=":",lw=1); ax.text(2020.6,ann.A.mean(),"mean",va="center",fontsize=8,color=GR)
ax.set_ylabel("mm"); ax.legend(frameon=False,fontsize=8.5,ncol=3,loc="upper left"); ax.set_ylim(0,1500)
save(f,"u1_moving_avg.svg")

# 4. Thiessen map
lat0, lon0 = 12.90, 77.42
poly_km = [(0,0),(2.2,-0.6),(4.6,-0.2),(6.8,0.9),(8.1,2.8),(8.4,5.0),(7.3,6.9),(5.6,7.8),(3.4,7.6),(1.7,6.4),(0.4,4.6),(-0.5,2.4)]
P=Polygon(poly_km); st={"TG1":(4.0,3.6),"TG2":(1.6,1.4),"TG3":(6.9,5.9),"TG4":(9.6,0.8)}
vor=voronoi_diagram(MultiPoint([Point(v) for v in st.values()]),envelope=P.buffer(20))
f,ax=plt.subplots(figsize=(5.6,5.0))
cols={"TG1":"#d7e9f0","TG2":"#e6f2e8","TG3":"#f7ebdd","TG4":"#eee8f7"}
for name,(x,y) in st.items():
    cell=[g for g in vor.geoms if g.contains(Point(x,y))][0]
    c=cell.intersection(P)
    if not c.is_empty:
        xs,ys=c.exterior.xy; ax.fill(xs,ys,color=cols[name],ec="none")
        ax.text(c.centroid.x,c.centroid.y-1.0 if name!="TG4" else c.centroid.y,f"{c.area:.1f} km²",ha="center",fontsize=8.5,color="#333")
    cc=cell.intersection(Polygon([(-1.5,-1.5),(11,-1.5),(11,9.5),(-1.5,9.5)]))
    xs,ys=cc.exterior.xy; ax.plot(xs,ys,color=GR,lw=0.8,ls="--")
xs,ys=P.exterior.xy; ax.plot(xs,ys,color=A,lw=2)
for name,(x,y) in st.items():
    ax.plot(x,y,"^",color="#1d2733",ms=8); ax.text(x+0.2,y+0.25,name,fontsize=9,weight="bold")
ax.set_aspect("equal"); ax.set_xlabel("km"); ax.set_ylabel("km"); ax.set_title("Thiessen polygons — teaching catchment (54.9 km²)")
save(f,"u1_thiessen.svg")

# 5. IDF
K,x,a,n=6.93,0.189,0.50,0.878
D_=np.linspace(0.17,24,300)
f,ax=plt.subplots(figsize=(6.4,4))
for T,c in zip([2,5,10,25,50,100],["#9cc3d3","#6aa6bf",A,"#b3753a",A2,"#5a2f0a"]):
    ax.plot(D_,K*T**x/(D_+a)**n,color=c,label=f"T = {T} yr")
ax.set_xscale("log"); ax.set_yscale("log"); ax.set_xlabel("Duration D (h)"); ax.set_ylabel("Intensity i (cm/h)")
ax.set_title("IDF curves, i = K·Tˣ/(D+a)ⁿ (illustrative constants)"); ax.legend(frameon=False,fontsize=8.5)
ax.grid(True,which="both",color="#e5e5e5",lw=0.6)
save(f,"u1_idf.svg")

# 6. Weibull plot of annual max
am=pd.read_csv(D+"U1_annual_max_1day_1991_2020.csv")
srt=np.sort(am.max_1day_mm.values)[::-1]; T=(len(srt)+1)/np.arange(1,len(srt)+1)
f,ax=plt.subplots(figsize=(6,3.8))
ax.semilogx(T,srt,"o",color=A,ms=4)
ax.set_xlabel("Return period T (years, Weibull)"); ax.set_ylabel("Annual max 1-day rainfall (mm)")
ax.set_title("Annual maxima, station X, 1991–2020"); ax.grid(True,which="both",color="#e5e5e5",lw=0.6)
save(f,"u1_weibull.svg")
print("ok")
