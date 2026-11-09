import React, { useState, useEffect, useMemo, useRef } from "react";
import { Plot, path, Legend, C } from "./charts.jsx";
import { ILLOS, FormIcon } from "./illos.jsx";

const f1 = v => (isFinite(v) ? (+v).toFixed(1) : "–");
const f2 = v => (isFinite(v) ? (+v).toFixed(2) : "–");
const f3 = v => (isFinite(v) ? (+v).toFixed(3) : "–");
const big = v => (isFinite(v) ? Math.round(v).toLocaleString("en-IN") : "–");
const sum = a => a.reduce((s, v) => s + v, 0);
const mean = a => sum(a) / a.length;
const sd1 = a => { const m = mean(a); return Math.sqrt(sum(a.map(v => (v - m) ** 2)) / (a.length - 1)); };

function Box({ title, kind = "Interactive", children }) {
  return <div className="wg"><div className="wg-h"><b>{title}</b><span>{kind}</span></div><div className="wg-b">{children}</div></div>;
}
function Kpi({ v, l, tone }) { return <div className={"kpi " + (tone || "")}><div className="v">{v}</div><div className="l">{l}</div></div>; }
function Num({ value, onChange, step = "any", w }) {
  return <input type="number" step={step} value={value} style={w ? { width: w } : null} onChange={e => onChange(e.target.value === "" ? "" : +e.target.value)} />;
}
function Seg({ value, options, onChange }) {
  return <div className="seg">{options.map(([v, l]) => <button key={v} className={v === value ? "on" : ""} onClick={() => onChange(v)}>{l}</button>)}</div>;
}
function useCsv(url) {
  const [rows, setRows] = useState(null);
  useEffect(() => {
    let live = true;
    fetch(url).then(r => r.text()).then(t => {
      const [h, ...ls] = t.trim().split(/\r?\n/); const k = h.split(",");
      if (live) setRows(ls.map(l => { const v = l.split(","); const o = {}; k.forEach((kk, i) => o[kk] = isNaN(+v[i]) ? v[i] : +v[i]); return o; }));
    }).catch(() => live && setRows([]));
    return () => { live = false; };
  }, [url]);
  return rows;
}

/* ============ S01: water budget ============ */
function WaterBudget() {
  const [mode, setMode] = useState("storm");
  const [s, setS] = useState({ A: 150, P: 105, Q: 1.5, T: 10 });
  const [a, setA] = useState({ A: 11839, Q: 144.4, P: 1.08 });
  const presets = { "Slide Q2 (150 ha)": { A: 150, P: 105, Q: 1.5, T: 10 }, "Example 2 (220 ha)": { A: 220, P: 95, Q: 2.1, T: 8 } };
  const Pv = s.P / 1000 * s.A * 1e4, Rv = s.Q * s.T * 3600, L = Pv - Rv, Cr = Rv / Pv;
  const Rd = a.Q * 365 * 86400 / (a.A * 1e6), ET = a.P - Rd;
  const bar = (parts) => <svg viewBox="0 0 600 46">{(() => { let x = 0; return parts.map(([v, c, t]) => { const w = Math.max(0, v) * 600; const el = <g key={t}><rect x={x} y="6" width={w} height="26" fill={c} /><text x={x + 6} y="24" fontSize="12" fill="#fff">{w > 70 ? t : ""}</text></g>; x += w; return el; }); })()}</svg>;
  return <Box title="Water-budget calculator">
    <div style={{ marginBottom: 10 }}><Seg value={mode} onChange={setMode} options={[["storm", "Single storm"], ["annual", "Annual basin"]]} /></div>
    {mode === "storm" ? <div className="wg-row">
      <div className="wg-col">
        <label className="f">Catchment area: <b>{s.A} ha</b><input type="range" min="10" max="1000" value={s.A} onChange={e => setS({ ...s, A: +e.target.value })} /></label>
        <label className="f">Storm rainfall: <b>{s.P} mm</b><input type="range" min="5" max="250" value={s.P} onChange={e => setS({ ...s, P: +e.target.value })} /></label>
        <label className="f">Average runoff discharge: <b>{s.Q} m³/s</b><input type="range" min="0.1" max="10" step="0.1" value={s.Q} onChange={e => setS({ ...s, Q: +e.target.value })} /></label>
        <label className="f">Runoff duration: <b>{s.T} h</b><input type="range" min="1" max="48" value={s.T} onChange={e => setS({ ...s, T: +e.target.value })} /></label>
        <div className="btn-row">{Object.entries(presets).map(([k, v]) => <button key={k} className="btn ghost" onClick={() => setS(v)}>{k}</button>)}</div>
      </div>
      <div className="wg-col">
        <div className="kpis"><Kpi v={big(Pv)} l="Rain volume m³" /><Kpi v={big(Rv)} l="Runoff volume m³" /></div>
        <div className="kpis"><Kpi v={big(L)} l="Losses m³" tone={L < 0 ? "bad" : ""} /><Kpi v={f3(Cr)} l="Runoff coefficient" tone={Cr > 1 ? "bad" : "good"} /></div>
        {bar([[Math.min(Cr, 1), C.river, "Runoff " + Math.round(Cr * 100) + "%"], [Math.max(0, 1 - Cr), C.gold, "Losses " + Math.round((1 - Cr) * 100) + "%"]])}
        {Cr > 1 && <p className="note" style={{ color: C.warn }}>Runoff exceeds rainfall — impossible for a closed catchment. Check the inputs.</p>}
        <p className="note">Rain volume = P × A; runoff volume = Q̄ × t; losses = difference (infiltration + evaporation + transpiration + storage).</p>
      </div>
    </div> : <div className="wg-row">
      <div className="wg-col">
        <label className="f">Drainage area (km²)<Num value={a.A} onChange={v => setA({ ...a, A: v })} /></label>
        <label className="f">Mean annual flow (m³/s)<Num value={a.Q} onChange={v => setA({ ...a, Q: v })} /></label>
        <label className="f">Mean annual rainfall (m)<Num value={a.P} onChange={v => setA({ ...a, P: v })} /></label>
        <div className="btn-row"><button className="btn ghost" onClick={() => setA({ A: 11839, Q: 144.4, P: 1.08 })}>Slide Q3 (Gandak)</button><button className="btn ghost" onClick={() => setA({ A: 5200, Q: 68, P: 1.15 })}>Example 3</button></div>
      </div>
      <div className="wg-col">
        <div className="kpis"><Kpi v={f3(Rd) + " m"} l="Runoff depth" /><Kpi v={f3(ET) + " m"} l="ET = P − R (ΔS ≈ 0)" tone="good" /><Kpi v={f2(Rd / a.P)} l="Runoff coefficient" /></div>
        {bar([[Rd / a.P, C.river, "Runoff"], [ET / a.P, C.brown, "Evapotranspiration"]])}
        <p className="note">Over a full year ΔS ≈ 0, so annual ET ≈ annual rainfall − annual runoff depth.</p>
      </div>
    </div>}
  </Box>;
}

/* ============ S01: global water ============ */
function GlobalWater() {
  const d = [["Oceans (salt water)", 97.2, "#1a5f7a"], ["Glaciers and ice caps", 2.15, "#9cc3d3"], ["Groundwater", 0.6, "#8a4b12"], ["  of which economically available", 0.3, "#c8973a"], ["Lakes and reservoirs", 0.01, "#2d6a4f"], ["Atmosphere", 0.001, "#a09080"], ["Streams and rivers", 0.0001, "#5a3e8c"]];
  const [scale, setScale] = useState("log");
  const [bucket, setBucket] = useState(100);
  const lx = v => scale === "log" ? (Math.log10(v) + 4.5) / (Math.log10(100) + 4.5) : v / 100;
  return <Box title="Where is the Earth's water?">
    <div className="wg-row" style={{ alignItems: "center", marginBottom: 6 }}>
      <Seg value={scale} onChange={setScale} options={[["linear", "Linear scale"], ["log", "Log scale"]]} />
      <label className="f" style={{ flex: "1 1 220px", margin: 0 }}>If all water on Earth were <b>{bucket} litres</b><input type="range" min="1" max="1000" value={bucket} onChange={e => setBucket(+e.target.value)} /></label>
    </div>
    <table><thead><tr><th>Store</th><th style={{ width: "48%" }}>Share</th><th>%</th><th>Your bucket</th></tr></thead><tbody>
      {d.map(([n, v, c]) => <tr key={n}><td style={{ fontFamily: "DM Sans", whiteSpace: "pre" }}>{n}</td>
        <td><div style={{ background: "#f4f2ee", height: 12, borderRadius: 3 }}><div style={{ width: Math.max(0.5, lx(v) * 100) + "%", height: 12, background: c, borderRadius: 3 }} /></div></td>
        <td>{v}</td><td>{(() => { const L = bucket * v / 100; return L >= 1 ? L.toFixed(2) + " L" : L * 1000 >= 1 ? (L * 1000).toFixed(1) + " mL" : (L * 1e6).toFixed(0) + " µL"; })()}</td></tr>)}
    </tbody></table>
    <p className="note">Of 100 litres, rivers — the water most of our engineering works depend on — hold about a tenth of a millilitre. On a linear scale the small stores vanish; switch to log scale to compare them.</p>
  </Box>;
}

/* ============ S02: forms & types ============ */
const FORMS = [
  ["Rain", "rain", "Drops 0.5–6 mm. Light < 2.5 mm/h, moderate 2.5–7.5 mm/h, heavy > 7.5 mm/h. Larger drops break up while falling."],
  ["Drizzle", "drizzle", "Fine droplets under 0.5 mm falling slowly; intensity usually under 1 mm/h."],
  ["Snow", "snow", "Ice crystals, usually as flakes; density 0.06–0.15 g/cm³. In India, mainly the Himalaya."],
  ["Hail", "hail", "Showery precipitation of irregular ice lumps over about 8 mm, built up in layers inside violent thunderstorms with strong updrafts."],
  ["Glaze", "glaze", "Rain or drizzle that freezes on contact with ground or objects at or below 0 °C, forming an ice coat."],
  ["Dew", "dew", "Water condensing directly on cool surfaces at night. Not counted in rainfall totals."],
  ["Frost", "frost", "Ice crystals formed directly on surfaces below 0 °C."],
];
// Photo credits (Wikimedia Commons; each file's licence requires the credit shown under the photo).
const FORM_CREDIT = {
  rain: ["Bidgee", "CC BY-SA 3.0", "https://commons.wikimedia.org/wiki/File:Heavy_precipitation_falling_on_the_Gregadoo_hills_from_a_Cumulonimbus_calvus_cloud_viewed_from_Rocky_Hill.jpg"],
  drizzle: ["Nikhil More", "CC BY-SA 4.0", "https://commons.wikimedia.org/wiki/File:Monsoon_Maharashtra_India_Rain_Landscape_(1)_03.jpg"],
  snow: ["epSos.de", "CC BY 2.0", "https://commons.wikimedia.org/wiki/File:White_Snow_on_the_Christmas_Tree.jpg"],
  hail: ["Rubbish computer", "CC BY-SA 4.0", "https://commons.wikimedia.org/wiki/File:August_5_2017_Warwickshire_hail_05.jpg"],
  glaze: ["Famartin", "CC BY-SA 4.0", "https://commons.wikimedia.org/wiki/File:2025-12-27_10_44_48_Flowering_Dogwood_branches_coated_in_glaze_ice_along_Windybush_Way_in_the_Mountainview_section_of_Ewing_Township,_Mercer_County,_New_Jersey.jpg"],
  dew: ["Peter Balcerzak", "CC BY-SA 3.0", "https://commons.wikimedia.org/wiki/File:Morning_Dew_(180156587).jpeg"],
  frost: ["W.carter", "CC BY-SA 4.0", "https://commons.wikimedia.org/wiki/File:Hoar_frost_on_a_lilac_leaf_in_Tuntorp_1.jpg"],
};
const FORM_ALT = { rain: "A rain shaft falling from a storm cloud over hills", drizzle: "Misty monsoon drizzle over a hill landscape in Maharashtra", snow: "Fresh snow on a conifer branch", hail: "Hailstones in an open hand", glaze: "Twigs coated in clear glaze ice", dew: "Dew drops on blades of grass", frost: "Hoar frost on a leaf" };

/* ---- Types of precipitation: animated, drawn as scenes. Animation uses CSS (and SMIL for moving air parcels) and can be paused. ---- */
function WxStage({ label, children }) {
  const ref = useRef(null);
  const [paused, setPaused] = useState(() => { try { return window.matchMedia("(prefers-reduced-motion: reduce)").matches; } catch (e) { return false; } });
  useEffect(() => { const s = ref.current; if (!s || !s.pauseAnimations) return; paused ? s.pauseAnimations() : s.unpauseAnimations(); }, [paused, children]);
  return <div className={"wx-stage" + (paused ? " wx-paused" : "")}>
    <svg ref={ref} viewBox="0 0 400 260" role="img" aria-label={label}>{children}</svg>
    <button type="button" className="wx-pause" onClick={() => setPaused(!paused)} aria-pressed={paused}>{paused ? "Play animation" : "Pause animation"}</button>
  </div>;
}
const Rainfall = ({ xs, y1, d, delay = 0, w = 1.6, c = "#dbeaf4", op = 0.9 }) => <g>{xs.map((x, i) => <line key={i} className="wx-rain" style={{ "--d": (typeof d === "function" ? d(x) : d) + "px", animationDelay: (delay + (i * 0.37) % 1.1) + "s" }} x1={x} y1={typeof y1 === "function" ? y1(x) : y1} x2={x - 2} y2={(typeof y1 === "function" ? y1(x) : y1) + 9} stroke={c} strokeWidth={w} strokeLinecap="round" opacity={op} />)}</g>;
const Puff = ({ cx, cy, r, fill = "#f4f7fa", op = 1 }) => <circle cx={cx} cy={cy} r={r} fill={fill} opacity={op} />;

function Frontal() {
  const b = x => 215 - (x - 60) * 0.353;                       // the sloping boundary between cold and warm air
  const rainX = Array.from({ length: 15 }, (_, i) => 236 + i * 11);
  return <WxStage label="Frontal precipitation: warm moist air rises over a wedge of cold air, cools, and rain falls ahead of the front">
    <defs>
      <linearGradient id="fr-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#aac3d6" /><stop offset="1" stopColor="#e9f0f5" /></linearGradient>
      <linearGradient id="fr-cold" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#8fb0c6" /><stop offset="1" stopColor="#6e93ab" /></linearGradient>
      <filter id="fr-blur" x="-20%" y="-40%" width="140%" height="180%"><feGaussianBlur stdDeviation="3.2" /></filter>
    </defs>
    <rect width="400" height="260" fill="url(#fr-sky)" />
    <path d="M0 0H400V98L60 215H0Z" fill="#f2c9a4" opacity=".3" />
    <path d="M60 215L400 98V215Z" fill="url(#fr-cold)" />
    <path d="M60 215L400 98" stroke="#2d4c61" strokeWidth="2" strokeDasharray="3 3" opacity=".7" />
    <g filter="url(#fr-blur)"><path d="M150 176L400 92V132L180 196Z" fill="#7d8a97" opacity=".75" />
      {[[150, 168, 34, 13], [198, 152, 38, 14], [248, 136, 40, 14], [300, 119, 42, 15], [352, 101, 44, 15], [392, 90, 30, 13]].map(([x, y, rx, ry], i) => <ellipse key={i} cx={x} cy={y} rx={rx} ry={ry} fill="#d5dce3" />)}</g>
    <g className="wx-drift">{[[40, 36, 1], [310, 30, 0.8]].map(([x, y, s], i) => <g key={i} transform={`translate(${x} ${y}) scale(${s})`} opacity=".85"><Puff cx={0} cy={0} r={14} fill="#fbf2ea" /><Puff cx={16} cy={-5} r={17} fill="#fbf2ea" /><Puff cx={34} cy={2} r={13} fill="#fbf2ea" /></g>)}</g>
    <Rainfall xs={rainX} y1={x => b(x) - 6} d={x => 215 - b(x) + 4} c="#e8f3fa" />
    <rect y="215" width="400" height="45" fill="#6f8f4f" /><rect y="215" width="400" height="6" fill="#5b7a3f" />
    <path d="M0 215q10 -8 22 0t22 0t22 0t22 0" fill="#5b7a3f" />
    <path d="M0 150C90 150 170 128 250 98S360 56 400 46" stroke="#d9772e" strokeWidth="1.6" strokeDasharray="5 6" fill="none" className="wx-flow" opacity=".85" />
    {[0, 1, 2, 3, 4].map(i => <circle key={i} r="4.2" fill="#e8843a" stroke="#fff3e6" strokeWidth="1"><animateMotion dur="9s" begin={`${-i * 1.8}s`} repeatCount="indefinite" path="M0 150C90 150 170 128 250 98S360 56 400 46" /></circle>)}
    <text x="14" y="22" fontSize="15" fontWeight="700" fill="#8a3b12">warm, moist air (lighter)</text>
    <text x="236" y="244" fontSize="15" fontWeight="700" fill="#10324a" textAnchor="middle">cold, dense air (wedge)</text>
    <text x="92" y="190" fontSize="14" fontWeight="700" fill="#10324a" transform="rotate(-19 92 190)">front</text>
    <text x="394" y="204" fontSize="13.5" fill="#10324a" textAnchor="end" fontWeight="700">rain falls ahead of the front</text>
  </WxStage>;
}

function CycloneArms() {
  const spiral = (rot) => { let d = ""; for (let k = 0; k <= 28; k++) { const t = k / 28, a = rot + t * 1.9 * Math.PI, r = 118 - t * 96; d += (k ? "L" : "M") + (170 + r * Math.cos(a)).toFixed(1) + " " + (130 - r * Math.sin(a)).toFixed(1); } return d; };
  return <>{[0, Math.PI / 2, Math.PI, 3 * Math.PI / 2].map((r, i) => <path key={i} d={spiral(r)} className="wx-flow" stroke="#ffd27a" strokeWidth="2" strokeDasharray="7 9" fill="none" strokeLinecap="round" />)}</>;
}
function CyclonePlan() {
  const arm = "M0 0C30 -12 70 -8 104 26";
  return <WxStage label="Cyclonic precipitation: a rotating low-pressure system seen from above, with air spiralling in anticlockwise and rising">
    <defs>
      <radialGradient id="cy-sea" cx=".42" cy=".5" r=".8"><stop offset="0" stopColor="#3b8fb0" /><stop offset="1" stopColor="#14425a" /></radialGradient>
      <filter id="cy-blur" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="5" /></filter>
      <filter id="cy-blur2" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="2.4" /></filter>
    </defs>
    <rect width="400" height="260" fill="url(#cy-sea)" />
    <path d="M338 0H400V260H292C312 214 296 168 322 128C340 100 318 52 338 0Z" fill="#7f9a5f" stroke="#5c7745" strokeWidth="1.4" />
    <text x="364" y="118" fontSize="13.5" fill="#f1f6e6" textAnchor="middle" fontWeight="600">coast</text>
    <g transform="translate(170 130)"><g className="wx-spin" style={{ transformOrigin: "0 0" }}>
      <g filter="url(#cy-blur)">{[0, 90, 180, 270].map(a => <path key={a} transform={`rotate(${a})`} d={arm} stroke="#f4f8fb" strokeWidth="24" fill="none" strokeLinecap="round" opacity=".78" />)}
        {[45, 135, 225, 315].map(a => <path key={a} transform={`rotate(${a})`} d="M0 0C24 -8 54 -4 80 18" stroke="#e5edf3" strokeWidth="16" fill="none" strokeLinecap="round" opacity=".6" />)}</g>
      <g filter="url(#cy-blur2)"><circle r="32" fill="#f7fbfd" opacity=".85" /></g>
    </g><circle r="9" fill="#14425a" /><circle r="13" fill="none" stroke="#fff" strokeWidth="1.5" opacity=".7" /></g>
    <g transform="translate(-0 0)"><CycloneArms /></g>
    <rect x="8" y="8" width="262" height="48" rx="6" fill="#0c2a3a" opacity=".72" />
    <text x="16" y="28" fontSize="14.5" fontWeight="700" fill="#fff">LOW pressure: air spirals in</text><text x="16" y="47" fontSize="13" fill="#ffe4a3">anticlockwise (N. hemisphere), rises</text>
    <text x="170" y="250" fontSize="13.5" fill="#e8f1f6" textAnchor="middle">heavy rain in the spiral bands</text>
  </WxStage>;
}

