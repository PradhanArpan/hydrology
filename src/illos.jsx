// Course illustrations drawn as SVG (no photos). Many are clickable or animated.
import React, { useState, useMemo, useEffect, useRef } from "react";
import { Plot, path, Legend, C } from "./charts.jsx";

const P = { sky: "#e7f2f7", sky2: "#f7fbfd", sea: "#1f6f8f", sea2: "#2f86a8", land: "#9fbf84", land2: "#7ea563", soil: "#c9a878", soil2: "#b48e5c", gw: "#a9cfe0", rock: "#8d8273", cloud: "#ffffff", cloudS: "#c4d2dc", sun: "#e8b95a", text: "#0f1f3d", gold: "#c8973a" };
export function Illo({ title, kind = "Illustration", cap, children }) {
  return <div className="illo"><div className="ih"><b>{title}</b><span>{kind}</span></div><div className="ib">{children}{cap && <div className="cap">{cap}</div>}</div></div>;
}
const Arrow = ({ id, color = "#0f1f3d" }) => <marker id={id} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill={color} /></marker>;
function Cloud({ x, y, s = 1, fill = P.cloud }) {
  return <g transform={`translate(${x} ${y}) scale(${s})`}><path d="M-60 10 a26 26 0 0 1 20 -38 a34 34 0 0 1 62 -6 a24 24 0 0 1 40 22 a20 20 0 0 1 -6 40 h-104 a20 20 0 0 1 -12 -18z" fill={fill} stroke={P.cloudS} strokeWidth="2" /></g>;
}
function Tree({ x, y, s = 1 }) {
  return <g transform={`translate(${x} ${y}) scale(${s})`}><rect x="-3" y="-4" width="6" height="22" fill="#7a5a3a" /><circle cx="0" cy="-16" r="16" fill="#5f8f4a" /><circle cx="-10" cy="-8" r="11" fill="#6c9c55" /><circle cx="10" cy="-8" r="11" fill="#58864a" /></g>;
}
function Rain({ x0, x1, y0, n = 10, len = 14, color = "#2f86a8", dy = 0 }) {
  return <g>{Array.from({ length: n }).map((_, i) => { const x = x0 + (x1 - x0) * (i + 0.5) / n; return <line key={i} className="anim-fall" style={{ animationDelay: (i * 0.13 % 1.4) + "s" }} x1={x} y1={y0 + dy} x2={x - 4} y2={y0 + dy + len} stroke={color} strokeWidth="2" strokeLinecap="round" />; })}</g>;
}

/* ================= S01: interactive hydrologic cycle ================= */
const PROC = {
  evap: ["Evaporation", "Liquid water turns to vapour at the water surface, driven by solar energy, wind and the vapour-pressure deficit. Oceans supply most atmospheric moisture.", "Meteorologic model › Evapotranspiration method (continuous runs)", "S10–S11"],
  trans: ["Transpiration", "Water taken up by roots leaves the plant as vapour through the stomata of leaves. Evaporation + transpiration = evapotranspiration (ET).", "Meteorologic model › ET method; Subbasin › Canopy", "S14–S15"],
  cond: ["Condensation", "Rising air cools; when it falls below the dew point, vapour condenses on nuclei to form cloud droplets.", "— (handled by the weather; HMS starts from rainfall)", "S02"],
  adv: ["Vapour transport", "Winds carry moist air from the oceans over land — the south-west monsoon carries Arabian Sea moisture to the Western Ghats.", "—", "S02"],
  prec: ["Precipitation", "Condensed water falling to earth as rain, snow or hail when drops grow heavy enough. The main input to every hydrologic analysis.", "Meteorologic model › Precipitation method (gauges, design storms)", "S02–S08"],
  inter: ["Interception", "Rain caught on leaves and stems that evaporates without reaching the ground — a few mm per storm under dense canopy.", "Subbasin › Canopy method", "S10"],
  runoff: ["Surface runoff (overland flow)", "Water flowing over the ground when rainfall intensity exceeds infiltration capacity or the soil is saturated.", "Subbasin › Transform method (unit hydrograph)", "S16, S19–S27"],
  infil: ["Infiltration", "Entry of water through the ground surface into the soil. Controlled by soil type, moisture, cover and compaction.", "Subbasin › Loss method", "S12–S13"],
  perc: ["Percolation", "Downward movement of water through the unsaturated zone to the water table, recharging groundwater.", "Subbasin › Loss (soil-moisture accounting) and Baseflow methods", "S37–S38"],
  gw: ["Groundwater flow", "Slow flow in the saturated zone towards rivers, lakes and the sea; it sustains river flow in dry months (base flow).", "Subbasin › Baseflow method", "S21, S37–S40"],
  stream: ["Streamflow", "Surface runoff, interflow and base flow combine in channels and travel to the outlet.", "Reach › Routing method; Sink (outlet)", "S28–S34"],
  store: ["Surface storage", "Lakes, tanks and reservoirs store water and release it slowly; depressions hold small amounts on every slope.", "Subbasin › Surface method; Reservoir element", "S33, S42"],
};
function HydroCycle() {
  const [sel, setSel] = useState("prec"); const [anim, setAnim] = useState(true);
  const L = (id, x, y, w) => <g className="hot" onClick={() => setSel(id)}><rect x={x - w / 2} y={y - 13} width={w} height={22} rx="11" fill={sel === id ? P.gold : "#fff"} stroke={sel === id ? P.gold : "#c9c2b5"} /><text x={x} y={y + 3} fontSize="12.5" textAnchor="middle" fontWeight={sel === id ? 700 : 500} fill={P.text}>{PROC[id][0].split(" (")[0]}</text></g>;
  const hi = id => sel === id ? P.gold : "#0f1f3d";
  const d = PROC[sel];
  return <Illo title="The hydrologic cycle — click any process" kind="Interactive">
    <svg viewBox="0 0 960 500" className={"hc " + (anim ? "" : "paused")}>
      <defs>
        <linearGradient id="hcsky" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#7fb6d6" /><stop offset=".55" stopColor="#cfe5ef" /><stop offset="1" stopColor="#f3efe2" /></linearGradient>
        <radialGradient id="hcsun"><stop offset="0" stopColor="#fff7d6" /><stop offset=".35" stopColor="#ffe08a" /><stop offset=".6" stopColor="#ffd56b" stopOpacity=".55" /><stop offset="1" stopColor="#ffd56b" stopOpacity="0" /></radialGradient>
        <linearGradient id="hcsea" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#3f93b5" /><stop offset=".35" stopColor="#1f6f8f" /><stop offset="1" stopColor="#0d3b52" /></linearGradient>
        <linearGradient id="hcfar" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#9db6c6" /><stop offset="1" stopColor="#c7d6dd" /></linearGradient>
        <linearGradient id="hcmtn" x1="0" x2="1" y1="0" y2="1"><stop offset="0" stopColor="#7d9a6a" /><stop offset=".5" stopColor="#5f7f4c" /><stop offset="1" stopColor="#4b6a3c" /></linearGradient>
        <linearGradient id="hcshade" x1="0" x2="1"><stop offset="0" stopColor="#000" stopOpacity="0" /><stop offset="1" stopColor="#1d2b17" stopOpacity=".35" /></linearGradient>
        <linearGradient id="hcplain" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#a9c784" /><stop offset="1" stopColor="#86a865" /></linearGradient>
        <linearGradient id="hcsoil" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#b8875a" /><stop offset="1" stopColor="#8f6a46" /></linearGradient>
        <linearGradient id="hcgw" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#7fb3cc" /><stop offset="1" stopColor="#4d88a6" /></linearGradient>
        <linearGradient id="hcriver" x1="1" x2="0"><stop offset="0" stopColor="#6fb4d0" /><stop offset="1" stopColor="#2f86a8" /></linearGradient>
        <radialGradient id="hccl" cx=".45" cy=".35" r=".75"><stop offset="0" stopColor="#ffffff" /><stop offset=".7" stopColor="#eef3f6" /><stop offset="1" stopColor="#c9d6de" /></radialGradient>
        <radialGradient id="hcclD" cx=".45" cy=".3" r=".8"><stop offset="0" stopColor="#c3ccd3" /><stop offset=".6" stopColor="#8c99a4" /><stop offset="1" stopColor="#5f6d78" /></radialGradient>
        <linearGradient id="hcshaft" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#6c7e8c" stopOpacity=".55" /><stop offset="1" stopColor="#6c7e8c" stopOpacity="0" /></linearGradient>
        <pattern id="hcgrain" width="14" height="10" patternUnits="userSpaceOnUse"><circle cx="3" cy="3" r="1.3" fill="#7a5634" opacity=".45" /><circle cx="10" cy="7" r="1" fill="#e2c39b" opacity=".5" /></pattern>
        <pattern id="hcpore" width="16" height="12" patternUnits="userSpaceOnUse"><circle cx="4" cy="4" r="2.6" fill="#c7b08e" opacity=".55" /><circle cx="12" cy="9" r="2.2" fill="#b39a76" opacity=".5" /></pattern>
        <pattern id="hcrock" width="40" height="18" patternUnits="userSpaceOnUse"><path d="M0 9h40M20 0v9M0 18h40M10 9v9M30 9v9" stroke="#6e655a" strokeWidth="1" opacity=".6" /></pattern>
        <filter id="hcblur" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="1.4" /></filter>
        <filter id="hcblur4" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="4" /></filter>
        <filter id="hcshadow" x="-20%" y="-20%" width="140%" height="160%"><feDropShadow dx="0" dy="5" stdDeviation="4" floodColor="#42576a" floodOpacity=".25" /></filter>
        <clipPath id="hcseaclip"><rect x="0" y="318" width="272" height="182" /></clipPath>
        <Arrow id="ha" /><Arrow id="hag" color={P.gold} /><Arrow id="hab" color="#1f6f8f" />
      </defs>
      <rect width="960" height="500" fill="url(#hcsky)" />
      {/* sun */}
      <circle cx="880" cy="70" r="80" fill="url(#hcsun)" />
      <circle cx="880" cy="70" r="26" fill="#fff4c2" />
      {/* distant hills (haze) */}
      <path d="M420 300 L470 250 L520 262 L575 205 L625 222 L690 150 L735 175 L790 120 L845 160 L900 132 L960 170 L960 320 L420 320Z" fill="url(#hcfar)" opacity=".85" />
      {/* clouds: fair-weather over the sea, rain cloud over the hills */}
      <g className="hc-drift" filter="url(#hcshadow)">
        {[[-52, 8, 30, 18], [-18, -6, 34, 26], [20, -2, 32, 24], [52, 10, 26, 16], [0, 14, 70, 14]].map(([x, y, rx, ry], i) => <ellipse key={i} cx={150 + x} cy={110 + y} rx={rx} ry={ry} fill="url(#hccl)" />)}
      </g>
      <g className="hc-drift2" filter="url(#hcshadow)">
        {[[-80, 10, 38, 22], [-40, -10, 44, 32], [10, -16, 48, 36], [58, -4, 42, 28], [96, 10, 32, 20], [10, 16, 110, 18]].map(([x, y, rx, ry], i) => <ellipse key={i} cx={650 + x} cy={70 + y} rx={rx} ry={ry} fill="url(#hcclD)" />)}
      </g>
      <g className="hc-drift3" opacity=".9">{[[-30, 0, 26, 12], [0, -8, 30, 16], [30, 2, 24, 11]].map(([x, y, rx, ry], i) => <ellipse key={i} cx={360 + x} cy={58 + y} rx={rx} ry={ry} fill="url(#hccl)" />)}</g>
      {/* rain shaft and drops */}
      <path d="M575 92 L725 92 L700 230 L590 250Z" fill="url(#hcshaft)" filter="url(#hcblur4)" />
      {anim ? <g opacity=".85">{Array.from({ length: 26 }).map((_, i) => { const x = 585 + (i * 37) % 140, y = 92 + (i * 23) % 40; return <line key={i} className="hc-rain" style={{ animationDelay: (i * 0.11 % 1.1) + "s" }} x1={x} y1={y} x2={x - 3} y2={y + 13} stroke="#3c7fa3" strokeWidth="1.6" strokeLinecap="round" />; })}</g>
        : <g>{[600, 630, 660, 690].map(x => <line key={x} x1={x} y1="104" x2={x - 5} y2="140" stroke="#2f86a8" strokeWidth="2" />)}</g>}
      {/* ocean with moving waves */}
      <path d="M0 326 L272 326 L272 500 L0 500Z" fill="url(#hcsea)" />
      <g clipPath="url(#hcseaclip)"><g className="hc-wave">{[0, 1].map(k => <path key={k} d={`M${-60 + k * 0} ${330 + k * 14} ` + Array.from({ length: 12 }).map(() => "q15 -5 30 0 t30 0").join(" ")} stroke={k ? "#2a7a9b" : "#cfe9f3"} strokeWidth={k ? 1.5 : 2} fill="none" opacity={k ? 0.8 : 0.9} />)}</g></g>
      {[[40, 360], [120, 352], [200, 368], [80, 395]].map(([x, y], i) => <ellipse key={i} cx={x} cy={y} rx="14" ry="1.6" fill="#e9f6fb" opacity=".55" className="hc-glint" style={{ animationDelay: i * 0.7 + "s" }} />)}
      <text x="40" y="470" fontSize="15" fill="#e7f2f7" fontWeight="600">Ocean</text>
      {/* ground cross-section: soil, unsaturated zone, groundwater, bedrock */}
      <path d="M250 330 L330 322 L420 305 L520 285 L600 238 L680 168 L760 116 L840 152 L960 210 L960 500 L250 500Z" fill="url(#hcsoil)" />
      <path d="M250 330 L330 322 L420 305 L520 285 L600 238 L680 168 L760 116 L840 152 L960 210 L960 500 L250 500Z" fill="url(#hcpore)" />
      <path d="M262 352 L420 335 L560 318 L700 290 L820 270 L960 262 L960 500 L262 500Z" fill="url(#hcgw)" />
      <path d="M262 352 L420 335 L560 318 L700 290 L820 270 L960 262 L960 500 L262 500Z" fill="url(#hcgrain)" opacity=".7" />
      {anim && <g>{Array.from({ length: 14 }).map((_, i) => { const y = 372 + (i % 4) * 22; return <circle key={i} className="hc-seep" style={{ animationDelay: (i * 0.9) + "s" }} cx={930 - (i * 41) % 120} cy={y} r="2.2" fill="#e3f3fa" />; })}</g>}
      <path d="M262 352 L420 335 L560 318 L700 290 L820 270 L960 262" stroke="#1f6f8f" strokeWidth="2" strokeDasharray="7 5" fill="none" />
      <text x="800" y="258" fontSize="11.5" fill="#123d52" fontWeight="600">water table</text>
      <text x="720" y="330" fontSize="12.5" fill="#0d3b52" fontWeight="700">Groundwater (saturated zone)</text>
      <text x="610" y="282" fontSize="11.5" fill="#4a3018" fontWeight="600">unsaturated zone</text>
      <rect x="250" y="466" width="710" height="34" fill="#8d8273" /><rect x="250" y="466" width="710" height="34" fill="url(#hcrock)" />
      <text x="830" y="488" fontSize="11" fill="#f4f2ee">impervious rock</text>
      {/* land surface: plain and mountain with shading and snow */}
      <path d="M250 330 L330 322 L420 305 L520 285 L600 238 L680 168 L760 116 L840 152 L960 210 L960 228 L840 172 L760 136 L680 186 L600 254 L520 299 L420 317 L330 332 L250 340Z" fill="url(#hcplain)" />
      <path d="M560 262 L600 238 L680 168 L760 116 L840 152 L960 210 L960 232 L860 190 L780 160 L700 200 L620 250Z" fill="url(#hcmtn)" />
      <path d="M760 116 L840 152 L960 210 L960 232 L860 190 L780 160Z" fill="url(#hcshade)" />
      <path d="M722 140 L760 116 L800 134 L788 142 L774 134 L760 146 L746 136 Z" fill="#f7f9fb" />
      <path d="M760 116 L800 134 L788 142 L774 134Z" fill="#d9e2ea" />
      {/* lake with reflection, river with flowing water */}
      <ellipse cx="470" cy="300" rx="46" ry="8.5" fill="#2f86a8" /><ellipse cx="462" cy="298" rx="24" ry="2.2" fill="#d6eef7" opacity=".7" />
      <path d="M706 172 C650 232 590 250 540 278 S400 312 262 331" stroke="#1f6f8f" strokeWidth="8" fill="none" strokeLinecap="round" />
      <path d="M706 172 C650 232 590 250 540 278 S400 312 262 331" stroke="url(#hcriver)" strokeWidth="5" fill="none" strokeLinecap="round" />
      <path d="M706 172 C650 232 590 250 540 278 S400 312 262 331" stroke="#e3f3fa" strokeWidth="1.6" fill="none" className={anim ? "anim-flow" : ""} opacity=".9" />
      {/* vegetation: forest on the slope, trees on the plain, a village */}
      {[[330, 316, 1.05], [352, 312, 0.85], [372, 309, 1.15], [398, 304, 0.95], [575, 250, 0.9], [598, 240, 0.75], [622, 222, 0.8], [645, 202, 0.7], [662, 188, 0.65]].map(([x, y, k], i) => <g key={i} transform={`translate(${x} ${y}) scale(${k})`}>
        <ellipse cx="0" cy="18" rx="14" ry="3" fill="#2f3f22" opacity=".25" /><rect x="-2.5" y="0" width="5" height="18" fill="#6b4a2b" />
        {i % 3 === 1 ? <path d="M0 -34 L14 0 L-14 0Z M0 -24 L17 8 L-17 8Z" fill="#3f6b38" /> : <><circle cx="0" cy="-12" r="15" fill="#4f7d3e" /><circle cx="-8" cy="-6" r="10" fill="#5f8f4a" /><circle cx="8" cy="-8" r="10" fill="#466f37" /><circle cx="-3" cy="-17" r="7" fill="#79a85e" opacity=".8" /></>}
      </g>)}
      <g transform="translate(276 318)"><rect x="0" y="0" width="16" height="10" fill="#e9e1d2" /><path d="M-2 0 L8 -8 L18 0Z" fill="#a4553a" /><rect x="22" y="2" width="12" height="8" fill="#efe7da" /><path d="M20 2 L28 -4 L36 2Z" fill="#8c4a33" /></g>
      {/* evaporation from the ocean and lake, transpiration from the forest */}
      {anim && [60, 105, 150, 195, 240].map((x, i) => <path key={x} className="hc-wisp" style={{ animationDelay: i * 0.7 + "s" }} d={`M${x} 318 q9 -12 0 -24 q-9 -12 0 -24 q9 -12 0 -24`} stroke="#ffffff" strokeWidth="3" fill="none" strokeLinecap="round" filter="url(#hcblur)" />)}
      {anim && [455, 485].map((x, i) => <path key={x} className="hc-wisp" style={{ animationDelay: 1 + i * 1.1 + "s" }} d={`M${x} 292 q6 -9 0 -18 q-6 -9 0 -18`} stroke="#ffffff" strokeWidth="2.4" fill="none" strokeLinecap="round" filter="url(#hcblur)" />)}
      {anim && [340, 372, 398].map((x, i) => <path key={x} className="hc-wisp" style={{ animationDelay: 0.4 + i * 0.9 + "s" }} d={`M${x} 286 q5 -8 0 -16 q-5 -8 0 -16`} stroke="#e8f6ee" strokeWidth="2.2" fill="none" strokeLinecap="round" filter="url(#hcblur)" />)}
      {/* infiltration and percolation drops */}
      {anim && [[512, 296], [528, 293], [632, 262], [648, 256]].map(([x, y], i) => <circle key={i} className="hc-sink" style={{ animationDelay: i * 0.6 + "s" }} cx={x} cy={y} r="2.4" fill="#2f86a8" />)}
      {/* process arrows */}
      <path d="M130 300 L130 175" stroke={hi("evap")} strokeWidth="2" markerEnd={sel === "evap" ? "url(#hag)" : "url(#ha)"} />
      <path d="M380 270 L380 205" stroke={hi("trans")} strokeWidth="2" strokeDasharray="4 3" markerEnd={sel === "trans" ? "url(#hag)" : "url(#ha)"} />
      <path d="M235 95 C350 60 450 55 535 62" stroke={hi("adv")} strokeWidth="2" strokeDasharray="6 5" fill="none" markerEnd={sel === "adv" ? "url(#hag)" : "url(#ha)"} />
      <path d="M560 105 L545 165" stroke={hi("prec")} strokeWidth="2" markerEnd={sel === "prec" ? "url(#hag)" : "url(#ha)"} />
      <path d="M690 190 L610 248" stroke={hi("runoff")} strokeWidth="3" markerEnd={sel === "runoff" ? "url(#hag)" : "url(#ha)"} />
      <path d="M520 296 L520 322" stroke={hi("infil")} strokeWidth="2.5" markerEnd={sel === "infil" ? "url(#hag)" : "url(#ha)"} />
      <path d="M640 262 L640 298" stroke={hi("perc")} strokeWidth="2.5" strokeDasharray="4 3" markerEnd={sel === "perc" ? "url(#hag)" : "url(#ha)"} />
      <path d="M760 360 C620 380 450 395 300 395" stroke={hi("gw")} strokeWidth="2.5" fill="none" strokeDasharray="8 6" className={anim ? "anim-flow" : ""} markerEnd={sel === "gw" ? "url(#hag)" : "url(#ha)"} />
      {/* labels */}
      {L("evap", 130, 160, 100)}{L("cond", 150, 60, 112)}{L("adv", 390, 50, 132)}{L("prec", 520, 186, 112)}
      {L("trans", 380, 192, 112)}{L("inter", 300, 270, 100)}{L("runoff", 700, 232, 126)}{L("infil", 520, 345, 96)}
      {L("perc", 690, 312, 100)}{L("gw", 530, 420, 156)}{L("stream", 340, 352, 110)}{L("store", 470, 278, 132)}
    </svg>
    <div className="wg-row" style={{ marginTop: 10, alignItems: "flex-start" }}>
      <div className="detail" style={{ flex: "1 1 420px", marginTop: 0 }}><h4>{d[0]}</h4><p>{d[1]}</p></div>
      <div className="detail" style={{ flex: "1 1 260px", marginTop: 0 }}><b style={{ color: "#2d6a4f", fontSize: 12, letterSpacing: ".08em" }}>IN HEC-HMS</b><p style={{ margin: "2px 0 8px" }}>{d[2]}</p><b style={{ color: "#c8973a", fontSize: 12, letterSpacing: ".08em" }}>STUDIED IN</b><p style={{ margin: "2px 0 8px" }}>{d[3]}</p>
        <button className="btn ghost" onClick={() => setAnim(!anim)}>{anim ? "Pause animation" : "Play animation"}</button></div>
    </div>
  </Illo>;
}

