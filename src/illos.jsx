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
    <svg viewBox="0 0 960 500" className={anim ? "" : "paused"}>
      <defs><linearGradient id="hcsky" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#d6eaf3" /><stop offset="1" stopColor={P.sky2} /></linearGradient>
        <linearGradient id="hcsea" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor={P.sea2} /><stop offset="1" stopColor="#164f66" /></linearGradient>
        <Arrow id="ha" /><Arrow id="hag" color={P.gold} /><Arrow id="hab" color="#1f6f8f" /></defs>
      <rect width="960" height="500" fill="url(#hcsky)" />
      <circle cx="890" cy="62" r="30" fill={P.sun} /><g stroke={P.sun} strokeWidth="3">{[0, 45, 90, 135, 180, 225, 270, 315].map(a => <line key={a} x1={890 + 38 * Math.cos(a * Math.PI / 180)} y1={62 + 38 * Math.sin(a * Math.PI / 180)} x2={890 + 50 * Math.cos(a * Math.PI / 180)} y2={62 + 50 * Math.sin(a * Math.PI / 180)} />)}</g>
      {/* ocean */}
      <path d="M0 330 L270 330 L270 500 L0 500Z" fill="url(#hcsea)" />
      <path d="M0 330 q15 -6 30 0 t30 0 t30 0 t30 0 t30 0 t30 0 t30 0 t30 0 t30 0" stroke="#bfe0ec" fill="none" strokeWidth="2" />
      <text x="40" y="470" fontSize="15" fill="#e7f2f7" fontWeight="600">Ocean</text>
      {/* ground: groundwater zone, soil, land */}
      <path d="M250 330 L330 322 L420 305 L520 285 L600 238 L680 168 L760 116 L840 152 L960 210 L960 500 L250 500Z" fill={P.soil} />
      <path d="M262 352 L420 335 L560 318 L700 290 L820 270 L960 262 L960 500 L262 500Z" fill={P.gw} opacity=".9" />
      <path d="M262 352 L420 335 L560 318 L700 290 L820 270 L960 262" stroke="#2f86a8" strokeWidth="2" strokeDasharray="7 5" fill="none" />
      <text x="800" y="258" fontSize="11.5" fill="#1f6f8f">water table</text>
      <text x="720" y="330" fontSize="12.5" fill="#164f66" fontWeight="600">Groundwater (saturated zone)</text>
      <text x="610" y="282" fontSize="11.5" fill="#6b4f2a">unsaturated zone</text>
      <rect x="250" y="470" width="710" height="30" fill={P.rock} /><text x="830" y="490" fontSize="11" fill="#f4f2ee">impervious rock</text>
      <path d="M250 330 L330 322 L420 305 L520 285 L600 238 L680 168 L760 116 L840 152 L960 210 L960 228 L840 172 L760 136 L680 186 L600 254 L520 299 L420 317 L330 332 L250 340Z" fill={P.land} />
      <path d="M720 140 L760 116 L800 135 L780 140 L760 128 Z" fill="#f4f2ee" />
      {/* lake and river */}
      <ellipse cx="470" cy="300" rx="44" ry="8" fill={P.sea2} />
      <path d="M706 172 C650 232 590 250 540 278 S400 312 262 331" stroke={P.sea2} strokeWidth="6" fill="none" strokeLinecap="round" />
      <path d="M706 172 C650 232 590 250 540 278 S400 312 262 331" stroke="#bfe0ec" strokeWidth="2" fill="none" className={anim ? "anim-flow" : ""} />
      <Tree x={360} y={308} s={1.1} /><Tree x={395} y={302} s={0.9} /><Tree x={575} y={250} s={0.9} />
      {/* clouds */}
      <Cloud x={150} y={110} s={0.9} /><Cloud x={650} y={70} s={1.1} fill="#f2f5f7" />
      {/* evaporation */}
      {anim && [70, 130, 190].map((x, i) => <path key={x} className="anim-rise" style={{ animationDelay: i * 0.8 + "s" }} d={`M${x} 315 q8 -10 0 -20 q-8 -10 0 -20 q8 -10 0 -20`} stroke="#5a9fbf" strokeWidth="2.2" fill="none" />)}
      <path d="M130 300 L130 175" stroke={hi("evap")} strokeWidth="2" markerEnd={sel === "evap" ? "url(#hag)" : "url(#ha)"} />
      {/* transpiration */}
      <path d="M380 270 L380 205" stroke={hi("trans")} strokeWidth="2" strokeDasharray="4 3" markerEnd={sel === "trans" ? "url(#hag)" : "url(#ha)"} />
      {/* vapour transport */}
      <path d="M235 95 C350 60 450 55 535 62" stroke={hi("adv")} strokeWidth="2" strokeDasharray="6 5" fill="none" markerEnd={sel === "adv" ? "url(#hag)" : "url(#ha)"} />
      {/* precipitation */}
      {anim ? <Rain x0={590} x1={720} y0={100} n={11} len={16} /> : <g>{[600, 630, 660, 690].map(x => <line key={x} x1={x} y1="104" x2={x - 5} y2="140" stroke="#2f86a8" strokeWidth="2" />)}</g>}
      <path d="M560 105 L545 165" stroke={hi("prec")} strokeWidth="2" markerEnd={sel === "prec" ? "url(#hag)" : "url(#ha)"} />
      {/* surface runoff, infiltration, percolation */}
      <path d="M690 190 L610 248" stroke={hi("runoff")} strokeWidth="3" markerEnd={sel === "runoff" ? "url(#hag)" : "url(#ha)"} />
      <path d="M520 296 L520 322" stroke={hi("infil")} strokeWidth="2.5" markerEnd={sel === "infil" ? "url(#hag)" : "url(#ha)"} />
      <path d="M640 262 L640 298" stroke={hi("perc")} strokeWidth="2.5" strokeDasharray="4 3" markerEnd={sel === "perc" ? "url(#hag)" : "url(#ha)"} />
      {/* groundwater flow */}
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
function Catchment() {
  const [tilt, setTilt] = useState(0);
  const pd = 210 + tilt * 9; // phreatic divide x
  return <Illo title="A catchment and its divides" kind="Interactive" cap="Left: plan view — the divide (dashed) bounds all land draining to the outlet. Right: section A–A — move the slider to tilt the impervious layer and watch the groundwater divide move away from the ridge.">
    <div className="illo-grid">
      <div className="cell"><svg viewBox="0 0 420 320"><defs><Arrow id="cz" color="#1f6f8f" /></defs>
        <rect width="420" height="320" fill="#f4f8f1" />
        {[0, 1, 2, 3].map(k => <path key={k} d={`M${70 + k * 22} ${300 - k * 10} C${40 + k * 18} ${180 - k * 6} ${120 + k * 12} ${50 + k * 14} ${210} ${30 + k * 22} S${370 - k * 14} ${120 + k * 8} ${330 - k * 18} ${300 - k * 10}`} fill="none" stroke="#c9d8bf" strokeWidth="1.5" />)}
        <path d="M70 300 C40 180 120 50 210 30 S370 120 330 300 Z" fill="#e3eedb" stroke="#0f1f3d" strokeWidth="2.5" strokeDasharray="9 6" />
        <path d="M200 300 C205 240 190 200 210 150 S240 90 215 60" stroke="#1f6f8f" strokeWidth="4" fill="none" />
        <path d="M205 210 C170 190 140 150 110 130" stroke="#1f6f8f" strokeWidth="2.5" fill="none" /><path d="M212 170 C250 150 280 120 300 100" stroke="#1f6f8f" strokeWidth="2.5" fill="none" />
        <path d="M200 250 C240 240 280 230 310 200" stroke="#1f6f8f" strokeWidth="2" fill="none" /><path d="M202 260 C170 250 130 240 100 220" stroke="#1f6f8f" strokeWidth="2" fill="none" />
        <circle cx="200" cy="300" r="8" fill="#c8973a" stroke="#0f1f3d" /><text x="214" y="306" fontSize="13" fontWeight="700" fill="#0f1f3d">Outlet</text>
        <text x="250" y="40" fontSize="13" fill="#0f1f3d" fontWeight="600">divide (ridge line)</text>
        <line x1="40" y1="130" x2="380" y2="130" stroke="#8a4b12" strokeDasharray="3 3" /><text x="24" y="134" fontSize="12" fill="#8a4b12">A</text><text x="386" y="134" fontSize="12" fill="#8a4b12">A</text>
        {[[120, 230], [280, 240], [160, 90], [270, 80]].map(([x, y], i) => <path key={i} d={`M${x} ${y} L${x + (200 - x) * 0.25} ${y + (220 - y) * 0.25}`} stroke="#1f6f8f" strokeWidth="1.5" markerEnd="url(#cz)" />)}
      </svg><h6>Plan view</h6><p>Every drop falling inside the dashed line ends up at the outlet.</p></div>
      <div className="cell"><svg viewBox="0 0 420 320">
        <rect width="420" height="320" fill="#fff" />
        <path d="M0 230 L120 150 L210 60 L300 150 L420 230 L420 320 L0 320Z" fill={P.soil} />
        <path d={`M0 ${290 + tilt * 3} L420 ${290 - tilt * 3} L420 320 L0 320Z`} fill={P.rock} />
        <path d={`M0 252 Q${pd / 2} 178 ${pd} 128 Q${pd + (420 - pd) / 2} 178 420 252 L420 ${290 - tilt * 3} L0 ${290 + tilt * 3}Z`} fill={P.gw} opacity=".85" />
        <path d="M0 230 L120 150 L210 60 L300 150 L420 230" stroke="#5f8f4a" strokeWidth="4" fill="none" />
        <line x1="210" y1="30" x2="210" y2="320" stroke="#0f1f3d" strokeDasharray="6 4" /><text x="140" y="24" fontSize="12.5" fill="#0f1f3d" fontWeight="600">topographic divide</text>
        <line x1={pd} y1="100" x2={pd} y2="320" stroke="#1f6f8f" strokeWidth="2" strokeDasharray="4 3" /><text x={Math.min(pd + 6, 330)} y="112" fontSize="12.5" fill="#1f6f8f" fontWeight="600">phreatic divide</text>
        <text x="20" y="312" fontSize="11" fill="#f4f2ee">impervious layer</text>
      </svg><label className="f" style={{ fontSize: 13 }}>Tilt of the impervious layer<input type="range" min="-10" max="10" value={tilt} onChange={e => setTilt(+e.target.value)} /></label>
        <p>{tilt === 0 ? "Divides coincide: the water budget closes." : `Divides differ by about ${Math.abs(Math.round(tilt * 9 / 210 * 100))} % of the half-width — groundwater crosses the ridge, so the catchment ${tilt > 0 ? "gains" : "loses"} water underground.`}</p></div>
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
function Gauges() {
  const [k, setK] = useState("symons");
  const T = { symons: ["Symons' gauge (non-recording)", "IMD's standard non-recording gauge. Rain passes through a 127 mm funnel into a bottle and is measured daily at 08:30 IST with a graduated glass to 0.1 mm. Gives only the 24-hour total."],
    syphon: ["Float (natural syphon) gauge — recording", "IMD's standard recording gauge. A float in a chamber rises with the collected water and moves a pen on a clock-driven drum; at 10 mm a syphon empties the chamber and the pen drops to zero. The chart is a saw-tooth mass curve."],
    weigh: ["Weighing-bucket gauge — recording", "The catch is weighed continuously by a spring balance or load cell, so the chart is directly a mass curve. Records rain, snow and hail."] };
  return <Illo title="Rain gauges — how each one works" kind="Interactive">
    <div className="seg" style={{ marginBottom: 10 }}>{Object.keys(T).map(x => <button key={x} className={k === x ? "on" : ""} onClick={() => setK(x)}>{T[x][0].split(" (")[0].split(" —")[0]}</button>)}</div>
    {k === "syphon" ? <SyphonGauge /> : <div className="wg-row" style={{ alignItems: "flex-start" }}><div className="wg-col" style={{ maxWidth: 360 }}>{k === "symons" ? <SymonsDiagram /> : <WeighingDiagram />}</div><div className="wg-col"><div className="detail" style={{ marginTop: 0 }}><h4>{T[k][0]}</h4>{T[k][1]}</div></div></div>}
    {k === "syphon" && <div className="detail"><h4>{T.syphon[0]}</h4>{T.syphon[1]}</div>}
  </Illo>;
}

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

export const ILLOS = { cycle: HydroCycle, horton: Horton, catchment: Catchment, indiawater: IndiaWater, gauges: Gauges, stormnet: StormNetwork, threemethods: ThreeMethods, dad: DAD, hmstour: HmsTour, hmselements: HmsElements, qgistour: QgisTour, rasconcept: RasConcept };