function Convective() {
  const thermals = [[132, 0], [168, 0.6], [214, 1.1], [252, 1.7]];
  return <WxStage label="Convective precipitation: the sun heats the ground, warm air rises in thermals, a cumulonimbus cloud grows and a short intense shower falls">
    <defs>
      <linearGradient id="cv-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#6fa6cf" /><stop offset="1" stopColor="#d8e9f3" /></linearGradient>
      <linearGradient id="cv-grd" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#c7a965" /><stop offset="1" stopColor="#8d7544" /></linearGradient>
      <radialGradient id="cv-sun"><stop offset="0" stopColor="#fff3c4" /><stop offset="1" stopColor="#f4c14e" /></radialGradient>
      <filter id="cv-soft" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="1.6" /></filter>
    </defs>
    <rect width="400" height="260" fill="url(#cv-sky)" />
    <g transform="translate(46 44)"><g className="wx-spin slow" style={{ transformOrigin: "0 0" }}>{Array.from({ length: 12 }, (_, i) => <line key={i} x1="26" y1="0" x2="40" y2="0" transform={`rotate(${i * 30})`} stroke="#f4c14e" strokeWidth="3" strokeLinecap="round" />)}</g><circle r="22" fill="url(#cv-sun)" /></g>
    <g className="wx-grow" style={{ transformOrigin: "205px 128px" }}>
      <g filter="url(#cv-soft)">
        {[[205, 118, 36], [165, 112, 28], [245, 114, 28], [190, 88, 32], [228, 84, 30], [208, 60, 28], [196, 38, 22], [222, 40, 20]].map(([x, y, r], i) => <Puff key={i} cx={x} cy={y} r={r} />)}
        <ellipse cx="205" cy="22" rx="62" ry="9" fill="#f1f5f8" className="wx-anvil" />
        <ellipse cx="205" cy="132" rx="58" ry="11" fill="#7d8a97" />
        {[[176, 100, 16], [232, 102, 14], [210, 74, 15]].map(([x, y, r], i) => <circle key={i} cx={x} cy={y} r={r} fill="#d9e0e7" opacity=".7" />)}</g>
    </g>
    <Rainfall xs={[170, 180, 190, 200, 210, 220, 230, 240]} y1={140} d={64} delay={3.2} c="#f1f8fc" w={1.8} />
    <rect y="206" width="400" height="54" fill="url(#cv-grd)" />
    {[0, 1, 2].map(i => <path key={i} d={`M${24 + i * 8} ${204 - i * 5}q16 -7 32 0t32 0t32 0t32 0t32 0t32 0t32 0`} stroke="#fff4d6" strokeWidth="1.6" fill="none" opacity=".45" className="wx-shimmer" style={{ animationDelay: i * 0.5 + "s" }} />)}
    {thermals.map(([x, dl], i) => <g key={i}><path d={`M${x} 204C${x - 10} 180 ${x + 10} 160 ${x} 140C${x - 8} 124 ${x + 6} 112 ${x} 100`} stroke="#e9902f" strokeWidth="1.6" strokeDasharray="4 6" fill="none" className="wx-flow wx-up" opacity=".9" />
      <circle r="3.6" fill="#f08a2c"><animateMotion dur="4.2s" begin={`${-dl * 2}s`} repeatCount="indefinite" path={`M${x} 204C${x - 10} 180 ${x + 10} 160 ${x} 140C${x - 8} 124 ${x + 6} 112 ${x} 100`} /></circle></g>)}
    <text x="12" y="236" fontSize="12" fontWeight="700" fill="#fff4d6">sun-heated ground</text>
    <text x="312" y="78" fontSize="14" fontWeight="700" fill="#0f3050" textAnchor="middle">cumulonimbus</text><text x="312" y="92" fontSize="13" fill="#0f3050" textAnchor="middle">grows tall in minutes</text>
    <text x="250" y="190" fontSize="14" fontWeight="700" fill="#10324a" textAnchor="middle">short, intense shower</text>
    <text x="104" y="160" fontSize="13.5" fontWeight="700" fill="#8a3b12">rising warm air</text>
  </WxStage>;
}

function Orographic() {
  const flow = "M0 168C70 168 118 150 160 112S238 54 290 66";
  return <WxStage label="Orographic precipitation: moist air from the sea is forced up a mountain, cools, and rains on the windward slope, leaving a dry rain shadow behind">
    <defs>
      <linearGradient id="or-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#8db5d4" /><stop offset="1" stopColor="#e3eef5" /></linearGradient>
      <linearGradient id="or-wind" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#4f8a3e" /><stop offset="1" stopColor="#2f6a32" /></linearGradient>
      <linearGradient id="or-lee" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#c4ad73" /><stop offset="1" stopColor="#9b8756" /></linearGradient>
      <filter id="or-blur" x="-20%" y="-30%" width="140%" height="160%"><feGaussianBlur stdDeviation="2.4" /></filter>
    </defs>
    <rect width="400" height="260" fill="url(#or-sky)" />
    <g><rect y="214" width="96" height="46" fill="#2a7ba0" /><path className="wx-wave" d="M-30 218q12 -6 24 0t24 0t24 0t24 0t24 0t24 0t24 0t24 0" stroke="#bfe3f1" strokeWidth="1.6" fill="none" /></g>
    <path d="M76 214L130 170L196 100L228 62L228 260H76Z" fill="url(#or-wind)" />
    <path d="M228 62L262 98L318 168L400 204V260H228Z" fill="url(#or-lee)" />
    <path d="M214 76L228 62L242 78L234 74L228 82L222 74Z" fill="#fff" opacity=".95" />
    {[[110, 190], [128, 176], [150, 160], [172, 138], [190, 118]].map(([x, y], i) => <path key={i} d={`M${x} ${y}l-5 12h10z`} fill="#245c2a" />)}
    <g filter="url(#or-blur)" className="wx-drift slow">{[[150, 100, 26, 11], [184, 84, 28, 12], [214, 68, 24, 10], [176, 108, 30, 11]].map(([x, y, rx, ry], i) => <ellipse key={i} cx={x} cy={y} rx={rx} ry={ry} fill="#f2f6f9" />)}</g>
    <Rainfall xs={[138, 150, 162, 174, 186, 198, 210]} y1={x => 112 - (x - 138) * 0.58} d={x => 36 + (x - 138) * 0.1} c="#f4fafd" />
    <path d={flow} className="wx-flow" stroke="#2f86a8" strokeWidth="1.8" strokeDasharray="6 7" fill="none" />
    <path d="M0 136C60 136 100 118 140 84" className="wx-flow" stroke="#2f86a8" strokeWidth="1.4" strokeDasharray="6 7" fill="none" opacity=".7" />
    {[0, 1, 2, 3].map(i => <circle key={i} r="4" fill="#3a97bf" stroke="#fff" strokeWidth="1"><animateMotion dur="8s" begin={`${-i * 2}s`} repeatCount="indefinite" path={flow} /></circle>)}
    <path d="M262 64C300 66 340 100 400 138" className="wx-flow" stroke="#c2742c" strokeWidth="1.6" strokeDasharray="3 8" fill="none" opacity=".85" />
    {[0, 1, 2].map(i => <circle key={i} r="3.2" fill="#d98630"><animateMotion dur="7s" begin={`${-i * 2.3}s`} repeatCount="indefinite" path="M262 64C300 66 340 100 400 138" /></circle>)}
    <text x="8" y="120" fontSize="14" fontWeight="700" fill="#10405a">moist monsoon air from the sea</text>
    <text x="108" y="238" fontSize="14" fontWeight="700" fill="#fff">windward: heavy rain</text>
    <text x="300" y="230" fontSize="14" fontWeight="700" fill="#4a3a14" textAnchor="middle">leeward: rain shadow</text>
    <text x="352" y="124" fontSize="13" fill="#8a4b12" textAnchor="middle" fontWeight="600">dry, sinking air</text>
  </WxStage>;
}
const TYPES = [
  ["Frontal", <Frontal />, "Two air masses of different temperature and density meet. Warm, lighter air is forced up over the cold air along the front and cools to condensation. Cold fronts: short, intense rain; warm fronts: long, moderate rain over wide areas.", "Western disturbances bringing winter rain and snow to north-west India."],
  ["Cyclonic", <CyclonePlan />, "A large low-pressure system; air converges and spirals in — anticlockwise in the northern hemisphere — and rises. Tropical cyclones form over warm seas and bring very heavy rain and storm surge. Anticyclones (highs) have outward, clockwise winds and calm centres.", "Bay of Bengal cyclones striking Odisha and Andhra Pradesh in Oct–Nov."],
  ["Convective", <Convective />, "Local surface heating makes air rise, cool and condense into cumulonimbus clouds. Intense, short, local (about 10 km across).", "Bengaluru's April–May and post-monsoon evening thunderstorms."],
  ["Orographic", <Orographic />, "Moist air forced up a mountain barrier cools and rains on the windward side; descending air on the leeward side is dry — a rain shadow.", "Western Ghats: Agumbe gets several thousand mm while places just east on the plateau get far less."],
];
function PrecipExplorer() {
  const [f, setF] = useState(0); const [t, setT] = useState(3);
  const cr = FORM_CREDIT[FORMS[f][1]];
  return <Box title="Forms and types of precipitation">
    <div className="sec-title" style={{ marginTop: 0 }}>Forms</div>
    <div className="fcards" role="group" aria-label="Forms of precipitation">{FORMS.map(([n, k], i) => <button type="button" key={n} className={"fcard" + (i === f ? " on" : "")} aria-pressed={i === f} onClick={() => setF(i)}><img src={"assets/img/forms/" + k + ".jpg"} alt={FORM_ALT[k]} loading="lazy" width="300" height="400" /><span>{n}</span></button>)}</div>
    <div className="detail"><h4>{FORMS[f][0]}</h4>{FORMS[f][2]}<p className="note" style={{ fontSize: 12, marginTop: 6 }}>Photo: {cr[0]}, {cr[1]}, via <a href={cr[2]} target="_blank" rel="noopener noreferrer">Wikimedia Commons</a>.</p></div>
    <div className="sec-title">Types — by what lifts the air</div>
    <Seg value={t} onChange={setT} options={TYPES.map((x, i) => [i, x[0]])} />
    <div className="wx-row">
      <div className="wx-fig">{TYPES[t][1]}</div>
      <div className="detail wx-text"><h4>{TYPES[t][0]} precipitation</h4><p>{TYPES[t][2]}</p><p style={{ marginTop: 6 }}><b>Indian example:</b> {TYPES[t][3]}</p></div>
    </div>
  </Box>;
}

/* ============ S03: tipping bucket + network ============ */
function TippingBucket() {
  const [I, setI] = useState(30); const [b, setB] = useState(0.25); const [run, setRun] = useState(false);
  const [t, setT] = useState(0); const [fill, setFill] = useState(0); const [tips, setTips] = useState([]); const [side, setSide] = useState(1);
  const SPEED = 60; // 1 real second = 60 simulated seconds
  useEffect(() => {
    if (!run) return; const id = setInterval(() => {
      setT(tt => tt + SPEED / 10);
      setFill(fl => {
        let nf = fl + I / 3600 * SPEED / 10;
        if (nf >= b) { nf -= b; setSide(s => -s); setTips(tp => [...tp.slice(-199), 1]); }
        return nf;
      });
    }, 100); return () => clearInterval(id);
  }, [run, I, b]);
  const reset = () => { setT(0); setFill(0); setTips([]); setRun(false); };
  const depth = tips.length * b, ang = side * 18;
  return <Box title="Tipping-bucket rain gauge — simulator">
    <div className="wg-row">
      <div className="wg-col" style={{ maxWidth: 260 }}>
        <svg viewBox="0 0 220 200"><path d="M70 10 L150 10 L118 60 L102 60Z" fill="#cfd6dd" stroke="#0f1f3d" /><text x="110" y="8" fontSize="9" textAnchor="middle">funnel</text>
          {run && [0, 1, 2].map(k => <circle key={k} cx="110" cy={66 + ((t * 3 + k * 12) % 34)} r="2" fill="#1a5f7a" />)}
          <g transform={`rotate(${ang} 110 120)`}><path d="M50 120 L170 120" stroke="#0f1f3d" strokeWidth="3" /><path d="M55 120 L75 100 L105 100 L105 120Z" fill="#e3f0f4" stroke="#0f1f3d" /><path d="M115 120 L115 100 L145 100 L165 120Z" fill="#e3f0f4" stroke="#0f1f3d" />
            <rect x={side > 0 ? 116 : 76} y={120 - Math.min(1, fill / b) * 20} width="28" height={Math.min(1, fill / b) * 20} fill="#1a5f7a" opacity=".7" /></g>
          <polygon points="104,135 116,135 110,122" fill="#c8973a" /><rect x="60" y="160" width="100" height="26" fill="#f4f2ee" stroke="#a09080" /><text x="110" y="177" fontSize="11" textAnchor="middle">tips: {tips.length}</text></svg>
      </div>
      <div className="wg-col">
        <label className="f">Rain intensity: <b>{I} mm/h</b><input type="range" min="1" max="150" value={I} onChange={e => setI(+e.target.value)} /></label>
        <label className="f">Bucket size: <Seg value={b} onChange={v => { setB(v); reset(); }} options={[[0.2, "0.2 mm"], [0.25, "0.25 mm"], [0.5, "0.5 mm"]]} /></label>
        <div className="btn-row" style={{ margin: "8px 0" }}><button className="btn" onClick={() => setRun(!run)}>{run ? "Pause" : "Start rain"}</button><button className="btn ghost" onClick={reset}>Reset</button></div>
        <div className="kpis"><Kpi v={(t / 60).toFixed(1) + " min"} l="Simulated time" /><Kpi v={depth.toFixed(2) + " mm"} l="Recorded depth" /><Kpi v={t > 0 ? (depth / (t / 3600)).toFixed(1) : "–"} l="Recorded mm/h" /></div>
        <p className="note">Each tip records one bucket-full ({b} mm) with its time. The record is a staircase — the mass curve — and intensity is tips per unit time. In very heavy rain some water is lost while the bucket is tipping, so real gauges under-record.</p>
      </div>
    </div>
  </Box>;
}
function GaugeNetwork() {
  const presets = { "Slide Q1 (cm)": [89, 54, 45, 41, 55], "Example (mm)": [1120, 860, 735, 690, 912, 1040], "TG1–TG3 storm (mm)": [105, 86, 124] };
  const [v, setV] = useState(presets["Slide Q1 (cm)"]); const [e, setE] = useState(10);
  const [area, setArea] = useState(1800); const [terr, setTerr] = useState(520);
  const vals = v.filter(x => x !== "" && isFinite(x)); const m = mean(vals), s = sd1(vals), cv = 100 * s / m, N = (cv / e) ** 2;
  const Nr = Math.ceil(N - 1e-9);
  return <Box title="Optimum number of rain gauges">
    <div className="wg-row">
      <div className="wg-col" style={{ maxWidth: 260 }}>
        <table><thead><tr><th>Gauge</th><th>Rainfall</th><th /></tr></thead><tbody>
          {v.map((x, i) => <tr key={i}><td>{i + 1}</td><td><Num value={x} onChange={nv => setV(v.map((y, j) => j === i ? nv : y))} /></td><td><button className="btn ghost" style={{ padding: "1px 7px" }} onClick={() => setV(v.filter((_, j) => j !== i))}>×</button></td></tr>)}
        </tbody></table>
        <div className="btn-row" style={{ marginTop: 6 }}><button className="btn ghost" onClick={() => setV([...v, Math.round(m || 50)])}>+ gauge</button>{Object.entries(presets).map(([k, p]) => <button key={k} className="btn ghost" onClick={() => setV(p)}>{k}</button>)}</div>
      </div>
      <div className="wg-col">
        <label className="f">Allowable error ε: <b>{e} %</b><input type="range" min="2" max="25" value={e} onChange={x => setE(+x.target.value)} /></label>
        <div className="kpis"><Kpi v={f1(m)} l="Mean P̄" /><Kpi v={f1(s)} l="σ (n−1)" /><Kpi v={f2(cv) + "%"} l="Cv" /></div>
        <div className="kpis"><Kpi v={f2(N)} l="N = (Cv/ε)²" /><Kpi v={Nr} l="Gauges needed" tone="good" /><Kpi v={Math.max(0, Nr - vals.length)} l="Additional gauges" tone={Nr > vals.length ? "bad" : "good"} /></div>
        <div className="sec-title" style={{ fontSize: 15 }}>IS 4987 density check</div>
        <div className="wg-row"><label className="f" style={{ flex: 1 }}>Catchment area (km²)<Num value={area} onChange={setArea} /></label>
          <label className="f" style={{ flex: 1 }}>Terrain<select value={terr} onChange={x => setTerr(+x.target.value)}><option value={520}>Plains — 1 per 520 km²</option><option value={325}>~1000 m elevation — 1 per 260–390 km²</option><option value={130}>Hilly, heavy rain — 1 per 130 km²</option></select></label></div>
        <p className="note">IS 4987: about <b>{Math.ceil(area / terr)}</b> gauges, of which at least <b>{Math.max(1, Math.ceil(0.1 * Math.ceil(area / terr)))}</b> self-recording (10 %).</p>
      </div>
    </div>
  </Box>;
}