/* ================= S01: Horton engineering representation ================= */
const HBOX = {
  atm: ["Atmosphere", "Source of precipitation; receives evaporation and transpiration.", "Meteorologic model"],
  veg: ["Vegetation (interception storage)", "Holds the first few mm of rain on leaves; loses it by evaporation.", "Canopy method"],
  surf: ["Ground surface (depression storage)", "Puddles and hollows fill before water runs off; water here evaporates or infiltrates.", "Surface method"],
  soil: ["Soil (soil-moisture storage)", "Infiltrated water wets the soil; it is used by plants, moves laterally as interflow or percolates down.", "Loss method"],
  aq: ["Aquifer (groundwater storage)", "Saturated zone recharged by percolation; releases base flow to streams slowly.", "Baseflow method"],
  ch: ["Channel (stream)", "Collects overland flow, interflow and base flow and carries it to the outlet.", "Transform + Reach routing"],
};
function Horton() {
  const [sel, setSel] = useState("soil"); const [hms, setHms] = useState(false);
  const B = (id, x, y, w, h) => <g className="hot" onClick={() => setSel(id)}><rect x={x} y={y} width={w} height={h} rx="8" fill={sel === id ? "#fff3c4" : "#fff"} stroke={sel === id ? P.gold : "#1a3260"} strokeWidth={sel === id ? 3 : 1.5} />
    <text x={x + w / 2} y={y + h / 2 - (hms ? 6 : 0)} fontSize="14" textAnchor="middle" fontWeight="600" fill="#1a3260">{HBOX[id][0].split(" (")[0]}</text>
    {hms && <text x={x + w / 2} y={y + h / 2 + 13} fontSize="12" textAnchor="middle" fill="#2d6a4f">HMS: {HBOX[id][2]}</text>}</g>;
  const A = (d, t, tx, ty, col = "#0f1f3d") => <g><path d={d} stroke={col} strokeWidth="2" fill="none" markerEnd="url(#hz)" /><text x={tx} y={ty} fontSize="12" fill={col} fontStyle="italic">{t}</text></g>;
  return <Illo title="Horton's engineering representation — storages and flows" kind="Interactive">
    <svg viewBox="0 0 900 430"><defs><Arrow id="hz" /></defs>
      {B("atm", 330, 10, 240, 52)}{B("veg", 60, 110, 220, 52)}{B("surf", 340, 110, 220, 52)}{B("soil", 340, 220, 220, 52)}{B("aq", 340, 330, 220, 52)}{B("ch", 660, 220, 200, 52)}
      {A("M400 62 L200 108", "precipitation", 210, 80)}{A("M450 62 L450 108", "throughfall", 458, 92)}
      {A("M110 110 C110 50 220 36 326 36", "evaporation", 120, 52, "#8a4b12")}{A("M520 110 L520 64", "evaporation", 528, 92, "#8a4b12")}
      {A("M280 136 L338 136", "drip", 290, 128)}{A("M450 162 L450 218", "infiltration", 458, 196)}
      {A("M560 136 C640 136 700 160 740 218", "overland flow", 640, 145)}{A("M560 246 L658 246", "interflow", 584, 238)}
      {A("M450 272 L450 328", "percolation", 458, 306)}{A("M560 356 C640 356 720 330 750 274", "base flow", 650, 368)}
      {A("M560 230 C620 120 600 80 572 62", "transpiration", 590, 175, "#8a4b12")}
      {A("M860 246 L895 246", "", 0, 0)}<text x="800" y="300" fontSize="13" fill="#2d6a4f" fontWeight="600">→ outlet</text>
    </svg>
    <div className="wg-row" style={{ alignItems: "center" }}><div className="detail" style={{ flex: 1, marginTop: 0 }}><h4>{HBOX[sel][0]}</h4>{HBOX[sel][1]} <b>HEC-HMS:</b> {HBOX[sel][2]}.</div>
      <button className="btn ghost" onClick={() => setHms(!hms)}>{hms ? "Hide" : "Show"} HEC-HMS names</button></div>
  </Illo>;
}

/* ================= S01: catchment and divides ================= */
// Smooth curve through points (Catmull-Rom as cubic Béziers).
function smoothPath(pts, closed) {
  const n = pts.length, g = i => (closed ? pts[(i + n) % n] : pts[Math.max(0, Math.min(n - 1, i))]);
  let d = `M${pts[0][0]} ${pts[0][1]}`;
  for (let i = 0; i < (closed ? n : n - 1); i++) {
    const p0 = g(i - 1), p1 = g(i), p2 = g(i + 1), p3 = g(i + 2);
    d += `C${(p1[0] + (p2[0] - p0[0]) / 6).toFixed(1)} ${(p1[1] + (p2[1] - p0[1]) / 6).toFixed(1)} ${(p2[0] - (p3[0] - p1[0]) / 6).toFixed(1)} ${(p2[1] - (p3[1] - p1[1]) / 6).toFixed(1)} ${p2[0]} ${p2[1]}`;
  }
  return closed ? d + "Z" : d;
}
// Plan and section share one horizontal scale: the section A–A is cut along the line y = 150 of the plan.
const CT_DIVIDE = [[211, 300], [170, 291], [120, 264], [80, 222], [62, 150], [84, 98], [130, 54], [190, 34], [250, 40], [302, 68], [338, 106], [352, 150], [342, 204], [302, 246], [258, 282]];
const CT_STREAMS = [
  { w: 4.2, p: [[211, 300], [206, 262], [214, 214], [206, 150], [222, 104], [232, 64]] },
  { w: 2.8, p: [[212, 218], [168, 196], [134, 172], [112, 150], [96, 112], [100, 78]] },
  { w: 2.8, p: [[214, 176], [250, 166], [270, 150], [296, 128], [318, 106]] },
  { w: 2, p: [[210, 256], [170, 246], [132, 230], [104, 214]] }, { w: 2, p: [[212, 236], [256, 226], [296, 206], [322, 190]] },
  { w: 1.8, p: [[220, 120], [184, 92], [160, 66], [156, 46]] }, { w: 1.8, p: [[228, 88], [270, 78], [300, 76]] },
];
const CT_CROSS = [[62, "1"], [112, "2"], [206, "3"], [270, "4"], [352, "5"]];            // where A–A meets the divide (1, 5) and the streams (2, 3, 4)
const CT_GROUND = [[0, 196], [20, 186], [62, 112], [86, 150], [112, 172], [148, 150], [178, 168], [206, 208], [236, 170], [270, 188], [310, 138], [352, 98], [385, 170], [420, 190]];
const groundAt = x => { for (let k = 0; k < CT_GROUND.length - 1; k++) { const [x0, y0] = CT_GROUND[k], [x1, y1] = CT_GROUND[k + 1]; if (x <= x1) { const t = (x - x0) / (x1 - x0); return y0 + (y1 - y0) * (1 - Math.cos(Math.PI * t)) / 2; } } return CT_GROUND[CT_GROUND.length - 1][1]; };
function Catchment() {
  const [tilt, setTilt] = useState(0);
  const sec = useMemo(() => {
    const xs = Array.from({ length: 141 }, (_, k) => k * 3), gy = xs.map(groundAt);
    const smooth = xs.map((x, k) => { let a = 0, n = 0; for (let m = -16; m <= 16; m++) { const q = gy[Math.max(0, Math.min(xs.length - 1, k + m))]; a += q; n++; } return a / n; });
    return { xs, gy, smooth };
  }, []);
  const dx = tilt * 6;                                               // phreatic divides shift toward the up-dip side of the impervious layer
  const base = x => 288 - tilt * (x - 210) / 210 * 2.4;
  const wt = sec.xs.map((x, k) => { const k2 = Math.max(0, Math.min(sec.xs.length - 1, Math.round((x - dx) / 3))); return Math.min(Math.max(sec.smooth[k2] + 24, sec.gy[k] + 4), base(x) - 8); });
  const line = ys => sec.xs.map((x, k) => `${k ? "L" : "M"}${x} ${ys[k].toFixed(1)}`).join("");
  const poly = (top, bot) => line(top) + sec.xs.slice().reverse().map(x => `L${x} ${bot(x).toFixed(1)}`).join("") + "Z";
  const half = (352 - 62) / 2, pct = Math.abs(Math.round(dx / half * 100));
  return <Illo title="A catchment and its divides" kind="Interactive" cap="Left: plan view. The dashed divide bounds all land draining to the outlet, and the dotted line A–A is where the section is cut. Right: section A–A on the same horizontal scale (matching numbers). Move the slider to tilt the impervious layer and watch the groundwater (phreatic) divides move away from the ridges.">
    <div className="illo-grid">
      <div className="cell"><svg viewBox="0 0 420 320" role="img" aria-label="Plan view of a drainage basin with its streams, divide and the line A–A"><defs><Arrow id="cz" color="#1f6f8f" /></defs>
        <rect width="420" height="320" fill="#efe9dc" />
        <path d={smoothPath(CT_DIVIDE, true)} fill="#e0ebd3" stroke="none" />
        {CT_STREAMS.map((r, i) => <path key={i} d={smoothPath(r.p, false)} stroke="#1f6f8f" strokeWidth={r.w} fill="none" strokeLinecap="round" />)}
        <path d={smoothPath(CT_DIVIDE, true)} fill="none" stroke="#0f1f3d" strokeWidth="2.5" strokeDasharray="9 6" />
        {[[104, 86, 122, 104], [292, 92, 276, 112], [150, 250, 168, 244], [300, 232, 284, 222], [180, 140, 196, 148], [250, 214, 236, 218]].map(([a, b, c, d], i) => <path key={i} d={`M${a} ${b}L${c} ${d}`} stroke="#1f6f8f" strokeWidth="1.5" markerEnd="url(#cz)" />)}
        {[[28, 60, 44, 76], [394, 200, 380, 184], [60, 270, 46, 284]].map(([a, b, c, d], i) => <path key={i} d={`M${a} ${b}L${c} ${d}`} stroke="#7d6e55" strokeWidth="1.5" strokeDasharray="3 3" />)}
        <text x="10" y="28" fontSize="11" fill="#6f6246">neighbouring catchments</text>
        <circle cx="211" cy="300" r="8" fill="#c8973a" stroke="#0f1f3d" /><text x="226" y="312" fontSize="13" fontWeight="700" fill="#0f1f3d">Outlet</text>
        <text x="246" y="26" fontSize="12.5" fill="#0f1f3d" fontWeight="600">divide (ridge line)</text>
        <line x1="30" y1="150" x2="390" y2="150" stroke="#8a4b12" strokeDasharray="3 3" /><text x="14" y="154" fontSize="12" fontWeight="700" fill="#8a4b12">A</text><text x="394" y="154" fontSize="12" fontWeight="700" fill="#8a4b12">A</text>
        {CT_CROSS.map(([x, n]) => <g key={n}><circle cx={x} cy="150" r="8.5" fill="#fff" stroke="#8a4b12" /><text x={x} y="154" fontSize="11" fontWeight="700" textAnchor="middle" fill="#8a4b12">{n}</text></g>)}
      </svg><h6>Plan view</h6><p>Every drop falling inside the dashed line ends up at the outlet.</p></div>
      <div className="cell"><svg viewBox="0 0 420 320" role="img" aria-label="Section A–A across the catchment: ridge, valley with stream, ridge, with the water table and the impervious layer below"><defs><Arrow id="cz2" color="#1f6f8f" /></defs>
        <rect width="420" height="320" fill="#fff" />
        <path d={poly(sec.gy, x => base(x))} fill={P.soil} />
        <path d={poly(wt, x => base(x))} fill={P.gw} opacity=".9" />
        <path d={`M0 ${base(0).toFixed(1)}L420 ${base(420).toFixed(1)}L420 320L0 320Z`} fill={P.rock} />
        <path d={line(wt)} fill="none" stroke="#1f6f8f" strokeWidth="1.6" strokeDasharray="5 3" />
        <path d={line(sec.gy)} stroke="#5f8f4a" strokeWidth="4" fill="none" strokeLinejoin="round" />
        <rect x="0" y="40" width="62" height="190" fill="#7d6e55" opacity=".13" /><rect x="352" y="40" width="68" height="190" fill="#7d6e55" opacity=".13" />
        {[62, 352].map(x => <line key={x} x1={x} y1="40" x2={x} y2="300" stroke="#0f1f3d" strokeDasharray="6 4" />)}
        {[62, 352].map(x => <line key={"p" + x} x1={x + dx} y1={groundAt(x) + 14} x2={x + dx} y2="300" stroke="#1f6f8f" strokeWidth="2.2" strokeDasharray="4 3" />)}
        {[112, 206, 270].map(x => <path key={x} d={`M${x} ${groundAt(x) - 34}L${x} ${groundAt(x) - 8}`} stroke="#1f6f8f" strokeWidth="2" markerEnd="url(#cz2)" />)}
        {CT_CROSS.map(([x, n]) => <g key={n}><circle cx={x} cy="22" r="8.5" fill="#fff" stroke="#8a4b12" /><text x={x} y="26" fontSize="11" fontWeight="700" textAnchor="middle" fill="#8a4b12">{n}</text></g>)}
        <text x="68" y="52" fontSize="10.5" fill="#0f1f3d" fontWeight="600">topographic</text><text x="68" y="64" fontSize="10.5" fill="#0f1f3d" fontWeight="600">divide</text><text x="346" y="52" fontSize="10.5" fill="#0f1f3d" fontWeight="600" textAnchor="end">topographic</text><text x="346" y="64" fontSize="10.5" fill="#0f1f3d" fontWeight="600" textAnchor="end">divide</text>
        <text x="206" y={groundAt(206) - 38} fontSize="11.5" fill="#1f6f8f" fontWeight="600" textAnchor="middle">stream</text>
        <text x="8" y="92" fontSize="10.5" fill="#6f6246">neighbouring</text><text x="8" y="104" fontSize="10.5" fill="#6f6246">catchment</text>
        <text x="412" y="92" fontSize="10.5" fill="#6f6246" textAnchor="end">neighbouring</text><text x="412" y="104" fontSize="10.5" fill="#6f6246" textAnchor="end">catchment</text>
        <text x="206" y="258" fontSize="11.5" fill="#0f1f3d" textAnchor="middle" fontWeight="600">groundwater (aquifer)</text><text x="206" y="272" fontSize="10.5" fill="#1f6f8f" textAnchor="middle">water table (dashed)</text>
        <text x="12" y="312" fontSize="11" fill="#f4f2ee">impervious layer</text>
        {tilt !== 0 && <text x="206" y="298" fontSize="11" fill="#1f6f8f" textAnchor="middle" fontWeight="600">phreatic divides</text>}
      </svg><label className="f" style={{ fontSize: 13 }}>Tilt of the impervious layer<input type="range" min="-10" max="10" value={tilt} onChange={e => setTilt(+e.target.value)} /></label>
        <p>{tilt === 0 ? "Divides coincide: the water budget closes." : `The groundwater divides sit about ${pct} % of the half-width away from the ridges — groundwater crosses under the ridge (it leaves the catchment on one side and enters it on the other), so the surface divide alone no longer closes the water budget.`}</p></div>
    </div>
  </Illo>;
}

/* ================= S01: India water in numbers ================= */
const PERCAP = [[1951, 5177], [1991, 2309], [2001, 1816], [2011, 1545], [2021, 1486], [2031, 1367]];
const BASINS = [["Ganga", 525.0, 250], ["Brahmaputra & Barak", 585.6, 24], ["Godavari", 110.5, 76.3], ["Indus (to border)", 73.3, 46], ["Krishna", 78.1, 58], ["Mahanadi", 66.9, 50], ["Narmada", 45.6, 34.5], ["Cauvery", 21.4, 19]];
function IndiaWater() {
  const [view, setView] = useState("percap"); const [sort, setSort] = useState("pot");
  const b = [...BASINS].sort((p, q) => sort === "pot" ? q[1] - p[1] : sort === "use" ? q[2] - p[2] : q[2] / q[1] - p[2] / p[1]);
  return <Illo title="India's water in numbers" kind="Interactive chart" cap={view === "percap" ? "Per capita annual water availability (m³/person/year). 2021 and 2031 are projections. Below 1,700 = water-stressed; below 1,000 = water-scarce. Source: Ministry of Jal Shakti / CWC estimates." : "Average annual water-resource potential and utilisable surface water by basin (km³). Source: CWC basin assessments (as on the course slides)."}>
    <div className="seg" style={{ marginBottom: 10 }}><button className={view === "percap" ? "on" : ""} onClick={() => setView("percap")}>Per capita availability</button><button className={view === "basins" ? "on" : ""} onClick={() => setView("basins")}>Basins: potential vs utilisable</button></div>
    {view === "percap" ? <Plot w={900} h={320} xFmt={v => String(v)} x={[1945, 2035]} y={[0, 5600]} xLabel="Year" yLabel="m³ per person per year">{(sx, sy) => <>
      <rect x={sx(1945)} y={sy(1700)} width={sx(2035) - sx(1945)} height={sy(1000) - sy(1700)} fill="#fbe9e1" /><rect x={sx(1945)} y={sy(1000)} width={sx(2035) - sx(1945)} height={sy(0) - sy(1000)} fill="#f3cdbf" />
      <text x={sx(1947)} y={sy(1700) + 14} fontSize="11.5" fill="#9a3b1a">water stress (&lt; 1,700)</text><text x={sx(1947)} y={sy(1000) + 14} fontSize="11.5" fill="#9a3b1a">water scarcity (&lt; 1,000)</text>
      <path d={path(PERCAP, sx, sy)} stroke={C.navy} strokeWidth="2.6" fill="none" />
      {PERCAP.map(([x, y]) => <g key={x}><circle cx={sx(x)} cy={sy(y)} r="5" fill={x > 2015 ? "#fff" : C.navy} stroke={C.navy} strokeWidth="2" /><text x={sx(x)} y={sy(y) - 10} fontSize="12" textAnchor="middle" fill={C.navy} fontWeight="600">{y.toLocaleString("en-IN")}</text></g>)}
    </>}</Plot> : <>
      <div className="seg" style={{ marginBottom: 8 }}><button className={sort === "pot" ? "on" : ""} onClick={() => setSort("pot")}>Sort by potential</button><button className={sort === "use" ? "on" : ""} onClick={() => setSort("use")}>by utilisable</button><button className={sort === "frac" ? "on" : ""} onClick={() => setSort("frac")}>by % utilisable</button></div>
      <svg viewBox="0 0 900 330">{b.map(([n, p, u], i) => { const y = 10 + i * 39, s = 560 / 600; return <g key={n}><text x="170" y={y + 20} fontSize="13" textAnchor="end" fill="#1a3260">{n}</text>
        <rect x="180" y={y + 4} width={p * s} height="14" fill="#9cc3d3" /><rect x="180" y={y + 20} width={u * s} height="14" fill={C.gold} />
        <text x={186 + p * s} y={y + 16} fontSize="11.5" fill="#5a5048">{p} km³</text><text x={186 + u * s} y={y + 32} fontSize="11.5" fill="#7a5a12">{u} ({Math.round(100 * u / p)} %)</text></g>; })}</svg>
      <Legend items={[["#9cc3d3", "average annual potential"], [C.gold, "utilisable surface water"]]} /></>}
  </Illo>;
}

/* ================= S02: forms (icons) ================= */
export function FormIcon({ k }) {
  const g = { rain: <g>{[[60, 40, 1], [110, 70, 1.4], [160, 35, 0.6], [80, 100, 1.2], [140, 110, 0.9]].map(([x, y, s], i) => <path key={i} transform={`translate(${x} ${y}) scale(${s})`} d="M0 -14 C6 -4 10 2 10 7 a10 10 0 0 1 -20 0 C-10 2 -6 -4 0 -14Z" fill="#2f86a8" />)}</g>,
    drizzle: <g>{Array.from({ length: 30 }).map((_, i) => <circle key={i} cx={20 + (i * 37) % 180} cy={20 + (i * 53) % 120} r="2.2" fill="#5a9fbf" />)}</g>,
    snow: <g stroke="#5a9fbf" strokeWidth="3" strokeLinecap="round">{[[100, 75, 40], [40, 40, 16], [165, 115, 18]].map(([x, y, r], i) => <g key={i} transform={`translate(${x} ${y})`}>{[0, 60, 120].map(a => <g key={a} transform={`rotate(${a})`}><line x1={-r} y1="0" x2={r} y2="0" /><line x1={r * 0.6} y1="0" x2={r * 0.85} y2={-r * 0.25} /><line x1={r * 0.6} y1="0" x2={r * 0.85} y2={r * 0.25} /><line x1={-r * 0.6} y1="0" x2={-r * 0.85} y2={-r * 0.25} /><line x1={-r * 0.6} y1="0" x2={-r * 0.85} y2={r * 0.25} /></g>)}</g>)}</g>,
    hail: <g>{[[70, 70, 34], [140, 90, 22], [150, 40, 14]].map(([x, y, r], i) => <g key={i}><circle cx={x} cy={y} r={r} fill="#e8f1f5" stroke="#9cb8c6" strokeWidth="2" /><circle cx={x} cy={y} r={r * 0.65} fill="none" stroke="#c4d8e2" /><circle cx={x} cy={y} r={r * 0.32} fill="#fff" stroke="#c4d8e2" /></g>)}<text x="70" y="125" fontSize="12" textAnchor="middle" fill="#5a5048">layers of ice</text></g>,
    dew: <g><path d="M20 120 C60 40 150 20 190 30 C160 70 110 110 20 120Z" fill="#6c9c55" /><path d="M20 120 C80 85 140 50 190 30" stroke="#4a7a3a" strokeWidth="2" fill="none" />{[[80, 78, 6], [120, 62, 8], [150, 48, 5], [60, 96, 5]].map(([x, y, r], i) => <circle key={i} cx={x} cy={y} r={r} fill="#d6eef7" stroke="#5a9fbf" />)}</g>,
    frost: <g><rect x="10" y="10" width="180" height="120" rx="8" fill="#eef5f8" />{Array.from({ length: 9 }).map((_, i) => <g key={i} transform={`translate(${25 + (i % 3) * 65} ${30 + Math.floor(i / 3) * 38})`} stroke="#8fb5c8" strokeWidth="1.5">{[0, 45, 90, 135].map(a => <line key={a} transform={`rotate(${a})`} x1="-12" y1="0" x2="12" y2="0" />)}</g>)}</g>,
    glaze: <g><rect x="10" y="20" width="180" height="16" fill="#8d8273" />{[30, 60, 90, 120, 150, 175].map((x, i) => <path key={x} d={`M${x - 7} 36 L${x} ${70 + (i % 3) * 22} L${x + 7} 36Z`} fill="#d6eef7" stroke="#8fb5c8" />)}<rect x="10" y="20" width="180" height="6" fill="#d6eef7" opacity=".8" /></g> };
  return <svg viewBox="0 0 200 140" style={{ background: "#f7fbfd", borderRadius: 6 }}>{g[k]}</svg>;
}