/* ============ S04: double mass curve ============ */
const DMC_SLIDE = (() => {
  const yrs = []; for (let y = 1972; y >= 1937; y--) yrs.push(y);
  const X = [188, 185, 310, 295, 208, 287, 183, 304, 228, 216, 224, 203, 284, 295, 206, 269, 241, 284, 223, 173, 282, 218, 246, 284, 493, 320, 274, 322, 437, 389, 305, 320, 328, 308, 302, 414];
  const B = [264, 228, 386, 297, 284, 350, 236, 371, 234, 290, 282, 246, 264, 332, 231, 234, 231, 312, 360, 234, 333, 236, 251, 284, 361, 282, 252, 274, 302, 350, 228, 312, 284, 315, 280, 343];
  return yrs.map((y, i) => ({ year: y, X: X[i], B: B[i] }));
})();
function DoubleMass() {
  const course = useCsv("data/U1_annual_rainfall_1991_2020.csv");
  const [ds, setDs] = useState("slide");
  const [own, setOwn] = useState("");
  const parseOwn = t => t.trim().split(/\r?\n/).map(l => l.split(/[,\t;]/).map(v => v.trim())).filter(c => c.length >= 3 && /^\d{4}$/.test(c[0]))
    .map(c => { const v = c.slice(1).map(Number).filter(x => isFinite(x) && x > 0); return v.length >= 2 ? { year: +c[0], X: v[0], B: mean(v.slice(1, 6)) } : null; }).filter(Boolean);
  const rows = useMemo(() => ds === "slide" ? DMC_SLIDE : ds === "own" ? parseOwn(own) : (course || []).map(r => ({ year: r.year, X: r.X, B: (r.A + r.B + r.C + r.D + r.E) / 5 })), [ds, course, own]);
  const [step, setStep] = useState(0);
  const [nAcc, setNAcc] = useState(1);      // rows accumulated so far (step 2)
  const [nPlot, setNPlot] = useState(1);    // points plotted so far (step 3)
  const [k, setK] = useState(6);            // student's break (points in first segment)
  const [checked, setChecked] = useState(false);
  const [fix, setFix] = useState("second");
  useEffect(() => { setStep(0); setNAcc(1); setNPlot(1); setK(6); setChecked(false); }, [ds, own]);
  const dsSeg = <div className="wg-row" style={{ alignItems: "center", marginBottom: 8 }}>
    <Seg value={ds} onChange={setDs} options={[["slide", "Slide data 1937–1972"], ["course", "Course data 1991–2020"], ["own", "Paste your data"]]} />
  </div>;
  const ownBox = ds === "own" && <div style={{ marginBottom: 10 }}>
    <p className="note">Paste rows of <b>year, X, A, B, C…</b> (comma or tab separated) — e.g. <code>annual_rain.csv</code> from Lab L17, or columns copied from a spreadsheet. The first number after the year is the station under test; the rest are base stations (up to five). Years with a blank value are skipped.</p>
    <textarea value={own} onChange={e => setOwn(e.target.value)} rows={6} style={{ width: "100%", fontFamily: "var(--mono)", fontSize: 13 }} placeholder={"year,X,A,B,C,D,E\n1991,912,880,940,905,870,951\n1992,1004,…"} />
    <p className="note">{rows.length} usable years{rows.length > 0 && rows.length < 8 ? " — need at least 8" : ""}.</p>
  </div>;
  if (rows.length < 8) return <Box title="Double mass curve — step by step">{dsSeg}{ownBox || "Loading data…"}</Box>;
  const n = rows.length;
  let cx = 0, cb = 0; const pts = rows.map(r => { cx += r.X; cb += r.B; return { ...r, cx, cb }; });
  const seg = kk => { const p1 = pts[kk - 1], pe = pts[n - 1]; return { p1, s1: p1.cx / p1.cb, s2: (pe.cx - p1.cx) / (pe.cb - p1.cb) }; };
  const sse = kk => { const { p1, s1, s2 } = seg(kk); return pts.reduce((e, p, i) => { const f = i < kk ? p.cb * s1 : p1.cx + (p.cb - p1.cb) * s2; return e + (p.cx - f) ** 2; }, 0); };
  let best = 3; { let be = Infinity; for (let j = 3; j <= n - 3; j++) { const e = sse(j); if (e < be) { be = e; best = j; } } }
  const kk = Math.min(Math.max(k, 3), n - 3);
  const { p1, s1, s2 } = seg(kk);
  const factor = fix === "second" ? s1 / s2 : s2 / s1;
  const isCorr = i => fix === "second" ? i >= kk : i < kk;
  let ccx = 0; const cpts = pts.map((p, i) => { ccx += isCorr(i) ? p.X * factor : p.X; return { ...p, ccx }; });
  const pe = pts[n - 1];
  const xm = pe.cb * 1.04, ym = Math.max(pe.cx, pe.cb * Math.max(s1, s2)) * 1.06;
  const r0 = v => Math.round(v).toLocaleString("en-IN");
  const steps = ["Data", "Accumulate", "Plot", "Find the break", "Slopes", "Correct"];
  const tbl = (shown, extra) => <div style={{ maxHeight: 300, overflow: "auto" }}><table><thead><tr><th>Year</th><th>X (mm)</th><th>Base mean (mm)</th>{extra && <><th>ΣX</th><th>ΣBase</th></>}</tr></thead><tbody>
    {pts.map((p, i) => <tr key={p.year} style={extra && i === shown - 1 ? { background: "#fff6df" } : null}><td>{p.year}</td><td>{p.X}</td><td>{f1(p.B)}</td>{extra && <><td>{i < shown ? r0(p.cx) : ""}</td><td>{i < shown ? r0(p.cb) : ""}</td></>}</tr>)}
  </tbody></table></div>;
  const plot = (np, opts = {}) => <Plot w={660} h={320} x={[0, xm]} y={[0, ym]} xLabel="Cumulative mean rainfall of base stations (mm)" yLabel="Cumulative rainfall at X (mm)">{(sx, sy) => <>
    {opts.lines && <path d={path([[0, 0], [xm, xm * s1]], sx, sy)} stroke={C.river} strokeDasharray="5 4" fill="none" />}
    {opts.lines && <path d={path([[p1.cb, p1.cx], [xm, p1.cx + (xm - p1.cb) * s2]], sx, sy)} stroke={C.brown} strokeDasharray="5 4" fill="none" />}
    {opts.corr && <path d={path(cpts.map(p => [p.cb, p.ccx]), sx, sy)} stroke={C.green} strokeWidth="2.5" fill="none" />}
    {pts.slice(0, np).map((p, i) => <circle key={p.year} cx={sx(p.cb)} cy={sy(p.cx)} r="3.6" fill={opts.lines || opts.corr ? (i < kk ? C.river : C.brown) : C.navy} opacity={opts.corr ? 0.45 : 1}><title>{p.year}: ΣX {r0(p.cx)}, ΣB {r0(p.cb)}</title></circle>)}
    {!opts.lines && !opts.corr && np > 0 && <text x={sx(pts[np - 1].cb) + 8} y={sy(pts[np - 1].cx) - 6} fontSize="11" fill={C.navy}>{pts[np - 1].year}</text>}
    {opts.lines && <><circle cx={sx(p1.cb)} cy={sy(p1.cx)} r="7" fill="none" stroke={C.gold} strokeWidth="2" /><text x={sx(p1.cb) - 10} y={sy(p1.cx) - 10} fontSize="11" textAnchor="end" fill={C.navy}>break: {p1.year} | {pts[kk].year}</text></>}
  </>}</Plot>;
  const body = [
    <div key="0">
      <p>Each row is one year: the rainfall at the station under test, <b>X</b>, and the <b>mean of the base stations</b> around it. Look for anything odd — you usually cannot see an inconsistency in the raw numbers, which is why we accumulate.</p>
      {tbl(0, false)}
    </div>,
    <div key="1">
      <p>Add each year to the running totals. ΣX for year <i>i</i> = ΣX for year <i>i</i>−1 + X<sub>i</sub>; the same for the base mean.{ds === "slide" ? " (T1 accumulates from the latest year backwards; this table runs in the order the data are listed — either works if you are consistent.)" : ""}</p>
      <div className="btn-row"><button className="btn" onClick={() => setNAcc(Math.min(n, nAcc + 1))}>Add next year</button><button className="btn ghost" onClick={() => setNAcc(n)}>Fill all</button><button className="btn ghost" onClick={() => setNAcc(1)}>Reset</button></div>
      {nAcc <= n && nAcc > 1 && <p className="note">{pts[nAcc - 1].year}: ΣX = {r0(pts[nAcc - 2].cx)} + {pts[nAcc - 1].X} = <b>{r0(pts[nAcc - 1].cx)}</b>; ΣBase = {r0(pts[nAcc - 2].cb)} + {f1(pts[nAcc - 1].B)} = <b>{r0(pts[nAcc - 1].cb)}</b></p>}
      {tbl(nAcc, true)}
    </div>,
    <div key="2">
      <p>Plot ΣX (y) against ΣBase (x), one year at a time. A consistent record keeps to a <b>straight line</b> through the origin.</p>
      <label className="f">Years plotted: <b>{nPlot} of {n}</b><input type="range" min="1" max={n} value={nPlot} onChange={e => setNPlot(+e.target.value)} /></label>
      <div className="btn-row"><button className="btn ghost" onClick={() => setNPlot(n)}>Plot all</button></div>
      {plot(nPlot)}
    </div>,
    <div key="3">
      <p>Slide the break to the year where the points change direction, then check your choice. In practice, confirm it with the station's history (a shifted gauge, new building, new instrument).</p>
      <label className="f">Break between <b>{p1.year}</b> and <b>{pts[kk].year}</b><input type="range" min="3" max={n - 3} value={kk} onChange={e => { setK(+e.target.value); setChecked(false); }} /></label>
      <div className="btn-row"><button className="btn" onClick={() => setChecked(true)}>Check my break</button></div>
      {checked && (Math.abs(kk - best) <= 1
        ? <p className="note" style={{ color: C.green }}>✓ Good — the two straight lines fit best with the break between {pts[best - 1].year} and {pts[best].year}.</p>
        : <p className="note" style={{ color: C.warn }}>Not yet — look for where the points bend {kk < best ? "later" : "earlier"}. The two lines should hug the points on both sides.</p>)}
      {plot(n, { lines: true })}
    </div>,
    <div key="4">
      <p>Slope of each straight segment:</p>
      <div className="calc">
        <p><b>M<sub>a</sub></b> ({pts[0].year}–{p1.year}) = ΣX / ΣBase at {p1.year} = {r0(p1.cx)} / {r0(p1.cb)} = <b>{f3(s1)}</b></p>
        <p><b>M<sub>c</sub></b> ({pts[kk].year}–{pe.year}) = ({r0(pe.cx)} − {r0(p1.cx)}) / ({r0(pe.cb)} − {r0(p1.cb)}) = {r0(pe.cx - p1.cx)} / {r0(pe.cb - p1.cb)} = <b>{f3(s2)}</b></p>
      </div>
      <div className="kpis"><Kpi v={f3(s1)} l={`Slope ${pts[0].year}–${p1.year}`} /><Kpi v={f3(s2)} l={`Slope ${pts[kk].year}–${pe.year}`} /><Kpi v={f1(Math.abs(s2 / s1 - 1) * 100) + " %"} l="Change in slope" tone={Math.abs(s2 / s1 - 1) > 0.05 ? "bad" : "good"} /></div>
      <p className="note">A change of only a few per cent may be chance; correct only a clear, persistent break with a physical cause.</p>
    </div>,
    <div key="5">
      <div className="wg-row" style={{ alignItems: "center" }}><span className="note" style={{ margin: 0 }}>Treat as correct:</span>
        <Seg value={fix} onChange={setFix} options={[["second", `first period (${pts[0].year}–${p1.year})`], ["first", `second period (${pts[kk].year}–${pe.year})`]]} /></div>
      <p>Correction factor = {fix === "second" ? <>M<sub>a</sub> / M<sub>c</sub> = {f3(s1)} / {f3(s2)}</> : <>M<sub>c</sub> / M<sub>a</sub> = {f3(s2)} / {f3(s1)}</>} = <b>{f3(factor)}</b>, applied to every year of the {fix === "second" ? "second" : "first"} period: P<sub>cx</sub> = P<sub>x</sub> × {f3(factor)}.</p>
      {plot(n, { corr: true })}
      <p className="note">Green line: the corrected record — now one straight line. Faded dots: the original.</p>
      <div style={{ maxHeight: 260, overflow: "auto" }}><table><thead><tr><th>Year</th><th>X recorded</th><th>X corrected</th></tr></thead><tbody>
        {pts.map((p, i) => <tr key={p.year}><td>{p.year}</td><td>{p.X}</td><td style={{ color: isCorr(i) ? C.warn : null }}>{isCorr(i) ? Math.round(p.X * factor) : p.X}</td></tr>)}
      </tbody></table></div>
    </div>,
  ];
  return <Box title="Double mass curve — step by step">
    {dsSeg}{ownBox}
    <div className="stepper">{steps.map((t, i) => <button key={t} className={(i === step ? "on " : "") + (i < step ? "done" : "")} onClick={() => setStep(i)}><span>{i + 1}</span>{t}</button>)}</div>
    {body[step]}
    <div className="btn-row" style={{ justifyContent: "space-between", marginTop: 12 }}>
      <button className="btn ghost" disabled={step === 0} onClick={() => setStep(step - 1)}>← Back</button>
      {step < 5 && <button className="btn" onClick={() => { if (step === 1) setNAcc(n); setStep(step + 1); }}>Next: {steps[step + 1]} →</button>}
    </div>
  </Box>;
}

/* ============ S05: Thiessen ============ */
const CATCH = [[0, 0], [2.2, -0.6], [4.6, -0.2], [6.8, 0.9], [8.1, 2.8], [8.4, 5.0], [7.3, 6.9], [5.6, 7.8], [3.4, 7.6], [1.7, 6.4], [0.4, 4.6], [-0.5, 2.4]];
const areaOf = p => Math.abs(p.reduce((s, a, i) => { const b = p[(i + 1) % p.length]; return s + a[0] * b[1] - b[0] * a[1]; }, 0)) / 2;
function clipHalf(poly, a, b) { // keep points closer to a than b
  const mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2, nx = b[0] - a[0], ny = b[1] - a[1];
  const f = p => (p[0] - mx) * nx + (p[1] - my) * ny; const out = [];
  for (let i = 0; i < poly.length; i++) {
    const P = poly[i], Q = poly[(i + 1) % poly.length], fp = f(P), fq = f(Q);
    if (fp <= 0) out.push(P);
    if ((fp < 0 && fq > 0) || (fp > 0 && fq < 0)) { const t = fp / (fp - fq); out.push([P[0] + t * (Q[0] - P[0]), P[1] + t * (Q[1] - P[1])]); }
  }
  return out;
}
const inside = (pt, poly) => { let c = false; for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) { const [xi, yi] = poly[i], [xj, yj] = poly[j]; if ((yi > pt[1]) !== (yj > pt[1]) && pt[0] < (xj - xi) * (pt[1] - yi) / (yj - yi) + xi) c = !c; } return c; };
function Thiessen() {
  const init = [{ n: "TG1", p: [4.0, 3.6], P: 105 }, { n: "TG2", p: [1.6, 1.4], P: 86 }, { n: "TG3", p: [6.9, 5.9], P: 124 }, { n: "TG4", p: [9.6, 0.8], P: 71 }];
  const [g, setG] = useState(init); const [drag, setDrag] = useState(null);
  const W = 520, H = 440, X0 = -2, X1 = 11, Y0 = -2, Y1 = 9.5;
  const sx = x => (x - X0) / (X1 - X0) * W, sy = y => H - (y - Y0) / (Y1 - Y0) * H;
  const ref = useRef();
  const A = areaOf(CATCH);
  const cells = g.map((gi, i) => { let poly = CATCH; g.forEach((gj, j) => { if (j !== i && poly.length) poly = clipHalf(poly, gi.p, gj.p); }); return poly; });
  const areas = cells.map(c => c.length > 2 ? areaOf(c) : 0);
  const map = sum(g.map((gi, i) => gi.P * areas[i] / A));
  const ins = g.filter(gi => inside(gi.p, CATCH)); const ar = ins.length ? mean(ins.map(x => x.P)) : NaN;
  const cols = ["#d7e9f0", "#e4f1ea", "#f7ebdd", "#eee8f7", "#fbe9e1", "#fff3c4"];
  const move = e => { if (drag == null) return; const r = ref.current.getBoundingClientRect(); const x = X0 + (e.clientX - r.left) / r.width * (X1 - X0), y = Y0 + (1 - (e.clientY - r.top) / r.height) * (Y1 - Y0); setG(g.map((gi, i) => i === drag ? { ...gi, p: [Math.max(X0, Math.min(X1, x)), Math.max(Y0, Math.min(Y1, y))] } : gi)); };
  return <Box title="Thiessen polygons — drag the gauges">
    <div className="wg-row">
      <div className="wg-col" style={{ flex: "1 1 340px" }}>
        <svg ref={ref} viewBox={`0 0 ${W} ${H}`} onPointerMove={move} onPointerUp={() => setDrag(null)} onPointerLeave={() => setDrag(null)} style={{ background: "#fbfaf7", borderRadius: 6, border: "1px solid #e8e4dc", cursor: drag != null ? "grabbing" : "default" }}>
          {cells.map((c, i) => c.length > 2 && <polygon key={i} points={c.map(p => sx(p[0]) + "," + sy(p[1])).join(" ")} fill={cols[i % 6]} stroke="#a09080" strokeDasharray="4 3" />)}
          <polygon points={CATCH.map(p => sx(p[0]) + "," + sy(p[1])).join(" ")} fill="none" stroke={C.river} strokeWidth="2.5" />
          {cells.map((c, i) => { if (c.length < 3) return null; const cx = mean(c.map(p => p[0])), cy = mean(c.map(p => p[1])); return <text key={"t" + i} x={sx(cx)} y={sy(cy) + 22} fontSize="11" textAnchor="middle" fill="#5a5048">{f1(areas[i])} km²</text>; })}
          {g.map((gi, i) => <g key={gi.n} onPointerDown={e => { e.target.setPointerCapture && e.target.setPointerCapture(e.pointerId); setDrag(i); }} style={{ cursor: "grab" }}>
            <circle cx={sx(gi.p[0])} cy={sy(gi.p[1])} r="14" fill="transparent" /><polygon points={`${sx(gi.p[0])},${sy(gi.p[1]) - 9} ${sx(gi.p[0]) - 8},${sy(gi.p[1]) + 6} ${sx(gi.p[0]) + 8},${sy(gi.p[1]) + 6}`} fill={C.navy} />
            <text x={sx(gi.p[0]) + 10} y={sy(gi.p[1]) - 6} fontSize="12" fontWeight="700" fill={C.navy}>{gi.n}</text></g>)}
          <text x="8" y={H - 8} fontSize="10" fill="#a09080">Teaching catchment, {f1(A)} km² · 1 grid unit = 1 km</text>
        </svg>
      </div>
      <div className="wg-col" style={{ flex: "1 1 240px" }}>
        <table><thead><tr><th>Gauge</th><th>P (mm)</th><th>Area km²</th><th>Weight</th></tr></thead><tbody>
          {g.map((gi, i) => <tr key={gi.n}><td>{gi.n}{inside(gi.p, CATCH) ? "" : " (out)"}</td><td><Num w={56} value={gi.P} onChange={v => setG(g.map((x, j) => j === i ? { ...x, P: v } : x))} /></td><td>{f2(areas[i])}</td><td>{f3(areas[i] / A)}</td></tr>)}
        </tbody></table>
        <div className="kpis"><Kpi v={f1(map) + " mm"} l="Thiessen mean" tone="good" /><Kpi v={f1(ar) + " mm"} l={`Arithmetic (${ins.length} inside)`} /></div>
        <div className="btn-row"><button className="btn ghost" onClick={() => g.length < 6 && setG([...g, { n: "TG" + (g.length + 1), p: [3 + g.length * 0.7, 5], P: 100 }])}>+ gauge</button><button className="btn ghost" onClick={() => setG(init)}>Reset</button></div>
        <p className="note">Drag a gauge across the boundary and watch its weight. A gauge outside the catchment can still carry weight; a gauge squeezed between neighbours loses it.</p>
      </div>
    </div>
  </Box>;
}

/* ============ S06: missing data ============ */
function MissingData() {
  const presets = {
    "Slide Q1 (station C)": { Nx: 93.5, rows: [["A", 9.7, 100.3], ["B", 8.3, 109.5], ["D", 11.7, 125.7], ["E", 8.0, 117.5]] },
    "Example 1": { Nx: 1010, rows: [["1", 68, 1080], ["2", 55, 920], ["3", 82, 1250]] },
    "TG3 activity": { Nx: 1120, rows: [["TG1", 105, 960], ["TG2", 86, 845], ["TG4", 71, 790]] },
  };
  const [s, setS] = useState(presets["Slide Q1 (station C)"]);
  const lo = 0.9 * s.Nx, hi = 1.1 * s.Nx; const out = s.rows.filter(r => r[2] < lo || r[2] > hi);
  const ar = mean(s.rows.map(r => r[1])), nr = s.Nx / s.rows.length * sum(s.rows.map(r => r[1] / r[2]));
  const useNR = out.length > 0;
  return <Box title="Missing rainfall — which method, and what estimate?">
    <div className="btn-row" style={{ marginBottom: 8 }}>{Object.entries(presets).map(([k, p]) => <button key={k} className="btn ghost" onClick={() => setS(p)}>{k}</button>)}</div>
    <div className="wg-row">
      <div className="wg-col">
        <label className="f">Normal annual rainfall at missing station, Nₓ<Num value={s.Nx} onChange={v => setS({ ...s, Nx: v })} /></label>
        <table><thead><tr><th>Index station</th><th>Pᵢ</th><th>Nᵢ</th><th>within ±10 %?</th></tr></thead><tbody>
          {s.rows.map((r, i) => <tr key={i}><td>{r[0]}</td>{[1, 2].map(c => <td key={c}><Num value={r[c]} onChange={v => setS({ ...s, rows: s.rows.map((x, j) => j === i ? x.map((y, q) => q === c ? v : y) : x) })} /></td>)}<td style={{ color: r[2] < lo || r[2] > hi ? C.warn : C.green }}>{r[2] < lo || r[2] > hi ? "no" : "yes"}</td></tr>)}
        </tbody></table>
      </div>
      <div className="wg-col">
        <p className="note">±10 % band of Nₓ: <b>{f2(lo)}</b> to <b>{f2(hi)}</b></p>
        <div className="kpis"><Kpi v={f2(ar)} l="Arithmetic average" tone={!useNR ? "good" : ""} /><Kpi v={f2(nr)} l="Normal ratio" tone={useNR ? "good" : ""} /></div>
        <div className="detail">{useNR ? <>Station{out.length > 1 ? "s" : ""} <b>{out.map(r => r[0]).join(", ")}</b> lie{out.length > 1 ? "" : "s"} outside the band → use the <b>normal ratio method</b>: Pₓ = (Nₓ/M) Σ(Pᵢ/Nᵢ) = <b>{f2(nr)}</b>.</> : <>All index normals lie within ±10 % → the <b>arithmetic average</b> is acceptable: Pₓ = <b>{f2(ar)}</b>.</>}</div>
      </div>
    </div>
  </Box>;
}

/* ============ S07: storm explorer + moving average ============ */
function StormExplorer() {
  const [inc, setInc] = useState([2, 4, 7, 12, 18, 26, 14, 9, 6, 4, 2, 1]); const dt = 0.5;
  const [d, setD] = useState(2);
  const cum = inc.reduce((a, v) => [...a, (a[a.length - 1] || 0) + v], []);
  let best = -1, bi = 0; for (let i = 0; i + d <= inc.length; i++) { const s = sum(inc.slice(i, i + d)); if (s > best) { best = s; bi = i; } }
  const T = inc.length * dt, tot = sum(inc);
  const tab = [1, 2, 4, 6, inc.length].filter((x, i, a) => x <= inc.length && a.indexOf(x) === i).map(k => { let b = 0; for (let i = 0; i + k <= inc.length; i++) b = Math.max(b, sum(inc.slice(i, i + k))); return [k * dt, b, b / (k * dt)]; });
  return <Box title="Hyetograph and mass curve — find the most intense burst">
    <div className="wg-row">
      <div className="wg-col"><Plot w={360} h={230} x={[0, T]} y={[0, Math.max(...inc) / dt * 1.15]} xLabel="Time (h)" yLabel="Intensity (mm/h)">{(sx, sy) => inc.map((v, i) => <rect key={i} x={sx(i * dt) + 1} width={sx(dt) - sx(0) - 2} y={sy(v / dt)} height={sy(0) - sy(v / dt)} fill={i >= bi && i < bi + d ? C.gold : C.river} />)}</Plot></div>
      <div className="wg-col"><Plot w={360} h={230} x={[0, T]} y={[0, tot * 1.08]} xLabel="Time (h)" yLabel="Cumulative (mm)">{(sx, sy) => <>
        <rect x={sx(bi * dt)} width={sx((bi + d) * dt) - sx(bi * dt)} y={sy(tot * 1.08)} height={sy(0) - sy(tot * 1.08)} fill={C.gold} opacity=".15" />
        <path d={path([[0, 0], ...cum.map((v, i) => [(i + 1) * dt, v])], sx, sy)} stroke={C.brown} strokeWidth="2.2" fill="none" />
        {cum.map((v, i) => <circle key={i} cx={sx((i + 1) * dt)} cy={sy(v)} r="2.6" fill={C.brown} />)}</>}</Plot></div>
    </div>
    <label className="f">Window duration: <b>{d * dt} h</b> → maximum depth <b>{best} mm</b> ({bi * dt}–{(bi + d) * dt} h), intensity <b>{f1(best / (d * dt))} mm/h</b><input type="range" min="1" max={inc.length} value={d} onChange={e => setD(+e.target.value)} /></label>
    <div className="wg-row">
      <div className="wg-col"><div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>{inc.map((v, i) => <Num key={i} w={48} value={v} onChange={nv => setInc(inc.map((x, j) => j === i ? (+nv || 0) : x))} />)}</div><p className="note">30-minute depths (mm) — edit them to make your own storm.</p></div>
      <div className="wg-col"><table><thead><tr><th>Duration (h)</th><th>Max depth (mm)</th><th>Max intensity (mm/h)</th></tr></thead><tbody>{tab.map(r => <tr key={r[0]}><td>{r[0]}</td><td>{r[1]}</td><td>{f1(r[2])}</td></tr>)}</tbody></table></div>
    </div>
  </Box>;
}
const MA_SLIDE = [676, 578, 95, 462, 472, 699, 479, 431, 493, 503, 415, 531, 504, 828, 679, 1244, 999, 573, 596, 375, 635, 497, 386, 438, 568, 356, 685, 825, 426, 612].map((v, i) => ({ year: 1950 + i, P: v }));
function MovingAverage() {
  const course = useCsv("data/U1_annual_rainfall_1991_2020.csv");
  const [ds, setDs] = useState("slide"); const [m, setM] = useState(3); const [pc, setPc] = useState(80);
  const rows = ds === "slide" ? MA_SLIDE : (course || []).map(r => ({ year: r.year, P: r.A }));
  if (!rows.length) return <Box title="Moving average">Loading…</Box>;
  const mu = mean(rows.map(r => r.P)), th = mu * pc / 100, k = (m - 1) / 2;
  const ma = rows.map((r, i) => i - k < 0 || i + k >= rows.length ? null : mean(rows.slice(i - k, i + k + 1).map(x => x.P)));
  const low = rows.filter(r => r.P < th).map(r => r.year), above = rows.filter(r => r.P > mu).length;
  const y0 = rows[0].year, y1 = rows[rows.length - 1].year, ym = Math.max(...rows.map(r => r.P)) * 1.1;
  return <Box title="Annual rainfall — moving average and dry years">
    <div className="wg-row" style={{ alignItems: "center", marginBottom: 6 }}>
      <Seg value={ds} onChange={setDs} options={[["slide", "Slide data 1950–1979"], ["course", "Course station A 1991–2020"]]} />
      <Seg value={m} onChange={setM} options={[[3, "3-yr"], [5, "5-yr"], [7, "7-yr"]]} />
    </div>
    <Plot w={680} h={280} xFmt={v => String(v)} x={[y0 - 1, y1 + 1]} y={[0, ym]} xLabel="Year" yLabel="Annual rainfall (mm)">{(sx, sy) => <>
      {rows.map(r => <rect key={r.year} x={sx(r.year - 0.4)} width={sx(0.8) - sx(0)} y={sy(r.P)} height={sy(0) - sy(r.P)} fill={r.P < th ? "#f0b9a5" : "#c9dbe3"}><title>{r.year}: {r.P} mm</title></rect>)}
      <line x1={sx(y0 - 1)} x2={sx(y1 + 1)} y1={sy(mu)} y2={sy(mu)} stroke={C.grey} strokeDasharray="3 3" />
      <line x1={sx(y0 - 1)} x2={sx(y1 + 1)} y1={sy(th)} y2={sy(th)} stroke={C.warn} strokeDasharray="6 3" />
      <path d={path(rows.map((r, i) => [r.year, ma[i]]), sx, sy)} stroke={C.navy} strokeWidth="2.4" fill="none" /></>}</Plot>
    <Legend items={[[C.navy, m + "-year moving average"], [C.grey, "mean " + f1(mu) + " mm", 1], [C.warn, pc + " % of mean = " + f1(th) + " mm", 1]]} />
    <label className="f" style={{ marginTop: 10 }}>Dry-year threshold: <b>{pc} % of mean</b><input type="range" min="50" max="100" value={pc} onChange={e => setPc(+e.target.value)} /></label>
    <div className="kpis"><Kpi v={low.length} l={`Years below ${pc}% of mean`} tone="bad" /><Kpi v={above} l="Years above mean" /></div>
    <p className="note">Below threshold: {low.join(", ") || "none"}.{ds === "slide" && " (The textbook table prints 162 for 1979 in the last moving-mean sum; the annual value is 612, which gives the printed 621.0.)"}</p>
  </Box>;
}