/* ================= S03: rain gauges (Symons', syphon animation, weighing) ================= */
function SymonsDiagram() {
  return <svg viewBox="0 0 360 330"><defs><Arrow id="sy" color="#8a4b12" /></defs>
    <rect width="360" height="330" fill="#fff" />
    <rect x="40" y="290" width="280" height="30" fill="#c9c2b5" /><text x="180" y="310" fontSize="12" textAnchor="middle" fill="#3a332c">concrete block 600 × 600 × 600</text>
    <rect x="120" y="140" width="120" height="150" fill="#e8e4dc" stroke="#3a332c" strokeWidth="2" />
    <rect x="148" y="190" width="64" height="96" rx="8" fill="#d6eef7" stroke="#1f6f8f" strokeWidth="2" /><rect x="150" y="250" width="60" height="34" fill="#9cc3d3" />
    <path d="M110 70 L250 70 L250 110 L192 160 L192 196 L168 196 L168 160 L110 110Z" fill="#f4f2ee" stroke="#3a332c" strokeWidth="2" />
    <line x1="110" y1="50" x2="250" y2="50" stroke="#8a4b12" markerStart="url(#sy)" markerEnd="url(#sy)" /><text x="180" y="44" fontSize="13" textAnchor="middle" fill="#8a4b12" fontWeight="700">127 mm (5 in) rim</text>
    <line x1="270" y1="70" x2="270" y2="290" stroke="#8a4b12" markerStart="url(#sy)" markerEnd="url(#sy)" /><text x="276" y="185" fontSize="12" fill="#8a4b12">≈ 305 mm</text>
    <text x="40" y="95" fontSize="12.5" fill="#0f1f3d">funnel</text><text x="30" y="215" fontSize="12.5" fill="#0f1f3d">metal container</text><text x="220" y="240" fontSize="12.5" fill="#1f6f8f">collecting bottle</text>
    <text x="180" y="20" fontSize="12" textAnchor="middle" fill="#5a5048">rim horizontal, ≈ 30 cm above ground</text>
  </svg>;
}
function SyphonGauge() {
  const [I, setI] = useState(24); const [run, setRun] = useState(false); const [t, setT] = useState(0); const [trace, setTrace] = useState([[0, 0]]);
  const CAP = 10, SIM = 10; // 10 mm chamber; 1 s real = 10 simulated minutes
  useEffect(() => { if (!run) return; const id = setInterval(() => { setT(tt => { const nt = tt + SIM / 10; setTrace(tr => [...tr, [nt, (tr[tr.length - 1][1] + I * (SIM / 10) / 60)]].slice(-400)); return nt; }); }, 100); return () => clearInterval(id); }, [run, I]);
  const total = trace[trace.length - 1][1], level = total % CAP, syphons = Math.floor(total / CAP), hours = t / 60;
  const reset = () => { setRun(false); setT(0); setTrace([[0, 0]]); };
  const W = 360, H = 170, tmax = Math.max(120, t);
  const pts = trace.map(([tt, c]) => [12 + tt / tmax * (W - 24), H - 14 - (c % CAP) / CAP * (H - 28)]);
  let dpath = ""; pts.forEach((p, i) => { const prev = pts[i - 1]; dpath += (i && p[1] > prev[1] + 2 ? "L" + p[0] + " " + (H - 14) + " L" : i ? "L" : "M") + p[0].toFixed(1) + " " + p[1].toFixed(1); });
  return <div className="wg-row" style={{ alignItems: "flex-start" }}>
    <div className="wg-col" style={{ maxWidth: 300 }}><svg viewBox="0 0 280 320">
      <rect width="280" height="320" fill="#fff" />
      <path d="M70 20 L170 20 L130 70 L110 70Z" fill="#f4f2ee" stroke="#3a332c" strokeWidth="2" />
      {run && <Rain x0={80} x1={160} y0={-6} n={6} len={10} />}
      <rect x="80" y="100" width="80" height="180" fill="#f7fbfd" stroke="#3a332c" strokeWidth="2" />
      <rect x="82" y={278 - level / CAP * 176} width="76" height={level / CAP * 176} fill="#9cc3d3" />
      <rect x="95" y={262 - level / CAP * 176} width="50" height="16" rx="3" fill="#c8973a" stroke="#7a5a12" /><text x="120" y={274 - level / CAP * 176} fontSize="10" textAnchor="middle" fill="#0f1f3d">float</text>
      <line x1="120" y1={262 - level / CAP * 176} x2="120" y2="85" stroke="#7a5a12" strokeWidth="2" /><line x1="120" y1="85" x2="210" y2={85 + (1 - level / CAP) * 120} stroke="#7a5a12" strokeWidth="2" />
      <circle cx="210" cy={85 + (1 - level / CAP) * 120} r="4" fill="#9a3b1a" /><text x="216" y={80 + (1 - level / CAP) * 120} fontSize="10" fill="#9a3b1a">pen</text>
      <path d="M160 110 L190 110 L190 300 L175 300" stroke="#1f6f8f" strokeWidth="5" fill="none" /><text x="196" y="250" fontSize="11" fill="#1f6f8f">syphon</text>
      <text x="120" y="300" fontSize="11" textAnchor="middle" fill="#5a5048">float chamber (10 mm)</text>
      <path d="M120 70 L120 100" stroke="#2f86a8" strokeWidth="3" />
    </svg></div>
    <div className="wg-col">
      <label className="f">Rain intensity: <b>{I} mm/h</b><input type="range" min="2" max="80" value={I} onChange={e => setI(+e.target.value)} /></label>
      <div className="btn-row" style={{ marginBottom: 8 }}><button className="btn" onClick={() => setRun(!run)}>{run ? "Pause" : "Start rain"}</button><button className="btn ghost" onClick={reset}>Reset</button></div>
      <svg viewBox={`0 0 ${W} ${H}`} style={{ background: "#fffdf6", border: "1px solid #e8e4dc", borderRadius: 6 }}>
        {[0, 2, 4, 6, 8, 10].map(m => <g key={m}><line x1="12" x2={W - 12} y1={H - 14 - m / CAP * (H - 28)} y2={H - 14 - m / CAP * (H - 28)} stroke="#efe6cf" /><text x="2" y={H - 11 - m / CAP * (H - 28)} fontSize="8" fill="#a09080">{m}</text></g>)}
        <path d={dpath} stroke="#9a3b1a" strokeWidth="1.8" fill="none" />
      </svg>
      <div className="kpis"><Kpi v={(hours).toFixed(1) + " h"} l="Simulated time" /><Kpi v={syphons} l="Syphon emptyings" /><Kpi v={total.toFixed(1) + " mm"} l="Total = 10 × emptyings + last reading" /></div>
      <p className="note">The chart is a saw-tooth: each climb is 10 mm, each vertical drop is the syphon emptying the chamber. Total rain = 10 mm × number of drops + the final pen reading. The slope of each climb is the intensity.</p>
    </div>
  </div>;
}
function Kpi({ v, l }) { return <div className="kpi"><div className="v">{v}</div><div className="l">{l}</div></div>; }
function WeighingDiagram() {
  return <svg viewBox="0 0 360 330"><rect width="360" height="330" fill="#fff" />
    <path d="M110 30 L250 30 L200 80 L160 80Z" fill="#f4f2ee" stroke="#3a332c" strokeWidth="2" />
    <rect x="125" y="110" width="110" height="90" rx="6" fill="#d6eef7" stroke="#1f6f8f" strokeWidth="2" /><rect x="127" y="160" width="106" height="38" fill="#9cc3d3" />
    <text x="180" y="150" fontSize="12" textAnchor="middle" fill="#1f6f8f">bucket</text>
    <path d="M150 200 l10 12 l-20 12 l20 12 l-20 12 l20 12 l-10 10" stroke="#3a332c" strokeWidth="2" fill="none" /><path d="M210 200 l10 12 l-20 12 l20 12 l-20 12 l20 12 l-10 10" stroke="#3a332c" strokeWidth="2" fill="none" />
    <rect x="100" y="270" width="160" height="14" fill="#8d8273" /><text x="180" y="304" fontSize="12" textAnchor="middle" fill="#3a332c">spring balance / load cell</text>
    <rect x="270" y="110" width="70" height="110" fill="#fffdf6" stroke="#a09080" /><path d="M278 205 C290 200 295 180 305 170 S325 130 334 125" stroke="#9a3b1a" strokeWidth="2" fill="none" /><text x="305" y="236" fontSize="11" textAnchor="middle" fill="#5a5048">chart = mass curve</text>
    <line x1="235" y1="160" x2="270" y2="160" stroke="#7a5a12" strokeDasharray="3 2" />
  </svg>;
}
// Weighing-bucket gauge simulation: the catch is weighed continuously, so the pen draws the mass curve directly (no resets).
function WeighingGauge() {
  const [I, setI] = useState(12); const [run, setRun] = useState(false); const [t, setT] = useState(0); const [trace, setTrace] = useState([[0, 0]]);
  const CAP = 150, SIM = 10; // bucket holds 150 mm of rain; 1 s real = 10 simulated minutes
  useEffect(() => {
    if (!run) return;
    const id = setInterval(() => setT(tt => { const nt = tt + SIM / 10; setTrace(tr => { const last = tr[tr.length - 1][1]; return last >= CAP ? tr : [...tr, [nt, Math.min(CAP, last + I * (SIM / 10) / 60)]].slice(-600); }); return nt; }), 100);
    return () => clearInterval(id);
  }, [run, I]);
  const total = trace[trace.length - 1][1], hours = t / 60, full = total >= CAP;
  const reset = () => { setRun(false); setT(0); setTrace([[0, 0]]); };
  const W = 360, H = 190, tmax = Math.max(180, t), cmax = Math.max(30, Math.ceil(total / 10) * 10 + 10);
  const px = tt => 34 + tt / tmax * (W - 46), py = c => H - 22 - c / cmax * (H - 36);
  const d = trace.map(([tt, c], i) => (i ? "L" : "M") + px(tt).toFixed(1) + " " + py(c).toFixed(1)).join("");
  const sink = Math.min(46, total / CAP * 46);                       // spring compresses as the catch gets heavier
  const level = Math.min(64, total / CAP * 64), sh = (82 - sink) / 6;
  return <div className="wg-row" style={{ alignItems: "flex-start" }}>
    <div className="wg-col" style={{ maxWidth: 300 }}><svg viewBox="0 0 280 320" role="img" aria-label="Weighing-bucket rain gauge: the bucket sinks as rain collects">
      <rect width="280" height="320" fill="#fff" />
      <path d="M60 16 L220 16 L170 62 L110 62Z" fill="#f4f2ee" stroke="#3a332c" strokeWidth="2" />
      {run && !full && <Rain x0={85} x1={195} y0={-8} n={7} len={10} />}
      <g transform={`translate(0 ${sink})`}>
        <rect x="80" y="100" width="120" height="84" rx="6" fill="#eaf5fa" stroke="#1f6f8f" strokeWidth="2.2" />
        <rect x="82" y={182 - level} width="116" height={level} fill="#8dbdd0" />
        <text x="140" y="124" fontSize="12" textAnchor="middle" fill="#1f6f8f">bucket + catch</text>
        <rect x="70" y="184" width="140" height="8" fill="#8d8273" />
      </g>
      <path d={`M110 ${192 + sink} l9 ${sh} l-18 ${sh} l18 ${sh} l-18 ${sh} l18 ${sh} l-9 ${sh}`} stroke="#3a332c" strokeWidth="2.2" fill="none" />
      <path d={`M170 ${192 + sink} l9 ${sh} l-18 ${sh} l18 ${sh} l-18 ${sh} l18 ${sh} l-9 ${sh}`} stroke="#3a332c" strokeWidth="2.2" fill="none" />
      <rect x="60" y="274" width="160" height="16" fill="#8d8273" /><text x="140" y="308" fontSize="11.5" textAnchor="middle" fill="#3a332c">springs / load cell (weigh the catch)</text>
      <line x1="205" y1={146 + sink} x2="240" y2={146 + sink} stroke="#9a3b1a" strokeWidth="2" /><circle cx="240" cy={146 + sink} r="4" fill="#9a3b1a" /><text x="246" y={134 + sink} fontSize="11" fill="#9a3b1a">pen</text>
    </svg></div>
    <div className="wg-col">
      <label className="f">Rain intensity: <b>{I} mm/h</b> (change it while it runs)<input type="range" min="0" max="60" value={I} onChange={e => setI(+e.target.value)} /></label>
      <div className="btn-row" style={{ marginBottom: 8 }}><button className="btn" onClick={() => setRun(!run)} disabled={full}>{run ? "Pause" : "Start rain"}</button><button className="btn ghost" onClick={reset}>Empty the bucket</button></div>
      <svg viewBox={`0 0 ${W} ${H}`} style={{ background: "#fffdf6", border: "1px solid #e8e4dc", borderRadius: 6 }} role="img" aria-label="Mass curve drawn by the gauge">
        {[0, 1, 2, 3, 4].map(k => { const c = cmax * k / 4; return <g key={k}><line x1="34" x2={W - 12} y1={py(c)} y2={py(c)} stroke="#efe6cf" /><text x="30" y={py(c) + 3} fontSize="8.5" textAnchor="end" fill="#8a7a62">{Math.round(c)}</text></g>; })}
        <text x="6" y="12" fontSize="9" fill="#8a7a62">accumulated rain (mm)</text><text x={W - 12} y={H - 6} fontSize="9" textAnchor="end" fill="#8a7a62">time (h)</text>
        <path d={d} stroke="#9a3b1a" strokeWidth="2" fill="none" />
      </svg>
      <div className="kpis"><Kpi v={hours.toFixed(1) + " h"} l="Simulated time" /><Kpi v={total.toFixed(1) + " mm"} l="Total catch (read straight off the chart)" /><Kpi v={full ? "full" : (CAP - total).toFixed(0) + " mm"} l="Room left in the bucket" /></div>
      <p className="note">There is no sawtooth here: the bucket is never emptied by the gauge, so the pen draws the mass curve directly. Steeper = heavier rain; flat = dry spell. The slope of the line is the intensity. A weighing gauge also records snow and hail, because it weighs whatever falls in. Change the intensity while it runs to see the slope change.</p>
    </div>
  </div>;
}
function SymonsOnly() {
  return <Illo title="Symons' gauge — how it works" kind="Interactive"><div className="wg-row" style={{ alignItems: "flex-start" }}>
    <div className="wg-col" style={{ maxWidth: 360 }}><SymonsDiagram /></div>
    <div className="wg-col"><div className="detail" style={{ marginTop: 0 }}><h4>Symons' gauge (non-recording)</h4>IMD's standard non-recording gauge. Rain passes through a 127 mm funnel into a bottle and is measured daily at 08:30 IST with a graduated glass to 0.1 mm. It gives only the 24-hour total, not when or how hard the rain fell. The recording gauges (tipping-bucket, weighing-bucket and float) are covered below.</div></div>
  </div></Illo>;
}
function FloatSim() {
  return <Illo title="Float (natural syphon) gauge — simulation" kind="Interactive"><SyphonGauge /></Illo>;
}
function WeighSim() {
  return <Illo title="Weighing-bucket gauge — simulation" kind="Interactive"><WeighingGauge /></Illo>;
}

const Gauges = SymonsOnly;

/* ================= S03: a storm and a sparse network ================= */
const CATCH = [[0, 0], [2.2, -0.6], [4.6, -0.2], [6.8, 0.9], [8.1, 2.8], [8.4, 5.0], [7.3, 6.9], [5.6, 7.8], [3.4, 7.6], [1.7, 6.4], [0.4, 4.6], [-0.5, 2.4]];
const inside = (pt, poly) => { let c = false; for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) { const [xi, yi] = poly[i], [xj, yj] = poly[j]; if ((yi > pt[1]) !== (yj > pt[1]) && pt[0] < (xj - xi) * (pt[1] - yi) / (yj - yi) + xi) c = !c; } return c; };
function StormNetwork() {
  const [n, setN] = useState(3); const [st, setSt] = useState([5.5, 5.2]); const [r, setR] = useState(2.2); const [drag, setDrag] = useState(false);
  const W = 520, H = 440, X0 = -1.5, X1 = 9.5, Y0 = -1.5, Y1 = 8.8, sx = x => (x - X0) / (X1 - X0) * W, sy = y => H - (y - Y0) / (Y1 - Y0) * H;
  const rain = (x, y) => 10 + 90 * Math.exp(-((x - st[0]) ** 2 + (y - st[1]) ** 2) / (2 * r * r));
  const grid = useMemo(() => { const g = []; for (let x = -0.5; x <= 8.5; x += 0.25) for (let y = -0.6; y <= 7.8; y += 0.25) if (inside([x, y], CATCH)) g.push([x, y]); return g; }, []);
  const truth = grid.reduce((s, p) => s + rain(p[0], p[1]), 0) / grid.length;
  const gauges = useMemo(() => { const out = []; const cand = [[4, 3.6], [1.6, 1.4], [6.9, 5.9], [2.2, 5.6], [6.2, 1.6], [4.2, 6.6], [7.5, 3.6], [0.6, 3.2], [3.2, 0.6], [5.6, 4.6], [2.8, 3.0], [5.0, 2.2]]; for (let i = 0; i < n; i++) out.push(cand[i]); return out; }, [n]);
  const est = gauges.reduce((s, g) => s + rain(g[0], g[1]), 0) / gauges.length, err = 100 * (est - truth) / truth;
  const ref = useRef();
  const move = e => { if (!drag) return; const b = ref.current.getBoundingClientRect(); setSt([X0 + (e.clientX - b.left) / b.width * (X1 - X0), Y0 + (1 - (e.clientY - b.top) / b.height) * (Y1 - Y0)]); };
  return <Illo title="Why one gauge is not enough — drag the storm" kind="Interactive" cap="The shaded cell is a convective storm. The true catchment rainfall is computed over the whole area; the gauge estimate is the average of what the gauges catch. Add gauges and the error shrinks — the idea behind the optimum-number formula.">
    <div className="wg-row" style={{ alignItems: "flex-start" }}>
      <div className="wg-col" style={{ flex: "1 1 380px" }}><svg ref={ref} viewBox={`0 0 ${W} ${H}`} onPointerMove={move} onPointerUp={() => setDrag(false)} onPointerLeave={() => setDrag(false)} style={{ background: "#fbfaf7", borderRadius: 8, border: "1px solid #e8e4dc", touchAction: "none" }}>
        <defs><radialGradient id="stg"><stop offset="0" stopColor="#1f6f8f" stopOpacity=".75" /><stop offset=".55" stopColor="#5a9fbf" stopOpacity=".35" /><stop offset="1" stopColor="#9cc3d3" stopOpacity="0" /></radialGradient></defs>
        <polygon points={CATCH.map(p => sx(p[0]) + "," + sy(p[1])).join(" ")} fill="#eef4e8" stroke="#1a5f7a" strokeWidth="2.5" />
        <circle cx={sx(st[0])} cy={sy(st[1])} r={(sx(r * 2.6) - sx(0))} fill="url(#stg)" onPointerDown={e => { e.target.setPointerCapture && e.target.setPointerCapture(e.pointerId); setDrag(true); }} style={{ cursor: "grab" }} />
        <g pointerEvents="none"><Cloud x={sx(st[0]) + 8} y={sy(st[1]) - 12} s={0.55} fill="#f2f5f7" /></g>
        {gauges.map((g, i) => <g key={i}><polygon points={`${sx(g[0])},${sy(g[1]) - 9} ${sx(g[0]) - 8},${sy(g[1]) + 6} ${sx(g[0]) + 8},${sy(g[1]) + 6}`} fill="#0f1f3d" /><text x={sx(g[0]) + 10} y={sy(g[1]) + 4} fontSize="12" fill="#0f1f3d" fontWeight="600">{rain(g[0], g[1]).toFixed(0)}</text></g>)}
      </svg></div>
      <div className="wg-col">
        <label className="f">Number of gauges: <b>{n}</b><input type="range" min="1" max="12" value={n} onChange={e => setN(+e.target.value)} /></label>
        <label className="f">Storm size (radius): <b>{r.toFixed(1)} km</b><input type="range" min="1" max="6" step="0.1" value={r} onChange={e => setR(+e.target.value)} /></label>
        <div className="kpis"><Kpi v={truth.toFixed(1) + " mm"} l="True catchment mean" /><Kpi v={est.toFixed(1) + " mm"} l="Mean of gauges" /></div>
        <div className="kpi" style={{ background: Math.abs(err) < 10 ? "#e4f1ea" : "#fbe9e1" }}><div className="v" style={{ color: Math.abs(err) < 10 ? "#2d6a4f" : "#9a3b1a" }}>{err > 0 ? "+" : ""}{err.toFixed(1)} %</div><div className="l">Error of the gauge estimate</div></div>
        <p className="note">Try a small storm (radius 1–1.5 km) with 2–3 gauges: the error can exceed ±40 %. Large frontal storms (radius 5–6 km) are caught well by almost any network.</p>
      </div>
    </div>
  </Illo>;
}