/* ============ S08: risk, Weibull, IDF ============ */
function RiskCalc() {
  const [T, setT] = useState(50); const [n, setN] = useState(20); const [R, setR] = useState(10);
  const p = 1 / T, risk = 1 - (1 - p) ** n, Treq = 1 / (1 - Math.pow(1 - R / 100, 1 / n));
  const fact = k => k <= 1 ? 1 : k * fact(k - 1);
  const binom = r => fact(n) / (fact(n - r) * fact(r)) * p ** r * (1 - p) ** (n - r);
  const pts = []; for (let yr = 1; yr <= 100; yr++) pts.push([yr, 1 - (1 - p) ** yr]);
  return <Box title="Return period, risk and reliability">
    <div className="wg-row">
      <div className="wg-col">
        <label className="f">Return period T: <b>{T} years</b> (P = {f3(p)})<input type="range" min="2" max="500" value={T} onChange={e => setT(+e.target.value)} /></label>
        <label className="f">Design life n: <b>{n} years</b><input type="range" min="1" max="100" value={n} onChange={e => setN(+e.target.value)} /></label>
        <div className="kpis"><Kpi v={(risk * 100).toFixed(1) + "%"} l="Risk: at least once in n yrs" tone="bad" /><Kpi v={((1 - risk) * 100).toFixed(1) + "%"} l="Reliability" tone="good" /></div>
        <table><thead><tr><th>Occurs exactly r times</th>{[0, 1, 2, 3].map(r => <th key={r}>r={r}</th>)}</tr></thead><tbody><tr><td>Probability</td>{[0, 1, 2, 3].map(r => <td key={r}>{f3(binom(r))}</td>)}</tr></tbody></table>
        <label className="f" style={{ marginTop: 10 }}>Acceptable risk over the design life: <b>{R} %</b> → design for <b>T = {Math.round(Treq)} years</b><input type="range" min="1" max="50" value={R} onChange={e => setR(+e.target.value)} /></label>
      </div>
      <div className="wg-col"><Plot w={360} h={250} x={[1, 100]} y={[0, 1]} xLabel="Years of exposure" yLabel="Risk">{(sx, sy) => <>
        <path d={path(pts, sx, sy)} stroke={C.warn} strokeWidth="2.2" fill="none" />
        <line x1={sx(Math.min(n, 100))} x2={sx(Math.min(n, 100))} y1={sy(0)} y2={sy(risk)} stroke={C.navy} strokeDasharray="4 3" /><circle cx={sx(Math.min(n, 100))} cy={sy(risk)} r="4" fill={C.navy} /></>}</Plot>
        <p className="note">Even a "50-year" storm has about a one-in-three chance of occurring during a 20-year design life.</p></div>
    </div>
  </Box>;
}
function WeibullIDF() {
  const data = useCsv("data/U1_annual_max_1day_1991_2020.csv");
  const [txt, setTxt] = useState("98, 142, 76, 118, 105, 163, 88, 127, 111, 94");
  useEffect(() => { }, []);
  const vals = txt.split(/[\s,;]+/).map(Number).filter(v => isFinite(v) && v > 0);
  const srt = [...vals].sort((a, b) => b - a), N = srt.length, rows = srt.map((v, i) => [i + 1, v, (N + 1) / (i + 1), (i + 1) / (N + 1)]);
  const [K, setK] = useState(6.93), [x, setX] = useState(0.189), [a, setA] = useState(0.5), [nn, setNn] = useState(0.878);
  const [Tq, setTq] = useState(25), [Dq, setDq] = useState(1);
  const i = (T, D) => K * T ** x / (D + a) ** nn;
  const Ds = []; for (let D = 0.1; D <= 24; D *= 1.15) Ds.push(D);
  const cols = [[2, "#9cc3d3"], [10, C.river], [25, C.gold], [100, C.brown]];
  return <Box title="Plotting position and IDF curves">
    <div className="sec-title" style={{ marginTop: 0 }}>Weibull plotting position</div>
    <div className="wg-row">
      <div className="wg-col"><label className="f">Annual maxima (any units, comma-separated)<textarea rows="3" style={{ width: "100%", fontFamily: "DM Mono", fontSize: 12, padding: 6, border: "1px solid #e8e4dc", borderRadius: 4 }} value={txt} onChange={e => setTxt(e.target.value)} /></label>
        <div className="btn-row"><button className="btn ghost" onClick={() => setTxt("98, 142, 76, 118, 105, 163, 88, 127, 111, 94")}>Example (10 yrs)</button>{data && <button className="btn ghost" onClick={() => setTxt(data.map(r => r.max_1day_mm).join(", "))}>Course station X (30 yrs)</button>}</div>
        <div style={{ maxHeight: 200, overflow: "auto", marginTop: 8 }}><table><thead><tr><th>m</th><th>Value</th><th>T = (N+1)/m</th><th>P = m/(N+1)</th></tr></thead><tbody>{rows.map(r => <tr key={r[0]}><td>{r[0]}</td><td>{r[1]}</td><td>{f2(r[2])}</td><td>{f3(r[3])}</td></tr>)}</tbody></table></div></div>
      <div className="wg-col">{N > 1 && <Plot w={360} h={250} xLog x={[1, Math.max(10, (N + 1) * 1.2)]} y={[Math.min(...srt) * 0.9, Math.max(...srt) * 1.08]} xLabel="Return period T (yr, log)" yLabel="Annual maximum">{(sx, sy) => rows.map(r => <circle key={r[0]} cx={sx(r[2])} cy={sy(r[1])} r="3.5" fill={C.river} />)}</Plot>}</div>
    </div>
    <div className="sec-title">IDF curves: i = K·Tˣ / (D + a)ⁿ</div>
    <div className="wg-row">
      <div className="wg-col" style={{ maxWidth: 280 }}>
        {[["K", K, setK], ["x", x, setX], ["a", a, setA], ["n", nn, setNn]].map(([l, v, s]) => <label key={l} className="f" style={{ display: "flex", gap: 8, alignItems: "center" }}><b style={{ width: 16 }}>{l}</b><Num value={v} onChange={s} /></label>)}
        <p className="note">Defaults are illustrative constants. Replace them with your station's published values (T1 tabulates many Indian stations).</p>
        <label className="f">T = <b>{Tq} yr</b><input type="range" min="2" max="100" value={Tq} onChange={e => setTq(+e.target.value)} /></label>
        <label className="f">D = <b>{Dq} h</b><input type="range" min="0.25" max="24" step="0.25" value={Dq} onChange={e => setDq(+e.target.value)} /></label>
        <div className="kpis"><Kpi v={f2(i(Tq, Dq)) + " cm/h"} l="Intensity" /><Kpi v={f1(i(Tq, Dq) * Dq * 10) + " mm"} l="Depth" tone="good" /></div>
      </div>
      <div className="wg-col"><Plot w={420} h={300} xLog yLog x={[0.1, 24]} y={[0.1, 30]} xLabel="Duration D (h)" yLabel="Intensity (cm/h)">{(sx, sy) => <>
        {cols.map(([T, c]) => <path key={T} d={path(Ds.map(D => [D, i(T, D)]), sx, sy)} stroke={c} strokeWidth="2" fill="none" />)}
        <circle cx={sx(Dq)} cy={sy(i(Tq, Dq))} r="5" fill={C.navy} /></>}</Plot>
        <Legend items={cols.map(([T, c]) => [c, "T = " + T + " yr"])} /></div>
    </div>
  </Box>;
}

/* ============ S09: D8 flow direction ============ */
const DEM = (() => {
  const R = 9, Cc = 9, bump = [0, 2, 1, 3, 0, 2, 1, 0, 3, 1, 2, 0, 1, 3, 2, 0, 1, 2, 3, 1, 0, 2, 1, 3, 0, 1, 2];
  const z = []; for (let r = 0; r < R; r++) { z.push([]); for (let c = 0; c < Cc; c++) { let v = 20 + 5 * (R - 1 - r) + 6 * Math.abs(c - 4) + bump[(r * 7 + c * 3) % bump.length]; if (c === 1 && r < 5) v -= 7; if (c === 2 && r >= 4 && r <= 6) v -= 4; z[r].push(v); } }
  z[8][4] = 10; return z;
})();
function D8() {
  const R = DEM.length, Cn = DEM[0].length, nb = [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]];
  const dir = useMemo(() => DEM.map((row, r) => row.map((z, c) => { let best = 0, bd = null; nb.forEach(([dr, dc]) => { const rr = r + dr, cc = c + dc; if (rr < 0 || cc < 0 || rr >= R || cc >= Cn) return; const s = (z - DEM[rr][cc]) / Math.hypot(dr, dc); if (s > best) { best = s; bd = [rr, cc]; } }); return bd; })), []);
  const acc = useMemo(() => { const a = DEM.map(r => r.map(() => 1)); const cells = []; DEM.forEach((row, r) => row.forEach((z, c) => cells.push([z, r, c]))); cells.sort((p, q) => q[0] - p[0]).forEach(([, r, c]) => { const d = dir[r][c]; if (d) a[d[0]][d[1]] += a[r][c]; }); return a; }, [dir]);
  const [sel, setSel] = useState(null); const [outlet, setOutlet] = useState(null); const [mode, setMode] = useState("trace"); const [th, setTh] = useState(6); const [show, setShow] = useState("elev");
  const trail = []; if (sel) { let p = sel, k = 0; while (p && k++ < 100) { trail.push(p); p = dir[p[0]][p[1]]; } }
  const shed = new Set(); if (outlet) DEM.forEach((row, r) => row.forEach((_, c) => { let p = [r, c], k = 0; while (p && k++ < 100) { if (p[0] === outlet[0] && p[1] === outlet[1]) { shed.add(r + "," + c); break; } p = dir[p[0]][p[1]]; } }));
  const S = 46, zmin = Math.min(...DEM.flat()), zmax = Math.max(...DEM.flat()), amax = Math.max(...acc.flat());
  const shade = (r, c) => show === "elev" ? `hsl(${100 - 70 * (DEM[r][c] - zmin) / (zmax - zmin)},${35}%,${78 - 30 * (DEM[r][c] - zmin) / (zmax - zmin)}%)` : `hsl(200,60%,${95 - 55 * Math.log(acc[r][c]) / Math.log(amax)}%)`;
  return <Box title="D8 flow direction on a tiny DEM">
    <div className="wg-row" style={{ alignItems: "center", marginBottom: 8 }}>
      <Seg value={mode} onChange={setMode} options={[["trace", "Click: trace flow path"], ["outlet", "Click: set outlet → watershed"]]} />
      <Seg value={show} onChange={setShow} options={[["elev", "Elevation"], ["acc", "Flow accumulation"]]} />
    </div>
    <div className="wg-row">
      <div className="wg-col" style={{ flex: "0 1 430px" }}>
        <svg viewBox={`0 0 ${Cn * S} ${R * S}`}>
          {DEM.map((row, r) => row.map((z, c) => { const st = acc[r][c] >= th, inShed = shed.has(r + "," + c), d = dir[r][c];
            return <g key={r + "-" + c} onClick={() => mode === "trace" ? setSel([r, c]) : setOutlet([r, c])} style={{ cursor: "pointer" }}>
              <rect x={c * S} y={r * S} width={S} height={S} fill={shade(r, c)} stroke="#fff" />
              {inShed && <rect x={c * S + 2} y={r * S + 2} width={S - 4} height={S - 4} fill="none" stroke={C.gold} strokeWidth="3" />}
              {st && <rect x={c * S + S / 2 - 5} y={r * S + S / 2 - 5} width="10" height="10" rx="5" fill="#1a5f7a" />}
              <text x={c * S + 4} y={r * S + 12} fontSize="10" fill="#333">{show === "elev" ? z : acc[r][c]}</text>
              {d && <line x1={c * S + S / 2} y1={r * S + S / 2} x2={c * S + S / 2 + (d[1] - c) * S * 0.36} y2={r * S + S / 2 + (d[0] - r) * S * 0.36} stroke="#0f1f3d" strokeWidth="1.3" markerEnd="url(#d8a)" />}
            </g>; }))}
          <defs><marker id="d8a" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0 0L10 5L0 10z" fill="#0f1f3d" /></marker></defs>
          {trail.length > 1 && <path d={trail.map((p, i) => (i ? "L" : "M") + (p[1] * S + S / 2) + " " + (p[0] * S + S / 2)).join("")} stroke={C.warn} strokeWidth="4" fill="none" opacity=".8" />}
        </svg>
      </div>
      <div className="wg-col">
        <label className="f">Stream threshold: cells with accumulation ≥ <b>{th}</b><input type="range" min="2" max="40" value={th} onChange={e => setTh(+e.target.value)} /></label>
        <div className="kpis"><Kpi v={outlet ? shed.size : "–"} l="Watershed cells" tone="good" /><Kpi v={outlet ? acc[outlet[0]][outlet[1]] : "–"} l="Accumulation at outlet" /></div>
        <p className="note">Each arrow points to the steepest downhill neighbour (of 8). Accumulation counts the cells draining through each cell. Blue dots mark "streams" above the threshold — lower it and the network grows. Set the outlet on the bottom-centre cell to get the whole catchment; set it on a tributary to get a sub-catchment. The number of watershed cells always equals the accumulation at the outlet.</p>
        <button className="btn ghost" onClick={() => { setSel(null); setOutlet(null); }}>Clear</button>
      </div>
    </div>
  </Box>;
}

/* ============ Unit II Widgets ============ */

/* Horton curve fitter & infiltration capacity */
function HortonFit() {
  const [f0, setF0] = useState(60);
  const [fc, setFc] = useState(10);
  const [kh, setKh] = useState(1.2);
  const [intensity, setIntensity] = useState(35);
  const [tMax, setTMax] = useState(4);

  const ptsF = [];
  const steps = 40;
  for (let i = 0; i <= steps; i++) {
    const t = (i / steps) * tMax;
    const ft = fc + (f0 - fc) * Math.exp(-kh * t);
    ptsF.push([t, ft]);
  }

  let tp = null;
  if (intensity > fc && intensity < f0) {
    tp = -Math.log((intensity - fc) / (f0 - fc)) / kh;
  } else if (intensity >= f0) {
    tp = 0;
  }

  const f1hr = fc + (f0 - fc) * Math.exp(-kh * 1);
  const Ftotal = fc * tMax + ((f0 - fc) / kh) * (1 - Math.exp(-kh * tMax));

  return (
    <Box title="Horton's infiltration model & curve fitter">
      <div className="wg-row">
        <div className="wg-col" style={{ flex: "1 1 340px" }}>
          <Plot
            w={460}
            h={250}
            x={[0, tMax]}
            y={[0, Math.max(f0 * 1.15, intensity * 1.15, 60)]}
            xLabel="Time t (hours)"
            yLabel="Infiltration capacity f(t) & Rain i (mm/h)"
          >
            {(sx, sy) => (
              <>
                <line
                  x1={sx(0)}
                  x2={sx(tMax)}
                  y1={sy(intensity)}
                  y2={sy(intensity)}
                  stroke={C.river}
                  strokeWidth="2.5"
                  strokeDasharray="5 3"
                />
                <path
                  d={path(ptsF, sx, sy)}
                  fill="none"
                  stroke={C.green}
                  strokeWidth="3"
                />
                {tp !== null && tp >= 0 && tp <= tMax && (
                  <g>
                    <line
                      x1={sx(tp)}
                      x2={sx(tp)}
                      y1={sy(0)}
                      y2={sy(intensity)}
                      stroke={C.warn}
                      strokeWidth="1.5"
                      strokeDasharray="3 3"
                    />
                    <circle cx={sx(tp)} cy={sy(intensity)} r="5" fill={C.warn} />
                    <text
                      x={sx(tp) + 6}
                      y={sy(intensity) - 6}
                      fontSize="10"
                      fill={C.warn}
                      fontWeight="600"
                    >
                      tp = {tp.toFixed(2)} h
                    </text>
                  </g>
                )}
              </>
            )}
          </Plot>
          <Legend
            items={[
              [C.green, "Infiltration capacity f(t)"],
              [C.river, `Rain intensity i = ${intensity} mm/h`, true],
              [C.warn, "Ponding start (tp)"]
            ]}
          />
        </div>
        <div className="wg-col">
          <label className="f">
            Initial capacity f0: <b>{f0} mm/h</b>
            <input
              type="range"
              min="20"
              max="150"
              step="5"
              value={f0}
              onChange={e => setF0(+e.target.value)}
            />
          </label>
          <label className="f">
            Final constant capacity fc: <b>{fc} mm/h</b>
            <input
              type="range"
              min="2"
              max="30"
              step="1"
              value={fc}
              onChange={e => setFc(+e.target.value)}
            />
          </label>
          <label className="f">
            Decay constant kh: <b>{kh.toFixed(2)} h⁻¹</b>
            <input
              type="range"
              min="0.2"
              max="3.0"
              step="0.1"
              value={kh}
              onChange={e => setKh(+e.target.value)}
            />
          </label>
          <label className="f">
            Rainfall intensity i: <b>{intensity} mm/h</b>
            <input
              type="range"
              min="5"
              max="100"
              step="5"
              value={intensity}
              onChange={e => setIntensity(+e.target.value)}
            />
          </label>
          <div className="kpis">
            <Kpi v={f1hr.toFixed(1) + " mm/h"} l="Rate at t = 1 hr" />
            <Kpi v={Ftotal.toFixed(1) + " mm"} l={`Total F(${tMax}h)`} />
            <Kpi
              v={tp !== null ? tp.toFixed(2) + " h" : "No runoff (i ≤ fc)"}
              l="Ponding time tp"
              tone={tp !== null ? "good" : ""}
            />
          </div>
          <p className="note">
            When rainfall intensity $i$ exceeds infiltration capacity $f(t)$ after $t_p$, surface ponding and runoff begin. The area under $f(t)$ represents total infiltration depth.
          </p>
        </div>
      </div>
    </Box>
  );
}

/* phi-index & W-index finder on a storm hyetograph */
function PhiIndex() {
  const [rain] = useState([12, 28, 48, 36, 22, 10]);
  const [phi, setPhi] = useState(20);
  const [ia, setIa] = useState(5);

  const totalP = sum(rain);
  const excess = rain.map(p => Math.max(0, p - phi));
  const totalR = sum(excess);
  const te = rain.filter(p => p > phi).length;
  const totalLoss = totalP - totalR;
  const tr = rain.length;
  const wIndex = Math.max(0, (totalP - totalR - ia) / tr);

  const maxBar = Math.max(...rain, phi, 50);

  return (
    <Box title="φ-index and W-index finder on a storm hyetograph">
      <div className="wg-row">
        <div className="wg-col" style={{ flex: "1 1 360px" }}>
          <svg viewBox="0 0 460 250" style={{ background: "#fff", border: "1px solid #e8e4dc", borderRadius: 6 }}>
            {[0, 10, 20, 30, 40, 50].map(yVal => {
              const y = 210 - (yVal / maxBar) * 180;
              return (
                <g key={yVal}>
                  <line x1="45" x2="440" y1={y} y2={y} stroke="#eee" />
                  <text x="38" y={y + 4} fontSize="10" textAnchor="end" fill="#777">{yVal}</text>
                </g>
              );
            })}
            {rain.map((val, i) => {
              const bw = 46;
              const x = 60 + i * 62;
              const barH = (val / maxBar) * 180;
              const phiH = Math.min(barH, (phi / maxBar) * 180);
              const excH = Math.max(0, barH - phiH);

              return (
                <g key={i}>
                  <rect x={x} y={210 - phiH} width={bw} height={phiH} fill="#2d6a4f" opacity="0.8" rx="2" />
                  {excH > 0 && (
                    <rect x={x} y={210 - barH} width={bw} height={excH} fill="#1a5f7a" rx="2" />
                  )}
                  <text x={x + bw / 2} y={210 - barH - 6} fontSize="11" textAnchor="middle" fontWeight="600" fill="#0f1f3d">
                    {val}
                  </text>
                  <text x={x + bw / 2} y="226" fontSize="11" textAnchor="middle" fill="#555">
                    H{i + 1}
                  </text>
                </g>
              );
            })}
            {(() => {
              const yPhi = 210 - (phi / maxBar) * 180;
              return (
                <g>
                  <line x1="45" x2="440" y1={yPhi} y2={yPhi} stroke="#c8973a" strokeWidth="2.5" strokeDasharray="5 3" />
                  <text x="435" y={yPhi - 5} fontSize="11" textAnchor="end" fill="#c8973a" fontWeight="700">
                    φ = {phi} mm/h
                  </text>
                </g>
              );
            })()}
            <text x="18" y="110" transform="rotate(-90 18 110)" fontSize="11" fill="#1a3260" fontWeight="600" textAnchor="middle">Rainfall intensity (mm/h)</text>
          </svg>
          <Legend
            items={[
              ["#1a5f7a", "Rainfall excess (Direct runoff)"],
              ["#2d6a4f", "Infiltration loss (≤ φ)"],
              ["#c8973a", "φ-index line", true]
            ]}
          />
        </div>
        <div className="wg-col">
          <label className="f">
            φ-index threshold: <b>{phi} mm/h</b>
            <input type="range" min="0" max="45" step="1" value={phi} onChange={e => setPhi(+e.target.value)} />
          </label>
          <label className="f">
            Initial abstraction Ia (for W-index): <b>{ia} mm</b>
            <input type="range" min="0" max="25" step="1" value={ia} onChange={e => setIa(+e.target.value)} />
          </label>
          <div className="kpis">
            <Kpi v={totalP + " mm"} l="Total storm P" />
            <Kpi v={totalR + " mm"} l="Direct runoff R" tone={totalR > 0 ? "good" : ""} />
            <Kpi v={totalLoss + " mm"} l="Total losses" />
            <Kpi v={te + " h"} l="Effective duration te" />
            <Kpi v={wIndex.toFixed(2) + " mm/h"} l="W-index" />
          </div>
          <p className="note">
            The <b>φ-index</b> is the constant infiltration rate above which rainfall depth equals runoff depth ($R$). The <b>W-index</b> accounts for initial abstraction ($I_a$) averaged over the entire storm duration ($t_r$).
          </p>
        </div>
      </div>
    </Box>
  );
}

/* SCS-CN Calculator */
function ScsCn() {
  const [cn, setCn] = useState(75);
  const [p, setP] = useState(100);
  const [lambda, setLambda] = useState(0.2);

  const S = 25400 / cn - 254;
  const Ia = lambda * S;
  const Q = p > Ia ? Math.pow(p - Ia, 2) / (p - Ia + S) : 0;
  const Cr = p > 0 ? Q / p : 0;

  const cn1 = cn / (2.281 - 0.01281 * cn);
  const cn3 = cn / (0.427 + 0.00573 * cn);

  const pVals = [10, 25, 50, 75, 100, 125, 150, 200];
  const qCurve = pVals.map(pv => [pv, pv > Ia ? Math.pow(pv - Ia, 2) / (pv - Ia + S) : 0]);

  return (
    <Box title="SCS Curve Number (CN) runoff calculator">
      <div className="wg-row">
        <div className="wg-col" style={{ flex: "1 1 340px" }}>
          <Plot
            w={460}
            h={240}
            x={[0, 200]}
            y={[0, 180]}
            xLabel="Storm rainfall P (mm)"
            yLabel="Direct runoff Q (mm)"
          >
            {(sx, sy) => (
              <>
                <line x1={sx(0)} y1={sy(0)} x2={sx(180)} y2={sy(180)} stroke="#ccc" strokeDasharray="3 3" />
                <path d={path(qCurve, sx, sy)} fill="none" stroke={C.river} strokeWidth="3" />
                <circle cx={sx(p)} cy={sy(Q)} r="6" fill={C.gold} stroke="#fff" strokeWidth="2" />
                <text x={sx(p) + 8} y={sy(Q) + 4} fontSize="11" fill={C.navy} fontWeight="700">
                  Q = {Q.toFixed(1)} mm
                </text>
              </>
            )}
          </Plot>
          <Legend
            items={[
              [C.river, `Runoff curve (CN = ${cn})`],
              [C.gold, `Current event: P = ${p} mm, Q = ${Q.toFixed(1)} mm`],
              ["#ccc", "100% runoff line (Q = P)", true]
            ]}
          />
        </div>
        <div className="wg-col">
          <label className="f">
            Curve Number CN (AMC-II): <b>{cn}</b>
            <input type="range" min="40" max="98" step="1" value={cn} onChange={e => setCn(+e.target.value)} />
          </label>
          <div style={{ display: "flex", gap: 6, marginBottom: 8, flexWrap: "wrap" }}>
            {[["Group A (Forest/Sand)", 55], ["Group B (Agricultural)", 70], ["Group C (Clay Loam)", 80], ["Group D / Urban", 90]].map(([lbl, val]) => (
              <button key={lbl} className="btn ghost" style={{ fontSize: 11, padding: "3px 8px" }} onClick={() => setCn(val)}>
                {lbl}
              </button>
            ))}
          </div>
          <label className="f">
            Storm rainfall P: <b>{p} mm</b>
            <input type="range" min="10" max="250" step="5" value={p} onChange={e => setP(+e.target.value)} />
          </label>
          <label className="f">
            Abstraction ratio λ: <b>{lambda}</b>
            <div className="seg" style={{ display: "flex", marginTop: 4 }}>
              {[0.1, 0.2, 0.3].map(v => (
                <button key={v} className={lambda === v ? "on" : ""} onClick={() => setLambda(v)}>
                  λ = {v} {v === 0.2 ? "(SCS standard)" : "(Indian watersheds)"}
                </button>
              ))}
            </div>
          </label>
          <div className="kpis">
            <Kpi v={S.toFixed(1) + " mm"} l="Max retention S" />
            <Kpi v={Ia.toFixed(1) + " mm"} l="Initial abstraction Ia" />
            <Kpi v={Q.toFixed(1) + " mm"} l="Runoff depth Q" tone="good" />
            <Kpi v={(Cr * 100).toFixed(1) + " %"} l="Runoff coeff Q/P" />
          </div>
          <p className="note">
            Equivalent CN values for antecedent moisture: <b>AMC-I (Dry):</b> {cn1.toFixed(0)} · <b>AMC-III (Wet):</b> {cn3.toFixed(0)}.
          </p>
        </div>
      </div>
    </Box>
  );
}

/* Penman & Blaney-Criddle ET Calculator */
function PenCalc() {
  const [method, setMethod] = useState("penman");
  const [temp, setTemp] = useState(28);
  const [rh, setRh] = useState(65);
  const [u2, setU2] = useState(120);
  const [hn, setHn] = useState(5.2);
  const [pPct, setPPct] = useState(8.5);
  const [kCrop, setKCrop] = useState(0.85);

  const ew = 4.584 * Math.exp((17.27 * temp) / (temp + 237.3));
  const ea = ew * (rh / 100);
  const slopeA = (4098 * ew) / Math.pow(temp + 237.3, 2);
  const gamma = 0.49;
  const Ea = 0.35 * (1 + u2 / 160) * (ew - ea);
  const petPenman = (slopeA * hn + Ea * gamma) / (slopeA + gamma);

  const tF = 1.8 * temp + 32; // Blaney-Criddle (T1 form) needs temperature in °F
  const petBCMonthly = 2.54 * kCrop * (pPct * tF / 100) * 10;
  const petBCDaily = petBCMonthly / 30;

  return (
    <Box title="Evapotranspiration calculator (Penman & Blaney-Criddle)">
      <div style={{ marginBottom: 12 }}>
        <Seg value={method} onChange={setMethod} options={[["penman", "Penman combination method"], ["bc", "Blaney-Criddle method"]]} />
      </div>
      {method === "penman" ? (
        <div className="wg-row">
          <div className="wg-col">
            <label className="f">Mean temperature: <b>{temp} °C</b>
              <input type="range" min="10" max="42" step="1" value={temp} onChange={e => setTemp(+e.target.value)} />
            </label>
            <label className="f">Relative humidity RH: <b>{rh} %</b>
              <input type="range" min="20" max="95" step="1" value={rh} onChange={e => setRh(+e.target.value)} />
            </label>
            <label className="f">Wind speed at 2m: <b>{u2} km/day</b> ({(u2 / 24).toFixed(1)} km/h)
              <input type="range" min="30" max="350" step="10" value={u2} onChange={e => setU2(+e.target.value)} />
            </label>
            <label className="f">Net radiation Hn: <b>{hn} mm/day</b>
              <input type="range" min="2.0" max="8.0" step="0.2" value={hn} onChange={e => setHn(+e.target.value)} />
            </label>
          </div>
          <div className="wg-col">
            <div className="kpis">
              <Kpi v={petPenman.toFixed(2) + " mm/day"} l="Penman PET" tone="good" />
              <Kpi v={(petPenman * 30).toFixed(0) + " mm"} l="Monthly PET (30 d)" />
              <Kpi v={ew.toFixed(2) + " mm Hg"} l="Sat. vapour press. ew" />
              <Kpi v={ea.toFixed(2) + " mm Hg"} l="Actual vapour press. ea" />
              <Kpi v={Ea.toFixed(2) + " mm/day"} l="Aerodynamic term Ea" />
            </div>
            <p className="note">
              Penman combines the energy-budget term (A·Hn) with the mass-transfer aerodynamic term (Ea·γ). At higher temperatures, the radiation slope A dominates over the psychrometric constant γ.
            </p>
          </div>
        </div>
      ) : (
        <div className="wg-row">
          <div className="wg-col">
            <label className="f">Mean temperature t: <b>{temp} °C</b>
              <input type="range" min="10" max="42" step="1" value={temp} onChange={e => setTemp(+e.target.value)} />
            </label>
            <label className="f">Monthly daytime percentage p: <b>{pPct} %</b>
              <input type="range" min="6.5" max="11.0" step="0.1" value={pPct} onChange={e => setPPct(+e.target.value)} />
            </label>
            <label className="f">Crop growth coefficient k: <b>{kCrop}</b>
              <input type="range" min="0.4" max="1.3" step="0.05" value={kCrop} onChange={e => setKCrop(+e.target.value)} />
            </label>
          </div>
          <div className="wg-col">
            <div className="kpis">
              <Kpi v={petBCDaily.toFixed(2) + " mm/day"} l="Daily ET (approx)" tone="good" />
              <Kpi v={petBCMonthly.toFixed(1) + " mm/mo"} l="Monthly crop ET" />
            </div>
            <p className="note">
              The empirical Blaney-Criddle formula estimates monthly consumptive use: E_T = 2.54 · K · p · T_f / 100 cm/month, with T_f in °F (here {tF.toFixed(1)} °F), widely used for irrigation water scheduling where radiation and humidity data are unavailable.
            </p>
          </div>
        </div>
      )}
    </Box>
  );
}


/* ============ S10: where does the rain go ============ */
function Abstractions() {
  const [v, setV] = useState({ P: 40, T: 4, Ci: 1.0, K: 3, E: 0.1, f: 6, Sd: 4 });
  const set = k => e => setV({ ...v, [k]: +e.target.value });
  const intc = Math.min(v.P, v.Ci + v.K * v.E * v.T);
  const net = v.P - intc;
  const infl = Math.min(net, v.f * v.T);
  const exc = net - infl;
  const dep = Math.min(exc, v.Sd);
  const ro = exc - dep;
  const parts = [[intc, C.green, "Interception"], [infl, C.brown, "Infiltration"], [dep, C.gold, "Depression"], [ro, C.river, "Runoff"]];
  let x = 0;
  const sl = (k, l, min, max, st, u) => <label className="f">{l}: <b>{v[k]} {u}</b><input type="range" min={min} max={max} step={st} value={v[k]} onChange={set(k)} /></label>;
  return <Box title="Where does a storm's rain go?">
    <div className="wg-row">
      <div className="wg-col">
        {sl("P", "Storm rainfall P", 2, 150, 1, "mm")}
        {sl("T", "Storm duration t", 1, 24, 1, "h")}
        {sl("Ci", "Interception storage Sᵢ", 0, 2.5, 0.25, "mm")}
        {sl("K", "Leaf-area ratio Kᵢ", 0, 8, 0.5, "")}
        {sl("f", "Infiltration rate f", 0, 30, 0.5, "mm/h")}
        {sl("Sd", "Depression storage S_d", 0, 15, 0.5, "mm")}
        <div className="btn-row">
          <button className="btn ghost" onClick={() => setV({ ...v, Ci: 1.0, K: 3, f: 6, Sd: 4 })}>Forest on loam</button>
          <button className="btn ghost" onClick={() => setV({ ...v, Ci: 0.25, K: 0.5, f: 1, Sd: 1.5 })}>Paved city</button>
          <button className="btn ghost" onClick={() => setV({ ...v, Ci: 0.5, K: 1, f: 15, Sd: 5 })}>Grass on sand</button>
        </div>
      </div>
      <div className="wg-col">
        <svg viewBox="0 0 600 46">{parts.map(([d, c, t]) => { const w = v.P > 0 ? d / v.P * 600 : 0; const el = <g key={t}><rect x={x} y="6" width={w} height="30" fill={c} /><text x={x + 5} y="26" fontSize="12" fill="#fff">{w > 80 ? t : ""}</text></g>; x += w; return el; })}</svg>
        <div className="kpis">{parts.map(([d, , t]) => <Kpi key={t} v={f1(d) + " mm"} l={t + " (" + (v.P > 0 ? Math.round(d / v.P * 100) : 0) + "%)"} tone={t === "Runoff" ? "good" : ""} />)}</div>
        <p className="note">Order used: interception first (Horton, Iᵢ = Sᵢ + Kᵢ·E·t with E = {v.E} mm/h), then infiltration at the rate f for the whole storm, then the excess fills depressions; what is left runs off. Real catchments overlap these steps — HEC-HMS keeps the same order: canopy → surface → loss method → transform.</p>
      </div>
    </div>
  </Box>;
}

/* ============ S10: Dalton's law ============ */
const esMm = t => 4.584 * Math.exp(17.27 * t / (t + 237.3)); // saturation vapour pressure, mm Hg (Tetens)
function Dalton() {
  const [v, setV] = useState({ tw: 25, ta: 30, rh: 50, c: 0.4 });
  const set = k => e => setV({ ...v, [k]: +e.target.value });
  const ew = esMm(v.tw), ea = v.rh / 100 * esMm(v.ta), d = ew - ea, E = v.c * d;
  const ts = Array.from({ length: 41 }, (_, i) => i);
  return <Box title="Dalton's law: E = C (e_w − e_a)">
    <div className="wg-row">
      <div className="wg-col">
        <label className="f">Water-surface temperature: <b>{v.tw} °C</b><input type="range" min="0" max="40" value={v.tw} onChange={set("tw")} /></label>
        <label className="f">Air temperature: <b>{v.ta} °C</b><input type="range" min="0" max="45" value={v.ta} onChange={set("ta")} /></label>
        <label className="f">Relative humidity: <b>{v.rh} %</b><input type="range" min="5" max="100" value={v.rh} onChange={set("rh")} /></label>
        <label className="f">Coefficient C (wind, site): <b>{v.c} mm/day per mm Hg</b><input type="range" min="0.1" max="1" step="0.02" value={v.c} onChange={set("c")} /></label>
        <div className="kpis"><Kpi v={f2(ew)} l="e_w (mm Hg)" /><Kpi v={f2(ea)} l="e_a (mm Hg)" /><Kpi v={f2(d)} l="Deficit e_w − e_a" tone={d < 0 ? "bad" : ""} /><Kpi v={f2(E) + " mm/d"} l={d < 0 ? "Condensation" : "Evaporation"} tone={d < 0 ? "bad" : "good"} /></div>
        {d < 0 && <p className="note" style={{ color: C.warn }}>e_a &gt; e_w: the air holds more vapour than the water surface can — net flux is downwards (dew / condensation), not evaporation.</p>}
      </div>
      <div className="wg-col">
        <Plot w={520} h={300} x={[0, 40]} y={[0, 60]} xLabel="Temperature (°C)" yLabel="Vapour pressure (mm Hg)">{(sx, sy) => <g>
          <path d={path(ts.map(t => [t, esMm(t)]), sx, sy)} fill="none" stroke={C.river} strokeWidth="2.5" />
          {v.ta <= 40 && <line x1={sx(v.ta)} x2={sx(v.ta)} y1={sy(Math.min(60, esMm(v.ta)))} y2={sy(ea)} stroke={C.gold} strokeDasharray="4 3" />}
          {v.tw <= 40 && <circle cx={sx(v.tw)} cy={sy(ew)} r="6" fill={C.river} />}
          {v.ta <= 40 && <circle cx={sx(v.ta)} cy={sy(ea)} r="6" fill={C.gold} />}
          {v.tw <= 40 && <text x={sx(v.tw) - 8} y={sy(ew) - 9} fontSize="11" textAnchor="end" fill={C.river}>water e_w</text>}
          {v.ta <= 40 && <text x={sx(v.ta) + 8} y={sy(ea) + 14} fontSize="11" fill="#8a6d1d">air e_a</text>}
        </g>}</Plot>
        <p className="note">The curve is the saturation vapour pressure. The water surface sits <i>on</i> the curve at its own temperature; the air sits below the curve at its own temperature, lowered by its relative humidity (dashed line). The difference in height between the two dots, e_w − e_a, drives evaporation.</p>
      </div>
    </div>
  </Box>;
}

/* ============ S01: India's rivers and basin water resources ============ */
// Average annual water resources potential by basin (BCM = km³). CWC, "Reassessment of Water Availability
// in India using Space Inputs" (2019), as given in PIB release 1705797 (2021). Total 1,999.20 BCM.
const BASIN19 = [
  ["Brahmaputra", 527.28, "#2a6f97"], ["Ganga", 509.52, "#c8973a"], ["WFR Tadri–Kanyakumari", 119.06, null], ["WFR Tapi–Tadri", 118.35, null],
  ["Godavari", 117.74, "#2d6a4f"], ["Krishna", 89.04, "#8a4b12"], ["Barak & others", 86.67, "#5a3e8c"], ["Mahanadi", 73.00, "#b5179e"],
  ["Narmada", 58.21, "#d1495b"], ["Indus", 45.53, "#00798c"], ["Brahmani-Baitarani", 35.65, "#6a994e"], ["Minor rivers to Myanmar & Bangladesh", 31.17, null],
  ["Cauvery", 27.67, "#e07a5f"], ["WFR Kutch & Saurashtra incl. Luni", 26.93, null], ["EFR Pennar–Kanyakumari", 26.74, "#3d405b"],
  ["EFR Mahanadi–Pennar", 26.41, null], ["Tapi", 26.24, "#9c6644"], ["Subarnarekha", 15.05, "#577590"], ["Mahi", 14.96, "#f3722c"],
  ["Sabarmati", 12.96, null], ["Pennar", 11.02, "#90be6d"],
];
const B_TOTAL = 1999.2;
function RiversLayer({ m }) {
  const [sel, setSel] = useState(null);
  const [hov, setHov] = useState(null);
  const [labels, setLabels] = useState(true);
  const col = Object.fromEntries(BASIN19.filter(b => b[2]).map(b => [b[0], b[2]]));
  const selB = BASIN19.find(b => b[0] === sel);
  const named = useMemo(() => { if (!m) return []; const seen = {}; return m.rivers.filter(r => r.r <= 7 && !seen[r.n] && (seen[r.n] = 1)); }, [m]);
  const mid = d => { const a = d.split(/[ML]/).filter(Boolean); const p = a[Math.floor(a.length * 0.62)].split(" ").map(Number); return p; };
  return (
    <div className="wg-row">
      <div className="wg-col" style={{ flex: "1 1 360px", position: "relative" }}>
        <svg viewBox={`-10 -10 ${m.w + 20} ${m.h + 20}`} style={{ background: "#eef5f8", borderRadius: 8, border: "1px solid #dfe8ec" }}>
          {m.outline.map((d, i) => <path key={i} d={d} fill="#fbf8f1" stroke="#8d8273" strokeWidth="0.9" strokeLinejoin="round" />)}
          {m.rivers.map((r, i) => { const on = !sel || r.b === sel; return <path key={i} d={r.d} fill="none" stroke={on ? (col[r.b] || "#4a8fb3") : "#c9d6dc"} strokeWidth={(sel && r.b === sel ? 2.6 : 1.4) + (9 - r.r) * 0.18} strokeLinecap="round" strokeLinejoin="round"
            onMouseEnter={() => setHov(r)} onMouseLeave={() => setHov(null)} onClick={() => setSel(sel === r.b ? null : r.b)} style={{ cursor: "pointer" }}><title>{r.n} — {r.b} basin</title></path>; })}
          {labels && named.filter(r => !sel || r.b === sel).map(r => { const [x, y] = mid(r.d); const end = x > m.w - 90; return <text key={r.n} x={end ? x - 3 : x + 3} y={y - 3} textAnchor={end ? "end" : "start"} fontSize="9.5" fill="#1a3260" stroke="#fbf8f1" strokeWidth="2.5" paintOrder="stroke" pointerEvents="none">{r.n}</text>; })}
          {m.cities.map(([n, x, y]) => <g key={n} pointerEvents="none"><circle cx={x} cy={y} r="3" fill="#0f1f3d" /><text x={x + 5} y={y + 3.5} fontSize="9.5" fontWeight="700" fill="#0f1f3d" stroke="#fbf8f1" strokeWidth="2.5" paintOrder="stroke">{n}</text></g>)}
        </svg>
        {hov && <div className="note" style={{ position: "absolute", left: 10, top: 8, background: "#fff", padding: "4px 8px", borderRadius: 6, boxShadow: "0 1px 4px rgba(0,0,0,.15)" }}><b>{hov.n}</b> · {hov.b} basin</div>}
        <label className="note" style={{ display: "flex", gap: 6, alignItems: "center" }}><input type="checkbox" checked={labels} onChange={e => setLabels(e.target.checked)} /> River names</label>
        <p className="note" style={{ fontSize: 11 }}>{m.credit} Rivers shown are the major ones only; basin boundaries are on the "States and river basins" layer.</p>
      </div>
      <div className="wg-col" style={{ flex: "1 1 300px" }}>
        {selB ? <div className="kpis"><Kpi v={selB[1].toFixed(1) + " km³"} l={selB[0] + " — average annual potential"} /><Kpi v={(selB[1] / B_TOTAL * 100).toFixed(1) + " %"} l="Share of India's total" tone="good" /></div>
          : <div className="kpis"><Kpi v="1,999 km³" l="India's average annual water resources potential" /><Kpi v="21" l="basins and basin groups (CWC)" /></div>}
        <p className="note" style={{ marginTop: 4 }}>Click a basin (or a river) to highlight it. Basins in grey have no major river on this map.</p>
        <div style={{ maxHeight: 430, overflow: "auto" }}>
          {BASIN19.map(([n, v, c]) => <div key={n} onClick={() => setSel(sel === n ? null : n)} style={{ cursor: "pointer", padding: "3px 4px", borderRadius: 4, background: sel === n ? "#fff6df" : null }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12.5 }}><span><span style={{ display: "inline-block", width: 10, height: 10, borderRadius: 2, background: c || "#c9c2b5", marginRight: 6 }} />{n}</span><b>{v.toFixed(1)}</b></div>
            <div style={{ height: 6, background: "#f0ebe2", borderRadius: 3 }}><div style={{ width: (v / 527.28 * 100) + "%", height: 6, borderRadius: 3, background: c || "#c9c2b5" }} /></div>
          </div>)}
        </div>
        <p className="note" style={{ fontSize: 11 }}>km³ = billion m³ (BCM). Source: CWC (2019), <i>Reassessment of Water Availability in India using Space Inputs</i>. WFR/EFR = west/east-flowing rivers.</p>
      </div>
    </div>
  );
}