/* ================= S05: three methods on one interpolated field ================= */
function ThreeMethods() {
  const G0 = [{ n: "A", p: [1.2, 1.0], P: 48 }, { n: "B", p: [4.6, 0.8], P: 62 }, { n: "C", p: [7.0, 3.0], P: 81 }, { n: "D", p: [5.6, 6.5], P: 75 }, { n: "E", p: [2.2, 5.6], P: 57 }, { n: "F", p: [4.0, 3.8], P: 70 }];
  const [g, setG] = useState(G0); const [show, setShow] = useState("iso"); const [step, setStep] = useState(10);
  const W = 520, H = 440, X0 = -1.5, X1 = 9.5, Y0 = -1.5, Y1 = 8.8, sx = x => (x - X0) / (X1 - X0) * W, sy = y => H - (y - Y0) / (Y1 - Y0) * H;
  const idw = (x, y) => { let a = 0, b = 0; for (const s of g) { const d2 = (x - s.p[0]) ** 2 + (y - s.p[1]) ** 2; if (d2 < 1e-6) return s.P; const w = 1 / d2; a += w * s.P; b += w; } return a / b; };
  const D = 0.2, cells = useMemo(() => { const c = []; for (let x = -0.6; x <= 8.5; x += D) for (let y = -0.7; y <= 7.9; y += D) if (inside([x + D / 2, y + D / 2], CATCH)) c.push([x, y, idw(x + D / 2, y + D / 2)]); return c; }, [g]);
  const near = (x, y) => { let bi = 0, bd = 1e9; g.forEach((s, i) => { const d = (x - s.p[0]) ** 2 + (y - s.p[1]) ** 2; if (d < bd) { bd = d; bi = i; } }); return bi; };
  const lo = Math.floor(Math.min(...g.map(s => s.P)) / step) * step;
  const band = v => Math.floor((v - lo) / step);
  const shades = ["#eaf3f7", "#cfe4ee", "#a9cfe0", "#7fb4cc", "#5a9fbf", "#3a84a6", "#1f6f8f", "#165a75"];
  const thW = g.map((_, i) => cells.filter(c => near(c[0] + D / 2, c[1] + D / 2) === i).length / cells.length);
  const ins = g.filter(s => inside(s.p, CATCH)), arith = ins.reduce((a, s) => a + s.P, 0) / ins.length;
  const thiessen = g.reduce((a, s, i) => a + s.P * thW[i], 0);
  const bandAreas = {}; cells.forEach(c => { const b = band(c[2]); bandAreas[b] = (bandAreas[b] || 0) + 1; });
  const iso = Object.entries(bandAreas).reduce((a, [b, n]) => a + (lo + (+b + 0.5) * step) * n, 0) / cells.length;
  const exact = cells.reduce((a, c) => a + c[2], 0) / cells.length;
  return <Illo title="Arithmetic, Thiessen and isohyetal — on the same storm" kind="Interactive" cap="Rainfall between gauges is interpolated (inverse-distance weighting) and banded like isohyets. Thiessen view colours each gauge's zone. Edit the gauge values and compare the three means.">
    <div className="wg-row" style={{ alignItems: "flex-start" }}>
      <div className="wg-col" style={{ flex: "1 1 380px" }}>
        <div className="seg" style={{ marginBottom: 8 }}>{[["arith", "Arithmetic"], ["thiessen", "Thiessen"], ["iso", "Isohyetal"]].map(([k, l]) => <button key={k} className={show === k ? "on" : ""} onClick={() => setShow(k)}>{l}</button>)}</div>
        <svg viewBox={`0 0 ${W} ${H}`} style={{ background: "#fbfaf7", borderRadius: 8, border: "1px solid #e8e4dc" }}>
          {show !== "arith" && cells.map((c, i) => <rect key={i} x={sx(c[0])} y={sy(c[1] + D)} width={sx(D) - sx(0) + 0.6} height={sy(0) - sy(D) + 0.6} fill={show === "iso" ? shades[Math.min(7, band(c[2]))] : ["#d7e9f0", "#e4f1ea", "#f7ebdd", "#eee8f7", "#fbe9e1", "#fff3c4"][near(c[0] + D / 2, c[1] + D / 2)]} />)}
          <polygon points={CATCH.map(p => sx(p[0]) + "," + sy(p[1])).join(" ")} fill={show === "arith" ? "#eef4e8" : "none"} stroke="#0f1f3d" strokeWidth="2.5" />
          {g.map(s => <g key={s.n}><circle cx={sx(s.p[0])} cy={sy(s.p[1])} r="6" fill="#c8973a" stroke="#0f1f3d" /><text x={sx(s.p[0]) + 9} y={sy(s.p[1]) - 6} fontSize="13" fontWeight="700" fill="#0f1f3d">{s.n} · {s.P}</text></g>)}
        </svg>
        {show === "iso" && <div className="legend-row">{Array.from({ length: 8 }).map((_, b) => bandAreas[b] ? <span key={b} style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 12.5 }}><i style={{ width: 14, height: 14, background: shades[b], display: "inline-block", border: "1px solid #ccc" }} />{lo + b * step}–{lo + (b + 1) * step} mm: {(100 * bandAreas[b] / cells.length).toFixed(0)} %</span> : null)}</div>}
      </div>
      <div className="wg-col">
        <table><thead><tr><th>Gauge</th><th>P (mm)</th><th>Thiessen weight</th></tr></thead><tbody>{g.map((s, i) => <tr key={s.n}><td>{s.n}</td><td><input type="number" value={s.P} onChange={e => setG(g.map((x, j) => j === i ? { ...x, P: +e.target.value || 0 } : x))} /></td><td>{thW[i].toFixed(3)}</td></tr>)}</tbody></table>
        <label className="f" style={{ marginTop: 8 }}>Isohyet interval: <b>{step} mm</b><input type="range" min="5" max="20" step="5" value={step} onChange={e => setStep(+e.target.value)} /></label>
        <div className="kpis"><Kpi v={arith.toFixed(1)} l="Arithmetic (mm)" /><Kpi v={thiessen.toFixed(1)} l="Thiessen (mm)" /><Kpi v={iso.toFixed(1)} l="Isohyetal (mm)" /></div>
        <p className="note">The interpolated field itself averages {exact.toFixed(1)} mm. The isohyetal mean approaches it as the interval gets finer — and depends on how the isohyets are drawn, which is why it needs judgement by hand.</p>
        <button className="btn ghost" onClick={() => setG(G0)}>Reset values</button>
      </div>
    </div>
  </Illo>;
}

/* ================= S08: depth–area–duration ================= */
function DAD() {
  const [K, setK] = useState(0.0012); const [nn, setN] = useState(0.55); const [A, setA] = useState(1000);
  const durs = [[1, 8.5, "#9cc3d3"], [6, 12, "#5a9fbf"], [12, 19, C.river], [18, 25, C.navy]];
  const As = []; for (let a = 10; a <= 5000; a *= 1.12) As.push(a);
  return <Illo title="Depth–area–duration: average depth falls as area grows" kind="Interactive" cap="Horton's relation P̄ = P₀·exp(−K·Aⁿ) for four durations (P₀ = maximum depth at the storm centre, cm). Left: the same storm seen as isohyets — the larger the area you average over, the more low-rainfall fringe you include.">
    <div className="wg-row" style={{ alignItems: "flex-start" }}>
      <div className="wg-col" style={{ maxWidth: 300 }}><svg viewBox="0 0 280 280"><rect width="280" height="280" fill="#fbfaf7" />
        {[120, 95, 72, 50, 30].map((r, i) => <ellipse key={r} cx="140" cy="140" rx={r * 1.1} ry={r * 0.85} fill={["#eaf3f7", "#cfe4ee", "#a9cfe0", "#5a9fbf", "#1f6f8f"][i]} />)}
        <ellipse cx="140" cy="140" rx={Math.min(132, 6 + Math.sqrt(A) * 1.8)} ry={Math.min(102, 5 + Math.sqrt(A) * 1.4)} fill="none" stroke="#c8973a" strokeWidth="3" strokeDasharray="6 4" />
        <text x="140" y="270" fontSize="12" textAnchor="middle" fill="#5a5048">dashed: averaging area {Math.round(A)} km²</text></svg></div>
      <div className="wg-col"><Plot w={560} h={300} xLog x={[10, 5000]} y={[0, 28]} xLabel="Area (km², log)" yLabel="Max. average depth (cm)">{(sx, sy) => <>
        {durs.map(([d, P0, c]) => <path key={d} d={path(As.map(a => [a, P0 * Math.exp(-K * a ** nn)]), sx, sy)} stroke={c} strokeWidth="2.4" fill="none" />)}
        <line x1={sx(A)} x2={sx(A)} y1={sy(0)} y2={sy(28)} stroke={C.gold} strokeDasharray="4 3" />
        {durs.map(([d, P0, c]) => <circle key={d} cx={sx(A)} cy={sy(P0 * Math.exp(-K * A ** nn))} r="4.5" fill={c} />)}</>}</Plot>
        <Legend items={durs.map(([d, , c]) => [c, d + "-hour"])} />
        <label className="f">Area: <b>{Math.round(A)} km²</b><input type="range" min="10" max="5000" value={A} onChange={e => setA(+e.target.value)} /></label>
        <div className="wg-row"><label className="f" style={{ flex: 1 }}>K: <b>{K}</b><input type="range" min="0.0002" max="0.004" step="0.0001" value={K} onChange={e => setK(+e.target.value)} /></label><label className="f" style={{ flex: 1 }}>n: <b>{nn}</b><input type="range" min="0.3" max="0.8" step="0.01" value={nn} onChange={e => setN(+e.target.value)} /></label></div>
      </div>
    </div>
  </Illo>;
}

/* ================= Software: HEC-HMS window tour ================= */
const HMSPARTS = [
  ["Menu bar", "File (new/open/save project), Components (create basin, meteorologic and control components; data managers), GIS (terrain tools), Parameters, Compute (create and run simulations), Results.", [20, 46, 940, 22]],
  ["Toolbar", "Element creation tools — subbasin, reach, reservoir, junction, diversion, source, sink — plus zoom/pan and the Compute Current Run button.", [20, 70, 940, 26]],
  ["Watershed Explorer", "The project tree. Three tabs at its foot: Components (everything you build), Compute (simulation runs and analyses) and Results (outputs of computed runs).", [28, 104, 250, 230]],
  ["Component Editor", "Parameters of whatever is selected in the Explorer or on the map. For a subbasin the tabs are Subbasin (area, downstream, methods), Loss, Transform, Baseflow and Options.", [28, 340, 250, 140]],
  ["Desktop", "Where the basin map, graphs and tables open. Elements are drawn and connected here.", [286, 104, 666, 376]],
  ["Message Log", "Notes, warnings and errors from every action. Always read it after a compute — red ERROR lines say what went wrong and where.", [28, 486, 924, 48]],
];
function HmsTour() {
  const [k, setK] = useState(2);
  return <Illo title="Tour of the HEC-HMS window — click a region" kind="Interactive" cap="Schematic drawn for this course (not a screenshot). Labels may differ slightly between HEC-HMS 4.x versions.">
    <div style={{ position: "relative" }}><img src="assets/img/labs/hms_window.svg" alt="HEC-HMS window schematic" style={{ width: "100%", display: "block" }} />
      <svg viewBox="0 0 980 640" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>{HMSPARTS.map(([t, , r], i) => <rect key={t} className="hot" x={r[0]} y={r[1]} width={r[2]} height={r[3]} fill={i === k ? "rgba(200,151,58,.18)" : "rgba(0,0,0,0)"} stroke={i === k ? "#c8973a" : "transparent"} strokeWidth="3" onClick={() => setK(i)} />)}</svg></div>
    <div className="detail"><h4>{HMSPARTS[k][0]}</h4>{HMSPARTS[k][1]}</div>
  </Illo>;
}
const ELEMS = [
  ["Subbasin", "Generates runoff from precipitation: losses → excess → transform to a hydrograph → plus baseflow.", s => <polygon points="10,30 30,8 56,14 62,40 36,54 14,48" fill="#e4f1ea" stroke="#2d6a4f" strokeWidth="3" />],
  ["Reach", "Routes a hydrograph down a channel (lag, Muskingum, kinematic wave…).", s => <path d="M6 50 C20 10 44 50 60 10" stroke="#1f6f8f" strokeWidth="5" fill="none" />],
  ["Junction", "Combines flows from two or more upstream elements.", s => <circle cx="34" cy="32" r="16" fill="#fff" stroke="#0f1f3d" strokeWidth="3" />],
  ["Reservoir", "Stores water and releases it through outlets and spillways (storage routing).", s => <path d="M8 44 L60 44 L52 16 L16 16Z" fill="#9cc3d3" stroke="#1f6f8f" strokeWidth="3" />],
  ["Diversion", "Takes part of the flow out of the channel (canal, bypass).", s => <path d="M8 40 L56 40 M34 40 L52 14" stroke="#8a4b12" strokeWidth="4" fill="none" />],
  ["Source", "Adds an inflow from outside the model (observed flow, effluent).", s => <circle cx="34" cy="32" r="16" fill="#c8973a" stroke="#7a5a12" strokeWidth="3" />],
  ["Sink", "An outlet: flow leaves the model here.", s => <g><circle cx="34" cy="32" r="16" fill="#fff" stroke="#1f6f8f" strokeWidth="3" /><circle cx="34" cy="32" r="6" fill="#1f6f8f" /></g>],
];
function HmsElements() {
  const [k, setK] = useState(0);
  return <Illo title="The seven basin-model elements" kind="Interactive">
    <div className="cards">{ELEMS.map(([n, , icon], i) => <button key={n} className={"cardpick" + (i === k ? " on" : "")} onClick={() => setK(i)} style={{ padding: 6 }}><svg viewBox="0 0 68 60" style={{ height: 60, width: "100%" }}>{icon()}</svg><div style={{ textAlign: "center" }}>{n}</div></button>)}</div>
    <div className="detail"><h4>{ELEMS[k][0]}</h4>{ELEMS[k][1]}</div>
  </Illo>;
}

/* ================= Software: QGIS window tour ================= */
const QPARTS = [
  ["Browser panel", "Files on your computer, databases and web services (XYZ tiles such as OpenStreetMap). Drag data from here onto the map.", [10, 60, 200, 230]],
  ["Layers panel", "The layers in your map, top to bottom. Tick to show/hide; right-click for properties, attribute table, export, zoom to layer.", [10, 296, 200, 236]],
  ["Map canvas", "Where layers are drawn. The project CRS (bottom-right) decides the projection everything is displayed in.", [218, 60, 560, 472]],
  ["Processing Toolbox", "Hundreds of tools — Voronoi polygons, clip, reproject, raster terrain analysis — searchable by name.", [786, 60, 184, 472]],
  ["Status bar", "Coordinates of the cursor, scale, rotation and the project CRS button (e.g. EPSG:32643).", [10, 538, 960, 26]],
];
function QgisTour() {
  const [k, setK] = useState(2);
  return <Illo title="Tour of the QGIS window — click a region" kind="Interactive" cap="Schematic drawn for this course (not a screenshot).">
    <svg viewBox="0 0 980 570"><rect width="980" height="570" fill="#f4f4f4" stroke="#555" />
      <rect x="0" y="0" width="980" height="26" fill="#dfe6ee" /><text x="12" y="18" fontSize="12">QGIS — CE633_Thiessen.qgz</text>
      <text x="12" y="44" fontSize="12">Project  Edit  View  Layer  Settings  Plugins  Vector  Raster  Database  Web  Mesh  Processing  Help</text>
      <rect x="10" y="60" width="200" height="230" fill="#fff" stroke="#999" /><text x="18" y="78" fontSize="12" fontWeight="600">Browser</text>{["Favourites", "Home", "C:\\", "XYZ Tiles", "  OpenStreetMap"].map((t, i) => <text key={i} x="22" y={100 + i * 18} fontSize="11.5" xmlSpace="preserve">{t}</text>)}
      <rect x="10" y="296" width="200" height="236" fill="#fff" stroke="#999" /><text x="18" y="314" fontSize="12" fontWeight="600">Layers</text>{["☑ thiessen", "☑ stations_utm", "☑ catchment_utm", "☑ OpenStreetMap"].map((t, i) => <text key={i} x="22" y={336 + i * 18} fontSize="11.5">{t}</text>)}
      <rect x="218" y="60" width="560" height="472" fill="#eef1e8" stroke="#999" />
      <polygon points="330,420 380,170 520,120 680,190 700,380 520,470" fill="#d7e9f0" stroke="#1a5f7a" strokeWidth="3" /><line x1="380" y1="300" x2="690" y2="250" stroke="#888" strokeDasharray="5 4" /><line x1="520" y1="120" x2="510" y2="470" stroke="#888" strokeDasharray="5 4" />
      {[[450, 220], [600, 320], [430, 380], [620, 190]].map(([x, y], i) => <polygon key={i} points={`${x},${y - 9} ${x - 8},${y + 6} ${x + 8},${y + 6}`} fill="#0f1f3d" />)}
      <rect x="786" y="60" width="184" height="472" fill="#fff" stroke="#999" /><text x="794" y="78" fontSize="12" fontWeight="600">Processing Toolbox</text>{["🔍 voronoi", "Vector geometry", "  Voronoi polygons", "Vector overlay", "  Clip", "Raster terrain", "  Slope", "  Hillshade"].map((t, i) => <text key={i} x="796" y={100 + i * 18} fontSize="11.5" xmlSpace="preserve">{t}</text>)}
      <rect x="10" y="538" width="960" height="26" fill="#e9e9e9" stroke="#999" /><text x="20" y="555" fontSize="11.5">Coordinate 690421, 1426310   Scale 1:60 000   Rotation 0.0°</text><text x="860" y="555" fontSize="11.5" fontWeight="600">EPSG:32643</text>
      {QPARTS.map(([t, , r], i) => <rect key={t} className="hot" x={r[0]} y={r[1]} width={r[2]} height={r[3]} fill={i === k ? "rgba(200,151,58,.18)" : "rgba(0,0,0,0)"} stroke={i === k ? "#c8973a" : "transparent"} strokeWidth="3" onClick={() => setK(i)} />)}
    </svg>
    <div className="detail"><h4>{QPARTS[k][0]}</h4>{QPARTS[k][1]}</div>
  </Illo>;
}