/* ============ S01: Water atlas of India (layer switcher over the rivers map) ============ */
const ATLAS_CACHE = {};
function useAtlasLayer(name) {                       // each layer's JSON loads on first use, then stays cached
  const [d, setD] = useState(ATLAS_CACHE[name] || null);
  useEffect(() => {
    if (!name || ATLAS_CACHE[name]) { setD(name ? ATLAS_CACHE[name] : null); return; }
    let live = true;
    setD(null);
    fetch("data/atlas/" + name + ".json").then(r => r.json()).then(j => { ATLAS_CACHE[name] = j; if (live) setD(j); }).catch(() => { if (live) setD(false); });
    return () => { live = false; };
  }, [name]);
  return d;
}
const fmt = n => Math.round(n).toLocaleString("en-IN");
// Single-hue (blue) sequential classes, colour-blind safe. Upper bounds are in mm.
const RAIN_COLORS = ["#eff3ff", "#d6e6f5", "#b5d3ea", "#8dbbdc", "#639fcc", "#3f82bb", "#2564a2", "#124684", "#08306b"];
const RAIN_CLASSES = { annual: [300, 600, 900, 1200, 1600, 2000, 2800, 4000], jjas: [100, 250, 450, 700, 1000, 1400, 2000, 3000] };
const rainClass = (v, cl) => { let i = 0; while (i < cl.length && v >= cl[i]) i++; return i; };
const DAM_COLORS = ["#8a8f98", "#0072b2", "#d55e00", "#009e73"];       // type not stated, earthen, rockfill, other (Okabe–Ito)
const BASIN_TINTS = ["#dbe9f2", "#f1e4c9", "#d7ead9", "#ead9ee", "#f3d9d3", "#dcdff0", "#e8ecc9"];
const INK = { fill: "var(--text)" };
const SRC_STYLE = { fontSize: 12, color: "var(--text-muted)", marginTop: 8 };

function MapFrame({ m, children, label }) {
  const clip = "atlas-clip";
  return (
    <svg viewBox={`-10 -10 ${m.w + 20} ${m.h + 20}`} role="img" aria-label={label} style={{ background: "var(--river-tint)", borderRadius: 8, border: "1px solid var(--rule)", width: "100%", height: "auto" }}>
      <defs><clipPath id={clip}>{m.outline.map((d, i) => <path key={i} d={d} />)}</clipPath></defs>
      {m.outline.map((d, i) => <path key={i} d={d} style={{ fill: "var(--surface)" }} />)}
      {children(clip)}
      {m.outline.map((d, i) => <path key={"o" + i} d={d} fill="none" style={{ stroke: "var(--text-muted)" }} strokeWidth="0.9" strokeLinejoin="round" />)}
    </svg>
  );
}

function SourceLine({ d }) {
  return <p style={SRC_STYLE}>Source: {d.source}{d.api && d.api.version ? `. Service: ${d.api.name} ${d.api.version}, accessed ${d.built}` : ""}. Years: {d.years}. Licence: {d.licence}. Built {d.built}.</p>;
}

function StatesBasins({ m }) {
  const st = useAtlasLayer("states"), ba = useAtlasLayer("basins");
  const [showS, setShowS] = useState(true), [showB, setShowB] = useState(true);
  const [info, setInfo] = useState(null);
  if (st === false || ba === false) return <p>Layer data could not load.</p>;
  if (!st || !ba) return <p>Loading states and basins…</p>;
  const names = ba.basins.map(b => b.n);
  return (
    <div className="wg-row">
      <div className="wg-col" style={{ flex: "1 1 360px" }}>
        <MapFrame m={m} label="Map of India with state boundaries and river basins">{clip => <>
          {showB && <g clipPath={`url(#${clip})`}>{ba.basins.map((b, i) => <path key={b.n} d={b.d} fillOpacity="0.85" style={{ fill: BASIN_TINTS[i % BASIN_TINTS.length], stroke: "var(--river)", strokeWidth: 1.1 }} onMouseEnter={() => setInfo("Basin: " + b.n)} onClick={() => setInfo("Basin: " + b.n)} />)}</g>}
          {showS && <g>{st.states.map(s => <path key={s.n} d={s.d} fill={showB ? "none" : "transparent"} style={{ stroke: "var(--text)" }} strokeWidth="0.55" strokeDasharray={showB ? "2.2 1.6" : null} strokeLinejoin="round" onMouseEnter={() => setInfo("State: " + s.n)} onClick={() => setInfo("State: " + s.n)} pointerEvents={showB ? "none" : "all"} />)}</g>}
        </>}</MapFrame>
        <p className="note" aria-live="polite" style={{ minHeight: 22 }}>{info || "Hover or tap an area to read its name."}</p>
      </div>
      <div className="wg-col" style={{ flex: "1 1 280px" }}>
        <div className="kpis"><Kpi v={st.states.length} l="states and union territories" /><Kpi v={ba.basins.length} l="CWC river basins and basin groups" /></div>
        <fieldset style={{ border: 0, padding: 0, margin: "8px 0" }}><legend className="note">Show</legend>
          <label className="atlas-check"><input type="checkbox" checked={showB} onChange={e => setShowB(e.target.checked)} /> River basins (coloured areas, solid river-blue outline)</label>
          <label className="atlas-check"><input type="checkbox" checked={showS} onChange={e => setShowS(e.target.checked)} /> State boundaries (dashed dark lines)</label>
        </fieldset>
        <p className="note">States and basins are different lines: a basin follows the divide between drainage areas and crosses state borders, so most rivers flow through several states.</p>
        <p className="note" style={{ fontSize: 12 }}>Basins: {names.join(", ")}.</p>
        <SourceLine d={ba} /><SourceLine d={st} />
      </div>
    </div>
  );
}

function RainLayer({ m }) {
  const rf = useAtlasLayer("rainfall");
  const [mode, setMode] = useState("annual");
  const [info, setInfo] = useState(null);
  if (rf === false) return <p>Layer data could not load.</p>;
  if (!rf) return <p>Loading rainfall…</p>;
  const g = rf.grid, cl = RAIN_CLASSES[mode], vals = rf[mode];
  const sx = (lon) => (lon - 68) * Math.cos(22 * Math.PI / 180) * 20, sy = (lat) => (37.6 - lat) * 20;
  const w = g.step * Math.cos(22 * Math.PI / 180) * 20, h = g.step * 20;
  const lo = i => (i === 0 ? "0" : fmt(cl[i - 1])), hi = i => (i === cl.length ? null : fmt(cl[i]));
  const label = mode === "annual" ? "Mean annual rainfall" : "Mean June–September (monsoon) rainfall";
  const cells = [];
  for (let r = 0; r < g.ny; r++) for (let c = 0; c < g.nx; c++) {
    const v = vals[r * g.nx + c]; if (v < 0) continue;
    const lon = g.lon0 + c * g.step, lat = g.lat0 + r * g.step;
    cells.push(<rect key={r * g.nx + c} x={sx(lon)} y={sy(lat + g.step)} width={w + 0.3} height={h + 0.3} style={{ fill: RAIN_COLORS[rainClass(v, cl)] }}
      onMouseEnter={() => setInfo(`${label}: ${fmt(v)} mm (cell at ${(lat + g.step / 2).toFixed(2)}°N, ${(lon + g.step / 2).toFixed(2)}°E)`)} onClick={() => setInfo(`${label}: ${fmt(v)} mm (cell at ${(lat + g.step / 2).toFixed(2)}°N, ${(lon + g.step / 2).toFixed(2)}°E)`)} />);
  }
  return (
    <div className="wg-row">
      <div className="wg-col" style={{ flex: "1 1 360px" }}>
        <MapFrame m={m} label={label + " across India"}>{clip => <g clipPath={`url(#${clip})`}>{cells}</g>}</MapFrame>
        <p className="note" aria-live="polite" style={{ minHeight: 22 }}>{info || "Hover or tap a cell to read its rainfall."}</p>
      </div>
      <div className="wg-col" style={{ flex: "1 1 280px" }}>
        <fieldset style={{ border: 0, padding: 0, margin: "0 0 8px" }}><legend className="note">Rainfall period</legend>
          <div role="radiogroup" className="atlas-seg">
            {[["annual", "Annual"], ["jjas", "June–September"]].map(([k, t]) => <label key={k} className={"atlas-seg__opt" + (mode === k ? " is-on" : "")}><input type="radio" name="atlas-rain" value={k} checked={mode === k} onChange={() => setMode(k)} /> {t}</label>)}
          </div>
        </fieldset>
        <div className="atlas-legend" role="list" aria-label={label + " classes in millimetres"}>
          <div className="note"><b>{label}</b> (mm)</div>
          {RAIN_COLORS.map((c, i) => <div role="listitem" key={i} className="atlas-legend__row"><span className="atlas-legend__sw" style={{ background: c }} /> {hi(i) ? `${lo(i)} – ${hi(i)}` : `${lo(i)} and above`} mm</div>)}
        </div>
        <p className="note">India's rain is a monsoon rain: about {Math.round(100 * rf.jjas.filter((v, i) => v >= 0 && rf.annual[i] >= 0).reduce((s, v) => s + v, 0) / rf.annual.filter(v => v >= 0).reduce((s, v) => s + v, 0))} % of the annual total falls in June–September. Compare the two views.</p>
        <p className="note" style={{ fontSize: 12 }}>Each cell is 0.5° × 0.5° (about 55 km), the average of IMD's 0.25° grid cells and of {rf.years} (30 years).</p>
        <SourceLine d={rf} />
      </div>
    </div>
  );
}

function DamLayer({ m }) {
  const dm = useAtlasLayer("dams");
  const [minCap, setMinCap] = useState(0);
  const [info, setInfo] = useState(null);
  const pts = useMemo(() => {
    if (!dm) return [];
    const out = [];
    for (let i = 0; i < dm.name.length; i++) if (dm.cap[i] >= minCap || (minCap === 0)) out.push(i);
    return out;
  }, [dm, minCap]);
  if (dm === false) return <p>Layer data could not load.</p>;
  if (!dm) return <p>Loading dams…</p>;
  const radius = c => (c < 0 ? 1.1 : 1.1 + Math.sqrt(c) * 0.055);
  const text = i => {
    const t = dm.types[dm.ty[i]];
    return `${dm.name[i] || "Unnamed dam"} · ${dm.stateNames[dm.states[dm.st[i]]] || dm.states[dm.st[i]]} · river ${dm.rivers[dm.rv[i]] || "not stated"}, ${dm.basins[dm.ba[i]] || "basin not stated"} basin · ${t} · height ${dm.h[i] >= 0 ? dm.h[i] + " m" : "not stated"} · gross storage ${dm.cap[i] >= 0 ? fmt(dm.cap[i]) + " MCM" : "not stated"} · completed ${dm.yr[i] || "year not stated"}`;
  };
  const total = pts.reduce((s, i) => s + (dm.cap[i] > 0 ? dm.cap[i] : 0), 0);
  return (
    <div className="wg-row">
      <div className="wg-col" style={{ flex: "1 1 360px" }}>
        <MapFrame m={m} label="Map of large dams and reservoirs in India">{() => <g>{pts.map(i => <circle key={i} cx={dm.x[i]} cy={dm.y[i]} r={radius(dm.cap[i])} fillOpacity="0.62" style={{ fill: DAM_COLORS[dm.ty[i]], stroke: "var(--surface)", strokeWidth: 0.25 }} onMouseEnter={() => setInfo(text(i))} onClick={() => setInfo(text(i))} />)}</g>}</MapFrame>
        <p className="note" aria-live="polite" style={{ minHeight: 44 }}>{info || "Hover or tap a dot to read the dam's name, state, river, type, height, gross storage and year."}</p>
      </div>
      <div className="wg-col" style={{ flex: "1 1 280px" }}>
        <div className="kpis"><Kpi v={fmt(pts.length)} l="dams shown" /><Kpi v={(total / 1000).toFixed(0) + " km³"} l="total gross storage shown" /></div>
        <label className="note" htmlFor="atlas-mincap" style={{ display: "block", marginTop: 8 }}>Show dams with gross storage of at least</label>
        <select id="atlas-mincap" value={minCap} onChange={e => setMinCap(+e.target.value)} className="atlas-select">
          <option value={0}>Any size (all dams)</option><option value={10}>10 MCM</option><option value={100}>100 MCM</option><option value={1000}>1,000 MCM</option>
        </select>
        <div className="atlas-legend" role="list" aria-label="Dam type colours">
          <div className="note"><b>Colour: dam type</b></div>
          {dm.types.map((t, i) => <div role="listitem" key={t} className="atlas-legend__row"><span className="atlas-legend__sw atlas-legend__sw--dot" style={{ background: DAM_COLORS[i] }} /> {t}</div>)}
          <div className="note" style={{ marginTop: 6 }}><b>Size: gross storage</b> (MCM = million m³)</div>
          {[10, 100, 1000, 10000].map(c => <div role="listitem" key={c} className="atlas-legend__row"><svg width="22" height="22" aria-hidden="true"><circle cx="11" cy="11" r={Math.min(10.5, radius(c) * 1.7)} style={{ fill: "var(--text-muted)" }} fillOpacity="0.55" /></svg> {fmt(c)} MCM</div>)}
        </div>
        <p className="note" style={{ fontSize: 12 }}>{fmt(dm.plotted)} of {fmt(dm.total)} register entries have coordinates and are plotted ({dm.noCoordinates} without). {dm.capacityOutliers} entries list a storage above {fmt(dm.maxCapacityMCM)} MCM, more than the largest Indian reservoir, so their storage is shown as "not stated". Check any figure against CWC before quoting it.</p>
        <SourceLine d={dm} />
      </div>
    </div>
  );
}

// Reanalysis layers (NASA POWER / MERRA-2): rectangular cells of dlon x dlat degrees, one value per cell (-1 = no data).
const ET_COLORS = ["#fff5eb", "#fee6ce", "#fdd0a2", "#fdae6b", "#fd8d3c", "#f16913", "#d94801", "#a63603", "#7f2704"];   // single-hue (orange)
const ET_CLASSES = [200, 400, 600, 800, 1000, 1200, 1350, 1500];
const SM_COLORS = ["#f7fcf5", "#e5f5e0", "#c7e9c0", "#a1d99b", "#74c476", "#41ab5d", "#238b45", "#006d2c", "#00441b"];  // single-hue (green)
const SM_CLASSES = [0.15, 0.25, 0.35, 0.45, 0.55, 0.65, 0.75, 0.85];
function GridCells({ g, vals, classes, colors, textFor, setInfo }) {
  const k = Math.cos(22 * Math.PI / 180) * 20, w = g.dlon * k, h = g.dlat * 20, out = [];
  for (let r = 0; r < g.ny; r++) for (let c = 0; c < g.nx; c++) {
    const v = vals[r * g.nx + c]; if (v < 0) continue;
    const lon = g.lon0 + c * g.dlon, lat = g.lat0 + r * g.dlat, t = textFor(v, lat + g.dlat / 2, lon + g.dlon / 2);
    out.push(<rect key={r * g.nx + c} x={(lon - 68) * k} y={(37.6 - lat - g.dlat) * 20} width={w + 0.3} height={h + 0.3} style={{ fill: colors[rainClass(v, classes)] }} onMouseEnter={() => setInfo(t)} onClick={() => setInfo(t)} />);
  }
  return out;
}
function GridLegend({ title, classes, colors, fmtv, unit }) {
  const lo = i => (i === 0 ? fmtv(0) : fmtv(classes[i - 1])), hi = i => (i === classes.length ? null : fmtv(classes[i]));
  return (
    <div className="atlas-legend" role="list" aria-label={title + " classes"}>
      <div className="note"><b>{title}</b> ({unit})</div>
      {colors.map((c, i) => <div role="listitem" key={i} className="atlas-legend__row"><span className="atlas-legend__sw" style={{ background: c }} /> {hi(i) ? `${lo(i)} – ${hi(i)}` : `${lo(i)} and above`}</div>)}
    </div>
  );
}
const place = (lat, lon) => `cell at ${lat.toFixed(2)}°N, ${lon.toFixed(2)}°E`;

function EvapLayer({ m }) {
  const d = useAtlasLayer("evaporation");
  const [info, setInfo] = useState(null);
  if (d === false) return <p>Layer data could not load.</p>;
  if (!d) return <p>Loading evaporation…</p>;
  return (
    <div className="wg-row">
      <div className="wg-col" style={{ flex: "1 1 360px" }}>
        <MapFrame m={m} label="Annual land evaporation across India">{clip => <g clipPath={`url(#${clip})`}><GridCells g={d.grid} vals={d.annual} classes={ET_CLASSES} colors={ET_COLORS} setInfo={setInfo} textFor={(v, la, lo) => `Annual land evaporation: ${fmt(v)} mm per year (${place(la, lo)})`} /></g>}</MapFrame>
        <p className="note" aria-live="polite" style={{ minHeight: 22 }}>{info || "Hover or tap a cell to read its evaporation."}</p>
      </div>
      <div className="wg-col" style={{ flex: "1 1 280px" }}>
        <GridLegend title="Annual land evaporation" classes={ET_CLASSES} colors={ET_COLORS} fmtv={fmt} unit="mm per year" />
        <p className="note"><b>Reanalysis, not a measurement.</b> These values come from a weather-and-land model (NASA MERRA-2) that is constrained by observations; they are good for comparing regions, not for exact local totals. Evaporation here includes transpiration from land.</p>
        <p className="note" style={{ fontSize: 12 }}>Cells are about 0.5° × 0.625° (roughly 55 × 65 km). The map shows the daily mean times 365.</p>
        <SourceLine d={d} />
      </div>
    </div>
  );
}

function SoilLayer({ m }) {
  const d = useAtlasLayer("soilmoisture");
  const [mode, setMode] = useState("annual");
  const [info, setInfo] = useState(null);
  if (d === false) return <p>Layer data could not load.</p>;
  if (!d) return <p>Loading soil moisture…</p>;
  const names = { annual: "Annual mean", monsoon: "Monsoon (June–September)", dry: "Dry season (December–May)" };
  const f2 = v => v.toFixed(2);
  return (
    <div className="wg-row">
      <div className="wg-col" style={{ flex: "1 1 360px" }}>
        <MapFrame m={m} label={"Surface soil moisture across India, " + names[mode]}>{clip => <g clipPath={`url(#${clip})`}><GridCells g={d.grid} vals={d[mode]} classes={SM_CLASSES} colors={SM_COLORS} setInfo={setInfo} textFor={(v, la, lo) => `Surface soil wetness, ${names[mode].replace(/^./, c => c.toLowerCase())}: ${v.toFixed(2)} of saturation (${place(la, lo)})`} /></g>}</MapFrame>
        <p className="note" aria-live="polite" style={{ minHeight: 22 }}>{info || "Hover or tap a cell to read its soil wetness."}</p>
      </div>
      <div className="wg-col" style={{ flex: "1 1 280px" }}>
        <fieldset style={{ border: 0, padding: 0, margin: "0 0 8px" }}><legend className="note">Period</legend>
          <div role="radiogroup" className="atlas-seg">
            {Object.entries(names).map(([k, t]) => <label key={k} className={"atlas-seg__opt" + (mode === k ? " is-on" : "")}><input type="radio" name="atlas-soil" value={k} checked={mode === k} onChange={() => setMode(k)} /> {t}</label>)}
          </div>
        </fieldset>
        <GridLegend title="Surface soil wetness" classes={SM_CLASSES} colors={SM_COLORS} fmtv={f2} unit="fraction of saturation, 0 to 1" />
        <p className="note"><b>Reanalysis, not a measurement.</b> Soil wetness is the share of the soil's pore space that is filled (1 = saturated), for the top layer of a model (NASA MERRA-2). It is not volumetric water content in m³/m³; for that, see satellite products such as ISRO's EOS-04.</p>
        <p className="note" style={{ fontSize: 12 }}>Cells are about 0.5° × 0.625°. Compare the monsoon and dry-season views to see where the soil dries out.</p>
        <SourceLine d={d} />
      </div>
    </div>
  );
}

/* ============ S03: every registered rain gauge in India (India-WRIS register), by owner ============ */
const RG_COLORS = ["#d55e00", "#0072b2"];       // central and inter-state bodies, state departments (Okabe–Ito, colour-blind safe)
function GaugeMap() {
  const [m, setM] = useState(null);
  const rg = useAtlasLayer("raingauges"), st = useAtlasLayer("states");
  const [view, setView] = useState("agency");
  const [sel, setSel] = useState(null);
  const [info, setInfo] = useState(null);
  useEffect(() => { fetch("data/india_map.json").then(r => r.json()).then(setM).catch(() => setM(false)); }, []);
  if (m === false || rg === false) return <Box title="Rain gauges across India">Map data could not load.</Box>;
  if (!m || !rg) return <Box title="Rain gauges across India" kind="Interactive map">Loading…</Box>;
  const cat = [0, 1].map(c => rg.agencies.filter(a => a.cat === c).reduce((s, a) => s + a.count, 0));
  const rows = view === "agency"
    ? rg.agencies.map((a, i) => ({ k: i, n: a.n, c: a.count, sub: rg.cats[a.cat] }))
    : rg.states.map((s, i) => ({ k: i, n: s.n, c: s.count, sub: s.per1000km2 != null ? s.per1000km2.toFixed(1) + " per 1,000 km² (1 per " + fmt(1000 / s.per1000km2) + " km²)" : "" }));
  const max = Math.max(...rows.map(r => r.c));
  const keyOf = i => (view === "agency" ? rg.ag[i] : rg.st[i]);
  const shown = sel === null ? rg.plotted : rg.ag.filter((_, i) => keyOf(i) === sel).length;
  const text = i => `${rg.name[i] || "Unnamed station"} · ${rg.agencies[rg.ag[i]].n} · ${rg.district[i] ? rg.district[i] + ", " : ""}${rg.states[rg.st[i]].n}`;
  const selRow = sel === null ? null : rows.find(r => r.k === sel);
  const dens = rg.plotted / rg.areaKm2 * 1000;
  return (
    <Box title="Rain gauges across India" kind="Interactive map">
      <div className="wg-row">
        <div className="wg-col" style={{ flex: "1 1 360px" }}>
          <MapFrame m={m} label="Map of India showing the location of registered rain gauges">{() => <>
            {st && <g>{st.states.map(s => <path key={s.n} d={s.d} fill="none" style={{ stroke: "var(--rule)" }} strokeWidth="0.5" />)}</g>}
            <g>{rg.x.map((x, i) => { const on = sel === null || keyOf(i) === sel; return <circle key={i} cx={x} cy={rg.y[i]} r={on ? 1.15 : 0.7} fillOpacity={on ? 0.7 : 0.08} style={{ fill: RG_COLORS[rg.agencies[rg.ag[i]].cat] }} onMouseEnter={() => setInfo(text(i))} onClick={() => setInfo(text(i))} />; })}</g>
          </>}</MapFrame>
          <p className="note" aria-live="polite" style={{ minHeight: 44 }}>{info || "Hover or tap a dot to read the station's name, owner and district."}</p>
        </div>
        <div className="wg-col" style={{ flex: "1 1 300px" }}>
          <div className="kpis"><Kpi v={fmt(rg.plotted)} l="registered rain gauges plotted" /><Kpi v={rg.agencies.length} l="owning agencies" /><Kpi v={"1 per " + fmt(1000 / dens) + " km²"} l="average density (register only)" /></div>
          <div className="atlas-legend" role="list" aria-label="Who owns the gauges">
            {[0, 1].map(c => <div role="listitem" key={c} className="atlas-legend__row"><span className="atlas-legend__sw atlas-legend__sw--dot" style={{ background: RG_COLORS[c] }} /> {rg.cats[c]}: <b>{fmt(cat[c])}</b> ({Math.round(cat[c] / rg.plotted * 100)} %)</div>)}
          </div>
          <div role="radiogroup" className="atlas-seg" aria-label="Group the list by">
            {[["agency", "By owner"], ["state", "By state"]].map(([k, t]) => <label key={k} className={"atlas-seg__opt" + (view === k ? " is-on" : "")}><input type="radio" name="rg-view" value={k} checked={view === k} onChange={() => { setView(k); setSel(null); }} /> {t}</label>)}
          </div>
          <p className="note" style={{ margin: "8px 0 4px" }}>{sel === null ? "Select a row to show only its gauges on the map." : <>Showing <b>{fmt(shown)}</b> gauges of <b>{selRow.n}</b>. <button type="button" className="atlas-link" onClick={() => setSel(null)}>Show all</button></>}</p>
          <div className="atlas-list" role="list">
            {rows.map(r => <button type="button" role="listitem" key={r.k} className={"atlas-list__row" + (sel === r.k ? " is-on" : "")} aria-pressed={sel === r.k} onClick={() => setSel(sel === r.k ? null : r.k)}>
              <span className="atlas-list__name">{r.n}</span><b>{fmt(r.c)}</b>
              <span className="atlas-list__bar"><span style={{ width: (r.c / max * 100) + "%", background: view === "agency" ? RG_COLORS[rg.agencies[r.k].cat] : "var(--river)" }} /></span>
              {r.sub && <span className="atlas-list__sub">{r.sub}</span>}
            </button>)}
          </div>
        </div>
      </div>
      <p className="note" style={{ fontSize: 12.5, marginTop: 8 }}><b>What this is not.</b> This is the rainfall-station register on India-WRIS (central and state water agencies). It does not list IMD's own network, which the lecture slides put at about 1,367 automatic and 9,327 non-recording stations (no year given), and it will miss gauges run by universities, farms and others. Treat the counts as a lower bound, and the density as the registered density only. For comparison, IS 4987 asks for one gauge per 520 km² on plains and one per 130 km² in hilly regions with heavy rain. {fmt(rg.noCoordinates)} entries had unusable coordinates and are not plotted.</p>
      <SourceLine d={rg} />
    </Box>
  );
}

const ATLAS_LAYERS = [["rivers", "Rivers"], ["bounds", "States and river basins"], ["rain", "Rainfall"], ["evap", "Evaporation"], ["soil", "Soil moisture"], ["dams", "Dams and reservoirs"]];
function WaterAtlas() {
  const [m, setM] = useState(null);
  const [layer, setLayer] = useState("rivers");
  useEffect(() => { fetch("data/india_map.json").then(r => r.json()).then(setM).catch(() => setM(false)); }, []);
  const radios = useRef([]);
  const onKey = (e, j) => {
    const n = ATLAS_LAYERS.length; let k = null;
    if (e.key === "ArrowDown" || e.key === "ArrowRight") k = (j + 1) % n;
    if (e.key === "ArrowUp" || e.key === "ArrowLeft") k = (j - 1 + n) % n;
    if (k === null) return;
    e.preventDefault(); setLayer(ATLAS_LAYERS[k][0]); radios.current[k] && radios.current[k].focus();
  };
  return (
    <Box title="Water atlas of India" kind="Interactive map">
      <fieldset className="atlas-layers"><legend className="atlas-layers__legend">Map layer</legend>
        <div role="radiogroup" className="atlas-layers__group">
          {ATLAS_LAYERS.map(([k, t], j) => (
            <label key={k} className={"atlas-layers__opt" + (layer === k ? " is-on" : "")}>
              <input ref={el => (radios.current[j] = el)} type="radio" name="atlas-layer" value={k} checked={layer === k} onChange={() => setLayer(k)} onKeyDown={e => onKey(e, j)} /> {t}
            </label>
          ))}
        </div>
      </fieldset>
      {m === false ? <p>Map data could not load.</p> : !m ? <p>Loading map…</p> :
        layer === "rivers" ? <RiversLayer m={m} /> : layer === "bounds" ? <StatesBasins m={m} /> : layer === "rain" ? <RainLayer m={m} /> : layer === "evap" ? <EvapLayer m={m} /> : layer === "soil" ? <SoilLayer m={m} /> : <DamLayer m={m} />}
    </Box>
  );
}

/* ============ NEW WIDGETS S14 to S45 ============ */

/* S14: Crop ET & Irrigation Calculator */
export function CropEtCalc() {
  const [crop, setCrop] = useState("rice");
  const [et0, setEt0] = useState(5.0);
  const [pe, setPe] = useState(25.0);
  const crops = {
    rice: { name: "Paddy Rice", kc: [1.10, 1.15, 1.25, 0.95], days: [20, 30, 60, 30], amc: "Submerged" },
    wheat: { name: "Wheat", kc: [0.40, 0.75, 1.15, 0.45], days: [15, 25, 50, 30], amc: "Aerated" },
    cotton: { name: "Cotton", kc: [0.45, 0.75, 1.20, 0.70], days: [30, 50, 60, 40], amc: "Medium" },
    sugarcane: { name: "Sugarcane", kc: [0.50, 0.85, 1.25, 0.80], days: [35, 60, 180, 90], amc: "High" }
  };
  const c = crops[crop];
  const avgKc = mean(c.kc);
  const etcDaily = avgKc * et0;
  const monthEtc = etcDaily * 30;
  const nirMonth = Math.max(0, monthEtc - pe);
  const volPerHa = nirMonth * 10; // m3/ha

  return (
    <Box title="Crop ET & Irrigation Demand (FAO-56)" kind="Interactive calculator">
      <div className="wg-row">
        <div className="wg-col">
          <label className="f">Crop:
            <select value={crop} onChange={e => setCrop(e.target.value)} style={{ padding: "4px 8px", borderRadius: 4 }}>
              {Object.entries(crops).map(([k, v]) => <option key={k} value={k}>{v.name}</option>)}
            </select>
          </label>
          <label className="f">Reference ET0: <b>{f1(et0)} mm/day</b>
            <input type="range" min="2" max="9" step="0.1" value={et0} onChange={e => setEt0(+e.target.value)} />
          </label>
          <label className="f">Monthly Effective Rainfall (Pe): <b>{pe} mm</b>
            <input type="range" min="0" max="150" step="5" value={pe} onChange={e => setPe(+e.target.value)} />
          </label>
          <div className="kpi-grid" style={{ marginTop: 12 }}>
            <Kpi v={f2(avgKc)} l="Mean Kc" />
            <Kpi v={f1(etcDaily) + " mm"} l="Daily ETc" />
            <Kpi v={f1(nirMonth) + " mm"} l="Net Irrigation Req" tone="g" />
            <Kpi v={big(volPerHa) + " m³"} l="Water / ha / mo" tone="w" />
          </div>
        </div>
        <div className="wg-col">
          <svg viewBox="0 0 320 180" style={{ width: "100%", background: "#f8fafc", borderRadius: 6, border: "1px solid #e2e8f0" }}>
            <text x="10" y="20" fontSize="11" fill="#475569" fontWeight="bold">FAO-56 Stage Kc Curve ({c.name})</text>
            <path d="M 30 140 L 70 140 L 140 50 L 230 50 L 290 120" fill="none" stroke="#2563eb" strokeWidth="3" />
            <line x1="30" y1="150" x2="290" y2="150" stroke="#94a3b8" strokeWidth="1" />
            <text x="40" y="165" fontSize="9" fill="#64748b">Initial</text>
            <text x="90" y="165" fontSize="9" fill="#64748b">Dev</text>
            <text x="175" y="165" fontSize="9" fill="#64748b">Mid-Season</text>
            <text x="255" y="165" fontSize="9" fill="#64748b">Late</text>
            <circle cx="70" cy="140" r="4" fill="#2563eb" />
            <circle cx="140" cy="50" r="4" fill="#2563eb" />
            <circle cx="230" cy="50" r="4" fill="#2563eb" />
            <circle cx="290" cy="120" r="4" fill="#2563eb" />
            <text x="150" y="42" fontSize="10" fill="#1e40af" fontWeight="bold">Kc,max={c.kc[2]}</text>
            <text x="35" y="132" fontSize="9" fill="#64748b">Kc,ini={c.kc[0]}</text>
          </svg>
        </div>
      </div>
    </Box>
  );
}

/* S16: Flow Duration Curve Explorer */
export function FdcExplorer() {
  const [type, setType] = useState("perennial");
  const [p, setP] = useState(75);
  // Analytical FDC functions
  const getQ = (pct, t) => {
    if (t === "perennial") {
      return 120 * Math.exp(-0.028 * pct) + 5; // m3/s
    } else {
      return Math.max(0, 240 * Math.exp(-0.065 * pct) - 2);
    }
  };
  const qAtP = getQ(p, type);
  const q10 = getQ(10, type), q50 = getQ(50, type), q75 = getQ(75, type), q90 = getQ(90, type);

  // Generate curve points
  const pts = [];
  for (let x = 0; x <= 100; x += 2) {
    const qval = getQ(x, type);
    const px = 40 + (x / 100) * 260;
    const py = 150 - (qval / 130) * 120;
    pts.push(`${px},${Math.max(25, py)}`);
  }

  return (
    <Box title="Flow Duration Curve (FDC) Analyzer" kind="Interactive hydrology">
      <div className="wg-row">
        <div className="wg-col">
          <div style={{ marginBottom: 10 }}>
            <Seg value={type} onChange={setType} options={[["perennial", "Perennial (e.g. Cauvery)"], ["ephemeral", "Seasonal / Ephemeral"]]} />
          </div>
          <label className="f">Exceedance Probability (p): <b>{p}%</b>
            <input type="range" min="1" max="99" value={p} onChange={e => setP(+e.target.value)} />
          </label>
          <div className="kpi-grid" style={{ marginTop: 12 }}>
            <Kpi v={f1(qAtP) + " m³/s"} l={`Discharge at Q${p}`} tone="w" />
            <Kpi v={f1(q50) + " m³/s"} l="Q50 (Median Flow)" />
            <Kpi v={f1(q75) + " m³/s"} l="Q75 (Irrigation Dependable)" tone="g" />
            <Kpi v={f1(q90) + " m³/s"} l="Q90 (Environmental Baseflow)" tone={q90 < 1 ? "b" : ""} />
          </div>
        </div>
        <div className="wg-col">
          <svg viewBox="0 0 320 180" style={{ width: "100%", background: "#f8fafc", borderRadius: 6, border: "1px solid #e2e8f0" }}>
            <text x="10" y="18" fontSize="10" fill="#475569" fontWeight="bold">Flow Duration Curve (Discharge vs % Time Exceeded)</text>
            <line x1="40" y1="150" x2="300" y2="150" stroke="#64748b" strokeWidth="1" />
            <line x1="40" y1="25" x2="40" y2="150" stroke="#64748b" strokeWidth="1" />
            <text x="35" y="165" fontSize="8" fill="#64748b">0%</text>
            <text x="160" y="165" fontSize="8" fill="#64748b">50%</text>
            <text x="290" y="165" fontSize="8" fill="#64748b">100%</text>
            <text x="8" y="35" fontSize="8" fill="#64748b">Q (m³/s)</text>
            <polyline fill="none" stroke="#0284c7" strokeWidth="2.5" points={pts.join(" ")} />
            {/* Marker */}
            <circle cx={40 + (p / 100) * 260} cy={Math.max(25, 150 - (qAtP / 130) * 120)} r="5" fill="#ef4444" />
            <line x1={40 + (p / 100) * 260} y1="150" x2={40 + (p / 100) * 260} y2={Math.max(25, 150 - (qAtP / 130) * 120)} stroke="#ef4444" strokeDasharray="2,2" />
          </svg>
        </div>
      </div>
    </Box>
  );
}

/* S20: Interactive Baseflow Separator */
export function BaseflowTool() {
  const [method, setMethod] = useState("n");
  const [area, setArea] = useState(450); // km2
  const N = +(0.83 * Math.pow(area, 0.2)).toFixed(2); // days
  const nHours = +(N * 24).toFixed(0);

  // Storm flood hydrograph coordinates
  const totalOrds = [15, 22, 60, 145, 220, 180, 120, 75, 45, 28, 20, 16];
  const tVals = [0, 6, 12, 18, 24, 30, 36, 42, 48, 54, 60, 66]; // hours
  const peakIdx = 4; // 24h
  const baseOrds = totalOrds.map((q, idx) => {
    if (method === "straight") {
      return 15;
    } else if (method === "n") {
      if (idx <= peakIdx) return 15 + (idx / peakIdx) * 5;
      const endIdx = Math.min(totalOrds.length - 1, peakIdx + Math.round(nHours / 6));
      if (idx <= endIdx) {
        return 20 + ((idx - peakIdx) / (endIdx - peakIdx)) * 5;
      }
      return 15;
    } else {
      // Variable slope
      if (idx <= peakIdx) return 15 + (idx / peakIdx) * 12;
      return Math.max(15, 27 - (idx - peakIdx) * 2.5);
    }
  });

  const drhOrds = totalOrds.map((q, i) => Math.max(0, q - baseOrds[i]));
  const sumDrh = sum(drhOrds);
  const drhVolMcm = +((sumDrh * 6 * 3600) / 1e6).toFixed(3);
  const reCm = +((drhVolMcm * 1e6) / (area * 1e6) * 100).toFixed(2);

  return (
    <Box title="Hydrograph Baseflow Separation Tool" kind="Interactive analysis">
      <div className="wg-row">
        <div className="wg-col">
          <div style={{ marginBottom: 10 }}>
            <Seg value={method} onChange={setMethod} options={[["straight", "Straight line"], ["n", "Fixed base (N = 0.83 A^0.2)"], ["variable", "Variable slope"]]} />
          </div>
          <label className="f">Catchment Area: <b>{area} km²</b>
            <input type="range" min="50" max="1000" step="25" value={area} onChange={e => setArea(+e.target.value)} />
          </label>
          <div className="kpi-grid" style={{ marginTop: 12 }}>
            <Kpi v={N + " days"} l={`Linsley Base N (${nHours}h)`} />
            <Kpi v={drhVolMcm + " MCM"} l="Direct Runoff Vol (Vd)" tone="g" />
            <Kpi v={reCm + " cm"} l="Excess Rain Depth (R)" tone="w" />
            <Kpi v={totalOrds[peakIdx] + " m³/s"} l="Peak Flood Flow (Qp)" />
          </div>
        </div>
        <div className="wg-col">
          <svg viewBox="0 0 320 180" style={{ width: "100%", background: "#f8fafc", borderRadius: 6, border: "1px solid #e2e8f0" }}>
            <text x="10" y="16" fontSize="10" fill="#475569" fontWeight="bold">Flood Hydrograph & Separated Baseflow</text>
            <path d={`M 30 150 ` + totalOrds.map((q, i) => `L ${30 + i * 23} ${150 - (q / 230) * 125}`).join(" ") + ` L 283 150 Z`} fill="#bfdbfe" opacity="0.6" />
            <path d={`M 30 150 ` + baseOrds.map((b, i) => `L ${30 + i * 23} ${150 - (b / 230) * 125}`).join(" ") + ` L 283 150 Z`} fill="#d97706" opacity="0.5" />
            <polyline fill="none" stroke="#2563eb" strokeWidth="2.5" points={totalOrds.map((q, i) => `${30 + i * 23},${150 - (q / 230) * 125}`).join(" ")} />
            <polyline fill="none" stroke="#b45309" strokeWidth="2" strokeDasharray="3,3" points={baseOrds.map((b, i) => `${30 + i * 23},${150 - (b / 230) * 125}`).join(" ")} />
            <line x1="30" y1="150" x2="290" y2="150" stroke="#64748b" strokeWidth="1" />
            <text x="120" y="70" fontSize="11" fill="#1d4ed8" fontWeight="bold">Direct Runoff (DRH)</text>
            <text x="120" y="140" fontSize="10" fill="#92400e" fontWeight="bold">Baseflow</text>
          </svg>
        </div>
      </div>
    </Box>
  );
}

/* S22: Discrete Convolution Matrix Machine */
export function ConvolutionMatrix() {
  const [p1, setP1] = useState(2.0); // cm
  const [p2, setP2] = useState(3.5);
  const [p3, setP3] = useState(1.5);

  const uh = [0, 12, 35, 25, 12, 5, 0]; // 1-cm UH ordinates
  const m = uh.length;
  // Compute convolution
  const qComposite = new Array(m + 2).fill(0);
  for (let i = 0; i < m; i++) {
    qComposite[i] += p1 * uh[i];
    qComposite[i + 1] += p2 * uh[i];
    qComposite[i + 2] += p3 * uh[i];
  }
  const peakFlow = Math.max(...qComposite);

  return (
    <Box title="Discrete Hydrograph Convolution Machine" kind="Interactive matrix">
      <div className="wg-row">
        <div className="wg-col">
          <label className="f">Period 1 Rain Excess (P1): <b>{f1(p1)} cm</b>
            <input type="range" min="0" max="6" step="0.5" value={p1} onChange={e => setP1(+e.target.value)} />
          </label>
          <label className="f">Period 2 Rain Excess (P2): <b>{f1(p2)} cm</b>
            <input type="range" min="0" max="6" step="0.5" value={p2} onChange={e => setP2(+e.target.value)} />
          </label>
          <label className="f">Period 3 Rain Excess (P3): <b>{f1(p3)} cm</b>
            <input type="range" min="0" max="6" step="0.5" value={p3} onChange={e => setP3(+e.target.value)} />
          </label>
          <div className="kpi-grid" style={{ marginTop: 12 }}>
            <Kpi v={f1(p1 + p2 + p3) + " cm"} l="Total Rainfall Excess" />
            <Kpi v={f1(peakFlow) + " m³/s"} l="Composite Peak Discharge" tone="w" />
          </div>
        </div>
        <div className="wg-col">
          <svg viewBox="0 0 320 180" style={{ width: "100%", background: "#f8fafc", borderRadius: 6, border: "1px solid #e2e8f0" }}>
            <text x="10" y="16" fontSize="10" fill="#475569" fontWeight="bold">Lagged Components & Combined DRH</text>
            {/* Component 1 */}
            <polyline fill="none" stroke="#93c5fd" strokeWidth="1.5" strokeDasharray="3,3" points={uh.map((u, i) => `${30 + i * 28},${150 - (u * p1 / 200) * 125}`).join(" ")} />
            {/* Component 2 */}
            <polyline fill="none" stroke="#86efac" strokeWidth="1.5" strokeDasharray="3,3" points={uh.map((u, i) => `${30 + (i + 1) * 28},${150 - (u * p2 / 200) * 125}`).join(" ")} />
            {/* Component 3 */}
            <polyline fill="none" stroke="#fca5a5" strokeWidth="1.5" strokeDasharray="3,3" points={uh.map((u, i) => `${30 + (i + 2) * 28},${150 - (u * p3 / 200) * 125}`).join(" ")} />
            {/* Combined */}
            <polyline fill="none" stroke="#1e3a8a" strokeWidth="3" points={qComposite.map((q, i) => `${30 + i * 28},${150 - (q / 200) * 125}`).join(" ")} />
            <line x1="30" y1="150" x2="290" y2="150" stroke="#64748b" strokeWidth="1" />
            <text x="150" y="35" fontSize="11" fill="#1e3a8a" fontWeight="bold">Composite Flood DRH</text>
          </svg>
        </div>
      </div>
    </Box>
  );
}