/* ================= Software: HEC-RAS idea — cross-sections and water level ================= */
function RasConcept() {
  const [Q, setQ] = useState(120); const [nM, setNM] = useState(0.035); const [sec, setSec] = useState(1);
  const S = 0.0012, B = 20, z = 2, fpW = 30; // trapezoid channel + floodplain at 3 m
  const geom = y => { if (y <= 3) { const A = (B + z * y) * y, Pw = B + 2 * y * Math.sqrt(1 + z * z); return [A, Pw]; } const A3 = (B + z * 3) * 3, P3 = B + 2 * 3 * Math.sqrt(1 + z * z); return [A3 + (B + 2 * z * 3) * (y - 3) + 2 * fpW * (y - 3), P3 + 2 * fpW + 2 * (y - 3)]; };
  const q = y => { const [A, Pw] = geom(y); return A / nM * Math.pow(A / Pw, 2 / 3) * Math.sqrt(S); };
  let lo = 0.01, hi = 10; for (let i = 0; i < 60; i++) { const m = (lo + hi) / 2; if (q(m) < Q) lo = m; else hi = m; } const y = (lo + hi) / 2;
  const [A, Pw] = geom(y), V = Q / A;
  const W = 520, H = 220, X = x => 260 + x * 2.6, Y = h => 190 - h * 26;
  const shape = [[-110, 6], [-46, 3.2], [-16, 3], [-10, 0], [10, 0], [16, 3], [46, 3.2], [110, 6]];
  return <Illo title="What HEC-RAS computes: water level from discharge" kind="Interactive" cap="A river reach is described by cross-sections (plan view, left). For a given discharge HEC-RAS finds the water surface at each section; here a single section with Manning's equation (normal depth, bed slope 0.0012) shows the idea. Above 3 m the water spills onto the floodplain.">
    <div className="wg-row" style={{ alignItems: "flex-start" }}>
      <div className="wg-col" style={{ maxWidth: 320 }}><svg viewBox="0 0 300 260"><rect width="300" height="260" fill="#f4f8f1" />
        <path d="M150 0 C110 60 200 120 150 180 S120 240 150 260" stroke="#9cc3d3" strokeWidth="40" fill="none" /><path d="M150 0 C110 60 200 120 150 180 S120 240 150 260" stroke="#1f6f8f" strokeWidth="3" fill="none" />
        {[[40, 100], [110, 166], [190, 140]].map(([yy, xx], i) => <g key={i} className="hot" onClick={() => setSec(i)}><line x1={xx - 90} y1={yy} x2={xx + 90} y2={yy} stroke={sec === i ? "#c8973a" : "#0f1f3d"} strokeWidth={sec === i ? 4 : 2} /><text x={xx + 94} y={yy + 4} fontSize="12" fill="#0f1f3d">XS {3 - i}</text></g>)}
        <text x="10" y="250" fontSize="11" fill="#5a5048">flow ↓ · click a cross-section</text></svg></div>
      <div className="wg-col"><svg viewBox={`0 0 ${W} ${H}`} style={{ background: "#fff", border: "1px solid #e8e4dc", borderRadius: 6 }}>
        <polygon points={[...shape.map(([x, h]) => X(x) + "," + Y(h + sec * 0.15)), X(110) + "," + Y(-0.6), X(-110) + "," + Y(-0.6)].join(" ")} fill={P.soil} />
        <clipPath id="rcl"><polygon points={shape.map(([x, h]) => X(x) + "," + Y(h + sec * 0.15)).join(" ") + ` ${X(110)},${Y(9)} ${X(-110)},${Y(9)}`} /></clipPath>
        <rect x="0" y={Y(y + sec * 0.15)} width={W} height={H} fill="#5a9fbf" opacity=".75" clipPath="url(#rcl)" transform={`translate(0 0)`} />
        <polyline points={shape.map(([x, h]) => X(x) + "," + Y(h + sec * 0.15)).join(" ")} fill="none" stroke="#6b4f2a" strokeWidth="2.5" />
        <line x1="0" x2={W} y1={Y(y + sec * 0.15)} y2={Y(y + sec * 0.15)} stroke="#1f6f8f" strokeDasharray="5 3" /><text x="8" y={Y(y + sec * 0.15) - 5} fontSize="12" fill="#1f6f8f" fontWeight="600">WS · depth {y.toFixed(2)} m</text>
      </svg>
        <label className="f">Discharge Q: <b>{Q} m³/s</b><input type="range" min="10" max="900" step="10" value={Q} onChange={e => setQ(+e.target.value)} /></label>
        <label className="f">Manning's n: <b>{nM}</b><input type="range" min="0.02" max="0.08" step="0.005" value={nM} onChange={e => setNM(+e.target.value)} /></label>
        <div className="kpis"><Kpi v={y.toFixed(2) + " m"} l="Depth" /><Kpi v={A.toFixed(0) + " m²"} l="Flow area" /><Kpi v={V.toFixed(2) + " m/s"} l="Mean velocity" /></div>
      </div>
    </div>
  </Illo>;
}


/* ================= CE633 Visual Replacement Illustrations ================= */

export function UhDerivationDiag() {
  return (
    <Illo title="Unit Hydrograph Concept: 1-cm Rainfall Excess to Direct Runoff" kind="Schematic">
      <svg viewBox="0 0 500 150" style={{ width: "100%", background: "#f8fafc", borderRadius: 6 }}>
        <rect x="50" y="25" width="40" height="60" fill="#0284c7" stroke="#0369a1" />
        <text x="56" y="58" fontSize="10" fill="#fff" fontWeight="bold">1.0 cm</text>
        <text x="45" y="105" fontSize="9" fill="#0369a1" fontWeight="bold">D-h Excess Rain</text>

        <path d="M 120,55 L 180,55" stroke="#64748b" strokeWidth="2" markerEnd="url(#arr)" strokeDasharray="3,2" />
        <text x="130" y="45" fontSize="9" fill="#64748b">Transform</text>

        {/* DRH Curve */}
        <path d="M 200,120 Q 250,20 290,120 L 350,120" fill="none" stroke="#2563eb" strokeWidth="3" />
        <line x1="200" y1="120" x2="450" y2="120" stroke="#64748b" strokeWidth="1.5" />
        <circle cx="245" cy="48" r="4" fill="#dc2626" />
        <text x="255" y="45" fontSize="10" fill="#dc2626" fontWeight="bold">Peak Qp = Up</text>
        <text x="260" y="135" fontSize="9" fill="#64748b">Time Base tb</text>
        <text x="360" y="60" fontSize="9" fill="#2563eb" fontWeight="bold">Direct Runoff Hydrograph</text>
        <text x="360" y="75" fontSize="8" fill="#475569">Runoff Volume = 1 cm × Catchment Area</text>
      </svg>
    </Illo>
  );
}

export function ScurveConcept() {
  return (
    <Illo title="S-Curve Equilibrium Concept: Continuous Rainfall Inflow" kind="Schematic">
      <svg viewBox="0 0 500 150" style={{ width: "100%", background: "#f8fafc", borderRadius: 6 }}>
        {/* Asymptote */}
        <line x1="40" y1="35" x2="460" y2="35" stroke="#dc2626" strokeWidth="1.5" strokeDasharray="4,3" />
        <text x="260" y="30" fontSize="9" fill="#dc2626" fontWeight="bold">Equilibrium Discharge Qe = 2.778 A / D (m³/s)</text>

        {/* Stacked UHs */}
        <path d="M 50,120 Q 80,60 110,120" fill="none" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="2,2" />
        <path d="M 80,120 Q 110,60 140,120" fill="none" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="2,2" />
        <path d="M 110,120 Q 140,60 170,120" fill="none" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="2,2" />
        <path d="M 140,120 Q 170,60 200,120" fill="none" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="2,2" />

        {/* S-Curve */}
        <path d="M 50,120 Q 120,45 220,35 L 460,35" fill="none" stroke="#ea580c" strokeWidth="3" />
        <line x1="40" y1="120" x2="460" y2="120" stroke="#64748b" strokeWidth="1.5" />
        <text x="140" y="55" fontSize="10" fill="#ea580c" fontWeight="bold">Cumulative S-Curve</text>
        <text x="400" y="135" fontSize="9" fill="#64748b">Time (h)</text>
      </svg>
    </Illo>
  );
}

export function DimHydrograph() {
  return (
    <Illo title="SCS Dimensionless Unit Hydrograph (q/qp vs t/tp)" kind="Schematic">
      <svg viewBox="0 0 500 150" style={{ width: "100%", background: "#f8fafc", borderRadius: 6 }}>
        <line x1="50" y1="120" x2="450" y2="120" stroke="#64748b" strokeWidth="1.5" />
        <line x1="50" y1="20" x2="50" y2="120" stroke="#64748b" strokeWidth="1.5" />

        {/* Curvilinear curve */}
        <path d="M 50,120 Q 130,20 180,20 Q 230,20 380,120" fill="none" stroke="#2563eb" strokeWidth="3" />
        <circle cx="150" cy="20" r="4" fill="#dc2626" />
        <text x="160" y="24" fontSize="9" fill="#dc2626" fontWeight="bold">Peak (1.0, 1.0)</text>

        {/* Equivalent Triangle */}
        <polygon points="50,120 150,20 380,120" fill="none" stroke="#ca8a04" strokeWidth="1.5" strokeDasharray="3,3" />
        <text x="270" y="55" fontSize="9" fill="#ca8a04" fontWeight="bold">SCS Equivalent Triangle</text>

        <text x="20" y="25" fontSize="9" fill="#64748b">q/qp</text>
        <text x="410" y="135" fontSize="9" fill="#64748b">t/tp</text>
      </svg>
    </Illo>
  );
}

export function CascadeRoute() {
  return (
    <Illo title="Nash's Conceptual Cascade of Linear Reservoirs" kind="Schematic">
      <svg viewBox="0 0 500 120" style={{ width: "100%", background: "#f8fafc", borderRadius: 6 }}>
        <g transform="translate(30, 35)">
          <text x="-15" y="25" fontSize="9" fill="#2563eb" fontWeight="bold">Inflow I(t)</text>
          <line x1="40" y1="20" x2="65" y2="20" stroke="#2563eb" strokeWidth="2" markerEnd="url(#arr)" />

          <rect x="70" y="0" width="70" height="40" rx="4" fill="#dbeafe" stroke="#2563eb" strokeWidth="1.5" />
          <text x="78" y="24" fontSize="9" fill="#1e40af" fontWeight="bold">Reservoir 1 (K)</text>
          <line x1="140" y1="20" x2="165" y2="20" stroke="#2563eb" strokeWidth="2" markerEnd="url(#arr)" />

          <rect x="170" y="0" width="70" height="40" rx="4" fill="#dbeafe" stroke="#2563eb" strokeWidth="1.5" />
          <text x="178" y="24" fontSize="9" fill="#1e40af" fontWeight="bold">Reservoir 2 (K)</text>
          <line x1="240" y1="20" x2="265" y2="20" stroke="#2563eb" strokeWidth="2" strokeDasharray="2,2" />

          <text x="275" y="24" fontSize="12" fill="#64748b">•••</text>
          <line x1="295" y1="20" x2="315" y2="20" stroke="#2563eb" strokeWidth="2" markerEnd="url(#arr)" />

          <rect x="320" y="0" width="70" height="40" rx="4" fill="#dbeafe" stroke="#2563eb" strokeWidth="1.5" />
          <text x="328" y="24" fontSize="9" fill="#1e40af" fontWeight="bold">Reservoir n (K)</text>
          <line x1="390" y1="20" x2="420" y2="20" stroke="#2563eb" strokeWidth="2" markerEnd="url(#arr)" />
          <text x="425" y="25" fontSize="9" fill="#2563eb" fontWeight="bold">Outflow Q(t)</text>
        </g>
      </svg>
    </Illo>
  );
}

export function WedgeStorage() {
  return (
    <Illo title="Prism and Wedge Storage Components in Channel Reach" kind="Schematic">
      <svg viewBox="0 0 500 150" style={{ width: "100%", background: "#f8fafc", borderRadius: 6 }}>
        {/* River Bed */}
        <line x1="40" y1="120" x2="460" y2="120" stroke="#78350f" strokeWidth="4" />
        <text x="40" y="135" fontSize="8" fill="#78350f" fontWeight="bold">River Channel Bed</text>

        {/* Prism storage (outflow controlled, rectangular) */}
        <polygon points="60,65 440,65 440,120 60,120" fill="#bae6fd" opacity="0.6" stroke="#0284c7" strokeWidth="1.5" />
        <text x="210" y="95" fontSize="9" fill="#0369a1" fontWeight="bold">Prism Storage = K · O</text>

        {/* Wedge storage (inflow surge, triangular) */}
        <polygon points="60,30 440,65 60,65" fill="#fde047" opacity="0.6" stroke="#ca8a04" strokeWidth="1.5" />
        <text x="120" y="52" fontSize="9" fill="#854d0e" fontWeight="bold">Wedge Storage = K · x · (I - O)</text>

        {/* Water Flow Arrows */}
        <line x1="20" y1="30" x2="55" y2="30" stroke="#2563eb" strokeWidth="3" markerEnd="url(#arr)" />
        <text x="10" y="24" fontSize="9" fill="#2563eb" fontWeight="bold">Inflow I</text>
        <line x1="445" y1="65" x2="480" y2="65" stroke="#2563eb" strokeWidth="3" markerEnd="url(#arr)" />
        <text x="445" y="58" fontSize="9" fill="#2563eb" fontWeight="bold">Outflow O</text>
      </svg>
    </Illo>
  );
}

export function BridgePier() {
  return (
    <Illo title="River Gauging Station & Bridge Cross-Section" kind="Schematic">
      <svg viewBox="0 0 500 150" style={{ width: "100%", background: "#f8fafc", borderRadius: 6 }}>
        {/* Bridge Deck */}
        <rect x="30" y="20" width="440" height="15" fill="#64748b" stroke="#334155" />
        <text x="220" y="31" fontSize="9" fill="#fff" fontWeight="bold">Bridge Deck</text>

        {/* Piers */}
        <rect x="140" y="35" width="20" height="90" fill="#94a3b8" stroke="#475569" />
        <rect x="340" y="35" width="20" height="90" fill="#94a3b8" stroke="#475569" />

        {/* Water Body */}
        <path d="M 40,75 Q 250,70 460,75 L 460,125 L 40,125 Z" fill="#38bdf8" opacity="0.5" />
        <line x1="40" y1="75" x2="460" y2="75" stroke="#0284c7" strokeWidth="2" className="anim-flow" />

        {/* Staff Gauge attached to pier */}
        <rect x="160" y="45" width="6" height="70" fill="#fef08a" stroke="#ca8a04" />
        <text x="170" y="65" fontSize="8" fill="#ca8a04" fontWeight="bold">Staff Gauge</text>

        {/* Cableway / Crane */}
        <line x1="330" y1="35" x2="330" y2="90" stroke="#334155" strokeWidth="1.5" />
        <circle cx="330" cy="90" r="5" fill="#dc2626" />
        <text x="260" y="95" fontSize="8" fill="#dc2626" fontWeight="bold">Current Meter Sinker</text>
      </svg>
    </Illo>
  );
}