/* S24: Snyder's Synthetic Unit Hydrograph Generator */
export function SnyderSynth() {
  const [L, setL] = useState(35); // km
  const [Lca, setLca] = useState(18); // km
  const [area, setArea] = useState(520); // km2
  const [Ct, setCt] = useState(1.5);
  const [Cp, setCp] = useState(0.65);

  const tp = +(Ct * Math.pow(L * Lca, 0.3)).toFixed(2); // hours
  const tr = +(tp / 5.5).toFixed(2);
  const qp = +((2.78 * Cp * area) / tp).toFixed(1);
  const tb = +(3 + 3 * (tp / 24) * 24).toFixed(1);
  const w50 = +(5.87 / Math.pow(qp / area, 1.08)).toFixed(1);
  const w75 = +(w50 / 1.75).toFixed(1);

  return (
    <Box title="Snyder's Synthetic Unit Hydrograph" kind="Interactive design">
      <div className="wg-row">
        <div className="wg-col">
          <label className="f">Stream Length (L): <b>{L} km</b>
            <input type="range" min="10" max="80" value={L} onChange={e => setL(+e.target.value)} />
          </label>
          <label className="f">Centroid Distance (Lca): <b>{Lca} km</b>
            <input type="range" min="5" max={Math.min(50, L)} value={Lca} onChange={e => setLca(+e.target.value)} />
          </label>
          <label className="f">Catchment Area: <b>{area} km²</b>
            <input type="range" min="100" max="1000" step="20" value={area} onChange={e => setArea(+e.target.value)} />
          </label>
          <div className="kpi-grid" style={{ marginTop: 12 }}>
            <Kpi v={tp + " h"} l="Basin Lag (tp)" />
            <Kpi v={tr + " h"} l="Std Duration (tr)" />
            <Kpi v={qp + " m³/s"} l="Peak Discharge (Qp)" tone="w" />
            <Kpi v={w50 + " h"} l="W50 Width" tone="g" />
          </div>
        </div>
        <div className="wg-col">
          <svg viewBox="0 0 320 180" style={{ width: "100%", background: "#f8fafc", borderRadius: 6, border: "1px solid #e2e8f0" }}>
            <text x="10" y="18" fontSize="10" fill="#475569" fontWeight="bold">Synthetic UH with W50 and W75 Widths</text>
            <path d={`M 30 150 Q ${30 + tp * 6} 30, ${Math.min(290, 30 + tp * 14)} 150 Z`} fill="#dbeafe" stroke="#2563eb" strokeWidth="2.5" />
            {/* W50 Line */}
            <line x1={30 + tp * 6 - w50 * 2.5} y1="90" x2={30 + tp * 6 + w50 * 2.5} y2="90" stroke="#dc2626" strokeWidth="2" strokeDasharray="2,2" />
            <text x={30 + tp * 6 + 10} y="85" fontSize="9" fill="#dc2626">W50 = {w50}h</text>
            {/* W75 Line */}
            <line x1={30 + tp * 6 - w75 * 2} y1="60" x2={30 + tp * 6 + w75 * 2} y2="60" stroke="#7c3aed" strokeWidth="2" strokeDasharray="2,2" />
            <text x={30 + tp * 6 + 10} y="55" fontSize="9" fill="#7c3aed">W75 = {w75}h</text>
            <line x1="30" y1="150" x2="290" y2="150" stroke="#64748b" strokeWidth="1" />
          </svg>
        </div>
      </div>
    </Box>
  );
}

/* S31: Stage-Discharge Rating Curve Fitter */
export function RatingCurveLab() {
  const [a, setA] = useState(1.20); // stage of zero flow (true is 1.20)
  // True equation: Q = 18.5 * (G - 1.20)^1.75
  const obs = [
    { G: 1.80, Q: 8.5 },
    { G: 2.50, Q: 29.8 },
    { G: 3.20, Q: 64.2 },
    { G: 4.00, Q: 118.5 },
    { G: 4.80, Q: 188.0 },
    { G: 5.50, Q: 260.4 }
  ];

  // Fit linear regression on ln(Q) vs ln(G - a)
  let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0;
  const n = obs.length;
  const valid = obs.every(o => o.G > a);
  let slope = 0, intercept = 0, r2 = 0;

  if (valid) {
    const pts = obs.map(o => ({ x: Math.log(o.G - a), y: Math.log(o.Q) }));
    pts.forEach(p => {
      sumX += p.x; sumY += p.y; sumXY += p.x * p.y; sumX2 += p.x * p.x;
    });
    slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    intercept = (sumY - slope * sumX) / n;
    r2 = +(Math.abs(n * sumXY - sumX * sumY) / Math.sqrt((n * sumX2 - sumX * sumX) * 1.5)).toFixed(3);
  }

  const Cr = valid ? Math.exp(intercept).toFixed(2) : "–";
  const bExp = valid ? slope.toFixed(2) : "–";
  const shape = a < 1.15 ? "Concave Downward (a too low)" : a > 1.25 ? "Concave Upward (a too high)" : "Optimal Straight Line (a = 1.20m)";
  const tone = a >= 1.15 && a <= 1.25 ? "g" : "w";

  return (
    <Box title="Rating Curve Stage-of-Zero-Flow (SZF) Finder" kind="Log-log calibration">
      <div className="wg-row">
        <div className="wg-col">
          <label className="f">Assumed Zero-Flow Stage (a): <b>{f2(a)} m</b>
            <input type="range" min="0.5" max="1.6" step="0.05" value={a} onChange={e => setA(+e.target.value)} />
          </label>
          <div style={{ margin: "8px 0", fontSize: 13, fontWeight: "bold", color: a >= 1.15 && a <= 1.25 ? "#16a34a" : "#d97706" }}>
            Log-Log Shape: {shape}
          </div>
          <div className="kpi-grid" style={{ marginTop: 12 }}>
            <Kpi v={Cr} l="Rating Coeff (Cr)" />
            <Kpi v={bExp} l="Exponent (b)" />
            <Kpi v={`Q = ${Cr}(G - ${f2(a)})^${bExp}`} l="Calibrated Formula" tone={tone} />
          </div>
        </div>
        <div className="wg-col">
          <svg viewBox="0 0 320 180" style={{ width: "100%", background: "#f8fafc", borderRadius: 6, border: "1px solid #e2e8f0" }}>
            <text x="10" y="18" fontSize="10" fill="#475569" fontWeight="bold">Log-Log Plot: ln(Q) vs ln(G - a)</text>
            <line x1="40" y1="150" x2="300" y2="150" stroke="#64748b" strokeWidth="1" />
            <line x1="40" y1="25" x2="40" y2="150" stroke="#64748b" strokeWidth="1" />
            <text x="250" y="165" fontSize="9" fill="#64748b">ln(G - a)</text>
            <text x="8" y="35" fontSize="9" fill="#64748b">ln(Q)</text>
            {valid && obs.map((o, idx) => {
              const lx = Math.log(o.G - a);
              const ly = Math.log(o.Q);
              const px = 40 + ((lx + 1.5) / 3.0) * 250;
              const py = 150 - ((ly - 1.5) / 4.5) * 120;
              return <circle key={idx} cx={px} cy={py} r="4.5" fill="#2563eb" />;
            })}
          </svg>
        </div>
      </div>
    </Box>
  );
}

/* S32: Loop Rating Curve Hysteresis Animator */
export function LoopRating() {
  const [dhdt, setDhdt] = useState(0.15); // m/h
  const [s0, setS0] = useState(0.001);
  const [c, setC] = useState(2.0); // m/s
  const qn = 220; // m3/s steady rating

  const dhdtMs = dhdt / 3600;
  const term = dhdtMs / (s0 * c);
  const corrFactor = Math.sqrt(Math.max(0.01, 1 + term));
  const qActual = +(qn * corrFactor).toFixed(1);
  const diffPct = +(((qActual - qn) / qn) * 100).toFixed(2);

  return (
    <Box title="Jones Formula Loop Rating Curve (Hysteresis)" kind="Unsteady flow">
      <div className="wg-row">
        <div className="wg-col">
          <label className="f">Rate of Stage Change (dh/dt): <b>{dhdt > 0 ? "+" : ""}{f2(dhdt)} m/h</b>
            <input type="range" min="-0.30" max="0.30" step="0.02" value={dhdt} onChange={e => setDhdt(+e.target.value)} />
          </label>
          <label className="f">Longitudinal Bed Slope (S0): <b>{s0}</b>
            <input type="range" min="0.0005" max="0.003" step="0.0005" value={s0} onChange={e => setS0(+e.target.value)} />
          </label>
          <div className="kpi-grid" style={{ marginTop: 12 }}>
            <Kpi v={qn + " m³/s"} l="Steady Rating Flow (Qn)" />
            <Kpi v={qActual + " m³/s"} l="Actual Unsteady Flow (Q)" tone="w" />
            <Kpi v={(diffPct > 0 ? "+" : "") + diffPct + "%"} l="Hysteresis Shift" tone={diffPct > 0 ? "g" : "b"} />
          </div>
        </div>
        <div className="wg-col">
          <svg viewBox="0 0 320 180" style={{ width: "100%", background: "#f8fafc", borderRadius: 6, border: "1px solid #e2e8f0" }}>
            <text x="10" y="18" fontSize="10" fill="#475569" fontWeight="bold">Stage vs Discharge Hysteresis Loop</text>
            {/* Steady curve */}
            <path d="M 40 145 C 100 120, 180 80, 280 30" fill="none" stroke="#64748b" strokeWidth="2" strokeDasharray="3,3" />
            {/* Rising loop branch */}
            <path d="M 40 145 C 115 110, 205 65, 280 30" fill="none" stroke="#2563eb" strokeWidth="2.5" />
            {/* Falling loop branch */}
            <path d="M 40 145 C 85 130, 155 95, 280 30" fill="none" stroke="#d97706" strokeWidth="2.5" />
            <line x1="40" y1="150" x2="300" y2="150" stroke="#94a3b8" strokeWidth="1" />
            <text x="180" y="55" fontSize="9" fill="#2563eb" fontWeight="bold">Rising Limb (dh/dt &gt; 0)</text>
            <text x="110" y="125" fontSize="9" fill="#d97706" fontWeight="bold">Falling Limb (dh/dt &lt; 0)</text>
            <circle cx={40 + (qActual / 260) * 240} cy="70" r="5" fill="#ef4444" />
          </svg>
        </div>
      </div>
    </Box>
  );
}

/* S35: Gumbel Extreme Value Probability Workbench */
export function GumbelBench() {
  const [meanQ, setMeanQ] = useState(420);
  const [sdQ, setSdQ] = useState(115);
  const [T, setT] = useState(100);

  const yn = 0.5362;
  const sn = 1.1124;
  const yT = -Math.log(-Math.log(1 - 1 / T));
  const KT = (yT - yn) / sn;
  const xT = +(meanQ + KT * sdQ).toFixed(1);
  const se = (sn * sdQ / Math.sqrt(30));
  const xUpper = +(xT + 1.96 * se).toFixed(1);
  const xLower = +(xT - 1.96 * se).toFixed(1);

  return (
    <Box title="Gumbel Extreme Value (EV-I) Frequency Workbench" kind="Statistical hydrology">
      <div className="wg-row">
        <div className="wg-col">
          <label className="f">Target Return Period (T): <b>{T} years</b>
            <input type="range" min="5" max="200" step="5" value={T} onChange={e => setT(+e.target.value)} />
          </label>
          <label className="f">Mean Annual Flood (x̄): <b>{meanQ} m³/s</b>
            <input type="range" min="100" max="1000" step="20" value={meanQ} onChange={e => setMeanQ(+e.target.value)} />
          </label>
          <label className="f">Standard Deviation (s): <b>{sdQ} m³/s</b>
            <input type="range" min="20" max="300" step="10" value={sdQ} onChange={e => setSdQ(+e.target.value)} />
          </label>
          <div className="kpi-grid" style={{ marginTop: 12 }}>
            <Kpi v={f2(KT)} l={`Freq Factor K${T}`} />
            <Kpi v={xT + " m³/s"} l={`Design Flood (x${T})`} tone="w" />
            <Kpi v={`${xLower} – ${xUpper}`} l="95% Confidence Interval" tone="g" />
          </div>
        </div>
        <div className="wg-col">
          <svg viewBox="0 0 320 180" style={{ width: "100%", background: "#f8fafc", borderRadius: 6, border: "1px solid #e2e8f0" }}>
            <text x="10" y="18" fontSize="10" fill="#475569" fontWeight="bold">Gumbel Probability Paper (xT vs yT)</text>
            <line x1="40" y1="150" x2="300" y2="150" stroke="#64748b" strokeWidth="1" />
            <line x1="40" y1="25" x2="40" y2="150" stroke="#64748b" strokeWidth="1" />
            <text x="250" y="165" fontSize="9" fill="#64748b">Reduced yT</text>
            {/* Fitted Line */}
            <line x1="50" y1="135" x2="290" y2="35" stroke="#2563eb" strokeWidth="2.5" />
            {/* Confidence Bands */}
            <line x1="50" y1="125" x2="290" y2="20" stroke="#93c5fd" strokeWidth="1.5" strokeDasharray="3,3" />
            <line x1="50" y1="145" x2="290" y2="50" stroke="#93c5fd" strokeWidth="1.5" strokeDasharray="3,3" />
            <circle cx={40 + (yT / 6.0) * 250} cy={Math.max(25, 150 - (xT / 1100) * 125)} r="5" fill="#ef4444" />
            <text x="50" y="30" fontSize="9" fill="#2563eb" fontWeight="bold">xT = x̄ + KT * s</text>
          </svg>
        </div>
      </div>
    </Box>
  );
}

/* S38: Virtual Darcy Permeameter & Seepage Velocity */
export function DarcyTube() {
  const [soil, setSoil] = useState("sand");
  const [dh, setDh] = useState(40); // cm
  const [L, setL] = useState(50); // cm

  const soils = {
    gravel: { name: "Coarse Gravel", K: 150, ne: 0.32 },
    sand: { name: "Medium Sand", K: 25, ne: 0.25 },
    silt: { name: "Silty Sand", K: 3.5, ne: 0.38 },
    clay: { name: "Clayey Silt", K: 0.15, ne: 0.45 }
  };
  const s = soils[soil];
  const i = +(dh / L).toFixed(3);
  const vDarcian = +(s.K * i).toFixed(2); // m/day
  const vSeepage = +(vDarcian / s.ne).toFixed(2); // m/day

  return (
    <Box title="Virtual Darcy Permeameter & Seepage Flow" kind="Experimental lab">
      <div className="wg-row">
        <div className="wg-col">
          <label className="f">Porous Soil Media:
            <select value={soil} onChange={e => setSoil(e.target.value)} style={{ padding: "4px 8px", borderRadius: 4 }}>
              {Object.entries(soils).map(([k, v]) => <option key={k} value={k}>{v.name} (K={v.K} m/d)</option>)}
            </select>
          </label>
          <label className="f">Head Difference (Δh): <b>{dh} cm</b>
            <input type="range" min="5" max="80" value={dh} onChange={e => setDh(+e.target.value)} />
          </label>
          <label className="f">Column Length (L): <b>{L} cm</b>
            <input type="range" min="20" max="100" value={L} onChange={e => setL(+e.target.value)} />
          </label>
          <div className="kpi-grid" style={{ marginTop: 12 }}>
            <Kpi v={i} l="Hydraulic Gradient (i = Δh/L)" />
            <Kpi v={vDarcian + " m/d"} l="Discharge Velocity (v)" />
            <Kpi v={vSeepage + " m/d"} l="Actual Seepage Velocity (vs)" tone="w" />
          </div>
        </div>
        <div className="wg-col">
          <svg viewBox="0 0 320 180" style={{ width: "100%", background: "#f8fafc", borderRadius: 6, border: "1px solid #e2e8f0" }}>
            <text x="10" y="18" fontSize="10" fill="#475569" fontWeight="bold">Soil Column Permeameter</text>
            {/* Manometers */}
            <rect x="50" y="40" width="10" height="90" fill="none" stroke="#475569" strokeWidth="1.5" />
            <rect x="50" y={130 - (dh * 0.9)} width="10" height={dh * 0.9} fill="#93c5fd" />
            <rect x="230" y="80" width="10" height="50" fill="none" stroke="#475569" strokeWidth="1.5" />
            <rect x="230" y="100" width="10" height="30" fill="#93c5fd" />
            {/* Soil Cylinder */}
            <rect x="40" y="130" width="220" height="35" fill="#fde68a" stroke="#d97706" strokeWidth="2" />
            <text x="110" y="152" fontSize="11" fill="#92400e" fontWeight="bold">{s.name}</text>
            <text x="75" y="35" fontSize="9" fill="#0369a1">Δh = {dh} cm</text>
            <line x1="60" y1="40" x2="230" y2="40" stroke="#0284c7" strokeDasharray="2,2" />
          </svg>
        </div>
      </div>
    </Box>
  );
}

/* S45: Campus Rooftop RWH & Tank Sizing Workbench */
export function RwhDesigner() {
  const [area, setArea] = useState(450); // m2
  const [coeff, setCoeff] = useState(0.85); // RCC
  const [rain, setRain] = useState(920); // mm/year
  const [storm, setStorm] = useState(40); // mm design storm

  const dFlush = 1.5; // mm
  const effStorm = Math.max(0, storm - dFlush);
  const annualVolM3 = +((coeff * (rain / 1000) * area)).toFixed(1);
  const tankVolM3 = +((coeff * (effStorm / 1000) * area)).toFixed(1);
  const tankLiters = Math.round(tankVolM3 * 1000);
  const trenchLenM = +((tankVolM3 / (1.0 * 1.5 * 0.40))).toFixed(1); // gravel porosity 40%

  return (
    <Box title="Campus Rooftop Rainwater Harvesting Workbench" kind="Urban sustainability">
      <div className="wg-row">
        <div className="wg-col">
          <label className="f">Rooftop Catchment Area: <b>{area} m²</b>
            <input type="range" min="100" max="1500" step="50" value={area} onChange={e => setArea(+e.target.value)} />
          </label>
          <label className="f">Runoff Coefficient (C): <b>{coeff}</b>
            <select value={coeff} onChange={e => setCoeff(+e.target.value)} style={{ padding: "4px 8px", borderRadius: 4, marginLeft: 8 }}>
              <option value="0.90">GI Metal Sheets (C = 0.90)</option>
              <option value="0.85">RCC Flat Roof (C = 0.85)</option>
              <option value="0.75">Clay Tiles (C = 0.75)</option>
            </select>
          </label>
          <label className="f">Design Storm Depth: <b>{storm} mm</b>
            <input type="range" min="20" max="80" step="5" value={storm} onChange={e => setStorm(+e.target.value)} />
          </label>
          <div className="kpi-grid" style={{ marginTop: 12 }}>
            <Kpi v={annualVolM3 + " m³"} l="Annual Harvest Potential" tone="w" />
            <Kpi v={big(tankLiters) + " L"} l="Design Sump Capacity" tone="g" />
            <Kpi v={trenchLenM + " m"} l="CGWB Recharge Trench Length" />
          </div>
        </div>
        <div className="wg-col">
          <svg viewBox="0 0 320 180" style={{ width: "100%", background: "#f8fafc", borderRadius: 6, border: "1px solid #e2e8f0" }}>
            <text x="10" y="18" fontSize="10" fill="#475569" fontWeight="bold">RWH System Schematic</text>
            {/* Building Roof */}
            <polygon points="30,80 140,50 140,90 30,120" fill="#cbd5e1" stroke="#475569" strokeWidth="1.5" />
            <text x="50" y="90" fontSize="9" fill="#1e293b" fontWeight="bold">Roof ({area}m²)</text>
            {/* First Flush */}
            <rect x="160" y="95" width="15" height="40" fill="#fed7aa" stroke="#ea580c" />
            <text x="145" y="150" fontSize="8" fill="#ea580c">First Flush</text>
            {/* Storage Sump */}
            <rect x="200" y="100" width="55" height="45" rx="3" fill="#bfdbfe" stroke="#2563eb" strokeWidth="2" />
            <text x="206" y="125" fontSize="9" fill="#1e40af" fontWeight="bold">{big(tankLiters)}L</text>
            <text x="210" y="160" fontSize="8" fill="#2563eb">Storage Sump</text>
            {/* Recharge Trench */}
            <rect x="270" y="115" width="40" height="30" fill="#fef08a" stroke="#ca8a04" strokeDasharray="2,2" />
            <text x="272" y="160" fontSize="8" fill="#a16207">Recharge</text>
          </svg>
        </div>
      </div>
    </Box>
  );
}

export const WIDGETS = {
  cropetcalc: CropEtCalc,
  "cropet-calc": CropEtCalc,
  fdcexplorer: FdcExplorer,
  "fdc-explorer": FdcExplorer,
  baseflowtool: BaseflowTool,
  "baseflow-tool": BaseflowTool,
  convolutionmatrix: ConvolutionMatrix,
  "convolution-matrix": ConvolutionMatrix,
  snydersynth: SnyderSynth,
  "snyder-synth": SnyderSynth,
  ratingcurvelab: RatingCurveLab,
  "rating-curve-lab": RatingCurveLab,
  looprating: LoopRating,
  "loop-rating": LoopRating,
  gumbelbench: GumbelBench,
  "gumbel-bench": GumbelBench,
  darcytube: DarcyTube,
  "darcy-tube": DarcyTube,
  rwhdesigner: RwhDesigner,
  "rwh-designer": RwhDesigner,

  gaugemap: GaugeMap,
  indiamap: WaterAtlas,
  wateratlas: WaterAtlas,
  abstractions: Abstractions,
  dalton: Dalton,
  ...ILLOS,
  waterbudget: WaterBudget,
  globalwater: GlobalWater,
  precip: PrecipExplorer,
  tipping: TippingBucket,
  network: GaugeNetwork,
  dmc: DoubleMass,
  thiessen: Thiessen,
  missing: MissingData,
  storm: StormExplorer,
  movavg: MovingAverage,
  risk: RiskCalc,
  idf: WeibullIDF,
  d8: D8,
  hortonfit: HortonFit,
  phiindex: PhiIndex,
  scscn: ScsCn,
  pencalc: PenCalc
};