export function VelocityProfile() {
  return (
    <Illo title="Vertical Velocity Profile & Current Meter Sampling Depths" kind="Schematic">
      <svg viewBox="0 0 500 150" style={{ width: "100%", background: "#f8fafc", borderRadius: 6 }}>
        <line x1="60" y1="25" x2="440" y2="25" stroke="#0284c7" strokeWidth="2" strokeDasharray="4,2" />
        <text x="70" y="20" fontSize="8" fill="#0284c7">Water Surface (y = d)</text>

        <line x1="60" y1="125" x2="440" y2="125" stroke="#78350f" strokeWidth="3" />
        <text x="70" y="137" fontSize="8" fill="#78350f">Channel Bed (y = 0)</text>

        {/* Velocity Parabolic Profile */}
        <path d="M 120,125 Q 260,120 280,35 L 275,25" fill="none" stroke="#2563eb" strokeWidth="3" />
        <text x="285" y="30" fontSize="9" fill="#2563eb" fontWeight="bold">Surface Velocity vs</text>

        {/* Sampling Points */}
        <circle cx="270" cy="45" r="4" fill="#dc2626" />
        <text x="280" y="49" fontSize="8" fill="#dc2626" fontWeight="bold">0.2d (v0.2)</text>

        <circle cx="235" cy="85" r="4" fill="#16a34a" />
        <text x="245" y="89" fontSize="8" fill="#16a34a" fontWeight="bold">0.6d (v0.6 ≈ v_mean)</text>

        <circle cx="185" cy="105" r="4" fill="#dc2626" />
        <text x="195" y="109" fontSize="8" fill="#dc2626" fontWeight="bold">0.8d (v0.8)</text>

        <text x="350" y="80" fontSize="9" fill="#475569">Two-point average:</text>
        <text x="350" y="95" fontSize="10" fill="#0f172a" fontWeight="bold">v_mean = (v0.2 + v0.8) / 2</text>
      </svg>
    </Illo>
  );
}

export function MidSection() {
  return (
    <Illo title="Mid-Section Method for Stream Discharge Gauging" kind="Schematic">
      <svg viewBox="0 0 500 150" style={{ width: "100%", background: "#f8fafc", borderRadius: 6 }}>
        {/* River Bed Profile */}
        <path d="M 40,40 Q 120,125 250,130 Q 380,125 460,40 Z" fill="#38bdf8" opacity="0.3" stroke="#0284c7" />

        {/* Vertical Panels */}
        {[130, 200, 270, 340].map((x, idx) => (
          <g key={x}>
            <line x1={x} y1="40" x2={x} y2="125" stroke="#334155" strokeWidth="1.5" strokeDasharray="3,2" />
            <rect x={x - 20} y="40" width="40" height="80" fill="none" stroke="#2563eb" strokeWidth="1" strokeDasharray="2,2" />
            <text x={x - 6} y="32" fontSize="9" fill="#1e293b" fontWeight="bold">x{idx + 1}</text>
          </g>
        ))}

        <text x="180" y="145" fontSize="9" fill="#0f172a" fontWeight="bold">Panel Width W = (x_{'{i+1}'} - x_{'{i-1}'}) / 2</text>
      </svg>
    </Illo>
  );
}

export function SlopeArea() {
  return (
    <Illo title="Slope-Area Method: High Water Marks & Energy Slope" kind="Schematic">
      <svg viewBox="0 0 500 150" style={{ width: "100%", background: "#f8fafc", borderRadius: 6 }}>
        {/* Ground */}
        <line x1="40" y1="120" x2="460" y2="140" stroke="#78350f" strokeWidth="4" />

        {/* Water Surface */}
        <line x1="60" y1="55" x2="440" y2="90" stroke="#0284c7" strokeWidth="2.5" />
        <text x="180" y="65" fontSize="9" fill="#0284c7" fontWeight="bold">Water Surface Slope S_w</text>

        {/* Section 1 */}
        <line x1="100" y1="35" x2="100" y2="125" stroke="#dc2626" strokeWidth="2" strokeDasharray="3,3" />
        <text x="80" y="30" fontSize="9" fill="#dc2626" fontWeight="bold">Section 1 (A1)</text>

        {/* Section 2 */}
        <line x1="400" y1="65" x2="400" y2="137" stroke="#dc2626" strokeWidth="2" strokeDasharray="3,3" />
        <text x="380" y="60" fontSize="9" fill="#dc2626" fontWeight="bold">Section 2 (A2)</text>

        {/* Head Loss Indicator */}
        <line x1="100" y1="45" x2="400" y2="45" stroke="#64748b" strokeWidth="1" strokeDasharray="2,2" />
        <line x1="400" y1="45" x2="400" y2="85" stroke="#16a34a" strokeWidth="2" />
        <text x="408" y="70" fontSize="9" fill="#16a34a" fontWeight="bold">Head Loss h_f</text>

        <text x="180" y="115" fontSize="9" fill="#475569">Manning: Q = (1/n) · A · R^(2/3) · Sf^(1/2)</text>
      </svg>
    </Illo>
  );
}

export function RatingControls() {
  return (
    <Illo title="Stage-Discharge Rating Curve: Section Control vs Channel Control" kind="Schematic">
      <svg viewBox="0 0 500 150" style={{ width: "100%", background: "#f8fafc", borderRadius: 6 }}>
        <line x1="50" y1="120" x2="450" y2="120" stroke="#64748b" strokeWidth="1.5" />
        <line x1="50" y1="20" x2="50" y2="120" stroke="#64748b" strokeWidth="1.5" />

        {/* Curve with break in slope */}
        <path d="M 50,120 Q 120,95 180,80 Q 280,60 420,25" fill="none" stroke="#2563eb" strokeWidth="3" />

        <circle cx="180" cy="80" r="5" fill="#dc2626" />
        <text x="190" y="85" fontSize="9" fill="#dc2626" fontWeight="bold">Transition Level</text>

        <text x="90" y="110" fontSize="8" fill="#ca8a04" fontWeight="bold">Section Control (Rock Riffle, Weir)</text>
        <text x="270" y="45" fontSize="8" fill="#0284c7" fontWeight="bold">Channel Control (Channel Roughness & Floodplain)</text>

        <text x="20" y="25" fontSize="9" fill="#64748b">Stage G</text>
        <text x="420" y="135" fontSize="9" fill="#64748b">Discharge Q</text>
      </svg>
    </Illo>
  );
}

export function LoopRatingDiag() {
  return (
    <Illo title="Jones Formula Hysteresis Loop in Unsteady Flood Flow" kind="Schematic">
      <svg viewBox="0 0 500 150" style={{ width: "100%", background: "#f8fafc", borderRadius: 6 }}>
        <line x1="50" y1="120" x2="450" y2="120" stroke="#64748b" strokeWidth="1.5" />
        <line x1="50" y1="20" x2="50" y2="120" stroke="#64748b" strokeWidth="1.5" />

        {/* Normal Steady Rating Curve */}
        <path d="M 50,120 Q 220,70 420,30" fill="none" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="3,3" />
        <text x="320" y="65" fontSize="8" fill="#64748b">Steady Rating Q_norm</text>

        {/* Hysteresis Loop */}
        <path d="M 50,120 Q 200,45 360,25 Q 440,30 420,30 Q 300,85 50,120 Z" fill="#dbeafe" opacity="0.4" stroke="#2563eb" strokeWidth="2.5" />

        {/* Rising limb marker */}
        <text x="210" y="40" fontSize="9" fill="#dc2626" fontWeight="bold">Rising Limb (dh/dt &gt; 0, Higher Q)</text>
        {/* Falling limb marker */}
        <text x="220" y="100" fontSize="9" fill="#16a34a" fontWeight="bold">Falling Limb (dh/dt &lt; 0, Lower Q)</text>

        <text x="20" y="25" fontSize="9" fill="#64748b">Stage G</text>
        <text x="420" y="135" fontSize="9" fill="#64748b">Discharge Q</text>
      </svg>
    </Illo>
  );
}

export function DilutionGauging() {
  return (
    <Illo title="Chemical Dilution Gauging & Tracer Mass Balance" kind="Schematic">
      <svg viewBox="0 0 500 140" style={{ width: "100%", background: "#f8fafc", borderRadius: 6 }}>
        {/* Stream */}
        <path d="M 40,40 Q 250,55 460,40 L 460,105 Q 250,120 40,105 Z" fill="#38bdf8" opacity="0.4" />
        <line x1="40" y1="72" x2="460" y2="72" stroke="#0284c7" strokeWidth="2" className="anim-flow" />

        {/* Injection Point */}
        <circle cx="90" cy="50" r="5" fill="#dc2626" />
        <line x1="90" y1="20" x2="90" y2="45" stroke="#dc2626" strokeWidth="2" markerEnd="url(#arr)" />
        <text x="60" y="15" fontSize="9" fill="#dc2626" fontWeight="bold">Tracer Injection (q, C1)</text>

        {/* Mixing zone */}
        <text x="180" y="65" fontSize="8" fill="#475569">Mixing Length L &gt; 10 W</text>

        {/* Sampling Station */}
        <circle cx="390" cy="90" r="5" fill="#16a34a" />
        <line x1="390" y1="95" x2="390" y2="125" stroke="#16a34a" strokeWidth="2" />
        <text x="350" y="135" fontSize="9" fill="#16a34a" fontWeight="bold">Sampling (C2)</text>

        <text x="200" y="100" fontSize="9" fill="#0f172a" fontWeight="bold">Q = q · (C1 - C2) / (C2 - C0)</text>
      </svg>
    </Illo>
  );
}

export function ReservoirSediment() {
  return (
    <Illo title="Reservoir Sedimentation Dynamics (Delta, Foreset, Bottomset Beds)" kind="Schematic">
      <svg viewBox="0 0 500 150" style={{ width: "100%", background: "#f8fafc", borderRadius: 6 }}>
        {/* Valley Bottom & Dam */}
        <line x1="40" y1="80" x2="420" y2="135" stroke="#78350f" strokeWidth="3" />
        <polygon points="420,135 440,40 460,135" fill="#64748b" stroke="#334155" />
        <text x="430" y="32" fontSize="9" fill="#334155" fontWeight="bold">Dam</text>

        {/* Water Pool */}
        <polygon points="120,55 440,55 420,135 120,85" fill="#38bdf8" opacity="0.35" />
        <line x1="120" y1="55" x2="440" y2="55" stroke="#0284c7" strokeWidth="1.5" strokeDasharray="4,2" />
        <text x="220" y="50" fontSize="8" fill="#0284c7">Full Reservoir Level (FRL)</text>

        {/* Sediment Layers */}
        {/* Topset */}
        <polygon points="40,80 180,85 170,95 40,90" fill="#ca8a04" opacity="0.8" />
        <text x="60" y="75" fontSize="8" fill="#854d0e" fontWeight="bold">Topset Bed (Coarse Gravel)</text>

        {/* Foreset */}
        <polygon points="180,85 270,115 250,125 170,95" fill="#eab308" opacity="0.8" />
        <text x="200" y="105" fontSize="8" fill="#713f12" fontWeight="bold">Foreset Bed (Sand)</text>

        {/* Bottomset */}
        <polygon points="270,115 420,135 420,130 250,125" fill="#a16207" opacity="0.8" />
        <text x="310" y="125" fontSize="8" fill="#fff" fontWeight="bold">Bottomset (Silt/Clay)</text>
      </svg>
    </Illo>
  );
}

export function SoilMoistureZones() {
  return (
    <Illo title="Subsurface Hydrologic Strata: Unsaturated Vadose Zone to Groundwater" kind="Schematic">
      <svg viewBox="0 0 500 160" style={{ width: "100%", background: "#f8fafc", borderRadius: 6 }}>
        {/* 1. Soil Water Zone */}
        <rect x="50" y="20" width="400" height="30" fill="#d97706" opacity="0.3" stroke="#b45309" />
        <text x="60" y="38" fontSize="9" fill="#b45309" fontWeight="bold">1. Soil Water Zone (Transpiration by Plant Roots, Pellicular Moisture)</text>

        {/* 2. Intermediate Vadose Zone */}
        <rect x="50" y="50" width="400" height="35" fill="#fde047" opacity="0.3" stroke="#ca8a04" />
        <text x="60" y="70" fontSize="9" fill="#854d0e" fontWeight="bold">2. Intermediate Zone (Gravitational Infiltration to Water Table)</text>

        {/* 3. Capillary Fringe */}
        <rect x="50" y="85" width="400" height="20" fill="#38bdf8" opacity="0.4" stroke="#0284c7" strokeDasharray="3,2" />
        <text x="60" y="98" fontSize="9" fill="#0369a1" fontWeight="bold">3. Capillary Fringe (Sub-atmospheric Suction Lift Above Table)</text>

        {/* 4. Saturated Zone */}
        <rect x="50" y="105" width="400" height="40" fill="#0284c7" opacity="0.6" stroke="#0369a1" />
        <text x="60" y="128" fontSize="9" fill="#fff" fontWeight="bold">4. Saturated Groundwater Zone (Phreatic Aquifer, Positive Pressure)</text>

        {/* Water Table Symbol */}
        <line x1="45" y1="105" x2="455" y2="105" stroke="#dc2626" strokeWidth="2" strokeDasharray="4,2" />
        <text x="360" y="102" fontSize="9" fill="#dc2626" fontWeight="bold">∇ Water Table</text>
      </svg>
    </Illo>
  );
}

export function DarcyExperiment() {
  return (
    <Illo title="Virtual Darcy Sand Permeameter Column" kind="Schematic">
      <svg viewBox="0 0 500 150" style={{ width: "100%", background: "#f8fafc", borderRadius: 6 }}>
        {/* Permeameter Cylinder */}
        <rect x="180" y="45" width="160" height="50" fill="#e2e8f0" stroke="#334155" strokeWidth="2" />
        <rect x="200" y="47" width="120" height="46" fill="#ca8a04" opacity="0.5" />
        <text x="220" y="73" fontSize="9" fill="#713f12" fontWeight="bold">Sand Sample (Area A, Length L)</text>

        {/* Piezometer 1 */}
        <line x1="220" y1="45" x2="220" y2="15" stroke="#0284c7" strokeWidth="2" />
        <rect x="216" y="25" width="8" height="20" fill="#38bdf8" />
        <text x="210" y="12" fontSize="8" fill="#0284c7" fontWeight="bold">h1</text>

        {/* Piezometer 2 */}
        <line x1="300" y1="45" x2="300" y2="15" stroke="#0284c7" strokeWidth="2" />
        <rect x="296" y="35" width="8" height="10" fill="#38bdf8" />
        <text x="290" y="12" fontSize="8" fill="#0284c7" fontWeight="bold">h2</text>

        {/* Head difference */}
        <line x1="230" y1="25" x2="290" y2="25" stroke="#dc2626" strokeWidth="1" strokeDasharray="2,2" />
        <text x="245" y="22" fontSize="8" fill="#dc2626" fontWeight="bold">Δh = h1 - h2</text>

        {/* Inflow and Outflow */}
        <line x1="140" y1="70" x2="175" y2="70" stroke="#0284c7" strokeWidth="3" markerEnd="url(#arr)" />
        <text x="145" y="62" fontSize="9" fill="#0284c7" fontWeight="bold">Q In</text>
        <line x1="345" y1="70" x2="380" y2="70" stroke="#0284c7" strokeWidth="3" markerEnd="url(#arr)" />
        <text x="350" y="62" fontSize="9" fill="#0284c7" fontWeight="bold">Q Out</text>

        <text x="170" y="125" fontSize="9" fill="#0f172a" fontWeight="bold">Darcy's Law: Q = K · A · (Δh / L)</text>
      </svg>
    </Illo>
  );
}

export function AquiferCross() {
  return (
    <Illo title="Confined vs Unconfined Aquifer Cross-Section" kind="Schematic">
      <svg viewBox="0 0 500 150" style={{ width: "100%", background: "#f8fafc", borderRadius: 6 }}>
        {/* Unconfined section on left */}
        <rect x="40" y="25" width="200" height="100" fill="#bae6fd" opacity="0.4" stroke="#0284c7" />
        <line x1="40" y1="55" x2="240" y2="55" stroke="#0284c7" strokeWidth="2" strokeDasharray="4,2" />
        <text x="50" y="48" fontSize="8" fill="#0284c7" fontWeight="bold">∇ Water Table (Atmospheric)</text>
        <text x="50" y="85" fontSize="9" fill="#0369a1" fontWeight="bold">Unconfined Aquifer</text>

        {/* Confined section on right */}
        <rect x="260" y="25" width="200" height="20" fill="#64748b" opacity="0.6" stroke="#334155" />
        <text x="270" y="38" fontSize="8" fill="#fff" fontWeight="bold">Upper Confining Bed (Aquitard)</text>
        <rect x="260" y="45" width="200" height="60" fill="#38bdf8" opacity="0.5" stroke="#0284c7" />
        <text x="270" y="78" fontSize="9" fill="#0369a1" fontWeight="bold">Confined (Artesian) Aquifer</text>
        <rect x="260" y="105" width="200" height="20" fill="#64748b" opacity="0.6" stroke="#334155" />
        <text x="270" y="118" fontSize="8" fill="#fff" fontWeight="bold">Lower Confining Bed</text>

        {/* Piezometric line */}
        <line x1="260" y1="18" x2="460" y2="18" stroke="#dc2626" strokeWidth="2" strokeDasharray="4,2" />
        <text x="280" y="14" fontSize="8" fill="#dc2626" fontWeight="bold">Piezometric Pressure Surface</text>
      </svg>
    </Illo>
  );
}

export function StratifiedAquifer() {
  return (
    <Illo title="Stratified Aquifer Permeabilities (Parallel Kx vs Perpendicular Kz)" kind="Schematic">
      <svg viewBox="0 0 500 140" style={{ width: "100%", background: "#f8fafc", borderRadius: 6 }}>
        {/* Layer 1 */}
        <rect x="50" y="20" width="250" height="30" fill="#ca8a04" opacity="0.5" stroke="#854d0e" />
        <text x="60" y="38" fontSize="8" fill="#713f12" fontWeight="bold">Layer 1: b1 = 4m, K1 = 15 m/d</text>

        {/* Layer 2 */}
        <rect x="50" y="50" width="250" height="25" fill="#94a3b8" opacity="0.6" stroke="#475569" />
        <text x="60" y="66" fontSize="8" fill="#1e293b" fontWeight="bold">Layer 2: b2 = 3m, K2 = 2 m/d</text>

        {/* Layer 3 */}
        <rect x="50" y="75" width="250" height="35" fill="#38bdf8" opacity="0.5" stroke="#0284c7" />
        <text x="60" y="96" fontSize="8" fill="#0369a1" fontWeight="bold">Layer 3: b3 = 5m, K3 = 25 m/d</text>

        {/* Formula callouts */}
        <g transform="translate(320, 35)">
          <text x="0" y="0" fontSize="9" fill="#0f172a" fontWeight="bold">Parallel Flow:</text>
          <text x="0" y="14" fontSize="9" fill="#2563eb">K_x = Σ(Ki·bi) / Σbi</text>
          <text x="0" y="45" fontSize="9" fill="#0f172a" fontWeight="bold">Perpendicular Flow:</text>
          <text x="0" y="59" fontSize="9" fill="#ea580c">K_z = Σbi / Σ(bi/Ki)</text>
        </g>
      </svg>
    </Illo>
  );
}

export function ConeDepression() {
  return (
    <Illo title="Pumping Well Cone of Depression and Radius of Influence" kind="Schematic">
      <svg viewBox="0 0 500 150" style={{ width: "100%", background: "#f8fafc", borderRadius: 6 }}>
        <line x1="50" y1="35" x2="450" y2="35" stroke="#0284c7" strokeWidth="1.5" strokeDasharray="4,2" />
        <text x="60" y="30" fontSize="8" fill="#0284c7">Static Piezometric Level (s = 0)</text>

        {/* Pumping Well */}
        <line x1="250" y1="15" x2="250" y2="135" stroke="#334155" strokeWidth="4" />
        <text x="235" y="12" fontSize="9" fill="#334155" fontWeight="bold">Well (Q)</text>

        {/* Cone of Depression */}
        <path d="M 50,35 Q 210,40 250,115 Q 290,40 450,35" fill="none" stroke="#dc2626" strokeWidth="2.5" />

        {/* Radius of Influence */}
        <line x1="50" y1="135" x2="250" y2="135" stroke="#64748b" strokeWidth="1" strokeDasharray="3,2" />
        <text x="120" y="130" fontSize="8" fill="#64748b" fontWeight="bold">Radius of Influence R</text>

        <text x="260" y="110" fontSize="9" fill="#dc2626" fontWeight="bold">Wellbore Drawdown sw</text>
      </svg>
    </Illo>
  );
}

export function ObservationCone() {
  return (
    <Illo title="Pumping Test with Multiple Observation Wells" kind="Schematic">
      <svg viewBox="0 0 500 140" style={{ width: "100%", background: "#f8fafc", borderRadius: 6 }}>
        <line x1="50" y1="35" x2="450" y2="35" stroke="#0284c7" strokeWidth="1.5" strokeDasharray="3,2" />

        {/* Pumping Well */}
        <line x1="120" y1="20" x2="120" y2="125" stroke="#334155" strokeWidth="4" />
        <text x="105" y="15" fontSize="9" fill="#334155" fontWeight="bold">Pump (Q)</text>

        {/* Observation Well 1 */}
        <line x1="220" y1="35" x2="220" y2="125" stroke="#64748b" strokeWidth="2" />
        <text x="210" y="28" fontSize="8" fill="#64748b">Obs 1 (r1)</text>

        {/* Observation Well 2 */}
        <line x1="350" y1="35" x2="350" y2="125" stroke="#64748b" strokeWidth="2" />
        <text x="340" y="28" fontSize="8" fill="#64748b">Obs 2 (r2)</text>

        {/* Drawdown Curve */}
        <path d="M 120,110 Q 180,60 220,55 Q 300,42 350,38 L 450,35" fill="none" stroke="#2563eb" strokeWidth="2.5" />
      </svg>
    </Illo>
  );
}

export function SanitaryWell() {
  return (
    <Illo title="Borewell Engineering Anatomy: Sanitary Seal, Screen, & Filter Pack" kind="Schematic">
      <svg viewBox="0 0 500 150" style={{ width: "100%", background: "#f8fafc", borderRadius: 6 }}>
        {/* Concrete Seal */}
        <rect x="210" y="20" width="80" height="25" fill="#94a3b8" stroke="#475569" strokeWidth="1.5" />
        <text x="215" y="36" fontSize="8" fill="#fff" fontWeight="bold">Concrete Seal</text>

        {/* Well Casing Pipe */}
        <rect x="235" y="45" width="30" height="50" fill="#f8fafc" stroke="#334155" strokeWidth="2" />
        <text x="275" y="70" fontSize="8" fill="#475569">Impervious Casing</text>

        {/* Slotted Screen */}
        <rect x="235" y="95" width="30" height="40" fill="#fed7aa" stroke="#ea580c" strokeWidth="2" strokeDasharray="3,2" />
        <text x="275" y="115" fontSize="8" fill="#ea580c" fontWeight="bold">Slotted Well Screen</text>

        {/* Gravel Pack */}
        <rect x="220" y="95" width="15" height="40" fill="#ca8a04" opacity="0.6" />
        <rect x="265" y="95" width="15" height="40" fill="#ca8a04" opacity="0.6" />
        <text x="145" y="115" fontSize="8" fill="#854d0e">Gravel Filter Pack</text>
      </svg>
    </Illo>
  );
}

export function DrawdownTime() {
  return (
    <Illo title="Time-Drawdown Curve on Semilog Scale" kind="Schematic">
      <svg viewBox="0 0 500 140" style={{ width: "100%", background: "#f8fafc", borderRadius: 6 }}>
        <line x1="50" y1="120" x2="450" y2="120" stroke="#64748b" strokeWidth="1.5" />
        <line x1="50" y1="20" x2="50" y2="120" stroke="#64748b" strokeWidth="1.5" />

        {/* Straight line on semilog */}
        <line x1="100" y1="120" x2="420" y2="30" stroke="#2563eb" strokeWidth="2.5" />
        <circle cx="100" cy="120" r="4" fill="#dc2626" />
        <text x="95" y="135" fontSize="9" fill="#dc2626" fontWeight="bold">t0 (s=0)</text>

        <text x="220" y="65" fontSize="9" fill="#2563eb" fontWeight="bold">Slope = Δs per log cycle</text>
        <text x="20" y="25" fontSize="9" fill="#64748b">s (m)</text>
        <text x="410" y="135" fontSize="9" fill="#64748b">log(t)</text>
      </svg>
    </Illo>
  );
}

export function WellSpacing() {
  return (
    <Illo title="Well Interference Superposition: Combined Drawdown" kind="Schematic">
      <svg viewBox="0 0 500 140" style={{ width: "100%", background: "#f8fafc", borderRadius: 6 }}>
        <line x1="50" y1="30" x2="450" y2="30" stroke="#0284c7" strokeWidth="1" strokeDasharray="3,2" />

        {/* Well 1 */}
        <line x1="180" y1="20" x2="180" y2="115" stroke="#334155" strokeWidth="3" />
        <text x="165" y="15" fontSize="8" fill="#334155" fontWeight="bold">Well 1</text>

        {/* Well 2 */}
        <line x1="320" y1="20" x2="320" y2="115" stroke="#334155" strokeWidth="3" />
        <text x="315" y="15" fontSize="8" fill="#334155" fontWeight="bold">Well 2</text>

        {/* Combined Interference Curve */}
        <path d="M 60,30 Q 130,35 180,95 Q 250,55 320,95 Q 370,35 440,30" fill="none" stroke="#dc2626" strokeWidth="2.5" />
        <text x="225" y="75" fontSize="8" fill="#dc2626" fontWeight="bold">Superposed s = s1 + s2</text>
      </svg>
    </Illo>
  );
}

export function WellLosses() {
  return (
    <Illo title="Jacob's Total Drawdown Breakdown: Aquifer Loss vs Well Loss" kind="Schematic">
      <svg viewBox="0 0 500 140" style={{ width: "100%", background: "#f8fafc", borderRadius: 6 }}>
        <line x1="60" y1="120" x2="440" y2="120" stroke="#64748b" strokeWidth="1.5" />
        <line x1="60" y1="20" x2="60" y2="120" stroke="#64748b" strokeWidth="1.5" />

        {/* Total Drawdown Curve sw = BQ + CQ^2 */}
        <path d="M 60,120 Q 200,85 400,25" fill="none" stroke="#dc2626" strokeWidth="3" />
        {/* Linear Aquifer Loss BQ */}
        <line x1="60" y1="120" x2="400" y2="55" stroke="#2563eb" strokeWidth="2" strokeDasharray="4,2" />

        <text x="220" y="85" fontSize="8" fill="#2563eb">Laminar Aquifer Loss (B·Q)</text>
        <text x="280" y="40" fontSize="8" fill="#dc2626" fontWeight="bold">Turbulent Well Entrance Loss (C·Q²)</text>

        <text x="20" y="25" fontSize="9" fill="#64748b">Drawdown sw</text>
        <text x="400" y="135" fontSize="9" fill="#64748b">Discharge Q</text>
      </svg>
    </Illo>
  );
}

export function RecupDiagram() {
  return (
    <Illo title="Open Well Recuperation Test: Depression Head Recovery" kind="Schematic">
      <svg viewBox="0 0 500 140" style={{ width: "100%", background: "#f8fafc", borderRadius: 6 }}>
        <line x1="50" y1="120" x2="450" y2="120" stroke="#64748b" strokeWidth="1.5" />
        <line x1="50" y1="20" x2="50" y2="120" stroke="#64748b" strokeWidth="1.5" />

        {/* Exponential recovery curve */}
        <path d="M 80,30 Q 150,85 420,115" fill="none" stroke="#16a34a" strokeWidth="3" />

        <circle cx="80" cy="30" r="4" fill="#dc2626" />
        <text x="90" y="35" fontSize="9" fill="#dc2626" fontWeight="bold">Pump Stops: s1 (Initial Depression)</text>

        <circle cx="280" cy="95" r="4" fill="#ca8a04" />
        <text x="290" y="90" fontSize="9" fill="#ca8a04" fontWeight="bold">After Time T: s2 (Residual Depression)</text>

        <text x="20" y="25" fontSize="9" fill="#64748b">Head s</text>
        <text x="410" y="135" fontSize="9" fill="#64748b">Time T (min)</text>
      </svg>
    </Illo>
  );
}

export function RwhSchematic() {
  return (
    <Illo title="Complete Rooftop Rainwater Harvesting Engineering Schematic" kind="Schematic">
      <svg viewBox="0 0 500 140" style={{ width: "100%", background: "#f8fafc", borderRadius: 6 }}>
        {/* Roof */}
        <polygon points="30,70 120,40 120,75 30,105" fill="#cbd5e1" stroke="#475569" strokeWidth="1.5" />
        <text x="45" y="75" fontSize="8" fill="#1e293b" fontWeight="bold">Roof Catchment</text>

        {/* Gutter & Pipe */}
        <line x1="120" y1="75" x2="160" y2="75" stroke="#0284c7" strokeWidth="2.5" />
        <line x1="160" y1="75" x2="160" y2="105" stroke="#0284c7" strokeWidth="2.5" />

        {/* First Flush */}
        <rect x="155" y="105" width="10" height="25" fill="#fed7aa" stroke="#ea580c" />
        <text x="135" y="138" fontSize="7" fill="#ea580c">First Flush</text>

        {/* Filter */}
        <rect x="190" y="65" width="25" height="30" fill="#ca8a04" opacity="0.6" stroke="#854d0e" />
        <text x="185" y="60" fontSize="7" fill="#854d0e">Sand Filter</text>
        <line x1="160" y1="85" x2="190" y2="85" stroke="#0284c7" strokeWidth="2" />

        {/* Storage Tank */}
        <rect x="240" y="65" width="65" height="45" rx="3" fill="#bfdbfe" stroke="#2563eb" strokeWidth="2" />
        <text x="248" y="90" fontSize="9" fill="#1e40af" fontWeight="bold">Storage Sump</text>

        {/* Recharge Well */}
        <line x1="305" y1="80" x2="350" y2="80" stroke="#0284c7" strokeWidth="1.5" strokeDasharray="2,2" />
        <rect x="350" y="70" width="30" height="55" fill="#fef08a" stroke="#ca8a04" strokeDasharray="3,2" />
        <text x="340" y="138" fontSize="8" fill="#ca8a04" fontWeight="bold">Recharge Well</text>
      </svg>
    </Illo>
  );
}

export const ILLOS = {
  "uh-derivation-diag": UhDerivationDiag,
  uhderivationdiag: UhDerivationDiag,
  "scurve-concept": ScurveConcept,
  scurveconcept: ScurveConcept,
  "dim-hydrograph": DimHydrograph,
  dimhydrograph: DimHydrograph,
  "cascade-route": CascadeRoute,
  cascaderoute: CascadeRoute,
  "wedge-storage": WedgeStorage,
  wedgestorage: WedgeStorage,
  "bridge-pier": BridgePier,
  bridgepier: BridgePier,
  "velocity-profile": VelocityProfile,
  velocityprofile: VelocityProfile,
  "mid-section": MidSection,
  midsection: MidSection,
  "slope-area": SlopeArea,
  slopearea: SlopeArea,
  "rating-controls": RatingControls,
  ratingcontrols: RatingControls,
  "loop-rating-diag": LoopRatingDiag,
  loopratingdiag: LoopRatingDiag,
  "dilution-gauging": DilutionGauging,
  dilutiongauging: DilutionGauging,
  "reservoir-sediment": ReservoirSediment,
  reservoirsediment: ReservoirSediment,
  "soil-moisture-zones": SoilMoistureZones,
  soilmoisturezones: SoilMoistureZones,
  "darcy-experiment": DarcyExperiment,
  darcyexperiment: DarcyExperiment,
  "aquifer-cross": AquiferCross,
  aquifercross: AquiferCross,
  "stratified-aquifer": StratifiedAquifer,
  stratifiedaquifer: StratifiedAquifer,
  "cone-depression": ConeDepression,
  conedepression: ConeDepression,
  "observation-cone": ObservationCone,
  observationcone: ObservationCone,
  "sanitary-well": SanitaryWell,
  sanitarywell: SanitaryWell,
  "drawdown-time": DrawdownTime,
  drawdowntime: DrawdownTime,
  "well-spacing": WellSpacing,
  wellspacing: WellSpacing,
  "well-losses": WellLosses,
  welllosses: WellLosses,
  "recup-diagram": RecupDiagram,
  recupdiagram: RecupDiagram,
  "rwh-schematic": RwhSchematic,
  rwhschematic: RwhSchematic,
 floatgauge: FloatSim, weighgauge: WeighSim, cycle: HydroCycle, horton: Horton, catchment: Catchment, indiawater: IndiaWater, gauges: Gauges, stormnet: StormNetwork, threemethods: ThreeMethods, dad: DAD, hmstour: HmsTour, hmselements: HmsElements, qgistour: QgisTour, rasconcept: RasConcept };
